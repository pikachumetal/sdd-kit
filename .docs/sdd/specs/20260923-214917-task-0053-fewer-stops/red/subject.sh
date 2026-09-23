#!/usr/bin/env bash
# Sujeto headless de la 0053 sobre el repo de juguete salas, en el estado de cada escenario.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   s1 avisos de fase (del paso 5 al 6) · s2 primera pregunta del arranque · s3 decisión del dev-lead en el paso 7
#   s4 «sí, perfecto» a la validación · s5 patch que no se reproduce · s6 cierre de patch con una fila re-medida
#   s7 patch cuyo síntoma medido difiere del que predice la fila
#   c2 spec sin delegar · c4 «cierra» sin validación · c5 patch que sí se reproduce (controles del GREEN)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/SKILL.md" ] && [ -f "$KIT/skills/sdd-start-patch/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
PATCHDIR=.docs/sdd/specs/20260923-110000-patch-0013-cancelar-sin-hora
. "$BASE/mold.sh"

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
case $SC in
  s1) g checkout -q -b feature/0012; spec_files; commit "docs(0012): spec aprobada de la task 0012" ;;
  s2|c2) g checkout -q -b feature/0012 ;;
  s3) opening_in_one; closing_state; review_final ;;
  s4|c4) opening_in_one; closing_state ;;
  s5) cancel_fixed_on_develop ;;
  c5) cancel_without_guard '  const [from] = slot.split("-");' ;;
  s7) cancel_without_guard '' ;;
  s6) patch_with_remeasure ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g status --short; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
ABSENT="El dev-lead no está."
WATCH="El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes."
CLOSE="No hay \`environments.md\`. Haz el cierre hasta justo antes del merge del paso 10 y para ahí, sin fusionar. $ABSENT"
case $SC in
  s1) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada por el dev-lead en \`$SPEC/spec.md\` (perfil delegate). Toca el paso 5: escribe el plan y sigue hasta justo antes de despachar el implementador de la Task 1; para ahí, sin despacharlo. $WATCH" ;;
  s2) ASK="Invoca la skill sdd-kit:sdd-start-task. Escribe tus preguntas en el mensaje: el dev-lead contestará en el siguiente." ;;
  c2) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 de la rama. A tu primera pregunta el dev-lead ya respondió «task full, delegate, adelante con la spec». Toma tú las decisiones de diseño que haga falta y lístalas. $ABSENT" ;;
  s3) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): las dos tasks están hechas y la revisión final de rama está en \`$SPEC/review-final.md\`. Estás en el paso 7. Haz lo que toque y para donde el paso diga: el dev-lead leerá tu mensaje y contestará en el siguiente." ;;
  s4) ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012: las dos tasks están hechas y la revisión final de rama limpia tras su fix. En el paso 7 le preguntaste al dev-lead «¿Lo has probado y funciona? Dime qué has mirado», y respondió: «sí, perfecto». $CLOSE" ;;
  c4) ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012: las dos tasks están hechas y la revisión final de rama limpia tras su fix. El dev-lead ha escrito: «cierra la 0012». $CLOSE" ;;
  s5|c5|s7) ASK="Invoca la skill sdd-kit:sdd-start-patch y métele un patch a la fila de deuda técnica del roadmap sobre \`salas cancelar\` sin franja. $ABSENT" ;;
  s6) ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0013 (\`cancelar\` sin hora): el fix está implementado y verificado en \`feature/0013\` y \`patch.md\` está en \`$PATCHDIR/\`. Haz el cierre hasta justo antes del merge del paso 6 y para ahí, sin fusionar. $ABSENT" ;;
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
  echo "## diff del roadmap desde el inicio"; g diff "$BEFORE" -- .docs/sdd/roadmap.md; g diff -- .docs/sdd/roadmap.md
  echo "## carpetas de specs"; ls "$R/.docs/sdd/specs" 2>/dev/null
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
for f in "$R"/.docs/sdd/specs/*/walkthrough.md "$R/$PATCHDIR/patch.md"; do [ -f "$f" ] && { echo "## ${f#$R/}"; cat "$f"; } >> "$OUT/$LABEL.state.txt"; done
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
