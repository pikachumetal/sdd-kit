---
id: 20261115-191730-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de franja en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de franja en libres

Validación: dev-lead — `libres` es lo que usa una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Medido en la base: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`. Mismo fallo con `mañana` y sin argumento.

## 2. Solución fijada

Petición cerrada, dev-lead (petición de arranque, 2026-11-15): «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»», saldando la deuda «Sin validación del formato de franja horaria». Comprobado lo que da por existente: `run('libres', …)` en `src/app.js` pasa `params[0]` a `freeRooms` sin validarlo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `SLOT_FORMAT` antes de buscar salas y, si no cumple, devuelve el texto fijado.
- **Decisiones**:
  - Franja válida = `HH:MM-HH:MM` con HH 00–23 y MM 00–59 en ambos extremos (lo que implica el ejemplo `25:00`) — dev-lead
  - No se valida inicio < fin: la petición no lo pide — dev-lead (queda fuera)
  - Sin argumento, `libres` responde el mismo texto (no cumple el formato) — dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → suite: corrió 6/6 · lint: sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: 2 tests nuevos fallaban con `Norte, Sur` ≠ texto fijado | ✅ |
| 2 | `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 3 | `libres 10:00-12:00` → `Sur` (sin regresión) | ✅ |

Revisión (un revisor sonnet):

- La fila de deuda sigue en `debt.md` — rechazado: la salda `sdd-archive` al cerrar, no el commit del fix.
- `status`/`commit`/esfuerzo real pendientes — rechazado: se escriben en el commit de cierre.
- Sin test del límite `23:59-00:00` — rechazado: la regex ya lo cubre y el patch es el mínimo; sin cambio.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,05 h del gate de cierre (suite de ~1 s según operations.md; sin gate medido en patches previos)
- Inicio: 2026-11-15T19:17Z
- Esfuerzo real: pendiente
