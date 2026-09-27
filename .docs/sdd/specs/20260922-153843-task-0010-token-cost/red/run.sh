#!/usr/bin/env bash
# RED previo a la spec de la task 0010: E1, cierre de una task con costes de subagentes y de sujetos a la vista, dos sujetos.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
for i in 1 2; do
  bash "$BASE/subject.sh" "$KIT" m-close "e1-red-$i" "Cierra la task 0009. Lo he probado yo: \`node src/app.js libres 10-12\` da el mensaje de error y \`node src/app.js libres 10:00-12:00\` da Sur. Funciona." "" "$BASE" &
done
wait
