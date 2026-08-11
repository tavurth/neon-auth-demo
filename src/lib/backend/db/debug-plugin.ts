import type {
	KyselyPlugin,
	PluginTransformQueryArgs,
	PluginTransformResultArgs,
	QueryResult,
	RootOperationNode,
	UnknownRow,
} from "kysely";
import { addQuery } from "@/backend/request-context";
import { logger } from "@/lib/shared/logger";
import { getDbDebugFilter } from "../env";

// PostgresQueryCompiler is exported at runtime but not in types
const PostgresQueryCompiler =
	// biome-ignore lint/suspicious/noExplicitAny: runtime import not in types
	(globalThis as any).PostgresQueryCompiler ??
	(() => {
		const kysely = require("kysely");
		return kysely.PostgresQueryCompiler;
	})();

const queryData = new WeakMap<object, { node: RootOperationNode; start: number }>();
const compiler = new PostgresQueryCompiler();

function prettyPrint(label: string, data: unknown) {
	logger.debug(`[${label}]`, data);
}

function matchesFilter(sql: string, filter: string[]): boolean {
	if (filter.length === 0) return true;
	const lower = sql.toLowerCase();
	return filter.some((term) => lower.includes(term));
}

export class DebugPlugin implements KyselyPlugin {
	transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
		queryData.set(args.queryId, { node: args.node, start: Date.now() });
		return args.node;
	}

	async transformResult(args: PluginTransformResultArgs): Promise<QueryResult<UnknownRow>> {
		const data = queryData.get(args.queryId);
		if (!data) return args.result;

		const duration = Date.now() - data.start;
		const compiled = compiler.compileQuery(data.node);
		const filter = getDbDebugFilter();

		if (!matchesFilter(compiled.sql, filter)) return args.result;

		prettyPrint(`query [${duration}ms]`, {
			sql: compiled.sql,
			params: compiled.parameters,
		});
		prettyPrint("result", { rows: args.result.rows });

		addQuery({
			sql: compiled.sql,
			params: compiled.parameters as unknown[],
			rows: args.result.rows,
			duration,
		});

		return args.result;
	}
}
