import { t, type TSchema } from "elysia";

export enum ResponseStatus {
	SUCCESS = "SUCCESS",
	ERROR = "ERROR",
}

export function TResponse<T extends TSchema>(value: T) {
	return t.Object({
		status: t.Enum(ResponseStatus),
		result: t.Optional(value),
		message: t.String(),
	});
}

export function SuccessResponse<T>(
	result: T,
	extras?: {
		message?: string;
	},
) {
	return {
		status: ResponseStatus.SUCCESS,
		result,
		message: extras?.message ?? "Your request was successful",
	};
}

export function ErrorResponse(extras?: { message?: string }) {
	return {
		status: ResponseStatus.ERROR,
		result: undefined,
		message: extras?.message ?? "Your request was successful",
	};
}
