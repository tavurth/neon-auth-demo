"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, listNotes } from "@/backend/services/notes";
import { useNotesStore } from "@/frontend/stores/notes";

export function NotesList({ userId }: { userId: string }) {
	const queryClient = useQueryClient();
	const { draft, setDraftTitle, clearDraft } = useNotesStore();

	const { data: notes = [], isLoading } = useQuery({
		queryKey: ["notes", userId],
		queryFn: () => listNotes(userId),
	});

	const create = useMutation({
		mutationFn: () => createNote(userId, draft.title),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes", userId] });
			clearDraft();
		},
	});

	const remove = useMutation({
		mutationFn: (id: string) => deleteNote(userId, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes", userId] });
		},
	});

	return (
		<div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					if (draft.title.trim()) create.mutate();
				}}
				className="mb-6 flex gap-2"
			>
				<input
					value={draft.title}
					onChange={(e) => setDraftTitle(e.target.value)}
					placeholder="New note..."
					className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
				/>
				<button
					type="submit"
					disabled={!draft.title.trim() || create.isPending}
					className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
				>
					Add
				</button>
			</form>

			{isLoading ? (
				<p className="text-sm text-muted-foreground">Loading...</p>
			) : notes.length === 0 ? (
				<p className="text-sm text-muted-foreground">
					No notes yet. Create one above.
				</p>
			) : (
				<ul className="space-y-2">
					{notes.map((note) => (
						<li
							key={note.id}
							className="flex items-center justify-between rounded-md border border-border px-4 py-3"
						>
							<div>
								<p className="font-medium">{note.title}</p>
								<p className="text-xs text-muted-foreground">
									{new Date(note.created_at).toLocaleDateString()}
								</p>
							</div>
							<button
								type="button"
								onClick={() => remove.mutate(note.id)}
								className="text-sm text-destructive hover:text-destructive/80"
							>
								Delete
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
