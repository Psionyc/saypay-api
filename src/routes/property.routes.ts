import Elysia from "elysia";
import { Property, TProperties, TProperty } from "../models/Property";
import { ErrorResponse, SuccessResponse, TResponse } from "../shcemas/_helpers";
import { CacheProvider } from "../providers/cache.provider";
import { useProperty } from "../hooks/useProperty";

export const PropertyRoutes = new Elysia({
	name: "PropertyRoutes",
	prefix: "/property",
})
	.use(CacheProvider)
	.get(
		"/",
		async ({ propertiesCache }) => {
			const cachedProperties = propertiesCache.get("all");
			if (cachedProperties) return SuccessResponse(cachedProperties);

			const properties = await Property.find().select(
				"name stars price location images _id amountRaised",
			);

			const result = properties.map((p) => p.toJSON());
			propertiesCache.set("all", result);

			return SuccessResponse(result);
		},
		{
			response: TResponse(TProperties),
		},
	)
	.get(
		"/:id",
		async ({ params, set }) => {
			const property = await useProperty(params.id);

			if (property == null) {
				set.status = 404;
				return ErrorResponse({
					message: "Failed to find property",
				});
			}

			return SuccessResponse(property);
		},
		{
			response: TResponse(TProperty),
		},
	)
	.post(
		"/",
		async ({ body, propertiesCache }) => {
			const properties = await Property.create(body);
			propertiesCache.clear();
			const result = properties.map((p) => p.toJSON());

			return SuccessResponse(result);
		},
		{
			response: TResponse(TProperties),
			body: TProperties,
		},
	)
	.get("/user/:pubkey", async ({ params: { pubkey } }) => {
		return SuccessResponse(
			(
				await Property.find({
					pubkey,
				})
			).map((p) => p.toJSON()),
		);
	});
