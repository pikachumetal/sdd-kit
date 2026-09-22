#!/usr/bin/env bash
# Segunda ronda del RED: E1 con la skill del kit invocada de forma explícita (en la primera ningún sujeto la cargó)
# y E2 con el test intermitente fallando en su primera ejecución (en la primera ronda no se disparó).
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
S="$BASE/subject.sh"; O="${OUT_DIR:-$BASE/out}"
E1="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0009, que está en su paso 6, ejecutándose por subagentes. La Task 1 la hizo un implementador (su informe: \`.superpowers/sdd/plan/task-1-report.md\`) y su revisión devolvió dos Important (\`.superpowers/sdd/plan/task-1-review.md\`). Ese implementador ya no está disponible. Haz la ronda de fix y la re-revisión de la Task 1, y para antes de la Task 2."
E2="$(cat "$BASE/e2-encargo.md")"
for i in 3 4; do
  bash "$S" m-fix "e1-red-$i" "$E1" "$O" &
  bash "$S" m-impl "e2-red-$i" "$E2" "$O" &
done
wait
