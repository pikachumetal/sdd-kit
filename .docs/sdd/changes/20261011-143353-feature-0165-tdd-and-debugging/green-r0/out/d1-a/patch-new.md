---
id: 20261011-163858-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular ignoraban el día
type: patch
solution: causa raíz
status: done
created: 2026-10-11
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoraban el día

## Capacidades

Ninguna, porque el fix devuelve `cancelar` y `anular` a lo que dice su propio argumento `<sala> <día>` y ninguna capacidad lo describe (el proyecto no tiene `.docs/sdd/capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido sobre `develop`: `node src/app.js cancelar Norte mar` → `cancelada Norte mar`, y la reserva de Norte del lunes queda `cancelled`.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` pero no lo usa: devuelve la primera reserva activa de la sala. `cancelBooking` y `voidBooking` confían en ese resultado, así que cancelan (o anulan) la de cualquier día y devuelven un mensaje con el día pedido. `anular` tiene el mismo fallo. Evidencia: el test de regresión falla en rojo antes del cambio para los dos comandos.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel.test.js`
- **Cambio**: `findBooking` también compara `b.day === day`. Un solo punto arregla `cancelar` y `anular`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar`, la del lunes sigue activa | ✅ test + ejecución real |
| 2 | `anular Norte mar` → `sin reserva Norte mar` | ✅ test |
| 3 | `cancelar Norte lun` → `cancelada Norte lun` | ✅ |
| 4 | Gate: `node --test && node scripts/lint.mjs` | ✅ 6/6, lint sin hallazgos |

## 5. Tiempo

- Estimación: 0,5h
- Inicio: 2026-10-11T16:38Z
- Real: 0,3h (aproximado)
