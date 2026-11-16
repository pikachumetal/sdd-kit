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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (8977656).
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas del proceso (5aa631e).
- `test/cancel.test.js`: tests de ambos comportamientos.
- `capabilities/bookings.md`: creada al fusionar el delta (la spec declaraba `bookings` como nueva).

## 2. Tiempo y coste: estimado vs real

- No aplica: el proyecto no tiene `.docs/sdd/steering/estimation.md`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (Task 2; fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 5/5 en verde, verificado por el agente en el worktree sobre 0021755 (el commit de cierre solo suma documentación y la capacidad).
- Gate: `node --test` → suite unitaria: corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (CLI y, para `canceladas`, en el mismo proceso) · revisión final Spec y Código limpias sobre 5aa631e, Arquitectura no (plan)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| un motivo fuera de la lista (`"me aburro"`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» tras esa cancelación | ejecución real | ok |

Reportado por el usuario: nada.

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → «Por triar» de `debt.md`.
- Las reservas viven en memoria hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso, como dice la spec.

## 5. Aprendizajes

- Un test que depende de otro es deuda, no convención → `steering/debt.md` («Por triar»).
- El cambio observable queda en `capabilities/bookings.md`, no en `architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
