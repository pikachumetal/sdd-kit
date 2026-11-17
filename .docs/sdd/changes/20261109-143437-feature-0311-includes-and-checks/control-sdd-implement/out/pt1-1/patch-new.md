---
id: 20261109-192534-patch-0015-cancelar-dia
task: 0015
title: Patch — cancelar respeta el día
type: patch
solution: causa raíz
status: done
created: 2026-11-09
branch: feature/0015-cancelar-dia
commit: pendiente
---

# Patch 0015 — cancelar respeta el día

Validación: dev-lead — es lo que usa una persona al cancelar una reserva.

## Capacidades

Ninguna, porque ninguna capacidad describe `cancelar` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual (`develop`, 8631bb0): `cancelar Norte mar` responde `cancelada Norte mar`, y a continuación `cancelar Norte lun` responde `sin reserva Norte lun`: la reserva del lunes quedó cancelada.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: busca la primera reserva `active` de la sala. `cancelBooking` cancela lo que encuentra y responde con el día pedido, no con el de la reserva cancelada. Con la reserva `Norte lun` como única activa, cualquier día de Norte la encuentra.

Es la misma familia que el patch 0007 (comparación incompleta al buscar la reserva), pero otro campo: aquel corrigió la hora, este el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. `voidBooking` (`anular`) usa la misma función, así que `anular` queda corregido igual.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel-day.test.js` falla con actual `cancelada Norte mar`, esperado `sin reserva Norte mar` | ✅ |
| 2 | Tras el fix, `cancelar Norte mar` → `sin reserva Norte mar`; después `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 3 | `node --test` entero: 5 de 5 | ✅ |
| 4 | `anular Norte mar` → `sin reserva Norte mar` (aserción añadida tras la revisión); sin el fix el test falla (0 pass, 1 fail) | ✅ |

Revisión (un revisor, sin Críticos ni Importantes): `anular` sin probar → corregido con la aserción del caso 4; «`develop` no existe» → rechazado, la rama sale de `develop`; evidencia del RED → rechazado, la salida del fallo está en el caso 1.
