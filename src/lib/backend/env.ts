function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value || value === "your-neon-auth-url-here" || value.startsWith("your-")) {
		throw new Error(
			`Missing or placeholder value for ${name}.\n` +
				`Set it in .env.local. See neon-auth-demo/.env.local for an example.`,
		);
	}
	return value;
}

function optionalEnv(name: string, fallback: string): string {
	return process.env[name] ?? fallback;
}

function optionalInt(name: string, fallback: number): number {
	const value = process.env[name];
	if (!value) return fallback;
	const parsed = Number.parseInt(value, 10);
	return Number.isNaN(parsed) ? fallback : parsed;
}

export function getAuthBaseUrl() {
	return requireEnv("NEON_AUTH_BASE_URL");
}

export function getAuthCookieSecret() {
	return requireEnv("NEON_AUTH_COOKIE_SECRET");
}

export function getDatabaseUrl() {
	return requireEnv("DATABASE_URL");
}

export function getDbDebug() {
	return optionalEnv("DB_DEBUG", "false") === "true";
}

export function getDbDebugFilter(): string[] {
	const filter = optionalEnv("DB_DEBUG_FILTER", "");
	if (!filter) return [];
	return filter.split(",").map((s) => s.trim().toLowerCase());
}

export function getLogLevel() {
	return optionalEnv("LOG_LEVEL", "info");
}

export function getJwtSecret() {
	return optionalEnv("JWT_SECRET", "test-secret-for-e2e-only");
}

export function getRateLimitMax() {
	return optionalInt("RATE_LIMIT_MAX", 100);
}

export function getRateLimitWindowMs() {
	return optionalInt("RATE_LIMIT_WINDOW_MS", 60_000);
}

export function isDevelopment() {
	return process.env.NODE_ENV === "development";
}
