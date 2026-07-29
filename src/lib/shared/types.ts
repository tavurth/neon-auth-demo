import type { Generated, Insertable, Selectable } from "kysely";

export interface Note {
	id: Generated<string>;
	user_id: string;
	title: string;
	body: Generated<string>;
	created_at: Generated<Date>;
	updated_at: Generated<Date>;
}

export type NoteRow = Selectable<Note>;
export type NoteInsert = Insertable<Note>;

export interface DB {
	notes: Note;
}
