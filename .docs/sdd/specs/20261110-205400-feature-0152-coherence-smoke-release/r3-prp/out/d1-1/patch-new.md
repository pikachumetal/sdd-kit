---
id: 20261111-185910-patch-0012-cancel-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base: `run('cancelar', ['Norte','mar'])` → `cancelada Norte mar`; a continuación `run('cancelar', ['Norte','lun'])` → `sin reserva Norte lun`. Coincide con lo reportado.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10`) recibe `day` y no lo usa: devuelve la primera reserva `active` de la sala. `cancelBooking` y `voidBooking` solo comprueban que haya una, así que cancelan o anulan la del lunes y responden con el día pedido. El patch 0007 arregló la comparación por franja en `freeRooms`, pero no esta función. `voidBooking` (`anular`) tiene el mismo fallo. La deuda («Sin validación del formato de franja horaria») no lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/day.test.js` (nuevo)
- **Cambio**: `findBooking` exige también `b.day === day`. Con ello `cancelar` y `anular` sin reserva ese día devuelven `sin reserva <sala> <día>`, texto que ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ RED: devolvía `cancelada Norte mar`; ahora OK |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ cubierto en el mismo test (`test/day.test.js`) |

Gate: `node --test && node scripts/lint.mjs` → suite: corrió 5/5 · lint: sin hallazgos

Revisión del patch (sonnet): 3 corregido (§3 nombraba el fichero de test equivocado); 4 corregido (el test cierra con `anular Norte lun` → `anulada Norte lun`, caso positivo); 5 rechazado (cada fichero de test corre en su proceso y el test es único; no hay orden que romper); 1, 2 y 6 sin cambios.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,01 h del gate de cierre (~1 s, sin medición previa)
- Inicio: 2026-11-11T18:55Z
- Esfuerzo real: pendiente
