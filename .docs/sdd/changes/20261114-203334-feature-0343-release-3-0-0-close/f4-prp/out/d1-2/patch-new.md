---
id: 20261116-135646-patch-0012-cancel-ignora-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-16
branch: feature/0012-cancel-ignora-dia
commit: pendiente  # se escribe en el commit de cierre
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — es un comando que usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` dice «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base actual: `run('cancelar', ['Norte','mar'])` → `cancelada Norte mar`; después `run('cancelar', ['Norte','lun'])` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9-11`) recibe `day` pero no lo usa: filtra solo por `room` y `status === 'active'`, y devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la llaman con el día pedido, así que cancelan la reserva de cualquier otro día y responden con el día pedido. Mismo defecto en `anular`. Es la misma familia que el patch 0007, ahora con el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Un test de regresión.

## 4. Verificación

Gate: `node --test && node scripts/lint.mjs` → corrió 5/5 tests · lint sin hallazgos

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `node --test test/cancel.test.js` falló en 2 tests (`cancelada Norte mar` en vez de `sin reserva Norte mar`, y `sin reserva Norte lun` en vez de `cancelada Norte lun`) | ✅ falla por la causa |
| 2 | Tras el fix, `node --test` → 5/5 | ✅ |

Revisión (un revisor sonnet):

- Causa raíz, fix mínimo y que `anular` queda cubierto por la función compartida: confirmados.
- Dependencia del orden entre tests: rechazado. El test siguiente es la comprobación de que el lunes sigue activo, y el comentario del test lo dice.
- `anular` sin test propio: rechazado. Es otro comportamiento a probar; el fix es la misma línea compartida.
- Documentación pendiente: corregido.

## 5. Tiempo (ligero)

- Estimación: 0,3 h
- Inicio: 2026-11-16T13:56Z
- Esfuerzo real: 0,02 h — reloj de la sesión 0,02 h desde 2026-11-16T13:56Z, sin 0 min de espera al dev-lead (0 esperas)
