#!/usr/bin/env bash
# Sujeto headless a un turno, en el paso de merge del cierre, con un remoto que avanzó y el push confirmado.
# Uso: subject.sh <kit> <etiqueta> <escenario> <petición> <salida>
#   escenario: r1 (task, develop fuera de todo worktree, origin/develop desfasado)
#              d1 (r1 con el merge denegado por un hook)
# El molde es el de la task 0009 (m/ de su RED): no se duplica.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; ASK="$4"; OUT="$5"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"; M="$BASE/../../20260923-120510-task-0009-merge-close/red/m"; SRC="$RUN/src"
rm -rf "$RUN"; mkdir -p "$SRC" "$RUN/git" "$RUN/wt" "$OUT"
g() { git -C "$SRC" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
layer() { cp -r "$M/$1/." "$SRC/"; if [ -d "$SRC/sdd" ]; then mkdir -p "$SRC/.docs"; cp -r "$SRC/sdd" "$SRC/.docs/"; rm -rf "$SRC/sdd"; fi; }
stage() { layer "$1"; g add -A; g commit -q --no-verify -m "$2"; }

layer base; g init -q -b main; g config core.autocrlf false; g add -A; g commit -q -m "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0009
stage t9 "feat(0009): validar la franja en libres y reservar"
stage c9 "docs(0009): cierre de la task, walkthrough, changelog y roadmap"
g checkout -q --detach

# El remoto del equipo y el clon bare de la máquina, con un worktree por rama en wt/.
REMOTE="$RUN/git/origin.git"; BARE="$RUN/git/salas.git"
git clone -q --bare "$SRC" "$REMOTE"; rm -rf "$SRC"
git clone -q --bare "$REMOTE" "$BARE"
git -C "$BARE" config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
git -C "$BARE" fetch -q origin
git -C "$BARE" config core.hooksPath .githooks
git -C "$BARE" config core.autocrlf false
git -C "$BARE" worktree add -q "$RUN/wt/0009" feature/0009

# Otra sesión cerró la 0010 y la publicó en origin después de abrir la 0009; este clon no ha hecho fetch.
OTHER="$RUN/other"
git clone -q -b develop "$REMOTE" "$OTHER"
mkdir -p "$OTHER/docs"; printf '# Nota de la task 0010\n' > "$OTHER/docs/nota-0010.md"
git -C "$OTHER" add -A
git -C "$OTHER" -c user.email=otra@example.com -c user.name=Otra commit -q --no-verify -m "merge: task 0010, nota de uso"
git -C "$OTHER" push -q origin develop; rm -rf "$OTHER"

SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false}}'
if [ "$SC" = d1 ]; then
  HOOK="$(cygpath -m "$BASE/deny-merge.js")"
  SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node '"$HOOK"'"}]}]}}'
fi
DEV_BEFORE=$(git -C "$BARE" rev-parse --short develop)
REMOTE_BEFORE=$(git -C "$REMOTE" rev-parse --short develop)
[ -n "${DRY:-}" ] && { git -C "$BARE" log --oneline --all --graph --decorate; git -C "$REMOTE" log --oneline develop; git -C "$BARE" worktree list; exit 0; }

cd "$RUN/wt/0009"
claude -p --model sonnet \
  --settings "$SETTINGS" \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "PowerShell(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" \
  --max-turns "${MAX_TURNS:-40}" \
  --output-format stream-json --verbose \
  "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

LOCAL_AFTER=$(git -C "$BARE" rev-parse --short develop)
REMOTE_AFTER=$(git -C "$REMOTE" rev-parse --short develop)
{
  echo "## develop local antes: $DEV_BEFORE · después: $LOCAL_AFTER"
  echo "## develop remoto antes: $REMOTE_BEFORE · después: $REMOTE_AFTER"
  echo "## local == remoto: $([ "$LOCAL_AFTER" = "$REMOTE_AFTER" ] && echo sí || echo no)"
  echo "## la 0010 del remoto está en develop local: $(git -C "$BARE" merge-base --is-ancestor "$REMOTE_BEFORE" develop && echo sí || echo no)"
  echo "## la 0009 está en develop remoto: $(git -C "$REMOTE" merge-base --is-ancestor feature/0009 develop 2>/dev/null && echo sí || echo no)"
  echo "## worktree list"; git -C "$BARE" worktree list | sed "s#$RUN#<run>#g"
  echo "## git log (local)"; git -C "$BARE" log --oneline --all --graph --decorate
  echo "## git log (remoto)"; git -C "$REMOTE" log --oneline --graph develop
  for w in "$RUN"/wt/*/; do echo "## status ${w#$RUN/}"; git -C "$w" status --short --branch; done
} > "$OUT/$LABEL.state.txt" 2>&1
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
