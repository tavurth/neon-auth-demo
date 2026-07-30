import { redirect } from "next/navigation";
import { isDevelopment } from "@/backend/env";

export const dynamic = "force-dynamic";

export default function PlaygroundPage() {
	if (!isDevelopment()) {
		redirect("/");
	}

	return (
		<div className="mx-auto max-w-2xl p-6">
			<h1 className="mb-4 text-2xl font-bold">Playground</h1>
			<p className="mb-6 text-muted-foreground">
				This route is only available in development mode.
			</p>
			<div className="space-y-4">
				<section className="rounded-md border border-border p-4">
					<h2 className="mb-2 font-medium">Database</h2>
					<pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
						{`// Test a query
const notes = await db
  .selectFrom("notes")
  .selectAll()
  .execute();`}
					</pre>
				</section>
				<section className="rounded-md border border-border p-4">
					<h2 className="mb-2 font-medium">Auth</h2>
					<pre className="overflow-x-auto rounded bg-muted p-3 text-xs">
						{`// Check session
const { data: session } = await auth.getSession();
console.log(session?.user);`}
					</pre>
				</section>
			</div>
		</div>
	);
}
