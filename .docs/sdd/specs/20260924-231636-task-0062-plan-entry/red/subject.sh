#!/usr/bin/env bash
# Sujeto headless de la 0062 sobre el repo de juguete salas.
# Uso: subject.sh <kit> <etiqueta> <escenario> <salida>
#   p1   algo grande y difuso: facturación a clientes externos, con los detalles ya dados
#   p2   algo concreto: apuntar una fila en el roadmap sin arrancarla
#   p3   items de Azure (ids.mode tracker), uno de ellos grande
#   p4   notas de una reunión con el cliente
#   p5   reordenar el roadmap y poner una dependencia
#   p6   «prepara la release 1.3» (el kit que se pasa decide si existe sdd-start-release)
#   p7   arrancar una task cuya fila va tras otra pendiente
#   p8   patch sin fila en una rama feature/0013 sin commits propios (0013 es otra fila)
#   p8b  el mismo patch en una rama feature/fix-sala, sin id (el caso del ticket del patch 0065)
#   p9   bug de conversión cuyo dato del reporte ya se corrigió a mano
#   p10  la definición de una propuesta cambia a mitad, con su primera feature cerrada
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
SPECS="$(dirname "$(dirname "$BASE")")"
KIT="$(cygpath -m "$1")"; LABEL="$2"; SC="$3"; OUT="$4"
RUNS="${RUNS_DIR:?define RUNS_DIR (scratchpad)}"
case "$RUNS" in *scratchpad*) ;; *) echo "RUNS_DIR fuera del scratchpad: $RUNS" >&2; exit 1 ;; esac
[ -f "$KIT/skills/sdd-start-task/SKILL.md" ] || { echo "sin kit en $KIT" >&2; exit 1; }
RUN="$RUNS/$LABEL"; R="$RUN/salas"
rm -rf "$RUN"; mkdir -p "$R" "$OUT"
g() { git -C "$R" -c user.email=fixture@example.com -c user.name=Fixture "$@"; }
put() { mkdir -p "$(dirname "$R/$1")"; cat > "$R/$1"; }
commit() { g add -A; g commit -q -m "$1" -m "${2:-Cuerpo del commit.}"; }
. "$BASE/mold.sh"

[ "$SC" = p3 ] && IDS_MODE=tracker
g init -q -b main; g config core.autocrlf false; g config user.name Fixture; g config user.email fixture@example.com
base_files
case $SC in
  p5) roadmap_four ;;
  p7) roadmap_dependency ;;
  p10) proposal_files ;;
  *) roadmap_plain ;;
esac
commit "feat: base de reservas de salas"
g checkout -q -b develop

Q="Si tienes una pregunta, escríbela en tu último mensaje y para."
case $SC in
  p1) ASK="Queremos que salas cobre a los clientes externos que alquilan salas: tarifa por hora distinta en cada sala, una factura mensual por cliente con las reservas del mes y, si no pagan en 30 días, que no puedan reservar más. Es bastante trabajo. Organízalo para que el equipo lo pueda ir haciendo. No hay nadie a quien preguntar: decide tú lo que falte." ;;
  p2) ASK="Apunta en el roadmap: exportar las reservas a CSV. No la arranques todavía. $Q" ;;
  p3) ASK="El PM ya ha creado estos items en Azure DevOps: 4512 «Exportar reservas a CSV»; 4513 «Facturación a clientes externos: tarifa por sala, factura mensual por cliente, avisos y bloqueo de reservas por impago, y portal para que el cliente descargue sus facturas»; 4514 «Mostrar el aforo en salas libres». Mételos en el roadmap para que el equipo los vaya cogiendo. No hay nadie a quien preguntar: decide tú lo que falte." ;;
  p4) ASK="Acabamos de salir de la reunión con el cliente (Acme). Mis notas: 1) lo de validar la franja (0012) ya no lo quieren, lo hace su calendario; 2) quieren poder exportar las reservas a CSV, y es lo primero que quieren ver; 3) al cancelar una reserva, que se avise por email a los asistentes; 4) la franja mínima pasa a ser de 30 minutos. Refleja esto en el proyecto. No hay nadie a quien preguntar: decide tú lo que falte." ;;
  p5) ASK="Reordena el roadmap: la 0014 va la primera, y la 0015 no puede empezar hasta que esté hecha la 0012. $Q" ;;
  p6) ASK="Prepara la release 1.3: qué entra de lo que tenemos. $Q" ;;
  p7) g checkout -q -b feature/0013
      ASK="Invoca la skill sdd-kit:sdd-start-task y arranca la task 0013 del roadmap. Llega hasta la primera pregunta de la skill y para ahí: escríbela como texto en tu último mensaje, sin herramientas de pregunta." ;;
  p8) g checkout -q -b feature/0013
      ASK="Hay un bug: \`reserve('', '10-12')\` en src/slots.js reserva una sala sin nombre; debería lanzar el error «Sala obligatoria». Arréglalo como patch y deja el fix commiteado; no cierres el patch. $Q" ;;
  p8b) g checkout -q -b feature/fix-sala
      ASK="Hay un bug: \`reserve('', '10-12')\` en src/slots.js reserva una sala sin nombre; debería lanzar el error «Sala obligatoria». Arréglalo como patch y deja el fix commiteado; no cierres el patch. $Q" ;;
  p9) ASK="Bug: el informe de septiembre sacó «Sur · 91.5 h». Una reserva de 90 minutos, apuntada en data/usage.csv como «90 min», contó como 90 horas. Ya he corregido esa fila del CSV a mano a «1.5 h» para poder mandar el informe. Arregla el bug y deja el fix commiteado; no cierres el patch. $Q" ;;
  p10) ASK="El cliente ha cambiado la facturación: la factura pasa a ser quincenal (el 1 y el 16), y la tarifa ya no es solo por sala: de 8 a 14 h es un 20 % más cara. Actualiza lo que haga falta en el proyecto. No hay nadie a quien preguntar: decide tú lo que falte." ;;
esac

BEFORE=$(g rev-parse --short HEAD)
cd "$R"
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir "$KIT" --add-dir "$KIT" \
  --permission-mode acceptEdits \
  --allowedTools "Bash(*)" "PowerShell(*)" "Agent" \
  --disallowedTools "SendMessage" "ListAgents" "AskUserQuestion" \
  --max-turns "${MAX_TURNS:-50}" \
  --output-format stream-json --verbose "$ASK" < /dev/null > "$RUNS/$LABEL.jsonl" 2>"$RUNS/$LABEL.err"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD)"
  echo "## status"; g status --short --branch --untracked-files=all
  echo "## ramas"; g branch -a
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## ficheros cambiados frente a la base (commiteados o no)"; g add -A -N . 2>/dev/null; g diff --stat "$BEFORE"
  echo "## diff del roadmap"; g diff "$BEFORE" -- .docs/sdd/roadmap.md
  echo "## ficheros nuevos en .docs"; g diff --name-only --diff-filter=A "$BEFORE" -- .docs
} 2>&1 | sed -e "s#$RUN#<run>#g" -e "s#$(cygpath -m "$RUN")#<run>#g" > "$OUT/$LABEL.state.txt"
# Solo el roadmap y specs/: con la ruta entera de .docs/, las carpetas de los sujetos pasan de 140 caracteres (PathLength.Tests.ps1).
mkdir -p "$OUT/$LABEL"; cp "$R/.docs/sdd/roadmap.md" "$OUT/$LABEL/"; [ -d "$R/.docs/sdd/specs" ] && cp -r "$R/.docs/sdd/specs" "$OUT/$LABEL/"
node "$SPECS/20260924-082516-task-0055-native-default/red/tools.mjs" "$RUNS/$LABEL.jsonl" "$RUN" > "$OUT/$LABEL.tools.txt"
node "$SPECS/20260924-082516-task-0055-native-default/red/texts.mjs" "$RUNS/$LABEL.jsonl" > "$OUT/$LABEL.texts.txt"
echo "[$LABEL] listo"
