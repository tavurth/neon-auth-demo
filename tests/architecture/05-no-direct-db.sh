#!/usr/bin/env bash
# Check: No direct DB imports outside repositories
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | grep -v 'src/lib/backend/' | grep -v 'src/app/api/' | xargs grep -n '@/backend/db' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Direct DB imports found outside repositories:"
  echo "$VIOLATIONS"
  exit 1
fi
