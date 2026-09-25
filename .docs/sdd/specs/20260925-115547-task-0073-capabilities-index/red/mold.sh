# Molde: repo de juguete salas con 9 capacidades; la que toca cada escenario (house-rules) no se deduce del nombre.
# Usa g, put, commit y R de subject.sh. PURPOSE=1 escribe «## Propósito» en cada capacidad (el formato del GREEN).

cap() {
  local name="$1" purpose="$2" file="$R/.docs/sdd/capabilities/$1.md"
  mkdir -p "$(dirname "$file")"
  printf '# Capacidad — %s\n\n' "$name" > "$file"
  [ "${PURPOSE:-0}" = 1 ] && printf '## Propósito\n\n%s\n\n' "$purpose" >> "$file"
  cat >> "$file"
}

capabilities() {
  cap bookings 'Reservar, consultar y cancelar salas por franja horaria desde el CLI.' <<'EOF'
## Requisitos

### Reservar una franja
- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`

### Consultar salas libres
- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12
- WHEN `salas libres 10-12`
- THEN lista `Sur` y `Oeste`, una por línea

### Cancelar una reserva
- GIVEN Norte reservada de 10 a 12 por quien cancela
- WHEN `salas cancelar Norte 10-12`
- THEN la franja queda libre y el CLI responde `Cancelada Norte 10-12`
EOF
  cap rooms 'Catálogo de salas: nombre, aforo, equipamiento y salas cerradas por mantenimiento.' <<'EOF'
## Requisitos

### Listar el catálogo
- GIVEN las salas Norte (8 personas, pantalla), Sur (4) y Oeste (12, en mantenimiento)
- WHEN `salas catalogo`
- THEN lista las tres con su aforo y su equipamiento, y Oeste con `(en mantenimiento)`

### Una sala en mantenimiento no se ofrece
- GIVEN Oeste en mantenimiento
- WHEN `salas libres 10-12`
- THEN Oeste no aparece
EOF
  cap access 'Quién entra en la aplicación y con qué rol (empleado, invitado, administrador). No decide cuánto, cuándo ni qué días se reserva.' <<'EOF'
## Requisitos

### Entrar con la tarjeta de empleado
- GIVEN una tarjeta de empleado válida
- WHEN `salas login --tarjeta 4411`
- THEN la sesión se abre con el rol `empleado`

### Un invitado entra con código de un solo día
- GIVEN un código de invitado emitido hoy por recepción
- WHEN `salas login --invitado K7Q2`
- THEN la sesión se abre con el rol `invitado` y caduca a las 23:59

### Solo un administrador cambia roles
- GIVEN una sesión con rol `empleado`
- WHEN `salas rol 4411 administrador`
- THEN responde `Solo un administrador cambia roles`
EOF
  cap house-rules 'Normas de uso de las salas según el rol de quien reserva: duración máxima, días y horas permitidos, antelación y penalización por no presentarse.' <<'EOF'
## Requisitos

### Duración máxima por rol
- GIVEN una sesión con rol `invitado`
- WHEN `salas reservar Sur 10-13`
- THEN responde `Máximo 2 h por reserva` y no guarda nada; un `empleado` tiene el mismo tope

### Días permitidos por rol
- GIVEN una sesión con rol `invitado`
- WHEN `salas reservar Sur sabado 10-12`
- THEN responde `Los invitados reservan de lunes a viernes`; un `empleado` puede reservar cualquier día

### Penalización por no presentarse
- GIVEN una reserva de Norte de 10 a 12 sin check-in a las 10:15
- WHEN pasa la franja
- THEN la reserva cuenta como no presentada y quien la hizo no puede reservar durante 7 días

## Reglas de la capacidad

- **Dónde viven los datos**: `data/rules.json`.
- **Idioma de los nombres**: comandos y mensajes en castellano.
- **Límites**: 2 h por reserva; antelación máxima de 14 días.
- **Avisos**: cada norma incumplida responde con su mensaje y no guarda la reserva.
- **Regla ante conflicto**: si dos normas aplican, manda la más restrictiva.
EOF
  cap billing 'Cobro por horas a los departamentos externos que reservan salas, y factura mensual a cada uno.' <<'EOF'
## Requisitos

### Tarifa por hora
- GIVEN el departamento externo Logística con 3 h reservadas en octubre a 20 € la hora
- WHEN se emite la factura de octubre
- THEN la factura de Logística es de 60 €

### Los departamentos internos no pagan
- GIVEN el departamento interno Personas con 10 h reservadas
- WHEN se emite la factura del mes
- THEN Personas no recibe factura
EOF
  cap quotas 'Horas semanales que cada departamento puede tener reservadas a la vez.' <<'EOF'
## Requisitos

### Tope semanal por departamento
- GIVEN Logística con 20 h reservadas esta semana y un tope de 20 h
- WHEN alguien de Logística reserva una hora más
- THEN responde `Logística ha llegado a su tope de 20 h esta semana`
EOF
  cap notifications 'Correos que envía la aplicación: confirmación de reserva, recordatorio 15 minutos antes y aviso de cancelación.' <<'EOF'
## Requisitos

### Confirmación de reserva
- GIVEN una reserva recién guardada
- WHEN termina `salas reservar`
- THEN quien reserva recibe un correo con la sala y la franja

### Recordatorio
- GIVEN una reserva de Norte a las 10:00
- WHEN son las 9:45
- THEN quien reservó recibe un recordatorio
EOF
  cap calendar-sync 'Exportación de las reservas a calendarios externos en formato .ics.' <<'EOF'
## Requisitos

### Exportar mis reservas
- GIVEN dos reservas de quien pide la exportación
- WHEN `salas ics`
- THEN escribe `reservas.ics` con dos eventos
EOF
  cap usage-reports 'Informe mensual de ocupación por sala y por departamento para facility management.' <<'EOF'
## Requisitos

### Ocupación mensual por sala
- GIVEN Norte ocupada 40 h de 160 h laborables en octubre
- WHEN `salas informe octubre`
- THEN la fila de Norte dice `25 %`
EOF
}

base_files() {
  put README.md <<'EOF'
# salas

CLI de reservas de salas de la oficina: `salas reservar`, `salas libres`, `salas cancelar`, `salas catalogo`, `salas informe`.
EOF
  put .gitignore <<'EOF'
.superpowers/
EOF
  put src/cli.js <<'EOF'
export function run(args) {
  return `salas ${args.join(' ')}`;
}
EOF
  put tests/cli.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { run } from '../src/cli.js';

test('el CLI responde', () => {
  assert.strictEqual(run(['libres']), 'salas libres');
});
EOF
  put .docs/sdd/mission.md <<'EOF'
# Mission — salas

Reservar las salas de reuniones de la oficina desde la terminal, para empleados e invitados, y cobrar a los departamentos externos lo que usan.
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.
EOF
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}}
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]
EOF
  capabilities
}

roadmap_start() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0021 | Los invitados solo pueden reservar 1 h seguida; hoy tienen las mismas 2 h que un empleado | recepción | `src/cli.js` | S |
| 0022 | `salas informe` por trimestre | facility | `src/cli.js` | S |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
EOF
}

roadmap_running() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0021 | 🔄 Los invitados solo pueden reservar 1 h seguida; hoy tienen las mismas 2 h que un empleado | recepción | `src/cli.js` | S |
| 0022 | `salas informe` por trimestre | facility | `src/cli.js` | S |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
EOF
}

# Escenario m: el molde en el kit 1.2.0, con el párrafo inicial y su procedencia y sin «## Propósito»;
# quotas sin párrafo y bookings con «## Historial».
legacy_intro() {
  local file="$R/.docs/sdd/capabilities/$1.md"
  { head -n 2 "$file"; printf '%s\n\n' "$2"; tail -n +3 "$file"; } > "$file.tmp" && mv "$file.tmp" "$file"
}

legacy_capabilities() {
  legacy_intro bookings 'Verdad viva de las reservas de salas por franja. La declaró la spec de la task 0004 en sus «Decisiones a validar» (decisión 2).'
  legacy_intro rooms 'Verdad viva del catálogo de salas y de su mantenimiento. La declaró la spec de la task 0005 (decisión 1).'
  legacy_intro access 'Verdad viva del acceso a la aplicación y de los roles. La declaró la spec de la task 0002 en sus «Decisiones a validar» (decisión 1). El login con tarjeta vive en `src/auth.js`.'
  legacy_intro house-rules 'Verdad viva de las normas de uso según el rol de quien reserva: duración, días, antelación y no presentarse. La declaró la spec de la task 0006 (decisión 3); antes vivían en `bookings`.'
  legacy_intro billing 'Verdad viva del cobro a los departamentos externos. La declaró la spec de la task 0008 (decisión 4).'
  legacy_intro notifications 'Verdad viva de los correos que envía la aplicación. La declaró la spec de la task 0009 (decisión 2).'
  legacy_intro calendar-sync 'Verdad viva de la exportación a calendarios. La declaró la spec de la task 0011 (decisión 1).'
  legacy_intro usage-reports 'Verdad viva del informe de ocupación. La declaró la spec de la task 0012 (decisión 1).'
  printf '\n## Historial\n\n- 2026-09-10 — 20260910-090000-task-0004-bookings — ADDED Reservar una franja\n- 2026-09-18 — 20260918-100000-task-0010-cancel — ADDED Cancelar una reserva\n' >> "$R/.docs/sdd/capabilities/bookings.md"
  put .docs/sdd/sdd-kit.json <<'JSON'
{"version": "1.2.0", "channel": "plugin", "updated": "2026-09-20", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}}
JSON
}
