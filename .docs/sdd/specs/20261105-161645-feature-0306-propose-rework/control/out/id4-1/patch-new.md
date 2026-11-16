---
id: 20261105-211603-patch-0013-slot-format
task: 0013
title: Patch — Franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-11-05
branch: feature/0013-slot-format
commit: 9b02f69
---

# Patch 0013 — Franja no válida en libres

Validación: dev-lead — cambia un texto visible de la CLI.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila del roadmap: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Medido en la base: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`.

## 2. Solución fijada (petición cerrada)

Frase literal de la fila 0013 del roadmap (ticket): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente: el comando `libres` en `src/app.js` (existe, y hoy pasa el argumento sin validar a `freeRooms`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00-23, minutos 00-59) y, si no cumple, responde el texto fijado.
- **Decisiones**:
  - Texto de la respuesta, literal — ticket
  - Se lee «HH:MM-HH:MM» literalmente: dos dígitos por cifra, horas 00-23 y minutos 00-59 (25:00 es el caso de la fila). Consecuencia: `9:00-10:00` y `24:00` también se rechazan — ticket (inferido de su texto y de su ejemplo)
  - No se rechaza fin anterior a inicio ni `libres` sin franja: la fila no los menciona y se dejan como estaban — sin el dev-lead (se conserva el comportamiento actual; no añade nada visible)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` (test RED antes, GREEN después) | ✅ |
| 1b | minutos fuera de rango, `abc` y `9:00-10:00` → mismo mensaje | ✅ |
| 2 | `libres 10:00-12:00` sigue → `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin medida previa)
- Inicio: 2026-11-05T21:16Z
- Esfuerzo real: pendiente al cerrar
