import type {
	KyselyPlugin,
	PluginTransformQueryArgs,
	PluginTransformResultArgs,
	QueryResult,
	RootOperationNode,
	UnknownRow,
} from "kysely";
import { getDbDebugFilter } from "../env";

const queryData = new WeakMap<
	object,
	{ node: RootOperationNode; shouldLog: boolean }
>();

function prettyPrint(label: string, data: unknown) {
	console.debug(`[${label}]`, JSON.stringify(data, null, 2));
}

function matchesFilter(node: RootOperationNode, filter: string[]): boolean {
	if (filter.length === 0) return true;
	const json = JSON.stringify(node).toLowerCase();
	return filter.some((term) => json.includes(term));
}

export class DebugPlugin implements KyselyPlugin {
	transformQuery(args: PluginTransformQueryArgs): RootOperationNode {
		const filter = getDbDebugFilter();
		const shouldLog = matchesFilter(args.node, filter);
		queryData.set(args.queryId, { node: args.node, shouldLog });
		return args.node;
	}

	async transformResult(
		args: PluginTransformResultArgs,
	): Promise<QueryResult<UnknownRow>> {
		const data = queryData.get(args.queryId);
		if (data?.shouldLog) {
			prettyPrint("query", data.node);
			prettyPrint("result", { rows: args.result.rows });
		}
		return args.result;
	}
}
