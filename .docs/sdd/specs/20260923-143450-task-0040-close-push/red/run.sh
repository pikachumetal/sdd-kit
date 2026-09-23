#!/usr/bin/env bash
# RED previo a la spec de la 0040: tres escenarios, dos sujetos cada uno.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/subject.sh"; O="$BASE/${OUT_NAME:-out}"
TASK="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10 y lo que siga. El dev-lead no está: no hay nadie para responder."
PATCH="Invoca la skill sdd-kit:sdd-end-patch y sigue: el patch 0011 (\`cancelar\` sin hora) está implementado y verificado, y los pasos 1 a 5 del cierre están hechos y commiteados en \`feature/0011\` (patch.md, changelog, roadmap y estimation-log). Te queda el paso 6 y lo que siga. El dev-lead no está: no hay nadie para responder."
ORDER="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno; cuando fusiones, sube develop») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10 y lo que siga. El dev-lead no está: no hay nadie para responder."
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-a b c}; do
    ask="$TASK"; [ "$sc" = b ] && ask="$PATCH"; [ "$sc" = c ] && ask="$ORDER"
    bash "$S" "$KIT" "$sc-$i" "$sc" "$ask" "$O"
  done
done
