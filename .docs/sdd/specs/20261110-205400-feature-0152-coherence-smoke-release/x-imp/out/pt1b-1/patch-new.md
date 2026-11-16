---
id: 20261112-205301-patch-0032-cancelar-otro-dia
task: 0032
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0032-cancelar-otro-dia
commit: pendiente
---

# Patch 0032 — cancelar y anular ignoraban el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base: `node src/app.js cancelar Norte mar` → `cancelada Norte mar` (Norte solo tiene reserva el lunes). `anular Norte mar` → `anulada Norte mar`: mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero no lo usa: busca la primera reserva activa de la sala (`b.room === room && b.status === 'active'`). `cancelBooking` y `voidBooking` la llaman con el día pedido, así que cualquier día encuentra la reserva de otro día y la cambia de estado. Es el mismo defecto que el patch 0007 corrigió en `libres` por la hora; aquí falta el día. Evidencia: la reproducción de arriba, y `cancelar Sur mar` → `sin reserva Sur mar` porque Sur no tiene ninguna activa.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` también compara `b.day === day`. `cancelBooking` y `voidBooking` quedan arreglados sin tocarlas.
- **Decisiones**: ninguna sobre lo que el usuario ve: el texto `sin reserva <sala> <día>` ya existía.

## 4. Verificación

Gate: `node --test` → corrió 6/6.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED en la base sin el fix: `node --test test/cancel.test.js` → 2 tests nuevos fallan (`cancelada Norte mar` y `anulada Norte mar` en vez de `sin reserva Norte mar`), 2 previos pasan | ✅ |
| 2 | `cancelar Norte mar` → `sin reserva Norte mar` y después `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 3 | `anular Norte mar` → `sin reserva Norte mar` y después `anular Norte lun` → `anulada Norte lun` | ✅ |

Revisor (sonnet, `sdd-kit:effort-medium`):

- Orden de los tests y estado compartido (media): corregido; cada test nuevo carga su copia del módulo con `import('../src/app.js?<id>')`.
- Comprobación indirecta con `libres` (baja) y falta de test directo del lunes tras el intento fallido: corregido; ahora se cancela o anula el lunes después del martes.
- CRLF del test (baja): corregido; el fichero conserva CRLF y el diff son solo líneas añadidas.
- Referencia `src/app.js:12` (baja): corregida a `src/app.js:9`.
- §4 inconsistente (media): corregido; cuentas, comandos y casos reescritos.
- `status: done` con `commit: pendiente`: rechazado; es la plantilla, y el hash se escribe en el commit de cierre.
