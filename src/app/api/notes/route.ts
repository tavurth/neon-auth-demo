import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { createNote, listNotes } from "@/backend/services/notes";

export const GET = withCommon(async ({ userId }) => {
	const notes = await listNotes(userId);
	return NextResponse.json(notes);
});

export const POST = withCommon(async ({ userId, params }) => {
	if (!params?.title)
		return NextResponse.json({ error: "Missing title" }, { status: 400 });
	const note = await createNote(userId, params.title);
	return NextResponse.json(note);
});
