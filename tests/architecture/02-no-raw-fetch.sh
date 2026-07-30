#!/usr/bin/env bash
# Check: No raw fetch() in components
VIOLATIONS=$(git ls-files '*.tsx' | grep -E '^src/lib/frontend/components/' | xargs grep -n 'fetch(' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Raw fetch() found in components:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use the API client instead:"
  echo ""
  echo "  import { api } from '@/frontend/api/client';"
  echo ""
  echo "  const notes = await api.notes.list();"
  exit 1
fi
