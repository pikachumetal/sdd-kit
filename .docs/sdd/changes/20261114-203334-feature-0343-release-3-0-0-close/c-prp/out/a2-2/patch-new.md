---
id: 20261116-103900-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: in-progress
created: 2026-11-16
branch: patch/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — es un comando que usa una persona.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

Reportado: «Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual (`develop`, 603623c), con `run` en un solo proceso:

- `cancelar Norte mar` → `cancelada Norte mar` (esperado: `sin reserva Norte mar`).
- Después, `cancelar Norte lun` → `sin reserva Norte lun`: la reserva del lunes ya estaba cancelada.

Coincide con lo reportado. `anular` comparte el defecto.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js:9-11` recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`. `cancelBooking` y `voidBooking` la llaman con el día que escribió la persona, así que devuelven la primera reserva activa de la sala, sea de cualquier día, la marcan y responden con el día pedido.

Los tests existentes no lo ven: `cancelar Sur mar` pasa porque Sur no tiene ninguna reserva.

El patch 0007 del roadmap («la cancelación borraba reservas de otro día con la misma hora») consta como hecho, pero `findBooking` de `develop` sigue sin filtrar por día. No lo he investigado más; queda anotado para el dev-lead.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` exige también `b.day === day`.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → unit: corrió 6/6 · lint: sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel.test.js` → 1 pasa, 3 fallan (`cancelada Norte mar` en vez de `sin reserva Norte mar`; `Norte, Sur` en vez de `Sur`) | ✅ falla por la causa |
| 2 | tras el fix, el mismo comando → 4/4 | ✅ |
| 3 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ |
| 4 | `anular Norte mar` → `sin reserva Norte mar`, misma comprobación | ✅ |

Revisión del patch (un revisor sonnet, sin críticos ni importantes; confirma causa y fix, y que `libres` y `reservar --cada-semana` no se ven afectados):

- Línea de `findBooking` mal citada en §2 (10-12 en vez de 9-11) → corregida.
- Los tests dependen del orden y del estado en memoria compartido del fichero → rechazado: no hay función de reset, el orden de declaración está fijado y `cancelar una reserva activa` (lunes) cierra la secuencia; añadir reset sería cambiar `src/app.js` para testear.
- El test de `anular` no falla por sí solo sin el fix, solo por la contaminación del anterior → rechazado: sin el fix falla igualmente y con él pasa; aislarlo exigiría el mismo reset.
- Sin test aparte de «cancelar el día correcto sigue funcionando después de intentar otro» → rechazado: lo cubre `cancelar una reserva activa` a continuación, y las aserciones de `libres` lo comprueban dentro de cada test.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, suite ~1 s, no cronometrado)
- Inicio: 2026-11-16T10:39Z
- Esfuerzo real: pendiente
