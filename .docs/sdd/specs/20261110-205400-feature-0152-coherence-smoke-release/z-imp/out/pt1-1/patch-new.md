---
id: 20261112-184719-patch-0015-cancel-dia
task: 0015
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0015-cancel-dia
commit: ver git log
---

# Patch 0015 — cancelar ignora el día

Validación: dev-lead — es el comportamiento de un comando que usa una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, con la única reserva activa de Norte siendo la del lunes.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo usa: devuelve la primera reserva activa de la sala. `cancelBooking` la marca `cancelled` y responde con el `day` pedido, por eso dice «mar» y cancela «lun». El mismo defecto afecta a `anular`, que usa la misma función. No lo cubre ninguna fila de `debt.md`. Es la misma familia que el patch 0007, que no llegó a filtrar por día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo, proceso propio: el estado de reservas es del proceso)
- **Cambio**: `findBooking` filtra también por `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node src/app.js cancelar Norte mar` (solo hay reserva el lunes) → `sin reserva Norte mar` | ✅ |
| 2 | Test de regresión sin el fix: `actual: 'cancelada Norte mar'`, esperado `'sin reserva Norte mar'` (RED) | ✅ falla por lo esperado |
| 3 | `node --test` con el fix: 6 de 6 en verde; la reserva del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ |

| 4 | `anular Norte mar` sin reserva el martes: sin el fix quita la del lunes; con el fix, test en verde | ✅ |

Revisión del patch (un revisor, sonnet):
- H1 el test dependía del orden de los tests del fichero → arreglado: va en `test/cancel-day.test.js`, proceso propio.
- H2 `anular` sin cobertura → arreglado: segundo test.
- H3 «cancelar una reserva activa» depende del orden → rechazado: ya existía y está fuera del patch.
- H4 metadatos pendientes → completados al cerrar.
