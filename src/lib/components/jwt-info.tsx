"use client";

import { useState } from "react";
import { authClient } from "@/backend/auth/client";

export function JwtInfo() {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function fetchToken() {
		setLoading(true);
		try {
			const session = await authClient.getSession();
			if (!session?.data?.session?.token) {
				setToken("No token available — sign in first");
				return;
			}
			setToken(session.data.session.token);
		} catch {
			setToken("Failed to get token");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="rounded-md border border-border bg-muted p-4">
			<h3 className="mb-2 font-medium">JWT / JWKS</h3>
			<p className="mb-3 text-sm text-muted-foreground">
				Use Bearer tokens for API access outside the browser cookie jar.
			</p>
			<button
				type="button"
				onClick={fetchToken}
				disabled={loading}
				className="mb-3 rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-accent disabled:opacity-50"
			>
				{loading ? "Loading..." : "Show my token"}
			</button>
			{token && (
				<pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
					{token}
				</pre>
			)}
			<p className="mt-3 text-xs text-muted-foreground">
				Test with:{" "}
				<code>
					curl -H &quot;Authorization: Bearer &lt;token&gt;&quot; /api/protected
				</code>
			</p>
		</div>
	);
}
