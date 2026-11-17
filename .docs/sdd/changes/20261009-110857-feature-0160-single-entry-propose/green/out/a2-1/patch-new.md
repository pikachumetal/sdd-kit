---
id: 20261009-130306-patch-0012-cancelar-por-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancelar-por-dia
commit:
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de Norte del lunes queda `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero solo compara `room` y `status`; nunca compara `b.day`. Devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la usan, así que `anular` tiene el mismo fallo. El test «sin reserva» pasaba solo porque usaba `Sur`, que no tiene reservas. Relacionado con el patch 0007 (misma familia de fallo, «reservas de otro día»), que no arregló esta comparación.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Test de regresión: `cancelar Norte mar` dice `sin reserva Norte mar` y la reserva del lunes sigue activa.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; `cancelar Norte lun` → `cancelada Norte lun` | ✅ (agente) |
| 2 | `node --test` entero | ✅ 5/5 (agente) |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-09T13:03Z
- Real: 0,2h (aprox.)
