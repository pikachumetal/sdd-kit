# Patch 0004 — La cancelación borraba reservas de otro día

## Síntoma

Cancelar una reserva borraba también las de otro día con la misma hora.

## Causa

`cancel()` comparaba solo la hora de la franja, no la fecha.

## Fix

Compara fecha y hora. Test de regresión en `test/cancel.test.js`.

## Tiempo

~20 min.
