#!/usr/bin/env bash
# Check: No hardcoded URLs/ports
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | xargs grep -n -E 'localhost:\d+|127\.0\.0\.1' 2>/dev/null | grep -v 'env.ts' | grep -v -E '(//|/\*|\*|<code|<pre)' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Hardcoded URL/port found:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use environment variables:"
  echo ""
  echo "  // .env"
  echo "  API_URL=http://localhost:3000"
  echo ""
  echo "  // src/lib/backend/env.ts"
  echo "  export function getApiUrl() {"
  echo "    return process.env.API_URL!;"
  echo "  }"
  exit 1
fi
