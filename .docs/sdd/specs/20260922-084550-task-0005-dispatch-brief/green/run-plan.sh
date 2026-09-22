#!/usr/bin/env bash
# E4 de la Task 2: escribir el plan de una spec full aprobada. Control con el kit de 43867be (KIT_OLD) y GREEN con el de la rama (KIT_DIR), dos sujetos cada uno.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
S="$BASE/../red/subject.sh"; O="${OUT_DIR:-$BASE/out}"
E4="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0009: la spec está aprobada. Escribe el plan.md y para ahí, sin implementar nada."
for i in 1 2; do
  OVERLAY_DIR="$BASE" KIT_DIR="${KIT_OLD:?define KIT_OLD}" bash "$S" m-plan "e4-red-$i" "$E4" "$O" &
  OVERLAY_DIR="$BASE" bash "$S" m-plan "e4-green-$i" "$E4" "$O" &
done
wait
