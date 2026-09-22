#!/usr/bin/env bash
# Sujeto headless de un turno sobre una copia fresca de un molde con una rama de feature lista para cerrar.
# Uso: subject.sh <molde> <rama> <kit> <etiqueta> <turno> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
MOLD="$1"; BRANCH="$2"; KIT="$3"; LABEL="$4"; TURN="$5"; OUT="$6"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
rm -rf "$RUN" "$RUNS/$LABEL-feature"; mkdir -p "$RUN" "$OUT"
cp -r "$BASE/$MOLD/." "$RUN/"
mv "$RUN/.f" "$RUNS/$LABEL-feature"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A
g commit -q -m "feat: base con cancelación de reservas"
g tag -a v0.3.0 -m "v0.3.0"
g checkout -q -b develop
g checkout -q -b "$BRANCH"
cp -r "$RUNS/$LABEL-feature/." "$RUN/"
g add -A
g commit -q -m "fix: libres valida la franja HH:MM-HH:MM"

cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" \
  --max-turns 60 \
  --output-format stream-json --verbose \
  "$TURN" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

mkdir -p "$OUT/$LABEL"
{
  echo "## git status"; g status --short
  echo "## git log"; g log --oneline --all --decorate
  echo "## diff del roadmap desde v0.3.0"; g diff v0.3.0 -- .docs/sdd/roadmap.md
  echo "## diff del roadmap sin commitear"; g diff -- .docs/sdd/roadmap.md
} > "$OUT/$LABEL.state.txt"
cp .docs/sdd/roadmap.md .docs/sdd/changelog.md "$OUT/$LABEL/"
find .docs/sdd/specs -newer "$RUNS/$LABEL-feature" -name '*.md' -exec cp {} "$OUT/$LABEL/" \;
python - "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.skills.txt" <<'PY'
import json,sys
for l in open(sys.argv[1],encoding='utf-8'):
    try: e=json.loads(l)
    except: continue
    if e.get('type')=='assistant':
        for c in e['message'].get('content',[]):
            if c.get('type')=='tool_use' and c['name']=='Skill': print('Skill', c['input'].get('skill'))
    if e.get('type')=='result': print('cost', e.get('total_cost_usd'), 'turns', e.get('num_turns'))
PY
echo "[$LABEL] listo"
