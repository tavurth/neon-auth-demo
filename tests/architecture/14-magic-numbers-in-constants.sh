#!/usr/bin/env bash
# Check: Magic numbers should use named constants
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/lib/components/ src/lib/frontend/ src/app/ | xargs grep -n -E ':\s*\d{2,}\b' 2>/dev/null | grep -v -E '(className|style|width|height|size|col|row|gap|p[mxyblrt]?-|m[xyblrt]?-|text-|font-|rounded|border|shadow|opacity|z-|top|bottom|left|right|inset)' | grep -v 'constants' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Possible magic numbers in component code:"
  echo "$VIOLATIONS"
  echo "Move to src/lib/shared/constants.ts"
fi
