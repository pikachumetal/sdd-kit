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

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada de motivos — 3b8e602.
- Comando `canceladas`, que enseña el motivo de cada cancelación — f389851.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden (de `## Rulings` de `tasks.md`).

## 4. Verificación

### 4.2 Smoke / tests

- Validación: pendiente. Este cierre es parcial (walkthrough mínimo y aprendizaje): no se ha ejecutado el smoke ni la suite, ni verificado nada aquí. Lo único que consta es la revisión final de `tasks.md` (Spec y Código limpias sobre f389851), no repetida en este cierre.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md` (con fila en `debt.md`).

## 6. Adendas

- _Ninguna_
