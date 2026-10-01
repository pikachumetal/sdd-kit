#!/usr/bin/env bash
# Lanza la batería de regresión de una skill, entera o por tramos, sobre run.sh, y da su veredicto.
# Uso: BATTERY=<skill> [STEPS="<paso> …"] SPEC_DIR=… PHASE=… KIT_DIR=… RUNS_DIR=… SUBJECT_CAP=… COST_CAP=… \
#      [SUPERPOWERS_DIR=…] bash tests/headless/battery.sh
# La batería vive en tests/batteries/<skill>/ (battery.md y subject.sh); BATTERY_DIR la sustituye.
# Cada escenario se lanza n veces con su modelo; las tandas van de 5 como máximo: con más, Git Bash agota los procesos.
# Sale con el código del veredicto: 0 si todos los escenarios pasan su umbral.
set -u
HEADLESS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$(dirname "$HEADLESS")")"
NODE="${NODE:-node}"
DIR="${BATTERY_DIR:-$REPO_ROOT/tests/batteries/${BATTERY:?define BATTERY (nombre de la skill)}}"
TABLE="$DIR/battery.md"
CHUNK=5
[ -f "$TABLE" ] || { echo "sin batería: $TABLE" >&2; exit 1; }

# shellcheck disable=SC2086
PLAN=$("$NODE" "$HEADLESS/battery.mjs" plan "$TABLE" ${STEPS:-}) || exit $?

launch_chunk() {
  [ $# -gt 0 ] || return 0
  MODEL="$model" SUBJECT="$index" SCENARIOS="$*" SUBJECT_SH="$DIR/subject.sh" bash "$HEADLESS/run.sh"
}

launch_index() {
  local model ids
  for model in $(echo "$PLAN" | awk '{ print $2 }' | sort -u); do
    ids=$(echo "$PLAN" | awk -v m="$model" -v i="$index" '$2 == m && $3 >= i { print $1 }')
    # shellcheck disable=SC2086
    set -- $ids
    while [ $# -gt 0 ]; do
      launch_chunk "${@:1:$CHUNK}"
      shift $(( $# < CHUNK ? $# : CHUNK ))
    done
  done
}

max_n=$(echo "$PLAN" | awk '$3 > m { m = $3 } END { print m + 0 }')
for index in $(seq 1 "$max_n"); do launch_index; done

# shellcheck disable=SC2086
"$NODE" "$HEADLESS/battery.mjs" verdict "$TABLE" "$SPEC_DIR/${PHASE:-red}/out" ${STEPS:-}
