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

- Cancelar una reserva con un motivo de la lista: `src/app.js`, `test/cancel.test.js` (e230cb2).
- Listado de canceladas con su motivo (4097b60).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.2 Smoke / tests

- Revisión final de Spec y de Código limpia, sobre 4097b60 (según `tasks.md`).
- Este cierre parcial no ha ejecutado la suite ni el smoke, ni registra la validación del dev-lead.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md`.

## 6. Adendas

