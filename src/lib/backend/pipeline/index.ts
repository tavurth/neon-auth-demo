import { withAuth } from "@/backend/auth/middleware";
import { getLogLevel, getRateLimitMax, getRateLimitWindowMs } from "@/backend/env";
import { setCurrentUser } from "@/backend/repositories/auth";
import { addLog, getDebugInfo, runWithContext } from "@/backend/request-context";
import { logger, setLogLevel, setLogSink } from "@/lib/shared/logger";
import type { RouteCtx, WithCommonConfig } from "@/types";
import { handleError } from "./errors";
import { runMiddleware } from "./middleware";
import { parseBody, withDebug } from "./parse";
import type { Handler, HandlerCtx, MiddlewareFn } from "./types";
import { withRateLimit } from "./with-rate-limit";

setLogSink(addLog);
setLogLevel(getLogLevel() as "debug" | "info" | "warn" | "error");

type WrappedHandler = (req: Request, ctx: RouteCtx) => Promise<Response>;

const debugCtx = () => getDebugInfo() ?? { logs: [], queries: [] };

function buildMiddleware({ auth, rateLimit }: WithCommonConfig) {
	const middleware: MiddlewareFn[] = [];

	if (rateLimit !== false) {
		middleware.push(
			withRateLimit({
				max: getRateLimitMax(),
				windowMs: getRateLimitWindowMs(),
				...rateLimit,
			}),
		);
	}
	if (auth !== false) {
		middleware.push(withAuth);
	}

	return middleware;
}

function setHeaders(res: Response, headers: Record<string, string> | undefined) {
	if (!headers) return;
	for (const [k, v] of Object.entries(headers)) {
		res.headers.set(k, v);
	}
}

function wrap(handler: Handler, config: WithCommonConfig): WrappedHandler {
	const middleware = buildMiddleware(config);

	return async (req, routeCtx) => {
		return runWithContext(async () => {
			try {
				const params = routeCtx?.params ? await routeCtx.params : undefined;
				const body = await parseBody(req);
				const ctx: Record<string, unknown> = { params, body };

				const result = await runMiddleware(req, ctx, middleware);
				if (result instanceof Response) return withDebug(req, result, debugCtx());

				if (result.userId && typeof result.userId === "string") {
					await setCurrentUser(result.userId);
				}

				const response = await handler(result as HandlerCtx);
				setHeaders(response, result.rateLimitHeaders as Record<string, string>);
				return withDebug(req, response, debugCtx());
			} catch (error) {
				logger.error("API error", error);
				return withDebug(req, handleError(error), debugCtx());
			}
		});
	};
}

export function withCommon(handler: Handler): WrappedHandler;
export function withCommon(config: WithCommonConfig): (handler: Handler) => WrappedHandler;
export function withCommon(
	configOrHandler: Handler | WithCommonConfig,
): WrappedHandler | ((handler: Handler) => WrappedHandler) {
	if (typeof configOrHandler === "function") {
		return wrap(configOrHandler, {});
	}
	return (handler: Handler) => wrap(handler, configOrHandler);
}
