---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-27
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- Task 1 (`adf0d33`): `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva; sin motivo o fuera de la lista responde «motivo no válido: …». Ficheros: `src/app.js`, `test/cancel.test.js`.
- Task 2 (`308d6a6`): comando `canceladas`, que lista sala, día y motivo de las reservas canceladas. Ficheros: `src/app.js`, `test/cancel.test.js`.
- Capacidad `bookings` creada con `sdd capability merge` (dos requisitos ADDED).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble. Anotado como deuda en el roadmap.

## 4. Verificación

### 4.1 Builds

- `node --test --test-concurrency=1` → 5/5 pasan, 0 fallos.
- Gate: `node --test --test-concurrency=1` → corrió 5/5 · 0,18 s · configuración: la del gate, más `--test-concurrency=1` (ruling de la Task 2) · sobre `7d54a2a`

### 4.2 Smoke / tests

- Validación en campo: 2026-10-27 · suite 5/5 · smoke 3/3 THEN con ejecución real (llamando a `run` en un mismo proceso, porque el almacén es en memoria y no persiste entre invocaciones de la CLI) · revisión final Spec (opus+high) y Código (sonnet+high) limpias sobre `308d6a6`; `7d54a2a` solo toca `tasks.md`, sin re-revisión. Arquitectura: no se revisó (el plan no la pedía).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | suite + ejecución real | OK |
| Motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | suite + ejecución real (`--motivo "me aburro"`) | OK |
| Sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (ningún test de la suite lo cubre) | OK |
| `canceladas` responde «Norte lun — sala ocupada» | suite + ejecución real | OK |

### 4.3 Residuales / deuda generada

- El THEN «sin `--motivo`» no tiene test en la suite; solo está verificado por ejecución real. Va a la deuda.
- El gate corre con `--test-concurrency=1` por la carrera sobre el almacén compartido en memoria. Va a la deuda.

## 5. Aprendizajes

- Ninguno estructural: sin cambio de convención, de arquitectura ni de versiones. Revisión de skills: no aplica (el proyecto no tiene `.claude/skills/`; comprobado). El comportamiento observable vive en `capabilities/bookings.md`.

## 6. Adendas

- _Ninguna_
