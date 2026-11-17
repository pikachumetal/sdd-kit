---
solution: causa raíz
---

# Patch — cancel-day

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `cancelar Norte mar` → `cancelada Norte mar`; después `cancelar Norte lun` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo compara: devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la comparten, así que `anular` falla igual. Evidencia: la reserva única es `{ room: 'Norte', day: 'lun' }` y `findBooking('Norte', 'mar')` la devuelve.

## 3. Fix

Añadir `b.day === day` al predicado de `findBooking`. Sin decisiones sobre lo que ve el usuario: el mensaje `sin reserva <sala> <día>` ya existe.

## 4. Verificación

- Sin el fix (con `src/app.js` apartado): `node --test test/cancel.test.js` → 2 fallan. `cancelar otro día no toca la reserva de lunes` devolvía «cancelada Norte mar»; `cancelar una reserva activa` devolvía «sin reserva Norte lun».
- Con el fix: `node --test && node scripts/lint.mjs` → 6 pasan, 0 fallan; «lint: sin hallazgos».

Revisor (sonnet), hallazgos:

1. Causa raíz correcta — sin cambio.
2. Fix mínimo y suficiente (cubre `cancelar` y `anular`) — sin cambio.
3. El test de `anular` no corta de forma independiente — corregido a medias: separado en dos tests. El de `anular` solo falla sin el fix si corre antes que el de `cancelar`, porque comparten la única reserva; lo cubre el de `cancelar`, ya que `findBooking` es la única función con el fallo.
4. Depende del orden y del estado compartido — rechazado: los tests del fichero ya comparten el estado en memoria; un assert extra sobre lunes consumiría la reserva y rompería el test siguiente.
5. §4 pendiente — corregido con este texto.
6. `freeRooms` filtra por franja, no por día — fuera de alcance, no se toca.

Commit del fix: (se escribe al cerrar)

## 5. Tiempo

- Estimación: 0,3 h + 0,55 h de gate de cierre (sin medida previa; gate ~1 s, valor supuesto)
- Inicio: 2026-11-12 16:20 UTC
