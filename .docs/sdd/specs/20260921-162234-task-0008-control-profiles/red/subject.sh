#!/usr/bin/env bash
# Sujeto headless a dos turnos sobre una copia fresca del molde.
# Uso: subject.sh <kit> <etiqueta> <turno1> <turno2> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; LABEL="$2"; TURN1="$3"; TURN2="$4"; OUT="$5"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
rm -rf "$RUN"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/mold/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A
g commit -q -m "feat: base de reservas de salas"
g checkout -q -b develop

ask() {
  claude -p --model sonnet \
    --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --max-turns 60 \
    --output-format stream-json --verbose \
    "$@" < /dev/null
}

cd "$RUN"
ask "$TURN1" > "$RUNS/$LABEL-t1.jsonl" 2>"$RUNS/$LABEL-t1.err"
SESSION="$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL-t1.jsonl" | head -1 | cut -d'"' -f4)"
ask --resume "$SESSION" "$TURN2" > "$RUNS/$LABEL-t2.jsonl" 2>"$RUNS/$LABEL-t2.err"

{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --oneline --all --decorate
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
[ -d .docs/sdd/specs ] && cp -r .docs/sdd/specs "$OUT/$LABEL/"
for t in t1 t2; do
  grep '"type":"result"' "$RUNS/$LABEL-$t.jsonl" > "$OUT/$LABEL/$t-result.json"
done
echo "[$LABEL] listo (sesión $SESSION)"
