#!/usr/bin/env bash
# Seis peticiones en lenguaje natural, sin nombrar skills, en serie. Uso: RUNS_DIR=<scratchpad> run-red.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
run() { bash "$BASE/subject.sh" molde "$KIT" "$1" "$2" "$OUT"; }
run p1-add    "Añade a la app de salas la reserva recurrente mensual."
run p2-make   "Hazme que las reservas se puedan exportar a un fichero .ics."
run p3-vague  "Quiero que las salas muestren estadísticas de uso. Empieza a montarlo."
run p4-ask    "¿Cómo funciona ahora mismo la cancelación de reservas?"
run p5-bug    "Hay un bug: al cancelar una reserva del lunes se cancela también la del martes. Arréglalo."
run p6-build  "Vamos a construir los avisos por correo antes de cada reserva."
