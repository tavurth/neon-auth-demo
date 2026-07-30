import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { createNote, listNotes } from "@/backend/services/notes";
import { ValidationError } from "@/lib/shared/errors";

export const GET = withCommon(async ({ userId }) => {
	const notes = await listNotes(userId);
	return NextResponse.json(notes);
});

export const POST = withCommon(async ({ userId, body }) => {
	const { title } = body as { title?: string };
	if (!title) throw new ValidationError("Missing title");
	const note = await createNote(userId, title);
	return NextResponse.json(note);
});
