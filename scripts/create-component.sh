#!/usr/bin/env bash
set -euo pipefail

NAME="${1:?Usage: bun run create:component <PascalCase>}"

# Validate PascalCase
if ! echo "$NAME" | grep -qE '^[A-Z][a-zA-Z0-9]+$'; then
  echo "Error: Component name must be PascalCase (e.g. NoteCard, SignInButton)"
  exit 1
fi

# Convert PascalCase to kebab-case
KEBAB=$(echo "$NAME" | sed 's/\([A-Z]\)/ \1/g' | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/^-//')

FILE="src/lib/frontend/components/${KEBAB}.tsx"

if [ -f "$FILE" ]; then
  echo "Error: $FILE already exists"
  exit 1
fi

mkdir -p "$(dirname "$FILE")"

cat > "$FILE" << EOF
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function ${NAME}() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>${NAME}</CardTitle>
			</CardHeader>
			<CardContent>{/* TODO */}</CardContent>
		</Card>
	);
}
EOF

echo "Created $FILE"
