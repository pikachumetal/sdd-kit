---
id: 20261112-155543-patch-0016-slot-format
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

Validación: dev-lead — `libres` lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM»». Medido: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`.

## 2. Causa raíz (solución fijada)

Petición cerrada del dev-lead: «`libres 25:00-26:00` lista las salas; debe responder «franja no válida: usa HH:MM-HH:MM». Salda la fila de deuda «Sin validación del formato de franja horaria»». Lo que da por existente existe: el comando `libres` (`run` en `src/app.js`) y la fila en `steering/debt.md`. `freeRooms(slot)` compara la franja con las reservas sin validarla; una franja que no coincide con ninguna reserva deja libres todas las salas.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `libres` rechaza con el texto fijado una franja que no case con `HH:MM-HH:MM`, horas 00–23 y minutos 00–59. Sin franja, `libres` queda como estaba.
- **Decisiones**:
  - El rango válido de horas y minutos (00–23, 00–59), necesario para rechazar `25:00-26:00` — dev-lead (deducido del ejemplo)
  - No se exige inicio anterior al fin: no se pidió — dev-lead

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `libres rechaza una franja con horas fuera de rango` falló antes del fix (`actual: 'Norte, Sur'`); ahora `libres 25:00-26:00` → `franja no válida: usa HH:MM-HH:MM` | ✅ |
| 2 | `libres 10:00-12:00` → `Sur`; `libres 09:00-10:00` → `Norte, Sur` | ✅ |

Revisión (un revisor, sonnet medio):

- Corrección, mínimo y `libres` sin franja: sin hallazgos.
- Faltan tests de `libres` sin franja y de franja válida: rechazado, un patch es un test y ya los cubre `libres excluye la sala reservada en la franja` (franja válida).
- `status: done` con commit pendiente: es la forma de la plantilla; el hash se escribe al cerrar.
- La fila de deuda no está en el diff: rechazado, la salda `sdd-archive` al cerrar, no el commit del fix.
- 3 tests en vez de 5: rechazado, son 5 en total (`test/app.test.js` 3 + `test/cancel.test.js` 2).

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,02 h del gate de cierre
- Inicio: 2026-11-12T15:50Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
