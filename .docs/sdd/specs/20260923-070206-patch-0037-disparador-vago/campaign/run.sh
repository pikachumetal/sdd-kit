#!/usr/bin/env bash
# Patch 0037: validación diferida con disparador vago. Reutiliza subject.sh y el molde m-close de la task 0008.
# Uso: [ROUND=2] run.sh <kit> <brazo> <salida>. Brazos: red y green (dos sujetos, dos turnos), ctl (un turno, sin diferir).
# Sujetos en serie; se archivan solo walkthrough, roadmap, estado git y mensaje final (rutas cortas).
set -u
T0008="$(cd "$(dirname "$0")/../../20260921-162234-task-0008-control-profiles/red" && pwd)"
KIT="$1"; ARM="$2"; OUT="$3"
RAW="${RUNS_DIR:?define RUNS_DIR (scratchpad)}/raw"
T1="Cierra la task 0009."
T2="Diferida: se prueba en uso. Cierra y mergea a develop."
for N in 1 2; do
  L="$ARM${ROUND:-}-$N"
  if [ "$ARM" = ctl ]; then bash "$T0008/subject.sh" "$KIT" m-close "$L" "$T1" "" "$RAW"
  else bash "$T0008/subject.sh" "$KIT" m-close "$L" "$T1" "$T2" "$RAW"; fi
  mkdir -p "$OUT/$L"
  cp "$RAW/$L.state.txt" "$OUT/$L/state.txt"
  cp "$RAW/$L/roadmap.md" "$OUT/$L/"
  find "$RAW/$L/specs" -path '*task-0009*' -name walkthrough.md -exec cp {} "$OUT/$L/" \; 2>/dev/null
  for f in "$RAW/$L"/t*-result.json; do
    PYTHONIOENCODING=utf-8 python -c "import json,sys;d=json.loads(open(sys.argv[1],encoding='utf-8').readline());print(d.get('result',''));print('coste:',d.get('total_cost_usd'))" "$f" > "$OUT/$L/$(basename "$f" -result.json).txt"
  done
done
