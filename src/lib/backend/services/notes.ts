"use server";

import {
	deleteNoteById,
	findNotesByUserId,
	createNote as repoCreateNote,
} from "@/backend/repositories/notes";
import { NOTE_LENGTH_LIMIT } from "@/constants";

export async function listNotes(userId: string) {
	return findNotesByUserId(userId);
}

export async function createNote(userId: string, title: string) {
	const trimmed = title.trim();
	if (!trimmed) throw new Error("Title cannot be empty");
	if (trimmed.length > NOTE_LENGTH_LIMIT) throw new Error("Title too long");
	return repoCreateNote({ user_id: userId, title: trimmed });
}

export async function deleteNote(userId: string, noteId: string) {
	return deleteNoteById(noteId, userId).then(() => ({ success: true }));
}
