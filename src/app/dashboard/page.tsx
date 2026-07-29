import { auth } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { NotesList } from "./notes-list";
import { SignOutButton } from "./sign-out-button";
import { JwtInfo } from "./jwt-info";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data: session } = await auth.getSession();
  if (!session?.user) redirect("/auth/sign-in");

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-sm text-zinc-500">
            Signed in as {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </div>
      <NotesList userId={session.user.id} />
      <div className="mt-8">
        <JwtInfo />
      </div>
    </div>
  );
}
