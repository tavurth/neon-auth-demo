import type { MiddlewareFn } from "./types";

export async function runMiddleware(
	req: Request,
	ctx: Record<string, unknown>,
	middleware: MiddlewareFn[],
): Promise<Record<string, unknown> | Response> {
	for (const fn of middleware) {
		const result = await fn(req, ctx);
		if (result instanceof Response) return result;
		Object.assign(ctx, result);
	}
	return ctx;
}
