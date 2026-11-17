#!/usr/bin/env bash
# Controles de sobre-disparo: ediciones sin comportamiento, dos sujetos por petición.
# Uso: RUNS_DIR=<scratchpad> run-controls.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
run() { bash "$BASE/subject.sh" molde-trivial "$KIT" "$1" "$2" "$OUT"; }
run c1-typo-1   "Corrige el typo «recervas» que hay en el README."
run c1-typo-2   "Corrige el typo «recervas» que hay en el README."
run c2-rename-1 "Renombra la variable bookings a reservations en src/app.js."
run c2-rename-2 "Renombra la variable bookings a reservations en src/app.js."
