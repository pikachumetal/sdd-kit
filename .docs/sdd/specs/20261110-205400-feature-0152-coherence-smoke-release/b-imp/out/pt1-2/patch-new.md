---
id: 20261110-211208-patch-0015-cancel-dia
task: 0015
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-10
branch: feature/0015-cancel-dia
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoran el día

Validación: dev-lead — es lo que usa una persona: comprobar que cancelar un día sin reserva no quita la de otro.

## Capacidades

- Ninguna, porque el fix devuelve `cancelar` a lo que ya dice 0007 y ninguna capacidad describe `cancelar` (`sdd capability index`: sin capacidades).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido: `run('cancelar',['Norte','mar'])` → `cancelada Norte mar`; después `run('cancelar',['Norte','lun'])` → `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:12`) recibe `day` y no lo usa: devuelve la primera reserva activa de la sala, de cualquier día. `cancelBooking` la marca `cancelled` y responde con el día pedido, de ahí el mensaje falso. `voidBooking` usa la misma función y tiene el mismo fallo. Es el mismo defecto que arregló 0007 (comparación incompleta), esta vez por el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `node --test test/cancel-day.test.js` rojo antes (`actual 'cancelada Norte mar'`, esperado `sin reserva Norte mar`) y verde después | ✅ verde (pass 1, fail 0) |
| 2 | `node --test` entero | ✅ 5/5 |

Revisión (1 revisor, sonnet): sin hallazgos bloqueantes. Hallazgo bajo «sin test de regresión para `anular`»: rechazado, `voidBooking` no tiene lógica propia de búsqueda y comparte `findBooking`, que el test de `cancelar` ya ejercita; un test más sería un segundo comportamiento fuera del síntoma reportado.
