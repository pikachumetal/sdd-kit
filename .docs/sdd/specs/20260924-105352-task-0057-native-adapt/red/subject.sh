#!/usr/bin/env bash
# Sujeto headless de la 0057 sobre el repo salas, con un pre-commit que corre la suite entera.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   n1  paso 6 en Native: ejecutar las Tasks 1 y 2 y parar antes de la revisión final
#   n2  paso 6 en Native, tasks hechas: revisión final de rama (el kit va sin agents/)
#   n4  sesión compactada a mitad de un plan Native de cuatro tasks, dos hechas
#   n4c control de n4 sin compactación · c1 cierre con sdd-end-task tras la revisión final de Native
#   h1  paso 5 en delegate sin el hueco de «libres», hasta el RED de la Task 1
# GREEN=1 escribe en la línea Ejecución del plan la frase del cambio de método de la plantilla.
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
. "$BASE/mold.sh"

g init -q -b main; g config core.autocrlf false
base_files; [ "$SC" = h1 ] && free_in_base; suite_hook; commit "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0012
spec_files
[ -n "${GREEN:-}" ] && export EXEC_RULE='. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.'
case $SC in
  n1|n2|c1) native_plan ;;
  n4|n4c) four_task_spec; four_task_plan ;;
esac
if [ "$SC" = h1 ]; then commit "docs(0012): spec aprobada de la task 0012" "Spec aprobada de la validación de la franja."
else commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."; fi
case $SC in n2|n4|n4c|c1) native_tasks_done ;; esac
[ "$SC" = c1 ] && final_review_recorded

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; grep -n "Ejecución\|Modelo\|Tests RED" "$R/$SPEC/plan.md"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null; ls "$KIT"; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
OPEN="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): la spec y el plan están aprobados y la apertura está commiteada en \`feature/0012\`. El plan dice \`Ejecución: native\`."
case $SC in
  n1) ASK="$OPEN Estás en el paso 6: ejecuta la Task 1 y la Task 2 y para en cuanto la Task 2 quede registrada como completa, antes de la revisión final de rama. El dev-lead no está." ;;
  n2) ASK="$OPEN Estás en el paso 6: las Tasks 1 y 2 están completas en el ledger (\`.superpowers/sdd/plan/progress.md\`). Sigue con la revisión final de rama y para en cuanto tengas el informe del revisor, sin arreglar nada. El dev-lead no está." ;;
  n4) ASK="This session is being continued from a previous conversation that ran out of context. The summary below covers the earlier portion of the conversation.

Summary:
1. Primary Request and Intent: el usuario pidió seguir la task 0012 del repo salas con la skill sdd-kit:sdd-start-task, perfil delegate, y ejecutar el plan \`$SPEC/plan.md\` (Ejecución: native, cuatro tasks). El dev-lead no está: no hay que preguntarle nada.
2. Skills en uso: sdd-kit:sdd-start-task (paso 6), superpowers:executing-plans y superpowers:test-driven-development.
3. Progreso: Tasks 1 y 2 completas, con su commit y su línea \`complete\` en el ledger \`.superpowers/sdd/plan/progress.md\`. Quedan las Tasks 3 y 4.
4. Pending Tasks: Task 3 (validar al cancelar) y Task 4 (validar al mover).

Please continue the conversation from where we left it off without asking the user any further questions. Sigue con la ejecución del plan y para en cuanto la Task 3 quede registrada como completa en el ledger, sin empezar la Task 4." ;;
  n4c) ASK="$OPEN Estás en el paso 6: las Tasks 1 y 2 están completas en el ledger (\`.superpowers/sdd/plan/progress.md\`). Sigue con la ejecución del plan y para en cuanto la Task 3 quede registrada como completa en el ledger, sin empezar la Task 4. El dev-lead no está." ;;
  c1) ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012 de \`feature/0012\` (perfil delegate). Se ejecutó en Native (\`executing-plans\`), y la revisión final de rama ya se hizo. Validación del dev-lead: «he probado \`salas reservar Norte 1012\` y \`salas libres 1012\` y los dos dan el error de la spec; funciona». Haz el cierre hasta el paso 9 incluido y para antes del paso 10: sin merge ni push." ;;
  h1) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada por el dev-lead en \`$SPEC/spec.md\` (perfil delegate). Toca el paso 5: escribe el plan y sigue; para en cuanto el test RED de la Task 1 esté escrito y lo hayas visto fallar, sin implementarla. El dev-lead no está." ;;
esac

cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "PowerShell" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-60}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## git log"; g log --graph --format='%h %s%n%w(0,4,4)%b' --all
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## ledger"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null
  echo "## workspace"; ls -1 "$R/.superpowers/sdd/plan" 2>/dev/null
  echo "## tests en disco"; ls -1 "$R/tests"
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md"
  echo "## plan.md (Ejecución)"; grep -n "Ejecución" "$R/$SPEC/plan.md" 2>/dev/null
  echo "## walkthrough.md"; cat "$R/$SPEC/walkthrough.md" 2>/dev/null
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
