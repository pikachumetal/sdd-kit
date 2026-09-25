# Molde de la 0060 (repo de juguete salas), copiado sin cambios para la campaña de la 0068.
# Usa g, put, commit, R, SPEC, SPEC14 y SPEC15 de subject.sh.

base_files() {
  put README.md <<'EOF'
# salas

CLI de reservas de salas: `node bin/salas.js libres <franja>`, `node bin/salas.js reservar <sala> <franja>`.
EOF
  put .gitignore <<'EOF'
.superpowers/
EOF
  put package.json <<'EOF'
{ "name": "salas", "type": "module", "bin": { "salas": "bin/salas.js" } }
EOF
  put bin/salas.js <<'EOF'
#!/usr/bin/env node
import * as slots from '../src/slots.js';

const [command, ...args] = process.argv.slice(2);
const commands = { reservar: () => slots.reserve(...args), libres: () => slots.free(...args) };
try {
  console.log(JSON.stringify(commands[command]()));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
EOF
  put src/slots.js <<'EOF'
export function reserve(room, slot) {
  return { room, slot };
}
EOF
  put tests/slots.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('reserva una sala en una franja', () => {
  assert.deepStrictEqual(reserve('Norte', '10-12'), { room: 'Norte', slot: '10-12' });
});
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.
EOF
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false}}
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0012 | Validar el formato de la franja al reservar (`10-12`, no `1012`) | dev-lead | `src/slots.js` | S |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]
EOF
}

spec_files() {
  put $SPEC/spec.md <<'EOF'
---
id: 20260923-100000-task-0012-franja
task: 0012
title: Validar el formato de la franja
mode: full
status: approved
created: 2026-09-23
approvers:
  - role: dev-lead
    name: Dev Lead
    approved_at: 2026-09-23
---

# Spec — Validar el formato de la franja

## Intent

`salas reservar Norte 1012` reserva una franja sin sentido. Se quiere un error claro.

## Delta de comportamiento

### Capacidad: `booking`

**ADDED — La franja se valida al reservar**
- GIVEN una franja que no casa con `HH-HH`
- WHEN se reserva
- THEN falla con «Franja no válida: usa HH-HH, p. ej. 10-12»

**ADDED — La franja se valida al consultar libres**
- GIVEN una franja que no casa con `HH-HH`
- WHEN se consultan las salas libres
- THEN falla con el mismo mensaje

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-23 | aprobada |
EOF
}

plan_files() {
  put $SPEC/plan.md <<'EOF'
---
id: 20260923-100000-task-0012-franja
task: 0012
title: Plan — Validar el formato de la franja
spec: ./spec.md
status: approved
---

# Plan — Validar el formato de la franja

**Ejecución**: subagent, porque cada task lleva su revisión.

## Restricciones globales

### De código

- Mensaje literal: «Franja no válida: usa HH-HH, p. ej. 10-12».

### De proceso

- Implementadores y revisores Sonnet, effort medio.

## 2. Tasks

### Task 1 — Validar al reservar

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/slot-format.test.js`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: backend
**Verificación**: `node --test tests/slot-format.test.js`

- [ ] **Step 1: Implementación** — `reserve` lanza el error si la franja no casa con `/^\d{2}-\d{2}$/`.
- [ ] **Step 2: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — Validar al consultar libres

**Modelo**: Sonnet, effort medio
**Tests RED**: hilo principal · `tests/free-format.test.js`, escritos antes de despachar y sin commitear: van en el commit de la task
**Superficies**: backend
**Verificación**: `node --test tests/free-format.test.js`

- [ ] **Step 1: Implementación** — `free(slot)` en `src/slots.js` con la misma validación.
- [ ] **Step 2: Commit de la task** — uno solo, al quedar limpia su revisión.
EOF
  put $SPEC/tasks.md <<'EOF'
# Tasks — Validar el formato de la franja (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Validar al reservar | pending | — | |
| 2 | Validar al consultar libres | pending | — | |
EOF
}

opening_in_one() {
  g checkout -q -b feature/0012
  spec_files; plan_files; commit "docs(0012): abrir la task 0012"
}

task1_red() {
  put tests/slot-format.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('rechaza una franja sin guion', () => {
  assert.throws(() => reserve('Norte', '1012'), /Franja no válida: usa HH-HH, p\. ej\. 10-12/);
});
EOF
}

task1_code() {
  put src/slots.js <<'EOF'
const SLOT = /^\d{2}-\d{2}$/;

export function reserve(room, slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
  return { room, slot };
}
EOF
}

task1_done() {
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar"
  local t1; t1=$(g rev-parse --short HEAD)
  sed -i "s/| 1 | Validar al reservar | pending | — |/| 1 | Validar al reservar | done | $t1 |/" "$R/$SPEC/tasks.md"
  commit "docs(0012): task 1 hecha en tasks.md"
  put .superpowers/sdd/plan/progress.md <<EOF
# SDD ledger — plan: $SPEC/plan.md

Task 1: review clean
Task 1: complete ($t1)
EOF
}

task2_code() {
  cat >> "$R/src/slots.js" <<'EOF'

export function free(slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
  return ['Norte', 'Sur'];
}
EOF
  put tests/free-format.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { free } from '../src/slots.js';

test('libres rechaza una franja sin guion', () => {
  assert.throws(() => free('1012'), /Franja no válida/);
});
EOF
}

closing_state() {
  task1_red; task1_code; commit "feat(0012): validar el formato de la franja al reservar"
  local t1; t1=$(g rev-parse --short HEAD)
  task2_code; commit "feat(0012): validar el formato de la franja al consultar libres"
  local t2; t2=$(g rev-parse --short HEAD)
  sed -i "s/| 1 | Validar al reservar | pending | — |/| 1 | Validar al reservar | done | $t1 |/; s/| 2 | Validar al consultar libres | pending | — |/| 2 | Validar al consultar libres | done | $t2 |/" "$R/$SPEC/tasks.md"
  printf '\nRevisión final: general-purpose + sonnet, limpia\n' >> "$R/$SPEC/tasks.md"
  put $SPEC/review-final.md <<'EOF'
# Revisión final de rama — task 0012

Veredicto: limpia. Sin hallazgos.
EOF
  commit "docs(0012): revisión final de rama"
}

# Estado tras cerrar la 0012: reservas en memoria, capacidad booking con sus reglas.
booking_base() {
  put src/slots.js <<'EOF'
const SLOT = /^\d{2}-\d{2}$/;
const ROOMS = ['Norte', 'Sur'];
const bookings = [];

function checkSlot(slot) {
  if (!SLOT.test(slot)) throw new Error('Franja no válida: usa HH-HH, p. ej. 10-12');
}

export function reserve(room, slot) {
  checkSlot(slot);
  if (bookings.some((b) => b.room === room && b.slot === slot)) throw new Error('Sala ocupada en esa franja');
  bookings.push({ room, slot });
  return { room, slot };
}

export function free(slot) {
  checkSlot(slot);
  return ROOMS.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
}
EOF
  put .docs/sdd/capabilities/booking.md <<'EOF'
# Capacidad — booking

Reservar salas por franjas desde la CLI.

## Requisitos

### Se reserva una sala libre
- GIVEN la sala Norte libre en 10-12
- WHEN `salas reservar Norte 10-12`
- THEN imprime la reserva y Norte deja de salir en `salas libres 10-12`

### La franja se valida al reservar
- GIVEN una franja que no casa con `HH-HH`
- WHEN se reserva
- THEN falla con «Franja no válida: usa HH-HH, p. ej. 10-12»

### La franja se valida al consultar libres
- GIVEN una franja que no casa con `HH-HH`
- WHEN se consultan las salas libres
- THEN falla con el mismo mensaje

## Reglas de la capacidad

- **Dónde viven los datos**: en memoria del proceso; no persisten entre ejecuciones.
- **Límites**: franjas `HH-HH` entre 08 y 20. Salas: Norte (4 plazas) y Sur (12 plazas).
- **Avisos**: «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa; «Sala ocupada en esa franja» si ya está reservada.

## Historial

- 2026-09-23 — 20260923-100000-task-0012-franja — ADDED La franja se valida al reservar · La franja se valida al consultar libres
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0014 | **Reservas que se guardan y se cancelan**: hoy las reservas se pierden al acabar cada ejecución y no hay forma de cancelar. Guardarlas en un fichero, listarlas con `salas reservas` y cancelar con `salas cancelar <sala> <franja>` | dev-lead | `src/slots.js`, `bin/salas.js`, fichero de datos nuevo | M |
| 0015 | **Tope de reservas y salas grandes**: nadie puede tener más de 3 reservas el mismo día, y una sala de más de 10 plazas solo se reserva en franjas de 2 horas o más. Cada reserva lleva quién la hace. Si se incumple, un aviso claro que diga cuál de las dos reglas | dev-lead | `src/slots.js`, `bin/salas.js` | M |

## Hecho

| Id | Tarea | Cierre |
| --- | --- | --- |
| 0012 | Validar el formato de la franja | ✅ 2026-09-23 |
EOF
  commit "feat: salas tras la task 0012"
}

# Aplicación web por capas (BD, API, frontend) para medir si el plan parte por capas.
layered_base() {
  rm -rf "$R/src" "$R/bin" "$R/tests" "$R/package.json"
  put README.md <<'EOF'
# salas-web

Reservas de salas. `db/` migraciones SQL numeradas (Postgres), `api/` servidor Express, `web/` frontend Angular.
Arranque: `npm run dev` (API en :3000, web en :4200).
EOF
  put package.json <<'EOF'
{ "name": "salas-web", "scripts": { "dev": "node scripts/dev.js", "test": "node --test api/tests", "test:web": "ng test --watch=false", "migrate": "node scripts/migrate.js" } }
EOF
  put db/migrations/001_rooms.sql <<'EOF'
CREATE TABLE rooms (id serial PRIMARY KEY, name text NOT NULL UNIQUE, seats int NOT NULL);
INSERT INTO rooms (name, seats) VALUES ('Norte', 4), ('Sur', 12);
EOF
  put api/routes/rooms.js <<'EOF'
import { Router } from 'express';
import { db } from '../db.js';

export const rooms = Router();

rooms.get('/rooms', async (req, res) => {
  const { rows } = await db.query('SELECT id, name, seats FROM rooms ORDER BY name');
  res.json(rows);
});
EOF
  put api/tests/rooms.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { request } from './helpers.js';

test('lista las salas por nombre', async () => {
  const body = await request('GET', '/rooms', { user: 'ana' });
  assert.deepStrictEqual(body.map((r) => r.name), ['Norte', 'Sur']);
});
EOF
  put web/src/app/rooms/rooms.component.ts <<'EOF'
import { Component, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';

@Component({ selector: 'app-rooms', templateUrl: './rooms.component.html' })
export class RoomsComponent {
  readonly rooms = httpResource<{ id: number; name: string; seats: number }[]>(() => '/api/rooms');
}
EOF
  put web/src/app/rooms/rooms.component.html <<'EOF'
<ul>
  @for (room of rooms.value(); track room.id) {
    <li>{{ room.name }} ({{ room.seats }} plazas)</li>
  }
</ul>
EOF
  put .docs/sdd/tech-stack.md <<'EOF'
# Tech stack — salas-web

- BD: Postgres. Migraciones SQL numeradas en `db/migrations/`, se aplican con `npm run migrate`.
- API: Express en `api/`. Tests: `npm test` (node:test contra una BD de prueba).
- Web: Angular en `web/`. Tests: `npm run test:web`.
- El usuario llega en la cabecera `X-User` (sin login en esta fase).
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — salas-web

## Art. I — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. II — Tests

Todo verde antes de fusionar: `npm test` y `npm run test:web`.
EOF
  put .docs/sdd/capabilities/rooms.md <<'EOF'
# Capacidad — rooms

## Requisitos

### Se listan las salas
- GIVEN las salas Norte (4 plazas) y Sur (12 plazas)
- WHEN Ana abre la pantalla de salas
- THEN ve Norte y Sur, en ese orden, con sus plazas
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas-web

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0016 | **Salas favoritas**: cada persona marca salas como favoritas con una estrella; las favoritas salen primero en la lista | dev-lead | `db/migrations/`, `api/`, `web/` | M |
EOF
  commit "feat: salas-web con listado de salas"
}

spec16_files() {
  put $SPEC16/spec.md <<'EOF'
---
id: 20260924-093000-task-0016-favoritas
task: 0016
title: Salas favoritas
mode: full
status: approved
created: 2026-09-24
approvers:
  - role: dev-lead
    name: Dev Lead
    approved_at: 2026-09-24
---

# Spec — Salas favoritas

## Decisiones que he tomado yo — valida estas

1. La favorita es por persona (cabecera `X-User`), no global.

## Intent

Quien reserva siempre las mismas salas tiene que buscarlas en la lista cada vez. Se quiere marcarlas como favoritas y verlas primero.

## Scope

- Entra: marcar, desmarcar, orden con favoritas primero.
- No entra: compartir favoritas, límite de favoritas.

## Delta de comportamiento

### Capacidad: `rooms`

**ADDED — Se marca una sala como favorita**
- GIVEN Ana ve Norte y Sur, ninguna favorita
- WHEN pulsa la estrella de Sur
- THEN la estrella de Sur queda llena, y sigue llena al recargar la página

**ADDED — Las favoritas salen primero**
- GIVEN Ana tiene Sur como favorita
- WHEN abre la pantalla de salas
- THEN el orden es Sur, Norte
- AND Luis, sin favoritas, sigue viendo Norte, Sur

**ADDED — Se desmarca una favorita**
- GIVEN Ana tiene Sur como favorita
- WHEN pulsa otra vez la estrella de Sur
- THEN la estrella queda vacía y el orden vuelve a Norte, Sur

**MODIFIED — Se listan las salas**
- GIVEN las salas Norte (4 plazas) y Sur (12 plazas), sin favoritas
- WHEN Ana abre la pantalla de salas
- THEN ve Norte y Sur, en ese orden, con sus plazas y una estrella vacía en cada una

**Reglas de la capacidad**
- **Dónde viven los datos**: las favoritas, en la tabla `favorite_rooms (user_name, room_id)`, una fila por persona y sala.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-24 | aprobada |
EOF
  commit "docs(0016): spec aprobada de la task 0016"
}

spec14_files() {
  put $SPEC14/spec.md <<'EOF'
---
id: 20260924-090000-task-0014-persistir
task: 0014
title: Reservas que se guardan y se cancelan
mode: full
status: approved
created: 2026-09-24
approvers:
  - role: dev-lead
    name: Dev Lead
    approved_at: 2026-09-24
---

# Spec — Reservas que se guardan y se cancelan

## Decisiones que he tomado yo — valida estas

1. Las reservas se guardan en `data/reservas.json` — un fichero basta para una CLI de un solo usuario.

## Intent

Hoy cada ejecución de `salas` empieza sin reservas: lo reservado se pierde y no se puede cancelar. Se quiere que las reservas se guarden, que se puedan listar y cancelar.

## Scope

- Entra: guardar, listar, cancelar.
- No entra: usuarios, permisos.

## Delta de comportamiento

### Capacidad: `booking`

**ADDED — Las reservas se guardan entre ejecuciones**
- GIVEN `salas reservar Norte 10-12` en una ejecución anterior
- WHEN `salas libres 10-12`
- THEN imprime `["Sur"]`

**ADDED — Se listan las reservas**
- GIVEN Norte 10-12 y Sur 12-14 reservadas
- WHEN `salas reservas`
- THEN imprime `Norte 10-12` y `Sur 12-14`, una por línea

**ADDED — Se cancela una reserva**
- GIVEN Norte 10-12 reservada
- WHEN `salas cancelar Norte 10-12`
- THEN `salas reservas` ya no la lista y `salas libres 10-12` vuelve a incluir Norte

**ADDED — Cancelar lo que no está reservado avisa**
- GIVEN Norte libre en 10-12
- WHEN `salas cancelar Norte 10-12`
- THEN falla con «No hay reserva de Norte en 10-12»

**Reglas de la capacidad**
- **Dónde viven los datos**: en `data/reservas.json`, junto a la CLI.
- **Avisos**: «Franja no válida: usa HH-HH, p. ej. 10-12» si la franja no casa; «Sala ocupada en esa franja» si ya está reservada; «No hay reserva de <sala> en <franja>» al cancelar lo que no existe.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Dev Lead | 2026-09-24 | aprobada |
EOF
  commit "docs(0014): spec aprobada de la task 0014"
}
