---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-10-08
---

# Tasks — Motivo al cancelar (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | db5eec9 | |
| 2 | Listado de canceladas | done | 1d52c4a | |

Revisión final: code-reviewer + opus, limpia, sobre 1d52c4a

## Rulings

- Task 2: Ruling: `canceladas` escribe una línea por reserva, en el orden en que se cancelaron — la spec no fija el orden — si me equivoco, ordenar por sala es un cambio de una línea.
- Task 2: Ruling: las reservas anuladas (`anular`) no salen en `canceladas` — la spec no lo dice, y el glosario separa Cancelación de Anulación — si me equivoco, el listado de la 0011 tendrá que sumarlas.
