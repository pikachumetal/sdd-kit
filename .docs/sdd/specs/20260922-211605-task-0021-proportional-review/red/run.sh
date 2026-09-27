#!/usr/bin/env bash
# Tanda RED previa de la 0021: R1 (revisor de task), R2 (revisor final), R3 (repaso de coherencia), dos sujetos cada uno.
# Uso: RUNS_DIR=<scratchpad>/runs run.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"; KIT="$1"; OUT="$BASE/out"
for n in 1 2; do
  bash "$BASE/review-subject.sh" "r1-$n" "$BASE/prompt-r1.tmpl" "$OUT" &
  bash "$BASE/review-subject.sh" "r2-$n" "$BASE/prompt-r2.tmpl" "$OUT" &
  bash "$BASE/spec-subject.sh" "$KIT" "r3-$n" "$OUT" &
done
wait
