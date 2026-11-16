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

- Cancelar una reserva pide un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) — `bfaeee6`.
- El listado de canceladas enseña el motivo — `a2d236c`.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden

## 4. Verificación

- Revisión final: Spec y Código limpias, sobre `a2d236c`.
- Validación, suite y smoke del cierre: no ejecutados en este paso (el cierre se hizo a medias por petición expresa).

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md` (cabe en el tope de `develop`, 11 palabras, tras quitar la línea del puerto, que ya vive en `architecture.md`).
