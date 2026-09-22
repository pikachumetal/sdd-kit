#!/usr/bin/env bash
# GREEN de la task 0010: mismo escenario que el RED (E1), con la plantilla y el script ya cambiados.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia del kit con la task aplicada)}"
for i in 1 2; do
  bash "$BASE/subject.sh" "$KIT" m-close "e1-green2-$i" "Cierra la task 0009. Lo he probado yo: \`node src/app.js libres 10-12\` da el mensaje de error y \`node src/app.js libres 10:00-12:00\` da Sur. Funciona." "" "$BASE" &
done
wait
