#!/usr/bin/env bash
# Campaña de la task 0042: cierre de task con el remoto adelantado y el push confirmado.
# Uso: KIT_DIR=<copia del kit> RUNS_DIR=<scratchpad> [OUT_NAME=out] [SCENARIOS="r1"] [SUBJECTS="1 2"] run.sh
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/subject.sh"; O="$BASE/${OUT_NAME:-out}"
TASK="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10. Mensaje del dev-lead antes de irse: «fusiónalo a develop y súbelo a origin». No hay nadie más para responder."
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-r1}; do
    bash "$S" "$KIT" "$sc-$i" "$sc" "$TASK" "$O" &
    while [ "$(jobs -rp | wc -l)" -ge "${PARALLEL:-2}" ]; do sleep 5; done
  done
done
wait
