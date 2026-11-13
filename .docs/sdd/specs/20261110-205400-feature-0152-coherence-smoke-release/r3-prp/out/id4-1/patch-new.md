---
id: 20261111-190633-patch-0013-franja-libres
task: 0013
title: Patch — franja no válida en libres
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0013-slot-format
commit: pendiente
---

# Patch 0013 — franja no válida en libres

Validación: dev-lead — `libres` lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila 0012 (hoy 0013) del roadmap: `libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM».

Medido en la base (`node src/app.js libres 25:00-26:00`): `Norte, Sur`. También `libres abc` → `Norte, Sur`. Coincide con lo reportado; el mismo fallo cubre cualquier franja que no sea HH:MM-HH:MM.

## 2. Causa raíz

`run('libres', params)` (`src/app.js:28`) pasa `params[0]` a `freeRooms(slot)`, que solo compara el texto con `b.slot` (`src/app.js:6`). Ninguna capa comprueba el formato de la franja: una franja que no coincide con ninguna reserva no excluye ninguna sala, y se responde como si estuviera libre. Es determinista: depende solo del argumento. Es la fila «Sin validación del formato de franja horaria» de `debt.md` (Por triar), sin remedio temporal.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja antes de buscar y, si no es `HH:MM-HH:MM` con horas 00-23 y minutos 00-59, responde `franja no válida: usa HH:MM-HH:MM`. No se valida el orden inicio < fin: nadie lo ha pedido.
- **Decisiones**:
  - Texto de la respuesta — dev-lead (petición y fila del roadmap)
  - Válida = `HH:MM-HH:MM` con horas 00-23 y minutos 00-59: lo fija el propio mensaje «usa HH:MM-HH:MM» y el ejemplo `25:00` — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ RED antes (devolvía `Norte, Sur`), verde después |
| 2 | `libres abc` y `libres 10:00` → el mismo mensaje | ✅ RED antes, verde después |
| 3 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ test previo en verde; `09:00-10:30` → `Norte, Sur` |

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests en verde, `lint: sin hallazgos` (comando y salida leídos tras el fix).

Revisor (sonnet, effort medio): sin hallazgos altos ni medios; dos menores.
- Faltan tests de `9:00-10:00`, argumento ausente, espacios y franja válida sin reserva — rechazado: el patch es un fallo con un test de regresión por comportamiento; esos casos los cubre la misma expresión y se midieron a mano (el revisor los corrió: rechazados, `libres 09:00-10:30` → `Norte, Sur`).
- Rechazar `9:00-10:00` y los espacios es lectura literal de «HH:MM» (dos dígitos); el orden invertido (`12:00-10:00`) no se valida a propósito (§3). Se deja al dev-lead para confirmar en la validación — aceptado, sin cambio de código.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, ~1 s; sin gate medido en el proyecto)
- Inicio: 2026-11-11T19:06Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
