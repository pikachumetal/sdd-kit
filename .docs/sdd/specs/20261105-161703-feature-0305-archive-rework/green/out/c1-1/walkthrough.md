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

- Cancelar una reserva con un motivo de la lista: `src/app.js`, `test/cancel.test.js` (8f30fd9).
- Listado de canceladas con su motivo: `src/app.js`, `test/cancel.test.js` (cdbfaf5).

## 3. Desviaciones del plan

- _Ninguna_ registrada en este walkthrough.

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble (Ruling de la Task 2, `tasks.md`).

## 4. Verificación

### 4.1 Builds

- No ejecutados al escribir este walkthrough.

### 4.2 Smoke / tests

- Validación: sin registrar aún. Solo consta la revisión final de `tasks.md`: Spec y Código limpias sobre cdbfaf5.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `tech-stack.md`.
