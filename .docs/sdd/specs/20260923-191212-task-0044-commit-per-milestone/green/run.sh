#!/usr/bin/env bash
# GREEN de la 0044: cinco escenarios, dos sujetos cada uno, en serie. Corta al pasar el techo de coste.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
O="$BASE/${OUT_NAME:-out}"
CAP="${COST_CAP:-14}"
spent() { cat "$O"/*.tools.txt 2>/dev/null | grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-g1 g2 g3 g4 g5}; do
    total=$(spent)
    if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$): paro"; exit 2; fi
    bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$O"
  done
done
echo "coste acumulado: $(spent) \$"
