---
id: 20261115-184134-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — es un comando que usa una persona; se prueba con `node src/app.js cancelar Norte mar`.

## Capacidades

- Ninguna, porque el fix devuelve `cancelar` y `anular` a lo que ya dice su nombre: actúan sobre la reserva del día indicado; ninguna capacidad lo describe (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `cancelar Norte mar` responde `cancelada Norte mar`, y un `cancelar Norte lun` posterior responde `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: busca `b.room === room && b.status === 'active'`. Devuelve la primera reserva activa de la sala, sea de otro día, la cancela y responde con el día pedido. `cancelBooking` y `voidBooking` comparten la función, así que `anular` falla igual (`anular Norte mar` → `anulada Norte mar`). Es el mismo patrón del patch 0007 (comparación incompleta), esta vez en `findBooking`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`. Sin reserva ese día, los dos comandos ya devuelven `sin reserva <sala> <día>`.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 6/6 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` → `cancelada Norte mar` y `anular Norte mar` → `anulada Norte mar` (esperado `sin reserva Norte mar` en ambos) | ✅ fallaban por la causa esperada |
| 2 | Tras el fix, `test/cancel-day.test.js` y `test/void-day.test.js`: el martes dice `sin reserva` y la reserva del lunes sigue viva | ✅ |
| 3 | Suite completa | ✅ 6/6 |

Revisión (un revisor sonnet, sin hallazgos bloqueantes):

- Estado compartido entre los dos ficheros de test solo con `--test-isolation=none` — rechazado: Node aísla cada fichero en su proceso por defecto, y el segundo `assert` es lo que prueba que la del lunes seguía viva.
- Falta cubrir cancelar dos veces el mismo día — rechazado: lo cubre `status === 'active'`, que el patch no toca.
- `status: done` y `commit: pendiente` con §4 y §5 por completar — corregido: §4 completa; el hash lo escribe el commit de cierre.
- `freeRooms` filtra por `slot` y no por día — fuera del alcance; no se toca.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + gate de cierre (`node --test && node scripts/lint.mjs`, suite de ~1 s, sin medida previa en el proyecto)
- Inicio: 2026-11-15T18:41Z
- Esfuerzo real: (al cerrar)
