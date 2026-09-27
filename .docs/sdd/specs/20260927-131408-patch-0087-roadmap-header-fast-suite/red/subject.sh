#!/usr/bin/env bash
# RED/GREEN del patch 0087: sujeto headless que cierra el patch 0013 del molde salas de la 0067 en
# perfil unattended (validación diferida al smoke de la release) con la sección «## Release 1.3.0»
# abierta en el roadmap. Mide si el patch diferido entra en la tabla de la release, que es donde
# sdd-end-release busca los 🧪 de su smoke.
# Uso: subject.sh <kit> <etiqueta> <salida>
set -u
SPECS="${SPECS_DIR:?define SPECS_DIR (.docs/sdd/specs del kit)}"
MOLD="$SPECS/20260924-225643-task-0067-patch-capabilities/red/mold.sh"
X="$(cd "$(dirname "$0")" && cd ../../../../../tests/headless && pwd)/extract.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; OUT="$3"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-patch/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"; OUT="$(cd "$OUT" && pwd)"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$MOLD"

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "unattended"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}}
EOF
put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0015 | exportar las reservas a CSV | ⏳ |

## Release 1.3.0

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0011 | `cancelar` una reserva | soporte | `src/cli.js`, `src/slots.js` | ✅ |
| 0012 | `libres` con franja parcial | soporte | `src/slots.js` | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
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
  echo "## roadmap (rama)"; MSYS2_ARG_CONV_EXCL="*" g show feature/0013:.docs/sdd/roadmap.md
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$X" tools "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$X" texts "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
