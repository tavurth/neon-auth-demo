#!/usr/bin/env bash
# Check: No barrel re-exports from backend index files
VIOLATIONS=$(git ls-files 'index.ts' -- src/lib/backend/ | xargs grep -n 'export.*from' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Barrel re-export found in backend:"
  echo "$VIOLATIONS"
  echo ""
  echo "Import directly from specific files:"
  echo ""
  echo "  import { listNotes } from '@/backend/services/notes';"
  echo ""
  echo "  NOT: import { listNotes } from '@/backend/services';"
  exit 1
fi
