#!/usr/bin/env bash
# Lanzador de referencia de una campaña de sujetos headless (patch 0076): las campañas lo usan, no lo copian.
# Uso: SPEC_DIR=<carpeta de la spec> PHASE=<red|green|refactor|ab> SUBJECT_SH=<subject.sh de la campaña> \
#      KIT_DIR=<copia limpia del kit> RUNS_DIR=<carpeta en el scratchpad> SCENARIOS="p1 p2" SUBJECT=<n> \
#      SUBJECT_CAP=<sujetos> COST_CAP=<$> bash tests/headless/run.sh
# SUBJECT_CAP y COST_CAP son los de la previsión de la spec y cuentan todas las fases de SPEC_DIR.
# No lanza el siguiente sujeto si existe RUNS_DIR/stop («parada a petición»), si se llega a SUBJECT_CAP
# o si el coste de los sujetos terminados llega a COST_CAP. Cada sujeto: bash SUBJECT_SH <kit> <escenario>-<n> <escenario> <salida>.
# No se edita mientras corre: bash lee el script a trozos (task 0005).
set -u
: "${SPEC_DIR:?define SPEC_DIR}" "${SUBJECT_SH:?define SUBJECT_SH}" "${KIT_DIR:?define KIT_DIR}" "${SCENARIOS:?define SCENARIOS}"
: "${SUBJECT_CAP:?define SUBJECT_CAP (previsión de la spec)}" "${COST_CAP:?define COST_CAP (previsión de la spec)}"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
OUT="$SPEC_DIR/${PHASE:-red}/out"

subjects() { ls "$SPEC_DIR"/*/out/*.tools.txt 2>/dev/null | wc -l; }
spent() { for f in "$SPEC_DIR"/*/out/*.tools.txt; do [ -f "$f" ] && grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$f" | tail -n 1; done | awk '{ s += $(NF-1) } END { printf "%.2f", s }'; }

pids=()
launched=0
# Los sujetos de antes se cuentan una vez: uno lanzado aquí que termina durante el bucle contaría doble.
before=$(subjects)
for sc in $SCENARIOS; do
  [ -f "$RUNS/stop" ] && { echo "parada a petición"; break; }
  if [ $(( before + launched )) -ge "$SUBJECT_CAP" ]; then echo "techo de $SUBJECT_CAP sujetos alcanzado: decide el dev-lead"; break; fi
  total=$(spent)
  if awk -v t="$total" -v c="$COST_CAP" 'BEGIN { exit !(t >= c) }'; then echo "techo de $COST_CAP \$ alcanzado ($total \$)"; break; fi
  bash "$SUBJECT_SH" "$KIT_DIR" "$sc-${SUBJECT:-1}" "$sc" "$OUT" &
  pids+=($!)
  launched=$((launched + 1))
done
[ ${#pids[@]} -gt 0 ] && wait "${pids[@]}"
echo "sujetos de la campaña: $(subjects) · coste acumulado: $(spent) \$"
