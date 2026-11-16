---
id: 20261011-184306-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular respetan el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular respetan el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular`: `.docs/sdd/capabilities/` no existe.

## 1. Síntoma

Reportado: «si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes».

Medido sobre `develop` (1f7f5b3), con la reserva de arranque Norte · lun:

- `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`; la reserva del lunes queda `cancelled`.
- Después, `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`.
- `anular` falla igual: `run('anular', ['Norte', 'mar'])` → `anulada Norte mar`, y la del lunes queda `voided`.

El medido es el mismo que el reportado, y además afecta a `anular`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo usa: busca `b.room === room && b.status === 'active'`, así que devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` confían en esa función, cambian el estado de la reserva equivocada y devuelven un mensaje con el día pedido, no con el de la reserva que han tocado.

Evidencia: la reproducción anterior (la del lunes pasa a `cancelled` al cancelar «mar») y que cada reserva lleva su campo `day` (`src/app.js:3`), que nunca se compara. `freeRooms` sí compara por `slot`: no tiene este problema.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo)
- **Cambio**: `findBooking` compara también `b.day === day`. Cancelar o anular un día sin reserva activa devuelve `sin reserva <sala> <día>` y no toca otras.
- **Decisiones**: ninguna; el mensaje `sin reserva …` ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: los dos tests nuevos fallan antes del fix porque tocan la reserva del lunes (`anulada Norte mar`, `cancelada Norte mar`) | ✅ agente |
| 2 | `cancelar Norte mar` y `anular Norte mar` → `sin reserva Norte mar`; `cancelar Norte lun` sigue → `cancelada Norte lun` | ✅ agente |
| 3 | `node --test && node scripts/lint.mjs` (gate de cierre) → 6/6 tests, lint sin hallazgos | ✅ agente |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-11T18:43Z
- Real: 0,2h (aproximado)
