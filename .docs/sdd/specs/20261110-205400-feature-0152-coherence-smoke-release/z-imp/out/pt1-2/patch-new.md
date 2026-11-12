---
id: 20261112-190447-patch-0015-cancelar-dia
task: 0015
title: Patch — cancelar ignoraba el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0015
commit: pendiente
---

# Patch 0015 — cancelar ignoraba el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, con la única reserva de Norte siendo la del lunes.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: busca la primera reserva activa de la sala. `cancelBooking` la marca `cancelled` y responde con el día pedido, no con el de la reserva. `voidBooking` (`anular`) usa la misma función y tiene el mismo fallo. Distinto del patch 0007 (que corrigió otra comparación).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin día coincidente, `cancelar` y `anular` devuelven `sin reserva <sala> <día>`, el texto que ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes: antes `cancelada Norte mar` y perdía la del lunes; ahora `sin reserva Norte mar` y `cancelar Norte lun` sigue dando `cancelada Norte lun` | ✅ RED visto (2 fallos) y GREEN |

Gate: `node --test` → 5/5.

Revisor (sonnet), sin hallazgos bloqueantes:
- Causa raíz y fix (también `anular`): confirmados.
- Test dependiente del orden: rechazado. El test siguiente (`cancelar Norte lun`) es la comprobación de que la del lunes sigue activa, y el comentario del test lo avisa; hacerlo autocontenido obligaría a reiniciar el estado del módulo o a tocar un test existente.
- `anular` sin test: arreglado, el test nuevo comprueba también `anular Norte mar`.
