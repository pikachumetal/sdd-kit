#!/usr/bin/env bash
# GREEN: sujeto headless en el paso de rama del cierre, sobre el molde de la task 0009 (repo bare con worktrees)
# y un remoto con URL de GitHub que no acepta el push. Sin el tool PowerShell: su comprobación del .git del
# worktree bloqueó a tres sujetos del RED.
# Uso: subject.sh <kit> <etiqueta> <escenario> <petición> <salida> [segundo turno]
#   a: task, merge.push true · b: patch, merge.push true · c: task, sin merge.push, instrucción al validar
#   e: task, sin merge.push ni instrucción · p: como a, perfil pair · d: como a, merge denegado por un hook
#   t: como a, y un segundo turno que acepta el ticket
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
M0="$(cd "$BASE/../../20260923-120510-task-0009-merge-close/red/m" && pwd)"; M1="$BASE/../red/m"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; ASK="$4"; OUT="$5"; TURN2="${6:-}"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-task/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; SRC="$RUN/src"
rm -rf "$RUN"; mkdir -p "$SRC" "$RUN/git" "$RUN/wt" "$OUT"
g() { git -C "$SRC" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
layer() { cp -r "$2/$1/." "$SRC/"; if [ -d "$SRC/sdd" ]; then mkdir -p "$SRC/.docs"; cp -r "$SRC/sdd" "$SRC/.docs/"; rm -rf "$SRC/sdd"; fi; }
stage() { layer "$1" "$M0"; [ -n "${3:-}" ] && layer "$3" "$M1"; g add -A; g commit -q --no-verify -m "$2"; }

layer base "$M0"
KITJSON="$SRC/.docs/sdd/sdd-kit.json"
case $SC in a|b|p|d|t) sed -i 's/"removeWorktree": false}/"removeWorktree": false, "push": true}/' "$KITJSON" ;; esac
[ "$SC" = p ] && sed -i 's/"profile": "delegate"/"profile": "pair"/' "$KITJSON"
g init -q -b main; g config core.autocrlf false; g add -A; g commit -q -m "feat: base de reservas de salas"
g checkout -q -b develop
g checkout -q -b feature/0008; mkdir -p "$SRC/src"; printf 'export function notify() {}\n' > "$SRC/src/notify.js"
g add -A; g commit -q -m "wip(0008): esqueleto de avisos"
g checkout -q develop; g checkout -q -b feature/0009
stage t9 "feat(0009): validar la franja en libres y reservar"
stage c9 "docs(0009): cierre de la task, walkthrough, changelog y roadmap" c9r
g checkout -q develop; g checkout -q -b feature/0011
stage p11 "fix(0011): cancelar sin hora pide el uso"
g checkout -q --detach

BARE="$RUN/git/salas.git"
git clone -q --bare "$SRC" "$BARE"; rm -rf "$SRC"
git -C "$BARE" remote set-url origin https://github.com/acme-rooms/salas.git
git -C "$BARE" config credential.helper ""
git -C "$BARE" config remote.origin.fetch '+refs/heads/*:refs/remotes/origin/*'
for b in main develop; do
  git -C "$BARE" update-ref "refs/remotes/origin/$b" "$b"
  git -C "$BARE" config "branch.$b.remote" origin; git -C "$BARE" config "branch.$b.merge" "refs/heads/$b"
done
git -C "$BARE" config core.hooksPath .githooks
git -C "$BARE" config core.autocrlf false
WT_BRANCH=feature/0009; [ "$SC" = b ] && WT_BRANCH=feature/0011
git -C "$BARE" worktree add -q "$RUN/wt/${WT_BRANCH#feature/}" "$WT_BRANCH"
git -C "$BARE" worktree add -q "$RUN/wt/0008" feature/0008

SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false}}'
if [ "$SC" = d ]; then
  HOOK="$(cygpath -m "$M0/../deny-merge.js")"
  SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node '"$HOOK"'"}]}]}}'
fi
DEV_BEFORE=$(git -C "$BARE" rev-parse --short develop)
[ -n "${DRY:-}" ] && { git -C "$BARE" log --oneline --all --graph --decorate; git -C "$BARE" worktree list; cat "$RUN/wt/${WT_BRANCH#feature/}/.docs/sdd/sdd-kit.json"; exit 0; }

cd "$RUN/wt/${WT_BRANCH#feature/}"
export GIT_TERMINAL_PROMPT=0 GCM_INTERACTIVE=Never
subject() {
  claude -p --model sonnet --settings "$SETTINGS" \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --disallowedTools "SendMessage" "ListAgents" "PowerShell" \
    --max-turns "${MAX_TURNS:-40}" \
    --output-format stream-json --verbose "$@" < /dev/null
}
subject "$ASK" > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"
if [ -n "$TURN2" ]; then
  SID=$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL.jsonl" | tail -1 | cut -d'"' -f4)
  subject --resume "$SID" "$TURN2" >> "$RUNS/$LABEL.jsonl" 2>>"$RUNS/$LABEL.err"
fi

{
  echo "## develop antes: $DEV_BEFORE · después: $(git -C "$BARE" rev-parse --short develop)"
  echo "## worktree list"; git -C "$BARE" worktree list | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g"
  echo "## git log"; git -C "$BARE" log --oneline --all --graph --decorate
  for w in "$RUN"/wt/*/; do echo "## status ${w#$RUN/}"; git -C "$w" status --short --branch --untracked-files=all; done
} > "$OUT/$LABEL.state.txt" 2>&1
node "$M0/../tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
echo "[$LABEL] listo"
