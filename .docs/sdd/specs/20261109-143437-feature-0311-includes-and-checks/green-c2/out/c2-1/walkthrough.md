---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-09
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con una lista cerrada de motivos (509ce2e).
- Comando `canceladas`, que lista las canceladas con su motivo (a56187a).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble

## 4. Verificación

- Revisión final (Spec y Código, limpia) sobre a56187a: reportada, no re-ejecutada en este paso.
- Este walkthrough es un borrador mínimo: la validación (4.2), la suite del cierre y el resto del checklist de `sdd-archive` no se han ejecutado todavía.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `tech-stack.md`
