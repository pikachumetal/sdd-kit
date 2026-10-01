#!/usr/bin/env bash
# Sujeto de la batería de using-sdd: una frase de battery.md sobre su molde (salas o ventas).
# Lo lanza tests/headless/battery.sh, con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../headless/lib.sh"
subject_init "$1" "$2" "$4" using-sdd
SC="$3"
cell() { "$NODE" "$HEADLESS/battery.mjs" field "$HERE/battery.md" "$SC" "$1" || die "sin el escenario $SC en battery.md"; }
ASK="$(cell Petición)"
SALAS_MARKER='"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'
VENTAS_MARKER="$SALAS_MARKER"', "control": {"profile": "delegate", "maxParallelAgents": 3}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"'

# i1 mide la init: el proyecto llega sin .docs/. t1 necesita la errata en el README.
mold_base() {
  cp -r "$HERE/mold-$1/." "$R/"
  if [ "$SC" = i1 ]; then rm -r "$R/.docs"; else put_kit_marker "$2"; fi
  [ "$SC" = t1 ] && echo 'Consulta las recervas libres con `libres <franja>`.' >> "$R/README.md"
  g init -q -b main
  commit "feat: base del molde $1"
  g checkout -q -b develop
}

case "$(cell Molde)" in
  salas) mold_base salas "$SALAS_MARKER" ;;
  ventas) mold_base ventas "$VENTAS_MARKER" ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac

MAX_TURNS="${MAX_TURNS:-8}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
