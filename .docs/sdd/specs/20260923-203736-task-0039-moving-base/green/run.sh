#!/usr/bin/env bash
# GREEN de la 0039: cinco escenarios, dos sujetos cada uno. Corta al pasar el techo de coste.
#   a1 a2 a3: frente A (subject.sh de esta carpeta) · b1 b2: frente B, que repiten r2 y r1 del RED con el kit nuevo
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
O="$BASE/${OUT_NAME:-out}"
CAP="${COST_CAP:-9}"
spent() { cat "$O"/*.tools.txt 2>/dev/null | grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }
run_one() {
  local sc="$1" label="$2"
  case $sc in
    a1|a2|a3) bash "$BASE/subject.sh" "$KIT" "$label" "$sc" "$O" ;;
    b1) bash "$BASE/../red/subject.sh" "$KIT" "$label" r2 "$O" ;;
    b2) bash "$BASE/../red/subject.sh" "$KIT" "$label" r1 "$O" ;;
  esac
}
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-a1 a2 a3 b1 b2}; do
    total=$(spent)
    if awk -v t="$total" -v c="$CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $CAP \$ alcanzado ($total \$): paro"; exit 2; fi
    run_one "$sc" "$sc-$i"
  done
done
echo "coste acumulado: $(spent) \$"
