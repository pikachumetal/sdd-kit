#!/usr/bin/env bash
# Sujeto headless a dos turnos: develop con la release en curso y feature/0006 abierta en otro worktree.
# Uso: subject.sh <kit> <etiqueta> <turno1> <turno2> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; LABEL="$2"; TURN1="$3"; TURN2="$4"; OUT="$5"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"; WT="$RUNS/$LABEL-w6"
rm -rf "$RUN" "$WT"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/${MOLD:-m1}/." "$RUN/"
g() { git -C "$1" -c user.email=fixture@example.com -c user.name=Fixture "${@:2}"; }
g "$RUN" init -q -b main
g "$RUN" add -A
g "$RUN" commit -q -m "feat: base de la release 0.4.0 con la recurrencia semanal"
g "$RUN" checkout -q -b develop
g "$RUN" worktree add -q -b feature/0006 "$WT" develop
cp -r "$BASE/b6/." "$WT/"
g "$WT" add -A
g "$WT" commit -q -m "docs(sdd): spec de la 0006 y partición de las plantillas a la 0008"

ask() {
  claude -p --model sonnet \
    --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --disallowedTools "SendMessage" "ListAgents" \
    --max-turns 60 \
    --output-format stream-json --verbose \
    "$@" < /dev/null
}

cd "$RUN"
ask "$TURN1" > "$RUNS/$LABEL-t1.jsonl" 2>"$RUNS/$LABEL-t1.err"
SESSION="$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL-t1.jsonl" | head -1 | cut -d'"' -f4)"
ask --resume "$SESSION" "$TURN2" > "$RUNS/$LABEL-t2.jsonl" 2>"$RUNS/$LABEL-t2.err"

mkdir -p "$OUT/$LABEL"
{
  echo "## git status (develop)"; g "$RUN" status --short
  echo "## git log"; g "$RUN" log --oneline --all --decorate --graph
  echo "## worktrees"; g "$RUN" worktree list
  echo "## último commit de develop"; g "$RUN" show --stat --format='%h %s' develop
} > "$OUT/$LABEL/state.txt"
g "$RUN" show develop:.docs/sdd/roadmap.md > "$OUT/$LABEL/roadmap-develop.md" 2>/dev/null
cp "$RUN/.docs/sdd/roadmap.md" "$OUT/$LABEL/roadmap-worktree.md"
g "$RUN" diff main --.docs/sdd/roadmap.md > "$OUT/$LABEL/roadmap.diff"
for s in t1 t2; do
  grep -o '"total_cost_usd":[0-9.]*' "$RUNS/$LABEL-$s.jsonl" | tail -1 >> "$OUT/$LABEL/cost.txt"
done
echo "[$LABEL] listo (sesión $SESSION)"
