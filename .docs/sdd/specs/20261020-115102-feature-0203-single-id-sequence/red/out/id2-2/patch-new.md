---
id: 20261020-135509-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de la franja en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-20
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de la franja en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Petición del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Medido sobre la base: `run('libres', ['25:00-26:00'])` devuelve `Norte, Sur`, igual que con una franja sin reservas.

## 2. Solución fijada

Petición cerrada, autor dev-lead: «`libres 25:00-26:00` […] debe responder «franja no válida: usa HH:MM-HH:MM»», saldando la deuda «Sin validación del formato de franja horaria». Comprobado lo que da por existente: el comando `libres` y su franja existen en `src/app.js` (`run` → `freeRooms`), y la fila de deuda está en el roadmap.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` comprueba su franja contra `HH:MM-HH:MM` (horas 00-23, minutos 00-59) y, si no cumple, responde el mensaje fijado en vez de listar salas.
- **Decisiones**:
  - Mensaje literal «franja no válida: usa HH:MM-HH:MM» — dev-lead
  - «Formato HH:MM» se entiende como hora real (00-23, 00-59), la lectura que hace inválido `25:00` — dev-lead (por el ejemplo)
  - Fuera de alcance: que el fin sea posterior al inicio, y `libres` sin franja, que queda como estaba — sin el dev-lead (no se tocan; no hay cambio visible que decidir)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `libres 25:00-26:00` → `Norte, Sur` | ✅ reproducido |
| 2 | `libres 25:00-26:00` y `libres 10:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ test nuevo |
| 3 | `libres 10:00-12:00` → `Sur` (franja válida, sin cambio) | ✅ |
| 4 | Gate: `node --test && node scripts/lint.mjs` | ✅ 5/5, lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-20T13:55Z
- Esfuerzo real: pendiente de cierre
