#!/usr/bin/env bash
# Mide los SKILL.md (o plantillas de comando) de cada fuente en la versión revisada.
cd "$SDD_UPSTREAM_DIR" || exit 1
measure() {
  local repo=$1 tag=$2 pattern=$3
  echo "== $repo $tag"
  git -C "$repo" rev-parse -q --verify "$tag^{commit}" >/dev/null || { echo "  sin el tag"; return; }
  git -C "$repo" ls-tree -r --name-only "$tag" | grep -E "$pattern" | grep -v -E '^\.(opencode|rovodev|qoder|grok|trae|trae-cn|agent|agents|cursor|gemini|kiro|codex|github|windsurf|claude|pi)/' | while read -r f; do
    printf '%s %s\n' "$(git -C "$repo" show "$tag:$f" | wc -c)" "$f"
  done | sort -rn | awk '{ n++; if ($1 >= 20000) over++; if (n <= 4) print "  " $0 } END { print "  total " n ", >=20000: " over+0 }'
  echo "  menciones de compactación o del tope:"
  git -C "$repo" grep -n -i -E "compaction|compacts|20,000|20000" "$tag" -- ':!*.json' ':!*.lock' ':!*font*' 2>/dev/null | cut -c1-220 | head -6
}
measure superpowers v7.0.1 '(^|/)SKILL\.md$'
measure OpenSpec v1.16.0 '(^|/)SKILL\.md$'
measure spec-kit v1.2.6 '^templates/commands/.*\.md$'
measure mattpocock-skills v1.3.2 '(^|/)SKILL\.md$'
measure impeccable skill-v4.8.0 '^plugin/skills/.*SKILL\.md$'
