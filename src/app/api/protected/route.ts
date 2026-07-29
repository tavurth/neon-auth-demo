import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/backend/auth/jwks";
import { listNotes } from "@/backend/services/notes";

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

  const notes = await listNotes(userId);
  return NextResponse.json({ userId, notes });
}
