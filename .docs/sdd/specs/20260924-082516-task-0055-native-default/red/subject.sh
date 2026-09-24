#!/usr/bin/env bash
# Sujeto headless de la 0055 sobre el repo de juguete salas (molde de la 0044), apertura de la task 0012 commiteada.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   e1  paso 6 con un plan que despacha con sdd-kit:effort-medium y un kit sin agents/ (la sesión no tiene esos tipos)
#   g1  paso 5 en delegate, sin execution · g2 paso 5 en pair, sin execution
#   g3  paso 5 con execution fijado: sujeto 1 delegate + subagent, sujeto 2 pair + native
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

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  e1) g checkout -q -b feature/0012; spec_files; plan_files
      sed -i 's/^\*\*Modelo\*\*: Sonnet, effort medio$/**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`/' "$R/$SPEC/plan.md"
      commit "docs(0012): abrir la task 0012" ;;
  g1|g2|g3) g checkout -q -b feature/0012; spec_files
      profile=delegate; exec_key=""
      [ "$SC" = g2 ] && profile=pair
      [ "$LABEL" = g3-1 ] && exec_key=subagent
      [ "$LABEL" = g3-2 ] && { profile=pair; exec_key=native; }
      sed -i "s/\"profile\": \"delegate\"/\"profile\": \"$profile\"/" "$R/.docs/sdd/sdd-kit.json"
      [ -n "$exec_key" ] && sed -i "s/}\$/, \"execution\": \"$exec_key\"}/" "$R/.docs/sdd/sdd-kit.json"
      commit "docs(0012): spec aprobada de la task 0012" ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; grep -n Modelo "$R/$SPEC/plan.md"; ls "$KIT"; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
PLAN5="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada por el dev-lead en \`$SPEC/spec.md\`. Toca el paso 5: escribe el plan y sigue hasta justo antes de ejecutar la Task 1; para ahí, sin empezarla."
case $SC in
  g1|g2|g3) ASK="$PLAN5 El dev-lead leerá tu mensaje y, si le preguntas algo, contestará en el siguiente." ;;
  e1) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): la spec y el plan están aprobados y la apertura está commiteada en \`feature/0012\`. Estás en el paso 6: ejecuta la Task 1 y para en cuanto su implementador te devuelva el informe, sin revisarla ni seguir con la Task 2. El dev-lead no está." ;;
esac

cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "PowerShell" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-45}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## plan.md (Modelo y Ejecución)"; grep -n -A1 "Modelo\|Ejecución" "$R/$SPEC/plan.md"
  echo "## sdd-kit.json"; cat "$R/.docs/sdd/sdd-kit.json"
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md"
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
