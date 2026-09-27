#!/usr/bin/env bash
# Sujeto headless sobre una copia fresca del molde: mide la primera skill que invoca en el último turno.
# Uso: subject.sh <molde> <kit> <etiqueta> <peticion> <salida> [<peticion-turno-2>]
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLD="$1"; KIT="$2"; LABEL="$3"; REQUEST="$4"; OUT="$5"; REQUEST2="${6:-}"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
rm -rf "$RUN"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/$MOLD/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A
g commit -q -m "feat: base con cancelación de reservas"
g checkout -q -b develop

ask() {
  claude -p --model sonnet \
    --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --max-turns 6 \
    --output-format stream-json --verbose \
    "$@" < /dev/null
}

cd "$RUN"
LAST="$RUNS/$LABEL.jsonl"
ask "$REQUEST" > "$LAST" 2> "$RUNS/$LABEL.err"
if [ -n "$REQUEST2" ]; then
  SESSION="$(grep -o '"session_id":"[^"]*"' "$LAST" | head -1 | cut -d'"' -f4)"
  python "$BASE/first-skills.py" "$LAST" > "$OUT/$LABEL.skills-t1.txt"
  cp "$LAST" "$OUT/$LABEL.t1.jsonl"
  LAST="$RUNS/$LABEL-t2.jsonl"
  ask --resume "$SESSION" "$REQUEST2" > "$LAST" 2> "$RUNS/$LABEL-t2.err"
fi

python "$BASE/first-skills.py" "$LAST" > "$OUT/$LABEL.skills.txt"
{ echo "## git status"; g status --short; } > "$OUT/$LABEL.state.txt"
cp "$LAST" "$OUT/$LABEL.jsonl"
echo "[$LABEL] $(head -3 "$OUT/$LABEL.skills.txt" | tr '\n' ' ')"
