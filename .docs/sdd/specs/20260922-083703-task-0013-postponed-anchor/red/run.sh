#!/usr/bin/env bash
# RED previo a la spec de la task 0013: E1 (cierre sin architecture.md) y E2 (crear el anclaje pospuesto), dos sujetos cada uno.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/subject.sh"; O="$BASE"
# E1b: E1 sin la línea de estructura en tech-stack.md (el molde de E1 le daba sitio al aprendizaje).
if [ -n "${E1B:-}" ]; then
  for i in 1 2; do
    bash "$S" "$KIT" m-close-b "e1b-red-$i" "Cierra la task 0009. Lo he probado yo: \`node src/app.js libres 10-12\` da el mensaje de error y \`node src/app.js libres 10:00-12:00\` da Sur. Funciona." "" "$O" &
  done
  wait
  exit 0
fi
for i in 1 2; do
  bash "$S" "$KIT" m-close "e1-red-$i" "Cierra la task 0009. Lo he probado yo: \`node src/app.js libres 10-12\` da el mensaje de error y \`node src/app.js libres 10:00-12:00\` da Sur. Funciona." "" "$O" &
  START_BRANCH=feature/0010 bash "$S" "$KIT" mold "e2-red-$i" "Arranca con sdd-start-task." "Task full con delegate, como propones. Toma tú las decisiones que falten y déjame el documento de arquitectura escrito para revisarlo." "$O" &
  wait
done
