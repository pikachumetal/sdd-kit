---
id: 20261112-155226-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — `cancelar` es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido: `run('cancelar', ['Norte','mar'])` → `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte','lun'])` → `sin reserva Norte lun`. Coincide con lo reportado. `anular` comparte el fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero solo filtra por `b.room === room` y `b.status === 'active'`. Devuelve la primera reserva activa de la sala sea cual sea el día, y `cancelBooking` / `voidBooking` la marcan y responden con el `day` que escribió la persona. `voidBooking` usa la misma función, así que falla igual. El patch 0007 trató un síntoma parecido (por hora); este es el mismo defecto en la búsqueda por día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día, `cancelar` y `anular` devuelven `sin reserva <sala> <día>` y no tocan otras.
- **Decisiones**: ninguna sobre lo que el usuario ve: el texto `sin reserva <sala> <día>` ya existe.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` con solo Norte lun reservada → `sin reserva Norte mar` y la del lunes sigue activa (`test/cancel-day.test.js`, rojo antes: `cancelada Norte mar`) | ✅ |
| 2 | `anular Norte mar` igual (`test/void-day.test.js`, rojo antes: `anulada Norte mar`) | ✅ |

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 8/8 · lint: sin hallazgos

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 1 s de gate de cierre (`node --test && node scripts/lint.mjs`, suite unit; sin gate medido antes en el proyecto)
- Inicio: 2026-11-12T15:52Z
- Esfuerzo real: pendiente

### Revisión del patch (un revisor, sonnet)

- Causa raíz y fix confirmados; sin el fix fallan los 4 tests nuevos.
- Orden de los tests frágil dentro de cada fichero (estado de módulo compartido): rechazado, `node --test` ejecuta cada fichero en su proceso y el orden queda declarado en un comentario.
- Título «deja activa…» no comprobaba que siguiera activa: corregido, ahora «deja cancelable / anulable la de otro día».
- §3 no listaba `test/void-day.test.js`: corregido.
