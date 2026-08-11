import type { NoteRow as Note } from "@/types";

const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
	const res = await fetch(`${BASE}${path}`, {
		...options,
		headers: { "Content-Type": "application/json", ...options?.headers },
	});
	if (!res.ok) {
		const error = await res.json().catch(() => ({ error: res.statusText }));
		throw new Error(error.error || "Request failed");
	}
	return res.json();
}

export const api = {
	notes: {
		list: () => request<Note[]>("/notes"),
		create: (title: string) =>
			request<Note>("/notes", {
				method: "POST",
				body: JSON.stringify({ title }),
			}),
		delete: (id: string) => request<{ success: boolean }>(`/notes/${id}`, { method: "DELETE" }),
	},
};
