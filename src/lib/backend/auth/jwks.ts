import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";
import { logger } from "@/lib/shared/logger";
import { getAuthBaseUrl } from "../env";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
	if (!jwks) {
		const baseUrl = getAuthBaseUrl();
		jwks = createRemoteJWKSet(new URL(`${baseUrl}/.well-known/jwks.json`));
	}
	return jwks;
}

export interface VerifiedSession {
	payload: JWTPayload;
}

export async function verifyJwt(
	token: string,
): Promise<VerifiedSession | null> {
	try {
		const { payload } = await jwtVerify(token, getJwks(), {
			issuer: new URL(getAuthBaseUrl()).origin,
		});
		return { payload };
	} catch (error) {
		logger.error("JWT verification failed:", error);
		return null;
	}
}

export function getJwksUrl() {
	return `${getAuthBaseUrl()}/.well-known/jwks.json`;
}
