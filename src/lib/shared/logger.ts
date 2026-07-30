import { addLog } from "./request-context";

type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

const currentLevel = LEVELS[process.env.LOG_LEVEL as LogLevel] ?? LEVELS.info;

function shouldLog(level: LogLevel): boolean {
	return LEVELS[level] >= currentLevel;
}

function format(level: LogLevel, message: string, data?: unknown): string {
	const timestamp = new Date().toISOString();
	const prefix = `[${timestamp}] ${level.toUpperCase()}`;
	if (data === undefined) return `${prefix} ${message}`;
	return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
}

export const logger = {
	debug(message: string, data?: unknown) {
		addLog({
			level: "debug",
			message,
			data,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("debug")) return;
		console.debug(format("debug", message, data));
	},

	info(message: string, data?: unknown) {
		addLog({
			level: "info",
			message,
			data,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("info")) return;
		console.info(format("info", message, data));
	},

	warn(message: string, data?: unknown) {
		addLog({
			level: "warn",
			message,
			data,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("warn")) return;
		console.warn(format("warn", message, data));
	},

	error(message: string, error?: unknown) {
		addLog({
			level: "error",
			message,
			data: error,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("error")) return;
		console.error(format("error", message, error));
	},
};
