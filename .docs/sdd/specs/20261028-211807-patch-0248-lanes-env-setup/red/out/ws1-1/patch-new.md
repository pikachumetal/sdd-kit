---
id: 20261028-212342-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas (`Norte, Sur`) en vez de avisar de que la franja no es válida. Reproducido en la base actual.

## 2. Solución fijada (petición cerrada)

Fila 0012 del roadmap, dev-lead: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Existe lo que da por existente: el comando `libres` (`run` en `src/app.js`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00–23, minutos 00–59) y, si no cuadra, responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta, literal — dev-lead
  - Una franja es válida si tiene forma HH:MM-HH:MM con horas 00–23 y minutos 00–59; no se comprueba que el fin sea posterior al inicio, porque no se pidió — sin el dev-lead
  - `libres` sin franja sigue listando todas las salas, como hoy — sin el dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres 25:00-26:00` devolvía `Norte, Sur`; ahora `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin duración medida en el proyecto)
- Inicio: 2026-10-28T21:23Z
- Esfuerzo real: pendiente de `sdd-archive`
