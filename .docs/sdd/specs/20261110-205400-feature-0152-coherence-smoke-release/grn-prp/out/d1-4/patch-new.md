---
id: 20261111-163523-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar una reserva de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar una reserva de otro día

Validación: dev-lead — lo usa una persona desde la terminal y el resultado se ve en la salida del comando.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base (develop, d865c42), con la reserva inicial Norte lun 10:00-12:00:

- `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`
- después `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`

Coincide con lo reportado. `anular` tiene el mismo fallo (usa la misma función).

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js`, línea 11) recibe `day` pero no lo usa: devuelve la primera reserva activa de la sala (`b.room === room && b.status === 'active'`). `cancelBooking` y `voidBooking` la llaman con el día pedido, así que marcan como canceladas o anuladas la reserva de la sala de cualquier día, y el mensaje repite el día pedido, no el de la reserva afectada.

Evidencia: la reproducción de arriba. Con una sola reserva (Norte lun), cualquier día pedido para Norte la encuentra. El parámetro sin usar y la ausencia de `b.day` en el predicado lo confirman. El patch 0007 corrigió la comparación solo por hora en `freeRooms`, no esta función.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo; fichero propio porque las reservas viven en memoria por proceso y `cancel.test.js` ya cancela Norte lun)
- **Cambio**: `findBooking` añade `b.day === day` al predicado.
- **Decisiones**: ninguna sobre lo que el usuario ve: los mensajes `cancelada …` / `sin reserva …` son los que ya existían.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 7/7 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Cancelar Norte mar sin reserva en mar → `sin reserva Norte mar` y la de lun sigue activa | ✅ RED antes del fix (`cancelada Norte mar`), verde después |
| 2 | Anular Norte mar sin reserva en mar → `sin reserva Norte mar` y la de lun sigue activa | ✅ idem |
| 3 | Control: cancelar Norte lun sigue cancelando la de lun | ✅ |

Revisión (un revisor sonnet, causa raíz y fix confirmados):

- La ruta del test en §3 era `cancel.test.js`: corregida a `cancel-day.test.js`.
- Faltaba el control positivo en la tabla: añadido como caso 3.
- El test 3 depende del orden de declaración dentro del fichero: rechazado, es determinista y el fichero lo documenta; el test 3 existe justo para comprobar el estado que dejan los dos primeros.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + ~1 s del gate de cierre (`node --test && node scripts/lint.mjs`; sin gate medido antes, ~1 s según `operations.md`)
- Inicio: 2026-11-11T16:35Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
