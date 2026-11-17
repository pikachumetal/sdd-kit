#!/usr/bin/env bash
# Sujeto headless del patch 0078 (umbral para proponer partir una feature), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   h  fila de 4-5 tasks homogéneas (cinco consultas de solo lectura en el mismo CLI): NO debe proponer partir
#   x  fila de 4-5 tasks heterogéneas (migración de datos, persistencia, API HTTP, pantalla web): debe proponerlo
# Se mide la primera pregunta del turno (paso 2 de sdd-start-feature). La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
MOLDS="$REPO/.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red"
. "$REPO/tests/headless/lib.sh"
SC="$3"
subject_init "$1" "$2" "$4" sdd-start-feature

cp -r "$MOLDS/molde/." "$R/"
put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-21", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}}
EOF
put src/app.js <<'EOF'
// salas: CLI de reservas de salas por franja, en memoria.
const bookings = [
  { room: 'Norte', day: '2026-09-28', slot: '10:00-12:00', owner: 'ana' },
  { room: 'Sur', day: '2026-09-28', slot: '12:00-13:00', owner: 'luis' },
];

function book(room, day, slot, owner) {
  if (bookings.some(b => b.room === room && b.day === day && b.slot === slot)) throw new Error('sala ocupada');
  bookings.push({ room, day, slot, owner });
}

function cancel(room, day, slot, owner) {
  const i = bookings.findIndex(b => b.room === room && b.day === day && b.slot === slot && b.owner === owner);
  if (i < 0) throw new Error('reserva no encontrada');
  bookings.splice(i, 1);
}

function free(day, slot) {
  return ['Norte', 'Sur'].filter(room => !bookings.some(b => b.room === room && b.day === day && b.slot === slot));
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'reservar') book(...args);
else if (cmd === 'cancelar') cancel(...args);
else if (cmd === 'libres') console.log(free(...args).join(', '));
else console.log('uso: reservar|cancelar|libres');
EOF

case $SC in
  h) ROW='| 0012 | **Consultas de reservas en el CLI** — cinco subcomandos nuevos de solo lectura sobre las reservas en memoria de `src/app.js`: `hoy` (reservas del día), `semana` (reservas de los próximos 7 días), `sala <nombre>` (reservas de una sala), `usuario <nombre>` (reservas de un dueño) y `buscar <texto>` (por sala o dueño). Salida en texto, una reserva por línea | Pendiente |' ;;
  x) ROW='| 0012 | **Reservas persistentes y visibles fuera del CLI** — las reservas pasan de memoria a `data/reservas.json`, con una migración que vuelca las actuales al fichero; un endpoint HTTP `GET /reservas` que las devuelve en JSON; y una pantalla web (`public/index.html`) que las lista por sala y día llamando a ese endpoint | Pendiente |' ;;
  *) die "escenario desconocido: $SC" ;;
esac
put .docs/sdd/roadmap.md <<EOF
# Roadmap — salas

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
$ROW

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| B1 | Exportar reservas a calendario (.ics) | idea propia |

## Releases cerradas

### v0.3.0 (2026-09-01)

Cancelar una reserva propia. [changelog](changelog.md)
EOF
g init -q -b main
commit "feat: base con cancelación de reservas"
g checkout -q -b develop
g checkout -q -b feature/0012

ASK="Arranca la feature 0012 del roadmap."
MAX_TURNS=30

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; exit 0; }
subject_launch "$ASK"

{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current)"
  echo "## status"; g status --short --untracked-files=all
} | subject_save
