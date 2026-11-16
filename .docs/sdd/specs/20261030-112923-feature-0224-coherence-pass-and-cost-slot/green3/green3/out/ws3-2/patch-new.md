---
id: 20261030-124430-patch-0012-slot-format
task: 0012
title: Patch — Franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-30
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — Franja no válida en libres

## Capacidades

Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila 0012 del roadmap: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Medido: hoy `libres 25:00-26:00` lista las salas (`Norte, Sur`), porque `run` pasa `params[0]` a `freeRooms` sin validar.

## 2. Solución fijada

Frase literal de la fila 0012 (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` y su rama en `run` (`src/app.js`), y la deuda «Sin validación del formato de franja horaria» del roadmap.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida su argumento con `SLOT` (`HH:MM-HH:MM`, horas 00–23, minutos 00–59) y, si no casa, responde `franja no válida: usa HH:MM-HH:MM` sin listar salas.
- **Decisiones**:
  - Texto exacto del mensaje — dev-lead (fila 0012)
  - Qué franjas son válidas: formato `HH:MM-HH:MM` con horas 00–23 y minutos 00–59; no se exige fin posterior al inicio — sin el dev-lead (lectura mía de «25:00 no es válida»; **a confirmar en la validación**)
  - Una franja ausente o mal formada (`10-12`, sin argumento) recibe el mismo mensaje — sin el dev-lead (a confirmar)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → corrió 6/6 · lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `libres 25:00-26:00` devolvía `Norte, Sur` | ✅ test fallaba |
| 2 | `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 3 | `10-12` y sin argumento → mismo mensaje | ✅ |
| 4 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,01 h del gate de cierre (~1 s medido ahora; sin gate medido antes en el proyecto)
- Inicio: 2026-10-30T12:43Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-10-30T12:43Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
