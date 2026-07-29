#!/usr/bin/env bash
set -euo pipefail

ERRORS=0

# 1. No backend imports in components or frontend
VIOLATIONS=$(grep -rn '@/backend/' \
  --include='*.ts' --include='*.tsx' \
  src/lib/components/ \
  src/lib/frontend/ \
  2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Backend imports found in client code:"
  echo "$VIOLATIONS"
  echo ""
  echo "Components must call API routes via @/frontend/api/client."
  ERRORS=1
fi

# 2. No raw fetch() in components (use api client)
VIOLATIONS=$(grep -rn 'fetch(' \
  --include='*.tsx' \
  src/lib/components/ \
  2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Raw fetch() found in components:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use api client from @/frontend/api/client instead."
  ERRORS=1
fi

# 3. No "use server" in components or frontend
VIOLATIONS=$(grep -rn '"use server"' \
  --include='*.ts' --include='*.tsx' \
  src/lib/components/ \
  src/lib/frontend/ \
  2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: 'use server' found in client code:"
  echo "$VIOLATIONS"
  echo ""
  echo "Server actions belong in @/backend/services."
  ERRORS=1
fi

# 4. API routes must use withCommon pipeline
VIOLATIONS=$(grep -rn 'export const.*= async' \
  --include='route.ts' \
  src/app/api/ \
  2>/dev/null | grep -v 'withCommon' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: API route not using withCommon pipeline:"
  echo "$VIOLATIONS"
  echo ""
  echo "All API routes must use withCommon() to enforce auth."
  ERRORS=1
fi

# 5. Direct DB imports forbidden outside repositories
VIOLATIONS=$(grep -rn '@/backend/db' \
  --include='*.ts' --include='*.tsx' \
  src/ \
  2>/dev/null | grep -v 'src/lib/backend/' | grep -v 'src/app/api/' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Direct DB imports found outside repositories:"
  echo "$VIOLATIONS"
  ERRORS=1
fi

# 6. No relative imports across top-level directories
VIOLATIONS=$(grep -rn "from '\.\." \
  --include='*.ts' --include='*.tsx' \
  src/lib/components/ \
  src/lib/frontend/ \
  src/lib/backend/ \
  src/app/ \
  2>/dev/null | grep -v 'node_modules' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Relative imports found across directories:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use path aliases (@/backend, @/frontend, @/components) instead."
  ERRORS=1
fi

# 7. No raw process.env outside env.ts
VIOLATIONS=$(grep -rn 'process\.env\.' \
  --include='*.ts' --include='*.tsx' \
  src/ \
  2>/dev/null | grep -v 'src/lib/backend/env.ts' | grep -v 'src/lib/shared/' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "ERROR: Raw process.env access found:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use getters from @/backend/env instead."
  ERRORS=1
fi

# 8. Files over 300 lines (warn only)
WARNINGS=0
while IFS= read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 300 ]; then
    echo "WARNING: $file is $lines lines (limit: 300)"
    WARNINGS=1
  fi
done < <(find src -name "*.ts" -o -name "*.tsx" | grep -v node_modules | grep -v .next)

if [ $WARNINGS -eq 1 ]; then
  echo ""
fi

if [ $ERRORS -eq 1 ]; then
  echo ""
  echo "Architecture: components → API routes → services → repos → DB"
  exit 1
fi

echo "Architecture checks passed."
