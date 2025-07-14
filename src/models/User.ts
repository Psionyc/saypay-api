import { type Static, t } from "elysia";
import { MongooseSchema } from "./_helpers";
import { Schema, model } from "mongoose";

export const TUser = MongooseSchema({
	name: t.String(),
	email: t.String(),
	password: t.String(),
	balance: t.Number(),
	pitch: t.Number(),
});

export type IUser = Static<typeof TUser>;

export const UserSchema = new Schema<IUser>(
	{
		name: String,
		email: String,
		password: String,
		balance: Number,
		pitch: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

export const User = model("User", UserSchema);
