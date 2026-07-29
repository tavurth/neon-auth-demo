#!/usr/bin/env bash
# Check: No raw fetch() in components
VIOLATIONS=$(git ls-files '*.tsx' | grep -E '^src/lib/components/' | xargs grep -n 'fetch(' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Raw fetch() found in components:"
  echo "$VIOLATIONS"
  echo "Use api client from @/frontend/api/client instead."
  exit 1
fi
