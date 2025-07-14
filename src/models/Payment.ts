import { type Static, t } from "elysia";
import { MongooseSchema, ObjectIdSchema } from "./_helpers";
import { model, Schema } from "mongoose";

export const TPayment = MongooseSchema({
	payer: ObjectIdSchema,
	amount: t.Number(),
	bank: ObjectIdSchema,
});

export type IPayment = Static<typeof TPayment>;

export const PaymentSchema = new Schema<IPayment>(
	{
		payer: { type: Schema.Types.ObjectId, ref: "User" },

		amount: Number,
		bank: { type: Schema.Types.ObjectId, ref: "Bank" },
	},
	{ timestamps: true },
);

export const Payment = model("Payment", PaymentSchema);
