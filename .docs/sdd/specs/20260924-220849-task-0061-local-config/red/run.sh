#!/usr/bin/env bash
# Campaña de la 0061: el RED y el GREEN comparten techo. Para si existe `stop` junto a este lanzador, si se llega a SUBJECT_CAP sujetos o si el coste acumulado pasa de COST_CAP.
# Uso: KIT_DIR=<copia del kit> RUNS_DIR=<scratchpad> OUT_NAME=<red|green> SCENARIOS="c1 c2 c3 c4" SUBJECT=<n> run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TASK="$(dirname "$BASE")"
O="$TASK/${OUT_NAME:-red}/out"
SUBJECT_CAP="${SUBJECT_CAP:-20}"
COST_CAP="${COST_CAP:-16}"
subjects() { ls "$TASK"/*/out/*.tools.txt 2>/dev/null | wc -l; }
spent() { for f in "$TASK"/*/out/*.tools.txt; do [ -f "$f" ] && grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$f" | tail -n 1; done | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
pids=()
launched=0
for sc in ${SCENARIOS:-c1 c2 c3 c4}; do
  [ -f "$BASE/stop" ] && { echo "parada a petición"; break; }
  if [ $(( $(subjects) + launched )) -ge "$SUBJECT_CAP" ]; then echo "techo de $SUBJECT_CAP sujetos alcanzado"; break; fi
  total=$(spent)
  if awk -v t="$total" -v c="$COST_CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $COST_CAP \$ alcanzado ($total \$)"; break; fi
  bash "$BASE/subject.sh" "$KIT_DIR" "$sc-${SUBJECT:-1}" "$sc" "$O" &
  pids+=($!)
  launched=$((launched + 1))
done
[ ${#pids[@]} -gt 0 ] && wait "${pids[@]}"
echo "sujetos de la campaña 0061: $(subjects) · coste acumulado: $(spent) \$"
