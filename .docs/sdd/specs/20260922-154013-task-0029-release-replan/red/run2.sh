#!/usr/bin/env bash
# Tanda RED 2: triaje de notas con agrupación por temática (el caso de 82c2b53 y f00195a).
# Uso: RUNS_DIR=<scratchpad>/runs run2.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"
T1="Invoca la skill sdd-kit:sdd-start-release. Tría en la release en curso las notas de uso de .docs/sdd/feedback/usage-notes.md."
T2="Sí, adelante con lo que propones."
for label in s1 s2; do
  MOLD=m2 bash "$BASE/subject.sh" "$KIT" "$label" "$T1" "$T2" "$BASE/out" &
done
wait
