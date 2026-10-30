---
id: 20261030-123136-patch-0012-slot-format
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

- Ninguna, porque ninguna capacidad describe `libres` (`capabilities/` no existe).

## 1. Síntoma

Fila 0012 del roadmap: `libres 25:00-26:00` debe responder «franja no válida: usa HH:MM-HH:MM». Medido: hoy responde `Norte, Sur`, es decir, lista las salas.

## 2. Solución fijada (petición cerrada)

Frase literal de la fila 0012 (dev-lead): «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Da por existente el comando `libres` en `src/app.js` (`run`), comprobado.

## 3. Fix

- **Ficheros**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` con un argumento que no es `HH:MM-HH:MM` (horas 00-23, minutos 00-59) responde el texto de la fila.
- **Decisiones**:
  - Texto exacto de la respuesta — dev-lead
  - «Válida» = `HH:MM-HH:MM` con horas 00-23 y minutos 00-59, que es lo que dice el propio mensaje — sin el dev-lead (a validar)
  - Sin argumento, `12:00-10:00` (fin antes de inicio) y `24:00` no se tocan: `libres` sin argumento sigue como estaba; el resto no lo pide la fila — sin el dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: el test nuevo falla antes del fix (`Norte, Sur`) | ✅ |
| 2 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 3 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin medir (ningún patch o walkthrough previo lo registra)
- Inicio: 2026-10-30T12:31Z
- Esfuerzo real: pendiente del cierre
- Coste de sujetos: no aplica
