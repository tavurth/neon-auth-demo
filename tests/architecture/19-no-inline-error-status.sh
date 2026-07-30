#!/usr/bin/env bash
# Check: No inline 4xx/5xx status codes in API routes (use custom errors)
VIOLATIONS=$(git ls-files 'route.ts' -- 'src/app/api/' | xargs grep -n -E 'status:\s*(4[0-9]{2}|5[0-9]{2})' 2>/dev/null || true)

if [ -n "$VIOLATIONS" ]; then
  echo "Inline error status codes found in API routes:"
  echo "$VIOLATIONS"
  echo ""
  echo "Use custom errors instead:"
  echo ""
  echo "  import { ValidationError } from '@/lib/shared/errors';"
  echo "  throw new ValidationError('Missing title');"
  exit 1
fi
