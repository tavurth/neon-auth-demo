#!/usr/bin/env bash
# Check: No direct DB imports outside repositories
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | grep -v 'src/lib/backend/repositories/' | xargs grep -n '@/backend/db' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Direct DB imports found outside repositories:"
  echo "$VIOLATIONS"
  echo "Only repositories should import from @/backend/db."
  exit 1
fi
