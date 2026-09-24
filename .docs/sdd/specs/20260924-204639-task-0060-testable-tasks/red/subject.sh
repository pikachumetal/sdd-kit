#!/usr/bin/env bash
# Sujeto headless de la 0060 sobre el repo de juguete salas, en el estado de cada escenario.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1 plan de una feature con datos, lógica y CLI (tasks verticales) · p2 spec de una regla de negocio (datos en los escenarios y reglas completas)
#   p3 plan de una feature web por capas (BD, API, frontend)
#   v7 validación del paso 7 (guion) · v6 parada de pair tras la task 1 (guion) · c6 control: delegate tras la task 1 no para
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
TEXTS="$(cd "$BASE/../../20260923-214917-task-0053-fewer-stops/red" && pwd)/texts.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/SKILL.md" ] && [ -f "$KIT/skills/sdd-templates/templates/spec-template.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
SPEC14=.docs/sdd/specs/20260924-090000-task-0014-persistir
SPEC16=.docs/sdd/specs/20260924-093000-task-0016-favoritas
. "$BASE/mold.sh"

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  p1) booking_base; g checkout -q -b feature/0014; spec14_files ;;
  p2) booking_base; g checkout -q -b feature/0015 ;;
  p3) layered_base; g checkout -q -b feature/0016; spec16_files ;;
  v7) opening_in_one; closing_state ;;
  v6|c6)
    g checkout -q -b feature/0012; spec_files; plan_files
    [ "$SC" = v6 ] && sed -i 's/^mode: full$/mode: full\nprofile: pair/' "$R/$SPEC/spec.md"
    commit "docs(0012): abrir la task 0012"; task1_done ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g status --short; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
ABSENT="El dev-lead no está."
WATCH="El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes."
REPLY="Haz lo que toque y para donde el paso diga: el dev-lead leerá tu mensaje y contestará en el siguiente."
case $SC in
  p1) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0014: la spec está aprobada por el dev-lead en \`$SPEC14/spec.md\` (perfil delegate). Toca el paso 5: escribe el plan y sigue hasta justo antes de despachar el implementador de la Task 1; para ahí, sin despacharlo. $WATCH" ;;
  p3) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0016: la spec está aprobada por el dev-lead en \`$SPEC16/spec.md\` (perfil delegate). Toca el paso 5: escribe el plan y sigue hasta justo antes de despachar el implementador de la Task 1; para ahí, sin despacharlo. $WATCH" ;;
  p2) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0015 de la rama. A tu primera pregunta el dev-lead ya respondió «task full, delegate, adelante con la spec, sin review de spec». Toma tú las decisiones de diseño que haga falta y lístalas. Escribe la spec y para en el gate de aprobación. $ABSENT" ;;
  v7) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): las dos tasks están hechas y la revisión final de rama, limpia, está en \`$SPEC/review-final.md\`. Estás en el paso 7. $REPLY" ;;
  v6) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil pair): la Task 1 está hecha, su revisión quedó limpia y su commit está en la rama, con \`tasks.md\` al día. Estás en el paso 6. $REPLY" ;;
  c6) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): la Task 1 está hecha, su revisión quedó limpia y su commit está en la rama, con \`tasks.md\` al día. Estás en el paso 6. Sigue hasta justo antes de despachar el implementador de la Task 2; para ahí, sin despacharlo. $WATCH" ;;
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
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## status"; g status --short --branch --untracked-files=all
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
{ g diff --name-only "$BEFORE"; g ls-files --others --exclude-standard; } | sort -u | grep '^\.docs/sdd/specs/.*\.md$' | while read -r f; do
  [ -f "$R/$f" ] && { echo "## $f"; cat "$R/$f"; echo; }
done > "$OUT/$LABEL.files.md"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$TEXTS" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
