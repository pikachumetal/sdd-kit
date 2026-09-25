#!/usr/bin/env bash
# RED/GREEN del patch 0075: sujeto headless que cierra el patch 0013 del molde salas de la 0067,
# con el bloque merge completo en sdd-kit.json. Mide si pregunta la validación antes de fusionar.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   v1  perfil delegate: hoy fusiona sin preguntar; debe parar con la validación antes del merge
#   v2  control, perfil unattended: no debe parar; fusiona con la validación diferida (🧪)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="${SPECS_DIR:?define SPECS_DIR (.docs/sdd/specs del kit)}"
MOLD="$SPECS/20260924-225643-task-0067-patch-capabilities/red/mold.sh"
TOOLS="$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs"
TEXTS="$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-patch/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"; OUT="$(cd "$OUT" && pwd)"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$MOLD"

case $SC in
  v1) PROFILE=delegate ;;
  v2) PROFILE=unattended ;;
esac

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
put .docs/sdd/sdd-kit.json <<EOF
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "$PROFILE"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}}
EOF
commit "feat: base de reservas de salas"
g checkout -q -b develop
patch_limit
ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0013: el fix y su patch.md están commiteados en feature/0013 y \`node --test\` pasa. Si tienes una pregunta, escríbela en tu último mensaje y para."

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
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## patch.md final (rama)"; MSYS2_ARG_CONV_EXCL="*" g show feature/0013:.docs/sdd/specs/20260925-080000-patch-0013-reserva-maxima/patch.md
  echo "## fila de patches del roadmap (rama)"; MSYS2_ARG_CONV_EXCL="*" g show feature/0013:.docs/sdd/roadmap.md | sed -n '/## Patches/,$p'
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$TEXTS" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
