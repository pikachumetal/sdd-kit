---
id: 20261112-155209-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal y es quien reportó el fallo.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base (`develop`, a834b1f): `run('cancelar', ['Norte','mar'])` devuelve `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte','lun'])` devuelve `sin reserva Norte lun`: la reserva del lunes ya no estaba activa. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: su `find` compara solo `b.room === room && b.status === 'active'` (la reserva de datos lleva `day: 'lun'`). Con cualquier día, devuelve la primera reserva activa de la sala. `cancelBooking` la marca `cancelled` y responde con el `day` pedido, no con el de la reserva cancelada.

`voidBooking` llama a la misma `findBooking`, así que `anular Norte mar` tiene el mismo fallo. Es la misma familia que el patch 0007 (comparación incompleta), esta vez en el día. Sin fila de deuda que lo cubra (`debt.md`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`.
- **Cambio**: `findBooking` añade `b.day === day` a su condición.
- **Decisiones**: ninguna sobre lo que el usuario ve: el texto `sin reserva <sala> <día>` ya existe y es el que ya devuelve el comando sin reserva.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix (`node --test test/cancel.test.js`): `cancelar Norte mar` devolvía `cancelada Norte mar` y `cancelar Norte lun` después, `sin reserva Norte lun` (2 fallos) | ❌ → como se esperaba |
| 2 | tras el fix (`node --test`): 5/5; `node scripts/lint.mjs`: sin hallazgos. `cancelar` y `anular` de otro día dan `sin reserva Norte mar` y la del lunes sigue activa | ✅ |

Revisión (un revisor, sonnet): causa raíz, fix y llamadores correctos, sin hallazgos bloqueantes. Respuestas:

- Test dependiente del orden (baja): aceptado; el test va antes de «cancelar una reserva activa» y lo dice un comentario.
- Nombre que prometía más de lo que comprobaba (baja): arreglado; ahora dice que no toca la del lunes, que prueba el test siguiente (`cancelar Norte lun` → `cancelada`).
- `anular` solo por el lado negativo (baja): rechazado; `anular` positivo es otra conducta y el patch no la toca (fix mínimo).
- Lint no ejecutado por el revisor (muy baja): lo ejecuté yo, sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h (la de la pregunta del carril; sin gate de cierre medido en el proyecto)
- Inicio: 2026-11-12T15:52Z
- Esfuerzo real: pendiente
