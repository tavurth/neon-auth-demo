#!/usr/bin/env bash
# Check: No backend imports in client code
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | grep -E '^src/lib/(components|frontend)/' | xargs grep -n '@/backend/' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Backend imports found in client code:"
  echo "$VIOLATIONS"
  echo ""
  echo "Components must call API routes via the client:"
  echo ""
  echo "  import { api } from '@/frontend/api/client';"
  echo ""
  echo "  const notes = await api.notes.list();"
  exit 1
fi
