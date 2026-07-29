import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import type { DB } from "@/types";
import { getDatabaseUrl } from "../env";

const dialect = new PostgresDialect({
	pool: new Pool({ connectionString: getDatabaseUrl() }),
});

export const db = new Kysely<DB>({ dialect });
