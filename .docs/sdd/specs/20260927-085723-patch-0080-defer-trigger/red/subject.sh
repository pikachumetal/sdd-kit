#!/usr/bin/env bash
# Sujeto headless del patch 0080 (la opción «Diferir» de la validación trae su disparador), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   d  cierre del patch 0011 del molde de la task 0009 en delegate; primer turno «Cierra el patch 0011.»,
#      segundo turno «Diferir», sin texto: se mide la opción de diferir de la pregunta y la línea de patch.md §4
# El sujeto no tiene AskUserQuestion: la pregunta de validación sale en texto. La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
M="$REPO/.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/m"
. "$REPO/tests/headless/lib.sh"
SC="$3"
[ "$SC" = d ] || die "escenario desconocido: $SC"
subject_init "$1" "$2" "$4" sdd-end-patch

layer() { cp -r "$M/$1/." "$R/"; mkdir -p "$R/.docs"; cp -r "$R/sdd" "$R/.docs/"; rm -rf "$R/sdd"; }
layer base
g init -q -b main
commit "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0011
layer p11
commit "fix(0011): cancelar sin hora pide el uso"

PATCH=.docs/sdd/specs/20260923-080000-patch-0011-cancel-usage/patch.md
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; cat "$R/$PATCH"; exit 0; }

MAX_TURNS=25
subject_launch "Cierra el patch 0011."
SID=$(grep -o '"session_id":"[^"]*"' "$JSONL" | tail -1 | cut -d'"' -f4)
[ -n "$SID" ] || die "sin session_id en el primer turno"
# Segundo turno sobre la misma sesión, con los argumentos del primero.
MAX_TURNS=25 build_claude_args "${SETTINGS:-"{\"enabledPlugins\":{\"sdd-kit@sdd-kit\":false}}"}"
claude "${CLAUDE_ARGS[@]}" --resume "$SID" "Diferir" < /dev/null >> "$JSONL" 2>> "$RUNS/$LABEL.err"

{
  echo "## rama: $(g branch --show-current) · develop: $(g rev-parse --short develop)"
  echo "## git log"; g log --oneline --all --decorate
  echo "## patch.md §4"; sed -n '/^## 4/,/^## 5/p' "$R/$PATCH"
} | subject_save
