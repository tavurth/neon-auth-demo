import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth/jwks";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header. Use: Bearer <token>" },
      { status: 401 }
    );
  }

  const token = authHeader.slice(7);
  const session = await verifyJwt(token);
  if (!session) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  const userId = session.payload.sub;
  if (!userId) {
    return NextResponse.json({ error: "Token missing subject claim" }, { status: 401 });
  }

  const notes = await db
    .selectFrom("notes")
    .where("user_id", "=", userId)
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();

  return NextResponse.json({ userId, notes });
}
