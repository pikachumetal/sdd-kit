---
id: 20261116-104136-patch-0012-cancel-day
task: 0012
title: Patch — cancelar un día sin reserva cancela la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancela la de otro día

Validación: dev-lead — es lo que la persona usa desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`, y la reserva activa de Norte el lunes queda cancelada.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo compara: filtra solo por `room` y `status === 'active'`. Con una reserva activa de Norte (lunes), cualquier día pedido para Norte la encuentra, y `cancelBooking` la marca `cancelled` y responde con el día pedido. El mismo defecto afecta a `voidBooking` (`anular`), que usa la misma función. Es el mismo tipo de fallo del patch 0007 (comparación incompleta). Ninguna fila de `debt.md` lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` | ✅ RED visto antes (`cancelada Norte mar`), verde tras el fix |

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

El test va en un fichero propio porque `cancel.test.js` comparte el estado en memoria entre tests: ahí la reserva del lunes ya está cancelada cuando llegaría el nuevo.

Revisión (un revisor, sonnet): causa raíz, fix y test confirmados.

- Hallazgo menor: cita del patch 0007 no verificable — rechazado: existe en `.docs/sdd/specs/20260918-090000-patch-0007-cancel/` y en la fila 0007 de `ROADMAP.md`.
- Hallazgo menor: `anular` sin test propio — rechazado: un patch lleva el test de su síntoma; `anular` comparte `findBooking` y queda arreglado por construcción, sin test propio (dicho aquí para que no parezca verificado).
- Lint: lo corrí yo (`node scripts/lint.mjs`, sin hallazgos).

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre ~1 s (sin medir en ningún patch anterior)
- Inicio: 2026-11-16T10:30Z
- Esfuerzo real: 0,3 h, aproximado con las marcas de los commits
