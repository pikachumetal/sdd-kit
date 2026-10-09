#!/usr/bin/env bash
# Sujeto de la batería de sdd-grilling: una petición de battery.md que lleva a una skill que entrevista.
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
subject_init "$1" "$2" "$4" "$(cell Esperado | sed 's/^sdd-kit://')"
ASK="$(cell Petición)"
SALAS="$HERE/../using-sdd/mold-salas"
SALAS_MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'

case "$(cell Molde)" in
  salas) cp -r "$SALAS/." "$R/"; put_kit_marker "$SALAS_MARKER" ;;
  reservas) cp -r "$HERE/../sdd-start-feature/mold-reservas/." "$R/"; put_kit_marker "$SALAS_MARKER" ;;
  salas-sin-docs) cp -r "$SALAS/." "$R/"; rm -r "$R/.docs" ;;
  vacio) echo '# citas' | put README.md ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac
g init -q -b main
commit "feat: base del molde"
g checkout -q -b develop

case "$SC" in
  g3) export TURN2='sí, adelante: feature full con delegate' ;;
  g4) export TURN2='mantengo lo que dije' ;;
  g5) export TURN2='decide tú lo que puedas' ;;
  g6) export TURN2='sí, adelante: feature full con delegate' ;;
  g9) export EXTRA_ALLOWED='WebSearch WebFetch' ;;
esac

MAX_TURNS="${MAX_TURNS:-30}" subject_launch "$ASK"
[ "$SC" = g7 ] && subject_converse "$HERE/persona-g7.md" 8
[ "$SC" = g6 ] && subject_resume "no, espera, explícamelo mejor"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; echo "## ficheros"; g ls-files --others --exclude-standard; } | subject_save
