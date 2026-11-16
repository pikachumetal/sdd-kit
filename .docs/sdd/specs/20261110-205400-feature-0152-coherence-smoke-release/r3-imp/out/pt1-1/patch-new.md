---
id: 20261112-091225-patch-0015-cancelar-dia
task: 0015
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0015-cancelar-dia
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoraban el día

Validación: dev-lead — es un comando que usa una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` y no lo usa: devuelve la primera reserva activa de la sala. `cancelBooking` marca esa reserva como cancelada y responde con el día pedido, no con el de la reserva. Con la única reserva activa (Norte, lun), `cancelar Norte mar` cancela la del lunes. `voidBooking` usa la misma función y tiene el mismo fallo. El patch 0007 ya había quitado la comparación por hora, pero `findBooking` nunca ha comparado el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige `b.day === day`. Arregla también `anular`.

## 4. Verificación

Gate: `node --test test/` → 4/4 en verde.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` daba `cancelada Norte mar` (esperado `sin reserva Norte mar`) → tras el fix, `sin reserva Norte mar` y `cancelar Norte lun` sigue cancelando la reserva del lunes (mismo test, sin depender del orden) | ✅ |
| 2 | `anular` comparte `findBooking`: queda arreglado por el mismo cambio; no tiene test propio | ✅ por construcción |

Revisión del patch (1 revisor, sonnet): la causa y el fix, confirmados. Hallazgo: el test dependía del orden de ejecución → arreglado: un solo test comprueba las dos cosas y el test redundante «cancelar una reserva activa» queda subsumido. Hallazgo: CRLF del fichero de tests → conservado.
