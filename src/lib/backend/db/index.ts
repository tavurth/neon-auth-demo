import { neon } from "@neondatabase/serverless";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import type { DB } from "@/types";
import { getDatabaseUrl } from "../env";

const sql = neon(getDatabaseUrl());

export const db = new Kysely<DB>({
	dialect: new NeonDialect({ neon: sql }),
});
