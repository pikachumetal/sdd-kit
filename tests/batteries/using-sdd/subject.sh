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

salas_base() {
  cp -r "$HERE/mold-salas/." "$R/"
  if [ "$SC" = i1 ]; then rm -r "$R/.docs"; else put_kit_marker '"channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}'; fi
  [ "$SC" = t1 ] && echo 'Consulta las recervas libres con `libres <franja>`.' >> "$R/README.md"
  g init -q -b main
  commit "feat: base con cancelación de reservas"
  g checkout -q -b develop
}

case "$(cell Molde)" in
  salas) salas_base ;;
  ventas) . "$HERE/ventas.sh"; ventas_base ;;
  *) die "molde desconocido en battery.md: $SC" ;;
esac

MAX_TURNS="${MAX_TURNS:-8}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
