#!/usr/bin/env bash
# Segunda tanda GREEN: un sujeto s tras reforzar la lectura del roadmap de cada rama feature/*.
# Uso: RUNS_DIR=<scratchpad>/runs-green run2.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
RED="$BASE/../red"
KIT="$1"; OUT="$BASE/out"
TS="Invoca la skill sdd-kit:sdd-start-release. Tría en la release en curso las notas de uso de .docs/sdd/feedback/usage-notes.md."
T2="Sí, adelante con lo que propones."
MOLD=m2 bash "$RED/subject.sh" "$KIT" "s3" "$TS" "$T2" "$OUT"
