---
id: 20261111-160147-patch-0012-cancel-day
task: 0012
title: Patch — cancelar una sala un día sin reserva cancela la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar una sala un día sin reserva cancela la de otro día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `.docs/sdd/capabilities/`) y el fix devuelve el comando a lo que ya dice su salida `sin reserva <sala> <día>`.

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: con la reserva Norte lun activa, `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y después `run('cancelar', ['Norte', 'lun'])` devuelve `sin reserva Norte lun`: la del lunes quedó cancelada.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo usa: busca la primera reserva activa de la sala (`b.room === room && b.status === 'active'`). Con Norte lun activa, pedir Norte mar la encuentra, `cancelBooking` la marca `cancelled` y la salida repite el día pedido, no el de la reserva. `voidBooking` usa la misma función y tiene el mismo fallo. Misma familia que el patch 0007 (comparación incompleta), en otra función. Evidencia: reproducido en la base actual (ver §1). La deuda de `debt.md` no lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla `cancelar` y `anular`; sin cambio de texto ni de salida.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Norte mar sin reserva con Norte lun activa: `cancelar` → `sin reserva Norte mar`, y la del lunes sigue activa (`cancelada Norte lun`) | ✅ RED visto antes del fix (`cancelada Norte mar`), verde después |
| 2 | lo mismo con `anular` (misma función) | ✅ RED visto sin el fix, verde con él |

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, lint sin hallazgos.

Revisión (un revisor sonnet): sin cambios en causa ni fix. Hallazgo 1 (sin test de `anular`): arreglado, caso 2. Hallazgo 2 (§4 y tiempo pendientes): arreglado al cerrar.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 1 s del gate de cierre (`node --test && node scripts/lint.mjs`, según `operations.md`; sin medida previa en patches)
- Inicio: 2026-11-11T16:01Z
- Esfuerzo real: pendiente
