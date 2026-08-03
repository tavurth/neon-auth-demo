import { db } from "@/backend/db";

let lastCheck = 0;
let cachedHealthy: boolean | null = null;
const CACHE_TTL_MS = 10_000;

export async function checkDbHealth(): Promise<boolean> {
	const now = Date.now();
	if (cachedHealthy === true && now - lastCheck < CACHE_TTL_MS) return true;
	try {
		await db.selectFrom("notes").select("id").limit(1).execute();
		cachedHealthy = true;
		lastCheck = now;
		return true;
	} catch {
		cachedHealthy = false;
		return false;
	}
}
