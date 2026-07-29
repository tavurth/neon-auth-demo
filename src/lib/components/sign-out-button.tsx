"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/backend/auth/client";

export function SignOutButton() {
	const router = useRouter();

	return (
		<button
			type="button"
			onClick={async () => {
				await authClient.signOut();
				router.push("/auth/sign-in");
			}}
			className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-accent"
		>
			Sign out
		</button>
	);
}
