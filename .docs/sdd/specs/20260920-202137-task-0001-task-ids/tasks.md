---
id: 20260920-202137-task-0001-task-ids
title: Tasks — Ids de task y numeración sin gestor de tickets
spec: ./spec.md
plan: ./plan.md
created: 2026-09-20
---

# Tasks — Ids de task y numeración sin gestor de tickets (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0001`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Baseline RED (Art. I) | pending | — | En línea (hilo). Gate de alcance si un escenario no falla |
| 2 | Script `Get-NextSddId.ps1` | pending | — | Sonnet high. Tests del hilo antes de despachar |
| 3 | Skills de carril leen el modo de ids | pending | — | Sonnet high. Depende de la Task 1 (RED) y del contrato de la Task 2 |
| 4 | Init, plantillas, migración y Art. IV | pending | — | Sonnet high. Paralelizable con la Task 3: no comparten fichero |
| 5 | Campaña GREEN (Art. I) | pending | — | En línea (hilo). Tras integrar 3 y 4 |

## Verificación por task

- [ ] Task 1 — `tests/task-ids-red.md` escrito, con resultados verificados en disco
- [ ] Task 2 — `Invoke-Pester tests/Get-NextSddId.Tests.ps1` verde + suite completa sin regresiones
- [ ] Task 3 — `Invoke-Pester tests/TaskIds.Tests.ps1 tests/Skills.Tests.ps1` verde
- [ ] Task 4 — `Invoke-Pester tests/TaskIds.Tests.ps1 tests/Manifests.Tests.ps1 tests/NamingConvention.Tests.ps1` verde
- [ ] Task 5 — `tests/task-ids-green.md` con veredicto contra cada fallo del RED + suite completa verde

## Fixes adicionales (trabajo descubierto fuera de scope)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
