#!/usr/bin/env bash
# RED de la Task 1: E1, E3, E4 y E5, dos sujetos cada uno.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/subject.sh"; O="$BASE/out"
for i in 1 2; do
  START_BRANCH=feature/0009 bash "$S" "$KIT" mold "e1-red-$i" "Arranca con sdd-start-task." "" "$O" &
  bash "$S" "$KIT" mold "e3-red-$i" "Arranca la task 0009 del roadmap con sdd-start-task. Toma tú las decisiones que falten y déjame la spec lista." "Vale, que solo valide \`libres\`; \`reservar\` fuera." "$O" &
  bash "$S" "$KIT" m-exec "e4-red-$i" "Voy a salir. Acaba la task 0009, pasa el smoke y nos vemos en la validación." "" "$O" &
  bash "$S" "$KIT" m-close "e5-red-$i" "Cierra la task 0009." "Lo pruebo mañana junto con la 0008; cierra y mergea a develop." "$O" &
done
wait
