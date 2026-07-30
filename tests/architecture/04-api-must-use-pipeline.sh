#!/usr/bin/env bash
# Check: API routes must use withCommon pipeline
VIOLATIONS=$(git ls-files 'route.ts' -- 'src/app/api/' | xargs grep -n 'export const.*= async' 2>/dev/null | grep -v 'withCommon' || true)

if [ -n "$VIOLATIONS" ]; then
  echo "API route not using withCommon pipeline:"
  echo "$VIOLATIONS"
  echo ""
  echo "Wrap handlers with withCommon:"
  echo ""
  echo '  import { withCommon } from "@/backend/pipeline";'
  echo ""
  echo '  export const GET = withCommon(async ({ userId }) => {'
  echo "    const notes = await listNotes(userId);"
  echo "    return NextResponse.json(notes);"
  echo "  });"
  exit 1
fi
