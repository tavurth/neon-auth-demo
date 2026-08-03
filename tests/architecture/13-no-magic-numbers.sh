#!/usr/bin/env bash
# Check: Magic numbers in component/frontend logic
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
# Excludes: strings, Tailwind classes, imports, type defs, constants
VIOLATIONS=$(git_files '*.ts' '*.tsx' | grep -v 'constants' | grep -v 'page.tsx' | xargs grep -n -E '(>\s*[0-9]{2,}|<\s*[0-9]{2,}|===\s*[0-9]{2,}|!==\s*[0-9]{2,}|\[\s*[0-9]+\s*\])' 2>/dev/null | grep -v -E "(className|import|from|type |interface |'[0-9]|\"[0-9]|//[0-9]|bg-|text-|hover:)" | grep -v -E "'[^']*\[[0-9]+\][^']*'" | grep -v -E "\"[^\"]*\[[0-9]+\][^\"]*\"" || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Magic numbers in logic:"
  echo "$VIOLATIONS"
  echo ""
  echo "Move to src/lib/shared/constants/index.ts"
  exit 1
fi
