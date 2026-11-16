---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-12
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` (2f4d5c2).
- `canceladas` lista las reservas canceladas con su motivo: `src/app.js`, `test/cancel.test.js` (de7d503).
- Capacidad `bookings` creada con el delta de la spec (`.docs/sdd/capabilities/bookings.md`), fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5 pass, 0 fail (salida guardada en el scratchpad de la sesión).
- Gate: `node --test` → 5/5 · sobre el commit de cierre (el código no cambió desde de7d503; después solo `tasks.md`)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre de7d503; Arquitectura no (plan). Todo verificado por el agente; el dev-lead no ha probado nada a mano.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) + suite | ok |
| Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (`--motivo "me aburro"`) + suite | ok |
| Sin `--motivo` responde lo mismo | ejecución real (`cancelar Norte lun`); la suite no lo cubre | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real, cancelar y listar en un mismo proceso + suite | ok |

### 4.3 Residuales / deuda generada

- Las reservas viven en memoria: dos invocaciones de la CLI no comparten estado, así que `canceladas` solo enseña lo cancelado en el mismo proceso. Lo cubre la 0014 (motivo guardado), ya en el roadmap.
- Tests de `test/cancel.test.js` acoplados por estado (ruling de la Task 2): fila en «Por triar» de `debt.md`.
- Sin test para `cancelar` sin `--motivo` (solo ejecución real).

## 5. Aprendizajes

- El delta de comportamiento (motivo obligatorio y listado) → `capabilities/bookings.md`.
- Los tests de la CLI comparten el estado en memoria de `src/app.js` → deuda «Por triar» de `debt.md`.
- Ninguno estructural ni de convención: `architecture.md` y `constitution.md` siguen valiendo.

Retro: sin señales

## 6. Adendas

- _Ninguna_
