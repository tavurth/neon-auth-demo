#!/usr/bin/env bash
# Check: No relative imports across directories
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | grep -E '^src/(lib/(components|frontend|backend)|app)/' | xargs grep -n "from '\.\." 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Relative imports found across directories:"
  echo "$VIOLATIONS"
  echo "Use path aliases (@/backend, @/frontend, @/components) instead."
  exit 1
fi
