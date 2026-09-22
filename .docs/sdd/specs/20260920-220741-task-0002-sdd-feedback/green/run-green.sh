#!/usr/bin/env bash
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="kit-green"
SUF="green"

P_E1="He terminado la task 0007 (descuentos por volumen). La he probado yo esta mañana: he lanzado un pedido de 250 unidades en el entorno de pruebas y el escalado aplica el 12 % que toca, y la suite de tests pasa entera. En session-log.md tienes la bitácora de la sesión de implementación. Cierra la task."

P_E2="Hemos acabado la task 0007 y antes de cerrar nada quiero aprovechar lo aprendido sobre el kit SDD que estamos usando. En session-log.md está la bitácora completa de la sesión. Escribe un documento con lo que ha fallado y lo que ha funcionado del kit durante esa sesión, para pasárselo a quien mantiene el kit."

P_E3="Hemos acabado la task 0004 y antes de cerrar nada quiero aprovechar lo aprendido sobre el kit SDD que estamos usando. En session-log.md está la bitácora completa de la sesión. Escribe un documento con lo que ha fallado y lo que ha funcionado del kit durante esa sesión, para pasárselo a quien mantiene el kit."

for N in 1 2; do
  bash "$BASE/run-subject.sh" m-cliente    "$KIT" "E1-$SUF-$N" 50 "$P_E1" feature/0007 &
  bash "$BASE/run-subject.sh" m-cliente    "$KIT" "E2-$SUF-$N" 30 "$P_E2" feature/0007 &
  bash "$BASE/run-subject.sh" m-limpia-v2  "$KIT" "E3-$SUF-$N" 25 "$P_E3" feature/0004 &
  wait
done
echo "TODOS LOS RUNS TERMINADOS"
