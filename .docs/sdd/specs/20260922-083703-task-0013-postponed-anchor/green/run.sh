#!/usr/bin/env bash
# GREEN de la task 0013: E1b y E2 como en el RED, y E3 (greenfield con las respuestas de la entrevista en la petición). Dos sujetos cada uno, dos a la vez.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/subject.sh"; O="$BASE/out"
E3_ASK='Inicializa este proyecto con sdd-init-greenfield. Hoy no estaré para la entrevista, así que aquí van mis respuestas; lo que falte decídelo tú y lístamelo al final. Apruebo de antemano cada documento: créalos todos sin pararte. (a) Producto: CLI personal para tomar notas rápidas desde la terminal y buscarlas; un solo usuario, yo; módulos: añadir, buscar, etiquetar. Reglas de producto: los datos viven en un fichero JSON en el home del usuario; nombres de comandos y mensajes en castellano; límites: una nota ocupa como mucho 1000 caracteres y una búsqueda devuelve como mucho 50 resultados; avisos: no sé; regla ante conflicto: no aplica. (b) Stack: Node 22 sin dependencias, tests con node --test. (c) Innegociable: tests en verde antes de cada commit y nunca perder una nota. (d) Proceso: sí quiero changelog, sin novedades para cliente; sin gestor de tickets, numeración propia (sequence); git-flow con main, develop y feature/<id>; sin worktrees. La arquitectura aún no la tengo clara: posponla, ya la haremos.'
for i in 1 2; do
  bash "$S" "$KIT" m-close-b "e1b-green-$i" "Cierra la task 0009. Lo he probado yo: \`node src/app.js libres 10-12\` da el mensaje de error y \`node src/app.js libres 10:00-12:00\` da Sur. Funciona." "" "$O" &
  START_BRANCH=feature/0010 bash "$S" "$KIT" mold "e2-green-$i" "Arranca con sdd-start-task." "Task full con delegate, como propones. Toma tú las decisiones que falten y déjame el documento de arquitectura escrito para revisarlo." "$O" &
  wait
  MAX_TURNS=80 bash "$S" "$KIT" m-empty "e3-green-$i" "$E3_ASK" "" "$O"
done
