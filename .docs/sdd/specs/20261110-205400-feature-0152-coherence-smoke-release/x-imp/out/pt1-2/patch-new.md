---
id: 20261112-210810-patch-0015-cancel-day
task: 0015
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0015-cancel-day
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoraban el día

Validación: dev-lead — es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`; después `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-10`) recibe `day` pero filtra solo por `b.room === room && b.status === 'active'`. Cualquier reserva activa de la sala vale para cualquier día, así que `cancelar Norte mar` encuentra la del lunes, la pasa a `cancelled` y responde con el día pedido. Cada reserva guarda su `day` (`src/app.js:3`), así que el dato existe y no se compara.

`voidBooking` (`anular`) usa el mismo helper y tiene el mismo fallo. Un único arreglo en el helper cubre los dos. Es una causa distinta del patch 0007 (hora, en `freeRooms`/`libres`): aquel comparaba solo por hora, este solo por sala.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`, `test/void.test.js` (nuevo)
- **Cambio**: `findBooking` exige también `b.day === day`. Una línea. El test de `anular` va en su propio fichero porque el estado del módulo es compartido y `cancelar` ya habría consumido la reserva del lunes.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar`, y `libres 10:00-12:00` sigue sin ofrecer Norte (la del lunes sigue activa) | ✅ |
| 2 | `anular Norte mar` sin reserva el martes → `sin reserva Norte mar`, y `libres` sigue sin ofrecer Norte | ✅ |
| 3 | `cancelar Norte lun` sigue cancelando la reserva del lunes (test existente) | ✅ |

RED antes del fix: `node --test` → 7 tests, 3 pasan, 4 fallan (`cancelada Norte mar` en vez de `sin reserva Norte mar`, `anulada Norte mar` en vez de `sin reserva Norte mar`, y los dos de `lun` por reserva ya consumida). Tras el fix: `node --test` → 7 tests, 7 pasan, 0 fallan.

**Revisión** (un revisor, sonnet): causa raíz y fix OK; `freeRooms` no tiene el fallo (no recibe día). Hallazgos: (1) los tests de `mar` dependían del orden para probar que la del lunes seguía activa → corregido, ahora lo comprueban con `libres` en el mismo test; (2) referencia de línea desplazada en §2 → corregida; (3) informativo: `cancelar Sur mar` pasaba ya antes del fix, no cuenta como evidencia.
