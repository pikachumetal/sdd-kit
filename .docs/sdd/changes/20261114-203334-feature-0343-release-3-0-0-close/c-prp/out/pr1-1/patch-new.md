---
id: 20261115-203043-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, con la única reserva de Norte en lunes.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` pero no lo usa: filtra solo por sala y estado `active`, así que devuelve la primera reserva activa de la sala sea de qué día sea. `cancelBooking` y `voidBooking` la usan y devuelven el día pedido, no el de la reserva tocada. `voidBooking` (anular) tiene el mismo fallo. Misma familia que el patch 0007 (comparación incompleta de la reserva).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ RED con el código original (`cancelada Norte mar`; luego `sin reserva Norte lun`) → verde con el fix |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ RED con el código original (`anulada Norte mar`) → verde con el fix; fichero aparte porque el estado en memoria se comparte dentro de un fichero |

Gate: `node --test && node scripts/lint.mjs` → `node --test`: corrió 8/8 · lint: sin hallazgos

Revisión (1 revisor, sonnet): causa, fix y tests correctos; sin hallazgos altos ni medios. Un punto menor, rechazado: el segundo test de cada fichero depende del orden con el primero (con `--test-name-pattern` pasaría de forma trivial). Es inherente al estado en memoria compartido por fichero, está avisado en un comentario del test, y partirlo exigiría tocar `src/app.js` para reiniciar el estado, fuera de un patch mínimo.

## 5. Tiempo (ligero)

- Estimación: 0,25 h + gate de cierre (`node --test && node scripts/lint.mjs`, segundos; sin medida previa)
- Inicio: 2026-11-15T20:30Z
- Esfuerzo real: pendiente
