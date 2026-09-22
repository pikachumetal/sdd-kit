#!/usr/bin/env bash
# Cuatro casos duros, en serie. Uso: RUNS_DIR=<scratchpad> run-red-hard.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
run() { bash "$BASE/subject.sh" "$@"; }
run molde    "$KIT" h1-english   "Let's build an email reminder that fires before each booking." "$OUT"
run molde-cm "$KIT" h2-claudemd  "Añade a la app de salas la reserva recurrente mensual." "$OUT"
run molde    "$KIT" h3-context   "¿Cómo funciona ahora mismo la cancelación de reservas?" "$OUT" \
  "Gracias. Ahora añade la reserva recurrente mensual."
run molde    "$KIT" h4-small     "Es un cambio pequeño: añade un campo 'notas' a cada reserva. Hazlo rápido." "$OUT"
