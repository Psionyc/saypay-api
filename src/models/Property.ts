import { type Static, t } from "elysia";
import { MongooseSchema } from "./_helpers";
import mongoose from "mongoose";

export const TProperty = MongooseSchema({
	name: t.String(),
	stars: t.Number(),
	price: t.Number(),
	amountRaised: t.Number({ default: 0 }),

	description: t.String(),
	location: t.String(),
	latlng: t.Object({
		lat: t.Number(),
		lng: t.Number(),
	}),
	number: t.Number(),
	images: t.Array(t.String({ format: "uri" })),
	features: t.Array(t.String()),
	specs: t.Array(
		t.Object({
			key: t.String(),
			value: t.String(),
		}),
	),
	expansionPlans: t.Array(
		t.Object({
			phase: t.Number(),
			amount: t.Number(),
			roi: t.Number(),
			description: t.String(),
		}),
	),
});

export const TProperties = t.Array(t.Partial(TProperty));

export type IProperty = Static<typeof TProperty>;
export type IProperties = Static<typeof TProperties>;

export const PropertySchema = new mongoose.Schema<IProperty>(
	{
		name: String,
		stars: Number,
		price: Number,
		description: String,
		location: String,
		latlng: {
			lat: Number,
			lng: Number,
		},
		amountRaised: {
			type: Number,
			default: 0,
		},
		number: {
			type: Number,
			default: 0,
		},
		images: [String],
		features: [String],
		specs: [
			{
				key: String,
				value: String,
			},
		],
		expansionPlans: {
			type: [
				{
					phase: Number,
					amount: Number,
					roi: Number,
					description: String,
				},
			],
			default: [
				{
					phase: 1,
					amount: 500,
					roi: 10,
					description: "",
				},
			],
		},
	},
	{
		timestamps: true,
	},
);

export const Property = mongoose.model<IProperty>("Property", PropertySchema);
