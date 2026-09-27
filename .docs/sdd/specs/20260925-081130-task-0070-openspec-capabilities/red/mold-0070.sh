# Escenarios de la task 0070 sobre el molde salas de la 0067 (mold.sh); subject.sh carga los dos con «.».

roadmap_rows() {
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0020 | `libres` lista las salas en orden alfabético | soporte | `src/slots.js` | S |
| 0021 | Cancelar una reserva: `salas cancelar <sala> <franja>` libera la franja | usuarios | `src/slots.js` | S |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
EOF
}

slots_sorted() {
  put src/slots.js <<'EOF'
export const ROOMS = [
  { name: 'Norte' },
  { name: 'Sur' },
  { name: 'Oeste', maintenance: true },
];

export function hours(slot) {
  const [from, to] = slot.split('-').map(Number);
  return to - from;
}

export function reserve(bookings, room, slot) {
  bookings.push({ room, slot });
  return `Reservada ${room} ${slot}`;
}

export function free(bookings, slot) {
  const taken = bookings.filter((b) => b.slot === slot).map((b) => b.room);
  return ROOMS.filter((r) => !taken.includes(r.name)).map((r) => r.name).sort().join('\n');
}
EOF
}

slots_sorted_with_maintenance() {
  put src/slots.js <<'EOF'
export const ROOMS = [
  { name: 'Norte' },
  { name: 'Sur' },
  { name: 'Oeste', maintenance: true },
];

export function hours(slot) {
  const [from, to] = slot.split('-').map(Number);
  return to - from;
}

export function reserve(bookings, room, slot) {
  bookings.push({ room, slot });
  return `Reservada ${room} ${slot}`;
}

export function free(bookings, slot) {
  const taken = bookings.filter((b) => b.slot === slot).map((b) => b.room);
  const open = ROOMS.filter((r) => !r.maintenance && !taken.includes(r.name)).map((r) => r.name).sort();
  const closed = ROOMS.filter((r) => r.maintenance).map((r) => `${r.name} (en mantenimiento)`);
  return [...open, ...closed].join('\n');
}
EOF
  put tests/slots.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve, free } from '../src/slots.js';

test('reserva una sala en una franja', () => {
  assert.strictEqual(reserve([], 'Norte', '10-12'), 'Reservada Norte 10-12');
});

test('libres sale en orden alfabético', () => {
  assert.strictEqual(free([], '10-12'), 'Norte\nSur\nOeste (en mantenimiento)');
});

test('libres deja las salas en mantenimiento aparte', () => {
  assert.strictEqual(free([{ room: 'Norte', slot: '10-12' }], '10-12'), 'Sur\nOeste (en mantenimiento)');
});
EOF
}

spec_sorted() {
  put .docs/sdd/specs/20260925-070000-task-0020-libres-orden/spec.md <<'EOF'
---
id: 20260925-070000-task-0020-libres-orden
task: 0020
title: libres en orden alfabético
mode: lite
status: approved
created: 2026-09-25
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-25
---

# Spec — libres en orden alfabético

## Decisiones que he tomado yo — valida estas

1. Orden alfabético simple, sin distinguir tildes: solo hay tres salas.

## Intent

Soporte pide que `salas libres` salga en orden alfabético: hoy sale en el orden de alta de las salas.

## Scope

- Entra: el orden de la salida de `salas libres`.
- No entra: el formato de cada línea.

## Approach

Ordenar la lista antes de unirla.

## Delta de comportamiento

### Capacidad: `bookings`

**MODIFIED — Consultar salas libres** (antes: "lista `Sur` y `Oeste`, una por línea")
- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12
- WHEN `salas libres 10-12`
- THEN lista `Oeste` y `Sur`, una por línea y en orden alfabético

### Estimación y esfuerzo

- Tipo: backend
- Estimación de implementación: 0,5h

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-25 | aprobada |
EOF
}

bookings_after_patch_0014() {
  put .docs/sdd/capabilities/bookings.md <<'EOF'
# Capacidad — bookings

## Requisitos

### Reservar una franja
- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`

### Consultar salas libres
- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12 y Oeste en mantenimiento
- WHEN `salas libres 10-12`
- THEN lista `Sur`
- AND lista aparte, al final, `Oeste (en mantenimiento)`

## Reglas de la capacidad

- **Dónde viven los datos**: `data/bookings.json`.
- **Idioma de los nombres**: comandos y mensajes en castellano.
- **Límites**: una reserva dura como máximo 2 h.
- **Avisos**: una reserva de más de 2 h se rechaza con `Máximo 2 h por reserva`.
- **Regla ante conflicto**: no aplica.

## Historial

- 2026-09-25 — 20260925-080000-patch-0014-libres-mantenimiento — MODIFIED Consultar salas libres
- 2026-09-10 — 20260910-090000-task-0004-bookings — ADDED Reservar una franja
- 2026-09-10 — 20260910-090000-task-0004-bookings — ADDED Consultar salas libres
EOF
  printf '| 2026-09-25 | 0014 | `libres` deja aparte las salas en mantenimiento — [patch](specs/20260925-080000-patch-0014-libres-mantenimiento/patch.md) |\n' >> "$R/.docs/sdd/roadmap.md"
}

# m: la task 0020 cierra con un MODIFIED escrito antes de que el patch 0014 fusionara en el mismo requisito.
task_sorted_behind_patch() {
  roadmap_rows
  commit "docs(sdd): filas 0020 y 0021"
  g checkout -q -b develop
  g checkout -q -b feature/0020
  slots_sorted
  spec_sorted
  [ "${NO_BEFORE:-0}" = 1 ] && sed -i 's/^\(\*\*MODIFIED — Consultar salas libres\*\*\) (antes: .*)$/\1/' "$R/.docs/sdd/specs/20260925-070000-task-0020-libres-orden/spec.md"
  put tests/slots.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve, free } from '../src/slots.js';

test('reserva una sala en una franja', () => {
  assert.strictEqual(reserve([], 'Norte', '10-12'), 'Reservada Norte 10-12');
});

test('libres sale en orden alfabético', () => {
  assert.strictEqual(free([{ room: 'Norte', slot: '10-12' }], '10-12'), 'Oeste\nSur');
});
EOF
  commit "feat(0020): libres en orden alfabético" "Soporte pedía el orden alfabético."
  g checkout -q develop
  patch_maintenance
  g checkout -q develop
  g merge -q --no-ff feature/0014 -m "merge: feature/0014 en develop" -m "Patch 0014 cerrado."
  bookings_after_patch_0014
  commit "docs(0014): cierre del patch 0014" "Fusiona el delta en bookings."
  g checkout -q feature/0020
  g merge -q develop -m "merge: develop en feature/0020" >/dev/null 2>&1
  slots_sorted_with_maintenance
  g add -A
  g commit -q -m "merge: develop en feature/0020" -m "Resuelve slots.js con el orden y el mantenimiento."
}

# c: la task 0021 arranca; bookings ya existe y la fila habla de «reserva».
task_cancel_start() {
  roadmap_rows
  commit "docs(sdd): filas 0020 y 0021"
  g checkout -q -b develop
  g checkout -q -b feature/0021
}
