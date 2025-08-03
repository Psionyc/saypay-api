import { type IProperty, Property } from "../models/Property";
import { propertyCache } from "../providers/cache.provider";

export async function useProperty(id: string): Promise<IProperty | null> {
	const cachedProperty = propertyCache.get(id);
	if (cachedProperty) return cachedProperty;

	const property = await Property.findById(id);

	if (!property) return null;
	const result = property.toJSON();
	propertyCache.set(id, result);
	return result;
}
