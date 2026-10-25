#!/usr/bin/env bash
# Lanzador de referencia de una campaña de sujetos headless (patch 0076): las campañas lo usan, no lo copian.
# Uso: SPEC_DIR=<carpeta de la spec> PHASE=<red|green|refactor|ab> SUBJECT_SH=<subject.sh de la campaña> \
#      KIT_DIR=<copia limpia del kit> RUNS_DIR=<carpeta en el scratchpad o en .temp/ del repo> SCENARIOS="p1 p2" SUBJECT=<n> \
#      SUBJECT_CAP=<sujetos> COST_CAP=<$> bash tests/headless/run.sh
# SUBJECT_CAP y COST_CAP son los de la previsión de la spec y cuentan todas las fases de SPEC_DIR.
# Con DRY_RUN=1 las salidas van a RUNS_DIR/dry/<fase>/out y los techos cuentan solo las de RUNS_DIR/dry.
# No lanza el siguiente sujeto si existe RUNS_DIR/stop («parada a petición»), si se llega a SUBJECT_CAP
# o si el coste de los sujetos terminados llega a COST_CAP. Cada sujeto: bash SUBJECT_SH <kit> <escenario>-<n> <escenario> <salida>.
# Al acabar imprime el coste por carpeta de salida (red, green, green-premature…).
# El RED de un patch se lanza con SPEC_DIR en el scratchpad hasta que reproduce: solo entonces se reserva el id
# y se copia red/ a la carpeta del patch (tickets de los patches 0111, 0114 y 0125).
# No se edita mientras corre: bash lee el script a trozos (task 0005).
set -u
: "${SPEC_DIR:?define SPEC_DIR}" "${SUBJECT_SH:?define SUBJECT_SH}" "${KIT_DIR:?define KIT_DIR}" "${SCENARIOS:?define SCENARIOS}"
: "${SUBJECT_CAP:?define SUBJECT_CAP (previsión de la spec)}" "${COST_CAP:?define COST_CAP (previsión de la spec)}"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
# dirname no parte una ruta Windows con «\»: con la de Pester daba «.» y la raíz salía del cwd.
. "$(cd "$(dirname "${BASH_SOURCE[0]//\\//}")" && pwd)/lib.sh"
case "$(cygpath -u "$RUNS" 2>/dev/null || echo "$RUNS")" in *scratchpad*|"$REPO_ROOT"/.temp/*) ;; *) echo "RUNS_DIR fuera del scratchpad o de .temp/: $RUNS" >&2; exit 1 ;; esac
ROOT="$(campaign_root)"
OUT="$ROOT/${PHASE:-red}/out"

subjects() { ls "$ROOT"/*/out/*.tools.txt 2>/dev/null | wc -l; }
last_cost() { grep -o '=== RESULTADO ([0-9]* turnos, [0-9.]* \$' "$1" | tail -n 1 | awk '{ print $(NF-1) }'; }
costs_in() { local f; for f in "$1"/*.tools.txt; do [ -f "$f" ] && echo "$(last_cost "$f")"; done; }
spent() { local dir; for dir in "$ROOT"/*/out; do costs_in "$dir"; done | awk '{ s += $1 } END { printf "%.2f", s }'; }

# Una línea por carpeta: lo que separa válidos de invalidados es la carpeta (green frente a green-premature).
folder_report() {
  local dir
  for dir in "$ROOT"/*/out; do
    [ -d "$dir" ] || continue
    costs_in "$dir" | awk -v name="$(basename "$(dirname "$dir")")" '
      { n++; if ($1 == "") k++; else s += $1 }
      END { if (n) printf "%s: %d sujetos · %.2f $%s\n", name, n, s, (k ? " · " k " sin RESULTADO" : "") }'
  done
}

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
folder_report
[ "${DRY_RUN:-}" = 1 ] && echo "en seco: salidas en $OUT"
echo "sujetos de la campaña: $(subjects) · coste acumulado: $(spent) \$"
