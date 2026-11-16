---
id: 20261116-134824-patch-0012-cancel-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancel-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — `cancelar` lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual (`ff297b7`), en un solo proceso porque las reservas viven en memoria:

```text
run('cancelar', ['Norte', 'mar']) → cancelada Norte mar
run('cancelar', ['Norte', 'lun']) → sin reserva Norte lun
```

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: el `find` solo compara `b.room === room && b.status === 'active'`, así que devuelve la primera reserva activa de la sala sea del día que sea. `cancelBooking` y `voidBooking` comparten esa función: las dos cancelan o anulan la reserva de otro día y mienten en el mensaje, que repite el día pedido. Es el mismo defecto de la familia del patch 0007 (`freeRooms` comparaba por hora): un criterio de la reserva que no entra en la comparación. El test existente `cancelar sin reserva lo dice` pasa por casualidad, porque Sur no tiene ninguna reserva.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`, `test/void.test.js` (nuevo)
- **Cambio**: `findBooking` compara también `b.day === day`. Un único punto de cambio arregla `cancelar` y `anular`.
- **Decisiones**: ninguna. El mensaje de «sin reserva <sala> <día>» ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva → «sin reserva Norte mar» y la del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ RED antes del fix: «cancelada Norte mar»; verde después |
| 2 | `anular Norte mar` sin reserva → «sin reserva Norte mar» y la del lunes sigue activa | ✅ RED antes del fix: «anulada Norte mar»; verde después |
| 3 | `cancelar Norte lun` y `cancelar Sur mar` (tests ya existentes) | ✅ siguen en verde |

Gate: `node --test && node scripts/lint.mjs` → corrió 6/6 · lint sin hallazgos.

Revisor del patch (sonnet, 4 hallazgos):
- Media, test dependiente del orden en `cancel.test.js`: arreglado. El test nuevo va antes del que cancela el lunes y lo dice un comentario; `void.test.js` corre en su propio proceso.
- Baja, ruido de fin de línea: arreglado. Se restauró CRLF y el diff de `cancel.test.js` queda en las líneas añadidas.
- Baja, §3 sin `void.test.js`: arreglado.
- Informativa, lint sin comprobar por el revisor: lo corrió el agente, sin hallazgos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, tests ~1 s; sin medida previa en el proyecto)
- Inicio: 2026-11-16T13:48Z
- Esfuerzo real: pendiente
