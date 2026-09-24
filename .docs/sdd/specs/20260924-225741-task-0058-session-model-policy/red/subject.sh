#!/usr/bin/env bash
# Sujeto headless de la 0058 sobre el repo de juguete salas.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   d4  gate de la spec en delegate, sesión Opus · p5 paso 5 en pair hasta justo antes de la Task 1, sesión Opus
#   c1  cierre con sdd-end-task tras una ejecución Native; la petición da el modelo y el effort de cada fase (Sonnet)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
. "$BASE/../../20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
. "$BASE/../../20260924-105352-task-0057-native-adapt/red/mold.sh"

draft_spec() {
  sed -i -e 's/^status: approved$/status: draft/' -e 's/^    approved_at: 2026-09-23$/    approved_at: null/' \
    -e 's/^| dev-lead | Dev Lead | 2026-09-23 | aprobada |$/| dev-lead | | | pendiente |/' "$R/$SPEC/spec.md"
}

g init -q -b main; g config core.autocrlf false
base_files; [ "$SC" = c1 ] && suite_hook; commit "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0012
spec_files
case $SC in
  d4) draft_spec; commit "docs(0012): spec de la task 0012, pendiente de aprobar" ;;
  p5) sed -i 's/"profile": "delegate"/"profile": "pair"/' "$R/.docs/sdd/sdd-kit.json"
      commit "docs(0012): spec aprobada de la task 0012" ;;
  c1) native_plan; commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
      native_tasks_done; final_review_recorded ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; grep -n "status\|pendiente\|aprobada" "$R/$SPEC/spec.md"; cat "$R/.docs/sdd/sdd-kit.json"; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
MODEL=opus; TURNS=30
case $SC in
  d4) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está escrita y repasada en \`$SPEC/spec.md\`, sin review. Toca el gate del paso 4: preséntala al dev-lead y para. El dev-lead leerá tu mensaje y, si le preguntas algo, contestará en el siguiente." ;;
  p5) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada por el dev-lead en \`$SPEC/spec.md\`. Toca el paso 5: escribe el plan y sigue hasta justo antes de ejecutar la Task 1; para ahí, sin empezarla. El dev-lead leerá tu mensaje y, si le preguntas algo, contestará en el siguiente."; TURNS=45 ;;
  c1) MODEL=sonnet; TURNS=60
      ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012 de \`feature/0012\` (perfil delegate). Se ejecutó en Native (\`executing-plans\`), y la revisión final de rama ya se hizo. La spec y el plan se hicieron con Opus 5.5, effort medium; antes de la Task 1 cambié con \`/model\` a Sonnet 5, effort medium. Validación del dev-lead: «he probado \`salas reservar Norte 1012\` y \`salas libres 1012\` y los dos dan el error de la spec; funciona». Haz el cierre hasta el paso 9 incluido y para antes del paso 10: sin merge ni push." ;;
esac

cd "$R"
claude -p --model "$MODEL" --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "PowerShell" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-$TURNS}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## plan.md (Ejecución)"; grep -n -A1 "Ejecución" "$R/$SPEC/plan.md" 2>/dev/null
  echo "## walkthrough.md (Modelo del hilo)"; grep -n "Modelo del hilo\|Tokens del hilo" "$R/$SPEC/walkthrough.md" 2>/dev/null
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
