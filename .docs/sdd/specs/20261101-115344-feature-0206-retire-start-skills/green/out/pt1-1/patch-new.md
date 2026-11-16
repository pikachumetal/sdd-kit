---
id: 20261101-124232-patch-0015-cancel-day
task: 0015
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-11-01
branch: feature/0015-cancel-day
commit: 5a44490
---

# Patch 0015 — cancelar y anular ignoraban el día

Validación: dev-lead — es un cambio de lo que responde `cancelar`/`anular`, y un humano debe confirmarlo.

## Capacidades

- Ninguna, porque no existe `.docs/sdd/capabilities/` y ninguna capacidad describe `cancelar` ni `anular`.

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»
Reproducido sobre `develop`: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`; `anular Norte mar` → `anulada Norte mar`.

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:9`) recibe `day` pero no lo usa: filtra solo por sala y estado `active`. Devuelve la primera reserva activa de la sala (la del lunes), la marca como cancelada y la respuesta repite el día pedido. `voidBooking` usa la misma función, con el mismo fallo. Mismo defecto de fondo que el patch 0007 (comparación incompleta), esta vez en el día.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` compara también `b.day === day`. Sin reserva ese día responde `sin reserva <sala> <día>`, como ya hacía sin reserva alguna.

## 4. Verificación

Gate: `node --test` → 6/6.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (RED antes, verde ahora) | ✅ |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (RED antes, verde ahora) | ✅ |
| 3 | `cancelar Norte lun` sigue devolviendo `cancelada Norte lun` | ✅ |
