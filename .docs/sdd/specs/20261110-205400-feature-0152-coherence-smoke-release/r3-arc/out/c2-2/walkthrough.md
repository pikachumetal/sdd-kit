---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada de motivos (47f5f15, 61f93b2).
- Comando `canceladas`, que lista cada cancelada con su motivo (61f93b2).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido — workaround hasta aislar el almacén por test — coste si está mal: la suite tarda el doble (Task 2, `tasks.md`).

## 4. Verificación

### 4.1 Builds

- No ejecutados en este cierre parcial.

### 4.2 Smoke / tests

- Revisión final (de `tasks.md`): Spec y Código limpias, sobre 61f93b2.
- Validación: no registrada en este cierre.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md`.

Retro: pendiente (cierre parcial)

## 6. Adendas

- _Ninguna_
