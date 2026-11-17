---
id: 20261101-124818-patch-0015-cancel-dia
task: 0015
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-01
branch: feature/0015
commit: pendiente   # lo escribe sdd-archive en el commit de cierre
---

# Patch 0015 — cancelar y anular ignoraban el día

Validación: dev-lead — es un comportamiento que el usuario ve (qué reserva se cancela); lo confirma al cerrar.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (`sdd capability index` → «Sin capacidades»).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido sobre la base actual: `run('cancelar', ['Norte','mar'])` → `cancelada Norte mar`; después `run('cancelar', ['Norte','lun'])` → `sin reserva Norte lun`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero no lo usa: filtra solo por sala y estado `active`, así que devuelve la primera reserva activa de la sala. `cancelBooking` la marca `cancelled` y responde con el `day` pedido, de ahí el «cancelada Norte mar». `voidBooking` comparte `findBooking`, con el mismo fallo. Las reservas ya guardan `day` (`b.day`), solo faltaba compararlo. El patch 0007 arregló lo mismo para la franja horaria, pero no tocó este helper.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Arregla `cancelar` y `anular`.
- **Decisiones**: ninguna sobre lo que el usuario ve: el texto «sin reserva <sala> <día>» ya existía.

## 4. Verificación

Gate: `node --test` → 5/5.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: `cancelar Norte mar` → `cancelada Norte mar` y la del lunes se pierde | ✅ (falló como el reporte) |
| 2 | `cancelar Norte mar` y `anular Norte mar` → `sin reserva Norte mar` | ✅ |
| 3 | La del lunes sigue activa: `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
