---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-05
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `src/app.js`: `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro), guarda `reason` en la reserva y responde `cancelada <sala> <día> (<motivo>)`; sin motivo o con uno fuera de la lista responde `motivo no válido: cambio de planes, sala ocupada, otro` (a4057a0).
- `src/app.js`: comando `canceladas`, una línea `<sala> <día> — <motivo>` por reserva con estado `cancelled` (e13d58c).
- `test/cancel.test.js`: tres tests, uno por escenario del delta.
- Capacidad nueva `bookings` en `.docs/sdd/capabilities/bookings.md`, fusionada con `sdd capability merge`.

## 3. Desviaciones del plan

- _Ninguna_ en el alcance. Sección 2 omitida: el proyecto no tiene `.docs/sdd/estimation.md`.

### Decisiones tomadas sin el dev-lead

- Task 2: gate con `node --test --test-concurrency=1` para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Con la deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 en verde; `node --test` (el gate de la constitution y del plan) → 5/5 en verde.
- Gate: `node --test` → corrió 5/5 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-05 · suite 5/5 · smoke 3/3 THEN con ejecución real · revisión final Spec y Código limpia sobre e13d58c; lo posterior es solo `tasks.md`, que registra esa revisión, sin código por revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| Motivo fuera de la lista, o sin `--motivo`, responde «motivo no válido: …» | ejecución real | `motivo no válido: cambio de planes, sala ocupada, otro` en ambos casos |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real (mismo proceso: el almacén vive en memoria) | `Norte lun — sala ocupada` |

Verificado por el agente; nada reportado por el dev-lead.

### 4.3 Residuales / deuda generada

- El almacén de reservas es en memoria: el motivo no sobrevive entre invocaciones de la CLI (lo cubre la fila 0014 «Motivo guardado»). Por eso el listado solo se ve en un mismo proceso.
- Tests acoplados al almacén compartido: `canceladas` depende de que antes haya corrido `cancelar` → fila nueva en la deuda del roadmap.

## 5. Aprendizajes

- El comportamiento nuevo vive en la capacidad `bookings` → `.docs/sdd/capabilities/bookings.md`.
- El workaround de `--test-concurrency=1` no se escribe en `tech-stack.md`; va a la deuda del roadmap → `.docs/sdd/roadmap.md`.

Retro: sin señales

## 6. Adendas

- (ninguna)
