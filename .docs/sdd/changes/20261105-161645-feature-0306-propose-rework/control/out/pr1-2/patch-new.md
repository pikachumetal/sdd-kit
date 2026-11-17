---
id: 20261106-102220-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-06
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — hay que confirmar que cancelar un día sin reserva ya no toca la de otro día.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual: `run('cancelar', ['Norte','mar'])` devuelve `cancelada Norte mar`; después `libres 10:00-12:00` lista `Norte, Sur` y `cancelar Norte lun` devuelve `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: busca por sala y estado `active`. Devuelve la primera reserva activa de la sala, sea de cualquier día. Las reservas ya guardan `day` (`{ room, day, slot, status }`), así que el dato está disponible. `cancelBooking` y `voidBooking` comparten `findBooking`, por eso `anular` tiene el mismo fallo.

## 3. Fix

- **Fichero(s)**: `src/app.js`
- **Cambio**: `findBooking` compara también `b.day === day`.
- **Tests**: `test/cancel-day.test.js` y `test/void.test.js`, cada uno en su fichero para que el estado de `bookings` (de módulo) empiece limpio.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva ese día → `sin reserva Norte mar` y la del lunes sigue activa (`test/cancel-day.test.js`) | ✅ RED sin el fix, verde con él |
| 2 | `anular Norte mar` → `sin reserva Norte mar`; `anular Norte lun` → `anulada Norte lun` (`test/void.test.js`) | ✅ RED sin el fix, verde con él |

Gate: `node --test` → 6/6 · `node scripts/lint.mjs` → sin hallazgos

Revisión (sonnet, effort medium):
- Importante — el test nuevo de `cancel.test.js` dependía del orden: **arreglado**, movido a `test/cancel-day.test.js`.
- Menor — dos aserciones en `void.test.js`: **rechazado**, la segunda es la que prueba que la reserva del lunes seguía activa.
- Menor — `status`, `commit` y resultados pendientes: **arreglado** los resultados; `commit` lo escribe el cierre (`sdd-archive`).

## 5. Tiempo (ligero)

- Estimación: 0,5 h (esfuerzo real del patch 0007; sin gate de cierre medido en el proyecto)
- Inicio: 2026-11-06T10:22Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-11-06T10:20Z, sin 0 min de espera al dev-lead (1 espera)
