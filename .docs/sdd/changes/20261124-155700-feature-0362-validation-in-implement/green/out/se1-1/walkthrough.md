---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: draft
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>`: motivo de la lista cerrada (cambio de planes, sala ocupada, otro); sin motivo o fuera de la lista responde «motivo no válido: …» (1b21460).
- `canceladas`: lista «<sala> <día> — <motivo>» de lo cancelado en el mismo proceso (0822ef4).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

(pendiente de la validación)
