#!/usr/bin/env bash
# Campaña de la 0058: RED y GREEN comparten previsión y el techo común de la 0055, 0057 y 0058. En serie; antes de cada
# sujeto para si existe `stop` junto a este lanzador, si el coste de las tres tasks llega al techo o si los sujetos
# terminados de esta task llegan a SUBJECT_CAP.
# Uso: KIT_DIR=<copia del kit> RUNS_DIR=<scratchpad> OUT_NAME=<red|green> SCENARIOS="d4 p5" SUBJECT=1 run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TASK="$(dirname "$BASE")"
SPECS="$(dirname "$TASK")"
O="$TASK/${OUT_NAME:-red}/out"
CAP="${COST_CAP:-65}"
SUBJECT_CAP="${SUBJECT_CAP:-12}"
finished() { ls "$TASK"/*/out/*.tools.txt 2>/dev/null | wc -l; }
spent() { for f in "$SPECS"/*-task-005[578]-*/*/out/*.tools.txt; do [ -f "$f" ] && grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$f" | tail -n 1; done | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
for sc in ${SCENARIOS:?define SCENARIOS}; do
  [ -f "$BASE/stop" ] && { echo "parada a petición"; exit 3; }
  total=$(spent)
  if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$): decide el dev-lead"; exit 2; fi
  [ "$(finished)" -ge "$SUBJECT_CAP" ] && { echo "previsión de sujetos alcanzada ($SUBJECT_CAP): decide el dev-lead"; exit 4; }
  bash "$BASE/subject.sh" "$KIT_DIR" "$sc-${SUBJECT:-1}" "$sc" "$O"
done
echo "coste acumulado de la campaña 0055-0058: $(spent) \$ · sujetos de la 0058: $(finished)"
