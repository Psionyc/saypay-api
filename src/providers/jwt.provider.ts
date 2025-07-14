import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { JWT_SECRET } from "../config";

export const JWTProvider = new Elysia().use(
	jwt({
		secret: JWT_SECRET,
		exp: "24h",
	}),
);
