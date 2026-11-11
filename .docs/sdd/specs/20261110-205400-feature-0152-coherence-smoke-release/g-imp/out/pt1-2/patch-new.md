---
id: 20261111-093820-patch-0015-cancelar-otro-dia
task: 0015
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0015
commit: pendiente
---

# Patch 0015 — cancelar un día sin reserva cancelaba la de otro día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (no existe `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido en la base: `run('cancelar', ['Norte', 'mar'])` → `cancelada Norte mar`, y después `cancelar Norte lun` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: devuelve la primera reserva activa de la sala. `cancelBooking` marca esa reserva como cancelada y responde con el día pedido, de ahí el mensaje engañoso. El patch 0007 corrigió el mismo defecto en otro punto (comparación solo por hora) y dejó este. `voidBooking` comparte `findBooking`, así que `anular` tenía el mismo fallo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión con un módulo recién importado, para no depender del estado que dejan los otros tests.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` → `cancelada Norte mar` (esperado `sin reserva Norte mar`) | ✅ falló por la causa |
| 2 | `node --test` tras el fix → 5/5 | ✅ |

Revisión (un revisor sonnet): sin hallazgos bloqueantes. Hallazgo menor, `anular` sin test → corregido: añadido su test de regresión; `node --test` 6/6.
