# Molde: repo de juguete salas con una capacidad y un patch listo para cerrar; subject.sh lo carga con «.».
# Usa g, put, commit y R de subject.sh.

base_files() {
  put README.md <<'EOF'
# salas

CLI de reservas de salas: `salas libres <franja>`, `salas reservar <sala> <franja>`.
EOF
  put .gitignore <<'EOF'
.superpowers/
EOF
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
  return ROOMS.filter((r) => !taken.includes(r.name)).map((r) => r.name).join('\n');
}
EOF
  put tests/slots.test.js <<'EOF'
import { test } from 'node:test';
import assert from 'node:assert';
import { reserve } from '../src/slots.js';

test('reserva una sala en una franja', () => {
  assert.strictEqual(reserve([], 'Norte', '10-12'), 'Reservada Norte 10-12');
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
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate"}}
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — salas

## Próximo

| Id | Tarea | Origen | Ficheros que toca | Tamaño |
| --- | --- | --- | --- | --- |
| 0013 | `reservar` acepta reservas de más de 2 h | soporte | `src/slots.js` | patch |
| 0014 | `libres` ofrece salas en mantenimiento | soporte | `src/slots.js` | patch |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]
EOF
  put .docs/sdd/capabilities/bookings.md <<'EOF'
# Capacidad — bookings

## Requisitos

### Reservar una franja
- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`

### Consultar salas libres
- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12
- WHEN `salas libres 10-12`
- THEN lista `Sur` y `Oeste`, una por línea

## Reglas de la capacidad

- **Dónde viven los datos**: `data/bookings.json`.
- **Idioma de los nombres**: comandos y mensajes en castellano.
- **Límites**: una reserva dura como máximo 2 h.
- **Avisos**: una reserva de más de 2 h se rechaza con `Máximo 2 h por reserva`.
- **Regla ante conflicto**: no aplica.

## Historial

- 2026-09-10 — 20260910-090000-task-0004-bookings — ADDED Reservar una franja
- 2026-09-10 — 20260910-090000-task-0004-bookings — ADDED Consultar salas libres
EOF
}

patch_md() {
  local id="$1" slug="$2" title="$3" symptom="$4" cause="$5" fix="$6" check="$7"
  put ".docs/sdd/specs/20260925-080000-patch-$id-$slug/patch.md" <<EOF
---
id: 20260925-080000-patch-$id-$slug
task: $id
title: Patch — $title
type: patch
status: done
created: 2026-09-25
branch: feature/$id
commit: <hash>
---

# Patch $id — $title

## 1. Síntoma

$symptom

## 2. Causa raíz

$cause

## 3. Fix

- **Fichero(s)**: \`src/slots.js\`, \`tests/slots.test.js\`
- **Cambio**: $fix

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | $check | ✅ verificado por el agente: \`node --test\` 2/2 verde |

## 5. Tiempo (ligero)

- Real: 0,3h
EOF
  [ "${SECTION6:-0}" = 1 ] || return 0
  cat >> "$R/.docs/sdd/specs/20260925-080000-patch-$id-$slug/patch.md" <<'EOF'

## 6. Delta de capacidad *(si existe `.docs/sdd/capabilities/` y el fix cambia lo que dice una capacidad)*

### Capacidad: `<nombre>`

**MODIFIED — <título estable>**
- GIVEN <contexto>
- WHEN <acción>
- THEN <resultado actualizado>
EOF
}

# p1: el fix cambia lo que lista `libres`, y la capacidad dice otra cosa.
patch_maintenance() {
  g checkout -q -b feature/0014
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
  const open = ROOMS.filter((r) => !r.maintenance && !taken.includes(r.name)).map((r) => r.name);
  const closed = ROOMS.filter((r) => r.maintenance).map((r) => `${r.name} (en mantenimiento)`);
  return [...open, ...closed].join('\n');
}
EOF
  cat >> "$R/tests/slots.test.js" <<'EOF'

import { free } from '../src/slots.js';

test('libres deja las salas en mantenimiento aparte', () => {
  assert.strictEqual(free([{ room: 'Norte', slot: '10-12' }], '10-12'), 'Sur\nOeste (en mantenimiento)');
});
EOF
  commit "fix(0014): libres deja aparte las salas en mantenimiento" "Oeste salía como libre y soporte recibió una reserva en una sala cerrada."
  patch_md 0014 libres-mantenimiento "\`libres\` ofrece salas en mantenimiento" \
    "Soporte: \`salas libres 10-12\` ofreció Oeste, que está en mantenimiento, y un usuario la reservó." \
    "\`free\` solo miraba las reservas; no leía el campo \`maintenance\` de \`ROOMS\`." \
    "\`free\` excluye las salas en mantenimiento de la lista y las añade al final como \`<sala> (en mantenimiento)\`." \
    "\`salas libres 10-12\` con Norte reservada → \`Sur\` y \`Oeste (en mantenimiento)\`"
  commit "docs(0014): patch.md del fix de libres"
}

# p2: el fix devuelve el comportamiento a lo que la capacidad ya decía.
patch_limit() {
  g checkout -q -b feature/0013
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
  if (hours(slot) > 2) return 'Máximo 2 h por reserva';
  bookings.push({ room, slot });
  return `Reservada ${room} ${slot}`;
}

export function free(bookings, slot) {
  const taken = bookings.filter((b) => b.slot === slot).map((b) => b.room);
  return ROOMS.filter((r) => !taken.includes(r.name)).map((r) => r.name).join('\n');
}
EOF
  cat >> "$R/tests/slots.test.js" <<'EOF'

test('rechaza una reserva de más de 2 h', () => {
  assert.strictEqual(reserve([], 'Norte', '10-13'), 'Máximo 2 h por reserva');
});
EOF
  commit "fix(0013): reservar rechaza más de 2 h" "reserve no comprobaba la duración."
  patch_md 0013 reserva-maxima "\`reservar\` acepta reservas de más de 2 h" \
    "Soporte: \`salas reservar Norte 10-13\` guardó una reserva de 3 h." \
    "\`reserve\` no comprobaba la duración de la franja." \
    "\`reserve\` rechaza una franja de más de 2 h con \`Máximo 2 h por reserva\`." \
    "\`salas reservar Norte 10-13\` → \`Máximo 2 h por reserva\`, sin guardar"
  commit "docs(0013): patch.md del fix de reservar"
}
