---
id: 20261111-162653-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — es un CLI que usa una persona; el agente solo ha medido con tests, y la frase de la petición no autoriza validar al agente.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index`: sin capacidades).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base (`e3c8e56`): con solo `Norte lun` reservada, `run('cancelar', ['Norte','mar'])` devuelve `cancelada Norte mar`, y después `run('cancelar', ['Norte','lun'])` devuelve `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`) recibe `day` y no lo usa: el predicado solo compara `b.room === room` y `b.status === 'active'`. Devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` la marca `cancelled` y responde con el `day` de la petición, no con el de la reserva que ha cancelado. `voidBooking` usa la misma función: `anular Norte mar` tiene el mismo fallo.

Es determinista y no interpreta requisitos: «sin reserva» ya es lo que el producto responde cuando no hay reserva (test `cancelar sin reserva lo dice`).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test` con `test/cancel-day.test.js` y `test/void-day.test.js` sobre la base: 2 fallan (`cancelada Norte mar` / `anulada Norte mar` en vez de `sin reserva Norte mar`), 4 pasan | ✅ rojo por la razón correcta |
| 2 | `node --test` tras el fix: pass 6, fail 0; `node scripts/lint.mjs`: sin hallazgos. `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 3 | Revisor (sonnet): un hallazgo bajo, §3 listaba `test/cancel.test.js` en vez de los dos tests nuevos | ✅ corregido; sin más hallazgos (causa, fix y tests confirmados) |

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre (~1 s, `node --test && node scripts/lint.mjs`; sin medición previa)
- Inicio: 2026-11-11T16:26Z
- Esfuerzo real: pendiente
