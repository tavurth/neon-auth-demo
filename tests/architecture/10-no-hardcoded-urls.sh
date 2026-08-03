#!/usr/bin/env bash
# Check: No hardcoded URLs/ports
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
VIOLATIONS=$(git_files 'src/*.ts' 'src/*.tsx' 'src/**/*.ts' 'src/**/*.tsx' | xargs grep -n -E 'localhost:\d+|127\.0\.0\.1' 2>/dev/null | grep -v 'env.ts' | grep -v -E '[^:]+:[0-9]+:\s*(//|/\*|\*)' || true)

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
