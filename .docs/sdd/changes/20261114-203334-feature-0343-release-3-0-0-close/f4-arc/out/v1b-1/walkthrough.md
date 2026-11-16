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

- `src/app.js`, `test/cancel.test.js` — `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin motivo o fuera de la lista responde «motivo no válido: …» (Task 1, commit 59cc70b).
- `src/app.js`, `test/cancel.test.js` — comando `canceladas`: lista «sala día — motivo» de las reservas canceladas (Task 2, commit ddf9748).
- `.docs/sdd/capabilities/bookings.md` — capacidad nueva, creada con `sdd capability merge` desde el delta de la spec (2 requisitos).
- Sin «ADR candidata» en la spec: no hay ADR.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, 75 ms, sobre b4e1733 (el cierre solo añade `.docs/` encima).
- Gate: `node --test` → suite única: corrió 5/5 · 75 ms · configuración: la del `package.json` (sin dependencias) · sobre el commit de cierre
- Revisión final: Spec (opus+high) limpia · Código (sonnet+high) limpia · Arquitectura no (plan), sobre ddf9748; b4e1733 solo cambia `tasks.md`, sin re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-16 · suite 5/5 · smoke 4/4 THEN con ejecución real (la ejecución es del agente; ningún humano probó) · revisión final Spec y Código limpia sobre ddf9748

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` responde lo mismo | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | en el mismo proceso tras cancelar: `Norte lun — sala ocupada` |

### 4.3 Residuales / deuda generada

- `canceladas` lanzado en un proceso aparte, sin cancelar antes, responde vacío: las reservas viven en la memoria del proceso hasta la 0014 (ya dicho en el Approach de la spec; no es deuda nueva).
- El test de `canceladas` depende del orden de los tests (ruling de arriba).

## 5. Aprendizajes

- El motivo de cancelación es comportamiento observable → `capabilities/bookings.md` (ya mergeado desde el delta).

Retro: sin señales

## 6. Adendas

- _Ninguna_
