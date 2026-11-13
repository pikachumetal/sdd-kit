---
id: 20261111-094538-patch-0015-cancelar-dia
task: 0015
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: in-progress
created: 2026-11-11
branch: feature/0015-cancelar-dia
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoraban el día

Validación: agente, «Sí, como patch. Sigue hasta el commit del fix.» — fallo determinista de lógica, sin nada que una persona vea más allá del mensaje, y lo cubren dos tests.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, con solo `Norte lun` activa.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo compara: devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` la marca `cancelled` y contesta con el `day` pedido, por eso el mensaje habla del martes mientras se cancela la del lunes.
`voidBooking` (`anular`) usa la misma `findBooking`, así que tenía el mismo fallo. Evidencia: los dos tests nuevos fallaban con `cancelada Norte mar` y `anulada Norte mar`, y pasan al comparar el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Un día sin reserva activa devuelve `sin reserva <sala> <día>`, como ya hacía el caso sin reserva.

## 4. Verificación

Gate: `node --test` → 6/6.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` | ✅ rojo antes (`cancelada Norte mar`), verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y `anular Norte lun` → `anulada Norte lun` | ✅ rojo antes (`anulada Norte mar`), verde después |

Revisor (sonnet, effort medium): sin hallazgos de gravedad alta o media; confirma la causa, el fix mínimo, el rojo por la razón correcta y 6/6. Una observación leve: `status: done` y `commit:` se adelantaban al commit. Aceptada: `commit:` se rellena en el commit de cierre de `sdd-archive`, que es donde el patch queda cerrado.
