---
id: 20261112-165433-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancelaba la de otro día

Validación: dev-lead — es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque el fix devuelve `cancelar` y `anular` a lo que ya dicen los literales de `sin reserva <sala> <día>`; no existe `.docs/sdd/capabilities/` que describa esas piezas.

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido en la base: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`; la reserva `Norte lun` queda en `cancelled`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Con una sola reserva activa en la sala, devuelve la de otro día; `cancelBooking` la marca `cancelled` y responde con el `day` pedido, de ahí el mensaje engañoso. `voidBooking` comparte el helper y falla igual (`anular Norte mar` anula la del lunes). Evidencia: los dos tests nuevos en rojo sin el fix (`cancelada Norte mar` y `anulada Norte mar`). La deuda (`debt.md`) no cubre este fallo. El patch 0007 arregló la comparación por franja en `freeRooms`, no esta.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

Gate: `node --test` → 6/6 en verde (antes del fix: 2 rojos, 4 verdes).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` | ✅ rojo sin el fix (`cancelada Norte mar`), verde con él |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y `anular Norte lun` → `anulada Norte lun` | ✅ rojo sin el fix (`anulada Norte mar`), verde con él |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,55 h del gate de cierre (estimado; el último medido es el patch 0007 con 0,5 h, sin gate medido)
- Inicio: 2026-11-12T16:54Z
- Esfuerzo real: pendiente

### Revisión del patch

- Hallazgo bajo: §4 caso 2 daba el resultado rojo equivocado (`sin reserva Norte lun`); sin el fix, `anular Norte mar` devuelve `anulada Norte mar` — corregido.
