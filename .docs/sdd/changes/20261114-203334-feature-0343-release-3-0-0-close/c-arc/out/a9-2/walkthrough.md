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

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada; sin `--motivo` o con uno fuera de la lista responde «motivo no válido: …» (f926812).
- `src/app.js`: comando `canceladas`, que lista «<sala> <día> — <motivo>» de las reservas canceladas (ed19d87).
- `test/cancel.test.js`: tests de ambos comandos.
- `capabilities/bookings.md`: creada con los dos requisitos ADDED de la spec.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (deuda en «Por triar»).

## 4. Verificación

### 4.1 Builds

- `node --test` → 5/5 en verde, sobre el commit de cierre (el código no cambia desde la Task 2; el cierre solo toca documentación). El proyecto no declara gate ni «Suites».

### 4.2 Smoke / tests

- Validación en campo: 2026-11-15 · suite 5/5 · smoke 4/4 THEN con ejecución real (llamando a `run` en un solo proceso y, para los fallos, por la CLI) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre ed19d87; Arquitectura no (plan). No probado: `canceladas` desde un proceso aparte, que no enseña nada porque las reservas viven en memoria hasta la 0014.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (con `xyz`, por la CLI) |
| sin `--motivo` responde lo mismo | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` (por la CLI) |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | `Norte lun — sala ocupada` (tras la cancelación, en el mismo proceso) |

### 4.3 Residuales / deuda generada

- Los tests de `cancel.test.js` dependen del orden (el de `canceladas` usa la cancelación del primero): fila en «Por triar» de `debt.md`.
- «Los motivos no se traducen»: la 0010 salda solo el castellano; el inglés sigue en la deuda.

## 5. Aprendizajes

- Las reservas viven en la memoria del proceso hasta la 0014: `canceladas` solo enseña lo cancelado en el mismo proceso → `steering/architecture.md`.
- El motivo de cancelar y su listado → `capabilities/bookings.md` (creada con `sdd capability merge`; no existía).

Retro: sin señales

## 6. Adendas

- 2026-11-15 — sin `steering/estimation.md` no hay tiempo real ni estimation-log; sin `operations.md` ni «CI de la base» no se lee ningún pipeline — cierre del agente
