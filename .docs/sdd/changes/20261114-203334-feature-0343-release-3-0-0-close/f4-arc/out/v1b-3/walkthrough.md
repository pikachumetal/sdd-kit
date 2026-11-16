---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-16
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 8747059.
- `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso. `src/app.js`, `test/cancel.test.js` — c599262.
- Capacidad nueva `bookings` (`capabilities/bookings.md`), fusionada desde el delta de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 verdes, sobre el commit de cierre (el cierre solo añade documentación a `c599262`, donde corrió).
- Gate: `node --test` → suite: corrió 5/5 · sobre c599262 · el proyecto no declara más suites ni tareas de gate.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpias sobre c599262 (`HEAD` solo añadió `tasks.md`, sin re-revisión) · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | cancelar y `canceladas` en el mismo proceso → `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests (ruling de la Task 2) → fila en «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso, como dice la spec.

## 5. Aprendizajes

- La capacidad `bookings` no existía: el comportamiento de cancelar con motivo vive ahora en `capabilities/bookings.md` → capacidad `bookings`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
