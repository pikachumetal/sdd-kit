---
id: 20261116-120942-patch-0012-cancel-day-ignored
task: 0012
title: Patch — cancelar ignoraba el día de la reserva
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancel-day-ignored
commit: pendiente
---

# Patch 0012 — cancelar ignoraba el día de la reserva

Validación: dev-lead — `cancelar` y `anular` los usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (`sdd capability index` devuelve «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, con la única reserva activa de Norte siendo la del lunes. Esperado: `sin reserva Norte mar`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: devuelve la primera reserva `active` de la sala, sea del día que sea. `cancelBooking` la marca `cancelled` y responde con el día pedido, de ahí el mensaje engañoso. `voidBooking` comparte `findBooking`, así que `anular Norte mar` anula la del lunes igual.

Es el mismo patrón que el patch 0007, que arregló `freeRooms` y dejó `findBooking` sin comparar el día. Evidencia: `freeRooms` compara sala y franja; `findBooking` solo sala y estado, y el día aparece en la firma y en el mensaje pero no en el `find`.

No cubre este fallo la deuda abierta («Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo)
- **Cambio**: `findBooking` compara también `b.day === day`. Corrige `cancelar` y `anular`.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y `cancelar Norte lun` sigue dando `cancelada Norte lun` | ✅ RED sin el fix (`cancelada Norte mar`), verde con él |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, y `anular Norte lun` sigue dando `anulada Norte lun` | ✅ RED sin el fix (`anulada Norte mar`), verde con él |

Revisión (un revisor sonnet): (a) el test de `anular` pasaba sin el fix porque el test previo ya consumía la reserva del lunes → arreglado: cada test carga una instancia nueva del módulo y comprueba que la del lunes sigue activa; (b) §3 citaba `test/cancel.test.js` en vez de `test/cancel-day.test.js` → corregido; (c) §4 en «pendiente» → rellenado. Causa raíz y fix, confirmados sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, ~1 s; sin medida previa en patches anteriores)
- Inicio: 2026-11-16T12:05Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-11-16T12:08Z, sin 0 min de espera al dev-lead (0 esperas)
