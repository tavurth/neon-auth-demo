#!/usr/bin/env bash
# Check: No backend imports in client code
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | grep -E '^src/lib/(components|frontend)/' | xargs grep -n '@/backend/' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Backend imports found in client code:"
  echo "$VIOLATIONS"
  echo "Components must call API routes via @/frontend/api/client."
  exit 1
fi
