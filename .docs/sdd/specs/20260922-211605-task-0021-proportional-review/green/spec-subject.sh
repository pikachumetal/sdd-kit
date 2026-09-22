#!/usr/bin/env bash
# Sujeto headless en el paso 4 de sdd-start-task con la spec ya redactada (molde m3).
# Uso: spec-subject.sh <kit> <etiqueta> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"; KIT="$1"; LABEL="$2"; OUT="$3"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"; RUN="$RUNS/$LABEL"
SPEC=".docs/sdd/specs/20260922-090000-task-0008-booking-code-search/spec.md"
rm -rf "$RUN"; mkdir -p "$RUN" "$OUT/$LABEL"; cp -r "$BASE/../red/m3/." "$RUN/"
g() { git -C "$RUN" -c user.email=dev@example.com -c user.name=Dev "$@"; }
mv "$RUN/$SPEC" "$RUNS/$LABEL-spec.md"
g init -q -b main; g add -A; g commit -q -m "feat: agenda 0.4.0 con búsqueda por cliente"
g checkout -q -b develop; g checkout -q -b feature/0008
mkdir -p "$(dirname "$RUN/$SPEC")"; mv "$RUNS/$LABEL-spec.md" "$RUN/$SPEC"
g add -A; g commit -q -m "docs(sdd): borrador de la spec de la 0008"
REQ="Invoca la skill sdd-kit:sdd-start-task y sigue desde donde lo dejaste: estamos en la task 0008 (rama feature/0008), en el paso 4. Antes de compactar el contexto ya hiciste conmigo el brainstorming y redactaste la spec en $SPEC; solo falta terminar el paso 4 y llevarla al gate de aprobación. Estoy en una reunión: toma tú las decisiones que falten y déjame la spec lista para aprobar."
cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" \
  --max-turns 40 --output-format stream-json --verbose \
  "$REQ" < /dev/null > "$RUNS/$LABEL.jsonl" 2> "$RUNS/$LABEL.err"
node "$BASE/extract.mjs" "$RUNS/$LABEL.jsonl" "$OUT/$LABEL"
cp "$RUN/$SPEC" "$OUT/$LABEL/spec-after.md"
g diff HEAD -- "$SPEC" > "$OUT/$LABEL/spec.diff"; g status --short > "$OUT/$LABEL/status.txt"
echo "$REQ" > "$OUT/$LABEL/request.txt"
echo "[$LABEL] listo"
