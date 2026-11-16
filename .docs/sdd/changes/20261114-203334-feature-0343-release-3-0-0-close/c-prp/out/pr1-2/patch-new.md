---
id: 20261116-115834-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal y el comportamiento lo juzga ella.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido: con la reserva semilla de Norte el lunes, `cancelar Norte mar` devuelve `cancelada Norte mar`; después `cancelar Norte lun` devuelve `sin reserva Norte lun`. Coincide con lo reportado. `anular` comparte el helper y falla igual.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: solo compara `b.room === room && b.status === 'active'`. Con cualquier día pedido encuentra la primera reserva activa de la sala, la del lunes. `cancelBooking` y `voidBooking` la marcan y responden con el día pedido, de ahí el mensaje engañoso. Las reservas ya llevan `day` (`{ room: 'Norte', day: 'lun', … }`), así que el dato existe y falta compararlo. Mismo patrón que el patch 0007 (comparación incompleta), esta vez en el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Los mensajes existentes no cambian.
- **Decisiones**: ninguna.

## 4. Verificación

Gate: `node --test` · `node scripts/lint.mjs` → 6/6 tests en verde, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar` y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ RED antes (`cancelada Norte mar`), verde después |
| 2 | `anular Norte mar` igual | ✅ RED antes, verde después |

Revisión (un revisor sonnet): causa y fix confirmados, sin hallazgos medios ni altos. Respuestas:

- Los tests nuevos dependen del orden por el estado en memoria compartido: aceptado, queda el comentario en el test; un reinicio de estado sería refactor fuera del patch.
- `cancelar` sin día ahora responde `sin reserva Norte undefined`: rechazado, la validación de argumentos es otra petición.
- Día en mayúsculas no coincide: rechazado, fuera de alcance.
- Falta test del camino feliz de `anular`: rechazado, no cambia con este fix.
- `status`/`commit` del encabezado: se actualizan al cerrar.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + 0,02 h del gate de cierre (~1 s, sin medida previa)
- Inicio: 2026-11-16T11:58Z
- Esfuerzo real: pendiente
