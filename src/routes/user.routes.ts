import Elysia, { t } from "elysia";
import { TUser, User } from "../models/User";
import { ErrorResponse, SuccessResponse, TResponse } from "../shcemas/_helpers";
import { isValidObjectId } from "mongoose";

export const UserRoutes = new Elysia({
	name: "UserRoutes",
	prefix: "/user",
})
	.post(
		"/",
		async ({ body }) => {
			const user = await User.create(body);
			return SuccessResponse(user);
		},
		{
			response: TResponse(TUser),
			body: TUser,
		},
	)
	//Identifier can be a username, userId, or pubkey
	.get(
		"/:identifier",
		async ({ params: { identifier } }) => {
			const user = await User.findOne({
				$or: [
					{ username: identifier },
					{ _id: isValidObjectId(identifier) ? identifier : undefined },
					{ pubkey: identifier },
				],
			});

			if (!user) return ErrorResponse({ message: "User not found" });

			return SuccessResponse(user);
		},
		{
			response: TResponse(TUser),
		},
	).patch(
		"/:identifier",
		async ({ params: { identifier }, body }) => {
			const user = await User.findOneAndUpdate({
				$or: [
					{ username: identifier },
					{ _id: isValidObjectId(identifier) ? identifier : undefined },
					{ pubkey: identifier },
				],
			}, body);

			if (!user) return ErrorResponse({ message: "User not found" });

			user.username = body.username ?? user.username;
			

			await user.save();

			return SuccessResponse(user);
		},
		{
			response: TResponse(TUser),
			body: t.Partial(TUser),
		},
	)
