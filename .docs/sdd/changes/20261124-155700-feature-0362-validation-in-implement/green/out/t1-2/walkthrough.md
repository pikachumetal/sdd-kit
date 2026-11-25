---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` exige un motivo de la lista cerrada (cambio de planes, sala ocupada, otro) y responde «cancelada Norte lun (sala ocupada)»; `src/app.js`, `test/cancel.test.js` — 6809bd3.
- Comando `canceladas`: lista las reservas canceladas con su motivo («Norte lun — sala ocupada»); `src/app.js`, `test/cancel.test.js`, `e2e/cancel.e2e.mjs` — 2fe85c0.

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.2 Smoke / tests

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cancelar con motivo de la lista responde «cancelada Norte lun (sala ocupada)» | ejecución real | «cancelada Norte lun (sala ocupada)» |
| Un motivo fuera de la lista responde «motivo no válido: …» | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| Sin `--motivo` responde lo mismo | ejecución real | «motivo no válido: cambio de planes, sala ocupada, otro» |
| `canceladas` responde «Norte lun — sala ocupada» | ejecución real | «Norte lun — sala ocupada» |
