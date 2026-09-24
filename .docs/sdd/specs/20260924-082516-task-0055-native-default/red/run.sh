#!/usr/bin/env bash
# Campaña común de las tasks 0055, 0057 y 0058: un solo techo para el RED previo, el GREEN y el A/B.
# Antes de cada sujeto: para si existe el fichero `stop` junto a este lanzador o si el acumulado de las tres tasks pasa del techo.
# Uso: KIT_DIR=<copia del kit> RUNS_DIR=<scratchpad> OUT_NAME=<red|green> SCENARIOS="e1" SUBJECTS="1 2" run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TASK="$(dirname "$BASE")"
SPECS="$(dirname "$TASK")"
O="$TASK/${OUT_NAME:-red}/out"
CAP="${COST_CAP:-65}"
# Un stream puede traer más de un evento `result`: cuenta solo el último de cada sujeto.
spent() { for f in "$SPECS"/*-task-005[578]-*/*/out/*.tools.txt; do [ -f "$f" ] && grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$f" | tail -n 1; done | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-e1}; do
    [ -f "$BASE/stop" ] && { echo "parada a petición (existe $BASE/stop)"; exit 3; }
    total=$(spent)
    if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$): paro"; exit 2; fi
    bash "$BASE/${SUBJECT_SCRIPT:-subject.sh}" "$KIT_DIR" "$sc-$i" "$sc" "$O"
  done
done
echo "coste acumulado de la campaña 0055-0058: $(spent) \$"
