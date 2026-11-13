---
id: 20261111-192103-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-11
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

Fila 0012 del roadmap: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Hoy `node src/app.js libres 25:00-26:00` imprime `Norte, Sur` (reproducido).

## 2. Solución fijada (petición cerrada)

Frase literal de la fila 0012 (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` existe (`run` en `src/app.js`) y recibe la franja en `params[0]`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: antes de listar, `libres` valida la franja dada y, si no es válida, responde el texto literal de la fila.
- **Decisiones**:
  - Texto de la respuesta: literal de la fila — dev-lead
  - Rangos: horas 00–23 y minutos 00–59 (definición de hora de reloj; el ejemplo 25:00-26:00 los fija) — ticket (la fila)
  - Formato estricto de dos dígitos (`9:00-10:00` y `abc` pasan de listar salas a "franja no válida"): lo apoya el texto «usa HH:MM-HH:MM», pero la fila no lo dice — sin el dev-lead, PENDIENTE de su respuesta (alternativa: aceptar `9:00`)
  - Sin tocar (la fila no lo dice): `libres` sin franja, y franjas con fin ≤ inicio — se quedan como hoy

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | pendiente |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + ~1 s de gate de cierre (`node --test && node scripts/lint.mjs`, suite sin medir en el proyecto; base patch 0007: 0,5 h)
- Inicio: 2026-11-11T19:21Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
