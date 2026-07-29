#!/usr/bin/env bash
# Check: No inline type definitions in service/repository files (use shared types)
VIOLATIONS=$(git ls-files '*.ts' -- src/lib/backend/services/ src/lib/backend/repositories/ | xargs grep -n -E ':\s*\{' 2>/dev/null | grep -v 'import' | grep -v 'return' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Inline type definitions found in backend code:"
  echo "$VIOLATIONS"
  echo "Use types from @/types or define in the same file as the function."
fi
