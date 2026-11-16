---
id: 20261116-103939-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la línea de comandos y producción estaba parada por esto.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` → «Sin capacidades»).

## 1. Síntoma

Reportado: «si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes».

Reproducido en la base (`develop`, 5047a82):

```text
$ node src/app.js cancelar Norte mar
cancelada Norte mar
```

Esperado: `sin reserva Norte mar`, con la reserva del lunes intacta. `anular Norte mar` falla igual (`anulada Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` y no lo usa: filtra solo por `b.room === room && b.status === 'active'`. Cualquier reserva activa de la sala casa con cualquier día.

Evidencia:

- `bookings` (`src/app.js:3`) tiene un único elemento, `{ room: 'Norte', day: 'lun', … status: 'active' }`. Con un solo elemento, buscar desde el principio o desde el final devuelve el mismo, así que la hipótesis del reporte (el orden del array) **no es la causa** y el cambio que proponía no arreglaba nada.
- `cancelBooking` y `voidBooking` (`src/app.js:13-25`) llaman a `findBooking` con `day`, así que ambas heredan el fallo.
- El patch 0007 (`.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md`: «comparación solo por hora») es de la misma familia, pero el código actual de `findBooking` no compara la hora ni el día; no he podido comprobar qué cambió aquel fix porque el historial solo tiene un commit.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. `cancelBooking` y `voidBooking` quedan arregladas sin tocarlas.

## 4. Verificación

RED antes del fix (sin el cambio de `src/app.js`, `node --test test/cancel-day.test.js test/void-day.test.js`): 0/2. `cancelar un día sin reserva…` falla con `actual: 'cancelada Norte mar'`, `expected: 'sin reserva Norte mar'`; `anular un día sin reserva…` falla con `actual: 'anulada Norte mar'`, mismo `expected`. Los tests no cambiaron entre el RED y el commit (`git diff --no-index` contra la copia del RED, vacío).

Después del fix: `node --test` → 6/6 · `node scripts/lint.mjs` → «sin hallazgos» · `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` · `node src/app.js anular Norte mar` → `sin reserva Norte mar`.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la reserva del lunes sigue activa (`libres 10:00-12:00` → `Sur`) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la reserva del lunes sigue activa | ✅ |
| 3 | `cancelar Norte lun` sigue devolviendo `cancelada Norte lun` (test existente) | ✅ |

Revisor del patch (`sdd-kit:effort-medium`, sonnet): sin hallazgos críticos; causa raíz y fix confirmados.

- Los tests dependían del orden y el de `anular` no fallaba por sí solo sin el fix (estado en memoria compartido): **arreglado**, un fichero por caso (`node --test` lanza un proceso por fichero), RED repetido con 0/2.
- `status: done` con `commit: pendiente`: **rechazado**, `status: done` es el valor de la plantilla y `sdd-archive` escribe el hash en el commit de cierre.
- Frase del RED no comprobable: **arreglado**, ahora con la salida del RED repetido y la comparación contra la copia.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre `node --test && node scripts/lint.mjs` (0,14 s la suite, medido hoy en la base)
- Inicio: 2026-11-16T10:39Z
- Esfuerzo real: pendiente (lo escribe el cierre)
