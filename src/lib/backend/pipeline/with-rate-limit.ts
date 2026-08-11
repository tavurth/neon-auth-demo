import { HTTP_TOO_MANY_REQUESTS } from "@/constants";
import { checkRateLimit } from "./rate-limit";
import type { MiddlewareFn } from "./types";

export type RateLimitConfig = {
	max: number;
	windowMs: number;
	keyFn?: (req: Request) => string;
};

function getClientIp(req: Request): string {
	return (
		req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		req.headers.get("x-real-ip") ||
		"unknown"
	);
}

function rateLimitHeaders(max: number, remaining: number, resetAt: number) {
	return {
		"X-RateLimit-Limit": String(max),
		"X-RateLimit-Remaining": String(remaining),
		"X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
	};
}

export function withRateLimit(config: RateLimitConfig): MiddlewareFn {
	const { max, windowMs } = config;
	const keyFn = config.keyFn ?? ((req) => getClientIp(req));

	return async (req) => {
		const key = keyFn(req);
		const { allowed, remaining, resetAt } = checkRateLimit(key, max, windowMs);

		if (!allowed) {
			const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
			return new Response(
				JSON.stringify({
					error: "Too many requests",
					code: "RATE_LIMITED",
					retryAfter,
				}),
				{
					status: HTTP_TOO_MANY_REQUESTS,
					headers: {
						"Content-Type": "application/json",
						"Retry-After": String(retryAfter),
						...rateLimitHeaders(max, 0, resetAt),
					},
				},
			);
		}

		return { rateLimitHeaders: rateLimitHeaders(max, remaining, resetAt) };
	};
}
