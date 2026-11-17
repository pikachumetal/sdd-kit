---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-29
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar pide un motivo de la lista | done | 151b696 | |
| 2 | El listado de canceladas enseña el motivo | done | b92fb6c | |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js` → `ℹ fail 0`
- [x] Task 2 — `node --test test/cancel.test.js` → `ℹ fail 0`

Revisión final: Spec opus+high, con arreglos (1 Important adjudicado, 3 Minor diferidos) · Código sonnet+high, sin hallazgos · Arquitectura no (plan), sobre b92fb6c

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Final: Ruling: sdd-kit:effort-high no disponible en este harness — despacho con model (opus Spec, sonnet Code) y effort heredado — coste si me equivoco: revisión con menos esfuerzo del previsto
- Final: minor (deferred): tests de canceladas dependen del orden por el estado en memoria (riesgo ya declarado en el plan, decisión 6)
- Final: minor (deferred): posible ruido de saltos de línea CRLF/LF en test/cancel.test.js
- Final: minor (deferred): sin test de canceladas con una reserva anulada, ni con varias canceladas unidas por \n
- Final: Ruling: Important «canceladas vacía entre procesos de la CLI» (src/app.js, almacén en memoria) — sin arreglo: persistir las reservas cambia el alcance de la spec y el producto entero vive en memoria (operations.md «Motor de producción»); lo decide el dev-lead — si me equivoco, canceladas no sirve desde la CLI real hasta que haya persistencia
- Final: minor (deferred): test que fije que tras el rechazo sin motivo la reserva sigue activa (Review Focus 1)
- Final: minor (deferred): test que fije motivo validado antes que la reserva (cancelar Sur mar sin motivo)
- Final: minor (deferred): test de varias canceladas unidas por \n
