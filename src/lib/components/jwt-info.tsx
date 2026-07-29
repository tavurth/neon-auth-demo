"use client";

import { useState } from "react";
import { authClient } from "@/backend/auth/client";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";

export function JwtInfo() {
	const [token, setToken] = useState<string | null>(null);

	return (
		<Card>
			<CardHeader>
				<CardTitle>JWT / JWKS</CardTitle>
				<p className="text-sm text-muted-foreground">
					Use Bearer tokens for API access outside the browser cookie jar.
				</p>
			</CardHeader>
			<CardContent>
				<JwtButton onToken={setToken} />
				{token && <JwtDisplay token={token} />}
				<JwtHint />
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
		<Button
			variant="secondary"
			disabled={loading}
			onClick={fetchToken}
			className="mb-3"
		>
			{loading ? "Loading..." : "Show my token"}
		</Button>
	);
}

function JwtDisplay({ token }: { token: string }) {
	return (
		<pre className="overflow-x-auto rounded bg-muted p-3 text-xs">{token}</pre>
	);
}

function JwtHint() {
	return (
		<p className="mt-3 text-xs text-muted-foreground">
			Test with:{" "}
			<code>
				curl -H &quot;Authorization: Bearer &lt;token&gt;&quot; /api/protected
			</code>
		</p>
	);
}
