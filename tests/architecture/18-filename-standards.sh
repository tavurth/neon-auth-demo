#!/usr/bin/env bash
# Check: Filenames follow naming conventions
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
ERRORS=0

# Components: must be PascalCase kebab (e.g. note-card.tsx)
VIOLATIONS=$(git_files '*.tsx' | grep -E '^src/lib/frontend/components/' | grep -v 'ui/' | while read -r file; do
  base=$(basename "$file" .tsx)
  if ! echo "$base" | grep -qE '^[a-z][a-z0-9-]+$'; then
    echo "$file (should be kebab-case like note-card.tsx)"
  fi
done)

if [ -n "$VIOLATIONS" ]; then
  echo "Component filenames must be kebab-case:"
  echo "$VIOLATIONS"
  ERRORS=1
fi

# Services/Repositories: must be lowercase (e.g. notes.ts)
VIOLATIONS=$(git_files '*.ts' | grep -E '^src/lib/backend/(services|repositories)/' | while read -r file; do
  base=$(basename "$file" .ts)
  if ! echo "$base" | grep -qE '^[a-z][a-z0-9-]+$'; then
    echo "$file (should be lowercase like notes.ts)"
  fi
done)

if [ -n "$VIOLATIONS" ]; then
  echo "Service/repository filenames must be lowercase:"
  echo "$VIOLATIONS"
  ERRORS=1
fi

# Migrations: must be snake_case with number prefix
VIOLATIONS=$(git_files | grep -E '^db/migrations/.*\.sql$' | while read -r file; do
  base=$(basename "$file" .sql)
  if ! echo "$base" | grep -qE '^[0-9]+_[a-z][a-z0-9_]+$'; then
    echo "$file (should be like 001_create_notes.sql)"
  fi
done)

if [ -n "$VIOLATIONS" ]; then
  echo "Migration filenames must be number_snake_case:"
  echo "$VIOLATIONS"
  ERRORS=1
fi

if [ $ERRORS -eq 1 ]; then
  exit 1
fi
