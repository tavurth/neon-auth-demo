import { NextResponse } from "next/server";
import { withCommon } from "@/backend/pipeline";
import { checkDbHealth } from "@/backend/repositories/health";

export const GET = withCommon({ auth: false })(async () => {
	const healthy = await checkDbHealth();
	return NextResponse.json({
		status: healthy ? "ok" : "degraded",
		db: healthy ? "connected" : "unreachable",
	});
});
