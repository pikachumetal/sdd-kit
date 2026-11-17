---
id: 20261030-124230-patch-0012-slot-format
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

- Ninguna, porque ninguna capacidad describe `libres`.

## 1. Síntoma

Fila 0012 del roadmap: `libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM». Medido antes del fix: devolvía `Norte, Sur`, es decir, tomaba cualquier texto como franja.

## 2. Solución fijada

Solución fijada por el dev-lead en la fila 0012: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Da por existente el comando `libres` en `run` de `src/app.js`: comprobado.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/slot.test.js`
- **Cambio**: `libres` valida la franja con `SLOT` (`HH:MM-HH:MM`) antes de buscar salas; si no encaja, responde el texto de la fila.
- **Decisiones**:
  - Texto de la respuesta: literal de la fila — dev-lead
  - Horas 00–23 y minutos 00–59 como definición de franja válida, y cualquier texto fuera de ese formato (incluido sin argumento) recibe el mismo mensaje — sin el dev-lead (anunciado al abrir el patch; `delegate` no paró)
  - No se valida que el fin sea posterior al inicio — sin el dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 7/7 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (RED 3 fallos antes, 7/7 después) | ✅ |
| 2 | `libres 10:00-12:00` sigue devolviendo `Sur` | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin medir (patch 0007 no lo registró)
- Inicio: 2026-10-30T12:42Z
- Esfuerzo real: pendiente de cerrar con `sdd-archive`
