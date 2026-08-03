#!/usr/bin/env bash
# Check: No barrel re-exports from backend index files
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
VIOLATIONS=$(git_files 'src/lib/backend/**/index.ts' | xargs grep -n 'export.*from' 2>/dev/null || true)

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
