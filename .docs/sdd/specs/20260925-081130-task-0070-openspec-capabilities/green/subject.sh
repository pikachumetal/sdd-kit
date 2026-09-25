#!/usr/bin/env bash
# Sujeto headless del GREEN sobre el repo de juguete salas, ya migrado al kit 2.0.0 (capacidades sin historial).
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   c   arrancar la task 0021 (cancelar una reserva) hasta la spec
#   m   cerrar la task 0020, cuyo MODIFIED se escribió antes de que el patch 0014 fusionara en el mismo requisito
#   p1  cerrar el patch 0014, cuyo fix cambia lo que lista `libres`
#   p2  cerrar el patch 0013, cuyo fix devuelve `reservar` a lo que la capacidad ya decía
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
MOLD="$(dirname "$BASE")/red"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-templates/scripts/Test-Capabilities.ps1" ] || { echo "sin kit de la rama en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$MOLD/mold.sh"
. "$MOLD/mold-0070.sh"

without_history() {
  local f="$R/.docs/sdd/capabilities/bookings.md"
  sed -i '/^## Historial/,$d' "$f"
  sed -i -e :a -e '/^\n*$/{$d;N;ba' -e '}' "$f"
}

block_in_spec() {
  local f="$R/.docs/sdd/specs/20260925-070000-task-0020-libres-orden/spec.md"
  sed -i 's/^# Spec — libres en orden alfabético$/&\n\n## Capacidades\n\n- Modificadas: `bookings` — cambia «Consultar salas libres»/' "$f"
}

template_block_in_patch() {
  local f
  f=$(ls "$R"/.docs/sdd/specs/*patch-*/patch.md)
  sed -i 's/^## 1\. Síntoma$/## Capacidades\n\n- Modificadas: `<nombre>` — <qué requisito cambia>\n\n&/' "$f"
}

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
without_history
commit "feat: base de reservas de salas"
case $SC in
  c) task_cancel_start; ARTIFACT="task-0021-*"
     ASK="Invoca la skill sdd-kit:sdd-start-task y arranca la task 0021 de la fila del roadmap. Soy el dev-lead y me ausento: task en modo lite, perfil delegate, apruebo la spec por delegación, nos vemos en la validación. No me hagas preguntas: decide tú y apúntalo en la spec. Escribe y commitea la spec y para antes de implementar." ;;
  m) NO_BEFORE=1 task_sorted_behind_patch; ARTIFACT="task-0020-*"
     g checkout -q develop; without_history; commit "chore(sdd): capacidades sin historial"
     g checkout -q feature/0020; g merge -q develop -m "merge: develop en feature/0020"
     block_in_spec; commit "docs(0020): bloque Capacidades en la spec"
     ASK="Invoca la skill sdd-kit:sdd-end-task y cierra la task 0020. Ya integré develop en la rama y \`node --test\` pasa. Validada por el dev-lead: «he probado \`salas libres 10-12\` y las salas salen en orden alfabético; funciona». Tiempo real: 0,6 h. Si tienes una pregunta, escríbela en tu último mensaje y para." ;;
  p1|p2) g checkout -q -b develop
     if [ "$SC" = p1 ]; then SECTION6=1 patch_maintenance; ID=0014; else SECTION6=1 patch_limit; ID=0013; fi; ARTIFACT="patch-$ID-*"
     template_block_in_patch; commit "docs($ID): patch.md calcado de la plantilla"
     ASK="Invoca la skill sdd-kit:sdd-end-patch y cierra el patch $ID: el fix y su patch.md están commiteados en feature/$ID y \`node --test\` pasa. Si tienes una pregunta, escríbela en tu último mensaje y para." ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac

BEFORE=$(g rev-parse --short HEAD)
[ "${DRY:-0}" = 1 ] && { g log --oneline --all | head -12; g status --short; exit 0; }
cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "PowerShell(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-60}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## git log"; g log --format='%h %s' --all
  echo "## ficheros tocados tras la base (commits y árbol)"; g diff --name-only "$BEFORE"
  echo "## diff de capabilities/ frente a la base"; g diff "$BEFORE" -- .docs/sdd/capabilities/
  echo "## validador sobre el estado final"
  pwsh -NoProfile -File "$KIT/skills/sdd-templates/scripts/Test-Capabilities.ps1" -Path "$R/.docs/sdd" -Artifact "$(ls "$R"/.docs/sdd/specs/*-$ARTIFACT/*.md | head -1)" 2>&1 || true
  for f in "$R"/.docs/sdd/specs/*/*.md; do echo "## $(basename "$(dirname "$f")")/$(basename "$f")"; cat "$f"; done
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
