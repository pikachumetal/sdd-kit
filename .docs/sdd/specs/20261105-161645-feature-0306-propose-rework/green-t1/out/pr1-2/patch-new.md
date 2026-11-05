---
id: 20261105-170517-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-05
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar ignora el día

Validación: dev-lead — el comportamiento de `cancelar` lo observa quien reserva.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y la reserva de `lun` queda `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` no usa `day`: devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la usan y cancelan/anulan la de otro día; el mensaje repite el `day` pedido. Es el mismo fallo que el patch 0007 (comparación incompleta), esta vez por el día. `anular` lo comparte.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin día coincidente, `cancelar` y `anular` dicen `sin reserva <sala> <día>`, texto que ya existía.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, lint sin hallazgos.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; la de `lun` sigue activa (`libres` = Sur; luego `cancelar Norte lun` → `cancelada Norte lun`) | ✅ RED antes (`cancelada Norte mar`), GREEN después |
| 2 | `anular Norte mar` → `sin reserva Norte mar`; `anular Norte lun` → `anulada Norte lun` (fichero propio, sin estado compartido) | ✅ RED sin el fix: 2 fallan de 6; con él 6/6 |

Revisión (Sonnet): Important — el test de `anular` compartía estado con el de `cancelar` y pasaba sin el fix → arreglado: fichero propio `void-day.test.js` y comprobación de que `lun` sigue activa; verificado quitando el fix (fallan 2 de 6). Minor — recuento 6/6: confirmado con `node --test`. Minor — `commit: pendiente` se rellena al cerrar (`sdd-archive`).

## 5. Tiempo (ligero)

- Estimación: 0,5 h (post hoc): no calibra. Gate de cierre ~1 s (suite `node --test`).
- Inicio: 2026-11-05T17:04Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-11-05T17:04Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
