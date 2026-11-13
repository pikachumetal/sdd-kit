---
id: 20261112-153009-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — es una herramienta de terminal que usa una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido en la base: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y después `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`. Coincide con lo reportado; `anular` tiene el mismo fallo (misma función).

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. `cancelBooking` y `voidBooking` dependen de ella, así que cancelan o anulan la primera reserva activa de la sala, sea de cualquier día. Las reservas ya guardan `day` (`src/app.js:3`). Es la misma clase de fallo que el patch 0007, que corrigió la comparación solo por hora en `freeRooms`. La deuda (`debt.md`) no cubre este fallo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`, `test/void.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ `node --test`: sin el fix 3 fallan (`actual: cancelada Norte mar`); con el fix 6/6 |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, y `anular Norte lun` → `anulada Norte lun` | ✅ idem (`test/void.test.js`) |

Revisión (un revisor): causa, fix y alcance confirmados. Hallazgo menor: los tests dependen del orden por el estado compartido de `bookings` (no exportado) — corregido con un comentario en `test/cancel.test.js`; reiniciar el estado queda fuera del patch.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin medida previa en el proyecto)
- Inicio: 2026-11-12T15:30Z
- Esfuerzo real: pendiente
