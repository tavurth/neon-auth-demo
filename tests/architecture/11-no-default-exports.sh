#!/usr/bin/env bash
# Check: No default exports in components/frontend (pages use them)
VIOLATIONS=$(git ls-files '*.tsx' | grep -E '^src/lib/(components|frontend)/' | xargs grep -n 'export default' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Default export found in component/frontend code:"
  echo "$VIOLATIONS"
  echo "Use named exports instead."
  exit 1
fi
