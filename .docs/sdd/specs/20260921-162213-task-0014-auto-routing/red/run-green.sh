#!/usr/bin/env bash
# GREEN: las frases que fallaban (h1, h4) tres veces cada una y el control de sdd-templates.
# Uso: RUNS_DIR=<scratchpad> run-green.sh <kit> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; OUT="$2"
H1="Let's build an email reminder that fires before each booking."
H4="Es un cambio pequeño: añade un campo 'notas' a cada reserva. Hazlo rápido."
for i in 1 2 3; do bash "$BASE/subject.sh" molde "$KIT" "h1-g$i" "$H1" "$OUT"; done
for i in 1 2 3; do bash "$BASE/subject.sh" molde-code "$KIT" "h4-g$i" "$H4" "$OUT"; done
bash "$BASE/subject.sh" molde "$KIT" t1-templates "Invoca la skill sdd-kit:sdd-templates y dime cuál es la primera plantilla del índice." "$OUT"
