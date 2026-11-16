---
id: 20261116-120659-patch-0012-cancel-dia
task: 0012
title: Patch — cancelar con día sin reserva quita la reserva de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancel-dia
commit: pendiente
---

# Patch 0012 — cancelar con día sin reserva quita la reserva de otro día

Validación: dev-lead — lo que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no hay `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual con una sola reserva (Norte, lun):

- `cancelar Norte mar` → `cancelada Norte mar`
- `cancelar Norte lun` a continuación → `sin reserva Norte lun` (la del lunes ya estaba cancelada)

Misma causa en `anular` (la anulación del responsable), que no se reportó.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero el predicado solo compara `b.room === room && b.status === 'active'`: nunca mira `b.day`. Devuelve la primera reserva activa de la sala, sea de cuando sea. `cancelBooking` y `voidBooking` confían en ese resultado, cambian su estado y devuelven un mensaje con el `day` que pidió el usuario, no el de la reserva que tocaron; por eso el mensaje parece correcto.

Evidencia: el parámetro `day` aparece sin usar en la firma; la reproducción de §1. Mismo patrón que el patch 0007 (comparar por menos campos de los debidos), esta vez en la búsqueda por sala.

## 3. Fix

- **Fichero(s)**: `src/app.js`
- **Cambio**: `findBooking` añade `b.day === day` al predicado.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `test/cancel-dia.test.js`: `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ rojo antes del fix (`cancelada Norte mar`), verde después |
| 2 | `test/anular-dia.test.js`: ídem con `anular` | ✅ rojo antes del fix (`anulada Norte mar`), verde después |

## 5. Tiempo (ligero)

- Estimación: 0,5 h (+ gate de cierre)
- Inicio: 2026-11-16T12:06Z
- Esfuerzo real: pendiente

Gate: `node --test && node scripts/lint.mjs` → 6/6 en verde, lint sin hallazgos.

Revisor (sonnet): causa raíz y fix correctos, tests fallan sin el fix y pasan con él, sin dependencia de orden. Un hallazgo bajo (la tabla de §4 decía «pendiente»): corregido.
