import { NextResponse } from "next/server";
import { auth } from "@/backend/auth/server";

export async function withAuth(_req: Request, _ctx: Record<string, unknown>) {
	const { data: session } = await auth.getSession();
	if (!session?.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	return { userId: session.user.id };
}
