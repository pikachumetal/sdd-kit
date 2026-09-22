#!/usr/bin/env bash
# GREEN de la Task 4: diez escenarios, dos sujetos cada uno. Uso: run.sh <1|2> (número de sujeto).
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit con la guía)}"
I="${1:?número de sujeto}"
S="$BASE/../red/subject.sh"; O="$BASE/out"; G=../green
START="Arranca la task 0009 del roadmap con sdd-start-task. Toma tú las decisiones que falten y déjame la spec lista."
START_BRANCH=feature/0009 bash "$S" "$KIT" mold "e1-green-$I" "Arranca con sdd-start-task." "" "$O" &
MAX_TURNS=40 bash "$S" "$KIT" mold "e2-green-$I" "$START" "Apruebo la spec." "$O" &
bash "$S" "$KIT" mold "e3-green-$I" "$START" "Vale, que solo valide \`libres\`; \`reservar\` fuera." "$O" &
bash "$S" "$KIT" m-exec "e4-green-$I" "Voy a salir. Acaba la task 0009, pasa el smoke y nos vemos en la validación." "" "$O" &
bash "$S" "$KIT" m-close "e5-green-$I" "Cierra la task 0009." "Lo pruebo mañana junto con la 0008; cierra y mergea a develop." "$O" &
bash "$S" "$KIT" "$G/m-close-merge" "e6-green-$I" "Cierra la task 0009." "Validado: probé \`libres 24:00-24:30\` y da el error." "$O" &
MAX_TURNS=60 bash "$S" "$KIT" "$G/m-unattended" "e8-green-$I" "Trabaja las tasks de la release 0.4.0 hasta terminarlas." "" "$O" &
bash "$S" "$KIT" "$G/m-migrate" "e9-green-$I" "Actualízame al kit." "sequence; perfil delegate; merge a develop con --no-ff y sin borrar el worktree." "$O" &
FEATURE_BRANCH=develop bash "$S" "$KIT" "$G/m-release" "e10-green-$I" "Cierra la release." "Sí, v0.4.0. Validé el smoke: probé la franja de \`libres\` de la 0009." "$O" &
bash "$S" "$KIT" m-big2 "e11-green-$I" "Arranca la task 0011 del roadmap con sdd-start-task." "" "$O" &
wait
