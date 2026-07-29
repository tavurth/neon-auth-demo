import { auth } from "@/backend/auth/server";

export const { GET, POST } = auth.handler();
