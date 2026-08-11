import {
	HTTP_BAD_REQUEST,
	HTTP_CONFLICT,
	HTTP_INTERNAL_SERVER_ERROR,
	HTTP_NOT_FOUND,
	HTTP_UNAUTHORIZED,
} from "@/constants";

export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = HTTP_INTERNAL_SERVER_ERROR,
		public code: string = "INTERNAL_ERROR",
	) {
		super(message);
		this.name = "AppError";
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string, id?: string) {
		const msg = id ? `${resource} with id ${id} not found` : `${resource} not found`;
		super(msg, HTTP_NOT_FOUND, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, HTTP_UNAUTHORIZED, "UNAUTHORIZED");
		this.name = "UnauthorizedError";
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, HTTP_BAD_REQUEST, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, HTTP_CONFLICT, "CONFLICT");
		this.name = "ConflictError";
	}
}
