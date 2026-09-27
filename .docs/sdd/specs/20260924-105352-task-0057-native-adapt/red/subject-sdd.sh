#!/usr/bin/env bash
# Sujeto headless de la 0057 para los huecos de commit-milestones.md en un plan SDD, con un pre-commit que corre la suite.
# Uso: subject-sdd.sh <kit> <etiqueta> <escenario> <salida>
#   s1  revisión de la Task 1 limpia, con un solo commit del implementador y el cuerpo sin tildes: cerrar su hito
#   s2  apertura en dos commits sin juntar y los RED de las dos tasks en el mismo fichero: preparar el despacho de la Task 1
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
sdd_plan() {
  plan_files
  sed -i 's/^## Restricciones globales$/**Ejecución**: subagent, porque se quiere revisión por task\n\n## Restricciones globales/' "$R/$SPEC/plan.md"
  sed -i 's/^\*\*Modelo\*\*: Sonnet, effort medio$/**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`/' "$R/$SPEC/plan.md"
}
case $SC in
  s1) spec_files; sdd_plan; commit "docs(0012): abrir la task 0012" "Spec aprobada, plan y registro de tasks de la validación de la franja."
      b1=$(g rev-parse --short HEAD)
      task1_red; task1_code
      commit "feat(0012): validar el formato de la franja al reservar" "Anade la validacion del formato HH-HH en reserve y el test de la task 1. La franja mal formada lanza el mensaje de la spec."
      put .superpowers/sdd/plan/progress.md <<EOF
# SDD ledger — plan: $SPEC/plan.md

Task 1: BASE $b1
Task 1: implementer DONE (commit $(g rev-parse --short HEAD))
Task 1: review clean (spec ✅, calidad ✅; sin hallazgos)
EOF
      ;;
  s2) spec_files; commit "docs(0012): spec de la task 0012" "Spec aprobada de la validación de la franja."
      sdd_plan
      sed -i 's#`tests/slot-format.test.js`#`tests/franja.test.js`#; s#`tests/free-format.test.js`#`tests/franja.test.js`#; s#node --test tests/slot-format.test.js#node --test tests/franja.test.js#; s#node --test tests/free-format.test.js#node --test tests/franja.test.js#' "$R/$SPEC/plan.md"
      g add -A; g commit -q --no-verify -m "docs(0012): plan y registro de tasks" -m "Plan de dos tasks con los tests RED en el mismo fichero." ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; grep -n "Ejecución\|Modelo\|Tests RED\|Verificación" "$R/$SPEC/plan.md"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
OPEN="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate) en \`feature/0012\`: la spec y el plan están aprobados y el plan dice \`Ejecución: subagent\`."
case $SC in
  s1) ASK="$OPEN Estás en el paso 6: el implementador de la Task 1 entregó y su revisión quedó limpia (ledger en \`.superpowers/sdd/plan/progress.md\`). Cierra el hito de la Task 1 como pide el kit y para justo antes de despachar la Task 2, sin despacharla. El dev-lead no está." ;;
  s2) ASK="$OPEN Empieza el paso 6: prepara el despacho de la Task 1 como pide el kit y para justo antes de lanzar su implementador, sin lanzarlo. El dev-lead no está." ;;
esac

cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "Agent" "SendMessage" "ListAgents" "PowerShell" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-45}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## git log"; g log --graph --format='%h %s%n%w(0,4,4)%b' --all
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## tests en disco"; for f in "$R"/tests/*.js; do echo "### $(basename "$f")"; grep -n "^test(" "$f"; done
  echo "## ledger"; cat "$R/.superpowers/sdd/plan/progress.md" 2>/dev/null
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md"
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
