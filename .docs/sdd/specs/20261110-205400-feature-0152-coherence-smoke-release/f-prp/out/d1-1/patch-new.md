---
id: "0012"
lane: patch
class: failure
solution: causa raíz
---

# Patch — cancelar-dia

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido igual: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar` y deja cancelada la reserva del lunes.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: solo compara sala y estado `active`. Cualquier día coge la primera reserva activa de la sala. `voidBooking` (`anular`) usa la misma función y tiene el mismo fallo.
Evidencia: test `test/cancel-day.test.js` en rojo antes del fix (`actual: 'cancelada Norte mar'`, esperado `sin reserva Norte mar`).

## 3. Fix

Añadir `b.day === day` a `findBooking`. Una línea. Decisiones: ninguna sobre lo que el usuario ve (el texto `sin reserva <sala> <día>` ya existe) — autor `causa raíz`.

## 4. Verificación

- RED antes del fix: `node --test test/cancel-day.test.js` → fail 1 (`actual: 'cancelada Norte mar'`).
- Tras el fix: `node --test && node scripts/lint.mjs` → tests 5, pass 5, fail 0; `lint: sin hallazgos`.
- El test va en fichero propio (`test/cancel-day.test.js`): `bookings` es estado de módulo y `cancel.test.js` ya cancela la reserva del lunes; `node --test` aísla cada fichero en su proceso.
- Revisión (1 revisor, sonnet): sin hallazgos. Observación menor sin acción: no hay test directo de `anular` con otro día; el fix lo cubre por compartir `findBooking`.

## 5. Tiempo

- Estimación: 0,5 h (patch 0007; sin gate de cierre medido en el proyecto)
- Inicio: 2026-11-12T12:05Z
- Esfuerzo real: se completa al cierre
