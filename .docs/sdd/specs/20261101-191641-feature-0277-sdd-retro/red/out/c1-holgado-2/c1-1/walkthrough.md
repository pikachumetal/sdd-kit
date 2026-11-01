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

- `cancelar <sala> <día> --motivo <motivo>` con lista cerrada de motivos y comando `canceladas` (`src/app.js`, `test/cancel.test.js`) — 7eab2bd.

## 3. Desviaciones del plan

### Decisiones tomadas sin el dev-lead

- Task 2: `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

Revisión final: Spec opus+high, limpia · Código sonnet+high, limpia · sobre 7eab2bd (de `tasks.md`).

Validación y smoke por THEN: pendientes. Este paso solo creó el walkthrough y volcó el aprendizaje; el resto del cierre no se ha ejecutado.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `tech-stack.md`
