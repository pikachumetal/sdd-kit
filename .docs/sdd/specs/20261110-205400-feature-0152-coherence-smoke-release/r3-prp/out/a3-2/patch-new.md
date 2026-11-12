---
id: 20261111-194715-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancelaba la de otro día

Validación: dev-lead — lo que usa una persona es el comando `cancelar`.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte', 'lun'])` → `sin reserva Norte lun`: la reserva del lunes ya estaba cancelada.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:11`) recibe `day` y no lo usa: busca solo por `room` y `status === 'active'`. Devuelve la primera reserva activa de la sala, sea de otro día, y `cancelBooking` la marca `cancelled` y responde con el día pedido.

`voidBooking` (`anular`) usa la misma función y tiene el mismo fallo. El patch 0007 decía haber arreglado esto («comparación solo por hora») pero el código de la base nunca comparó el día; ese patch no dejó test de regresión sobre el día (`test/cancel.test.js` solo cubre `lun` con reserva y `Sur mar` sin ninguna).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla `cancelar` y `anular` a la vez porque comparten la función.
- **Decisiones**: ninguna sobre lo que el usuario ve: el texto `sin reserva <sala> <día>` ya existe.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ RED: `cancelada Norte mar`; GREEN: `node --test test/cancel.test.js` 3/3 |

Revisión (un revisor, sonnet):

- Test frágil por orden — rechazado: el test va primero y lo avisa un comentario; `node --test` es secuencial dentro del fichero y cada fichero corre en su proceso.
- Ruido de finales de línea en el diff de `test/cancel.test.js` — corregido: restaurado CRLF, el diff muestra solo las 6 líneas nuevas.
- `anular` sin test — rechazado: no cambia su comportamiento observable más allá de compartir `findBooking`; un test propio sería un segundo test de comportamiento, fuera de un patch.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, ~1 s la suite; sin gate previo medido)
- Inicio: 2026-11-11T19:46Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-11-11T19:46Z, sin 0 min de espera al dev-lead (0 esperas)
