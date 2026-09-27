#!/usr/bin/env bash
# GREEN de la Task 1: E2 con la cabecera nueva del implementador y E3, despacho en modo lite. Dos sujetos cada uno.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
S="$BASE/../red/subject.sh"; O="${OUT_DIR:-$BASE/out}"
E2="$(cat "$BASE/e2-encargo.md")"
E3="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0009: va en modo lite, con la spec aprobada y los tests RED del hilo ya commiteados en \`test/app.test.js\`. Despacha el implementador y para cuando te devuelva su informe, antes de la revisión."
for i in 1 2; do
  bash "$S" m-impl "e2-green-$i" "$E2" "$O" &
  OVERLAY_DIR="$BASE" bash "$S" m-lite "e3-green-$i" "$E3" "$O" &
done
wait
