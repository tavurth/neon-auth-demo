#!/usr/bin/env bash
# Check: Files over 300 lines (warn only)
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | while read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 300 ]; then
    echo "$file: $lines lines"
  fi
done)

if [ -n "$VIOLATIONS" ]; then
  echo "Files over 300 lines:"
  echo "$VIOLATIONS"
  exit 1
fi
