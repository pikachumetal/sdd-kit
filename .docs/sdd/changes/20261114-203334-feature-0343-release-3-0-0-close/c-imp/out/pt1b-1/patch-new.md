---
id: 20261115-142609-patch-0032-cancelar-dia
task: 0032
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0032-cancelar-dia
commit: pendiente
---

# Patch 0032 — cancelar y anular ignoran el día

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, con la única reserva de Norte en `lun`. `anular Norte mar` da `anulada Norte mar`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo usa: filtra solo por sala y estado `active`, y devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la llaman con el día pedido, marcan esa reserva y responden con el día pedido, no con el de la reserva que han tocado. Por eso no sale `sin reserva` y se pierde la del lunes. La deuda técnica (`debt.md`) no cubre este fallo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Corrige `cancelar` y `anular`, que comparten la función.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: los dos tests nuevos fallan con `cancelada Norte mar` / `anulada Norte mar` en vez de `sin reserva Norte mar` | ✅ |
| 2 | GREEN tras el fix: `node --test` completo → 6/6 (4 previos + 2 nuevos); `cancelar Norte mar` → `sin reserva Norte mar`; después `cancelar Norte lun` → `cancelada Norte lun` | ✅ |

Revisión (sonnet, 1 revisor): causa raíz, fix y tests confirmados.
- Hallazgo 1 (Importante, el diff reescribe `src/app.js` por CRLF/LF) — rechazado: `git diff --stat` da 1 línea y el fichero sigue en CRLF en índice y árbol (`git ls-files --eol`: `i/crlf w/crlf`). Los dos tests nuevos se pasaron a CRLF como el resto.
- Hallazgo 2 (Menor, falta la fila GREEN) — corregido: fila 2 de la tabla.
