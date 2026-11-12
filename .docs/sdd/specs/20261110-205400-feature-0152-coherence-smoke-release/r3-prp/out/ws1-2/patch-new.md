---
id: 20261111-200556-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-11-11
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal; el agente solo mide el texto devuelto.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (no hay `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas (`Norte, Sur`); debe responder «franja no válida: usa HH:MM-HH:MM». Reproducido en la base: `node src/app.js libres 25:00-26:00` → `Norte, Sur`.

## 2. Solución fijada (petición cerrada)

Fila 0012 del roadmap, autor ticket: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente: el comando `libres` en `src/app.js` (`run`), comprobado.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de listar; si no es `HH:MM-HH:MM` con hora 00-23 y minutos 00-59, devuelve el texto de la fila.
- **Decisiones**:
  - Válida = `HH:MM-HH:MM` con hora 00-23 y minutos 00-59 (`10-12` y `10:60-11:00` también se rechazan) — ticket: la hora de reloj y el formato `HH:MM-HH:MM` que nombra el texto de la fila no dejan otra lectura. Fuera de alcance: inicio < fin (nadie lo pidió); queda para validar.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: el test nuevo fallaba con `Norte, Sur` | ✅ |
| 2 | `node src/app.js libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 3 | `libres 10:00-12:00` sigue dando `Sur` | ✅ |

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

Revisor (sonnet): sin hallazgos altos ni medios. Baja 1 (`commit`/`Esfuerzo real` pendientes): los rellena el cierre. Baja 2 (faltaba el GREEN): añadido arriba.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s, sin medir)
- Inicio: 2026-11-11T20:05Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-11T20:04Z, sin 0 min de espera al dev-lead (0 esperas)
