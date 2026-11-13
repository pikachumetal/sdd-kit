---
id: 20261112-162138-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — es una orden que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

Reportado: «Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido en la base actual (`develop`, `fcbab84`), con solo la reserva de Norte del lunes:

- `node src/app.js cancelar Norte mar` → `cancelada Norte mar` (esperado: `sin reserva Norte mar`).
- `node src/app.js anular Norte mar` → `anulada Norte mar`, con el mismo efecto: la reserva del lunes queda anulada.

Coincide con lo reportado y además afecta a `anular`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo usa: solo compara `b.room === room && b.status === 'active'`. Devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` y `voidBooking` la marcan como cancelada o anulada y responden con el `day` que pidió el usuario, de ahí «cancelada Norte mar» sobre la reserva del lunes.

Evidencia: la reserva sembrada es `{ room: 'Norte', day: 'lun', … }`, y las dos órdenes con `mar` encuentran esa reserva. Los dos tests rojos lo reproducen.

Nota: el patch 0007 (`.docs/sdd/specs/20260918-090000-patch-0007-cancel/`) y la entrada de `Fixed` del CHANGELOG declaran este mismo fallo como corregido, pero el código de la base no tiene esa corrección. Este patch lo arregla de verdad; no toca el registro de 0007.

## 3. Fix

- **Fichero(s)**: `src/app.js`; tests nuevos `test/cancel-day.test.js` y `test/void-day.test.js`.
- **Cambio**: `findBooking` compara también `b.day === day`. `cancelar` y `anular` lo comparten, así que ambas quedan corregidas.
- **Decisiones**: ninguna sobre lo que el usuario ve o puede hacer; el texto `sin reserva <sala> <día>` ya existe.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y Norte sigue ocupada | ❌ antes: `cancelada Norte mar` · ✅ ahora |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y Norte sigue ocupada | ❌ antes: `anulada Norte mar` · ✅ ahora |
| 3 | `cancelar Norte lun` sigue cancelando la reserva del lunes | ✅ `cancelada Norte lun` |

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests en verde, `lint: sin hallazgos`. La copia del RED fuera del repo coincide con los tests de la rama.

Revisión del patch (un revisor, Sonnet, effort medium; sin hallazgos críticos ni importantes: causa raíz y corrección confirmadas):

1. Causa raíz correcta y completa — sin cambios.
2. Corrección mínima y suficiente; `findBooking` solo la llaman `cancelBooking` y `voidBooking` — sin cambios.
3. Menor, estado de módulo compartido entre ficheros de test — rechazado: fragilidad previa de `src/app.js`, no introducida aquí; `node --test` aísla cada fichero y refactorizar el estado queda fuera de un patch.
4. Menor, la aserción de `libres` depende de que `libres` no mire el día — rechazado: es comportamiento observable de hoy; si `libres` pasa a mirar el día, ese cambio actualizará el test.
5. Menor, inconsistencias del registro — arreglado: `commit` y la validación se rellenan al cerrar; el texto de los tests ya no dice «commiteados». `develop` es la rama de integración (constitución, art. 3) y la base real del patch, así que `develop` se queda. El revisor no ejecutó el lint; lo corrí yo: `lint: sin hallazgos`.

Comprobado de nuevo tras la revisión: los tests nuevos fallaban sin la corrección (cancelada/anulada Norte mar, medido antes de editar `src/app.js`) y ahora pasan.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + ~1 s de gate de cierre (`node --test`, ~1 s según operations; sin cierre anterior medido)
- Inicio: 2026-11-12T16:21Z
- Esfuerzo real: pendiente
