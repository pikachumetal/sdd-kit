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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o con uno fuera de la lista responde «motivo no válido: …» (task 1, 0c947e1).
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas (task 2, a6aa2ed).
- `test/cancel.test.js`: tres tests, uno por comportamiento.
- `.docs/sdd/steering/architecture.md`: la línea de estructura dice que `src/app.js` también valida el motivo al cancelar, como pedía el scope de la spec.
- `.docs/sdd/capabilities/bookings.md`: capacidad nueva con los dos requisitos de la spec, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test`: 5/5 verdes.
- Gate: `node --test` → 5/5 tests · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-12 · suite 5/5 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código limpia (Arquitectura no, por plan); el commit posterior solo cambió una línea de `tasks.md` y no se re-revisó · `no probado`: nada

Verificado por el agente; el dev-lead no ha dicho qué probó.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en un solo proceso (el estado vive en memoria): `cancelar` y luego `canceladas` → `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- El test de `canceladas` depende del orden de los tests: fila en «Por triar» de `debt.md`.

## 5. Aprendizajes

- La línea de estructura de `src/app.js` pasó a decir que valida el motivo → `.docs/sdd/steering/architecture.md`.
- El comportamiento de cancelar y de `canceladas` → `.docs/sdd/capabilities/bookings.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
