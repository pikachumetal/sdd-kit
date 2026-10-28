#!/usr/bin/env bash
# Lanza la batería de regresión de una skill, entera o por tramos, sobre run.sh, y da su veredicto.
# Uso: BATTERY=<skill> [STEPS="<paso> …"] SPEC_DIR=… PHASE=… KIT_DIR=… RUNS_DIR=… SUBJECT_CAP=… COST_CAP=… \
#      [SUPERPOWERS_DIR=…] bash tests/headless/battery.sh
# La batería vive en tests/batteries/<skill>/ (battery.md y subject.sh); BATTERY_DIR la sustituye.
# Cada escenario se lanza n veces con su modelo; run.sh limita cuántos corren a la vez (MAX_PARALLEL).
# Sale con el código del veredicto: 0 si todos los escenarios pasan su umbral.
set -u
. "$(cd "$(dirname "${BASH_SOURCE[0]//\\//}")" && pwd)/lib.sh"
DIR="${BATTERY_DIR:-$REPO_ROOT/tests/batteries/${BATTERY:?define BATTERY (nombre de la skill)}}"
TABLE="$DIR/battery.md"
[ -f "$TABLE" ] || { echo "sin batería: $TABLE" >&2; exit 1; }

# shellcheck disable=SC2086
PLAN=$("$NODE" "$HEADLESS/battery.mjs" plan "$TABLE" ${STEPS:-}) || exit $?
OUT="$(campaign_root)/${PHASE:-red}/out"

# battery.sh numera SUBJECT por su cuenta: con una etiqueta ya guardada, run.sh la saltaría y el veredicto sería el viejo.
saved_label() {
  local id n i
  while read -r id _ n; do
    for i in $(seq 1 "$n"); do [ -f "$OUT/$id-$i.tools.txt" ] && { echo "$id-$i"; return 0; }; done
  done <<< "$PLAN"
  return 1
}
if label=$(saved_label); then echo "ya existe $label en $OUT: borra esa carpeta o cambia PHASE" >&2; exit 1; fi

launch_index() {
  local model ids
  for model in $(echo "$PLAN" | awk '{ print $2 }' | sort -u); do
    ids=$(echo "$PLAN" | awk -v m="$model" -v i="$index" '$2 == m && $3 >= i { print $1 }')
    [ -n "$ids" ] || continue
    MODEL="$model" SUBJECT="$index" SCENARIOS="$ids" SUBJECT_SH="$DIR/subject.sh" "$NODE" "$HEADLESS/run.mjs"
  done
}

max_n=$(echo "$PLAN" | awk '$3 > m { m = $3 } END { print m + 0 }')
for index in $(seq 1 "$max_n"); do launch_index; done

# shellcheck disable=SC2086
"$NODE" "$HEADLESS/battery.mjs" verdict "$TABLE" "$OUT" ${STEPS:-}
