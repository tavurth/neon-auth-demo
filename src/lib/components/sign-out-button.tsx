"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { authClient } from "@/frontend/auth-client";

export function SignOutButton() {
	const router = useRouter();

	return (
		<Button
			variant="secondary"
			onClick={async () => {
				await authClient.signOut();
				router.push("/auth/sign-in");
			}}
		>
			Sign out
		</Button>
	);
}
