---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Cancelar con motivo (`src/app.js`, `test/cancel.test.js`) — `0efc145`: `cancelar <sala> <día> --motivo <motivo>` con lista cerrada (cambio de planes, sala ocupada, otro); motivo fuera de la lista o ausente responde «motivo no válido: …».
- Listado de canceladas (`src/app.js`, `test/cancel.test.js`) — `f1ce84d`: comando `canceladas`, una línea «sala día — motivo» por reserva cancelada.
- Capacidad nueva `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`).

## 2. Tiempo y coste: estimado vs real

No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda, «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` entero (gate de la constitución): 5/5 en verde, 0 fallos, ~0,4 s, sobre el commit de cierre (tras `f1ce84d` solo cambia `.docs/`).
- Gate: `node --test` → suite única: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 3/3 THEN con ejecución real (el listado, en un solo proceso: ver 4.3) · revisión final Spec y Código limpias sobre `f1ce84d`; lo posterior solo cambia `.docs/`, sin re-revisión.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) + suite | ok |
| motivo fuera de la lista (`me aburro`) → «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI) + suite | ok |
| sin `--motivo` → el mismo mensaje | ejecución real (CLI) | ok |
| `canceladas` tras cancelar → «Norte lun — sala ocupada» | ejecución real (un proceso: `run('cancelar')` y `run('canceladas')`) | ok; por CLI en dos invocaciones sale vacío (ver 4.3) |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: en dos invocaciones seguidas de la CLI, `canceladas` no ve lo cancelado por la anterior. Lo cubre la fila 0014 «Motivo guardado» del roadmap; no se abre deuda.
- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) — fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- El motivo vive con la reserva cancelada y la lista cerrada está en `src/app.js`; el comportamiento observable vive en `capabilities/bookings.md` → capacidad `bookings` (no se duplica en `architecture.md`).

Retro: sin señales

## 6. Adendas

- _Ninguna_
