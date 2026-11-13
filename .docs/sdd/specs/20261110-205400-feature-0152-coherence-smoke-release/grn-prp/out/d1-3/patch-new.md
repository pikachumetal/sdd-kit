---
id: 20261111-163213-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — es lo que usa una persona desde la terminal: debe ver que `cancelar Norte mar` ya no toca la del lunes.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base (`develop`, dbc24b3), con la única reserva `Norte lun 10:00-12:00`:

- `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar` (debía ser `sin reserva Norte mar`).
- Después, `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`: la del lunes quedó cancelada.

Misma entrada con `anular` (`voidBooking`): comparte la función causante, así que anula la reserva de otro día.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo usa: busca la primera reserva activa de la sala, sea cual sea su día. `cancelBooking` y `voidBooking` la usan, así que cancelan (o anulan) la reserva del lunes y devuelven el texto con el día pedido. Parecido al síntoma que cierra la fila 0007 del roadmap («la cancelación borraba reservas de otro día con la misma hora»), pero en el código actual `findBooking` no compara ni hora ni día: no he podido comprobar qué cambió aquel patch. Determinista: no depende de interpretar requisitos, la respuesta correcta ya la fija el mensaje existente `sin reserva <sala> <día>`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

Gate: `node --test` · `node scripts/lint.mjs` → suite: corrió 5/5 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel-day.test.js` → `actual: 'cancelada Norte mar'`, `expected: 'sin reserva Norte mar'` | ✅ falla por la causa |
| 2 | Tras el fix, el mismo test: `cancelar Norte mar` y `anular Norte mar` → `sin reserva Norte mar`; `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 3 | Suite completa: `node --test` → 5 pass, 0 fail; copia RED comparada con `git diff --no-index`: sin cambios | ✅ |

Revisor (sonnet, effort medium):

- Baja, §2 citaba el patch 0007 como causa común sin poder comprobarse → **corregido**: §2 ya no afirma qué arregló.
- Baja, el test no cubre `anular Norte lun` en positivo → **rechazado**: `anular` y `cancelar` comparten `findBooking`, y el test ya cubre el negativo de `anular` (falla sin el fix). Añadirlo sería un segundo comportamiento en un patch de un test.

El test va en un fichero propio porque `test/cancel.test.js` comparte estado de módulo: su primer test ya cancela `Norte lun`.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin duración medida en el proyecto (`node --test && node scripts/lint.mjs`, suite ~1 s)
- Inicio: 2026-11-11T16:32Z
- Esfuerzo real: pendiente
