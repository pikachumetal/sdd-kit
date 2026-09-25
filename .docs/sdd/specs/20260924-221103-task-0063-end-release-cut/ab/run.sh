#!/usr/bin/env bash
# Campaña A/B de la 0063, en serie. Antes de cada sujeto para si existe `stop` junto a este lanzador,
# si el coste acumulado llega al techo o si los sujetos terminados llegan a SUBJECT_CAP.
# Uso: CONTROL_KIT=<copia> TREATMENT_KIT=<copia> RUNS_DIR=<scratchpad> ARMS="c t" SCENARIOS="a1 a2 a3 a4" [SUBJECT=1] run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
O="$BASE/out"
CAP="${COST_CAP:-16}"
SUBJECT_CAP="${SUBJECT_CAP:-12}"
finished() { ls "$O"/*-t1.tools.txt 2>/dev/null | wc -l; }
spent() { for f in "$O"/*.tools.txt; do [ -f "$f" ] && grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$f" | tail -n 1; done | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
kit() { [ "$1" = c ] && echo "${CONTROL_KIT:?}" || echo "${TREATMENT_KIT:?}"; }
for sc in ${SCENARIOS:?define SCENARIOS}; do
  for arm in ${ARMS:-c t}; do
    [ -f "$BASE/stop" ] && { echo "parada a petición"; exit 3; }
    total=$(spent)
    if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$): decide el dev-lead"; exit 2; fi
    [ "$(finished)" -ge "$SUBJECT_CAP" ] && { echo "previsión de sujetos alcanzada ($SUBJECT_CAP): decide el dev-lead"; exit 4; }
    bash "$BASE/subject.sh" "$(kit "$arm")" "$arm-$sc-${SUBJECT:-1}" "$sc" "$O"
  done
done
echo "coste acumulado de la campaña 0063: $(spent) \$ · sujetos: $(finished)"
