#!/usr/bin/env bash
# Check: No relative imports across directories
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
VIOLATIONS=$(git_files '*.ts' '*.tsx' | xargs grep -n "from '\.\." 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Relative imports found across directories:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use path aliases instead:"
  echo ""
  echo "  import { db } from '@/backend/db';"
  echo "  import { api } from '@/frontend/api/client';"
  echo "  import { Button } from '@/components/ui';"
  exit 1
fi
