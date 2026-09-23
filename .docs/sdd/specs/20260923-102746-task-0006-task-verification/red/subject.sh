#!/usr/bin/env bash
# Sujeto headless a un turno: escribe el plan.md de la spec aprobada de la task 0012 del molde y para.
# Uso: subject.sh <etiqueta> <salida>   (KIT_DIR = copia limpia del kit; RUNS_DIR = scratchpad)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
LABEL="$1"; mkdir -p "$2"; OUT="$(cd "$2" && pwd)"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada. Escribe el plan.md y para ahí, sin implementar nada."
rm -rf "$RUN"; mkdir -p "$RUN"
cp -r "$BASE/m/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A; g commit -q -m "feat: lista de reservas con paginación"
g checkout -q -b develop
g checkout -q -b feature/0012
cp -r "$BASE/f1/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): spec de la task 0012"
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "${KIT_DIR:?define KIT_DIR}" --add-dir "$KIT_DIR" \
  --allowedTools "Bash(*)" "Agent" --disallowedTools "SendMessage" "ListAgents" \
  --permission-mode acceptEdits --max-turns "${MAX_TURNS:-60}" \
  --output-format stream-json --verbose \
  "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"
{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --oneline --all --decorate
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
find "$RUN/.docs/sdd/specs" -name 'plan.md' -exec cp {} "$OUT/$LABEL/" \;
find "$RUN/.docs/sdd/specs" -name 'tasks.md' -exec cp {} "$OUT/$LABEL/" \;
grep '"type":"result"' "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL/result.json"
echo "[$LABEL] listo"
