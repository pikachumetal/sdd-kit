#!/usr/bin/env bash
# Sujeto headless de la 0067 sobre el repo de juguete salas.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1  cerrar un patch cuyo fix cambia lo que lista `libres`, que la capacidad describe de otra forma
#   p2  cerrar un patch cuyo fix devuelve `reservar` a lo que la capacidad ya decía (salida corta)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-patch/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$BASE/mold.sh"

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  p1) patch_maintenance; ID=0014 ;;
  p2) patch_limit; ID=0013 ;;
esac
ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch $ID: el fix y su patch.md están commiteados en feature/$ID y \`node --test\` pasa. Si tienes una pregunta, escríbela en tu último mensaje y para."

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
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## git log"; g log --format='%h %s' --all
  echo "## ficheros tocados tras la base (commits y árbol)"; g diff --name-only "$BEFORE"
  echo "## diff de capabilities/ frente a la base"; g diff "$BEFORE" -- .docs/sdd/capabilities/
  echo "## patch.md final"; cat "$R"/.docs/sdd/specs/*patch-$ID-*/patch.md
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
