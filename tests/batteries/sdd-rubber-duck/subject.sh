#!/usr/bin/env bash
# Sujeto de la batería de sdd-rubber-duck: algo que explicar a un dev-lead que conoce el producto y no el código.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
# En el RED la skill que se mide aún no existe: la guarda comprueba la copia del kit con la puerta de entrada.
GUARD="$(cell Esperado | sed 's/^sdd-kit://')"
case "${PHASE:-red}" in red*) GUARD=using-sdd ;; esac
subject_init "$1" "$2" "$4" "$GUARD"
ASK="$(cell Petición)"
MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'

case "$(cell Molde)" in
  exportes) cp -r "$HERE/mold-exportes/." "$R/"; put_kit_marker "$MARKER" ;;
  salas) cp -r "$HERE/../using-sdd/mold-salas/." "$R/"; put_kit_marker "$MARKER" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

case "$SC" in
  s1) g checkout -q -b feature/0013-export-by-room ;;
  s2) g checkout -q -b feature/0012-ics-export ;;
esac

# La skill no existe en el kit del RED: la petición de una parada la nombra solo fuera de él.
case "$SC:${PHASE:-red}" in
  s1:red*|s2:red*) ;;
  s1:*|s2:*) ASK="Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y ${ASK,}" ;;
esac

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; } | subject_save
