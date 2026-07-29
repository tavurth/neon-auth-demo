"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, deleteNote, listNotes } from "@/backend/services/notes";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
} from "@/components/ui";
import { useNotesStore } from "@/frontend/stores/notes";

export function NotesList({ userId }: { userId: string }) {
	return (
		<div className="space-y-4">
			<NoteForm userId={userId} />
			<NoteItems userId={userId} />
		</div>
	);
}

function NoteForm({ userId }: { userId: string }) {
	const queryClient = useQueryClient();
	const { draft, setDraftTitle, clearDraft } = useNotesStore();

	const create = useMutation({
		mutationFn: () => createNote(userId, draft.title),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes", userId] });
			clearDraft();
		},
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>New Note</CardTitle>
			</CardHeader>
			<CardContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (draft.title.trim()) create.mutate();
					}}
					className="flex gap-2"
				>
					<Input
						value={draft.title}
						onChange={(e) => setDraftTitle(e.target.value)}
						placeholder="What's on your mind?"
					/>
					<Button
						type="submit"
						disabled={!draft.title.trim() || create.isPending}
					>
						Add
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

function NoteItems({ userId }: { userId: string }) {
	const queryClient = useQueryClient();

	const { data: notes = [], isLoading } = useQuery({
		queryKey: ["notes", userId],
		queryFn: () => listNotes(userId),
	});

	const remove = useMutation({
		mutationFn: (id: string) => deleteNote(userId, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes", userId] });
		},
	});

	if (isLoading)
		return <p className="text-sm text-muted-foreground">Loading...</p>;
	if (notes.length === 0)
		return (
			<p className="text-sm text-muted-foreground">
				No notes yet. Create one above.
			</p>
		);

	return (
		<div className="space-y-2">
			{notes.map((note) => (
				<NoteCard
					key={note.id}
					note={note}
					onDelete={() => remove.mutate(note.id)}
				/>
			))}
		</div>
	);
}

function NoteCard({
	note,
	onDelete,
}: {
	note: { id: string; title: string; created_at: Date };
	onDelete: () => void;
}) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between">
				<div>
					<p className="font-medium">{note.title}</p>
					<p className="text-xs text-muted-foreground">
						{new Date(note.created_at).toLocaleDateString()}
					</p>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={onDelete}
					className="text-destructive hover:text-destructive/80"
				>
					Delete
				</Button>
			</CardContent>
		</Card>
	);
}
