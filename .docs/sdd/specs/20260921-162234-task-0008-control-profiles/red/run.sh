#!/usr/bin/env bash
# RED previo a la spec: ¿se ofrece el modo lite ante una task que cumple el predicado?
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
T1="Arranca la task 0009 del roadmap con sdd-start-task."
T2="Toma tú las decisiones que falten, lístalas en la spec y déjamela lista para aprobar."
for i in 1 2; do
  bash "$BASE/subject.sh" "$KIT" "lite-red-$i" "$T1" "$T2" "$BASE/out" &
done
wait
