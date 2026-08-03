interface RateLimitEntry {
	count: number;
	resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

function cleanup() {
	const now = Date.now();
	for (const [key, entry] of store) {
		if (now > entry.resetAt) store.delete(key);
	}
}

export function checkRateLimit(
	key: string,
	max: number,
	windowMs: number,
): { allowed: boolean; remaining: number; resetAt: number } {
	cleanup();

	const now = Date.now();
	const entry = store.get(key);

	if (!entry || now > entry.resetAt) {
		store.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
	}

	entry.count++;
	const remaining = Math.max(0, max - entry.count);
	return {
		allowed: entry.count <= max,
		remaining,
		resetAt: entry.resetAt,
	};
}
