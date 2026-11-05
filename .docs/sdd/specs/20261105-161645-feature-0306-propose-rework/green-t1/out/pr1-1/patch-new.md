---
id: 20261105-165809-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done   # el cierre y la validación los hace sdd-archive
created: 2026-11-05
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — el cambio es visible en el comando `cancelar`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base: `cancelar Norte mar` → `cancelada Norte mar`; después `cancelar Norte lun` → `sin reserva Norte lun`. Coincide con lo reportado. `anular` tiene el mismo defecto (misma función).

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: solo compara `b.room === room && b.status === 'active'`, y devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la usan y devuelven el `day` que se pidió, no el de la reserva modificada. Por eso el martes sin reserva encuentra la del lunes, la cancela y lo anuncia con el día equivocado. La fila 0007 del roadmap («La cancelación borraba reservas de otro día con la misma hora») describe el mismo defecto; el código de la base seguía sin comparar el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`.
- **Decisiones**: ninguna sobre lo que el usuario ve: `sin reserva Norte mar` es el texto que ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` → `sin reserva Norte mar`, y `cancelar Norte lun` después → `cancelada Norte lun` (test/cancel-day.test.js) | ✅ falló antes (actual `cancelada Norte mar`), pasa ahora |
| 2 | Igual con `anular` (test/void-day.test.js) | ✅ falló antes (actual `anulada Norte mar`), pasa ahora |

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests pasan · lint: sin hallazgos

Revisión (sonnet, effort medium): sin hallazgos Críticos ni Importantes; causa raíz, fix mínimo y tests confirmados leyendo el código.
- Menor: `freeRooms` tampoco considera el día (`libres` filtra por franja, que no lleva día) — rechazado: otra función y otro comando, fuera de este patch; se avisa al usuario.
- Menor: la frase sobre el 0007 no se verificaba — corregida, ahora cita la fila del roadmap.
- Menor: `status: done` con `commit: pendiente` — anotado: lo cierra sdd-archive.

Validación: pendiente de `sdd-archive`.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 1 s del gate de cierre (`node --test && node scripts/lint.mjs`, medido hoy en 0,5 s)
- Inicio: 2026-11-05T16:58Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
