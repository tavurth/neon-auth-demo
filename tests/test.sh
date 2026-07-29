#!/usr/bin/env bash
set -euo pipefail

DIR="$(dirname "$0")"
ERRORS=0

# Run architecture checks
if ! bash "$DIR/architecture/test.sh"; then
    ERRORS=1
fi

# Run e2e tests
echo ""
echo "=== E2E tests ==="
FILTER="${1:-}"
for f in "$DIR"/e2e/*"${FILTER}"*.hurl; do
    [ -f "$f" ] || continue
    echo "Running: $(basename "$f")"
    hurl --no-output --color --variable base_url="http://localhost:3000" "$f"
done

if [ $ERRORS -eq 1 ]; then
    exit 1
fi

echo ""
echo "All checks passed."
