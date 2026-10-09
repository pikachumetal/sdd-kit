---
id: 20261009-113947-patch-0012-cancelar-ignora-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancelar-ignora-dia
commit: pendiente   # el hash se escribe en el commit de cierre
---

# Patch 0012 — cancelar y anular ignoran el día

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido sobre `develop` (f734bb4): `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de Norte lun queda en `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js:9` recibe `day` pero filtra solo por `room` y `status === 'active'`. Con una sola reserva activa en la sala, cualquier día pedido la encuentra. `cancelBooking` la marca `cancelled` y devuelve el mensaje con el día que se pidió, no con el de la reserva afectada, de ahí el «cancelada Norte mar».

`voidBooking` usa el mismo `findBooking`: `anular Norte mar` tenía el mismo fallo. Lo arregla el mismo cambio.

El patch 0007 (2026-09-18) dijo arreglar «la cancelación borraba reservas de otro día con la misma hora», pero su fix no está en el código actual: `findBooking` sigue sin comparar el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` también exige `b.day === day`. Test de regresión que cancela y anula Norte mar y espera `sin reserva Norte mar`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; después `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ |
| 3 | Test nuevo en RED antes del fix (`cancelada Norte mar`) y en verde después | ✅ |
| 4 | Gate de cierre: `node --test && node scripts/lint.mjs` (5/5, sin hallazgos) | ✅ |

## 5. Tiempo (ligero)

- Real: 0,3h
