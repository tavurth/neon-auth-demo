import { NextResponse } from "next/server";
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
		{ status: 500 },
	);
}
