"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/backend/auth/client";

export function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await authClient.signOut();
        router.push("/auth/sign-in");
      }}
      className="rounded-md bg-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
    >
      Sign out
    </button>
  );
}
