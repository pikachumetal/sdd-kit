---
id: 20261112-163650-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`; después `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`. Coincide con lo reportado. `anular` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: filtra solo por `b.room === room && b.status === 'active'`. `cancelBooking` y `voidBooking` lo llaman con el día pedido, así que cualquier día encuentra la primera reserva activa de la sala y la cambia de estado. Es la misma familia que el patch 0007, que arregló `freeRooms` (comparación por franja) y dejó esta comparación sin día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo)
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día, `cancelar` y `anular` devuelven `sin reserva <sala> <día>`, texto que ya existía.
- **Decisiones**: ninguna.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; la del lunes sigue activa (`cancelar Norte lun` → `cancelada Norte lun`) | ✅ RED antes: `cancelada Norte mar`; GREEN después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ mismo test, `test/cancel-day.test.js` |

Revisor (sonnet): causa, fix y RED confirmados (el test falla con `app.js` de HEAD y pasa con el fix).
- Hallazgo 1 (§3 citaba `test/cancel.test.js`): corregido.
- Hallazgo 2 (el test depende del orden dentro de su propio fichero): rechazado; es un único test en un fichero propio y `node --test` aísla los ficheros en procesos distintos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s, sin medida previa en patches anteriores)
- Inicio: 2026-11-12T16:36Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
