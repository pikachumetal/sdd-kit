#!/usr/bin/env bash
# Lanzador de referencia de una campaña de sujetos headless (patch 0076): las campañas lo usan, no lo copian.
# Uso: SPEC_DIR=<carpeta de la spec> PHASE=<red|green|refactor|ab> SUBJECT_SH=<subject.sh de la campaña> \
#      KIT_DIR=<copia limpia del kit> RUNS_DIR=<carpeta en el scratchpad o en .temp/ del repo> SCENARIOS="p1 p2" SUBJECT=<n> \
#      SUBJECT_CAP=<sujetos> COST_CAP=<$> [SUBJECT_COST=<$>] [MAX_PARALLEL=<n>] bash tests/headless/run.sh
# SUBJECT_CAP y COST_CAP son los de la previsión de la spec y cuentan todas las fases de SPEC_DIR.
# Con DRY_RUN=1 las salidas van a RUNS_DIR/dry/<fase>/out y los techos cuentan solo las de RUNS_DIR/dry.
# Cada sujeto lanzado deja su PID en RUNS_DIR/live/<fase>.<etiqueta> mientras corre: con el proceso vivo está en curso,
# y si muere sin dejar <etiqueta>.tools.txt queda cortado y cuenta como sujeto y como SUBJECT_COST.
# Por escenario: no lanza una etiqueta que ya tiene tools.txt en su fase («ya existe <etiqueta>: sube SUBJECT»);
# espera mientras haya MAX_PARALLEL (5) sujetos en curso bajo RUNS_DIR, de esta fase o de otra; y no lanza más
# si existe RUNS_DIR/stop («parada a petición»), si se llega a SUBJECT_CAP o si lo gastado más
# (en curso + 1) × SUBJECT_COST (COST_CAP / SUBJECT_CAP) pasa de COST_CAP.
# Cada sujeto: bash SUBJECT_SH <kit> <escenario>-<n> <escenario> <salida>.
# Al acabar imprime el coste por carpeta de salida (red, green, green-premature…) y los cortados.
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
LIVE="$RUNS/live"
SUBJECT_COST="${SUBJECT_COST:-$(awk -v c="$COST_CAP" -v n="$SUBJECT_CAP" 'BEGIN { print c / n }')}"
MAX_PARALLEL="${MAX_PARALLEL:-5}"
mkdir -p "$LIVE"

# En Git Bash cada proceso tarda: con la máquina cargada, un bucle de subshells tardaba más en lanzar que un sujeto en correr.
# Por eso el recuento usa builtins y deja el resultado en variables.
count_finished() { local files=("$ROOT"/*/out/*.tools.txt); FINISHED=0; [ -f "${files[0]}" ] && FINISHED=${#files[@]}; }

# Se mira tools.txt antes que el PID: un sujeto que acaba de guardar y aún no borró su marca está terminado.
count_live() {
  local mark name pid
  RUNNING=0; CUT=0
  for mark in "$LIVE"/*; do
    [ -f "$mark" ] || continue
    name="${mark##*/}"
    [ -f "$ROOT/${name%%.*}/out/${name#*.}.tools.txt" ] && continue
    read -r pid < "$mark"
    if kill -0 "$pid" 2>/dev/null; then RUNNING=$((RUNNING + 1)); else CUT=$((CUT + 1)); fi
  done
}

# El último RESULTADO de cada tools.txt de la carpeta, una línea por fichero (vacía si no lo tiene).
costs_in() {
  local files=("$1"/*.tools.txt)
  [ -f "${files[0]}" ] || return 0
  awk 'match($0, /=== RESULTADO \([0-9]* turnos, [0-9.]* \$/) { n = split(substr($0, RSTART, RLENGTH), w, " "); last = w[n - 1] }
       ENDFILE { print last; last = "" }' "${files[@]}"
}
spent() { local dir; for dir in "$ROOT"/*/out; do costs_in "$dir"; done | awk '{ s += $1 } END { printf "%.2f", s }'; }
total_spent() { awk -v s="$(spent)" -v k="$CUT" -v u="$SUBJECT_COST" 'BEGIN { printf "%.2f", s + k * u }'; }

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

stop_requested() { [ -f "$RUNS/stop" ] && echo "parada a petición"; }

# Dos run.sh que miraban a la vez los sujetos en curso lanzaban los dos: mkdir es atómico y guarda el cupo
# hasta que la marca existe. Un cerrojo cuyo dueño ya no vive se rompe.
take_launch_lock() {
  local holder
  until mkdir "$LIVE/.lock" 2>/dev/null; do
    read -r holder < "$LIVE/.lock/pid" 2>/dev/null && ! kill -0 "$holder" 2>/dev/null && rm -rf "$LIVE/.lock"
    sleep 1
  done
  echo $$ > "$LIVE/.lock/pid"
}
release_launch_lock() { rm -rf "$LIVE/.lock"; }

wait_for_slot() {
  local announced=
  while count_live; [ "$RUNNING" -ge "$MAX_PARALLEL" ]; do
    [ -n "$announced" ] || { echo "esperando hueco: $RUNNING sujetos en curso (MAX_PARALLEL=$MAX_PARALLEL)"; announced=1; }
    sleep 1
  done
}

subject_cap_reached() {
  count_finished
  [ $(( FINISHED + RUNNING + CUT + 1 )) -gt "$SUBJECT_CAP" ] || return 1
  echo "techo de $SUBJECT_CAP sujetos alcanzado: decide el dev-lead"
}

cost_cap_reached() {
  local spent_now
  spent_now=$(total_spent)
  awk -v s="$spent_now" -v r="$RUNNING" -v u="$SUBJECT_COST" -v c="$COST_CAP" 'BEGIN { exit !(s + (r + 1) * u > c) }' || return 1
  echo "techo de $COST_CAP \$ alcanzado ($spent_now \$ gastados, $RUNNING en curso a $SUBJECT_COST \$)"
}

# La marca nace con el PID de run.sh para que el siguiente escenario ya la cuente; el subshell la reescribe con el suyo.
launch_subject() {
  local mark="$LIVE/${PHASE:-red}.$2"
  echo $$ > "$mark"
  ( echo "$BASHPID" > "$mark"; bash "$SUBJECT_SH" "$KIT_DIR" "$2" "$1" "$OUT"; rm -f "$mark" ) &
  pids+=($!)
}

pids=()
for sc in $SCENARIOS; do
  stop_requested && break
  label="$sc-${SUBJECT:-1}"
  [ -f "$OUT/$label.tools.txt" ] && { echo "ya existe $label: sube SUBJECT"; continue; }
  take_launch_lock
  wait_for_slot
  stop_requested || subject_cap_reached || cost_cap_reached && { release_launch_lock; break; }
  launch_subject "$sc" "$label"
  release_launch_lock
done
[ ${#pids[@]} -gt 0 ] && wait "${pids[@]}"
folder_report
count_live; count_finished
[ "$CUT" -gt 0 ] && echo "cortados sin salida: $CUT (contados a $SUBJECT_COST \$ cada uno)"
[ "${DRY_RUN:-}" = 1 ] && echo "en seco: salidas en $OUT"
echo "sujetos de la campaña: $(( FINISHED + CUT )) · coste acumulado: $(total_spent) \$"