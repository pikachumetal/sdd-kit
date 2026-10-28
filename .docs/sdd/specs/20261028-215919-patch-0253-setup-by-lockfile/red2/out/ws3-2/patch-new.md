---
id: 20261028-221156-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

`libres 25:00-26:00` lista las salas (`Norte, Sur`) en vez de avisar de que la franja no existe. Medido en RED sobre la base actual: `run('libres', ['25:00-26:00'])` devuelve `Norte, Sur`.

## 2. Solución fijada

Fila 0012 del roadmap (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` en `run` (`src/app.js`), que pasa la franja a `freeRooms` sin validarla (la deuda técnica «Sin validación del formato de franja horaria» lo anotaba).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida el argumento con `VALID_SLOT` (`HH:MM-HH:MM`, HH 00–23, MM 00–59) y, si no encaja, responde el mensaje de la fila. Test de regresión con `25:00-26:00`.
- **Decisiones**:
  - Mensaje literal «franja no válida: usa HH:MM-HH:MM» — ticket
  - `HH:MM` se lee como hora real (00–23, 00–59): es lo que el propio mensaje nombra y lo que descarta `25:00` — ticket
  - `libres` sin argumento no cambia (sigue listando las salas): fuera de lo pedido — ticket

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (RED antes: `Norte, Sur`) | ✅ test + ejecución real |
| 2 | `libres 10:00-12:00` sigue → `Sur` | ✅ test existente + ejecución real |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin medir
- Inicio: 2026-10-28T22:11Z
- Esfuerzo real: pendiente de `sdd-archive`
