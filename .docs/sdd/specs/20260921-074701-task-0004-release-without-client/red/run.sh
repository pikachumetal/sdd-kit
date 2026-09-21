#!/usr/bin/env bash
# Campaña: cuatro escenarios × dos sujetos. Uso: run.sh <kit> <sufijo> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; SUF="$2"; OUT="$3"

CLOSE="Vamos a publicar a producción lo que tenemos. Cierra la release."
OPEN="Abre la siguiente release con lo del backlog."

if [ "${E5:-0}" != "1" ] && [ "${E5B:-0}" != "1" ]; then
for N in 1 2; do
  bash "$BASE/subject.sh" m1 "$KIT" "e1-$SUF-$N" "$CLOSE" "Sí, v0.4.0. Adelante." "$OUT" &
  bash "$BASE/subject.sh" m2 "$KIT" "e2-$SUF-$N" "$CLOSE" "Sí, v1.3.0. Adelante." "$OUT" &
  bash "$BASE/subject.sh" m3 "$KIT" "e3-$SUF-$N" "$OPEN" "Entran las cuatro. Sigue." "$OUT" &
  bash "$BASE/subject.sh" m4 "$KIT" "e4-$SUF-$N" "$CLOSE" "Sí, v0.4.0. Adelante." "$OUT" &
done
wait
fi
echo "CAMPAÑA TERMINADA"

# E5 (añadido tras leer E1–E4): el orden del caso de campo H2 — autorización primero, corrección de versión después.
if [ "${E5:-0}" = "1" ]; then
  for N in 1 2; do
    bash "$BASE/subject.sh" m1 "$KIT" "e5-$SUF-$N" "Si lo tienes todo ya, puedes cerrarla." "La versión no es esa: v0.5.0." "$OUT" &
  done
  wait
fi

# E5-bis (añadido tras el GREEN): el mismo guion que E5 sobre m5, con código y tests reales, porque el
# ruido del molde m1 (commits vacíos) paró a los sujetos en el gate de entrada antes de llegar al gate de merge.
if [ "${E5B:-0}" = "1" ]; then
  for N in 1 2; do
    bash "$BASE/subject.sh" m5 "$KIT" "e5b-$SUF-$N" "Si lo tienes todo ya, puedes cerrarla." "La versión no es esa: v0.5.0." "$OUT" &
  done
  wait
fi
