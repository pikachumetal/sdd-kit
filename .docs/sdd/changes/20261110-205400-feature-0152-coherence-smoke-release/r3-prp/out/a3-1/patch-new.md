---
id: 20261111-185901-patch-0012-cancel-por-dia
task: 0012
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-por-dia
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancelaba la de otro día

Validación: dev-lead — es lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido en la base: `cancelBooking('Norte','mar')` → `cancelada Norte mar`, y a continuación `cancelBooking('Norte','lun')` → `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: busca solo por sala y estado `active`, así que devuelve la primera reserva activa de la sala, de cualquier día. `cancelBooking` la marca `cancelled` y responde con el día pedido. `voidBooking` comparte la función y tiene el mismo fallo. Es la misma causa que arregló el patch 0007 (que corrigió la hora y dejó el día).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/cancel-day.test.js test/void-day.test.js` fallaba con «cancelada Norte mar» y «anulada Norte mar» donde se esperaba «sin reserva Norte mar» | ✅ visto antes del fix |
| 2 | mismo comando tras el fix: 2/2 pasan; `node --test`: 6/6; `node scripts/lint.mjs`: «lint: sin hallazgos» | ✅ |

Fuera del fix, sin tocar: `freeRooms` filtra por franja y no por día (no es este fallo).

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre sin medida previa (patch 0007: 0,5 h)
- Inicio: 2026-11-11T18:59Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica

### Revisión del patch

- Bajo — §3 omitía `test/void-day.test.js`: corregido. Sin más hallazgos; el revisor confirma causa raíz, fix mínimo y que `voidBooking` queda cubierto.
