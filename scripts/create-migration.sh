#!/usr/bin/env bash
set -euo pipefail

NAME="${1:?Usage: bun run create:migration <name>}"

# Validate snake_case
if ! echo "$NAME" | grep -qE '^[a-z][a-z0-9_]+$'; then
  echo "Error: Migration name must be snake_case (e.g. create_users, add_email_index)"
  exit 1
fi

# Get next sequence number
LAST=$(ls db/migrations/*.sql 2>/dev/null | sort | tail -1 | grep -oE '^[0-9]+' || echo "0")
NEXT=$((10#${LAST} + 1))
PREFIX=$(printf "%03d" $NEXT)

FILE="db/migrations/${PREFIX}_${NAME}.sql"

if [ -f "$FILE" ]; then
  echo "Error: $FILE already exists"
  exit 1
fi

cat > "$FILE" << EOF
-- migrate:up


-- migrate:down


EOF

echo "Created $FILE"
echo "Edit the file to add your SQL."
