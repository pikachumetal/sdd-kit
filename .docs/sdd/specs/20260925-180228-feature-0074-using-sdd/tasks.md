---
id: 20260925-180228-feature-0074-using-sdd
title: Tasks — Skill using-sdd, la puerta de entrada al kit
spec: ./spec.md
plan: ./plan.md
created: 2026-09-25
---

# Tasks — Skill using-sdd, la puerta de entrada al kit (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0074-using-sdd`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Skill `using-sdd` y el hook que la inyecta | pending | — | |
| 2 | `description` de `sdd-config` y `sdd-roadmap` | pending | — | |
| 3 | GREEN y documentación | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester` de `UsingSdd`, `Hook`, `FeatureRename`, `PlanEntry` y `Skills`
- [ ] Task 2 — `Invoke-Pester` de `UsingSdd`, `Skills` y `PlanEntry`
- [ ] Task 3 — campaña GREEN (techo 50 sujetos / 18 $) y `Invoke-Pester` de `Skills` y `WorkflowDocs`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Las campañas heredaban el `CLAUDE.md` de usuario del dev-lead, que ya enruta al kit | `lib.sh` no aislaba la configuración del usuario | `SUPERPOWERS_DIR` en `tests/headless/lib.sh`, con su test, en la apertura | apertura |
