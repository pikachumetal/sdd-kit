---
id: 20261112-162428-patch-0016-slot-format
task: 0016
title: Patch — validar el formato de franja en libres
type: patch
solution: dev-lead
status: done
created: 2026-11-12
branch: feature/0016-slot-format
commit: pendiente
---

# Patch 0016 — validar el formato de franja en libres

Validación: dev-lead — `libres` es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (no hay `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur») en vez de rechazar la franja. Debe responder «franja no válida: usa HH:MM-HH:MM». Salda la deuda «Sin validación del formato de franja horaria».

## 2. Solución fijada

Petición del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres` y `freeRooms` en `src/app.js`; hoy `libres 25:00-26:00` devuelve `Norte, Sur`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `^HH:MM-HH:MM$` (horas 00–23, minutos 00–59) antes de listar; si no cumple, devuelve el texto fijado.
- **Decisiones**:
  - Formato = dos horas HH:MM válidas separadas por `-`; no se valida fin posterior al inicio — dev-lead (derivado de su petición: 25:00 debe fallar; el alcance se le avisó al abrir)
  - Sin argumento, `libres` también responde «franja no válida…» — dev-lead (misma regla: lo que no es HH:MM-HH:MM es no válido)

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, lint sin hallazgos.

Revisor (sonnet, un solo revisor del patch):
1. Cobertura de bordes (24:00, minutos 60, `9:5`, espacio final, sin argumento) — corregido: segundo test en `test/app.test.js`.
2. RED no constatable desde el diff — rechazado: el RED se ejecutó antes del fix y falló con `actual: 'Norte, Sur'`, `expected: 'franja no válida: usa HH:MM-HH:MM'`.
3. Recuento de tests no visto en ejecución — rechazado: `node --test` imprimió `tests 6 · pass 6 · fail 0`.
4. `commit: pendiente` y esfuerzo real — se rellenan al cerrar con `sdd-archive`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `run('libres', ['25:00-26:00'])` devolvía `Norte, Sur` | ✅ falló por la causa esperada |
| 2 | `node src/app.js libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» | ✅ |
| 3 | `libres 10:00-12:00` → `Sur` (test existente) | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s, sin gate medido)
- Inicio: 2026-11-12T16:24Z
- Esfuerzo real: pendiente al cierre
