export type HandlerCtx = {
	userId: string;
	params?: Record<string, string>;
	body?: unknown;
};

export type Handler = (ctx: HandlerCtx) => Promise<Response>;

export type MiddlewareFn = (
	req: Request,
	ctx: Record<string, unknown>,
) => Promise<Record<string, unknown> | Response>;

export type RateLimitOptions = {
	max?: number;
	windowMs?: number;
};

export type WithCommonConfig = {
	auth?: boolean;
	rateLimit?: RateLimitOptions | false;
};
