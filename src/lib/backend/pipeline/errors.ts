import { NextResponse } from "next/server";
import { isDevelopment } from "@/backend/env";
import { HTTP_INTERNAL_SERVER_ERROR } from "@/constants";
import { AppError } from "@/lib/shared/errors";

function extractLocations(stack: string | undefined): string[] | undefined {
	if (!stack) return undefined;
	const locations: string[] = [];
	for (const line of stack.split("\n")) {
		const decoded = decodeURIComponent(line).trim();
		if (decoded.includes("node_modules")) continue;
		if (decoded.includes("next-server")) continue;
		if (decoded.includes("next/dist")) continue;
		if (decoded.includes("scheduler.development")) continue;
		if (decoded.includes("react-dom-client")) continue;
		if (!decoded.includes("/src/")) continue;
		const match = decoded.match(/\/src\/(?:app|lib)\/(.+?\.ts).*?:(\d+)/);
		if (match) locations.push(`src/${match[1]}:${match[2]}`);
		if (locations.length >= 8) break;
	}
	return locations.length ? locations : undefined;
}

export function handleError(error: unknown): NextResponse {
	if (error instanceof AppError) {
		return NextResponse.json(
			{ error: error.message, code: error.code },
			{ status: error.statusCode },
		);
	}

	if (isDevelopment() && error instanceof Error) {
		return NextResponse.json(
			{
				error: error.message,
				code: "INTERNAL_ERROR",
				at: extractLocations(error.stack),
			},
			{ status: HTTP_INTERNAL_SERVER_ERROR },
		);
	}

	return NextResponse.json(
		{ error: "Internal server error", code: "INTERNAL_ERROR" },
		{ status: HTTP_INTERNAL_SERVER_ERROR },
	);
}
