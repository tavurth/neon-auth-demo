import { NextResponse } from "next/server";
import { withAuth } from "@/backend/auth/middleware";
import { AppError } from "@/lib/shared/errors";
import { logger } from "@/lib/shared/logger";

type HandlerCtx = {
	userId: string;
	params?: Record<string, string>;
	body?: unknown;
};
type Handler = (ctx: HandlerCtx) => Promise<Response | NextResponse>;
type MiddlewareFn = (
	req: Request,
	ctx: Record<string, unknown>,
) => Promise<Record<string, unknown> | Response | NextResponse>;

const middleware: MiddlewareFn[] = [withAuth];

async function parseBody(req: Request): Promise<unknown> {
	const contentType = req.headers.get("content-type");
	if (!contentType?.includes("application/json")) return undefined;
	try {
		return await req.json();
	} catch {
		return undefined;
	}
}

export function withCommon(handler: Handler) {
	const wrapped = async (
		req: Request,
		routeCtx?: { params: Promise<Record<string, string>> },
	) => {
		try {
			const params = routeCtx?.params ? await routeCtx.params : undefined;
			const body = await parseBody(req);
			const ctx: Record<string, unknown> = { params, body };

			for (const fn of middleware) {
				const result = await fn(req, ctx);
				if (result instanceof NextResponse || result instanceof Response)
					return result;
				Object.assign(ctx, result);
			}

			return handler(ctx as HandlerCtx);
		} catch (error) {
			logger.error("API error", error);

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
	};

	return wrapped as (
		req: Request,
		ctx: { params: Promise<Record<string, string>> },
	) => Promise<Response>;
}
