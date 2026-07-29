#!/usr/bin/env bash
set -euo pipefail

DIR="$(dirname "$0")/e2e"
FILTER="${1:-}"

for f in "$DIR"/*"${FILTER}"*.hurl; do
    [ -f "$f" ] || continue
    echo "Running: $(basename "$f")"
    hurl --no-output --color --variable base_url="http://localhost:3000" "$f"
done

echo "All tests passed."
