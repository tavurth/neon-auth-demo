import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { deleteNote } from "@/backend/services/notes";

export const DELETE = withCommon(async ({ userId, params }) => {
	if (!params?.id)
		return NextResponse.json({ error: "Missing id" }, { status: 400 });
	await deleteNote(userId, params.id);
	return NextResponse.json({ success: true });
});
