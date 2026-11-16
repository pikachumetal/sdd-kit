---
id: 20261112-184803-patch-0032-cancelar-otro-dia
task: 0032
title: Patch — cancelar un día sin reserva cancela la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0032-cancelar-otro-dia
commit: <hash>
---

# Patch 0032 — cancelar un día sin reserva cancela la de otro día

Validación: dev-lead — lo que usa una persona (`cancelar` y `anular`) lo valida el dev-lead.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `capabilities/`).

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`. Dentro de un mismo proceso (`run()`), un `cancelar Norte lun` posterior responde `sin reserva Norte lun`, porque la reserva del lunes quedó en `cancelled`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10`) recibe `day` pero no lo usa: filtra solo por `b.room === room && b.status === 'active'` y devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` marca esa reserva como `cancelled` y devuelve `cancelada ${room} ${day}` con el día pedido, no con el de la reserva que cambió. Por eso el mensaje dice «mar» y la afectada es la del lunes.

Evidencia: reproducido arriba; la única reserva del almacén es `{ room: 'Norte', day: 'lun' }` y `cancelar Norte mar` la cancela. `voidBooking` (`anular`) llama a la misma `findBooking`, así que tiene el mismo fallo; se arregla con el mismo cambio en el origen. No hay fila de deuda que lo cubra (la única «Por triar» es la validación de franjas).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo; fichero aparte porque el almacén es estado del módulo y `cancel.test.js` ya cancela el lunes)
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva activa ese día, `cancelar` y `anular` responden `sin reserva <sala> <día>` (texto que ya existía) y no tocan ninguna otra.
- **Decisiones**: ninguna; el texto y el comportamiento esperados ya existen en el código.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ RED antes del fix: `cancelada Norte mar`; GREEN después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ RED antes del fix, comprobado solo con `--test-name-pattern`: `anulada Norte mar`; GREEN después |

Comando: `node --test` → tests 6, pass 6, fail 0. A mano: `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` (la CLI no conserva estado entre procesos: que la del lunes sigue activa lo prueban los tests con `libres`, no la CLI).

Revisión (un revisor, sin hallazgos sobre causa, fix ni test):

- Medición con dos comandos de CLI no reproducible entre procesos: corregida en §1 y arriba.
- Filas 1 y 2 con el mismo resultado: corregidas; el RED de `anular` se comprobó aislado.
- Aserción indirecta con `libres`: rechazada, es la única reserva del almacén y no hay otra forma de leerla sin exportar estado; los tests de `cancelar` y `anular` comparten almacén pero con el fix no lo mutan.
