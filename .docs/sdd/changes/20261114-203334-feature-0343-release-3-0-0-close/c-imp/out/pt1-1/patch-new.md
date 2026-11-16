---
id: 20261115-142519-patch-0015-cancel-dia
task: 0015
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0015-cancel-dia
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoran el día

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `capabilities/`).

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: con la única reserva activa Norte lun, `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar` y deja la de lun cancelada (esperado: `sin reserva Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo compara: busca por sala y `status === 'active'`. Devuelve la primera reserva activa de la sala, sea de otro día. La comparación `b.day === day` se quitó en el commit 3bf340e (`git show 3bf340e -- src/app.js`). `cancelBooking` y `voidBooking` usan `findBooking`, así que `anular` tiene el mismo fallo y lo arregla el mismo cambio.

## 3. Fix

- **Fichero(s)**: `src/app.js`
- **Cambio**: `findBooking` vuelve a exigir `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | cancelar Norte mar sin reserva → `sin reserva Norte mar`, y la de lun sigue cancelable | ✅ `node --test` → 6/6 (RED previo: 2 fallos, `cancelada/anulada Norte mar`) |
| 2 | anular Norte mar sin reserva → `sin reserva Norte mar`, y la de lun sigue anulable | ✅ `node --test` → 6/6 (RED previo: 2 fallos, `cancelada/anulada Norte mar`) |

Revisión (1 revisor): sin hallazgos bloqueantes. Causa raíz y fix confirmados; los 2 tests nuevos fallan sin el fix y pasan con él.
- Estado compartido si se añaden más tests al mismo fichero: aceptado, cada fichero lleva un solo test y corre en su proceso; se deja así.
- `commit:` pendiente: lo rellena el commit de cierre.
