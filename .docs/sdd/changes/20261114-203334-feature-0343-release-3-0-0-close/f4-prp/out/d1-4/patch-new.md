---
id: 20261116-141207-patch-0012-cancelar-ignora-dia
task: 0012
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancelar-ignora-dia
commit: pendiente
---

# Patch 0012 — cancelar ignora el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva `Norte lun` pasa a `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero solo filtra por `room` y `status === 'active'`. Cualquier reserva activa de la sala casa con cualquier día, y `cancelBooking` la cancela y responde con el día pedido, no con el de la reserva. `voidBooking` (`anular`) usa la misma función y tiene el mismo fallo. El patch 0007 arregló una comparación solo por hora, pero esta función nunca comparó el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige además `b.day === day`; `bookings` se exporta como costura de test (sembrar estado). Sin reserva ese día, `cancelar` y `anular` devuelven `sin reserva <sala> <día>`, texto existente.
- **Decisiones**: ninguna.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar` y la del lunes sigue activa | ✅ RED antes del fix (`cancelada Norte mar`, `anulada Norte mar`); tras el fix 7/7 |

Gate: `node --test && node scripts/lint.mjs` → 7/7 pass, lint sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre < 0,1 h (suite ~1 s; sin gate medido en el proyecto)
- Inicio: 2026-11-16T14:12Z
- Esfuerzo real: pendiente

### Revisión del patch (revisor sonnet, sin bloqueantes)

- Falta el caso positivo con día distinto — **arreglado**: test «cancelar un día cancela solo la de ese día».
- `seed()` duplica el literal inicial y `bookings` queda exportado y mutable — **rechazado**: es la costura mínima de test, nadie más lo importa y un `resetBookings()` sería código de producción nuevo fuera del patch.
- Los dos tests antiguos dependen del estado inicial — **rechazado**: no es de este patch y hoy es inocuo.
- Fila de `anular` explícita en la tabla — **rechazado**: la fila 1 ya cita `anulada Norte mar` y el test de `anular`.
- Finales de línea (autocrlf) — **comprobado**: `git diff --numstat` da 2/2 en `src/app.js` y 25/1 en el test.
