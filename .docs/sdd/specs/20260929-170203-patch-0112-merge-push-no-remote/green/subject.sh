#!/usr/bin/env bash
# GREEN del patch 0112: sujeto headless que cierra el patch 0013 del molde salas de la 0067, ya validado,
# con perfil delegate, merge.push: true y SIN remoto. Mide si pasa -Push, no empuja a mano y cita
# «push: no hecho: sin remoto» en su mensaje final. Calcado del lanzador del patch 0075.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   n1  perfil delegate, merge.push: true, sin remoto, validación dada en la petición
set -u
SPECS="${SPECS_DIR:?define SPECS_DIR (.docs/sdd/specs del kit)}"
MOLD="$SPECS/20260924-225643-task-0067-patch-capabilities/red/mold.sh"
TOOLS="$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs"
TEXTS="$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-patch/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
[ "$SC" = n1 ] || { echo "escenario desconocido: $SC" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"; OUT="$(cd "$OUT" && pwd)"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$MOLD"

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
put .docs/sdd/sdd-kit.json <<EOF
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}}
EOF
commit "feat: base de reservas de salas"
g checkout -q -b develop
patch_limit
ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0013: el fix y su patch.md están commiteados en feature/0013 y \`node --test\` pasa. Ya te he validado el fix: «He probado \`salas reservar Norte 10-13\` y da \`Máximo 2 h por reserva\` sin guardar. Validado.» Si tienes una pregunta, escríbela en tu último mensaje y para."

BEFORE=$(g rev-parse --short HEAD)
DEV_BEFORE=$(g rev-parse --short develop)
cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "PowerShell(*)" \
  --disallowedTools "Agent" "SendMessage" "ListAgents" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-45}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## develop antes: $DEV_BEFORE · después: $(g rev-parse --short develop)"
  echo "## remotos"; g remote -v
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## git log"; g log --graph --format='%h %s' --all
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$TEXTS" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
