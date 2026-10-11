---
id: 20261011-165846-patch-0012-cancel-day
task: 0012
title: Patch — cancelar/anular ignoraba el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar/anular ignoraba el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `cancelar Norte mar` → `cancelada Norte mar`, y después `cancelar Norte lun` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero solo filtra por `room` y `status === 'active'`: devuelve la primera reserva activa de la sala sea del día que sea. `cancelBooking` marca esa reserva como cancelada y responde con el `day` pedido, de ahí el mensaje engañoso. `voidBooking` usa la misma función y tiene el mismo fallo (`anular Norte mar` anula la del lunes). Es la misma familia que el patch 0007 (comparación incompleta), esta vez en el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; `anular Norte mar` → `sin reserva Norte mar`; la del lunes sigue activa | ✅ test en RED antes del fix |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-11T16:58Z
- Real: 0,3h
