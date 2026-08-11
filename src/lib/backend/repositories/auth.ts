import { sql } from "kysely";
import { db } from "@/backend/db";

export function setCurrentUser(userId: string) {
	return sql`SELECT set_config('app.current_user_id', ${userId}, true)`.execute(db);
}
