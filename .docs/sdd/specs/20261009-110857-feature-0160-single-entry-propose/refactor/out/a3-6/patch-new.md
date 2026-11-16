---
id: 20261009-134212-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido sobre `develop`: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y la reserva de `lun` queda cancelada.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero no lo compara: devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` comparten esa función, así que `anular` tiene el mismo fallo. Es el mismo defecto que el patch 0007 corrigió en otra comparación (por hora) sin llegar a esta.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión que cancela y anula un día sin reserva y comprueba que la reserva de `lun` sigue activa (`libres` no cambia).

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, `lun` intacta | ✅ RED antes (2 fallos), verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar`, `lun` intacta | ✅ |
| 3 | Gate: `node --test` entero | ✅ 5/5 |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-09T13:42Z
- Real: 0,3h (aprox.)
