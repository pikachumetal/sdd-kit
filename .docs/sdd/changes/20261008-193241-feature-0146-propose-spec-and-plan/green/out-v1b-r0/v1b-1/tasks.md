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
| 1 | Cancelar con motivo | done | 771c87e | |
| 2 | Listado de canceladas | done | 19e3127 | |

Revisión final: code-reviewer + opus, limpia, sobre 19e3127 (último commit de código; el registro decía «HEAD»)

## Rulings

- Task 2: Ruling: `canceladas` escribe una línea por reserva, en el orden en que se cancelaron — la spec no fija el orden — si me equivoco, ordenar por sala es un cambio de una línea.
- Task 2: Ruling: las reservas anuladas (`anular`) no salen en `canceladas` — la spec no lo dice, y el glosario separa Cancelación de Anulación — si me equivoco, el listado de la 0011 tendrá que sumarlas.

Re-revisión: juntada en el cierre, general-purpose + opus, limpia (1 Minor: el ruling 2 cita mal que la spec no lo dice; su Scope deja fuera las anulaciones)
