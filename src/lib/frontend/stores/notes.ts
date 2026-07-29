import { create } from "zustand";

interface NoteDraft {
  title: string;
}

interface NotesStore {
  draft: NoteDraft;
  setDraftTitle: (title: string) => void;
  clearDraft: () => void;
}

export const useNotesStore = create<NotesStore>((set) => ({
  draft: { title: "" },
  setDraftTitle: (title) => set({ draft: { title } }),
  clearDraft: () => set({ draft: { title: "" } }),
}));
