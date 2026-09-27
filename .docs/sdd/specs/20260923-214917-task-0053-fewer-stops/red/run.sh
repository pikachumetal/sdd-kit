#!/usr/bin/env bash
# Campaña de la 0053 (RED y GREEN comparten techo): escenarios en serie; no lanza el siguiente si el acumulado de todas las salidas pasa del techo.
# Uso: KIT_DIR=<copia del kit> RUNS_DIR=<scratchpad> OUT_NAME=<red|green> SCENARIOS="s1 s2" SUBJECTS="1 2" run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
TASK="$(dirname "$BASE")"
O="$TASK/${OUT_NAME:-red}/out"
CAP="${COST_CAP:-18}"
spent() { cat "$TASK"/*/out/*.tools.txt "$TASK"/*/out/discarded/*.tools.txt 2>/dev/null | grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-s1 s2 s3 s4 s5 s6}; do
    total=$(spent)
    if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$): paro"; exit 2; fi
    bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$O"
  done
done
echo "coste acumulado de la campaña: $(spent) \$"
