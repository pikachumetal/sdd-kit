---
id: 20261111-201648-patch-0012-cancel-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancel-dia
commit: <hash>
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base actual: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero no lo compara: devuelve la primera reserva activa de la sala. Con la reserva de Norte del lunes, cualquier día cancela esa. `voidBooking` usa la misma función y tiene el mismo fallo. Es el mismo defecto de comparación que el patch 0007, en otra dimensión (aquel arreglaba la hora).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Los textos de salida no cambian.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `cancelar Norte mar` daba `cancelada Norte mar` (esperado `sin reserva Norte mar`) | ✅ falla antes, pasa después |
| 2 | RED: `anular Norte mar` daba `anulada Norte mar` (esperado `sin reserva Norte mar`) | ✅ falla antes, pasa después |
| 3 | `cancelar Norte lun` sigue cancelando la reserva del lunes | ✅ |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (~1 s)
- Inicio: 2026-11-11T20:16Z
- Esfuerzo real: aproximado con las marcas de los commits, ~0,3 h
- Coste de sujetos: no aplica

Revisión (un revisor, sonnet): causa raíz, fix y tests correctos, sin hallazgos que cambien el fix.
- Fila 2 de la tabla describía el RED por su efecto y no por la primera aserción que falla → corregido.
- `commit: <hash>` se rellena en el commit de cierre → pendiente, por diseño.
- Caso de día distinto con reserva en ese día, no cubierto → rechazado: queda fuera del síntoma y `===` lo resuelve.
