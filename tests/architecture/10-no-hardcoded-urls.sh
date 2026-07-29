#!/usr/bin/env bash
# Check: No hardcoded localhost or ports (exclude comments and JSX text)
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | xargs grep -n -E 'localhost:\d+|127\.0\.0\.1' 2>/dev/null | grep -v 'env.ts' | grep -v -E '(//|/\*|\*|<code|<pre)' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Hardcoded URL/port found:"
  echo "$VIOLATIONS"
  echo "Use environment variables instead."
  exit 1
fi
