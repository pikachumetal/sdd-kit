#!/usr/bin/env bash
# Sujeto headless a un turno, situado en el paso de merge del cierre, sobre un repo bare con worktrees.
# Uso: subject.sh <kit> <etiqueta> <escenario> <petición> <salida>
#   escenario: r1 (task, develop fuera de todo worktree) · r2 (patch) · r3 (r1 + merge denegado)
#              r4 (develop sacada con cambios sin commitear) · r5 (develop avanzó con la 0008 y está sacada)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; LABEL="$2"; SC="$3"; ASK="$4"; OUT="$5"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"; M="$BASE/m"; SRC="$RUN/src"
rm -rf "$RUN"; mkdir -p "$SRC" "$RUN/git" "$RUN/wt" "$OUT"
g() { git -C "$SRC" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
layer() { cp -r "$M/$1/." "$SRC/"; if [ -d "$SRC/sdd" ]; then mkdir -p "$SRC/.docs"; cp -r "$SRC/sdd" "$SRC/.docs/"; rm -rf "$SRC/sdd"; fi; }
stage() { layer "$1"; g add -A; g commit -q --no-verify -m "$2"; }

layer base; g init -q -b main; g config core.autocrlf false; g add -A; g commit -q -m "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0008; mkdir -p "$SRC/src"; printf 'export function notify() {}\n' > "$SRC/src/notify.js"
g add -A; g commit -q -m "wip(0008): esqueleto de avisos"
g checkout -q develop; g checkout -q -b feature/0009
stage t9 "feat(0009): validar la franja en libres y reservar"
stage c9 "docs(0009): cierre de la task, walkthrough, changelog y roadmap"
g checkout -q develop; g checkout -q -b feature/0011
stage p11 "fix(0011): cancelar sin hora pide el uso"
g checkout -q develop
if [ "$SC" = r5 ]; then
  g checkout -q feature/0008; stage d8 "docs(0008): cierre de la task de avisos"
  g checkout -q develop; g merge -q --no-ff --no-verify -m "merge: task 0008, avisos por correo" feature/0008
fi
g checkout -q --detach

BARE="$RUN/git/salas.git"
git clone -q --bare "$SRC" "$BARE"; rm -rf "$SRC"
git -C "$BARE" config core.hooksPath .githooks
git -C "$BARE" config core.autocrlf false
WT_BRANCH=feature/0009; [ "$SC" = r2 ] && WT_BRANCH=feature/0011
git -C "$BARE" worktree add -q "$RUN/wt/${WT_BRANCH#feature/}" "$WT_BRANCH"
git -C "$BARE" worktree add -q "$RUN/wt/0008" feature/0008
case $SC in
  r4) git -C "$BARE" worktree add -q "$RUN/wt/dev" develop
      sed -i 's/^const bookings = .*/const bookings = [{ room: "Norte", day: "lun", slot: "10:00-12:00" }, { room: "Sur", day: "mar", slot: "09:00-10:00" }];/' "$RUN/wt/dev/src/app.js" ;;
  r5) git -C "$BARE" worktree add -q "$RUN/wt/dev" develop ;;
esac

SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false}}'
if [ "$SC" = r3 ]; then
  HOOK="$(cygpath -m "$BASE/deny-merge.js")"
  SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node '"$HOOK"'"}]}]}}'
fi
DEV_BEFORE=$(git -C "$BARE" rev-parse --short develop)
[ -n "${DRY:-}" ] && { git -C "$BARE" log --oneline --all --graph --decorate; git -C "$BARE" worktree list; exit 0; }

cd "$RUN/wt/${WT_BRANCH#feature/}"
claude -p --model sonnet \
  --settings "$SETTINGS" \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" \
  --max-turns "${MAX_TURNS:-40}" \
  --output-format stream-json --verbose \
  "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## develop antes: $DEV_BEFORE · después: $(git -C "$BARE" rev-parse --short develop)"
  echo "## worktree list"; git -C "$BARE" worktree list | sed "s#$RUN#<run>#g"
  echo "## git log"; git -C "$BARE" log --oneline --all --graph --decorate
  for w in "$RUN"/wt/*/; do echo "## status ${w#$RUN/}"; git -C "$w" status --short --branch; done
} > "$OUT/$LABEL.state.txt" 2>&1
node "$BASE/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
