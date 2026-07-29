import { NextResponse } from "next/server";
import { withAuth } from "@/backend/auth/middleware";

type HandlerCtx = { userId: string; params?: Record<string, string> };
type Handler = (ctx: HandlerCtx) => Promise<Response | NextResponse>;
type MiddlewareFn = (
	req: Request,
	ctx: Record<string, unknown>,
) => Promise<Record<string, unknown> | Response | NextResponse>;

const middleware: MiddlewareFn[] = [withAuth];

export function withCommon(handler: Handler) {
	const wrapped = async (
		req: Request,
		routeCtx?: { params: Promise<Record<string, string>> },
	) => {
		const params = routeCtx?.params ? await routeCtx.params : undefined;
		const ctx: Record<string, unknown> = { params };

		for (const fn of middleware) {
			const result = await fn(req, ctx);
			if (result instanceof NextResponse || result instanceof Response)
				return result;
			Object.assign(ctx, result);
		}

		return handler(ctx as HandlerCtx);
	};

	return wrapped as (
		req: Request,
		ctx: { params: Promise<Record<string, string>> },
	) => Promise<Response>;
}
