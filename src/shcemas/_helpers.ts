import { t } from "elysia";

export function SuccesResponse<T>() {
	return t.Object({
		result: t.Unsafe<T>(),
		message: t.String(),
	});
}

export function ErrorReponse() {
	return t.Object({
		message: t.String(),
	});
}
