import "./db";
import { Elysia } from "elysia";
import { AIRoutes } from "./routes/ai.routes";
import logixlysia from "logixlysia";
import { PaymentsRoutes } from "./routes/payments.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { swagger } from "@elysiajs/swagger";

const app = new Elysia()
	.use(logixlysia())
	.use(
		swagger({
			documentation: {
				info: {
					title: "SayPay API",
					description: "SayPay API",
					version: "1.0.0",
				},
			},
		}),
	)
	.onError(({ error }) => {
		console.log(error);
	})
	.use(AIRoutes)
	.use(PaymentsRoutes)
	.use(AuthRoutes)
	.get("/", () => "Hello Elysia")
	.listen(3000);
