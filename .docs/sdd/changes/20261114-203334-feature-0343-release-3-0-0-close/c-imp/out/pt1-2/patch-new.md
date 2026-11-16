---
id: 20261115-181354-patch-0015-cancel-day
task: 0015
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0015-cancel-day
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoran el día

Validación: dev-lead — es la salida de una CLI que usa una persona; la petición no autoriza validar al agente.

## Capacidades

- Ninguna, porque el fix devuelve `cancelar` y `anular` a lo que ya dice su salida (`sin reserva <sala> <día>` cuando no hay reserva ese día) y `sdd capability index` no lista capacidades.

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `cancelar Norte mar` → `cancelada Norte mar`, y después `cancelar Norte lun` → `sin reserva Norte lun`. `anular` hace lo mismo (`anulada Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` de `src/app.js` recibe `day` pero no lo usa: busca `b.room === room && b.status === 'active'`. Devuelve la primera reserva activa de la sala sea del día que sea, y `cancelBooking` la marca como cancelada con el mensaje del día pedido. `voidBooking` llama a la misma función, por eso `anular` falla igual. La hipótesis de quien reporta (cancelar el martes toca el lunes) queda confirmada en el código; `git log -S findBooking` la sitúa en el commit base, no en un cambio reciente. La deuda abierta (formato de franja) no la cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

Gate: `node --test` → 8/8 en verde (antes del fix, los 4 tests nuevos fallaban y los 4 previos pasaban).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` | RED: 2 fallos con el código previo; ver Gate |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y `anular Norte lun` → `anulada Norte lun` | RED: 2 fallos con el código previo; ver Gate |

Los RED se escribieron antes del fix, en ficheros separados porque el estado de `bookings` es global al módulo y `anular` enmascaraba a `cancelar`.

Revisión del patch (un revisor, sonnet): sin hallazgos; confirma causa raíz, fix mínimo y que los 4 tests nuevos fallan con el código anterior.
