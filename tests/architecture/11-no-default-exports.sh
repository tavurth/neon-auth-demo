#!/usr/bin/env bash
# Check: No default exports in components/frontend (pages use them)
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
VIOLATIONS=$(git_files '*.tsx' | grep -E '^src/lib/(components|frontend)/' | xargs grep -n 'export default' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Default export found in component/frontend code:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use named exports instead:"
  echo ""
  echo "  export function NotesList() { ... }"
  echo ""
  echo "  import { NotesList } from '@/components/notes-list';"
  exit 1
fi
