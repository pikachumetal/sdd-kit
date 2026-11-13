---
id: 20261110-211507-patch-0015-cancel-day
task: 0015
title: Patch — cancelar ignoraba el día
type: patch
solution: causa raíz
status: done
created: 2026-11-10
branch: feature/0015-cancel-day
commit: pendiente
---

# Patch 0015 — cancelar ignoraba el día

Validación: dev-lead — es lo que usa una persona al cancelar una reserva.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido en un test (el CLI no guarda estado entre ejecuciones): en un mismo proceso, `cancelar Norte mar` → `cancelada Norte mar`, y después `cancelar Norte lun` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo compara: busca la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la usan, así que cancelar o anular cualquier día toca la primera reserva activa de la sala y responde con el día pedido.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla `cancelar` y `anular`, que comparten la función. El test fusiona «cancelar una reserva activa» con el caso nuevo (conserva su aserción) para no depender del orden de los tests: `bookings` es estado de módulo.
- **Decisiones**: ninguna sobre lo que el usuario ve; el texto `sin reserva <sala> <día>` ya existía.

## 4. Verificación

Gate: `node --test test/` → 4/4.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED sin el fix (`git stash` de `src/app.js`): `anular Norte mar` daba `anulada Norte mar` y el test fallaba (3 pasan, 1 falla) | ✅ |
| 2 | Con el fix: `anular`/`cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` (4/4) | ✅ |

Revisión (un revisor sonnet): 1) test dependiente del orden — corregido, un solo test con las tres aserciones; 2) `anular` sin test — corregido, el test lo cubre; 3) síntoma «reproducido en la base» — corregido, «en un test»; 4) RED sin evidencia — corregido, fila 1 con la salida del test sin el fix.
