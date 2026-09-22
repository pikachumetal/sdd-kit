#!/usr/bin/env bash
# Re-medición del patch 0028: dos sujetos por brazo sobre el molde m5 de la task 0004, cerrando con versión dada.
# Reutiliza subject.sh y los moldes de la 0004. Uso: run.sh <kit> <sufijo> <salida>
set -u
T0004="$(cd "$(dirname "$0")/../../20260921-074701-task-0004-release-without-client/red" && pwd)"
KIT="$1"; SUF="$2"; OUT="$3"
for N in 1 2; do
  bash "$T0004/subject.sh" m5 "$KIT" "r-$SUF-$N" \
    "Vamos a publicar a producción lo que tenemos. Cierra la release." "Sí, v0.4.0. Adelante." "$OUT" &
done
wait
