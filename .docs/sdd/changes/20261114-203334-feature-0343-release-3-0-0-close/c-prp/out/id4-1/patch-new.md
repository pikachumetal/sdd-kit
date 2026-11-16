---
id: 20261115-191729-patch-0013-slot-format
task: 0013
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-15
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — franja no válida en libres

Validación: dev-lead — `libres` lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

Fila 0013 del roadmap (antes 0012): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Medido en la base: `libres 25:00-26:00` devuelve `Norte, Sur`, sin validar la franja (deuda «Sin validación del formato de franja horaria»).

## 2. Solución fijada (petición cerrada)

Frase literal del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Autor: dev-lead. Lo que da por existente, comprobado: el comando `libres` existe en `run` (`src/app.js`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida su franja contra `HH:MM-HH:MM` antes de buscar salas; si no encaja, responde el texto fijado.
- **Decisiones**:
  - Texto exacto «franja no válida: usa HH:MM-HH:MM» y rechazo de `25:00-26:00` — dev-lead
  - Qué es válido: el formato que nombra el mensaje, dos dígitos, horas 00–23 y minutos 00–59 (por eso también se rechazan `abc` y `24:00-25:00`) — lectura del agente del formato de la fila; el dev-lead no la fijó, queda para su validación
  - No se valida fin anterior al inicio ni se cambia `libres` sin argumento (sigue listando salas) — fuera de la petición

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `libres 25:00-26:00` → `Norte, Sur` (esperado el mensaje) | ✅ falla por la razón correcta |
| 2 | Tras el fix: `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 3 | `libres 10:00-12:00` → `Sur`; `09:00-10:00` → `Norte, Sur` (franjas válidas intactas) | ✅ |
| 4 | `abc` y `24:00-25:00` → mensaje | ✅ |

Revisión (1 revisor, sonnet): sin hallazgos bloqueantes. Un punto informativo — los casos 3 y 4 se comprobaron a mano y solo `25:00-26:00` tiene test automatizado — aceptado: la petición es cerrada y es un único test; queda dicho aquí.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + gate de cierre (~1 s según `operations.md`, sin medida registrada)
- Inicio: 2026-11-15T19:17Z
- Esfuerzo real: pendiente
