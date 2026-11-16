---
id: 20261115-183746-patch-0012-cancel-day
task: 0012
title: Patch — cancelar y anular miran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-15
branch: feature/0012-cancel-day
commit: pendiente
---

# Patch 0012 — cancelar y anular miran el día

Validación: dev-lead — es una herramienta que usa una persona; lo comprueba con su caso (`cancelar Norte mar`).

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (el proyecto no tiene `capabilities/`).

## 1. Síntoma

«Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base: `node src/app.js cancelar Norte mar` imprime `cancelada Norte mar` con la única reserva activa de Norte en lunes. `anular` comparte el fallo.

## 2. Causa raíz

`findBooking(room, day)` en `src/app.js` recibe `day` y no lo usa: busca la primera reserva activa de la sala (`b.room === room && b.status === 'active'`). `cancelBooking` y `voidBooking` la llaman, así que con una reserva activa de Norte el lunes, pedir cualquier otro día de Norte la encuentra, la marca y responde con el día pedido. Es determinista: pasa siempre que la sala tenga una reserva activa en otro día. Mismo patrón que el patch 0007 (comparación incompleta), que no tocó esta función. Sin fila de deuda que lo cubra.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (nuevo), `test/void-day.test.js` (nuevo)
- **Cambio**: `findBooking` exige también `b.day === day`. Sin reserva ese día, `cancelar` y `anular` responden `sin reserva <sala> <día>`, como ya hacían sin reserva.
- **Decisiones**: ninguna; el texto de salida ya existía.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `cancelar Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`cancelar Norte lun` → `cancelada Norte lun`) | ✅ RED: 2 fallos (`cancelada Norte mar`, `sin reserva Norte lun`); GREEN tras el fix |
| 2 | `anular Norte mar` → `sin reserva Norte mar` y la del lunes sigue activa (`anular Norte lun` → `anulada Norte lun`) | ✅ RED: 2 fallos (`anulada Norte mar`, `sin reserva Norte lun`); GREEN tras el fix |

Gate: `node --test && node scripts/lint.mjs` → 8/8 tests en verde (4 nuevos), lint sin hallazgos. `node src/app.js cancelar Norte mar` → `sin reserva Norte mar`.

Revisión (un revisor, sonnet): causa raíz y fix correctos; el RED se reprodujo en una copia del HEAD (4 fallos).
- Hallazgo: §3 citaba `test/cancel.test.js` y los tests están en dos ficheros nuevos → corregido.
- Hallazgo: §4 con casos «pendiente» → rellenado con lo medido.
- Hallazgo (info): el segundo test de cada fichero depende del orden → rechazado: cada fichero corre en su propio proceso, el orden está comentado en el test y, con el bug, falla de forma explícita.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, ~1 s; sin medida previa en el repo)
- Inicio: 2026-11-15T18:37Z
- Esfuerzo real: pendiente
