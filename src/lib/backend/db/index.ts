import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/types";
import { getDatabaseUrl, getDbDebug } from "../env";
import { DebugPlugin } from "./debug-plugin";

const pool = new Pool({
	max: 10,
	idleTimeoutMillis: 30_000,
	connectionTimeoutMillis: 5_000,
	connectionString: getDatabaseUrl(),
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<DB>({
	dialect,
	plugins: getDbDebug() ? [new DebugPlugin()] : [],
});
