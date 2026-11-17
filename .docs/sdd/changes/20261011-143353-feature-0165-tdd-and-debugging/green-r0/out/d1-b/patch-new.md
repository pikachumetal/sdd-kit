---
id: 20261011-164543-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar otro día no toca la reserva del lunes
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar otro día no toca la reserva del lunes

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación: el proyecto no tiene `.docs/sdd/capabilities/`.

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido sobre `develop`: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y el `cancelar Norte lun` siguiente responde `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Con una sola reserva activa en la sala, cualquier día pedido encuentra la del lunes, la pasa a `cancelled` y el mensaje repite el día que se pidió, no el de la reserva. `bookings` sí guarda `day` en cada reserva, así que la comparación faltaba, no el dato. `voidBooking` (`anular`) usa la misma función y tiene el mismo fallo.

Es el mismo síntoma que el patch 0007, que arregló la comparación solo por hora (`freeRooms` compara franja; `findBooking` seguía sin mirar el día).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Arregla `cancelar` y `anular` a la vez, porque comparten la función.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y la reserva del lunes sigue activa (el test siguiente la cancela con éxito) | ✅ RED antes del fix, verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ |
| 3 | `node --test` 5/5 y `node scripts/lint.mjs` sin hallazgos | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5h (la del patch 0007, el mismo fallo en la función vecina)
- Inicio: 2026-10-11T16:45Z
- Real: 0,1h (aprox.)
