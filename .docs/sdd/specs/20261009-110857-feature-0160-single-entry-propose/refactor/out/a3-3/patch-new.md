---
id: 20261009-132939-patch-0012-cancel-day
task: 0012
title: Patch — cancelar/anular ignoraba el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012
commit: pendiente
---

# Patch 0012 — cancelar/anular ignoraba el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y la reserva de Norte del lunes queda `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero solo filtra por `room` y `status === 'active'`. Con una reserva activa de Norte cualquier día, devuelve esa. Lo usan `cancelBooking` y `voidBooking`, así que `anular` tenía el mismo fallo (el reporte solo mencionaba `cancelar`). Mismo patrón que el patch 0007 (comparación incompleta), esta vez por día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día, ambos comandos devuelven `sin reserva <sala> <día>`, el mensaje que ya existía.
- **Decisiones**: ninguna; el mensaje y el comportamiento son los que ya tenía el código.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ (RED antes, verde después) |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ (RED antes, verde después) |
| 3 | Gate `node --test && node scripts/lint.mjs` | ✅ 6/6 tests, lint sin hallazgos |

Los dos tests van en ficheros separados porque `bookings` es estado de módulo y `node --test` aísla cada fichero en su proceso.

## 5. Tiempo (ligero)

- Inicio: 2026-10-09T13:29Z
- Real: 0,3h (aproximado)
