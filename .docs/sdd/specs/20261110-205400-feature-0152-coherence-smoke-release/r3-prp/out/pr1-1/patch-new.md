---
id: 20261111-193442-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido en la base: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero solo filtra por `room` y `status === 'active'`; las reservas guardan `day` y nunca se compara. La primera reserva activa de la sala es la que se cancela, sea del día que sea, y el mensaje repite el día escrito por la persona. `voidBooking` usa la misma función: `anular` tiene el mismo fallo. Es el mismo tipo de fallo que el patch 0007 (comparación incompleta), pero otra comparación.
Evidencia: lectura de `findBooking` y reproducción previa al fix (síntoma arriba). Sin fila en `debt.md` que lo cubra.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/day.test.js`, `test/day-anular.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Sin cambio de textos ni de salidas.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 8/8 tests, lint sin hallazgos. Sin el fix, los 4 tests nuevos fallan (`cancelada Norte mar`, `anulada Norte mar`, y el lunes ya no existe); con él, pasan.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`libres` → `Sur`) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ |
| 3 | `cancelar Norte lun` → `cancelada Norte lun`; `anular Norte lun` → `anulada Norte lun` (camino positivo) | ✅ |

Revisor (sonnet): causa raíz y fix correctos. Hallazgos: 1 sin test del camino positivo → arreglado (caso 3); 2 el test de `anular` dependía del estado de otro → arreglado (fichero propio `day-anular.test.js`); 3 comentario del test confuso → arreglado; 4 `patch.md` con resultados pendientes → arreglado.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,05 h del gate de cierre (~1 s de tests; sin medida previa en el proyecto)
- Inicio: 2026-11-11T19:34Z
- Esfuerzo real: pendiente
