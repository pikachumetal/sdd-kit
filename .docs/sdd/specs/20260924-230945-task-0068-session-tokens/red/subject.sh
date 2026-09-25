#!/usr/bin/env bash
# Sujeto headless de la 0068 sobre el repo de juguete salas de la 0060, en el cierre de la task 0012.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   w2 cierre con la validación dada: escribir el walkthrough (pasos 1 y 2 de sdd-end-task) y parar
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
TEXTS="$(cd "$BASE/../../20260923-214917-task-0053-fewer-stops/red" && pwd)/texts.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-task/SKILL.md" ] && [ -f "$KIT/skills/sdd-templates/templates/walkthrough-template.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
. "$BASE/mold.sh"

estimation_files() {
  put .docs/sdd/estimation.md <<'EOF'
# Estimación — salas

Se estima en horas en el plan y se compara con el real en el walkthrough. El log lo genera `Build-EstimationLog.ps1`.
EOF
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}, "pricing": {"source": "fixture", "updated": "2026-09-25", "usdPerMillionTokens": {"claude-sonnet-5": {"input": 2, "cacheWrite5m": 2.5, "cacheWrite1h": 4, "cacheRead": 0.2, "output": 10}}}}
EOF
}

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  w2) opening_in_one; closing_state; estimation_files; commit "docs: estimación y precios del proyecto" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g status --short; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
case $SC in
  w2) ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012 (perfil delegate): las dos tasks están hechas y la revisión final de rama está limpia en \`$SPEC/review-final.md\`. El dev-lead validó: «he probado \`node bin/salas.js reservar Norte 1012\` y \`node bin/salas.js libres 1012\`, los dos dan el error de franja; funciona». Escribe \`walkthrough.md\` (pasos 1 y 2 del checklist) y para ahí: sin changelog, roadmap, commit, merge ni push. El dev-lead no está." ;;
esac

cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "Agent" "SendMessage" "ListAgents" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-45}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## status"; g status --short --branch --untracked-files=all
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
[ -f "$R/$SPEC/walkthrough.md" ] && sed -e "s#$(cygpath -m "$RUN")#<run>#g" "$R/$SPEC/walkthrough.md" > "$OUT/$LABEL.walkthrough.md"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$TEXTS" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
sed -i -E 's#([Uu]sers[/\\]+)[^/\\ "]+#\1<usuario>#g' "$OUT/$LABEL".*
echo "[$LABEL] listo"
