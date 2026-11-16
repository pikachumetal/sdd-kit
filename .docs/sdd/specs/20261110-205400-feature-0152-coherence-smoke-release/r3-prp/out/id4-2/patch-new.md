---
id: 20261111-195440-patch-0013-slot-format
task: 0013
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-11
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Petición (fila 0012 del roadmap, renumerada 0013 al reservar): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Hoy responde `Norte, Sur`, es decir, lista todas las salas.

## 2. Solución fijada

Frase literal del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Autor: dev-lead. Lo que da por existente existe: el comando `libres` en `src/app.js` (`run`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida su parámetro con `HH:MM-HH:MM` (horas 00–23, minutos 00–59) y, si no encaja, responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta — dev-lead
  - «Válida» = forma `HH:MM-HH:MM` con hora y minuto reales; es lo que dice el propio formato — dev-lead (formato nombrado en la petición)
  - No se comprueba que el fin sea posterior al inicio: la petición no lo pide — dev-lead (queda fuera, sin decidir)

## 4. Verificación

Gate: `node --test` → 5/5 · `node scripts/lint.mjs` → sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `run('libres', ['25:00-26:00'])` → `franja no válida: usa HH:MM-HH:MM` | ✅ RED antes (`actual: 'Norte, Sur'`), verde después |
| 2 | `run('libres', ['10:00-12:00'])` sigue dando `Sur` | ✅ test existente |

Revisión (un reviewer sonnet): sin hallazgos en código ni test. Nota menor: `libres` sin argumento también responde «franja no válida», coherente con el formato; aceptada. El RED previo lo medí yo antes del fix (`actual: 'Norte, Sur'`).

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin medida previa en el proyecto
- Inicio: 2026-11-11T19:54Z
- Esfuerzo real: pendiente
