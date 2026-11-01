---
id: 20261101-121647-patch-0015-cancel-day
task: 0015
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-01
branch: feature/0015-cancel-day
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoran el día

Validación: dev-lead — es un fallo de comportamiento visible para quien reserva.

## Capacidades

- Ninguna, porque no hay `capabilities/` y el fix devuelve `cancelar` y `anular` a lo que ya dicen sus mensajes (`cancelada Norte lun`, `sin reserva Sur mar`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de Norte del lunes queda `cancelled`. Medido igual que lo reportado; `anular Norte mar` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:12`) recibe `day` pero su `find` solo compara `room` y `status === 'active'`. Devuelve la primera reserva activa de la sala, de cualquier día. `cancelBooking` y `voidBooking` la usan y escriben `day` en su mensaje sin haberlo comprobado, de ahí el `cancelada Norte mar`. Los tests existentes no lo ven: `Sur mar` no tiene ninguna reserva en ningún día. Patch 0007 arregló lo mismo para la hora, pero en otra función.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo)
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla `cancelar` y `anular`, que comparten la función.
- **Decisiones**:
  - Los tests van en fichero propio con `import` de módulo fresco por test, porque `bookings` es estado del módulo y `cancel.test.js` ya cancela la reserva del lunes — sin el dev-lead (no cambia lo que el usuario ve).

## 4. Verificación

Gate: `node --test` → 6/6 (4 previos + 2 nuevos)

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` devolvía `cancelada Norte mar`; `anular Norte mar`, `anulada Norte mar` | ✅ fallaban por esa causa |
| 2 | `node src/app.js cancelar Norte mar` → `sin reserva Norte mar`; la del lunes sigue activa | ✅ |
| 3 | `node --test` entero | ✅ 6/6 |
