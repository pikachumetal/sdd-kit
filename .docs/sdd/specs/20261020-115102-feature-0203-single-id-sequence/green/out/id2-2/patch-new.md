---
id: 20261020-140010-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de franja en libres
type: patch
solution: dev-lead
status: done
created: 2026-10-20
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de franja en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (no existe `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` respondía `Norte, Sur`: trataba la franja inválida como una franja libre. Fila de deuda «Sin validación del formato de franja horaria».

## 2. Solución fijada (petición cerrada)

- Frase literal del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»».
- Lo que da por existente, comprobado: el comando `libres` existe en `run` (`src/app.js`) y hoy devuelve `Norte, Sur` con `25:00-26:00`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `^HH:MM-HH:MM$` (horas 00-23, minutos 00-59) y, si no cumple, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - Texto del mensaje y comando afectado (`libres`) — dev-lead
  - Una hora o un minuto fuera de rango (25:00, 26:00) cuenta como formato no válido — dev-lead (el ejemplo 25:00-26:00 lo exige)
  - No se comprueba que el fin sea posterior al inicio, ni se valida `reservar`: no se pidió — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Test nuevo RED antes del fix (devolvía `Norte, Sur`) → verde | ✅ |
| 2 | `libres 25:00-26:00` y `libres` sin franja → `franja no válida: usa HH:MM-HH:MM`; `libres 10:00-12:00` → `Sur` | ✅ |
| 3 | Gate de cierre `node --test && node scripts/lint.mjs` | ✅ 5/5, lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,25h
- Inicio: 2026-10-20T14:00Z
- Esfuerzo real: pendiente de cerrar
