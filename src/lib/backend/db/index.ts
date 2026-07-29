import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { neon } from "@neondatabase/serverless";
import { getDatabaseUrl } from "../env";
import type { DB } from "./types";

const sql = neon(getDatabaseUrl());

export const db = new Kysely<DB>({
  dialect: new NeonDialect({ neon: sql }),
});
