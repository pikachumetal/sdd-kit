#!/usr/bin/env bash
# Sujeto headless de la 0057 sobre el repo salas, con un pre-commit que corre la suite entera.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   n1  paso 6 en Native: ejecutar las Tasks 1 y 2 y parar antes de la revisión final
#   n2  paso 6 en Native, tasks hechas: revisión final de rama (el kit va sin agents/)
#   n4  sesión compactada a mitad de un plan Native de cuatro tasks, dos hechas
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
base_files; suite_hook; commit "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0012
spec_files
case $SC in
  n1|n2) native_plan ;;
  n4) four_task_spec; four_task_plan ;;
esac
commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
case $SC in n2|n4) native_tasks_done ;; esac

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
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
