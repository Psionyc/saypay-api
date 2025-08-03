import "./db";
import { Elysia, file } from "elysia";
import logixlysia from "logixlysia";
import { swagger } from "@elysiajs/swagger";
import { UserRoutes } from "./routes/user.routes";
import { PropertyRoutes } from "./routes/property.routes";
import { AIRoutes } from "./routes/ai.routes";
import { TransactionRoutes } from "./routes/transaction.routes";
import { DataRoutes } from "./routes/data.routes";

export const app = new Elysia()
	.use(logixlysia())
	.use(swagger({}))
	.onError(({ error }) => {
		throw error;
	})
	.use(UserRoutes)
	.use(PropertyRoutes)
	.use(TransactionRoutes)
	.use(DataRoutes)
	.use(AIRoutes)
	.get("/", () => "Hello Elysia")
	.get("/favicon.ico", () => file("public/favicon.png"))
	.listen(3000);

export type App = typeof app;
