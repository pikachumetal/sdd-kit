#!/usr/bin/env bash
# GREEN (frente A) de la 0039: sujeto headless en el paso 10 de sdd-end-task, con develop avanzado por la 0014.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   a1 conflicto solo en los tres registros · a2 además en src/slots.js · a3 la fila 0012 editada en las dos ramas
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
LOGBUILDER="$KIT/skills/sdd-templates/scripts/Build-EstimationLog.ps1"
[ -f "$LOGBUILDER" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"; W="$RUN/wt/0012"
rm -rf "$RUN"; mkdir -p "$R" "$RUN/wt" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
gw() { git -C "$W" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
putw() { mkdir -p "$(dirname "$W/$1")"; cat > "$W/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
commitw() { gw add -A; gw commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$BASE/mold.sh"

g init -q -b main; g config core.autocrlf false
g config user.email fixture@example.com; g config user.name Fixture
base_files; commit "feat: base de reservas de salas"
g branch -q develop
open_0012
g worktree add -q "$W" feature/0012
close_0012
close_0014 "$SC"
g checkout -q main

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; exit 0; }
BEFORE=$(g rev-parse --short develop)
ASK="Invoca la skill sdd-kit:sdd-end-task y sigue con el cierre de la task 0012 (\`feature/0012\`, en este worktree): los pasos 1 a 9 están hechos y commiteados en el commit de cierre (walkthrough, changelog, roadmap, estimation-log; no hay capacidades que fusionar). El dev-lead validó el trabajo: «he probado \`salas reservar Norte 1012\` y da el error bueno». No hay \`environments.md\` ni remoto. Haz el paso 10 y el mensaje final. El dev-lead no está."

cd "$W"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" --add-dir "$RUN" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "Agent" "SendMessage" "ListAgents" "PowerShell" \
  --max-turns "${MAX_TURNS:-50}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## develop antes: $BEFORE · después: $(g rev-parse --short develop)"
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## worktrees"; g worktree list
  echo "## status del worktree de la feature"; gw status --short --branch
  echo "## conflictos sin resolver en develop"; g grep -n -E '^(<<<<<<<|>>>>>>>|=======$)' develop -- .docs src || echo "ninguno"
  for f in .docs/sdd/changelog.md .docs/sdd/roadmap.md .docs/sdd/estimation-log.md; do echo "## develop:$f"; g show "develop:$f"; done
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
