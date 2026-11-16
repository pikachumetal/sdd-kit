---
id: 20261011-170102-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar una reserva no mira el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit:
---

# Patch 0012 — cancelar una reserva no mira el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido sobre la base actual: con la reserva `Norte lun`, `cancelar Norte mar` devuelve `cancelada Norte mar` y deja la del lunes en `cancelled`; el `cancelar Norte lun` posterior ya dice `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:11-13`) recibe `day` pero el predicado del `find` solo compara `b.room === room && b.status === 'active'`: el día no se mira nunca. Con una sola reserva activa en la sala, cualquier día pide esa reserva; `cancelBooking` la marca `cancelled` y devuelve el mensaje con el día pedido, de ahí «cancelada Norte mar» sobre la reserva del lunes. `voidBooking` (`anular`) usa la misma función, así que tiene el mismo fallo. La reserva sí guarda su día (`bookings[].day`), no hace falta tocar los datos.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla a la vez `cancelar` y `anular`, que comparten la función.
- **Test**: va en un fichero propio porque las reservas viven en memoria y el módulo comparte estado entre tests de un mismo fichero; en `cancel.test.js` el primer test ya consume `Norte lun` y el RED fallaba por orden, no por el bug.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` con solo `Norte lun` reservado → `sin reserva Norte mar`; la del lunes sigue activa | ✅ RED visto antes del fix (`cancelada Norte mar`), verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ |
| 3 | Gate `node --test && node scripts/lint.mjs` | ✅ 5/5 · lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,25h
- Inicio: 2026-10-11T17:01Z
- Real: 0,25h (aproximado)
