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
		if (!shouldLog("debug")) return;
		console.debug(format("debug", message, data));
	},

	info(message: string, data?: unknown) {
		if (!shouldLog("info")) return;
		console.info(format("info", message, data));
	},

	warn(message: string, data?: unknown) {
		if (!shouldLog("warn")) return;
		console.warn(format("warn", message, data));
	},

	error(message: string, error?: unknown) {
		if (!shouldLog("error")) return;
		console.error(format("error", message, error));
	},
};
