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
| 2 | Campaña RED (6 sujetos) | done | `c05fa26` | Dos revisores con el encargo vigente, dos sujetos de propuesta y **dos sujetos extra** (E3b) sobre un fixture sin la regla de datos ficticios: el primer intento del punto de ejemplos salió 2/2 positivo y hubo que reproducir la condición real del kit. Sonnet; el tool `Agent` no expone `effort`, desviación del Art. IV ya anotada en T7 |
| 3 | Reescritura de `review-spec.md` y frase de la plantilla | done | `62f49f5`, `ddba5e0` | El segundo commit mueve el ejemplo de §2 a otro dominio: coincidía con el de la fixture y contaminaba el GREEN de la propuesta |
| 4 | Campaña GREEN (5 sujetos) | done | `5372b50` | Sobre `fixture-no-rule`, la condición dura. Un sujeto extra: el punto 7 iba a quedar con n=1 en GREEN frente a n=2 en RED |
| 5 | Evidencia RED/GREEN | done | `c05fa26`, `5372b50` | Sin refactor: ningún criterio del GREEN falló |
| 6 | Revisión final de rama | pending | — | **Pendiente de la próxima sesión**: el dev-lead apagó el equipo antes de despacharla. Subagente Sonnet medium con la cabecera de `encargo-revision.md` y el diff de `feature/0011` contra `develop` (7 ficheros, +535/−4) |

## Verificación por task

- [x] Task 1 — ocho defectos verificados en disco; el fixture no telegrafía la conducta medida
- [x] Task 2 — recuento de duplicados, Críticos, nombre real marcado y forma de la propuesta
- [x] Task 3 — suite verde (184/0)
- [x] Task 4 — duplicados < 10 %, ningún Crítico del RED perdido, nombre real marcado, propuesta anclada
- [x] Task 5 — suite verde (184/0)
- [ ] Task 6 — hallazgos Crítico e Importante incorporados

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
