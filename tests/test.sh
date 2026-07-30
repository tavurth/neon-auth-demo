#!/usr/bin/env bash
set -euo pipefail

set -a
source "$(dirname "$0")/../.env"
set +a

TOKEN=$(node -e "
const { SignJWT } = require('jose')
const secret = new TextEncoder().encode('${JWT_SECRET}')
new SignJWT({ sub: 'test-user', scopes: ['read', 'write'] })
  .setProtectedHeader({ alg: 'HS256' })
  .setIssuedAt()
  .setExpirationTime('1h')
  .sign(secret)
  .then(t => console.log(t))
")

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
    hurl --no-output --color \
        --variable base_url="http://localhost:3000" \
        --variable token="$TOKEN" \
        "$f"
done

if [ $ERRORS -eq 1 ]; then
    exit 1
fi

echo ""
echo "All checks passed."
