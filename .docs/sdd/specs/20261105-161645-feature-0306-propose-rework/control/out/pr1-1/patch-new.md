---
id: 20261106-094631-patch-0012-cancel-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-06
branch: feature/0012-cancel-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — la salida de `cancelar` y `anular` la ve una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y después `run('cancelar', ['Norte', 'lun'])` devuelve `sin reserva Norte lun`. Coincide con lo reportado. `anular` tiene el mismo fallo (misma búsqueda).

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo usa: solo filtra por `room` y `status === 'active'`. `cancelBooking` y `voidBooking` delegan en ella, así que cualquier día encuentra la primera reserva activa de la sala, y el mensaje reutiliza el día escrito por quien invoca, no el de la reserva. Evidencia: lectura de `src/app.js` y reproducción de §1. Mismo patrón que el patch 0007, que comparaba solo por hora.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js` (ficheros aparte: `node --test` corre cada uno en su proceso y no comparten el estado de `bookings`)
- **Cambio**: `findBooking` compara también `b.day === day`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar`, y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ RED: `cancelada Norte mar`; GREEN tras el fix |
| 2 | `anular Norte mar` igual → `sin reserva Norte mar`, la del lunes sigue activa | ✅ RED: `anulada Norte mar`; GREEN tras el fix |
| 3 | `anular Norte lun` (el día de la reserva) → `anulada Norte lun` | ✅ RED: `sin reserva Norte lun` (la había anulado el caso 2 sin fix); GREEN tras el fix |

Comando: `node --test` → 7/7 pass (4 previos + 3 nuevos) · `node scripts/lint.mjs` → `lint: sin hallazgos`. Sin el fix, los 3 tests nuevos fallan (3/3 fail).

Revisión del patch (Sonnet, sin Críticos ni Importantes):
- Menor: los dos tests compartían estado y el RED del segundo solo valía aislado → arreglado: un fichero por test.
- Menor: `anular` sin prueba positiva → arreglado: caso 3.
- Menor: §3 nombraba `test/cancel.test.js`, que no cambia → arreglado.
- Observación: `cancelar Norte` sin día ya no cancela nada (antes cancelaba la primera reserva de la sala); es lo correcto y queda dicho aquí.

## 5. Tiempo (ligero)

- Estimación: 0,5 h (sin gate de cierre medido en patches previos)
- Inicio: 2026-11-06T09:46Z
- Esfuerzo real: no medido (`sdd session tokens` no encuentra respuestas de la rama en los transcripts); aproximado 0,3 h
