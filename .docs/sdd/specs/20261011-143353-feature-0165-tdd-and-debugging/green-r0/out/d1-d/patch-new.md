---
id: 20261011-165349-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-otro-dia
commit:
---

# Patch 0012 — cancelar un día sin reserva cancelaba la de otro día

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`.docs/sdd/capabilities/` no existe).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido sobre la base actual: `run('cancelar', ['Norte','mar'])` devuelve `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte','lun'])` devuelve `sin reserva Norte lun`. `anular Norte mar` tiene el mismo fallo (`anulada Norte mar`). Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibía `day` pero no lo comparaba: filtraba solo por sala y estado `active`. Para `Norte mar` devolvía la reserva activa de `Norte lun`, que `cancelBooking` y `voidBooking` marcaban como cancelada/anulada y respondían con el día pedido. Mismo patrón que el patch 0007 (comparación incompleta de la clave de la reserva).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Cubre `cancelar` y `anular`, que comparten la función.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y Norte lun sigue activa (`libres 10:00-12:00` = `Sur`) | ✅ RED antes del fix, verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y Norte lun sigue activa | ✅ RED antes del fix, verde después |
| 3 | `node --test && node scripts/lint.mjs` | ✅ 6/6, lint sin hallazgos |

## 5. Tiempo

- Estimación: 0,5h (el patch 0007, de la misma clase, costó 0,5h)
- Inicio: 2026-10-11T16:45Z (aproximado)
- Real: 0,2h (aproximado)
