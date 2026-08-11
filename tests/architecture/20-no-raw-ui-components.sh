#!/usr/bin/env bash
# Check: No raw HTML when UI components exist
# Enforces using @/components/ui primitives instead of raw <button>, <input>, <card>
DIR="$(dirname "$0")"
. "$DIR/utils.sh"

VIOLATIONS=""

# Check for raw <button> tags (excluding UI primitives)
BUTTON_MATCHES=$(git_files '*.tsx' | grep -v 'components/ui/' | xargs grep -n '<button' 2>/dev/null || true)
if [ -n "$BUTTON_MATCHES" ]; then
  VIOLATIONS="${VIOLATIONS}${BUTTON_MATCHES}\n"
fi

# Check for raw <input> tags (excluding UI primitives)
INPUT_MATCHES=$(git_files '*.tsx' | grep -v 'components/ui/' | xargs grep -n '<input' 2>/dev/null || true)
if [ -n "$INPUT_MATCHES" ]; then
  VIOLATIONS="${VIOLATIONS}${INPUT_MATCHES}\n"
fi

if [ -n "$VIOLATIONS" ]; then
  # Extract available UI component exports
  AVAILABLE=$(grep -oE 'export \{ [^}]+ \}' src/lib/frontend/components/ui/index.ts 2>/dev/null | sed 's/export { //' | sed 's/ }//' | tr ',' '\n' | sed 's/^ *//' | tr '\n' ' ' | sed 's/ $//')
  
  echo "Raw HTML found when UI components exist:"
  echo -e "$VIOLATIONS"
  echo ""
  echo "Available UI components: $AVAILABLE"
  echo ""
  echo "Use components from @/components/ui instead:"
  echo ""
  echo "  import { Button, Input } from '@/components/ui';"
  echo ""
  echo "  <Button variant=\"primary\" size=\"md\">Click me</Button>"
  echo "  <Input placeholder=\"Type here\" />"
  exit 1
fi
