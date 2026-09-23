#!/usr/bin/env bash
# GREEN: pregunta del push en la entrevista, a un turno.
# Uso: interview.sh <kit> <etiqueta> <escenario> <salida>
#   i: init greenfield en la pregunta 19 con git-flow · i2: igual con otra convención de ramas
#   m: migración a v1.2.0 de un proyecto con el bloque merge completo y sin push
set -u
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-init-greenfield/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; P="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$P" "$OUT"
g() { git -C "$P" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }

BRANCHES='`main` estable, `develop` de integración y `feature/<id>` desde `develop` (git-flow)'
[ "$SC" = i2 ] && BRANCHES='`main` estable, `next` de integración y `feature/<id>` desde `next`; nada de `develop`'
ASK="Invoca la skill sdd-kit:sdd-init-greenfield y sigue: la entrevista va por la pregunta 19 y lo anterior ya está respondido. Proyecto: una CLI en Node 20 para reservar salas de la oficina, sin dependencias. Gestor de tickets (13): no. Ids (14): sequence. Ramas (15): $BRANCHES. Worktrees (16): sí. Entorno (17): no. Perfil (18): delegate. En la 19, el dev-lead ya respondió «sí» a la política de merge (pregunta 2 del bloque). Haz la siguiente pregunta de la entrevista y espera su respuesta."

if [ "$SC" = m ]; then
  mkdir -p "$P/.docs/sdd" "$P/.claude" "$P/src"
  printf '{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-10", "ids": {"mode": "sequence"}, "control": {"profile": "delegate", "maxParallelAgents": 3, "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}}\n' > "$P/.docs/sdd/sdd-kit.json"
  printf '# Constitution — salas\n\n## Convenciones\n\n- Ramas: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop`.\n' > "$P/.docs/sdd/constitution.md"
  printf '# Misión — salas\n\nCLI para reservar salas de la oficina.\n' > "$P/.docs/sdd/mission.md"
  printf '# Roadmap — salas\n\n## Próximo\n\n| # | Ítem | Estado |\n| --- | --- | --- |\n| 1 | Reservas semanales | ⏳ |\n' > "$P/.docs/sdd/roadmap.md"
  printf '# Tech stack — salas\n\nNode 20, sin dependencias; `node --test`.\n' > "$P/.docs/sdd/tech-stack.md"
  printf '{\n  "autoMemoryEnabled": false\n}\n' > "$P/.claude/settings.json"
  printf 'node_modules/\n.playwright-mcp/\n.superpowers/\n' > "$P/.gitignore"
  printf 'console.log("salas");\n' > "$P/src/app.js"
  g init -q -b main; g add -A; g commit -q -m "feat: base de reservas de salas"; g checkout -q -b develop
  git -C "$P" remote add origin https://github.com/acme-rooms/salas.git
  ASK="Invoca la skill sdd-kit:sdd-init-brownfield: actualízame al kit."
fi
[ -n "${DRY:-}" ] && { echo "$ASK"; ls -a "$P"; exit 0; }

cd "$P"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "SendMessage" "ListAgents" "PowerShell" "Agent" \
  --max-turns "${MAX_TURNS:-30}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{ echo "## ficheros"; (cd "$P" && find . -path ./.git -prune -o -type f -print | sort); echo "## sdd-kit.json"; cat "$P/.docs/sdd/sdd-kit.json" 2>/dev/null; } > "$OUT/$LABEL.state.txt"
node "$(cd "$(dirname "$0")" && pwd)/../../20260923-120510-task-0009-merge-close/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
