#!/usr/bin/env bash
# GREEN: mismos moldes, peticiones y lanzador que el RED (E1–E5), con el kit ya modificado.
# Uso: RUNS_DIR=<scratchpad> run.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"
bash "$BASE/../red/run.sh" "$KIT" green "$BASE/out" &
E5=1 bash "$BASE/../red/run.sh" "$KIT" green "$BASE/out" &
wait
echo "GREEN TERMINADO"
