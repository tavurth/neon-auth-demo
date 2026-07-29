#!/usr/bin/env bash
set -euo pipefail

DIR="$(dirname "$0")"
ERRORS=0

for f in "$DIR"/[0-9]*.sh; do
    [ -f "$f" ] || continue
    name=$(basename "$f")
    printf "  %s " "$name"
    if bash "$f" > /dev/null 2>&1; then
        echo "✓"
    else
        echo "✗"
        bash "$f" 2>&1 | sed 's/^/    /'
        ERRORS=1
    fi
done

if [ $ERRORS -eq 1 ]; then
    echo ""
    echo "Architecture checks failed."
    exit 1
fi

echo ""
echo "Architecture checks passed."
