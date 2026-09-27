#!/usr/bin/env bash
# Sujeto headless a un turno sobre una copia fresca de un molde.
# Uso: subject.sh <molde> <etiqueta> <petición> <salida>
# E1 (m-fix): base en main/develop, commit de spec+plan+RED (m-fix.f1) y de la Task 1 (m-fix.f2) en feature/0009,
#             y el workspace de superpowers (m-fix.ws) sin versionar. Sujeto con el kit (KIT_DIR) y despacho.
# E3 (m-lite, GREEN): molde m-fix con la spec lite y los RED (OVERLAY_DIR/m-lite.f1) en feature/0009, sin plan.
# E4 (m-plan, GREEN): ídem con solo la spec full aprobada (OVERLAY_DIR/m-plan.f1), para escribir el plan.
# E2 (m-impl): base en main/develop, commit del RED del hilo (m-impl.f1) en feature/0012. Sujeto sin kit ni despacho.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
OVERLAYS="${OVERLAY_DIR:-$BASE}"
MOLD="$1"; LABEL="$2"; ASK="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
RUN="$RUNS/$LABEL"
rm -rf "$RUN"; mkdir -p "$RUN" "$OUT"
BASEMOLD="$MOLD"; [ "$MOLD" = m-lite ] || [ "$MOLD" = m-plan ] && BASEMOLD=m-fix
cp -r "$BASE/$BASEMOLD/." "$RUN/"
g() { git -C "$RUN" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
g init -q -b main
g add -A; g commit -q -m "feat: base de reservas de salas"
g checkout -q -b develop
if [ "$MOLD" = m-fix ]; then
  g checkout -q -b feature/0009
  cp -r "$BASE/m-fix.f1/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): spec, plan y tests RED de la task 0009"
  cp -r "$BASE/m-fix.f2/." "$RUN/"; g add -A; g commit -q -m "feat: validar la franja en libres"
  cp -r "$BASE/m-fix.ws/." "$RUN/"
  TOOLS=(--plugin-dir "${KIT_DIR:?define KIT_DIR}" --add-dir "$KIT_DIR" --allowedTools "Bash(*)" "Agent")
elif [ "$MOLD" = m-lite ] || [ "$MOLD" = m-plan ]; then
  g checkout -q -b feature/0009
  cp -r "$OVERLAYS/$MOLD.f1/." "$RUN/"; g add -A; g commit -q -m "docs(sdd): spec de la task 0009"
  TOOLS=(--plugin-dir "${KIT_DIR:?define KIT_DIR}" --add-dir "$KIT_DIR" --allowedTools "Bash(*)" "Agent")
else
  g checkout -q -b feature/0012
  cp -r "$BASE/m-impl.f1/." "$RUN/"; g add -A; g commit -q -m "test: RED de parseSlot (task 0012, Task 3)"
  TOOLS=(--allowedTools "Bash(*)" --disallowedTools "Agent")
fi
[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
cd "$RUN"
claude -p --model sonnet \
  --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  "${TOOLS[@]}" --disallowedTools "SendMessage" "ListAgents" \
  --permission-mode acceptEdits --max-turns "${MAX_TURNS:-80}" \
  --output-format stream-json --verbose \
  "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"
{
  echo "## git status"; g status --short --untracked-files=all
  echo "## git log"; g log --oneline --all --decorate
  echo "## diff contra la rama base"; g diff --stat develop
} > "$OUT/$LABEL.state.txt"
mkdir -p "$OUT/$LABEL"
g diff develop > "$OUT/$LABEL/branch.diff"
[ -d .superpowers ] && cp -r .superpowers "$OUT/$LABEL/"
[ -f .checkrc.json ] && cp .checkrc.json "$OUT/$LABEL/"
grep '"type":"result"' "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL/result.json"
echo "[$LABEL] listo"
