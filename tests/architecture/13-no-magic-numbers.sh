#!/usr/bin/env bash
# Check: Magic numbers in component/frontend logic (warn only)
# Excludes: strings, Tailwind classes, imports, type defs, constants
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | grep -E '^src/(lib/(components|frontend)|app)/' | grep -v 'constants' | grep -v 'page.tsx' | xargs grep -n -E '(>\s*[0-9]{2,}|<\s*[0-9]{2,}|===\s*[0-9]{2,}|!==\s*[0-9]{2,}|\[\s*[0-9]+\s*\])' 2>/dev/null | grep -v -E "(className|import|from|type |interface |'[0-9]|\"[0-9]|//[0-9]|bg-|text-|hover:)" || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Possible magic numbers in logic:"
  echo "$VIOLATIONS"
  echo ""
  echo "Move to src/lib/shared/constants/index.ts"
fi
