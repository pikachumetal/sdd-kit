#!/usr/bin/env bash
# Sujeto revisor headless sobre el molde m1. Uso: review-subject.sh <etiqueta> <plantilla-de-encargo> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"; LABEL="$1"; TMPL="$2"; OUT="$3"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"; RUN="$RUNS/$LABEL"
VARS="$(bash "$BASE/build-mold.sh" "$RUN" 2>/dev/null)"
val() { echo "$VARS" | sed -n "s/^$1=//p"; }
WS="$(cygpath -m "$(val WS)")"
PROMPT="$(sed "s#__WS__#$WS#g; s#__T2BASE__#$(val T2BASE)#g; s#__T2HEAD__#$(val T2HEAD)#g; s#__FINALBASE__#$(val FINALBASE)#g" "$TMPL")"
mkdir -p "$OUT/$LABEL"; echo "$PROMPT" > "$OUT/$LABEL/prompt.md"
cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Read" "Grep" "Glob" \
  --disallowedTools "SendMessage" "ListAgents" "Agent" \
  --max-turns 40 --output-format stream-json --verbose \
  "$PROMPT" < /dev/null > "$RUNS/$LABEL.jsonl" 2> "$RUNS/$LABEL.err"
node "$BASE/extract.mjs" "$RUNS/$LABEL.jsonl" "$OUT/$LABEL"
git -C "$RUN" status --short > "$OUT/$LABEL/status.txt"
echo "[$LABEL] listo"
