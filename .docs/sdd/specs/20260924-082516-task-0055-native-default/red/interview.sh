#!/usr/bin/env bash
# GREEN de la 0055: la pregunta del método de ejecución en la entrevista, a un turno.
# Uso: interview.sh <kit> <etiqueta> <escenario> <salida>
#   ig: init greenfield con la pregunta 20 (frenos) ya respondida · ib: init brownfield con la 4 (frenos) ya respondida
#   im: migración a v1.2.0 de un proyecto al que solo le falta `execution`
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-init-greenfield/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; P="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$P" "$OUT"
g() { git -C "$P" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }

existing_project() {
  mkdir -p "$P/.docs/sdd" "$P/.claude" "$P/src"
  printf '# Constitution — salas\n\n## Convenciones\n\n- Ramas: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.\n' > "$P/.docs/sdd/constitution.md"
  printf '# Misión — salas\n\nCLI para reservar salas de la oficina.\n' > "$P/.docs/sdd/mission.md"
  printf '# Roadmap — salas\n\n## Próximo\n\n| # | Ítem | Estado |\n| --- | --- | --- |\n| 1 | Reservas semanales | ⏳ |\n' > "$P/.docs/sdd/roadmap.md"
  printf '# Tech stack — salas\n\nNode 20, sin dependencias; `node --test`.\n' > "$P/.docs/sdd/tech-stack.md"
  printf '{\n  "autoMemoryEnabled": false\n}\n' > "$P/.claude/settings.json"
  printf 'node_modules/\n.playwright-mcp/\n.superpowers/\n' > "$P/.gitignore"
  printf 'console.log("salas");\n' > "$P/src/app.js"
}

case $SC in
  ig) ASK="Invoca la skill sdd-kit:sdd-init-greenfield y sigue: la entrevista va por la pregunta 20 y lo anterior ya está respondido. Proyecto: una CLI en Node 20 para reservar salas de la oficina, sin dependencias. Gestor de tickets (13): no. Ids (14): sequence. Ramas (15): git-flow. Worktrees (16): sí. Entorno (17): no. Perfil (18): delegate. Merge y push (19): sí y sí. Frenos (20): el dev-lead acaba de responder «sí, los de por defecto». Haz la siguiente pregunta de la entrevista y espera su respuesta." ;;
  ib) printf '{\n  "name": "salas",\n  "type": "module"\n}\n' > "$P/package.json"; printf 'console.log("salas");\n' > "$P/app.js"
      g init -q -b main; g add -A; g commit -q -m "feat: base de reservas de salas"; g checkout -q -b develop
      ASK="Invoca la skill sdd-kit:sdd-init-brownfield y sigue: la entrevista va por la pregunta 4 y lo anterior ya está respondido. Ids (1): sequence. Perfil (2): delegate. Merge y push (3): sí y sí, a develop. Frenos (4): el dev-lead acaba de responder «sí, los de por defecto». Haz la siguiente pregunta de la entrevista y espera su respuesta." ;;
  im) existing_project
      printf '{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-10", "ids": {"mode": "sequence"}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": true}}\n' > "$P/.docs/sdd/sdd-kit.json"
      g init -q -b main; g add -A; g commit -q -m "feat: base de reservas de salas"; g checkout -q -b develop
      ASK="Invoca la skill sdd-kit:sdd-init-brownfield: actualízame al kit. El dev-lead leerá tu mensaje y contestará en el siguiente." ;;
esac
[ -n "${DRY:-}" ] && { echo "$ASK"; ls -a "$P"; exit 0; }

cd "$P"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "SendMessage" "ListAgents" "PowerShell" "Agent" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-30}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{ echo "## ficheros"; (cd "$P" && find . -path ./.git -prune -o -type f -print | sort); echo "## sdd-kit.json"; cat "$P/.docs/sdd/sdd-kit.json" 2>/dev/null; } > "$OUT/$LABEL.state.txt"
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$BASE/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
