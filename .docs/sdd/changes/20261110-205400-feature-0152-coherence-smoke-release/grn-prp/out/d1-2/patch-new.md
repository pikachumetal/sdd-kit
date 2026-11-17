---
id: 20261111-162935-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base (`develop`, 44e3372): `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de Norte del lunes queda cancelada. Lo mismo con `anular Norte mar` → `anulada Norte mar`. Esperado: `sin reserva Norte mar` y la del lunes intacta.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: busca `b.room === room && b.status === 'active'` y devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` solo lo llaman con `(room, day)`, así que ambas cancelan o anulan esa reserva y devuelven el día pedido en el mensaje. Es el mismo fallo que el patch 0007 corrigió para la hora, ahora en el día. Ninguna fila de `debt.md` lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` también compara `b.day === day`. Sin reserva ese día, `cancelar` y `anular` devuelven `sin reserva <sala> <día>`, texto que ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel-day.test.js test/void-day.test.js` → 2 fallos, uno por fichero (estado limpio cada uno): `cancelada Norte mar` y `anulada Norte mar` en vez de `sin reserva Norte mar` | ✅ |
| 2 | `node src/app.js cancelar Norte mar` → `sin reserva Norte mar`; la de Norte lun sigue activa (test 2) | ✅ |
| 3 | `node --test && node scripts/lint.mjs` → 6/6 tests, `lint: sin hallazgos` | ✅ |

Diff: 1 fichero de código, 1 línea.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,01 h del gate de cierre (~1 s; patch 0007: 0,5 h)
- Inicio: 2026-11-11T16:29Z
- Esfuerzo real: pendiente

**Revisión (sonnet):** hallazgo 1 y 2 — el segundo test dependía del estado que dejaba el primero, y el RED describía mal su fallo. Corregido: `anular` pasa a `test/void-day.test.js`, un proceso con estado limpio por fichero. Causa raíz, fix mínimo y que el test no está ajustado al código: sin hallazgos.
