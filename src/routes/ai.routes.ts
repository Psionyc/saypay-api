import Elysia, { t } from "elysia";
import { Property } from "../models/Property";
import { CacheProvider } from "../providers/cache.provider";
import { ErrorResponse, SuccessResponse, TResponse } from "../shcemas/_helpers";
import { chain } from "../lib/ai";

export const AIRoutes = new Elysia({
	name: "AIRoutes",
	prefix: "/ai",
})
	.use(CacheProvider)
	.post(
		"/:propertyId",
		async ({ body, params: { propertyId }, propertyCache, set }) => {
			const property =
				propertyCache.get(propertyId) || (await Property.findById(propertyId));

			if (!property) {
				set.status = 404;
				return ErrorResponse({ message: "Property not found" });
			}

			const { message, previousMessages } = body;


			const result = await chain.invoke({
				propertyData: property,
				chat_history: previousMessages,
				question: message,
			});

			return SuccessResponse(result);
		},
		{
			body: t.Object({
				message: t.String(),
				previousMessages: t.Array(
					t.Object({
						role: t.String(),
						content: t.String(),
					}),
				),
			}),
			response: TResponse(t.String()),
		},
	);
