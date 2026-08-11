"use server";

import {
	deleteNoteById,
	findNotesByUserId,
	createNote as repoCreateNote,
} from "@/backend/repositories/notes";
import { NOTE_LENGTH_LIMIT } from "@/constants";
import { NotFoundError, ValidationError } from "@/lib/shared/errors";

export async function listNotes(userId: string) {
	return findNotesByUserId(userId);
}

export async function createNote(userId: string, title: string) {
	const trimmed = title.trim();
	if (!trimmed) throw new ValidationError("Title cannot be empty");
	if (trimmed.length > NOTE_LENGTH_LIMIT) {
		throw new ValidationError(`Title must be ${NOTE_LENGTH_LIMIT} characters or less`);
	}
	return repoCreateNote({ user_id: userId, title: trimmed });
}

export async function deleteNote(userId: string, noteId: string) {
	const deleted = await deleteNoteById(noteId, userId);
	if (!deleted) throw new NotFoundError("Note", noteId);
	return { success: true };
}
