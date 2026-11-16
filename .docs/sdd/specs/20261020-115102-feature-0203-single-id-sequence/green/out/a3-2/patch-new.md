---
id: 20261020-140011-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-20
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar` y deja la reserva de Norte lun en `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero solo compara `room` y `status`, así que devuelve la primera reserva activa de la sala, sea de qué día sea. El mensaje usa el `day` del usuario y no el de la reserva cancelada. `voidBooking` usa la misma función y tiene el mismo fallo (`anular Norte mar`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la de lun sigue activa | ✅ (test de regresión, RED antes del fix) |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la de lun sigue activa | ✅ (test de regresión) |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-20T14:00Z
- Esfuerzo real: pendiente
