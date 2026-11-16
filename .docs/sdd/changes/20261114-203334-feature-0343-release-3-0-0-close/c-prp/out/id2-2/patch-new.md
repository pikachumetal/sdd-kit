---
id: 20261116-111014-patch-0016-franja-valida
task: 0016
title: Patch — validar el formato de franja en `libres`
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0016-slot-format
commit: <hash>
---

# Patch 0016 — validar el formato de franja en `libres`

Validación: dev-lead — es lo que ve quien usa la terminal: el mensaje de error de `libres`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

`libres 25:00-26:00` lista las salas («Norte, Sur»); debe responder «franja no válida: usa HH:MM-HH:MM». Salda la fila de deuda «Sin validación del formato de franja horaria» (roadmap 2.x, 2026-09-18).

## 2. Causa raíz

Reproducido en la base: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`. `run('libres', …)` pasa `params[0]` tal cual a `freeRooms(slot)` (`src/app.js`), que solo compara la franja como texto con `b.slot`: nada valida su formato, así que una franja que no existe no coincide con ninguna reserva y todas las salas salen libres. La fila de deuda lo cubre; no tenía remedio temporal.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` valida la franja con `HH:MM-HH:MM` (horas 00-23, minutos 00-59) antes de buscar y responde `franja no válida: usa HH:MM-HH:MM` si no cumple (también sin franja o con formato roto).
- **Decisiones**:
  - Mensaje literal «franja no válida: usa HH:MM-HH:MM» — dev-lead
  - Rango válido de horas y minutos (25:00 no existe) — se deduce del formato HH:MM pedido por el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/app.test.js` → ✖ libres rechaza una franja con formato o horas inválidos | ✅ |
| 2 | tras el fix: `node --test` → 5/5; `node src/app.js libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM»; `libres 10:00-12:00` → «Sur» | ✅ |

Revisor (sonnet): sin hallazgos bloqueantes. Baja (§4 y esfuerzo pendientes en el cierre): se rellenan al cerrar. Nit (línea larga del ternario): rechazado, el lint no lo marca y el fix es mínimo.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,02 h del gate de cierre (`node --test && node scripts/lint.mjs`, ~1 s, sin medida previa)
- Inicio: 2026-11-16T11:10Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
