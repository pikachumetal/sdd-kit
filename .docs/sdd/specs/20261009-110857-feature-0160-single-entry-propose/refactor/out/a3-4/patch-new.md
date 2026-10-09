---
id: 20261009-133135-patch-0012-cancelar-otro-dia
task: 0012
title: Patch — cancelar un día sin reserva cancelaba la de otro día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancelar-otro-dia
commit: pendiente
---

# Patch 0012 — cancelar un día sin reserva cancelaba la de otro día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Medido sobre la base actual: `run('cancelar', ['Norte', 'mar'])` devuelve `cancelada Norte mar`, y a continuación `run('cancelar', ['Norte', 'lun'])` devuelve `sin reserva Norte lun`. Coincide con lo reportado. `anular` tiene el mismo fallo.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: busca la primera reserva activa de la sala (`b.room === room && b.status === 'active'`). Con solo la reserva del lunes, `cancelar Norte mar` la encuentra y la cancela, y el mensaje reutiliza el `day` pedido, de ahí «cancelada Norte mar». `cancelBooking` y `voidBooking` llaman a `findBooking`, así que ambos comandos tienen el fallo. Es una regresión del mismo tipo que la del patch 0007, que corrigió la comparación por hora y dejó la del día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión nuevo para `cancelar` y `anular`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, `anular Norte mar` igual, Norte sigue ocupada en `10:00-12:00` y `cancelar Norte lun` → `cancelada Norte lun` | ✅ rojo sin el fix, verde con él |
| 2 | Gate de cierre `node --test && node scripts/lint.mjs` | ✅ 5/5 tests, lint sin hallazgos |

Verificado por el agente; pendiente de validación del usuario.

## 5. Tiempo (ligero)

- Estimación: no aplica (`estimation.md`: los patches registran solo el tiempo real)
- Inicio: 2026-10-09T13:31Z
- Real: 0,1h (aprox.)
