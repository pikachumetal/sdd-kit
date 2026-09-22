---
id: 20260922-211157-task-0019-init-files
title: Tasks — Lo que crean las init: ficheros y configuración
spec: ./spec.md
plan: ./plan.md
created: 2026-09-22
---

# Tasks — Lo que crean las init: ficheros y configuración (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0019`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Paridad migración–init | pending | — | |
| 2 | Configuración y log que deja la init, y su migración | pending | — | |
| 3 | Proyecto de referencia | pending | — | |
| 4 | «Ficheros que toca» en la tabla de release | pending | — | |
| 5 | GREEN headless y evidencia | pending | — | |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester tests` verde
- [ ] Task 2 — `Invoke-Pester tests` verde
- [ ] Task 3 — `Invoke-Pester tests` verde
- [ ] Task 4 — `Invoke-Pester tests` verde
- [ ] Task 5 — veredicto por THEN en `tests/init-files-green.md`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
