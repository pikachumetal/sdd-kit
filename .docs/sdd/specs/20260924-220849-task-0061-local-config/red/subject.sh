#!/usr/bin/env bash
# Sujeto headless de la 0061 sobre el repo de juguete salas (molde de la 0044).
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   c1  una persona pide su propia configuración (pair y entorno arrancado) sin cambiar la del equipo
#   c2  sdd-start-task con un sdd-kit.local.json que trae el perfil y dos claves de política
#   c3  poner al día la configuración de un proyecto sin execution ni merge.push
#   c4  control de no regresión: «actualízame al kit» desde la v1.1.0
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$SPECS/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
case $SC in
  c2) printf '.docs/sdd/sdd-kit.local.json\n' >> "$R/.gitignore" ;;
  c4) put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-20"}
JSON
      ;;
esac
commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  c1) ASK="Soy Marta, del equipo de salas. Yo prefiero trabajar en pair y que, cuando me toque validar una task, me arranques el entorno antes de darme el guion de pruebas. El resto del equipo sigue como está. Déjamelo configurado en este proyecto. No hay nadie más a quien preguntar." ;;
  c2) put .docs/sdd/sdd-kit.local.json <<'JSON'
{"control": {"profile": "pair"}, "merge": {"noFf": false}, "ids": {"mode": "tracker"}}
JSON
      g checkout -q -b feature/0012
      ASK="Invoca la skill sdd-kit:sdd-start-task y arranca la task 0012 del roadmap. Llega hasta la primera pregunta de la skill (carril, modo y perfil) y para ahí: escríbela como texto en tu último mensaje, sin herramientas de pregunta." ;;
  c3) ASK="Revisa la configuración del kit SDD de este proyecto y ponla al día con lo que le falte. Pregúntame lo que necesites; si tienes una pregunta, escríbela en tu último mensaje y para." ;;
  c4) ASK="Actualízame al kit. Si tienes una pregunta, escríbela en tu último mensaje y para." ;;
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
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## git log"; g log --format='%h %s' --all
  echo "## ficheros commiteados en la rama tras la base"; g diff --name-only "$BEFORE" HEAD
  echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json" 2>/dev/null
  echo; echo "## diff de sdd-kit.json frente a la base"; g diff "$BEFORE" -- .docs/sdd/sdd-kit.json
  echo "## sdd-kit.local.json"; cat "$R/.docs/sdd/sdd-kit.local.json" 2>/dev/null || echo "(no existe)"
  echo; echo "## .gitignore"; cat "$R/.gitignore"
  echo "## otros ficheros nuevos o cambiados"; g status --porcelain --untracked-files=all | grep -v 'sdd-kit\|gitignore'
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
