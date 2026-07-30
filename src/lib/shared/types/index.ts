export type {
	DB,
	Generated,
	Insertable,
	Selectable,
} from "./db";

export type NoteRow = Selectable<"notes">;
export type NoteInsert = Insertable<"notes">;
