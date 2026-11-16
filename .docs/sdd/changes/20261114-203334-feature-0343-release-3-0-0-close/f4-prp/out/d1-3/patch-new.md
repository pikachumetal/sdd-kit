---
id: 20261116-140447-patch-0012-cancel-day
task: 0012
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012
commit: b3baeac
---

# Patch 0012 — cancelar ignora el día

Validación: dev-lead — lo usa una persona desde la línea de comandos.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base (`feature/0012`, sin cambios): con la única reserva activa `Norte lun`, `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar` y la reserva del lunes queda `cancelled`. Lo medido coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: filtra solo por `b.room === room && b.status === 'active'` y devuelve la primera reserva activa de la sala. `cancelBooking` la encuentra aunque sea de otro día, la marca `cancelled` y responde con el día pedido, no con el de la reserva cancelada.

`voidBooking` (`anular`) llama a la misma función y tiene el mismo fallo. Es la misma causa: un único arreglo en `findBooking`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` también exige `b.day === day`. Sin reserva ese día, `cancelar` y `anular` devuelven `sin reserva <sala> <día>`, el mensaje que ya existía, y no tocan otras reservas.
- **Decisiones**: ninguna sobre lo que el usuario ve o puede hacer: el texto `sin reserva …` ya existe.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → node --test: 5/5 · lint: sin hallazgos

RED antes del fix (`node --test test/cancel.test.js`): 1 pasa, 2 fallan; `cancelar Norte mar` devolvía `cancelada Norte mar` (esperado `sin reserva Norte mar`) y después `cancelar Norte lun` devolvía `sin reserva Norte lun`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ test «cancelar un día sin reserva no toca la de otro día» + «cancelar una reserva activa» (lun sigue cancelable) |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ mismo test (`libres` sigue sin Norte) |

Revisión (1 revisor sonnet): (1) el test depende del orden del fichero, porque `bookings` es estado de módulo — aceptado, con un comentario en el test que lo dice; (2) tabla duplicada en §4 — corregido.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, sin medida previa en el proyecto)
- Inicio: 2026-11-16T14:04Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-16T14:03Z, sin 0 min de espera al dev-lead (0 esperas)
