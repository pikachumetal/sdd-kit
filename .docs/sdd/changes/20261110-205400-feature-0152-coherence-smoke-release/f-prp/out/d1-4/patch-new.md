---
id: 20261112-130640-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-12
branch: feature/0012-cancelar-dia
commit:
---

# Patch 0012 — cancelar y anular ignoraban el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar`, y la reserva de Norte lun queda cancelada.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo usa: devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la usan, así que ambas actúan sobre la reserva de otro día y el mensaje cita el día pedido. Evidencia: el test `test/day.test.js` falla antes del fix con `cancelada Norte mar` en lugar de `sin reserva Norte mar`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/day.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla `cancelar` y `anular`, que comparten la función.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` sin reserva el martes → `sin reserva Norte mar`; la del lunes sigue activa (`anular Norte lun` → `anulada Norte lun`) | ✅ `node --test` → 5/5 (RED antes: `cancelada Norte mar` en vez de `sin reserva Norte mar`); `node scripts/lint.mjs` → sin hallazgos; `node src/app.js cancelar Norte mar` → `sin reserva Norte mar` |


Revisor (sonnet): 1) metadatos sin cerrar → corregido al cerrar; 2) estado compartido en memoria entre tests → rechazado: cada fichero corre en su proceso y `cancel.test.js` ya tiene el patrón; 3) nota sin hueco real → rechazado, `cancel.test.js` cubre el día correcto.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,01 h de gate de cierre (~1 s; sin gate medido en patches anteriores, el de `operations.md`)
- Inicio: 2026-11-12T13:06Z
- Esfuerzo real: 0,03 h — reloj de la sesión 0,03 h desde 2026-11-12T13:05Z, sin 0 min de espera al dev-lead (0 esperas)
