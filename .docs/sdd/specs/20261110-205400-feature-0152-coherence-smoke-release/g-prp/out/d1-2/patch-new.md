---
id: 20261112-152419-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo que usa una persona (`cancelar` desde la terminal) lo valida quien lo usa.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`, y la única reserva de Norte (lunes) pasa a `cancelled`. Debería decir `sin reserva Norte mar` y no tocar nada.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero el `find` solo compara `b.room === room && b.status === 'active'`: devuelve la primera reserva activa de la sala, sea del día que sea. `cancelBooking` entonces no cae en `sin reserva` y marca como cancelada la del lunes, pero imprime el día pedido. `voidBooking` usa la misma función y tiene el mismo fallo (`anular Norte mar` anula la del lunes). Es el mismo patrón que el patch 0007 (`freeRooms` comparaba solo hora): una comparación a la que le falta una clave. La hipótesis del reporte («me quita la del lunes») queda confirmada en el código, no solo en el síntoma.

Deuda: `debt.md` no tiene ninguna fila que lo cubra.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`, `test/void.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Corrige `cancelar` y `anular`, que comparten la función.
- **Tests**: `test/cancel.test.js` (el caso de `cancelar` pasa a comprobar el día) y `test/void.test.js` (nuevo, `anular`), RED antes del fix.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; después `cancelar Norte lun` → `cancelada Norte lun` (la del lunes seguía activa) | ✅ RED antes (`cancelada Norte mar`), verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar`; `anular Norte lun` → `anulada Norte lun` | ✅ RED antes (`anulada Norte mar`), verde después |
| 3 | `node src/app.js cancelar Norte mar` a mano | ✅ `sin reserva Norte mar` |

Gate: `node --test && node scripts/lint.mjs` → 5/5 tests, lint sin hallazgos.

Revisión (un revisor, sonnet): 1) el test dependía del orden de los tests del fichero → corregido, ahora cada test se basta solo; 2) faltaba el caso positivo de `anular` → añadido; 3) `void.test.js` ausente en §3 → corregido; 4) aviso CRLF de git, anterior al patch (`src/app.js` ya era CRLF) → rechazado, sin cambio.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, unos segundos; sin medida previa del gate completo)
- Inicio: 2026-11-12T15:24Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
