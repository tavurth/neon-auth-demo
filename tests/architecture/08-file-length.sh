#!/usr/bin/env bash
# Check: Files over 300 lines (warn only)
DIR="$(dirname "$0")"
. "$DIR/utils.sh"
VIOLATIONS=$(git_files '*.ts' '*.tsx' | while read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt 300 ]; then
    echo "$file: $lines lines"
  fi
done)

if [ -n "$VIOLATIONS" ]; then
  echo "Files over 300 lines:"
  echo "$VIOLATIONS"
  echo ""
  echo "Split into smaller files. One component/helper per file."
  exit 1
fi
