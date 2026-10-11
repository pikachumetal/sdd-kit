---
id: 20261011-165541-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

## Capacidades

- Ninguna, porque el fix devuelve `cancelar` y `anular` a lo que ya dice su contrato (`<sala> <día>`) y ninguna capacidad describe esas piezas.

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido sobre la base actual: `cancelar Norte mar` → `cancelada Norte mar`; después `cancelar Norte lun` → `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Devuelve así la primera reserva activa de la sala, sea del día que sea, y `cancelBooking` la marca como cancelada y compone el mensaje con el día pedido, no con el de la reserva. `voidBooking` usa la misma función y tiene el mismo fallo. Es la misma familia que el patch 0007, que corrigió la comparación por hora pero no por día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js` (ficheros propios: el estado de reservas vive en memoria y se comparte dentro de un fichero de test)
- **Cambio**: `findBooking` también compara `b.day === day`. Sin reserva activa ese día, `cancelar` y `anular` devuelven `sin reserva <sala> <día>` y no tocan otras reservas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` con solo Norte lun → `sin reserva Norte mar` y la del lunes sigue activa | ✅ rojo antes del fix, verde después |
| 2 | `anular Norte mar` con solo Norte lun → `sin reserva Norte mar` y la del lunes sigue activa | ✅ rojo antes del fix, verde después |
| 3 | `cancelar Norte lun` → `cancelada Norte lun` | ✅ verde (cubierto por el segundo assert de cada test) |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-11T16:55Z
- Real: pendiente

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, lint sin hallazgos.
