#!/usr/bin/env bash
# Check: No magic numbers (except 0, 1, 100, 300 which are common)
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | xargs grep -n -E '\b\d{2,}\b' 2>/dev/null | grep -v -E '(0|1|100|300|\.0\.|node_modules|\.d\.ts|\.json)' | grep -v 'env.ts' | grep -v 'types.ts' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Possible magic numbers found:"
  echo "$VIOLATIONS"
  echo "Consider using named constants."
fi
