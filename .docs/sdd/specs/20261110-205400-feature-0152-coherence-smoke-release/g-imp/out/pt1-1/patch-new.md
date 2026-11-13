---
id: 20261111-093139-patch-0015-cancel-dia
task: 0015
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0015-cancel-dia
commit: <hash>
---

# Patch 0015 — cancelar y anular ignoraban el día

Validación: dev-lead — es una orden de la terminal que usa una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base (`develop`, 564606f), con la reserva `Norte lun 10:00-12:00` y `Norte mar` sin reservar:

```text
$ node src/app.js cancelar Norte mar
cancelada Norte mar
```

En un solo proceso, porque el estado vive en memoria:

```text
cancelar Norte mar → cancelada Norte mar
cancelar Norte lun → sin reserva Norte lun
```

Coincide con lo reportado: el martes responde éxito y la reserva del lunes queda cancelada.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10`) recibe `day` y no lo usa: devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la llaman y marcan lo que devuelve, así que pedir un día sin reserva cancela la de otro día y responde `cancelada <sala> <día pedido>`. Cada reserva ya guarda su `day` (`bookings`, línea 3), así que el dato para comparar existe.

El patch 0007 corrigió una comparación solo por hora; esta es la misma clase de fallo en otra función (`findBooking`), no la misma línea.

`anular` comparte `findBooking`, así que tiene el mismo fallo (`anular Norte mar` anula la del lunes). El mismo arreglo de la causa lo cubre, sin tocar `voidBooking`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day` (1 línea). Test de regresión nuevo en `test/cancel.test.js` (6 líneas), colocado antes del que cancela Norte lun porque el estado en memoria se comparte dentro del fichero.
- **Decisiones**: ninguna sobre lo que el usuario ve: `sin reserva <sala> <día>` ya existía para cancelar sin reserva.

## 4. Verificación

Gate: `node --test` → 5/5 en verde. Antes del arreglo fallaban el test nuevo y el de Norte lun (`actual: 'cancelada Norte mar'`, esperado `'sin reserva Norte mar'`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` con solo la reserva del lunes respondía `cancelada Norte mar` | ✅ visto fallar |
| 2 | `cancelar Norte mar` → `sin reserva Norte mar`, y `libres 10:00-12:00` → `Sur` (la del lunes sigue activa) | ✅ |
| 3 | `cancelar Norte lun` después → `cancelada Norte lun` | ✅ (test existente) |
| 4 | `anular Norte mar` → `sin reserva Norte mar`; `anular Norte lun` → `anulada Norte lun` (misma causa) | ✅ medido en un proceso, sin test propio |

Revisión del patch (un revisor, sonnet): sin hallazgos graves; confirma la causa, el arreglo y que el test nuevo falla sin él.

- Test dependiente del orden (baja): rechazado. `node:test` ejecuta los tests de un fichero en orden de declaración, y el comentario del test lo deja dicho.
- `anular` sin test propio (baja): rechazado. Es la misma causa y el mismo arreglo; un test de `anular` sería comportamiento aparte, fuera de un patch de un fallo.
