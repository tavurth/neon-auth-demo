import { db } from "@/backend/db";

export async function getAppliedMigrations(): Promise<string[]> {
	const rows = await db
		.selectFrom("schema_migrations")
		.select("version")
		.orderBy("version", "asc")
		.execute();
	return rows.map((r) => r.version);
}
