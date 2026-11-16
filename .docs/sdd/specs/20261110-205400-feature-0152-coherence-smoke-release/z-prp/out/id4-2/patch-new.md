---
id: 20261112-162427-patch-0013-slot-format
task: 0013
title: Patch — franja no válida en libres
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — franja no válida en libres

Validación: dev-lead — lo que usa una persona desde la terminal; el agente solo mide el comando.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»» (fila 0012 del roadmap, renumerada a 0013 por `sdd id claim`). Medido: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`. Coincide con el síntoma.

## 2. Causa raíz

`run('libres', …)` pasa `params[0]` tal cual a `freeRooms` (`src/app.js`), que solo compara la cadena con `b.slot`. Nada valida el formato, y ninguna reserva tiene la franja `25:00-26:00`, así que el filtro no excluye ninguna sala y devuelve todas. Es la fila de deuda «Sin validación del formato de franja horaria» (`debt.md`, Por triar, sin remedio temporal). La causa es determinista y no necesita interpretar requisitos.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` comprueba la franja con `^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$` antes de listar y, si no casa, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - «Válida» = `HH:MM-HH:MM`, horas 00–23, minutos 00–59 — sin el dev-lead (la fila no lo define; es lo mínimo que hace falsa la franja `25:00-26:00`).
  - Una franja ausente (`libres` sin argumento) tampoco casa con el formato y responde lo mismo — sin el dev-lead. No se valida que el inicio sea anterior al fin: fuera del síntoma — sin el dev-lead.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ rojo antes del fix (`Norte, Sur`); verde después |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ test existente en verde |

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,02 h del gate de cierre (sin gate medido en un patch; `operations.md` ~1 s)
- Inicio: 2026-11-12T16:24Z
- Esfuerzo real: pendiente

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

Revisor (sonnet): sin hallazgos graves. Media — §3 decía que no se validaba la franja ausente y el código sí: corregido en §3, el comportamiento es el correcto. Bajas — tests de borde adicionales (`24:00`, `9:00-10:00`, sin argumento): rechazados, fuera del síntoma y la regex ya los cubre; la fila de deuda la cierra `sdd-archive`; `status`/`commit`/esfuerzo se completan al cerrar.
