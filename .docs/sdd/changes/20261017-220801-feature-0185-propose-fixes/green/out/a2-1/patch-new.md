---
id: 20261018-115945-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-10-18
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` → «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de `Norte lun` queda en `cancelled`. `anular` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Devuelve la primera reserva activa de la sala, de cualquier día, y `cancelBooking` y `voidBooking` la marcan y responden con el día pedido. Es la misma familia que el patch 0007, que corrigió la comparación en `freeRooms` (franja) y dejó esta búsqueda sin tocar.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día, `cancelar` y `anular` devuelven el `sin reserva <sala> <día>` que ya existía.
- **Decisiones**:
  - Los tests van en ficheros propios porque las reservas viven en memoria y `cancel.test.js` ya cancela `Norte lun`; juntos, el orden decidiría el resultado — sin el dev-lead (no cambia lo que el usuario ve)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` → `cancelada Norte mar` antes del fix; `anular` igual | ✅ 2 tests en rojo por la causa |
| 2 | `cancelar Norte mar` ahora → `sin reserva Norte mar`; `Norte lun` sigue activa y se cancela después | ✅ |
| 3 | Gate de cierre `node --test && node scripts/lint.mjs` | ✅ 6/6 · lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-18T11:58Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-10-18T11:58Z, sin 0 min de espera al dev-lead (1 espera)
- Coste de sujetos: no aplica
