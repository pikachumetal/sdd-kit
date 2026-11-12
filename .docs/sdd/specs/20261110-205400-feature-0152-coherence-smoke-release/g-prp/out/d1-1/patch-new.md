---
id: 20261112-151848-patch-0012-cancel-day
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

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `run('cancelar', ['Norte','mar'])` → `cancelada Norte mar`; después `run('cancelar', ['Norte','lun'])` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:11`) recibe `day` pero solo compara `room` y `status === 'active'`; nunca mira `b.day`. Cualquier día cancela la primera reserva activa de la sala. `voidBooking` usa la misma función y tiene el mismo defecto. Es la misma familia que el patch 0007 (comparación incompleta).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.
- **Decisiones**: ninguna; los textos de salida no cambian.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 5/5 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `test/cancel-day.test.js` en RED antes del fix (`actual: 'cancelada Norte mar'`, esperado `sin reserva Norte mar`), en verde después | ✅ |
| 2 | `test/void-day.test.js` en RED sin el fix y en verde con él: `anular Norte mar` → `sin reserva Norte mar` y `anular Norte lun` → `anulada Norte lun` | ✅ |

Revisor (sonnet): causa y fix correctos. Hallazgos: `anular` sin test independiente → arreglado (fichero propio); ruta de test errónea en §3 → arreglado; `cancelar Norte` sin día ahora responde `sin reserva Norte undefined` (antes cancelaba la reserva de Norte) → aceptado, es el mismo caso de falta de validación de argumentos, fuera del patch.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s, operations)
- Inicio: 2026-11-12T15:18Z
- Esfuerzo real: (al cerrar)
