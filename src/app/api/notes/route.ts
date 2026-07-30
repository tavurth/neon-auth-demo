import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { createNote, listNotes } from "@/backend/services/notes";

export const GET = withCommon(async ({ userId }) => {
	const notes = await listNotes(userId);
	return NextResponse.json(notes);
});

export const POST = withCommon(async ({ userId, body }) => {
	const { title } = body as { title?: string };
	if (!title) {
		return NextResponse.json({ error: "Missing title" }, { status: 400 });
	}
	const note = await createNote(userId, title);
	return NextResponse.json(note);
});
