"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { authClient } from "@/frontend/auth-client";

export function JwtInfo() {
	const [token, setToken] = useState<string | null>(null);

	return (
		<Card>
			<CardHeader>
				<CardTitle>JWT Token</CardTitle>
			</CardHeader>
			<CardContent>
				<JwtButton onToken={setToken} />
				{token && <pre className="mt-3 overflow-x-auto rounded bg-muted p-3 text-xs">{token}</pre>}
				<p className="mt-3 text-xs text-muted-foreground">
					<code>curl -H "Authorization: Bearer &lt;token&gt;" /api/notes</code>
				</p>
			</CardContent>
		</Card>
	);
}

function JwtButton({ onToken }: { onToken: (token: string) => void }) {
	const [loading, setLoading] = useState(false);

	async function fetchToken() {
		setLoading(true);
		try {
			const session = await authClient.getSession();
			if (!session?.data?.session?.token) {
				onToken("No token available — sign in first");
				return;
			}
			onToken(session.data.session.token);
		} catch {
			onToken("Failed to get token");
		} finally {
			setLoading(false);
		}
	}

	return (
		<Button variant="secondary" disabled={loading} onClick={fetchToken}>
			{loading ? "Loading..." : "Show my token"}
		</Button>
	);
}
