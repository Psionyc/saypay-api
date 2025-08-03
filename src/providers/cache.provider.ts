import Elysia from "elysia";
import { LRUCache } from "lru-cache";
import type { IProperty } from "../models/Property";

export const propertiesCache = new LRUCache<"all", IProperty[]>({
	max: 1000,
	ttl: 1000 * 60 * 60,
});

export const propertyCache = new LRUCache<string, IProperty>({
	max: 1000,
	ttl: 1000 * 60 * 60,
});

export const priceCache = new LRUCache<string, number>({
	max: 1000,
	ttl: 1000 * 60 * 1,
});

export const CacheProvider = new Elysia({ name: "CacheProvider" }).decorate({
	propertiesCache,
	propertyCache,
	priceCache,
});
