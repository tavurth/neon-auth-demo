#!/usr/bin/env bash
# Check: No raw SQL (use Kysely query builder)
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/lib/backend/ | xargs grep -n 'sql`' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Raw SQL found (use Kysely query builder instead):"
  echo "$VIOLATIONS"
  echo ""
  echo "Use Kysely's type-safe query builder:"
  echo ""
  echo "  const notes = await db"
  echo "    .selectFrom('notes')"
  echo "    .where('user_id', '=', userId)"
  echo "    .selectAll()"
  echo "    .execute();"
  exit 1
fi
