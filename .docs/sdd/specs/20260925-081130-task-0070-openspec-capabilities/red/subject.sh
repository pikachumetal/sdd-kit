#!/usr/bin/env bash
# Sujeto headless sobre el repo de juguete salas.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   m  cerrar la task 0020, cuyo MODIFIED se escribió antes de que el patch 0014 fusionara en el mismo requisito
#   c  arrancar la task 0021 (cancelar una reserva) hasta la spec, con la capacidad bookings ya escrita
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-task/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
MOLD="${MOLD_DIR:-$BASE}"
. "$MOLD/mold.sh"
. "$MOLD/mold-0070.sh"

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
commit "feat: base de reservas de salas"
case $SC in
  m) task_sorted_behind_patch
     ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0020. Ya integré develop en la rama y \`node --test\` pasa. Validada por el dev-lead: «he probado \`salas libres 10-12\` con Norte reservada y sale \`Sur\` y luego \`Oeste (en mantenimiento)\`; funciona». Tiempo real: 0,6 h. Si tienes una pregunta, escríbela en tu último mensaje y para." ;;
  c) task_cancel_start
     ASK="Invoca la skill sdd-kit:sdd-start-task y arranca la task 0021 de la fila del roadmap. Soy el dev-lead y me ausento: task en modo lite, perfil delegate, apruebo la spec por delegación, nos vemos en la validación. No me hagas preguntas: decide tú y apúntalo en la spec. Escribe y commitea la spec y para antes de implementar." ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac

BEFORE=$(g rev-parse --short HEAD)
cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "PowerShell(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-60}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## git log"; g log --format='%h %s' --all
  echo "## ficheros tocados tras la base (commits y árbol)"; g diff --name-only "$BEFORE"
  echo "## capabilities/ al final"; ls "$R/.docs/sdd/capabilities/"
  echo "## diff de capabilities/ frente a la base"; g diff "$BEFORE" -- .docs/sdd/capabilities/
  for f in "$R"/.docs/sdd/specs/*task-00*/*.md; do echo "## $(basename "$(dirname "$f")")/$(basename "$f")"; cat "$f"; done
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
