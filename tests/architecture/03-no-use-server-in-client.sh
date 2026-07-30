#!/usr/bin/env bash
# Check: No "use server" in client code
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' | grep -E '^src/lib/(components|frontend)/' | xargs grep -n '"use server"' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "'use server' found in client code:"
  echo "$VIOLATIONS"
  echo ""
  echo "Server actions belong in services:"
  echo ""
  echo "  // src/lib/backend/services/notes.ts"
  echo '  "use server";'
  echo ""
  echo "  export async function listNotes(userId: string) { ... }"
  exit 1
fi
