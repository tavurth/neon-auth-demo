import type { Generated, Insertable, Selectable } from "kysely";

export type { DB } from "./db";

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

export type RouteCtx = { params: Promise<Record<string, string>> };

export type LogEntry = {
	level: string;
	message: string;
	data?: unknown;
	timestamp: string;
};

export type QueryEntry = {
	sql: string;
	params: unknown[];
	rows?: unknown[];
	duration?: number;
};

export type DebugContext = { logs: LogEntry[]; queries: QueryEntry[] };

export type { WithCommonConfig } from "@/backend/pipeline/types";
