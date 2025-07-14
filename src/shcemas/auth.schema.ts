import Elysia, { t } from "elysia";
import { TUser } from "../models/User";

export const AuthSchema = new Elysia().model({
	"auth.login": t.Object({
		email: t.String({ format: "email" }),
		password: t.String(),
	}),

	"auth.register": t.Object({
		name: t.String(),
		email: t.String({ format: "email" }),
		password: t.String(),
	}),

	"auth.enroll": t.Object({
		voice: t.File({
			type: "audio/*",
		}),
	}),

	"auth.response": t.Object({
		message: t.String(),
		token: t.String(),
		user: t.Omit(TUser, ["_id"]),
	}),
});
