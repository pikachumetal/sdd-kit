---
id: 20261111-170311-patch-0012-cancelar-dia
task: 0012
title: Patch — cancelar y anular ignoran el día
type: patch
solution: causa raíz
status: done
created: 2026-11-11
branch: feature/0012-cancelar-dia
commit: pendiente
---

# Patch 0012 — cancelar y anular ignoran el día

Validación: dev-lead — lo usa una persona desde la terminal.

## Capacidades

- Ninguna, porque ninguna capacidad describe `cancelar` ni `anular` (no existe `.docs/sdd/capabilities/`).

## 1. Síntoma

«si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes.»

Reproducido en la base (`develop`, 61228d3) con la reserva inicial `Norte lun`:

```text
run('cancelar', ['Norte', 'mar']) -> cancelada Norte mar
run('cancelar', ['Norte', 'lun']) -> sin reserva Norte lun
```

## 2. Causa raíz

`findBooking(room, day)` (`src/app.js:11-13`) recibe `day` pero no lo usa: busca la primera reserva activa de la sala. `cancelBooking` y `voidBooking` la llaman con el día pedido, así que cancelan o anulan la reserva de cualquier otro día de esa sala, y el mensaje repite el día pedido, no el de la reserva afectada.

Evidencia: el cuerpo de `findBooking` solo compara `b.room === room && b.status === 'active'`; la reproducción de arriba lo confirma. Ninguna fila de `debt.md` lo cubre. Es determinista: no hay que interpretar requisitos, porque `cancelar` sin reserva ya devuelve `sin reserva <sala> <día>`.

`anular` tiene el mismo fallo por compartir `findBooking`.

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/cancel-day.test.js` (fichero nuevo: las reservas viven en memoria y `cancel.test.js` ya cancela `Norte lun`)
- **Cambio**: `findBooking` compara también `b.day === day`. Test de regresión: con `Norte lun` activa, `cancelar Norte mar` y `anular Norte mar` dan `sin reserva Norte mar`, y después `cancelar Norte lun` sigue dando `cancelada Norte lun`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `node --test test/cancel-day.test.js` sin el fix | ❌ esperado: `sin reserva Norte mar`, obtenido: `cancelada Norte mar` (el síntoma reportado) |
| 2 | GREEN: el mismo comando tras el fix | ✅ 1/1 |
| 3 | Gate: `node --test && node scripts/lint.mjs` | ✅ 5/5 · lint: sin hallazgos |

Diff sin tests ni documentación: 1 fichero, 1 línea.

Revisor (sonnet, effort medium): causa raíz y fix confirmados. Un hallazgo bajo: la aserción de `anular` iba antes y tapaba la de `cancelar`, y el RED solo mostraba `anular`. Corregido: `cancelar` va primero y el RED se repitió sin el fix, ahora con `cancelada Norte mar`.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, ~1 s; sin gate medido en el proyecto). Referencia: patch 0007, 0,5 h reales.
- Inicio: 2026-11-11T17:03Z
- Esfuerzo real: pendiente
- Coste de sujetos: no aplica
