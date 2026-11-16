---
id: 20261112-091324-patch-0032-cancelar-ignora-dia
task: 0032
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0032-cancelar-ignora-dia
commit: pendiente
---

# Patch 0032 — cancelar ignora el día

Validación: dev-lead — es una orden que se usa desde la terminal y el dev-lead es quien la usa.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`capabilities/` no existe).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: con la reserva de Norte del lunes activa, `cancelar Norte mar` responde `cancelada Norte mar` y la reserva del lunes queda cancelada. Un `cancelar Norte lun` posterior responde `sin reserva Norte lun`. Coincide con lo reportado. `anular` usa la misma búsqueda (leído en el código, no medido).

## 2. Causa raíz

`findBooking(room, day)` de `src/app.js` recibe `day` y no lo usa: busca la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la llaman con el día pedido, así que con cualquier día encuentran la reserva de otro día. La reserva de las `bookings` ya lleva `day` (`{ room: 'Norte', day: 'lun', … }`), por lo que el dato existe y falta compararlo.

Evidencia: lectura de `findBooking` (`b.room === room && b.status === 'active'`, sin `b.day`) y el test rojo de §4. La hipótesis del reporte («me quita la del lunes») se confirma con el código.

El patch 0007 («La cancelación borraba reservas de otro día con la misma hora») describe este mismo síntoma como arreglado, pero el código de `develop` no compara el día. No he buscado por qué: queda fuera de este patch.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Al ser compartida, `anular` queda corregida sin otro cambio.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel-day.test.js` → `pass 0 · fail 1`, `actual: 'cancelada Norte mar', expected: 'sin reserva Norte mar'` | ✅ reproduce el síntoma |
| 2 | GREEN tras el fix: `node --test test/cancel-day.test.js` → `pass 1`; comparado con la copia RED guardada fuera del repo (`git diff --no-index`): sin diferencias | ✅ |
| 3 | `node --test` entero → `tests 5 · pass 5 · fail 0` (con los 2 tests de `cancel.test.js` y los 2 de `app.test.js`) | ✅ |
| 4 | `anular` usa la misma búsqueda y queda corregida; no he añadido test propio para ella | ⚠️ cubierta solo por el cambio compartido |

Revisión (un revisor sonnet): sin hallazgos críticos. Menores respondidos: la evidencia del RED y de la copia va literal en las filas 1 y 2 (corregido); «medido» no cubre `anular` (corregido en §1); `commit:` se rellena al cerrar (aceptado).
