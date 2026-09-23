#!/usr/bin/env bash
# RED de la 0039 antes de la spec: sujeto headless en el paso 6 de sdd-start-task, justo antes de despachar la Task 2.
# Reutiliza el molde salas de la 0044. Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   r1 cambio ajeno sin commitear en src/slots.js, fichero que modifica la Task 2
#   r2 develop avanzó con un commit de otra task que también toca src/slots.js
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLD="$(cd "$BASE/../../20260923-191212-task-0044-commit-per-milestone/green" && pwd)/mold.sh"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
PATCHDIR=.docs/sdd/specs/20260923-110000-patch-0013-cancelar-sin-hora
. "$MOLD"

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
opening_in_one; task1_in_three
case $SC in
  r1)
    printf '\n// Zona horaria: las franjas van en hora local de la oficina.\n' >> "$R/src/slots.js" ;;
  r2)
    g checkout -q develop
    cat >> "$R/src/slots.js" <<'EOF'

export function rooms() {
  return ['Norte', 'Sur'];
}
EOF
    commit "feat(0014): listar las salas" "Task 0014, fusionada desde su worktree."
    g checkout -q feature/0012 ;;
esac

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g status --short; exit 0; }
BEFORE=$(g rev-parse --short HEAD)
ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012, en el paso 6 con \`subagent-driven-development\`: la Task 1 está implementada y su re-revisión ha salido limpia (ledger en \`.superpowers/sdd/plan/progress.md\`, informe en \`.superpowers/sdd/plan/task-1-rereview.md\`). Haz todo lo que toque antes de despachar el implementador de la Task 2 y para ahí, sin despacharlo. El dev-lead no está."

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
  echo "## ficheros por commit desde el merge-base"; g log --reverse --format='--- %h %s' --name-only "$(g merge-base HEAD develop)"..HEAD
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## diff de src/slots.js en el working tree"; g diff -- src/slots.js
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
