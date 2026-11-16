---
id: 20261011-164849-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancelar-dia
commit: acc649f
---

# Patch 0012 — cancelar y anular ignoraban el día

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido sobre `develop`: `cancelar Norte mar` responde `cancelada Norte mar` y la reserva del lunes queda cancelada; después `cancelar Norte lun` responde `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: filtra solo por sala y `status === 'active'`. Devuelve la primera reserva activa de la sala, sea del día que sea, y `cancelBooking` la marca como cancelada y responde con el día pedido. `voidBooking` usa el mismo `findBooking`, así que `anular` tenía el mismo fallo. Es el mismo defecto de fondo que el patch 0007 (comparación incompleta de la clave de la reserva), en el otro campo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión en fichero aparte porque las reservas viven en memoria y cada fichero de test arranca con las suyas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`; la del lunes sigue activa | ✅ test rojo antes del fix, verde después |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ mismo test |
| 3 | `cancelar Norte lun` → `cancelada Norte lun` | ✅ mismo test |
| 4 | Gate de cierre `node --test && node scripts/lint.mjs` | ✅ |

Validado: 2026-10-11 · «Sí, como patch.» · no detalló qué probó

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Inicio: 2026-10-11T16:48Z
- Real: 0,3h (aproximado)
