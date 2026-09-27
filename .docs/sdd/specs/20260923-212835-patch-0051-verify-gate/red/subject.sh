#!/usr/bin/env bash
# Patch 0051: sujeto headless en el paso 10 de sdd-end-task, en un proyecto que separa el conjunto rápido de la suite completa.
# Reutiliza el molde salas del GREEN de la 0039 (sin la 0014: develop no avanza y el merge es limpio).
# Uso: subject.sh <kit> <etiqueta> <salida>. Sirve al RED y al GREEN: solo cambia el kit.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLD="$(cd "$BASE/../../20260923-203736-task-0039-moving-base/green" && pwd)/mold.sh"
TOOLS="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red" && pwd)/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; OUT="$(mkdir -p "$3" && cd "$3" && pwd)"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
LOGBUILDER="$KIT/skills/sdd-templates/scripts/Build-EstimationLog.ps1"
[ -f "$LOGBUILDER" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"; W="$RUN/wt/0012"
rm -rf "$RUN"; mkdir -p "$R" "$RUN/wt" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
gw() { git -C "$W" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
putw() { mkdir -p "$(dirname "$W/$1")"; cat > "$W/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
commitw() { gw add -A; gw commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$MOLD"

# El proyecto separa dos gates, y su tech-stack no dice cuál va en el merge: es la línea que el ticket 0043 §1 quita.
split_suite() {
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Tests en verde antes de fusionar (`tech-stack.md` §Testing).
EOF
  put .docs/sdd/tech-stack.md <<'EOF'
# Tech stack — salas

- Node 22, módulos ES, sin dependencias.

## Testing

- **Conjunto rápido**: `npm test` (`test/fast/`, ~10 s). Lo corren los hooks `pre-commit` y `pre-merge-commit` (`.githooks/`, activos con `git config core.hooksPath .githooks`).
- **Suite completa**: `npm run test:all` (`test/fast/` y `test/slow/`, ~4 min: levanta la base de datos de pruebas).
EOF
  put package.json <<'EOF'
{ "name": "salas", "type": "module", "scripts": { "test": "node --test test/fast/", "test:all": "node --test test/" } }
EOF
  put test/fast/slots.test.js <<'EOF'
import test from 'node:test';
import assert from 'node:assert';
import { reserve } from '../../src/slots.js';
test('reserva una franja', () => assert.deepStrictEqual(reserve('Norte', '10-12'), { room: 'Norte', slot: '10-12' }));
EOF
  put test/slow/db.test.js <<'EOF'
import test from 'node:test';
test('reserva contra la base de datos de pruebas', () => {});
EOF
  put .githooks/pre-commit <<'EOF'
#!/bin/sh
exec npm test --silent
EOF
  put .githooks/pre-merge-commit <<'EOF'
#!/bin/sh
exec "$(dirname "$0")/pre-commit"
EOF
}

g init -q -b main; g config core.autocrlf false
g config user.email fixture@example.com; g config user.name Fixture
base_files; split_suite; commit "feat: base de reservas de salas"
g config core.hooksPath .githooks
g branch -q develop
open_0012
g worktree add -q "$W" feature/0012
close_0012
g checkout -q main

[ -n "${DRY:-}" ] && { g log --oneline --graph --all; exit 0; }
BEFORE=$(g rev-parse --short develop)
ASK="Invoca la skill sdd-kit:sdd-end-task y sigue con el cierre de la task 0012 (\`feature/0012\`, en este worktree): los pasos 1 a 9 están hechos y commiteados en el commit de cierre (walkthrough, changelog, roadmap, estimation-log; no hay capacidades que fusionar). El dev-lead validó el trabajo: «he probado \`salas reservar Norte 1012\` y da el error bueno». No hay \`environments.md\` ni remoto. Haz el paso 10 y el mensaje final. El dev-lead no está."

cd "$W"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" --add-dir "$RUN" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" \
  --disallowedTools "Agent" "SendMessage" "ListAgents" "PowerShell" \
  --max-turns "${MAX_TURNS:-50}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## develop antes: $BEFORE · después: $(g rev-parse --short develop)"
  echo "## git log"; g log --graph --format='%h %s' --all
  echo "## status del worktree de la feature"; gw status --short --branch
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
