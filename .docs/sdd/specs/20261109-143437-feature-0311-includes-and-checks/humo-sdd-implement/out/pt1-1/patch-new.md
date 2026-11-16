---
id: 20261109-161853-patch-0015-cancelar-dia
task: 0015
title: Patch — cancelar y anular miran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-09
branch: feature/0015
commit: pendiente
---

# Patch 0015 — cancelar y anular miran el día

Validación: dev-lead — es una orden que usa una persona; la prueba el dev-lead.

## Capacidades

- Ninguna, porque ninguna capacidad describe la cancelación (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido: con la reserva de Norte del lunes, `cancelar Norte mar` responde `cancelada Norte mar`, y después `cancelar Norte lun` responde `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` de `src/app.js` recibe `day` pero no lo usa: filtra solo por sala y estado `active`, y devuelve la primera reserva activa de la sala. Las reservas sí guardan su día (`day: 'lun'`), así que el dato existe; la comparación no lo mira. `cancelBooking` y `voidBooking` usan `findBooking`, por eso `cancelar` cancela la reserva de otro día y el mensaje usa el día pedido, no el de la reserva. `anular` tiene el mismo fallo.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js`, `test/void-day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`.
- **Tests**: `test/cancel-day.test.js` y `test/void-day.test.js`, uno por orden, cada uno en su fichero porque el estado del módulo se comparte dentro de un fichero y el test de `cancel.test.js` ya cancela la reserva del lunes.

## 4. Verificación

Gate: `node --test` → corrió 6/6.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` devolvía `cancelada Norte mar`; `anular Norte mar`, `anulada Norte mar` (`node --test`: 4 pasan, 2 fallan) | ✅ falla por el síntoma |
| 2 | Tras el fix: `cancelar Norte mar` → `sin reserva Norte mar`, y la del lunes sigue activa (`cancelar Norte lun` → `cancelada Norte lun`); lo mismo con `anular` | ✅ `node --test`: 6 pasan, 0 fallan |

Hallazgos del revisor (3, todos en este documento): §3 listaba un fichero de test que no se toca → corregido; §2 comparaba con el patch 0007 sin que el repo lo sostenga → frase retirada; `commit:` queda en «pendiente» hasta el commit de cierre de `sdd-archive`, que escribe el hash → rechazado, es el flujo. Código y tests: sin hallazgos.
