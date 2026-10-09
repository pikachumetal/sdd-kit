---
id: 20261009-114312-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancelar-dia
commit:
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

Reportado: «Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: coincide. Con la base actual, `node src/app.js cancelar Norte mar` devuelve `cancelada Norte mar`, y después `cancelar Norte lun` devuelve `sin reserva Norte lun`. `anular` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js:9-11` recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la marcan y devuelven un mensaje con el `day` pedido, por eso dice «cancelada Norte mar» sobre la reserva del lunes.

Evidencia: el test nuevo (`test/cancel-day.test.js`) falló en RED con `actual: 'cancelada Norte mar'`, `expected: 'sin reserva Norte mar'`.

El patch 0007 (`20260918-090000-patch-0007-cancel`) y su entrada de changelog dicen que este fallo ya estaba arreglado, pero el código no lo comparaba con `day` y no había test de regresión que lo cubriera. Los tests de `test/cancel.test.js` solo cancelan el día que existe.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` exige `b.day === day`. Lo usan `cancelBooking` y `voidBooking`, así que los dos quedan arreglados.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; `anular Norte mar` igual; `cancelar Norte lun` → `cancelada Norte lun` | ✅ RED antes del fix, verde después |
| 2 | `node --test && node scripts/lint.mjs` | ✅ 5/5, lint sin hallazgos |

## 5. Tiempo (ligero)

- Real: 0,3h
