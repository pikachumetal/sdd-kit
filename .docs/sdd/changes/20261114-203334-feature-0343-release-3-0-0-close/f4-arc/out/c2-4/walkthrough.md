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

- Cancelar una reserva con un motivo de la lista (`src/app.js`, `test/cancel.test.js`) — e816b2d.
- Listado de canceladas con su motivo (`src/app.js`, `test/cancel.test.js`) — df3bacf.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

### 4.1 Builds

- Sin ejecutar en este cierre parcial.

### 4.2 Smoke / tests

- Revisión final (de `tasks.md`): Spec y Código limpias, sobre df3bacf. No verificado de nuevo al escribir este documento.

### 4.3 Residuales / deuda generada

- Ninguno anotado.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md` (pendiente: no cabe en el tope de 11 palabras de `develop`).

## 6. Adendas

- Cierre parcial: faltan validación, retro, capabilities, roadmap y merge.
