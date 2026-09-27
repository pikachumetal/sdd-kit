#!/usr/bin/env bash
# Sujeto headless a dos turnos sobre una copia fresca de un molde.
# Uso: subject.sh <molde> <kit> <etiqueta> <turno1> <turno2> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLD="$1"; KIT="$2"; LABEL="$3"; TURN1="$4"; TURN2="$5"; OUT="$6"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
rm -rf "$RUN"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/$MOLD/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
if [ -f "$RUN/.develop-files" ]; then
  # Molde con código real: lo entregado vive en commits de develop y main lleva el tag de la release anterior.
  mapfile -t DEV_FILES < <(tr -d '\r' < "$RUN/.develop-files")
  rm "$RUN/.develop-files"
  mkdir -p "$RUNS/$LABEL-hold"
  for f in "${DEV_FILES[@]}"; do mkdir -p "$RUNS/$LABEL-hold/$(dirname "$f")"; mv "$RUN/$f" "$RUNS/$LABEL-hold/$f"; done
  g add -A
  g commit -q -m "feat: base con cancelación de reservas"
  g tag -a v0.3.0 -m "v0.3.0"
  g checkout -q -b develop
  cp -r "$RUNS/$LABEL-hold/." "$RUN/"
  g add src/app.js
  g commit -q -m "feat: reserva recurrente semanal y salas libres por franja"
  g add test
  g commit -q -m "fix: la cancelación respeta el día, con test de regresión"
else
  g add -A
  g commit -q -m "feat: base con cancelación de reservas"
  g tag -a v0.0.0-base -m base
  g checkout -q -b develop
  g commit -q --allow-empty -m "feat: reserva recurrente semanal y salas libres por franja"
  g commit -q --allow-empty -m "fix: la cancelación respeta el día"
fi

ask() {
  claude -p --model sonnet \
    --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --max-turns 60 \
    --output-format stream-json --verbose \
    "$@" < /dev/null
}

cd "$RUN"
ask "$TURN1" > "$RUNS/$LABEL-t1.jsonl" 2>"$RUNS/$LABEL-t1.err"
SESSION="$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL-t1.jsonl" | head -1 | cut -d'"' -f4)"
ask --resume "$SESSION" "$TURN2" > "$RUNS/$LABEL-t2.jsonl" 2>"$RUNS/$LABEL-t2.err"

{
  echo "## git status"; g status --short
  echo "## git log"; g log --oneline --all --decorate
  echo "## sdd-kit.json"; cat .docs/sdd/sdd-kit.json
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
cp .docs/sdd/roadmap.md .docs/sdd/changelog.md "$OUT/$LABEL/"
[ -d .docs/sdd/releases ] && cp -r .docs/sdd/releases "$OUT/$LABEL/"
[ -f package.json ] && cp package.json "$OUT/$LABEL/"
echo "[$LABEL] listo (sesión $SESSION)"
