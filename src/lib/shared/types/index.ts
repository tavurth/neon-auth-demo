export type {
	DB,
	Generated,
	Insertable,
	Selectable,
} from "./db";

export type NoteRow = Selectable<"notes">;
export type NoteInsert = Insertable<"notes">;

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
