#!/usr/bin/env bash
set -euo pipefail

NAME="${1:?Usage: bun run create:service <name>}"

# Validate lowercase
if ! echo "$NAME" | grep -qE '^[a-z][a-z0-9-]+$'; then
  echo "Error: Service name must be lowercase (e.g. notes, users, blog-posts)"
  exit 1
fi

FILE="src/lib/backend/services/${NAME}.ts"

if [ -f "$FILE" ]; then
  echo "Error: $FILE already exists"
  exit 1
fi

# Capitalize first letter for type names
TABLE_NAME="${NAME}s"
TYPES_NAME="$(echo "${TABLE_NAME}" | sed 's/.*/\u&/')"

cat > "$FILE" << EOF
"use server";

import {
	findAll,
	findById,
	create,
	update,
	deleteById,
} from "@/backend/repositories/${NAME}";

export async function list${TYPES_NAME}() {
	return findAll();
}

export async function get${TYPES_NAME}(id: string) {
	const item = await findById(id);
	if (!item) throw new Error("${TYPES_NAME} not found");
	return item;
}

export async function create${TYPES_NAME}(data: Parameters<typeof create>[0]) {
	return create(data);
}

export async function update${TYPES_NAME}(id: string, data: Parameters<typeof update>[1]) {
	return update(id, data);
}

export async function delete${TYPES_NAME}(id: string) {
	return deleteById(id);
}
EOF

echo "Created $FILE"
