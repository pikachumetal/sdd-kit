---
id: 20260920-220930-task-0011-spec-review-lenses
title: Tasks — Review de spec: lentes sin solape y propuesta que ayuda a decidir
spec: ./spec.md
plan: ./plan.md
created: 2026-09-21
---

# Tasks — Review de spec: lentes sin solape (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0011`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Fixture de la campaña | done | (sin commit) | Fixture Ledgerly en el scratchpad con ocho defectos plantados, uno por punto del encargo más el ejemplo con nombre real. Desechable por diseño (`architecture.md`): no se versiona |
| 2 | Campaña RED (4 sujetos) | in_progress | — | Dos revisores con el encargo vigente (una lente cada uno) y dos sujetos de propuesta de nivel. Sonnet; el tool `Agent` no expone `effort`, se anota como desviación del Art. IV igual que en T7 |
| 3 | Reescritura de `review-spec.md` y frase de la plantilla | pending | — | En línea. Bloqueada por el veredicto del RED |
| 4 | Campaña GREEN (4 sujetos) | pending | — | Mismos escenarios y mismo fixture |
| 5 | Evidencia RED/GREEN | pending | — | `tests/spec-review-lenses-red.md` y `-green.md` |
| 6 | Revisión final de rama | pending | — | Subagente con la cabecera de `encargo-revision.md` |

## Verificación por task

- [x] Task 1 — ocho defectos verificados en disco; el fixture no telegrafía la conducta medida
- [ ] Task 2 — recuento de duplicados, Críticos, nombre real marcado y forma de la propuesta
- [ ] Task 3 — suite verde (`Invoke-Pester -Path tests`)
- [ ] Task 4 — duplicados < 10 %, ningún Crítico del RED perdido, nombre real marcado, propuesta anclada
- [ ] Task 5 — suite verde
- [ ] Task 6 — hallazgos Crítico e Importante incorporados

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
