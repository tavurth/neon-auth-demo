"use server";

import { db } from "@/lib/db";

export async function listNotes(userId: string) {
  return db
    .selectFrom("notes")
    .where("user_id", "=", userId)
    .selectAll()
    .orderBy("created_at", "desc")
    .execute();
}

export async function createNote(userId: string, title: string) {
  return db
    .insertInto("notes")
    .values({ user_id: userId, title })
    .returningAll()
    .executeTakeFirst();
}

export async function deleteNote(userId: string, noteId: string) {
  await db
    .deleteFrom("notes")
    .where("id", "=", noteId)
    .where("user_id", "=", userId)
    .execute();
  return { success: true };
}
