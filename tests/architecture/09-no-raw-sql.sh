#!/usr/bin/env bash
# Check: No raw SQL (use Kysely query builder instead)
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/lib/backend/ | xargs grep -n 'sql`' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Raw SQL found (use Kysely query builder instead):"
  echo "$VIOLATIONS"
  exit 1
fi
