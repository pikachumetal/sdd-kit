---
id: 20261112-161036-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: patch/0012
commit:
---

# Patch 0012 — cancelar ignora el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index`: «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Medido en la base: `run('cancelar', ['Norte','mar'])` → `cancelada Norte mar`; después `run('cancelar', ['Norte','lun'])` → `sin reserva Norte lun`. Igual en `anular`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:12`) recibe `day` pero solo filtra por `b.room` y `b.status === 'active'`: devuelve la primera reserva activa de la sala sea del día que sea. `cancelBooking` y `voidBooking` la usan, así que ambas cancelan/anulan la reserva de otro día. Es el mismo defecto de comparación incompleta del patch 0007, en otra función. Deuda: `debt.md` no lo cubre.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-dia.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Un solo punto arregla `cancelar` y `anular`.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests, lint sin hallazgos. Sin el fix, `test/cancel-dia.test.js` falla 2/2 (RED comprobado con stash).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`libres` → Sur) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa | ✅ |

Revisión (sonnet): 3 hallazgos, los tres arreglados. (1) §3 citaba un fichero de test que no existe: corregido. (2) y (3) el test de la reserva del lunes dependía del orden y cubría solo a medias: cada test comprueba ahora con `libres` que la del lunes sigue activa.

## 5. Tiempo (ligero)

- Estimación: 0,3 h + gate de cierre (sin medida previa en el proyecto)
- Inicio: 2026-11-12T16:10Z
- Esfuerzo real: 0,3 h, aproximado con las marcas de los commits
