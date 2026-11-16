---
id: 20261009-122303-patch-0012-cancel-day
task: 0012
title: Patch — cancelar ignora el día
type: patch
solution: causa raíz
status: done
created: 2026-10-09
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar ignora el día

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.» Reproducido: `cancelar Norte mar` devuelve `cancelada Norte mar` y deja la reserva `Norte lun` en `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: busca solo `b.room === room && b.status === 'active'` y devuelve la primera reserva activa de la sala. `cancelBooking` compone el mensaje con el `day` pedido, no con el de la reserva encontrada, así que el aviso confirma un día que no se canceló. `voidBooking` (`anular`) usa la misma función y tenía el mismo fallo. Es el mismo defecto que el patch 0007 (comparar por un solo campo), pero en la otra dimensión.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión en fichero propio, porque el estado de reservas es de módulo y `cancel.test.js` ya cancela `Norte lun`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y `cancelar Norte lun` sigue cancelando | ✅ |
| 2 | El test nuevo falla sin el fix y pasa con él | ✅ |
| 3 | Gate `node --test && node scripts/lint.mjs` | ✅ 5/5, lint sin hallazgos |

## 5. Tiempo

- Real: 0,3h
