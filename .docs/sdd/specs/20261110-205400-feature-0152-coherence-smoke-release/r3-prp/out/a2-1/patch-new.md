---
id: 20261111-185930-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal y el resultado se ve en lo que responde el comando.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación ni la anulación (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

Reportado: «Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual (solo `Norte lun` reservada): `node src/app.js cancelar Norte mar` → `cancelada Norte mar`; después `cancelar Norte lun` → `sin reserva Norte lun`. Coincide con lo reportado. `anular` comparte el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js:10` recibe `day` y no lo usa: devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la usan, así que cancelar o anular un día sin reserva toca la reserva de otro día y responde con el día pedido. Evidencia: el cuerpo es `bookings.find((b) => b.room === room && b.status === 'active')`, sin `b.day === day`; la reproducción de arriba lo confirma.

El patch 0007 («La cancelación borraba reservas de otro día con la misma hora») trataba el mismo síntoma y figura como hecho, pero el código no compara el día y `test/cancel.test.js` no tiene ningún test de regresión para él.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Un día sin reserva activa da `sin reserva <sala> <día>` y no toca nada, en `cancelar` y en `anular`.
- **Decisiones**: ninguna sobre lo que el usuario ve: el texto `sin reserva <sala> <día>` ya existe en el código.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel-day.test.js test/void-day.test.js` → 2 fallan (`cancelada Norte mar` y `anulada Norte mar` en vez de `sin reserva Norte mar`) | ✅ falla por la causa esperada |
| 2 | Tras el fix: `node --test` → 6/6; `node scripts/lint.mjs` → «lint: sin hallazgos». Con solo `Norte lun` reservada, `cancelar Norte mar` da `sin reserva Norte mar` y `cancelar Norte lun` sigue dando `cancelada Norte lun`; igual con `anular` | ✅ |
| 3 | Revisión del fix (un revisor sonnet): causa raíz y fix correctos, sin otro sitio con el mismo defecto (`libres` no recibe día; la reserva semanal es un texto fijo) | ✅ sin hallazgos bloqueantes |

Hallazgos del revisor y respuesta:

- Dos aserciones por test, el segundo fallo queda tapado por el primero: rechazado. La segunda aserción es la que prueba que la reserva del lunes sigue activa, y separarlas obligaría a otro fichero porque `bookings` es estado del módulo.
- `patch.md` en `status: done` con la fila 3 pendiente: arreglado, la fila 3 ya está cerrada.
- «`scripts/` no existe»: rechazado, `scripts/lint.mjs` existe y corrió con «lint: sin hallazgos».
- Qué hacer con la fila 0007 del roadmap, que figura como hecha sin que el código compare el día: fuera del patch, queda para el dev-lead (sin tocar el roadmap aquí).

Gate: `node --test && node scripts/lint.mjs` → 6/6 y «lint: sin hallazgos».

## 5. Tiempo (ligero)

- Estimación: 0,4 h + 0,02 h del gate de cierre (~1 s; no hay cierre medido en el proyecto)
- Inicio: 2026-11-11T18:59Z
- Esfuerzo real: 0,05 h — reloj de la sesión 0,05 h desde 2026-11-11T18:58Z, sin 0 min de espera al dev-lead (1 espera)
