"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@/components/ui";
import { api } from "@/frontend/api/client";
import { useNotesStore } from "@/frontend/stores/notes";
import type { NoteRow } from "@/types";

export function NotesList() {
	return (
		<div className="space-y-4">
			<NoteForm />
			<NoteItems />
		</div>
	);
}

function NoteForm() {
	const queryClient = useQueryClient();
	const { draft, setDraftTitle, clearDraft } = useNotesStore();

	const create = useMutation({
		mutationFn: () => api.notes.create(draft.title),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
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
					<Button type="submit" disabled={!draft.title.trim() || create.isPending}>
						Add
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}

function NoteItems() {
	const queryClient = useQueryClient();

	const { data: notes = [], isLoading } = useQuery({
		queryKey: ["notes"],
		queryFn: () => api.notes.list(),
	});

	const remove = useMutation({
		mutationFn: (id: string) => api.notes.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["notes"] });
		},
	});

	if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
	if (notes.length === 0)
		return <p className="text-sm text-muted-foreground">No notes yet. Create one above.</p>;

	return (
		<div className="space-y-2">
			{notes.map((note) => (
				<NoteCard key={note.id} note={note} onDelete={() => remove.mutate(note.id)} />
			))}
		</div>
	);
}

function NoteCard({ note, onDelete }: { note: NoteRow; onDelete: () => void }) {
	return (
		<Card>
			<CardContent className="flex items-center justify-between">
				<div>
					<p className="font-medium">{note.title}</p>
					<p className="text-xs text-muted-foreground">
						{new Date(note.created_at).toLocaleDateString()}
					</p>
				</div>
				<Button variant="destructive" size="sm" onClick={onDelete}>
					Delete
				</Button>
			</CardContent>
		</Card>
	);
}
