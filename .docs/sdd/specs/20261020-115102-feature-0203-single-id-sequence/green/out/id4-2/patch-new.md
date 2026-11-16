---
id: 20261020-140100-patch-0013-slot-format
task: 0013
title: Patch — Franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-10-20
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — Franja no válida en libres

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja. Reproducido sobre la base actual con `node src/app.js libres 25:00-26:00`.

## 2. Solución fijada (petición cerrada)

Fila 0012 del roadmap (hoy 0013 tras `sdd id claim`), autor ticket: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` en `run` (`src/app.js`) pasa `params[0]` a `freeRooms` sin validarlo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `SLOT_FORMAT` (`HH:MM-HH:MM`, horas 00-23, minutos 00-59) y, si no cumple, responde `franja no válida: usa HH:MM-HH:MM`.
- **Decisiones**:
  - El mensaje es literal el de la fila — ticket
  - Válido = el formato que nombra el mensaje, `HH:MM-HH:MM` con hora y minuto reales — ticket
  - `libres` sin franja sigue como estaba (lista las salas); solo se valida si hay franja — sin el dev-lead (no cambia nada de lo que ya hacía; si se quiere exigir franja, es otro cambio)
  - No se comprueba que el fin sea posterior al inicio: la fila no lo pide — ticket

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: el test nuevo falla antes del fix («Norte, Sur») | ✅ |
| 2 | `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 3 | `libres 10:00-12:00` → `Sur` (sin regresión) | ✅ |
| 4 | Gate de cierre `node --test && node scripts/lint.mjs` | ✅ 5/5 · lint sin hallazgos |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-20T13:59Z
- Esfuerzo real: 0,05 h, aproximado con el reloj de la sesión
