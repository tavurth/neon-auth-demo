import { NextResponse } from "next/server";
import { HTTP_INTERNAL_SERVER_ERROR } from "@/constants";
import { AppError } from "@/lib/shared/errors";

export function handleError(error: unknown): NextResponse {
	if (error instanceof AppError) {
		return NextResponse.json(
			{ error: error.message, code: error.code },
			{ status: error.statusCode },
		);
	}

	return NextResponse.json(
		{ error: "Internal server error", code: "INTERNAL_ERROR" },
		{ status: HTTP_INTERNAL_SERVER_ERROR },
	);
}
