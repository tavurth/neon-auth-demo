import { isDevelopment } from "@/backend/env";
import type { DebugContext } from "@/types";

export function parseBody(req: Request): Promise<unknown> {
	const contentType = req.headers.get("content-type");
	if (!contentType?.includes("application/json"))
		return Promise.resolve(undefined);
	return req.json().catch(() => undefined);
}

export async function withDebug(
	req: Request,
	res: Response,
	ctx: DebugContext,
): Promise<Response> {
	if (!isDevelopment()) return res;
	if (ctx.logs.length === 0 && ctx.queries.length === 0) return res;

	const url = new URL(req.url);
	if (!url.searchParams.has("debug")) return res;

	const text = await res.text();
	try {
		const json = JSON.parse(text);
		const wrapped = [
			json,
			{
				__debug: ctx,
				__hint: "Without ?debug=1, only array[0] is returned.",
			},
		];
		return new Response(JSON.stringify(wrapped, null, 2), {
			status: res.status,
			statusText: res.statusText,
			headers: res.headers,
		});
	} catch {
		return new Response(text, {
			status: res.status,
			statusText: res.statusText,
			headers: res.headers,
		});
	}
}
