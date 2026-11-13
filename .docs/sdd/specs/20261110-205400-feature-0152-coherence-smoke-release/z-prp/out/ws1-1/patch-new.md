---
id: 20261112-160207-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila 0012 del roadmap: `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM». Medido en la base (b7e1fde): `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`.

## 2. Causa raíz

`run('libres', params)` en `src/app.js` pasa `params[0]` sin comprobarlo a `freeRooms(slot)`, que solo filtra las salas con una reserva activa de esa franja exacta. Una franja que no es una hora real no casa con ninguna reserva y devuelve todas las salas. Evidencia: reproducción con `25:00-26:00` → `Norte, Sur`. Cubierta por la fila «Sin validación del formato de franja horaria» de `debt.md`, sin remedio temporal; la cierra `sdd-archive`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00–23, minutos 00–59) y, si no cumple, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - Texto de la respuesta literal — dev-lead (fila 0012)
  - Válida = formato `HH:MM-HH:MM` con horas y minutos reales; no se comprueba fin > inicio ni se cambia `libres` sin argumento — sin el dev-lead (queda fuera de alcance, ver nota en el cierre)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (RED: devolvía `Norte, Sur`) | ✅ `node --test` 7/7 · `node scripts/lint.mjs` sin hallazgos |

Revisor (sonnet): sin bloqueantes. Hallazgo bajo «sin test de `libres` sin argumento» → corregido, test añadido. Hallazgo bajo «status/commit/validación pendientes» → se completa en el cierre con `sdd-archive`.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,01 h del gate de cierre (0,3 s medido, node --test && node scripts/lint.mjs)
- Inicio: 2026-11-12T16:02Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
