import { redirect } from "next/navigation";
import { auth } from "@/backend/auth/server";
import { JwtInfo } from "@/components/jwt-info";
import { NotesList } from "@/components/notes-list";
import { SignOutButton } from "@/components/sign-out-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
	const { data: session } = await auth.getSession();
	if (!session?.user) redirect("/auth/sign-in");

	return (
		<div className="mx-auto max-w-2xl p-6">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">Notes</h1>
					<p className="text-sm text-muted-foreground">
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
