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

- `cancelar <sala> <día> --motivo <motivo>`: el motivo ha de ser de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …». `src/app.js`, `test/cancel.test.js` (fb5b3e4).
- Comando `canceladas`: lista «sala día — motivo» de las reservas canceladas del proceso. `src/app.js`, `test/cancel.test.js` (47ec482).
- Capacidad `bookings`: dos requisitos añadidos con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si está mal: el test falla si corre solo o en otro orden (fila en «Por triar» de `debt.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` sobre 67577a4: 5/5 en verde. La suite de cierre corre sobre la fusión de sincronización con `develop` (la base trae `src/rooms.js`); su línea `Gate:` y su sha van en el mensaje final, porque este fichero está en el commit de cierre.
- Revisión final: Spec y Código limpias sobre 47ec482; lo posterior (`tasks.md`, una línea de la spec) es solo documentación, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · smoke 5/5 THEN con ejecución real (CLI y `run` en un mismo proceso) · `node --test` 5/5 · revisión final Spec y Código limpia sobre 47ec482 · no probado: nada.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | ok |
| motivo fuera de la lista (`vacaciones`) responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | ok |
| sin `--motivo` responde lo mismo | ejecución real | ok |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso: las reservas viven en memoria) | ok |

### 4.3 Residuales / deuda generada

- Test de `canceladas` acoplado al orden de los tests → «Por triar» de `debt.md`.
- `canceladas` solo enseña lo cancelado en el mismo proceso hasta la 0014 (ya en el roadmap).

## 5. Aprendizajes

- Cambio de comportamiento observable → `capabilities/bookings.md` (delta fusionado).

Retro: sin señales
