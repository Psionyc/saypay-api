import Elysia, { t } from "elysia";

export const PaymentsSchema = new Elysia().model({
	"payments.request": t.Object({
		amount: t.Number(),
	}),

	"payments.send": t.Object({
		amount: t.Number(),
		accountNumber: t.String(),
		bankCode: t.String(),
	}),

	"payments.response": t.Object({
		message: t.String(),
		result: t.Optional(t.String()),
	}),
});
