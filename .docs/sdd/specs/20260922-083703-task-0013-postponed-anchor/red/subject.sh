#!/usr/bin/env bash
# Sujeto headless a uno o dos turnos sobre una copia fresca de un molde.
# Uso: subject.sh <kit> <molde> <etiqueta> <turno1> <turno2|""> <salida>
# Molde con .feature-files: esos ficheros van en un commit de feature/0009 sobre develop
# (FEATURE_BRANCH=develop: el commit va directo a develop, como una release lista para cerrar).
# START_BRANCH=<rama>: el run arranca en esa rama recién creada desde develop.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="$1"; MOLD="$2"; LABEL="$3"; TURN1="$4"; TURN2="$5"; OUT="$6"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
rm -rf "$RUN" "$RUNS/$LABEL-hold"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/$MOLD/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
if [ -f "$RUN/.feature-files" ]; then
  mapfile -t FEATURE_FILES < <(tr -d '\r' < "$RUN/.feature-files")
  rm "$RUN/.feature-files"
  mkdir -p "$RUNS/$LABEL-hold"
  for f in "${FEATURE_FILES[@]}"; do
    mkdir -p "$RUNS/$LABEL-hold/$(dirname "$f")"; mv "$RUN/$f" "$RUNS/$LABEL-hold/$f"
  done
  for f in "${FEATURE_FILES[@]}"; do
    [ -f "$BASE/mold/$f" ] && cp "$BASE/mold/$f" "$RUN/$f"
  done
  g add -A; g commit -q -m "feat: base de reservas de salas"
  g checkout -q -b develop
  [ "${FEATURE_BRANCH:-feature/0009}" != develop ] && g checkout -q -b "${FEATURE_BRANCH:-feature/0009}"
  cp -r "$RUNS/$LABEL-hold/." "$RUN/"
  g add -A; g commit -q -m "feat: validar el formato de la franja horaria"
else
  g add -A; g commit -q -m "feat: base de reservas de salas"
  g checkout -q -b develop
  [ -n "${START_BRANCH:-}" ] && g checkout -q -b "$START_BRANCH"
fi

ask() {
  claude -p --model sonnet \
    --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --disallowedTools "SendMessage" "ListAgents" \
    --max-turns "${MAX_TURNS:-60}" \
    --output-format stream-json --verbose \
    "$@" < /dev/null
}

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
cd "$RUN"
ask "$TURN1" > "$RUNS/$LABEL-t1.jsonl" 2>"$RUNS/$LABEL-t1.err"
SESSION="$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL-t1.jsonl" | head -1 | cut -d'"' -f4)"
TURNS="t1"
if [ -n "$TURN2" ]; then
  ask --resume "$SESSION" "$TURN2" > "$RUNS/$LABEL-t2.jsonl" 2>"$RUNS/$LABEL-t2.err"
  TURNS="t1 t2"
fi

{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --oneline --all --decorate
  echo "## diff contra la base del run"; g diff --stat "$(g rev-list --max-parents=0 HEAD)" 
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
cp -r .docs/sdd/. "$OUT/$LABEL/"
for t in $TURNS; do grep '"type":"result"' "$RUNS/$LABEL-$t.jsonl" > "$OUT/$LABEL/$t-result.json"; done
echo "[$LABEL] listo (sesión $SESSION)"
