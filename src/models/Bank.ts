import { type Static, t } from "elysia";
import { MongooseSchema } from "./_helpers";
import { Schema, model } from "mongoose";

export const TBank = MongooseSchema({
	name: t.String(),
	code: t.String(),
	recipientCode: t.String(),
});

export type IBank = Static<typeof TBank>;

export const BankSchema = new Schema<IBank>(
	{
		name: String,
		code: String,
		recipientCode: String,
	},
	{ timestamps: true },
);

export const Bank = model("Bank", BankSchema);
