import { db } from "@/backend/db";
import type { NoteInsert, NoteRow } from "@/types";

export function findNotesByUserId(userId: string): Promise<NoteRow[]> {
	return db
		.selectFrom("notes")
		.where("user_id", "=", userId)
		.selectAll()
		.orderBy("created_at", "desc")
		.execute();
}

export function createNote(data: NoteInsert): Promise<NoteRow | undefined> {
	return db.insertInto("notes").values(data).returningAll().executeTakeFirst();
}

export function deleteNoteById(noteId: string, userId: string): Promise<void> {
	return db
		.deleteFrom("notes")
		.where("id", "=", noteId)
		.where("user_id", "=", userId)
		.execute()
		.then(() => undefined);
}
