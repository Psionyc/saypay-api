import { t, type Static } from "elysia";
import { MongooseSchema } from "./_helpers";
import mongoose from "mongoose";

export const TUser = MongooseSchema({
	username: t.String(),
	//bs58 public keys associated with this account
	pubkey: t.String(),
});

export type IUser = Static<typeof TUser>;

export const UserSchema = new mongoose.Schema<IUser>(
	{
		username: String,
		pubkey: String,
	},
	{
		timestamps: true,
	},
);

export const User = mongoose.model<IUser>("User", UserSchema);
