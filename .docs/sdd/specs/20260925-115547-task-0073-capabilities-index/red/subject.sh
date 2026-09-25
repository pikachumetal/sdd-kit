#!/usr/bin/env bash
# Sujeto headless sobre el repo de juguete salas, con 9 capacidades.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   s  arrancar la task 0021 (invitados, 1 h seguida) hasta la spec
#   r  meter en el roadmap un cambio de regla del cliente (no presentarse se cobra), con la 0021 en marcha
#   q  consulta: ¿dónde tocaría para que los invitados reserven los sábados?
#   m  actualizar al kit: la migración a v2.0.0 escribe el propósito (molde 1.2.0 con párrafo y procedencia)
#   PURPOSE=1: las capacidades llevan «## Propósito» (el formato del GREEN)
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
MOLD="$(dirname "$BASE")/red"
TOOLS="$SPECS/20260923-120510-task-0009-merge-close/red/tools.mjs"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$MOLD/mold.sh"

g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
case $SC in
  s) roadmap_start
     commit "feat: base de reservas de salas"
     g checkout -q -b develop
     ASK="Invoca la skill sdd-kit:sdd-start-task y arranca la task 0021 de la fila del roadmap. Soy el dev-lead y me ausento: modo full, perfil delegate, apruebo la spec por delegación, nos vemos en la validación. No me hagas preguntas: decide tú y apúntalo en la spec. Escribe y commitea la spec y para antes del plan." ;;
  r) roadmap_running
     commit "feat: base de reservas de salas"
     g checkout -q -b develop
     g checkout -q -b feature/0021
     put .docs/sdd/specs/20260925-090000-task-0021-guest-hour/spec.md <<'EOF'
# Spec — Los invitados reservan como máximo 1 h seguida

Borrador en curso.
EOF
     commit "docs(0021): apertura de la task 0021"
     g checkout -q develop
     ASK="Invoca la skill sdd-kit:sdd-roadmap. Notas de la reunión de hoy con el cliente: a partir de enero, una reserva a la que nadie se presenta se cobra al departamento al 50 % de su tarifa. Apúntalo en el roadmap, no lo arranques. No me hagas preguntas: decide tú, commitea y para." ;;
  q) roadmap_start
     commit "feat: base de reservas de salas"
     g checkout -q -b develop
     ASK="Invoca la skill sdd-kit:sdd-consult. ¿Dónde tocaría para que los invitados puedan reservar también los sábados? Solo la respuesta: no cambies ningún fichero." ;;
  m) roadmap_start
     legacy_capabilities
     commit "feat: base de reservas de salas"
     g checkout -q -b develop
     ASK="Invoca la skill sdd-kit:sdd-init-brownfield: actualízame al kit instalado. Me ausento: no me hagas preguntas, aplica lo que haga falta, commitea y dame el informe al final." ;;
  *) echo "escenario desconocido: $SC" >&2; exit 1 ;;
esac

BEFORE=$(g rev-parse --short HEAD)
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
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## ficheros tocados tras la base (commits y árbol)"; g diff --name-only "$BEFORE"
  echo "## capabilities/ al final"; ls "$R/.docs/sdd/capabilities/"
  echo "## diff de capabilities/ frente a la base"; g diff "$BEFORE" -- .docs/sdd/capabilities/
  echo "## diff de roadmap.md frente a la base"; g diff "$BEFORE" -- .docs/sdd/roadmap.md
  for f in "$R"/.docs/sdd/specs/*/*.md; do [ -f "$f" ] && { echo "## $(basename "$(dirname "$f")")/$(basename "$f")"; cat "$f"; }; done
} 2>&1 | sed -e "s#$(cygpath -m "$RUN")#<run>#g" | node "$TOOLS" --clean "$RUN" > "$OUT/$LABEL.state.txt"
node "$TOOLS" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" | node "$TOOLS" --clean "$RUN" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
