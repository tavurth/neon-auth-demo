#!/usr/bin/env bash
# Check: Data props should use shared types (heuristic)
VIOLATIONS=$(git ls-files '*.tsx' -- src/lib/frontend/components/ | xargs grep -n -E ':\s*\{[^}]*(id|created_at|updated_at|user_id)\s*:' 2>/dev/null | grep -v 'import' | grep -v '@/types' || true)

if [ -n "$VIOLATIONS" ]; then
  AVAILABLE=$(grep -E '^export (type|interface)' src/lib/shared/types/index.ts src/lib/shared/types/db.ts 2>/dev/null | sed 's/export //' | awk '{print $2}' | tr -d ';' | tr '\n' ' ' | sed 's/ $//')
  echo "Inline data type found in component props (use shared types):"
  echo "$VIOLATIONS"
  echo ""
  echo "Available types from @/types: $AVAILABLE"
  echo ""
  echo "Use shared types for data props:"
  echo ""
  echo "  import type { NoteRow } from '@/types';"
  echo ""
  echo "  function NoteCard({ note }: { note: NoteRow }) { ... }"
  exit 1
fi
