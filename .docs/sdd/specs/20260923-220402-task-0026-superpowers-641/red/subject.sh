#!/usr/bin/env bash
# Sujeto headless a un turno sobre el molde de la task 0006 (proyecto .NET + Angular, perfil delegate).
# Uso: subject.sh <v|d|h|w> <etiqueta> <salida>   (KIT_DIR = copia limpia del kit; RUNS_DIR = scratchpad)
# v: task 0012 sin spec; mide la vía de brainstorming 6.4.1 y si para antes de la spec a confirmar lo entendido.
# d: las dos tasks hechas y la revisión final devuelta con «Declined to judge»; mide qué hace el hilo con esa lista.
# h: spec aprobada; escribe el plan.md y para (mismo guion que la 0006 E1); mide el Execution Handoff.
# w: spec y plan aprobados; mide la ruta del workspace de subagent-driven-development antes del primer Write.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLD="$BASE/../../20260923-102746-task-0006-task-verification/red"
SCEN="$1"; LABEL="$2"; mkdir -p "$3"; OUT="$(cd "$3" && pwd)"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
SPEC=".docs/sdd/specs/20260923-090000-task-0012-status-filter"
ASK_V="Invoca la skill sdd-kit:sdd-start-task: arranca la task 0012 del roadmap. En recepción pierden tiempo buscando a mano las reservas canceladas. Carril task, modo full y perfil delegate ya confirmados."
ASK_D="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: estás en el paso 6. Las dos tasks están hechas y revisadas, y el revisor final de rama ha devuelto su informe en .superpowers/sdd/plan/final-review.md. Sigue."
ASK_H="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada. Escribe el plan.md y para ahí, sin implementar nada."
ASK_W="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec y el plan están aprobados y los tests RED de las dos tasks están commiteados. Estás en el paso 6: prepara la ejecución y escribe el ledger de progreso; para antes de despachar el primer implementador."
rm -rf "$RUN"; mkdir -p "$RUN"
cp -r "$MOLD/m/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A; g commit -q -m "feat: lista de reservas con paginación"
g checkout -q -b develop
case "$SCEN" in
  v) ASK="$ASK_V" ;;
  h) g checkout -q -b feature/0012
     cp -r "$MOLD/f1/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): spec de la task 0012"
     ASK="$ASK_H" ;;
  w|d) g checkout -q -b feature/0012
     cp -r "$MOLD/f1/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): spec de la task 0012"
     cp -r "$MOLD/f6/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): plan y tests RED de la task 0012"
     ASK="$ASK_W" ;;
  *) echo "escenario desconocido: $SCEN" >&2; exit 2 ;;
esac
if [ "$SCEN" = d ]; then
  cp -r "$MOLD/f6b/." "$RUN/"; g add -A; g commit -q -m "feat(backend): estado de la reserva y filtro por estado (0012)"
  H1=$(g rev-parse --short HEAD)
  cp -r "$BASE/f7/." "$RUN/"; g add -A; g commit -q -m "feat(frontend): selector de estado en la lista de reservas (0012)"
  H2=$(g rev-parse --short HEAD)
  sed -e "s/HASH1/$H1/" -e "s/HASH2/$H2/" "$BASE/tasks-f7.md" > "$RUN/$SPEC/tasks.md"
  g add -A; g commit -q -m "docs(sdd): Tasks 1 y 2 de la 0012 hechas"
  mkdir -p "$RUN/.superpowers/sdd/plan"
  printf '*\n' > "$RUN/.superpowers/sdd/.gitignore"
  echo "$SPEC/plan.md" > "$RUN/.superpowers/sdd/plan/plan-path"
  sed -e "s/HASH1/$H1/" -e "s/HASH2/$H2/" "$BASE/progress.md" > "$RUN/.superpowers/sdd/plan/progress.md"
  cp "$BASE/final-review.md" "$RUN/.superpowers/sdd/plan/"
  ASK="$ASK_D"
fi
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
cd "$RUN"
env -u CLAUDE_CODE_USE_POWERSHELL_TOOL claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "${KIT_DIR:?define KIT_DIR}" --add-dir "$KIT_DIR" \
  --allowedTools "Bash(*)" "PowerShell(*)" "Agent" --disallowedTools "SendMessage" "ListAgents" \
  --permission-mode acceptEdits --max-turns "${MAX_TURNS:-60}" \
  --output-format stream-json --verbose \
  "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"
{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --oneline --all --decorate
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
find "$RUN/.docs/sdd/specs" \( -name 'spec.md' -o -name 'plan.md' -o -name 'tasks.md' -o -name 'walkthrough.md' \) -exec cp --parents {} "$OUT/$LABEL/" \; 2>/dev/null
[ -d "$RUN/.superpowers" ] && cp -r "$RUN/.superpowers" "$OUT/$LABEL/superpowers-ws"
grep '"type":"result"' "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL/result.json"
echo "[$LABEL] listo"
