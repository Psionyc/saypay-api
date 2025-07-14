import Elysia, { t } from "elysia";
import { paystackClient } from "../lib/paystack.client";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { PaymentsSchema } from "../shcemas/payments.schema";
import { Bank } from "../models/Bank";
import { Payment } from "../models/Payment";

export const PaymentsRoutes = new Elysia({
	prefix: "/payments",
})
	.use(AuthMiddleware)
	.use(PaymentsSchema)
	.post(
		"/request",
		async ({ user, body, set }) => {
			const { data, error } = await paystackClient.POST(
				"/transaction/initialize",
				{
					body: {
						amount: body.amount * 100,
						email: user.email,
					},
				},
			);

			if (error) {
				set.status = 500;
				return {
					message: "Failed to create a link",
				};
			}

			return {
				result: data?.data.authorization_url,
				message: "Successfully created a link",
			};
		},
		{
			body: "payments.request",
			response: {
				200: "payments.response",
			},
		},
	)
	.post(
		"/send",
		async ({ user, body, set }) => {
			let bank = await Bank.findOne({
				code: body.bankCode,
				accountNumber: body.accountNumber,
			});

			if (!bank) {
				const { data: resolveData, error: resolveError } =
					await paystackClient.GET("/bank/resolve", {
						query: {
							account_number: body.accountNumber,
							bank_code: body.bankCode,
						},
					});

				if (
					resolveError ||
					resolveData?.status === false ||
					!resolveData?.data
				) {
					set.status = 500;

					return {
						message: "Failed to resolve bank",
					};
				}

				const { data: recipientData, error: recipientError } =
					await paystackClient.POST("/transferrecipient", {
						body: {
							name: resolveData?.data.account_name,
							bank_code: body.bankCode,
							account_number: body.accountNumber,
							type: "nuban",
							currency: "NGN",
						},
					});

				bank = await Bank.create({
					name: resolveData?.data.account_name,
					code: body.bankCode,
					recipientCode: recipientData?.data.recipient_code,
				});
			}

			const { data: transferData, error: transferError } =
				await paystackClient.POST("/transfer", {
					body: {
						source: "balance",
						amount: (body.amount * 100).toString(),
						currency: "NGN",
						recipient: bank.recipientCode,
						reason: `${user.name} sent ${body.amount} to ${body.accountNumber} via ${body.bankCode}`,
					},
				});

			if (transferError) {
				set.status = 500;
				return {
					message: "Failed to transfer",
				};
			}

			await Payment.create({
				payer: user._id,
				payee: bank._id,
				amount: body.amount,
				bank: bank._id,
			});

			user.balance -= body.amount;
			await user.save();

			return {
				message: "Successfully sent",
			};
		},
		{
			body: "payments.send",
			response: {
				200: "payments.response",
			},
		},
	);
