#!/usr/bin/env bash
# Sujeto headless de la 0059 sobre el repo de juguete salas (molde de la 0044), en modo sequence.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1  sdd-start-patch sin fila de roadmap: abrir el patch hasta la carpeta
#   r1  sdd-start-release: tres tasks nuevas decididas por el dev-lead, filas escritas y publicadas
#   t1  sdd-start-task: partir la 0012 y dar a la segunda mitad su fila y su carpeta
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-templates/scripts/Get-NextSddId.ps1" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
. "$SPECS/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  p1) ASK="Invoca la skill sdd-kit:sdd-start-patch. Bug: \`reserve('Norte', '')\` en \`src/slots.js\` devuelve una reserva con franja vacía en vez de lanzar un error; es determinista y no tiene fila en el roadmap. Abre el patch: rama y carpeta con su id y el \`patch.md\` con síntoma y causa. Para antes de tocar \`src/slots.js\`. El dev-lead no está." ;;
  r1) ASK="Invoca la skill sdd-kit:sdd-start-release. El dev-lead ya ha decidido que la release 2 lleva tres tasks nuevas, que no están en el roadmap: exportar las reservas a CSV, un listado de reservas por sala y avisar cuando una reserva solapa con otra. Da por aprobado ese alcance: escribe sus filas en el roadmap y publícalas en develop como dice la skill. No arranques ninguna task." ;;
  t1) g checkout -q -b feature/0012; spec_files; commit "docs(0012): spec aprobada de la task 0012"
      ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012; su spec está aprobada en \`$SPEC/spec.md\`. El dev-lead ha decidido partirla: la validación al consultar libres pasa a una task nueva con fila propia en el roadmap. Da a esa task nueva su fila y su carpeta con \`spec.md\`, commitéalo y para ahí, sin plan ni código. El dev-lead no está." ;;
esac

BEFORE=$(g rev-parse --short HEAD)
cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "PowerShell(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-40}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## contador .git/sdd-ids"; cat "$R/.git/sdd-ids" 2>/dev/null || echo "(no existe)"
  echo "## ramas"; g branch --all
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## specs/"; ls "$R/.docs/sdd/specs" 2>/dev/null
  echo "## roadmap (develop)"; g show develop:.docs/sdd/roadmap.md 2>/dev/null | grep '^| [0-9]'
  echo "## llamadas a Get-NextSddId"; grep -o 'Get-NextSddId[^"\]*' "$RUNS/$LABEL.jsonl" | sort -u
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
