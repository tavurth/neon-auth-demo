"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
        />
        <button
          type="submit"
          disabled={!draft.title.trim() || create.isPending}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-zinc-500">No notes yet. Create one above.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="flex items-center justify-between rounded-md border border-zinc-200 px-4 py-3 dark:border-zinc-700"
            >
              <div>
                <p className="font-medium">{note.title}</p>
                <p className="text-xs text-zinc-500">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => remove.mutate(note.id)}
                className="text-sm text-red-500 hover:text-red-700"
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
