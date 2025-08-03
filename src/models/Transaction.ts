import { type Static, t } from "elysia";
import { MongooseSchema, ObjectIdSchema } from "./_helpers";
import mongoose from "mongoose";

export enum TransactionType {
	FUND = "fund",
	INVEST = "invest",
	WITHDRAW = "withdraw",
}

export const TTransaction = MongooseSchema({
	pubkey: t.String(),
	amount: t.Number(),
	propertyId: ObjectIdSchema,
	propertyNum: t.String(),
	type: t.Enum(TransactionType),
    txHash: t.String(),
});

export const TTransactions = t.Array(t.Partial(TTransaction));

export type ITransaction = Static<typeof TTransaction>;
export type ITransactions = Static<typeof TTransactions>;

export const TransactionSchema = new mongoose.Schema<ITransaction>(
	{
		pubkey: String,
		amount: {
			type: Number,
		},
		type: { type: String, enum: TransactionType },
        propertyId: String,
        propertyNum: Number,
        txHash: String
	},
	{ timestamps: true },
);

export const Transaction = mongoose.model<ITransaction>(
	"Transaction",
	TransactionSchema,
);
