#!/usr/bin/env bash
# Check: No "use server" in client code
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | grep -E '^src/lib/(components|frontend)/' | xargs grep -n '"use server"' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "'use server' found in client code:"
  echo "$VIOLATIONS"
  echo "Server actions belong in @/backend/services."
  exit 1
fi
