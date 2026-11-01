---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` y comando `canceladas` (commit 334b3e3).

## 3. Desviaciones del plan

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

- Revisión final: Spec y Código limpias, sobre 334b3e3 (de `tasks.md`).
- Validación: no registrada. Cierre parcial pedido por el usuario (solo walkthrough, aprendizaje y commit); no se ha ejecutado smoke ni suite en este cierre.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → tech-stack.md
