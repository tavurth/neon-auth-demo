#!/usr/bin/env bash
# Check: Data props should use shared types (heuristic)
VIOLATIONS=$(git ls-files '*.tsx' -- src/lib/components/ | xargs grep -n -E ':\s*\{[^}]*(id|created_at|updated_at|user_id)[^}]*\}' 2>/dev/null | grep -v 'import' | grep -v '@/types' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Inline data type found in component props (use shared types):"
  echo "$VIOLATIONS"
  echo "Use NoteRow, NoteInsert etc. from @/types instead."
fi
