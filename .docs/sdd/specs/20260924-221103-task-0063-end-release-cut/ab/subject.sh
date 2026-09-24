#!/usr/bin/env bash
# Sujeto headless del A/B de la 0063: monta el molde del escenario, aplica su overlay y lanza uno o dos turnos.
# Uso: subject.sh <kit> <etiqueta> <escenario a1|a2|a3|a4> <salida>
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(cd "$BASE/../.." && pwd)"
M0004="$SPECS/20260921-074701-task-0004-release-without-client/red"
M0008="$SPECS/20260921-162234-task-0008-control-profiles"
TOOLS="$SPECS/20260923-120510-task-0009-merge-close/red/tools.mjs"
TEXTS="$SPECS/20260923-214917-task-0053-fewer-stops/red/texts.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-end-release/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; HOLD="$RUNS/$LABEL-hold"
rm -rf "$RUN" "$HOLD"; mkdir -p "$RUN" "$OUT"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
ABSENT="El dev-lead no está."
CLOSE="Vamos a publicar a producción lo que tenemos. Cierra la release."
TURN2=""
case $SC in
  a1) MOLD="$M0004/m5"; TURN1="$CLOSE"; TURN2="Sí, v0.4.0. Adelante." ;;
  a2) MOLD="$M0004/m2"; TURN1="$CLOSE $ABSENT" ;;
  a3) MOLD="$M0008/green/m-rel"; TURN1="Cierra la release."; TURN2="Sí, v0.4.0. Validé el smoke: probé la franja de \`libres\` de la 0009." ;;
  a4) MOLD="$M0004/m2"; TURN1="Ayer hicimos la demo con el cliente; la transcripción está en \`.docs/sdd/releases/demo-2026-09-24.md\`. Cierra la release. $ABSENT" ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac

hold() { mapfile -t FILES < <(tr -d '\r' < "$RUN/$1"); rm "$RUN/$1"; for f in "${FILES[@]}"; do mkdir -p "$HOLD/$(dirname "$f")"; mv "$RUN/$f" "$HOLD/$f"; done; }
cp -r "$MOLD/." "$RUN/"
[ -d "$BASE/overlay/$SC" ] && cp -r "$BASE/overlay/$SC/." "$RUN/"
g init -q -b main
if [ -f "$RUN/.develop-files" ]; then
  hold .develop-files
  g add -A; g commit -q -m "feat: base con cancelación de reservas"; g tag -a v0.3.0 -m "v0.3.0"
  g checkout -q -b develop; cp -r "$HOLD/." "$RUN/"
  g add src/app.js; g commit -q -m "feat: reserva recurrente semanal y salas libres por franja"
  g add -A; g commit -q -m "fix: la cancelación respeta el día, con test de regresión"
elif [ -f "$RUN/.feature-files" ]; then
  hold .feature-files
  for f in "${FILES[@]}"; do [ -f "$M0008/red/mold/$f" ] && cp "$M0008/red/mold/$f" "$RUN/$f"; done
  g add -A; g commit -q -m "feat: base de reservas de salas"
  g checkout -q -b develop; cp -r "$HOLD/." "$RUN/"
  g add -A; g commit -q -m "feat: validar el formato de la franja horaria"
else
  g add -A; g commit -q -m "feat: base con cancelación de reservas"; g tag -a v0.0.0-base -m base
  g checkout -q -b develop
  g commit -q --allow-empty -m "feat: reserva recurrente semanal y salas libres por franja"
  g commit -q --allow-empty -m "fix: la cancelación respeta el día"
fi
BEFORE=$(g rev-parse HEAD)
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; ls -a "$RUN/.docs/sdd"; exit 0; }

ask() {
  claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" --permission-mode acceptEdits \
    --allowedTools "Bash(*)" --disallowedTools "SendMessage" "ListAgents" "PowerShell" "AskUserQuestion" \
    --max-turns 60 --output-format stream-json --verbose "$@" < /dev/null
}
hide() { sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g"; }
cd "$RUN"
ask "$TURN1" > "$RUNS/$LABEL-t1.jsonl" 2>"$RUNS/$LABEL-t1.err"
node "$TOOLS" "$RUNS/$LABEL-t1.jsonl" "$RUN" > "$OUT/$LABEL-t1.tools.txt"
node "$TEXTS" "$RUNS/$LABEL-t1.jsonl" | hide > "$OUT/$LABEL-t1.texts.txt"
if [ -n "$TURN2" ]; then
  SESSION="$(grep -o '"session_id":"[^"]*"' "$RUNS/$LABEL-t1.jsonl" | head -1 | cut -d'"' -f4)"
  ask --resume "$SESSION" "$TURN2" > "$RUNS/$LABEL-t2.jsonl" 2>"$RUNS/$LABEL-t2.err"
  node "$TOOLS" "$RUNS/$LABEL-t2.jsonl" "$RUN" > "$OUT/$LABEL-t2.tools.txt"
  node "$TEXTS" "$RUNS/$LABEL-t2.jsonl" | hide > "$OUT/$LABEL-t2.texts.txt"
fi
{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --graph --format='%h%d %s' --all
  echo "## tags"; g for-each-ref refs/tags --format='%(refname:short) %(objecttype) -> %(*objectname:short)'
  echo "## sdd-kit.json"; cat .docs/sdd/sdd-kit.json
} 2>&1 | hide > "$OUT/$LABEL.state.txt"
F="$OUT/$LABEL"; mkdir -p "$F"
g checkout -q develop 2>/dev/null
cp .docs/sdd/roadmap.md .docs/sdd/changelog.md "$F/"
[ -d .docs/sdd/releases ] && cp -r .docs/sdd/releases "$F/"
g diff --name-only "$BEFORE" develop -- '*walkthrough.md' 2>/dev/null | while read -r w; do cp "$w" "$F/walkthrough-$(basename "$(dirname "$w")" | cut -d- -f3-4).md"; done
echo "[$LABEL] listo"
