#!/usr/bin/env bash
# GREEN de la 0040: once escenarios, dos sujetos cada uno, en serie.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
O="$BASE/${OUT_NAME:-out}"
TASK="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10 y lo que siga. El dev-lead no está: no hay nadie para responder."
PATCH="Invoca la skill sdd-kit:sdd-end-patch y sigue: el patch 0011 (\`cancelar\` sin hora) está implementado y verificado, y los pasos 1 a 5 del cierre están hechos y commiteados en \`feature/0011\` (patch.md, changelog, roadmap y estimation-log). Te queda el paso 6 y lo que siga. El dev-lead no está: no hay nadie para responder."
ORDER="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno; cuando fusiones, sube develop») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10 y lo que siga. El dev-lead no está: no hay nadie para responder."
PRESENT="Invoca la skill sdd-kit:sdd-end-task y sigue: la task 0009 (validar el formato de la franja) está validada por el dev-lead («he probado \`salas libres 10-12\` y \`salas reservar Norte 10-12\` y dan el error bueno») y los pasos 0 a 9 del cierre están hechos y commiteados en \`feature/0009\` (walkthrough, changelog, roadmap y estimation-log). Te queda el paso 10 y lo que siga."
T2="Sí, genera el ticket."
for i in ${SUBJECTS:-1 2}; do
  for sc in ${SCENARIOS:-a b c e p d t i i2 m}; do
    case $sc in
      a|d|e) bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$TASK" "$O" ;;
      b) bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$PATCH" "$O" ;;
      c) bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$ORDER" "$O" ;;
      p) bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$PRESENT" "$O" ;;
      t) bash "$BASE/subject.sh" "$KIT" "$sc-$i" "$sc" "$PRESENT" "$O" "$T2" ;;
      i|i2|m) bash "$BASE/interview.sh" "$KIT" "$sc-$i" "$sc" "$O" ;;
    esac
  done
done
