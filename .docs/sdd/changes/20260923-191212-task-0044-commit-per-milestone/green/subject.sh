#!/usr/bin/env bash
# GREEN de la 0044: sujeto headless sobre un repo de juguete (salas) con la rama en el estado de cada escenario.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   g1 apertura en 3 commits · g2 task 1 en 3 commits con revisión limpia · g3 cierre con fix de revisión final
#   g4 patch con el fix en 2 commits · g5 como g2 con un merge de develop dentro del rango de la task
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/references/commit-milestones.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
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
  g1) opening_in_three ;;
  g2) opening_in_one; task1_in_three ;;
  g3) opening_in_one; closing_state ;;
  g5) opening_in_one; task1_with_merge ;;
  g4) patch_in_two ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g status --short; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
case $SC in
  g1) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012: la spec está aprobada por el dev-lead y el plan escrito (perfil delegate, sin gate del plan) en \`$SPEC/\`. Estás al principio del paso 6: haz todo lo que toque justo antes de despachar el implementador de la Task 1 y para ahí, sin despacharlo. El dev-lead no está." ;;
  g2|g5) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012, en el paso 6 con \`subagent-driven-development\`: la Task 1 está implementada y su re-revisión ha salido limpia (ledger en \`.superpowers/sdd/plan/progress.md\`, informe en \`.superpowers/sdd/plan/task-1-rereview.md\`). Haz todo lo que toque antes de despachar el implementador de la Task 2 y para ahí, sin despacharlo. El dev-lead no está." ;;
  g3) ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0012: las dos tasks están hechas y la revisión final de rama limpia tras su fix. El dev-lead la ha validado: «he probado \`salas reservar Norte 10-12\` y \`salas reservar Norte 1012\` y el segundo da el error bueno». No hay \`environments.md\`. Haz el cierre hasta justo antes del merge del paso 10 y para ahí, sin fusionar. El dev-lead no está." ;;
  g4) ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0013 (\`cancelar\` sin hora): el fix está implementado y verificado en \`feature/0013\` y \`patch.md\` está en \`$PATCHDIR/\`. Haz el cierre hasta justo antes del merge del paso 6 y para ahí, sin fusionar. El dev-lead no está." ;;
esac

cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "Agent" "SendMessage" "ListAgents" "PowerShell" \
  --max-turns "${MAX_TURNS:-45}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## commits desde el merge-base con develop: $(g rev-list --count "$(g merge-base HEAD develop)"..HEAD)"
  echo "## ficheros por commit desde el merge-base"; g log --reverse --format='--- %h %s' --name-only "$(g merge-base HEAD develop)"..HEAD
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## reflog"; g reflog -12 --format='%h %gs'
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
for f in "$SPEC/tasks.md" "$PATCHDIR/patch.md"; do [ -f "$R/$f" ] && { echo "## $f"; cat "$R/$f"; } >> "$OUT/$LABEL.state.txt"; done
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
