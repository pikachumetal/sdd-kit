---
id: 20261101-132525-patch-0032-cancelar-dia
task: 0032
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-01
branch: feature/0032-cancelar-dia
commit: <hash, se escribe en el commit de cierre>
---

# Patch 0032 — cancelar y anular ignoraban el día

Validación: dev-lead — el fallo es visible para quien usa `cancelar` y `anular`.

## Capacidades

- Ninguna, porque no hay carpeta `capabilities/` y el fix devuelve `cancelar` y `anular` a lo que ya responden: actuar sobre la reserva del día indicado.

## 1. Síntoma

Con Norte reservada el lunes y sin reserva el martes, `cancelar Norte mar` responde «cancelada Norte mar» y quita la reserva del lunes. Medido en la base: `cancelar Norte mar` → `cancelada Norte mar` y `anular Norte mar` → `anulada Norte mar`, con la del lunes ya inactiva.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10`) recibe `day` y no lo usa: busca la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la llaman con el día pedido, cancelan o anulan la reserva de otro día y responden con el día que se pasó. El test «cancelar sin reserva» solo usaba Sur, que no tiene ninguna, y no lo detectaba.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. `anular` usaba la misma función y queda arreglado con el mismo cambio.

## 4. Verificación

Gate: `node --test` → 6/6.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar`; la del lunes sigue activa (RED: `cancelada Norte mar`) | ✅ |
| 2 | Igual con `anular` (RED: `anulada Norte mar`) | ✅ |
