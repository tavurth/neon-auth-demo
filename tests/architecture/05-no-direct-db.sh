#!/usr/bin/env bash
# Check: No direct DB imports outside repositories
VIOLATIONS=$(git ls-files '*.ts' '*.tsx' -- src/ | grep -v 'src/lib/backend/repositories/' | xargs grep -n '@/backend/db' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Direct DB imports found outside repositories:"
  echo "$VIOLATIONS"
  echo ""
  echo "Only repositories should access the database:"
  echo ""
  echo "  // src/lib/backend/repositories/notes.ts"
  echo '  import { db } from "@/backend/db";'
  echo ""
  echo "  export function findNotesByUserId(userId: string) {"
  echo "    return db.selectFrom('notes').where('user_id', '=', userId).execute();"
  echo "  }"
  exit 1
fi
