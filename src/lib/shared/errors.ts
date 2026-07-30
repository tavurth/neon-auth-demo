export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code: string = "INTERNAL_ERROR",
	) {
		super(message);
		this.name = "AppError";
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string, id?: string) {
		const msg = id
			? `${resource} with id ${id} not found`
			: `${resource} not found`;
		super(msg, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class UnauthorizedError extends AppError {
	constructor(message = "Unauthorized") {
		super(message, 401, "UNAUTHORIZED");
		this.name = "UnauthorizedError";
	}
}

export class ValidationError extends AppError {
	constructor(message: string) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "ValidationError";
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409, "CONFLICT");
		this.name = "ConflictError";
	}
}
