---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-15
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: el motivo es obligatorio y de una lista cerrada (cambio de planes, sala ocupada, otro); se guarda con la reserva cancelada. `src/app.js`, `test/cancel.test.js` — Task 1, `f358828`.
- `canceladas`: lista «sala día — motivo» de las reservas con estado cancelada. `src/app.js`, `test/cancel.test.js` — Task 2, `b06fab4`.
- Capacidad `bookings` creada con `sdd capability merge` (`.docs/sdd/capabilities/bookings.md`): no existía.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero en verde: 5/5 tests (3 de `test/cancel.test.js`), salida guardada y leída desde fichero.
- Gate: `node --test` → suite: corrió 5/5 · sobre el commit de cierre (sin cambios de código desde el último commit de task; la base no tiene commits nuevos).

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `b06fab4`; el commit posterior solo cambia `tasks.md`, sin re-revisión · Arquitectura no revisada (lo dice el plan). Nada validado por el dev-lead: todo es verificación del agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) y suite | ok |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real con `--motivo "me aburro"` y suite | ok |
| sin `--motivo` responde lo mismo | ejecución real; ningún test lo cubre | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real en un mismo proceso y suite | ok |

### 4.3 Residuales / deuda generada

- `canceladas` desde la CLI, en un proceso nuevo, no muestra nada: las reservas viven en la memoria del proceso hasta la 0014, como dice la spec. Comprobado con ejecución real.
- El THEN «sin `--motivo`» no tiene test: solo lo cubre el smoke. Queda en «Por triar» junto al acoplamiento del test.

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014 → `steering/architecture.md`.
- Comportamiento de cancelar y de `canceladas` → `capabilities/bookings.md` (delta de la spec, fusionado con `sdd capability merge`).

Retro: sin señales

## 6. Adendas

- _Ninguna_
