#!/usr/bin/env bash
# Check: All migrations must have up and down blocks
VIOLATIONS=0

for f in $(git ls-files -- 'db/migrations/*.sql'); do
  if ! grep -q 'migrate:up' "$f" 2>/dev/null; then
    echo "Missing 'migrate:up' in $f"
    VIOLATIONS=1
  fi
  if ! grep -q 'migrate:down' "$f" 2>/dev/null; then
    echo "Missing 'migrate:down' in $f"
    VIOLATIONS=1
  fi
done

if [ $VIOLATIONS -eq 1 ]; then
  echo ""
  echo "Every migration must have both -- migrate:up and -- migrate:down:"
  echo ""
  echo "  -- migrate:up"
  echo "  CREATE TABLE users (id UUID PRIMARY KEY);"
  echo ""
  echo "  -- migrate:down"
  echo "  DROP TABLE users;"
  exit 1
fi
