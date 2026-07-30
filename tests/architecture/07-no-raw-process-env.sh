#!/usr/bin/env bash
# Check: No raw process.env outside env.ts
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | grep -v 'src/lib/backend/env.ts' | grep -v 'src/lib/shared/' | xargs grep -n 'process\.env\.' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Raw process.env access found:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use getters from env.ts instead:"
  echo ""
  echo "  import { getDatabaseUrl } from '@/backend/env';"
  echo ""
  echo "  const url = getDatabaseUrl();"
  exit 1
fi
