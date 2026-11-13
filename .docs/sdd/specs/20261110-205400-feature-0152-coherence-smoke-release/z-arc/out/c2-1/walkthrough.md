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

- Cancelar con un motivo de la lista (`src/app.js`, `test/cancel.test.js`) — 1b53cb0.
- Listado de canceladas con su motivo — 822e004.

## 3. Desviaciones del plan

### Decisiones tomadas sin el dev-lead

- El test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 5. Aprendizajes

- La suite lenta necesita `--maxWorkers 8` → `steering/operations.md` (el tope de 11 palabras se respeta: sale la línea del puerto, que ya vive en `architecture.md`).

Retro: pendiente del cierre completo
