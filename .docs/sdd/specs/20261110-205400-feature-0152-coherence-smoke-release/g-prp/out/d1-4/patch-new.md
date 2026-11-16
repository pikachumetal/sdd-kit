---
id: 20261112-153237-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar` con solo `Norte lun` reservada, que queda cancelada. Coincide con lo reportado. `anular Norte mar` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` y no lo usa: devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` confían en ese resultado, cambian su estado y devuelven el texto con el `day` pedido, de ahí el «cancelada Norte mar». Es el mismo defecto que el patch 0007 corrigió para la hora, ahora con el día. Sin deuda abierta que lo cubra (`debt.md`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js` (dos ficheros porque las reservas viven en memoria y se comparten por proceso: cada comando necesita la reserva del lunes intacta)
- **Cambio**: `findBooking` exige además `b.day === day`. Sin reserva ese día, ambos comandos devuelven `sin reserva <sala> <día>` (texto que ya existía) y no tocan ninguna otra.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` con solo Norte lun reservada: antes `cancelada Norte mar`, ahora `sin reserva Norte mar`, y `cancelar Norte lun` sigue dando `cancelada Norte lun` | ✅ RED visto antes del fix |
| 2 | lo mismo con `anular` (`anulada Norte lun` tras `sin reserva Norte mar`) | ✅ RED visto antes del fix |

Gate: `node --test && node scripts/lint.mjs` → 6/6 en verde, lint sin hallazgos.

Revisor (sonnet): `patch.md` listaba un fichero de test que no cambia → corregido; §4 no cubría `anular` → corregido. Hueco señalado (volver a cancelar la misma reserva, sala sin reservas): rechazado, el fix no cambia esos casos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h (referencia: patch 0007; sin gate de cierre medido en el proyecto)
- Inicio: 2026-11-12T15:32Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
