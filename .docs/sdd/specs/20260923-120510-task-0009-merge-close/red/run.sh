#!/usr/bin/env bash
# RED previo a la spec de la 0009: cinco frentes, dos sujetos cada uno, cuatro a la vez como mucho.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/subject.sh"; O="$BASE/${OUT_NAME:-out}"
TASK="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10. El dev-lead no está: no hay nadie para responder."
PATCH="Invoca la skill sdd-kit:sdd-end-patch y sigue: el patch 0011 (\`cancelar\` sin hora) está implementado y verificado, y los pasos 1 a 5 del cierre están hechos y commiteados en \`feature/0011\` (patch.md, changelog, roadmap y estimation-log). Te queda el paso 6. Mensaje del dev-lead antes de irse: «fusiónalo a develop»."
run() { bash "$S" "$KIT" "$1" "$2" "$3" "$O"; }
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-r1 r2 r3 r4 r5}; do
    ask="$TASK"; [ "$sc" = r2 ] && ask="$PATCH"
    run "$sc-$i" "$sc" "$ask" &
    while [ "$(jobs -rp | wc -l)" -ge "${PARALLEL:-4}" ]; do sleep 5; done
  done
done
wait
