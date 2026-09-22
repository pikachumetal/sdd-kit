#!/usr/bin/env bash
# Sujeto headless a dos turnos en un worktree con base vieja: develop ya cerró la 0005 y está sacada en otro worktree.
# Uso: subject3.sh <kit> <etiqueta> <turno1> <turno2> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; LABEL="$2"; TURN1="$3"; TURN2="$4"; OUT="$5"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"; W6="$RUNS/$LABEL-w6"; WR="$RUNS/$LABEL-rp"
rm -rf "$RUN" "$W6" "$WR"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/m3/." "$RUN/"
g() { git -C "$1" -c user.email=fixture@example.com -c user.name=Fixture "${@:2}"; }
g "$RUN" init -q -b main
g "$RUN" add -A
g "$RUN" commit -q -m "feat: base de la release 0.4.0"
g "$RUN" branch develop
g "$RUN" branch replan
g "$RUN" checkout -q -b feature/0005
cp -r "$BASE/c5/." "$RUN/"
g "$RUN" add -A
g "$RUN" commit -q -m "feat(recurring): reserva recurrente semanal y cierre de la task 0005"
g "$RUN" checkout -q develop
g "$RUN" merge -q --no-ff feature/0005 -m "merge: task 0005, reserva recurrente semanal"
g "$RUN" worktree add -q -b feature/0006 "$W6" main
cp -r "$BASE/b6s/." "$W6/"
g "$W6" add -A
g "$W6" commit -q -m "docs(sdd): spec de la 0006 y partición de las plantillas a la 0008"
g "$RUN" worktree add -q "$WR" replan

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

cd "$WR"
ask "$TURN1" > "$RUNS/$LABEL-t1.jsonl" 2>"$RUNS/$LABEL-t1.err"
SESSION="$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL-t1.jsonl" | head -1 | cut -d'"' -f4)"
ask --resume "$SESSION" "$TURN2" > "$RUNS/$LABEL-t2.jsonl" 2>"$RUNS/$LABEL-t2.err"

mkdir -p "$OUT/$LABEL"
{
  echo "## git status (replan)"; g "$WR" status --short
  echo "## git status (develop)"; g "$RUN" status --short
  echo "## git log"; g "$RUN" log --oneline --all --decorate --graph
  echo "## worktrees"; g "$RUN" worktree list
} > "$OUT/$LABEL/state.txt"
g "$RUN" show develop:.docs/sdd/roadmap.md > "$OUT/$LABEL/roadmap-develop.md"
cp "$WR/.docs/sdd/roadmap.md" "$OUT/$LABEL/roadmap-replan.md"
cp "$RUN/.docs/sdd/roadmap.md" "$OUT/$LABEL/roadmap-develop-worktree.md"
for s in t1 t2; do
  grep -o '"total_cost_usd":[0-9.]*' "$RUNS/$LABEL-$s.jsonl" | tail -1 >> "$OUT/$LABEL/cost.txt"
done
echo "[$LABEL] listo (sesión $SESSION)"
