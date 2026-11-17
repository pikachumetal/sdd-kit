#!/usr/bin/env bash
# RED/GREEN del patch: sujeto headless en el paso 6 de sdd-start-task, justo antes de despachar la Task 2,
# que modifica src/slots.js y .docs/sdd/roadmap.md. Reutiliza el molde salas de la 0044 y el lanzador de la 0039.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   s1 develop avanzó con el cierre del patch 0013: otra fila del roadmap y el changelog (hoy para; no debe)
#   s2 control: el mismo cierre toca además src/slots.js (debe seguir parando)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="${SPECS_DIR:?define SPECS_DIR (.docs/sdd/specs del kit)}"
MOLD="$SPECS/20260923-191212-task-0044-commit-per-milestone/green/mold.sh"
TOOLS="$SPECS/20260923-120510-task-0009-merge-close/red/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
SPEC=.docs/sdd/specs/20260923-100000-task-0012-franja
. "$MOLD"

# La Task 2 del plan declara sus ficheros, y uno es el roadmap (añade una fila de deuda).
eval "mold_$(declare -f plan_files)"
plan_files() {
  mold_plan_files
  sed -i 's#^- \[ \] \*\*Step 1: Implementación\*\* — `free(slot)`#**Modificar**: `src/slots.js` (`free` valida la franja) · `.docs/sdd/roadmap.md` (fila de deuda: `free` sin sala devuelve todas)\n\n&#' "$R/$SPEC/plan.md"
}

g init -q -b main; g config core.autocrlf false
base_files; commit "feat: base de reservas de salas"
g checkout -q -b develop
opening_in_one; task1_in_three
g checkout -q develop
sed -i 's#^| 0013 | .*#| 0013 | ✅ [patch](specs/20260923-110000-patch-0013-cancelar-sin-hora/patch.md) — `cancelar` sin hora pide el uso | dev-lead | `src/slots.js` | patch |#' "$R/.docs/sdd/roadmap.md"
printf '\n### Fixed\n\n- `cancelar` sin hora pide el uso en vez de fallar (patch 0013).\n' >> "$R/.docs/sdd/changelog.md"
if [ "$SC" = s2 ]; then
  cat >> "$R/src/slots.js" <<'EOF'

export function cancel(room, slot) {
  if (!slot) throw new Error('Uso: salas cancelar <sala> <HH-HH>');
  return { room, slot, cancelled: true };
}
EOF
fi
commit "fix(0013): cancelar sin hora pide el uso" "Patch 0013, fusionado desde su worktree."
g checkout -q feature/0012

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; g diff --name-only "$(g merge-base HEAD develop)" develop; sed -n '/### Task 2/,$p' "$R/$SPEC/plan.md"; exit 0; }
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
  echo "## status"; g status --short --branch --untracked-files=all
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
