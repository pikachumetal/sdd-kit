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

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada de motivos (`73053d3`).
- Comando `canceladas`, que lista las canceladas con su motivo (`8eba0a4`).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- `node --test --test-concurrency=1` en el gate, para esquivar la carrera de los tests sobre el almacén compartido en memoria (Task 2) — workaround hasta aislar el almacén por test — coste si es erróneo: la suite tarda el doble.

## 4. Verificación

### 4.1 Builds

- Este cierre se limitó a registrar el walkthrough y el aprendizaje: no se ha vuelto a pasar la suite.

### 4.2 Smoke / tests

- Revisión final de Spec y Código limpia (según `tasks.md`). Validación de este cierre: no registrada.

### 4.3 Residuales / deuda generada

- El workaround de `--test-concurrency=1` no tiene fila en la deuda del roadmap.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers=8` → `tech-stack.md` (la línea del puerto salió, ya vive en `steering/operations.md`, por el tope de 12 palabras de `develop`).

Retro: sin señales
