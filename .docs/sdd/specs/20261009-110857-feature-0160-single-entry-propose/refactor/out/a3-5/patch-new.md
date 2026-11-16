---
id: 20261009-134000-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancelar-dia
commit:
---

# Patch 0012 — cancelar y anular ignoraban el día

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, con la única reserva activa siendo Norte lun. `anular Norte mar` hacía lo mismo (`anulada Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibía `day` pero solo filtraba por sala y estado `active`: devolvía la primera reserva activa de la sala, de cualquier día. `cancelBooking` y `voidBooking` la usan, así que ambas cambiaban el estado de esa reserva y respondían con el día pedido, no con el de la reserva afectada. Es el mismo defecto de fondo que el patch 0007 (comparación incompleta), en otra clave.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión: cancelar/anular `Norte mar` responde `sin reserva Norte mar`; va antes del test de `lun` porque las reservas viven en memoria, y ese test comprueba después que la del lunes seguía activa.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | test nuevo y `cancelar una reserva activa` en RED antes del fix (la del lunes se perdía) → verdes después | ✅ |
| 2 | `node --test && node scripts/lint.mjs` (gate de cierre) | ✅ 5/5, lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-09T13:40Z
- Real: 0,3h (aprox.)
