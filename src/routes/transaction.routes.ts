import Elysia, { t } from "elysia";
import {
	Transaction,
	TransactionType,
	TTransaction,
	TTransactions,
} from "../models/Transaction";
import { ErrorResponse, SuccessResponse, TResponse } from "../shcemas/_helpers";
import { useProperty } from "../hooks/useProperty";

export const TransactionRoutes = new Elysia({
	name: "TransactionRoutes",
	prefix: "/transaction",
})
	.get(
		"/user/:pubkey",
		async ({ params: { pubkey } }) => {
			return SuccessResponse(
				(
					await Transaction.find({
						pubkey,
					})
				).map((t) => t.toJSON()),
			);
		},
		{
			response: TResponse(TTransactions),
		},
	)
    .get("/property/:id", async ({params: {id}}) => {
        return SuccessResponse(
            (
                await Transaction.find({
                    propertyId: id,
                })
            ).map((t) => t.toJSON()),
        );
    }, {
        response: TResponse(TTransactions),
    })
	.post(
		"/fund/:propertyId",
		async ({ body, params: { propertyId }, set }) => {
			const property = await useProperty(propertyId);

			if (property == null) {
				set.status = 404;
				return ErrorResponse({
					message: "Failed to find property",
				});
			}

			const { pubkey, amount } = body;
			const transaction = await Transaction.create({
				propertyId: property.id,
				propertyNum: property.number,
				type: TransactionType.FUND,
				txHash: pubkey,
				amount,
			});

			return SuccessResponse(transaction);
		},
		{
			body: t.Object({
				pubkey: t.String(),
				amount: t.Number({ exclusiveMinimum: 0 }),
				txHash: t.String({ minLength: 25 }),
			}),
			response: TResponse(TTransaction),
		},
	);
