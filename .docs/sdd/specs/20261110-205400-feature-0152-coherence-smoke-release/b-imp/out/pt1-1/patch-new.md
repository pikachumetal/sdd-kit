---
id: 20261110-210821-patch-0015-cancelar-dia
task: 0015
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-10
branch: feature/0015-cancelar-dia
commit: pendiente
---

# Patch 0015 — cancelar y anular ignoran el día

Validación: dev-lead — es un comando que usa una persona y el resultado se ve en la respuesta.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y la reserva de Norte del lunes pasa a `cancelled` (una segunda llamada, `cancelar Norte lun`, ya dice `sin reserva Norte lun`). `run('anular', ['Norte', 'mar'])` devuelve `anulada Norte mar`: mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. Devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la llaman, cambian el estado de esa reserva y construyen el mensaje con el `day` que les pasaron, no con el de la reserva. De ahí que diga «Norte mar» y cancele la del lunes. Las reservas ya guardan su día (`b.day`), así que el dato existe.

El test `cancel.test.js` no lo detectó: solo cancela `Norte lun` (la única reserva) y `Sur mar` (sala sin reservas).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día, `cancelBooking` y `voidBooking` ya devuelven `sin reserva <sala> <día>`, el texto que el programa ya usaba.
- **Decisiones**: ninguna.

## 4. Verificación

Gate: `node --test` → corrió 6/6 (antes del fix, los 2 tests nuevos en rojo por la causa: `cancelar Norte mar` daba `cancelada Norte mar`, `anular Norte mar` daba `anulada Norte mar`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, y la del lunes sigue activa | ✅ |
| 3 | `cancelar Norte lun` y `cancelar Sur mar` siguen igual | ✅ |

Los tests nuevos van cada uno en su fichero (`cancel-day.test.js`, `void.test.js`): el estado de las reservas es del módulo y `node --test` aísla cada fichero en su proceso. `cancel.test.js` no cambia.

**Revisor (sonnet):** sin hallazgos bloqueantes; causa raíz y fix confirmados.

- Dependencia de orden en `cancel.test.js` y ruido de finales de línea en su diff: arreglado, el test nuevo va en `cancel-day.test.js` y `cancel.test.js` queda intacto.
- Falta el caso positivo de `anular` (`anulada Norte lun`): rechazado, no es de este fallo; la ruta feliz ya no cambia.
- `cancelar Norte` sin día ahora dice `sin reserva Norte undefined` (antes cancelaba la primera reserva activa): rechazado, es la deuda «sin validación del formato» del roadmap, y decidir el mensaje es decisión del dev-lead; queda dicho al usuario.
- `commit: pendiente`: se rellena en el commit de cierre.
