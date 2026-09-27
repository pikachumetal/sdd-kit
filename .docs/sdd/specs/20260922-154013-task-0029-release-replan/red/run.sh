#!/usr/bin/env bash
# Tanda RED: dos sujetos en paralelo con la misma petición.
# Uso: RUNS_DIR=<scratchpad>/runs run.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"
T1="Invoca la skill sdd-kit:sdd-start-release. Mete esto en la release en curso: que la reserva recurrente pueda terminar también por número de repeticiones, no solo por fecha; y que el aviso por correo salga también cuando se cancela una reserva. Y parte la 0007: exportar e importar van por separado."
T2="Sí, adelante con lo que propones."
for label in r1 r2; do
  bash "$BASE/subject.sh" "$KIT" "$label" "$T1" "$T2" "$BASE/out" &
done
wait
