"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/backend/auth/client";
import { Button } from "@/components/ui";

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
