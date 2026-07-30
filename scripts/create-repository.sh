#!/usr/bin/env bash
set -euo pipefail

NAME="${1:?Usage: bun run create:repository <name>}"

# Validate lowercase
if ! echo "$NAME" | grep -qE '^[a-z][a-z0-9-]+$'; then
  echo "Error: Repository name must be lowercase (e.g. notes, users, blog-posts)"
  exit 1
fi

FILE="src/lib/backend/repositories/${NAME}.ts"

if [ -f "$FILE" ]; then
  echo "Error: $FILE already exists"
  exit 1
fi

TABLE_NAME="${NAME}s"
TYPES_NAME="$(echo "${TABLE_NAME}" | sed 's/.*/\u&/')"

cat > "$FILE" << EOF
import { db } from "@/backend/db";
import type { ${TYPES_NAME}Row, ${TYPES_NAME}Insert } from "@/types";

export function findAll(): Promise<${TYPES_NAME}Row[]> {
	return db
		.selectFrom("${TABLE_NAME}")
		.selectAll()
		.execute();
}

export function findById(id: string): Promise<${TYPES_NAME}Row | undefined> {
	return db
		.selectFrom("${TABLE_NAME}")
		.where("id", "=", id)
		.selectAll()
		.executeTakeFirst();
}

export function create(data: ${TYPES_NAME}Insert): Promise<${TYPES_NAME}Row | undefined> {
	return db
		.insertInto("${TABLE_NAME}")
		.values(data)
		.returningAll()
		.executeTakeFirst();
}

export function update(id: string, data: Partial<${TYPES_NAME}Insert>): Promise<${TYPES_NAME}Row | undefined> {
	return db
		.updateTable("${TABLE_NAME}")
		.set(data)
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst();
}

export function deleteById(id: string): Promise<void> {
	return db
		.deleteFrom("${TABLE_NAME}")
		.where("id", "=", id)
		.execute()
		.then(() => undefined);
}
EOF

echo "Created $FILE"
echo ""
echo "Don't forget to:"
echo "  1. Add the table to db/migrations/"
echo "  2. Run bunx dbmate up"
echo "  3. Run bun run types:generate"
