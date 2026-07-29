function requireEnv(name: string): string {
	const value = process.env[name];
	if (
		!value ||
		value === "your-neon-auth-url-here" ||
		value.startsWith("your-")
	) {
		throw new Error(
			`Missing or placeholder value for ${name}.\n` +
				`Set it in .env.local. See neon-auth-demo/.env.local for an example.`,
		);
	}
	return value;
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
