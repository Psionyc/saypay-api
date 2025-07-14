import Elysia, { t } from "elysia";

export const WebhooksSchema = new Elysia().model({
	"webhooks.paystack": t.Object({
		event: t.String(),
		data: t.Record(t.String(), t.Any()),
	}),
});
