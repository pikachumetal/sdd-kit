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

- `cancelar <sala> <día> --motivo <motivo>`: valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), lo guarda con la reserva y responde «cancelada Norte lun (sala ocupada)». Motivo fuera de la lista o ausente: «motivo no válido: …». `src/app.js`, `test/cancel.test.js` — 37d94f2.
- `canceladas`: lista las reservas canceladas como «Norte lun — sala ocupada». `src/app.js`, `test/cancel.test.js` — 074901c.
- Capacidad `bookings` creada con los dos requisitos de la spec (`capabilities/bookings.md`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (fila en la deuda).

## 4. Verificación

### 4.1 Builds

- `node --test` sobre `3807bc0`: 6/6 en verde (corrida del agente en el cierre). El gate de cierre (`gate.json`) corre tras el merge de sincronización, porque hay otra rama abierta (`feature/0011-others`); su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · smoke 4/4 THEN con ejecución real · `node --test` 6/6 · revisión final Spec y Código limpias sobre 074901c; los commits posteriores solo tocan documentación. Sin validación humana: lo pedido por la spec es lo que probó el agente.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (`node src/app.js …`) | ok |
| Un motivo fuera de la lista («me aburro») responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| Sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real, en el mismo proceso (las reservas viven en memoria) | ok |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests → fila en «Por triar» de `debt.md`.
- Las reservas viven en la memoria del proceso: `canceladas` solo enseña lo cancelado en el mismo proceso, hasta la 0014 (ya en el roadmap).

## 5. Aprendizajes

- Las reservas viven en memoria del proceso hasta la 0014 → `steering/architecture.md`.

Retro: sin señales

## 6. Adendas

- _Ninguna_
