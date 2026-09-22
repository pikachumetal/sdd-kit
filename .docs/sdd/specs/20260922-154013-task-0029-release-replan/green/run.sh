#!/usr/bin/env bash
# Tanda GREEN: los seis escenarios del RED (r, s, u) con el kit modificado.
# Uso: RUNS_DIR=<scratchpad>/runs-green run.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
RED="$BASE/../red"
KIT="$1"; OUT="$BASE/out"
TR="Invoca la skill sdd-kit:sdd-start-release. Mete esto en la release en curso: que la reserva recurrente pueda terminar también por número de repeticiones, no solo por fecha; y que el aviso por correo salga también cuando se cancela una reserva. Y parte la 0007: exportar e importar van por separado."
TS="Invoca la skill sdd-kit:sdd-start-release. Tría en la release en curso las notas de uso de .docs/sdd/feedback/usage-notes.md."
T2="Sí, adelante con lo que propones."
for n in 1 2; do
  bash "$RED/subject.sh" "$KIT" "r$n" "$TR" "$T2" "$OUT" &
  MOLD=m2 bash "$RED/subject.sh" "$KIT" "s$n" "$TS" "$T2" "$OUT" &
  bash "$RED/subject3.sh" "$KIT" "u$n" "$TS" "$T2" "$OUT" &
done
wait
