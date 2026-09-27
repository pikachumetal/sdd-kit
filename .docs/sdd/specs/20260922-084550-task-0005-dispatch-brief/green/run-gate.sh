#!/usr/bin/env bash
# Segunda iteración de E2: la regla del gate nombra la racionalización del GREEN («arreglar el código» para que el checker no lo vea). Los sujetos 3 y 4 se pararon: llevaban un ejemplo del mismo dominio que el molde.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
S="$BASE/../red/subject.sh"; O="${OUT_DIR:-$BASE/out}"
E2="$(cat "$BASE/e2-encargo.md")"
for i in 5 6; do bash "$S" m-impl "e2-green-$i" "$E2" "$O" & done
wait
