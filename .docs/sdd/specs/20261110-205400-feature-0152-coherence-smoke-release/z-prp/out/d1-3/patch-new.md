---
id: 20261112-165110-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar no distingue el día
type: patch
solution: causa raíz
status: in-progress
created: 2026-11-12
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar no distingue el día

Validación: dev-lead — es un comando que usa una persona; el agente solo mide la suite.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`; a continuación `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`: la reserva del lunes quedó `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo usa: devuelve la primera reserva `active` de la sala. `cancelBooking` y `voidBooking` solo comprueban que haya una reserva, así que cualquier día cancela (o anula) la primera activa de la sala y contesta con el día pedido. El fix en `findBooking` cubre también `anular`, que comparte la función.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` exige además `b.day === day`.

## 4. Verificación

Los tests de regresión van en ficheros propios: las reservas viven en memoria por proceso y `node --test` corre cada fichero en el suyo; en `cancel.test.js` el primer test ya cancela Norte lun y taparía el fallo.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` → `cancelada Norte mar` (esperado `sin reserva Norte mar`); `anular Norte mar` → `anulada Norte mar` | ✅ falla por la causa |
| 2 | Tras el fix: `node --test` → 6/6 pasan, 0 fallan | ✅ |
| 3 | `node scripts/lint.mjs` → «sin hallazgos» | ✅ |

Revisor (sonnet): sin hallazgos bloqueantes; reprodujo el RED sobre una copia con `src/app.js` del `HEAD` (2 fallos, uno por fichero nuevo). Observaciones:

- `sdd capability index` no verificable desde el repo → rechazada: lo corrí yo y devolvió «Sin capacidades».
- Falta constancia de cómo se obtuvo el RED → arreglada: la fila 1 lleva las salidas reales.
- `commit` y `status` pendientes → se actualizan en el commit de cierre.
- Aviso LF/CRLF de git → rechazada: efecto del `core.autocrlf` de Windows, no del patch.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + ~1 s del gate de cierre (`node --test && node scripts/lint.mjs`; sin medida previa en el proyecto)
- Inicio: 2026-11-12T16:51Z
- Esfuerzo real: (al cerrar)
