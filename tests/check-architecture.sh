#!/usr/bin/env bash
set -euo pipefail

# Check for @backend imports in client-only directories
VIOLATIONS=$(grep -rn '@backend' \
  --include='*.ts' --include='*.tsx' \
  src/lib/components/ \
  src/lib/frontend/ \
  2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: @backend imports found in client-only directories:"
  echo ""
  echo "$VIOLATIONS"
  echo ""
  echo "Components and frontend code must not import from @backend."
  echo "Use server actions (services) instead."
  exit 1
fi

# Check for direct DB imports in components/frontend
VIOLATIONS=$(grep -rn '@/backend/db' \
  --include='*.ts' --include='*.tsx' \
  src/lib/components/ \
  src/lib/frontend/ \
  src/app/ \
  2>/dev/null || true)

# Allow in api routes
VIOLATIONS=$(echo "$VIOLATIONS" | grep -v 'src/app/api/' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Direct DB imports found outside repositories:"
  echo ""
  echo "$VIOLATIONS"
  echo ""
  echo "Only repositories should import from @/backend/db."
  exit 1
fi

echo "Architecture checks passed."
