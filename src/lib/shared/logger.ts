type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3,
};

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel) {
	currentLevel = level;
}

function shouldLog(level: LogLevel): boolean {
	return LEVELS[level] >= LEVELS[currentLevel];
}

function format(level: LogLevel, message: string, data?: unknown): string {
	const prefix = `[${level.toUpperCase()}] ${message}`;
	if (data !== undefined) return `${prefix} ${JSON.stringify(data, null, 2)}`;
	return prefix;
}

type LogSink = (entry: {
	level: string;
	message: string;
	data?: unknown;
	timestamp: string;
}) => void;

let sink: LogSink | null = null;

export function setLogSink(fn: LogSink) {
	sink = fn;
}

export const logger = {
	debug(message: string, data?: unknown) {
		sink?.({
			level: "debug",
			message,
			data,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("debug")) return;
		// biome-ignore lint/suspicious/noConsole: logger abstraction
		console.debug(format("debug", message, data));
	},

	info(message: string, data?: unknown) {
		sink?.({
			level: "info",
			message,
			data,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("info")) return;
		// biome-ignore lint/suspicious/noConsole: logger abstraction
		console.info(format("info", message, data));
	},

	warn(message: string, data?: unknown) {
		sink?.({
			level: "warn",
			message,
			data,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("warn")) return;
		// biome-ignore lint/suspicious/noConsole: logger abstraction
		console.warn(format("warn", message, data));
	},

	error(message: string, error?: unknown) {
		sink?.({
			level: "error",
			message,
			data: error,
			timestamp: new Date().toISOString(),
		});
		if (!shouldLog("error")) return;
		// biome-ignore lint/suspicious/noConsole: logger abstraction
		console.error(format("error", message, error));
	},
};
