---
id: 20261028-212531-patch-0012-slot-format
task: "0012"
title: Patch — Franja no válida en libres
type: patch
solution: causa raíz
status: done
created: 2026-10-28
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: sin capacidades).

## 1. Síntoma

Fila 0012 del roadmap: «`libres 25:00-26:00` responde "franja no válida: usa HH:MM-HH:MM"». Medido hoy: `libres 25:00-26:00` devuelve `Norte, Sur` (lista todas las salas como libres), igual que cualquier texto.

## 2. Causa raíz

`run` pasa `params[0]` tal cual a `freeRooms` (`src/app.js`), que solo compara `b.slot === slot`. Ninguna reserva coincide con un texto que no es una franja, así que el filtro no excluye nada y todas las salas salen libres. No hay validación del formato en ningún punto (es la deuda «Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `run('libres', …)` valida la franja antes de consultar y, si no cumple `HH:MM-HH:MM`, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - Válida = horas 00–23 y minutos 00–59 en dos dígitos (la única lectura en que 25:00 es inválida) — ticket (lectura de «HH:MM»)
  - `libres` sin franja no se toca: sigue listando las salas — ticket (la fila solo cubre una franja mal formada)
  - No se valida que el inicio sea anterior al fin — ticket (la fila no lo pide)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests · lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ RED (`Norte, Sur`) → verde; `10:00-12:00` → `Sur`; `libres` sin franja → `Norte, Sur` |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin medir; la suite tarda ~1 s)
- Inicio: 2026-10-28T21:25Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-10-28T21:24Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
