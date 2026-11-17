---
id: 20261009-130511-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `.docs/sdd/capabilities/`).

## 1. Síntoma

Reportado: «Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido: coincide. `node src/app.js cancelar Norte mar` → `cancelada Norte mar`. Además `anular Norte mar` → `anulada Norte mar`, mismo defecto, no reportado.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero filtra solo por `room` y `status === 'active'`. Con una única reserva activa de Norte (lunes), cualquier día la encuentra. `cancelBooking` y `voidBooking` la usan, así que ambas cambian el estado de la reserva del lunes. Es el mismo tipo de fallo que el patch 0007 (comparación incompleta), con otra clave.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. El test va dentro de «cancelar una reserva activa» porque las reservas viven en memoria y ese test consume `Norte lun`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED real antes del fix: `cancelar Norte mar` devolvía `cancelada Norte mar` (test en `test/cancel.test.js`) | ✅ |
| 2 | `cancelar Norte mar` → `sin reserva Norte mar`; `cancelar Norte lun` sigue cancelando | ✅ |
| 3 | `anular Norte mar` → `sin reserva Norte mar`; `anular Norte lun` sigue anulando (a mano, CLI) | ✅ |
| 4 | Gate de cierre: `node --test && node scripts/lint.mjs` → 4/4, sin hallazgos | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-09T13:05Z
- Real: 0,3h (aprox.)
