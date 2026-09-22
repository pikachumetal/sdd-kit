---
id: 20260922-211605-task-0021-proportional-review
title: Tasks — Revisión por task abaratada
spec: ./spec.md
plan: ./plan.md
created: 2026-09-22
---

# Tasks — Revisión por task abaratada (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0021`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Encargo de revisión y plantilla del plan | pending | — | en línea |
| 2 | Repaso de coherencia antes del gate | pending | — | en línea |
| 3 | GREEN | pending | — | 6 sujetos Sonnet |

## Verificación por task

- [ ] Task 1 — RED de las anclas (salida abajo) → `Invoke-Pester ./tests` verde
- [ ] Task 2 — RED del ancla del paso 4 → `Invoke-Pester ./tests` verde
- [ ] Task 3 — cuatro frentes de la spec en verde

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
