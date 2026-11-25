---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-24
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` valida el motivo contra la lista cerrada (cambio de planes, sala ocupada, otro) y lo guarda con la reserva cancelada — `src/app.js`, `test/cancel.test.js` (4dd03a5).
- `canceladas` lista las reservas canceladas con su motivo — `src/app.js`, `test/cancel.test.js` (d4647cd).
- Script `cancelar` en `package.json` (en el commit de cierre).

## 3. Desviaciones del plan

- _Ninguna_

### Decisiones tomadas sin el dev-lead

- Task 2: el test de `canceladas` reutiliza la cancelación del primer test en vez de preparar la suya — workaround hasta que cada test prepare sus datos — coste si es erróneo: el test falla si corre solo o en otro orden.

## 4. Verificación

### 4.1 Builds

- Gate: `node --test test/app.test.js` · `node scripts/gate.mjs run bookings:test rooms:test` → bookings:test: corrió 5/5 (sin filtro: cambia el build) · rooms:test: corrió 1/1 (sin filtro: cambia el build) · unit 2/2.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-24 · suite 2/2 + gate 6/6 · smoke 4/4 THEN con ejecución real · revisión final Spec y Código sobre d4647cd, limpia; re-revisión del script `cancelar`, limpia.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real | `cancelada Norte lun (sala ocupada)` |
| motivo fuera de la lista | ejecución real | `cancelar Norte lun --motivo "me aburro"` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| sin `--motivo` | ejecución real | `cancelar Norte lun` → `motivo no válido: cambio de planes, sala ocupada, otro` |
| `canceladas` enseña el motivo | ejecución real | en el mismo proceso, tras cancelar: `Norte lun — sala ocupada` (en un proceso aparte sale vacío: las reservas viven en memoria hasta la 0014) |

### 4.3 Residuales / deuda generada

- Persistencia de las reservas: la 0014.

## 5. Aprendizajes

- Sin aprendizajes nuevos: el comportamiento vive en `capabilities/bookings.md`; que las reservas estén en memoria hasta la 0014 ya consta en la spec.

Retro: sin señales

## 6. Adendas

- _Ninguna_
