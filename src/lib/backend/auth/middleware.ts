import { jwtVerify } from "jose";
import { auth } from "@/backend/auth/server";
import { getJwtSecret } from "@/backend/env";
import { HTTP_INTERNAL_SERVER_ERROR } from "@/constants";
import { AppError, UnauthorizedError } from "@/lib/shared/errors";

const JWT_SECRET = new TextEncoder().encode(getJwtSecret());

export async function withAuth(req: Request, _ctx: Record<string, unknown>) {
	const authHeader = req.headers.get("authorization");
	if (authHeader?.startsWith("Bearer ")) {
		const token = authHeader.slice(7);
		try {
			const { payload } = await jwtVerify(token, JWT_SECRET);
			if (payload.sub) return { userId: payload.sub };
		} catch {
			throw new UnauthorizedError();
		}
	}

	try {
		const { data: session } = await auth.getSession();
		if (!session?.user) throw new UnauthorizedError();
		return { userId: session.user.id };
	} catch (error) {
		if (error instanceof UnauthorizedError) throw error;
		throw new AppError(
			"Neon Auth backend is unreachable. Check NEON_AUTH_BASE_URL in .env.",
			HTTP_INTERNAL_SERVER_ERROR,
			"AUTH_BACKEND_UNREACHABLE",
		);
	}
}
