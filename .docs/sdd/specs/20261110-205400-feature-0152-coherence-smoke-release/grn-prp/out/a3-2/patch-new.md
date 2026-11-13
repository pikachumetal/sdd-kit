---
id: 20261111-162924-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancelaba la de otro día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y después `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:11`) recibe `day` pero no lo compara: solo filtra por sala y estado `active`. Con una sola reserva activa de Norte (lunes), cualquier día pedido la encuentra. `cancelBooking` y `voidBooking` comparten la función, así que `anular` falla igual. Evidencia: la reproducción del síntoma y la lectura de `findBooking`, donde `b.day` nunca aparece.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Test de regresión en fichero propio, porque el estado de las reservas vive en memoria del módulo y no debe depender del orden de `cancel.test.js`.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y después `cancelar Norte lun` → `cancelada Norte lun` | ✅ RED antes del fix (`actual: 'cancelada Norte mar'`), verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y después `anular Norte lun` → `anulada Norte lun` | ✅ RED antes del fix (`actual: 'anulada Norte mar'`), verde después |
| 3 | Tests previos de `cancelar` | ✅ |

Revisor (sonnet): sin bloqueantes. Hallazgo 1 (sin test de `anular`): corregido, `test/void-day.test.js` en fichero propio por el estado en memoria. Hallazgos 2 y 3: no requieren cambio (campos de cierre; test aislado por proceso).

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s de tests; sin medida previa del gate completo)
- Inicio: 2026-11-11T16:29Z
- Esfuerzo real: pendiente
