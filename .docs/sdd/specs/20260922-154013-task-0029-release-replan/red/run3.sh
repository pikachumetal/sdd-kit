#!/usr/bin/env bash
# Tanda RED 3: triaje desde un worktree con base vieja (el caso de 82c2b53).
# Uso: RUNS_DIR=<scratchpad>/runs run3.sh <kit>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"
T1="Invoca la skill sdd-kit:sdd-start-release. Tría en la release en curso las notas de uso de .docs/sdd/feedback/usage-notes.md."
T2="Sí, adelante con lo que propones."
for label in u1 u2; do
  bash "$BASE/subject3.sh" "$KIT" "$label" "$T1" "$T2" "$BASE/out" &
done
wait
