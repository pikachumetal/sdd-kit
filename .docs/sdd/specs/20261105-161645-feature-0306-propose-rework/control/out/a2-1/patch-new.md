---
id: 20261105-210910-patch-0012-cancelar-ignora-dia
task: 0012
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-05
branch: feature/0012-cancelar-ignora-dia
commit: 8bf08c1
---

# Patch 0012 — cancelar ignora el día

Validación: dev-lead — el usuario es quien observa el comando `cancelar`.

## Capacidades

Ninguna, porque ninguna capacidad describe `cancelar` (`sdd capability index` devuelve «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:10-12`) recibe `day` pero no lo usa: devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` cancela esa reserva (la del lunes) y responde con el día pedido. `voidBooking` usa la misma función, así que `anular Norte mar` anula la del lunes igual.

La suite actual no lo ve: `cancelar sin reserva lo dice` usa Sur, que no tiene ninguna reserva.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Dos tests de regresión, uno por `cancelar` y otro por `anular`.

## 4. Verificación

Gate: `node --test test/` → 6/6 (el proyecto no tiene tareas de build).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` daba `cancelada Norte mar` (esperado `sin reserva Norte mar`); idem `anular` | ✅ falla por la causa esperada |
| 2 | `cancelar Norte mar` → `sin reserva Norte mar`, y después `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 3 | `anular Norte mar` → `sin reserva Norte mar`, y después `anular Norte lun` → `anulada Norte lun` | ✅ |
| 4 | `node src/app.js cancelar Norte mar` | ✅ imprime `sin reserva Norte mar` |

Revisor (sonnet, effort medium): sin hallazgos. Confirma la causa, que el fix cubre las dos llamadas a `findBooking` y que los tests fallan sin el fix.

Validación: pendiente (`sdd-archive`).

## 5. Tiempo (ligero)

- Estimación: 0,5 h (tiempo real del patch 0007; sin gate de cierre medido en el proyecto)
- Inicio: 2026-11-05T21:09Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-05T21:08Z, sin 0 min de espera al dev-lead (1 espera)
