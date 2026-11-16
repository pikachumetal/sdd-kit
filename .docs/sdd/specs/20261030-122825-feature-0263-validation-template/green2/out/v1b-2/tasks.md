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
| 1 | Cancelar con motivo | done | 5366a5b | |
| 2 | Listado de canceladas | done | 5195f8c | |

Revisión final: code-reviewer + opus, limpia, sobre 5195f8c
Re-revisión: 5195f8c..a6ea18f, sdd-kit:effort-high + opus, 0 Critical, 2 Important (marcadores de commit y sha de la revisión en tasks.md: corregidos aquí), 2 Minor (a ✋)

## Rulings

- Task 2: Ruling: `canceladas` escribe una línea por reserva, en el orden en que se cancelaron — la spec no fija el orden — si me equivoco, ordenar por sala es un cambio de una línea.
- Task 2: Ruling: las reservas anuladas (`anular`) no salen en `canceladas` — la spec no lo dice, y el glosario separa Cancelación de Anulación — si me equivoco, el listado de la 0011 tendrá que sumarlas.
