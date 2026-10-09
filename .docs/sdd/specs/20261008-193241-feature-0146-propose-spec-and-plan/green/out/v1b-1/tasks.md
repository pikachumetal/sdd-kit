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
| 1 | Cancelar con motivo | done | c886e40 | |
| 2 | Listado de canceladas | done | a62db37 | |

Revisión final: code-reviewer + opus, limpia, sobre a62db37

## Rulings

- Task 2: Ruling: `canceladas` escribe una línea por reserva, en el orden en que se cancelaron — la spec no fija el orden — si me equivoco, ordenar por sala es un cambio de una línea.
- Task 2: Ruling: las reservas anuladas (`anular`) no salen en `canceladas` — la spec no lo dice, y el glosario separa Cancelación de Anulación — si me equivoco, el listado de la 0011 tendrá que sumarlas.
- Cierre: `fdff62d` (solo `tasks.md`, 21 líneas, una por encima del umbral de 20) cambia documentación y no código; leído en el hilo, sin re-revisión. Sus marcadores `(commit de la task N)` y `(HEAD)` se sustituyen por los hashes reales.
