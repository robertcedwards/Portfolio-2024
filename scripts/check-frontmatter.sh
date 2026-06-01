#!/bin/bash
# Quick frontmatter length check before pushing.
# Run: bash scripts/check-frontmatter.sh

ERRORS=0

check_field() {
  local file="$1"
  local field="$2"
  local limit="$3"

  value=$(grep "^${field}:" "$file" | head -1 | sed "s/^${field}: *//" | tr -d '"'"'" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')
  len=${#value}

  if [ "$len" -gt "$limit" ]; then
    echo "❌  $(basename $file): $field is ${len} chars (limit ${limit})"
    echo "    → $value"
    ERRORS=$((ERRORS + 1))
  fi
}

for file in src/content/post/*.md src/content/post/*.mdx src/content/project/*.md src/content/project/*.mdx; do
  [ -f "$file" ] || continue
  check_field "$file" "title" 60
  check_field "$file" "description" 160
done

if [ "$ERRORS" -eq 0 ]; then
  echo "✅  All titles and descriptions within limits."
else
  echo ""
  echo "$ERRORS error(s) found. Fix before pushing."
  exit 1
fi
