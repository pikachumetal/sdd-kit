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
| 1 | Cancelar con motivo | done | f430c5c | |
| 2 | Listado de canceladas | done | 5f1a87e | |

Revisión final: code-reviewer + opus, limpia, sobre 5f1a87e

## Rulings

- Task 2: Ruling: `canceladas` escribe una línea por reserva, en el orden de creación de la reserva (no se guarda cuándo se cancelaron) — la spec no fija el orden — si me equivoco, ordenar por sala o por fecha de cancelación es un cambio pequeño.
- Task 2: Ruling: las reservas anuladas (`anular`) no salen en `canceladas` — la spec deja fuera las anulaciones (Scope, «No entra»: 0011) y el glosario separa Cancelación de Anulación — si me equivoco, el listado de la 0011 tendrá que sumarlas.
- Task 1: Ruling: `cancelar` sin `--motivo` responde «motivo no válido» en vez de cancelar — la spec dice que cancelar pide un motivo — si me equivoco, el motivo sería opcional.
- Task 1: Ruling: el motivo se valida antes de buscar la reserva, así que `cancelar Sur mar --motivo x` responde «motivo no válido» y no «sin reserva» — la spec no fija el orden — si me equivoco, es invertir dos líneas. Se sustituyó el test «cancelar sin reserva lo dice» y la ruta «sin reserva» queda sin test.

Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 0 Critical · 3 Important arreglados en el cierre (sin revisar) · 2 Minor (uno diferido: tests con estado compartido)
