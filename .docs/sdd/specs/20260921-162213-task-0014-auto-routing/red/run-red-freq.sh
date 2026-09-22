#!/usr/bin/env bash
# Repeticiones de h1 y h4 para medir frecuencia; h4 sobre un molde con el flujo de reservas real.
# Uso: RUNS_DIR=<scratchpad> run-red-freq.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
run() { bash "$BASE/subject.sh" "$@"; }
H1="Let's build an email reminder that fires before each booking."
H4="Es un cambio pequeño: añade un campo 'notas' a cada reserva. Hazlo rápido."
run molde      "$KIT" h1-r2 "$H1" "$OUT"
run molde      "$KIT" h1-r3 "$H1" "$OUT"
run molde-code "$KIT" h4-r2 "$H4" "$OUT"
run molde-code "$KIT" h4-r3 "$H4" "$OUT"
