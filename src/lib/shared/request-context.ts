import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContext {
	logs: LogEntry[];
	queries: QueryEntry[];
}

interface LogEntry {
	level: string;
	message: string;
	data?: unknown;
	timestamp: string;
}

interface QueryEntry {
	sql: string;
	params: unknown[];
	rows?: unknown[];
	duration?: number;
}

const storage = new AsyncLocalStorage<RequestContext>();

export function runWithContext<T>(fn: () => T): T {
	return storage.run({ logs: [], queries: [] }, fn);
}

export function getContext(): RequestContext | undefined {
	return storage.getStore();
}

export function addLog(entry: LogEntry) {
	const ctx = storage.getStore();
	if (ctx) ctx.logs.push(entry);
}

export function addQuery(entry: QueryEntry) {
	const ctx = storage.getStore();
	if (ctx) ctx.queries.push(entry);
}

export function getDebugInfo() {
	const ctx = storage.getStore();
	if (!ctx) return undefined;
	if (ctx.logs.length === 0 && ctx.queries.length === 0) return undefined;
	return { logs: ctx.logs, queries: ctx.queries };
}
