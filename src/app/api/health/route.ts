import { readdirSync } from "node:fs";
import { join } from "node:path";
import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { getAppliedMigrations } from "@/backend/repositories/health";

const CACHE_TTL_MS = 10_000;
let lastResult: { status: string; db: string } | null = null;
let lastCheck = 0;

function migrationVersions(): string[] {
	return readdirSync(join(process.cwd(), "db/migrations"))
		.filter((f) => f.endsWith(".sql"))
		.map((f) => f.split("_")[0]);
}

function allApplied(applied: string[], versions: string[]): boolean {
	return versions.every((v) => applied.includes(v));
}

function healthResponse(status: string, db: string) {
	return NextResponse.json({ status, db });
}

async function checkHealth(): Promise<{ status: string; db: string }> {
	const applied = await getAppliedMigrations();
	const ok = allApplied(applied, migrationVersions());
	return { status: ok ? "ok" : "pending", db: "connected" };
}

export const GET = withCommon({ auth: false })(async () => {
	const now = Date.now();
	if (lastResult && now - lastCheck < CACHE_TTL_MS) {
		return healthResponse(lastResult.status, lastResult.db);
	}

	try {
		lastResult = await checkHealth();
	} catch {
		lastResult = { status: "degraded", db: "unreachable" };
	}
	lastCheck = now;
	return healthResponse(lastResult.status, lastResult.db);
});
