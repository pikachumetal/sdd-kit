---
id: 20261111-194713-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la línea de comandos y el agente no observa su uso real.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `node src/app.js cancelar Norte mar` → `cancelada Norte mar` (esperado: `sin reserva Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: el `find` compara solo `room` y `status === 'active'`, así que devuelve la primera reserva activa de la sala, sea de qué día sea. `cancelBooking` la marca `cancelled` y responde con el `day` pedido, de ahí «cancelada Norte mar» con la reserva del lunes. `voidBooking` (`anular`) llama a la misma función y tiene el mismo fallo. El patch 0007 arregló lo análogo en `libres` (comparación por franja), no aquí. La deuda (`debt.md`) no tiene fila que lo cubra.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Cubre `cancelar` y `anular`.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests · lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y `cancelar Norte lun` sigue → `cancelada Norte lun` (`test/cancel-day.test.js`; RED: `cancelada Norte mar`) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, y `anular Norte lun` sigue → `anulada Norte lun` (`test/void-day.test.js`; RED: `anulada Norte mar`) | ✅ |

Revisor (sonnet): causa, fix y alcance confirmados, sin otro uso de `findBooking` con el defecto.
- Hallazgo 1 (baja, estado de módulo compartido entre tests): rechazado. Cada fichero corre en su proceso con `node --test`, como ya hace `cancel.test.js`; con `--test-isolation=none` ya fallaba el preexistente. Fuera del alcance del patch.
- Hallazgo 2 (baja, §4 sin `anular` y caso «pendiente»): corregido.
- Informativo: `libres` compara solo la franja y no el día. No es este fallo; se lo digo al dev-lead para que decida si va a la deuda.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre ~1 s (`node --test && node scripts/lint.mjs`; sin gate medido antes en el proyecto)
- Inicio: 2026-11-11T19:47Z
- Esfuerzo real: pendiente
