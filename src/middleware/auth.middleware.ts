import Elysia, { t } from "elysia";
import { JWTProvider } from "../providers/jwt.provider";
import { User } from "../models/User";

export const AuthMiddleware = new Elysia()
	.use(JWTProvider)
	.guard({
		as: "scoped",
		headers: t.Object({
			authorization: t.String(),
		}),
	})
	.derive({ as: "scoped" }, async ({ headers, jwt, status }) => {
		const token = headers.authorization?.split(" ")[1];

		const isValid = jwt.verify(token);

		if (!isValid) {
			return status(401, {
				message: "Unauthorized",
			});
		}

		const user = await User.findOne({
			_id: (isValid as unknown as { userId: string }).userId,
		});

		if (!user) {
			return status(401, {
				message: "Unauthorized",
			});
		}

		return {
			user,
		};
	});
