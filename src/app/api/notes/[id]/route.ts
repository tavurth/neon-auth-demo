import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { deleteNote } from "@/backend/services/notes";
import { ValidationError } from "@/lib/shared/errors";

export const DELETE = withCommon(async ({ userId, params }) => {
	if (!params?.id) throw new ValidationError("Missing id");
	await deleteNote(userId, params.id);
	return NextResponse.json({ success: true });
});
