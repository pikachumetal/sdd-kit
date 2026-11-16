---
id: 20261112-155208-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque no existe `capabilities/` y ninguna capacidad describe la cancelación.

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual, con la reserva `Norte lun` activa: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte', 'lun'])` devuelve `sin reserva Norte lun`. Coincide con lo reportado. `anular` se comporta igual (`anulada Norte mar`).

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo usa: solo filtra por sala y estado `active`. `cancelBooking` y `voidBooking` la llaman con el día pedido, así que cualquier día encuentra la primera reserva activa de esa sala, la marca y responde con el día que se pidió, no con el de la reserva.

Evidencia: lectura del código y reproducción (ver §1 y §4).

Nota: el patch 0007 («La cancelación ya no borra reservas de otro día con la misma hora», en `CHANGELOG.md`) declara este caso como arreglado, pero `findBooking` no compara `day` en la base actual. El `.docs/sdd/specs/20260918-090000-patch-0007-cancel/patch.md` habla de «comparación solo por hora», que es la de `freeRooms`, no la de `findBooking`. No he investigado por qué no quedó el arreglo; queda dicho para quien lo retome.

## 3. Fix

- **Fichero(s)**: `src/app.js`
- **Cambio**: `findBooking` compara también `b.day === day`. `cancelar` y `anular` lo comparten, así que ambas quedan arregladas por la misma causa.
- **Decisiones**: ninguna sobre lo que el usuario ve; los textos de salida son los que ya existían (`sin reserva <sala> <día>`).

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → corrió 6/6, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` devolvía `cancelada Norte mar` (test/cancel-day.test.js) | ✅ falló por la causa esperada |
| 2 | RED antes del fix: `anular Norte mar` devolvía `anulada Norte mar` (test/void-day.test.js) | ✅ falló por la causa esperada |
| 3 | Tras el fix: `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 4 | Tras el fix: `anular Norte mar` → `sin reserva Norte mar` y `anular Norte lun` → `anulada Norte lun` | ✅ |

Revisor (sonnet): causa raíz, fix y tests confirmados; ningún hallazgo crítico ni importante. Tres menores:

- `freeRooms` filtra solo por franja, no por día (`src/app.js:5-7`): rechazado, es otra función y `libres` no recibe día; decidir qué hace es una feature. Se lo cuento al usuario en la validación.
- `cancelar Norte` sin día da `sin reserva Norte undefined` (`src/app.js:30-31`): rechazado, antes cancelaba la reserva por error y ahora no toca nada; el texto de la entrada sin día no lo fija nadie, sería decidirlo yo.
- `CHANGELOG.md` sigue atribuyendo este caso al patch 0007: se corrige en el corte de la release, que es quien escribe el changelog.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (sin cronometrar en este proyecto)
- Inicio: 2026-11-12T15:45Z (aproximado)
- Esfuerzo real: pendiente de `sdd session tokens` al cerrar
- Coste de sujetos: no aplica
