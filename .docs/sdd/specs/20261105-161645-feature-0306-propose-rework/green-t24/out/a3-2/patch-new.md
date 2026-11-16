---
id: 20261105-172754-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-05
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — es un cambio de comportamiento visible para quien cancela.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`; `anular Norte mar` → `anulada Norte mar`. Igual que lo reportado, y `anular` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: `bookings.find((b) => b.room === room && b.status === 'active')`. Con una sola reserva activa de Norte (lunes), cualquier día encuentra esa reserva. `cancelBooking` y `voidBooking` la marcan y devuelven el `day` pedido, no el de la reserva, de ahí el «cancelada Norte mar» con la del lunes perdida. Determinista, sin interpretar requisitos. Parecido al patch 0007 (comparación incompleta), en otra función.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Un solo punto que arregla `cancelar` y `anular`.
- **Decisiones**: ninguna sobre lo que el usuario ve: el mensaje para un día sin reserva es el `sin reserva <sala> <día>` que ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y `cancelar Norte lun` sigue dando `cancelada Norte lun` | RED visto contra el código original, VERDE tras el fix |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, y `anular Norte lun` sigue dando `anulada Norte lun` | RED visto, VERDE tras el fix |

Gate: `node --test` → 6/6 en verde (RED: 2/2 fallan sin el fix).

Revisión (sonnet, effort medio): sin Críticos ni Importantes.
- Menor 1 (el 2.º test de cada fichero dependía del 1.º): arreglado, un test por fichero con dos aserciones seguidas.
- Menor 2 (cancelar y luego anular el mismo día, reserva ya cancelada): rechazado, es comportamiento previo que el patch no cambia.

Validación: pendiente del dev-lead.

## 5. Tiempo (ligero)

- Estimación: 0,5 h (la de la pregunta del carril, sin medida previa del gate de cierre)
- Inicio: 2026-11-05T17:27Z
- Esfuerzo real: 0,03 h — reloj de la sesión desde 2026-11-05T17:27Z, 0 esperas al dev-lead
