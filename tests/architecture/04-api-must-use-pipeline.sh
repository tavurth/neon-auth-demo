#!/usr/bin/env bash
# Check: API routes must use withCommon pipeline
VIOLATIONS=$(git ls-files 'route.ts' -- 'src/app/api/' | xargs grep -n 'export const.*= async' 2>/dev/null | grep -v 'withCommon' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "API route not using withCommon pipeline:"
  echo "$VIOLATIONS"
  echo "All API routes must use withCommon() to enforce auth."
  exit 1
fi
