import type { Schema } from "mongoose";
import { t, type TSchema } from "elysia";

/**
 * Elysia-compatible schema type for MongoDB ObjectId
 * Used for type-safe MongoDB ObjectId handling in Elysia routes
 */
export const ObjectIdSchema = t.Unsafe<Schema.Types.ObjectId>(t.Any());

export type TPropertyKey = string | number;
export type TProperties = Record<TPropertyKey, TSchema>;

export function MongooseSchema<P extends TProperties>(properties: P) {
	return t.Object({
		_id: t.Optional(t.Readonly(ObjectIdSchema)),
		id: t.Optional(t.Readonly(ObjectIdSchema)),
		createdAt: t.Optional(t.Date()),
		updatedAt: t.Optional(t.Date()),
		...properties,
	});
}
