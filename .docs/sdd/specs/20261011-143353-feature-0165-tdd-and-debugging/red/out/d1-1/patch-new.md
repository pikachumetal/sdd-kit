---
id: 20261011-164541-patch-0012-cancelar-dia
task: "0012"
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: e92964a
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (no hay `.docs/sdd/capabilities/`).

## 1. Síntoma

Reportado: «si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes».

Medido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva `Norte lun 10:00-12:00` queda en `cancelled`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`, así que devuelve la reserva de cualquier día. `cancelBooking` la marca `cancelled` y responde con el día pedido, no con el de la reserva cancelada. `voidBooking` usa la misma función y tiene el mismo fallo (`anular Norte mar` anula la del lunes). Es la misma familia que el patch 0007 (comparación incompleta), en otra función.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Un único punto arregla `cancelar` y `anular`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar` y la del lunes sigue activa (test `cancel-day.test.js`, RED→GREEN) | ✅ |
| 2 | `anular Norte mar` igual (test `void-day.test.js`, RED→GREEN) | ✅ |

Validado: 2026-10-11 · «Sí, como patch.» · no detalló qué probó

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-11T16:45Z
- Real: 0,2h (aprox.)

Gate: `node --test && node scripts/lint.mjs` → 6/6 en verde, lint sin hallazgos (agente).
Los tests nuevos van en ficheros propios porque `bookings` es estado de módulo y cada fichero corre en su proceso.
