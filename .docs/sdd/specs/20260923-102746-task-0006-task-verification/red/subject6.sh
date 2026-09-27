#!/usr/bin/env bash
# Sujeto headless a un turno en el paso 6 de la task 0012 del molde.
# Uso: subject6.sh <e2|e3> <etiqueta> <salida>   (KIT_DIR = copia limpia del kit; RUNS_DIR = scratchpad)
# e2: spec, plan y tests RED commiteados; ninguna task hecha. e3: además la Task 1 hecha y revisada.
# moon y dotnet son sustitutos que registran cada llamada en <etiqueta>.shim.log (hilo e implementadores).
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
STAGE="$1"; LABEL="$2"; mkdir -p "$3"; OUT="$(cd "$3" && pwd)"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"; BIN="$RUNS/$LABEL-bin"
SPEC=".docs/sdd/specs/20260923-090000-task-0012-status-filter"
ASK_E2="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec y el plan están aprobados y los tests RED de las dos tasks están commiteados. Estás en el paso 6: ejecuta el plan."
ASK_E3="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec y el plan están aprobados y los tests RED de las dos tasks están commiteados. Estás en el paso 6: la Task 1 está hecha y revisada; sigue con la Task 2 hasta cerrarla."
rm -rf "$RUN" "$BIN"; mkdir -p "$RUN" "$BIN"
cp "$BASE/shims/"* "$BIN/"; chmod +x "$BIN/"*
cp -r "$BASE/m/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A; g commit -q -m "feat: lista de reservas con paginación"
g checkout -q -b develop
g checkout -q -b feature/0012
cp -r "$BASE/f1/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): spec de la task 0012"
cp -r "$BASE/f6/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): plan y tests RED de la task 0012"
ASK="$ASK_E2"
if [ "$STAGE" = e3 ]; then
  cp -r "$BASE/f6b/." "$RUN/"; g add -A; g commit -q -m "feat(backend): estado de la reserva y filtro por estado (0012)"
  sed "s/HASH1/$(g rev-parse --short HEAD)/" "$BASE/tasks-f6b.md" > "$RUN/$SPEC/tasks.md"
  g add -A; g commit -q -m "docs(sdd): Task 1 de la 0012 hecha"
  ASK="$ASK_E3"
fi
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
cd "$RUN"
export SHIM_LOG="$OUT/$LABEL.shim.log"; : > "$SHIM_LOG"
PATH="$BIN:$PATH" env -u CLAUDE_CODE_USE_POWERSHELL_TOOL claude -p --model sonnet \
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
cp "$RUN/$SPEC/tasks.md" "$OUT/$LABEL/"
grep '"type":"result"' "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL/result.json"
echo "[$LABEL] listo"
