#!/usr/bin/env bash
# RED previo a la spec de la task 0005: E1 (ronda de fix) y E2 (implementador), dos sujetos cada uno.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
S="$BASE/subject.sh"; O="${OUT_DIR:-$BASE/out}"
E1="Sigue con sdd-start-task: la task 0009 está en el paso 6, ejecutándose por subagentes. La Task 1 la hizo un implementador (su informe: \`.superpowers/sdd/plan/task-1-report.md\`) y su revisión devolvió dos Important (\`.superpowers/sdd/plan/task-1-review.md\`). Ese implementador ya no está disponible. Haz la ronda de fix y la re-revisión de la Task 1, y para antes de la Task 2."
E2="$(cat "$BASE/e2-encargo.md")"
for i in 1 2; do
  bash "$S" m-fix "e1-red-$i" "$E1" "$O" &
  bash "$S" m-impl "e2-red-$i" "$E2" "$O" &
done
wait
