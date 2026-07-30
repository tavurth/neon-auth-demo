import { withAuth } from "@/backend/auth/middleware";
import { logger } from "@/lib/shared/logger";
import { getDebugInfo, runWithContext } from "@/lib/shared/request-context";
import { handleError } from "./errors";
import { runMiddleware } from "./middleware";
import { parseBody, withDebug } from "./parse";
import type { Handler, HandlerCtx, MiddlewareFn } from "./types";

const defaultMiddleware: MiddlewareFn[] = [withAuth];

export function withCommon(handler: Handler, middleware = defaultMiddleware) {
	const wrapped = async (
		req: Request,
		routeCtx?: { params: Promise<Record<string, string>> },
	) => {
		return runWithContext(async () => {
			try {
				const params = routeCtx?.params ? await routeCtx.params : undefined;
				const body = await parseBody(req);
				const ctx: Record<string, unknown> = { params, body };

				const result = await runMiddleware(req, ctx, middleware);
				if (result instanceof Response)
					return withDebug(
						req,
						result,
						getDebugInfo() ?? { logs: [], queries: [] },
					);

				const response = await handler(result as HandlerCtx);
				return withDebug(
					req,
					response,
					getDebugInfo() ?? { logs: [], queries: [] },
				);
			} catch (error) {
				logger.error("API error", error);
				return withDebug(
					req,
					handleError(error),
					getDebugInfo() ?? { logs: [], queries: [] },
				);
			}
		});
	};

	return wrapped as (
		req: Request,
		ctx: { params: Promise<Record<string, string>> },
	) => Promise<Response>;
}
