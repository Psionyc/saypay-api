import Elysia, { t } from "elysia";
import crypto from "node:crypto";
import { PAYSTACK_SECRET_KEY } from "../config";
import { match } from "ts-pattern";
import { WebhooksSchema } from "../shcemas/webhook.schema";
import { User } from "../models/User";

enum PaystackEvents {
	CHARGE_SUCCESS = "charge.success",
}

interface PaystackWebhook<T> {
	event: string;
	data: T;
}

export type PaystackChargeSuccessWebhook = PaystackWebhook<{
	amount: number;
	currency: string;
	customer: {
		email: string;
	};
}>;

export const WebhooksRouter = new Elysia({ prefix: "/webhooks" })
	.use(WebhooksSchema)
	.guard({
		as: "scoped",
		headers: t.Object({
			"x-paystack-signature": t.Optional(t.String()),
		}),
	})
	.onBeforeHandle(async ({ headers, body, status }) => {
		const signature = headers["x-paystack-signature"];
		const hash = crypto
			.createHmac("sha512", PAYSTACK_SECRET_KEY)
			.update(JSON.stringify(body))
			.digest("hex");

		if (signature !== hash) {
			throw new Error("Invalid signature");
		}
	})
	.post(
		"/paystack",
		async ({ body, status }) => {
			const result = await match(body.event as PaystackEvents)
				.with(PaystackEvents.CHARGE_SUCCESS, async () => {
					const { data } = body.data as PaystackChargeSuccessWebhook;
					const user = await User.findOne({ email: data.customer.email });
					if (!user) {
						return status("OK");
					}

					user.balance += data.amount / 100;
					await user.save();
				})
				.otherwise(() => {
					console.log("Unknown event");
					return status("OK");
				});

			return result;
		},
		{
			body: "webhooks.paystack",
		},
	);

//Paystack Webhooks
