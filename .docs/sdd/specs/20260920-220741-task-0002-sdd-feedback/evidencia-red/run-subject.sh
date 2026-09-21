#!/usr/bin/env bash
# Lanza un sujeto headless sobre una copia fresca de un molde de fixture.
# Uso: run-subject.sh <molde> <kit> <etiqueta> <max-turns> <peticion> [rama]
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLDE="$1"; KIT="$2"; LABEL="$3"; TURNS="$4"; PETICION="$5"; BRANCH="${6:-feature/0007}"
RUN="$BASE/runs/$LABEL"
rm -rf "$RUN"
mkdir -p "$RUN"
cp -r "$BASE/$MOLDE/." "$RUN/"
git -C "$RUN" init -q
git -C "$RUN" add -A
git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture commit -q -m "base"
git -C "$RUN" checkout -q -b "$BRANCH" 2>/dev/null || true
cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$BASE/$KIT" --add-dir "$BASE/$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --max-turns "$TURNS" \
  --output-format stream-json --verbose \
  "$PETICION" < /dev/null > "$BASE/runs/$LABEL.jsonl" 2>"$BASE/runs/$LABEL.err"
echo "[$LABEL] exit=$? files:"
ls -R "$RUN" | head -40
