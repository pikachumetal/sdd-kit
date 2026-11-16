---
id: 20261116-104350-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar otro día cancelaba la reserva de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar otro día cancelaba la reserva de otro día

Validación: dev-lead — la salida de `cancelar` y `anular` es lo que una persona ve en la terminal, y nadie ha autorizado que valide el agente.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`; la reserva de Norte del lunes pasa a `cancelled`. Esperado: `sin reserva Norte mar`, el mismo formato que `test/cancel.test.js` ya fija para `sin reserva Sur mar`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:8-10`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Con una reserva activa de Norte el lunes, cualquier `cancelar Norte <día>` la encuentra, la cancela y responde con el día pedido. Las reservas se guardan con `day` (`bookings[0].day === 'lun'`), así que el dato existía y faltaba compararlo.

`voidBooking` usa el mismo `findBooking`: `anular Norte mar` anula la del lunes igual. Misma causa, un solo arreglo.

Nota: el patch 0007 (`.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`) ya trató una comparación incompleta (solo por hora); este es otro sitio con el mismo tipo de defecto. La deuda (`.docs/sdd/steering/debt.md`) no lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` añade `b.day === day` al criterio.
- **Decisiones**: ninguna (el texto `sin reserva <sala> <día>` ya existe en el código y en el test de `Sur mar`).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y después `cancelar Norte lun` → `cancelada Norte lun` (la del lunes seguía activa). RED sin el fix: `cancelada Norte mar` | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, y después `anular Norte lun` → `anulada Norte lun`. Falla sin el fix por sí solo | ✅ |

Gate: `node --test && node scripts/lint.mjs` → corrió 6/6 · lint sin hallazgos.
Revisión (subagente sonnet, 5 hallazgos, todos atendidos): el test de `anular` pasaba en parte por el orden y los tests compartían estado → corregido, cada test importa el módulo con su estado (`fresh()`) y falla por separado sin el fix; finales de línea CRLF de `cancel.test.js` restaurados; referencias de §1–§3 corregidas; el estado «lunes sigue activa» ahora lo comprueba un `cancelar`/`anular` real del lunes.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,0003 h del gate de cierre (~1 s, sin medida previa en el proyecto)
- Inicio: 2026-11-16T10:43Z
- Esfuerzo real: pendiente
