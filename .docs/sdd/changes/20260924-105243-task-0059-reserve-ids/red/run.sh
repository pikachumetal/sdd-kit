#!/usr/bin/env bash
# Campaña de la 0059 (RED y GREEN comparten techo). Para si existe `stop` junto a este lanzador o si el acumulado pasa del techo.
# Uso: KIT_DIR=<copia del kit> RUNS_DIR=<scratchpad> OUT_NAME=<red|green> SCENARIOS="p1 r1 t1" run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TASK="$(dirname "$BASE")"
O="$TASK/${OUT_NAME:-red}/out"
CAP="${COST_CAP:-10}"
spent() { for f in "$TASK"/*/out/*.tools.txt; do [ -f "$f" ] && grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$f" | tail -n 1; done | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
pids=()
for sc in ${SCENARIOS:-p1 r1 t1}; do
  [ -f "$BASE/stop" ] && { echo "parada a petición"; exit 3; }
  total=$(spent)
  if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$)"; exit 2; fi
  bash "$BASE/subject.sh" "$KIT_DIR" "$sc-${SUBJECT:-1}" "$sc" "$O" &
  pids+=($!)
done
wait "${pids[@]}"
echo "coste acumulado de la campaña 0059: $(spent) \$"
