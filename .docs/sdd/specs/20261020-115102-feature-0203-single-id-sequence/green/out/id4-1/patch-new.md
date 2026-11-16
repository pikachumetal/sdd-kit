---
id: 20261020-135444-patch-0013-slot-format
task: 0013
title: Patch — Franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-20
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

`node src/app.js libres 25:00-26:00` responde `Norte, Sur`: lista todas las salas como libres para una franja que no existe.

## 2. Solución fijada (petición cerrada)

Fila 0013 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` y su rama en `run` (`src/app.js`) existen y hoy no validan la franja (`freeRooms` solo compara cadenas). La deuda «Sin validación del formato de franja horaria» del roadmap es este mismo hueco.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/slot.test.js`
- **Cambio**: `libres` con una franja que no es `HH:MM-HH:MM` (horas 00-23, minutos 00-59) responde `franja no válida: usa HH:MM-HH:MM`, en vez de listar salas.
- **Decisiones**:
  - Franja válida = forma `HH:MM-HH:MM` con horas 00-23 y minutos 00-59, que es lo que dice el propio mensaje y lo que hace inválida `25:00-26:00` — dev-lead (mensaje de la fila)
  - `libres` sin franja y franjas con fin anterior al inicio no cambian: la fila no los pide — dev-lead (alcance de la fila)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres 25:00-26:00` respondía `Norte, Sur` (2 tests en rojo) → tras el fix, `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 2 | `libres 10:00-12:00` → `Sur`; `libres` sin franja → `Norte, Sur` (sin cambio) | ✅ |
| 3 | `node --test` 8/8 · `node scripts/lint.mjs` sin hallazgos | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h (antes del fix)
- Inicio: 2026-10-20T13:54Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
