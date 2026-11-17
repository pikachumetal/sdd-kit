---
id: 20261030-123903-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: causa raíz
status: done
created: 2026-10-30
branch: feature/0012-slot-format
commit: <hash>
---

# Patch 0012 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila 0012 del roadmap: `libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM».
Medido sobre la base actual: `node src/app.js libres 25:00-26:00` → `Norte, Sur`. Coincide con lo reportado.

## 2. Causa raíz

`run` pasa `params[0]` tal cual a `freeRooms` (`src/app.js:29`), y `freeRooms` solo compara texto con
`b.slot === slot` (`src/app.js:5-7`). Una franja inexistente no coincide con ninguna reserva, así que
todas las salas salen libres. No hay ninguna validación del formato (es la deuda «Sin validación del
formato de franja horaria» del roadmap).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `run('libres', …)` valida la franja antes de buscar salas y, si no es válida, devuelve «franja no válida: usa HH:MM-HH:MM».
- **Decisiones**:
  - Texto de la respuesta, literal — ticket (fila 0012).
  - Válida = `HH:MM-HH:MM`, horas 00–23 y minutos 00–59; no se comprueba que el fin sea posterior al inicio — ticket (formato `HH:MM` de la fila; el orden queda fuera por no estar pedido).
  - Sin argumento (`libres` a secas) también responde «franja no válida…»: antes listaba todas las salas porque `undefined` no coincidía con ninguna reserva — sin el dev-lead (consecuencia de la validación; se avisa al cerrar).

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (también `09:60-10:00`, `24:00-25:00`, `foo`) | ✅ test nuevo en RED con `Norte, Sur`, ahora verde |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 1 s de gate de cierre (declarado en `operations.md`; sin medida previa en el proyecto)
- Inicio: 2026-10-30T12:39Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-10-30T12:37Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
