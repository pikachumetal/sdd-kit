---
id: 20261112-205244-patch-0015-cancelar-otro-dia
task: 0015
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0015-cancelar-otro-dia
commit: pendiente
---

# Patch 0015 — cancelar un día sin reserva cancelaba la de otro día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque no hay capacidades en el proyecto (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`; `anular Norte mar` → `anulada Norte mar` (mismo fallo en `anular`).

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo compara: busca `b.room === room && b.status === 'active'`. Devuelve la primera reserva activa de la sala, de cualquier día. `cancelBooking` y `voidBooking` lo usan, así que ambas actúan sobre la reserva del lunes y responden con el día pedido. Evidencia: las reservas llevan `day` (`{ room: 'Norte', day: 'lun', … }`) y la reproducción de arriba.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día, `cancelar` responde `sin reserva <sala> <día>`, como ya hacía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` daba `cancelada Norte mar` y dejaba sin reserva a `lun` | ❌ antes (2 fallos de 3) |
| 2 | GREEN tras el fix: `node --test` entero (incluye `anular Norte mar` → `sin reserva Norte mar`) | ✅ 5/5 |

Revisión del patch (1 revisor): causa raíz y fix correctos; hallazgo «falta test de `anular`» → corregido (aserción añadida); hallazgo «§4 sin fila GREEN» → corregido; `commit:` se rellena al cerrar.
