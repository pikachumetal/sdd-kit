---
id: 20261011-164830-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`.docs/sdd/capabilities/` no existe).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar` y la reserva de Norte `lun` queda `cancelled`; después `run('cancelar', ['Norte', 'lun'])` dice `sin reserva Norte lun`. Igual con `anular` (`anulada Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero solo filtra por `room` y `status === 'active'`; el `day` no se lee. Cada reserva ya guarda su `day` (`{ room: 'Norte', day: 'lun', … }`), así que con cualquier día pedido se devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` comparten esa función: el defecto es único.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; `cancelar Norte lun` → `cancelada Norte lun` | ✅ RED antes del fix, verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar`; `anular Norte lun` → `anulada Norte lun` | ✅ RED antes del fix, verde después |
| 3 | Gate de cierre `node --test && node scripts/lint.mjs` | ✅ 6/6 tests, lint sin hallazgos |

## 5. Tiempo

- Estimación: 0,5h (escrita al abrir el `patch.md`, ya con la causa raíz medida)
- Inicio: 2026-10-11T16:40Z (aproximado)
- Real: 0,2h (aproximado)
