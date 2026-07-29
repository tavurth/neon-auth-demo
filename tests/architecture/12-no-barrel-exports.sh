#!/usr/bin/env bash
# Check: No barrel re-exports from backend index files
VIOLATIONS=$(git ls-files 'index.ts' -- src/lib/backend/ | xargs grep -n 'export.*from' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Barrel re-export found in backend:"
  echo "$VIOLATIONS"
  echo "Import directly from specific files, not barrel exports."
  exit 1
fi
