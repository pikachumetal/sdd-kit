#!/usr/bin/env bash
# RED/GREEN de la task 0018: dos sujetos por escenario. Uso: run.sh <kit> <brazo> <salida>
set -u
DIR="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; ARM="$2"; OUT="$3"
for N in 1 2; do
  bash "$DIR/subject.sh" mt feature/SALAS-142 "$KIT" "t-$ARM-$N" \
    "Invoca la skill sdd-kit:sdd-end-task y cierra la task SALAS-142. La he probado yo: \`node src/app.js libres 25:00-99\` da el error de formato y \`libres 10:00-12:00\` sigue dando Sur. Funciona." "$OUT" &
  bash "$DIR/subject.sh" mp feature/0008 "$KIT" "p-$ARM-$N" \
    "Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0008. Lo he probado yo y funciona." "$OUT" &
done
wait
