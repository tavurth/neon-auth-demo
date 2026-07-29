#!/usr/bin/env bash
# Check: Client components with interactivity must have "use client"
# Only checks lib/components (not app/ pages or UI primitives without handlers)
VIOLATIONS=$(git ls-files '*.tsx' -- src/lib/components/ | grep -v 'ui/' | xargs grep -rL '"use client"' 2>/dev/null | while read -r file; do
  if grep -qE '(onClick|onChange|onSubmit|useState|useEffect|useRouter)' "$file" 2>/dev/null; then
    echo "$file"
  fi
done)

if [ -n "$VIOLATIONS" ]; then
  echo "Interactive components missing 'use client':"
  echo "$VIOLATIONS"
  exit 1
fi
