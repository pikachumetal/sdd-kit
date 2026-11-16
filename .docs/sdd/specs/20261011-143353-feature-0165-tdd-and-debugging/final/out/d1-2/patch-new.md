---
id: 20261011-184518-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido sobre la base actual: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de Norte del lunes queda `cancelled`. Medido igual que lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10`) recibe `day` pero su predicado solo compara `b.room === room && b.status === 'active'`: nunca mira `b.day`. Devuelve la primera reserva activa de la sala, sea del día que sea, y `cancelBooking` la cancela y compone el mensaje con el `day` pedido, de ahí «cancelada Norte mar».

`voidBooking` (`anular`) llama a la misma función: mismo fallo.

Nota: el patch 0007 («la cancelación borraba reservas de otro día con la misma hora») declara la misma comparación corregida, pero el código actual no filtra por día; el test de regresión que dejó solo cubre el caso con reserva y el caso sin reserva en otra sala.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión que cubre `cancelar` y `anular` en un día sin reserva y comprueba que la del lunes sigue activa.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y la del lunes sigue activa | ✅ `node --test` 5/5 + lint sin hallazgos; `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ `node --test` 5/5 + lint sin hallazgos; `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` |
| 3 | Gate: `node --test && node scripts/lint.mjs` | ✅ `node --test` 5/5 + lint sin hallazgos; `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-11T18:45Z
- Real: 0,3h (aprox.)
