#!/usr/bin/env bash
# Check: No inline type definitions in backend code (use shared types)
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
VIOLATIONS=$(git_files '*.ts' | xargs grep -n -E ':\s*\{[^}]*\}\s*[,)]' 2>/dev/null | grep -v 'import' | grep -v 'return' | grep -v -E ":\s*\{[^}]*'[^']*'" | grep -v -E ':\s*\{[^}]*"[^"]*"' || true)

if [ -n "$VIOLATIONS" ]; then
  AVAILABLE=$(grep -E '^export (type|interface)' src/lib/shared/types/index.ts src/lib/shared/types/db.ts 2>/dev/null | sed 's/export //' | awk '{print $2}' | tr -d ';' | tr '\n' ' ' | sed 's/ $//')
  echo "Inline type definitions found in backend code:"
  echo "$VIOLATIONS"
  echo ""
  echo "Available types from @/types: $AVAILABLE"
  echo ""
  echo "Use types from @/types or define in the same file as the function."
  exit 1
fi
