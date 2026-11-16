---
id: 20261115-183842-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual (`develop`, 8429557): `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte', 'lun'])` devuelve `sin reserva Norte lun`: la reserva del lunes ya estaba cancelada. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: el `find` compara solo `b.room === room && b.status === 'active'`. Con una sola reserva activa en la sala (Norte, lunes), cualquier día pedido la encuentra. `cancelBooking` la marca `cancelled` y responde con el día pedido, no con el de la reserva, por eso el mensaje dice «mar».

`voidBooking` (`anular`) usa la misma función, así que tiene el mismo fallo: la causa es compartida y el fix en `findBooking` cubre los dos comandos.

Evidencia: lectura de `src/app.js` (líneas de `findBooking`) y la reproducción del §1. Las reservas llevan el campo `day` (`'lun'`), así que el dato para comparar existe.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`, `test/void.test.js` (nuevo)
- **Cambio**: `findBooking` también compara `b.day === day`.
- **Decisiones**: ninguna sobre lo que el usuario ve: el mensaje `sin reserva <sala> <día>` ya existe y es el que devuelve la rama «no hay reserva».

## 4. Verificación

RED antes del fix (`node --test`): 3 fallos por la causa del §2.

- `actual: 'cancelada Norte mar'`, `expected: 'sin reserva Norte mar'`.
- `actual: 'sin reserva Norte lun'`, `expected: 'cancelada Norte lun'` (la del lunes ya perdida).
- `actual: 'anulada Norte mar'`, `expected: 'sin reserva Norte mar'`.

Los tests no cambiaron entre el RED y el GREEN (comparados con una copia guardada fuera del repo).

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, `lint: sin hallazgos`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar` y la del lunes sigue activa (lo comprueba el test siguiente, `cancelar una reserva activa`) | ✅ |
| 2 | `anular Norte mar` sin reserva el martes → `sin reserva Norte mar`, y `anular Norte lun` → `anulada Norte lun` | ✅ |
| 3 | `cancelar Norte lun` sigue cancelando la del lunes | ✅ |
| 4 | `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` | ✅ |

Revisión (un revisor sonnet, sin Críticos ni Importantes), tres Menores:

- La prueba de cancelar depende del orden de `cancel.test.js` (estado en memoria): aceptada; el test lleva un comentario que lo dice, y meter ahí la aserción del lunes rompería el test siguiente.
- `test/void.test.js` faltaba en §3: corregido.
- Dice que `operations.md` y el patch 0007 no existen: rechazado; ambos existen (`.docs/sdd/steering/operations.md`, `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`).
- `status: done` con `commit` pendiente: se completa en el commit de cierre, como pide la plantilla.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre (~1 s según `operations.md`; el patch 0007 no registra el suyo)
- Inicio: 2026-11-15T18:38Z
- Esfuerzo real: pendiente
