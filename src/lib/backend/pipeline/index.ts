import { withAuth } from "@/backend/auth/middleware";
import { getLogLevel } from "@/backend/env";
import {
	addLog,
	getDebugInfo,
	runWithContext,
} from "@/backend/request-context";
import { logger, setLogLevel, setLogSink } from "@/lib/shared/logger";
import type { RouteCtx, WithCommonConfig } from "@/types";
import { handleError } from "./errors";
import { runMiddleware } from "./middleware";
import { parseBody, withDebug } from "./parse";
import type { Handler, HandlerCtx, MiddlewareFn } from "./types";
import { withRateLimit } from "./with-rate-limit";

const DEFAULT_RATE_LIMIT = { max: 100, windowMs: 60_000 };

setLogSink(addLog);
setLogLevel(getLogLevel() as "debug" | "info" | "warn" | "error");

type WrappedHandler = (req: Request, ctx: RouteCtx) => Promise<Response>;

function buildMiddleware(config: WithCommonConfig): MiddlewareFn[] {
	const middleware: MiddlewareFn[] = [];

	if (config.rateLimit !== false) {
		middleware.push(
			withRateLimit(
				config.rateLimit === undefined ? DEFAULT_RATE_LIMIT : config.rateLimit,
			),
		);
	}

	if (config.auth !== false) {
		middleware.push(withAuth);
	}

	return middleware;
}

function wrap(handler: Handler, config: WithCommonConfig): WrappedHandler {
	const middleware = buildMiddleware(config);

	const wrapped: WrappedHandler = async (req, routeCtx) => {
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

				const headers = result.rateLimitHeaders as
					| Record<string, string>
					| undefined;
				if (headers) {
					for (const [k, v] of Object.entries(headers)) {
						response.headers.set(k, v);
					}
				}

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

	return wrapped;
}

export function withCommon(handler: Handler): WrappedHandler;
export function withCommon(
	config: WithCommonConfig,
): (handler: Handler) => WrappedHandler;
export function withCommon(
	configOrHandler: Handler | WithCommonConfig,
): WrappedHandler | ((handler: Handler) => WrappedHandler) {
	if (typeof configOrHandler === "function") {
		return wrap(configOrHandler, {});
	}
	return (handler: Handler) => wrap(handler, configOrHandler);
}
