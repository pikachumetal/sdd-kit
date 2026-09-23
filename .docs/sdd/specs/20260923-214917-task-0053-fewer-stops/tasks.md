---
id: 20260923-214917-task-0053-fewer-stops
title: Tasks — Menos paradas y avisos llanos
spec: ./spec.md
plan: ./plan.md
created: 2026-09-24
---

# Tasks — Menos paradas y avisos llanos (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0053`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Carril de task: aviso de fase, delegación en la primera pregunta y paso 7 | blocked | — | espera a que la 0031 esté en `develop` |
| 2 | Carril de patch: el fallo que no se reproduce y la fila re-medida | pending | — | |
| 3 | GREEN | pending | — | en línea |

## Verificación por task

- [ ] Task 1 — `Invoke-Pester -Path tests -ExcludeTagFilter Slow`
- [ ] Task 2 — `Invoke-Pester -Path tests -ExcludeTagFilter Slow`
- [ ] Task 3 — campaña GREEN con `red/run.sh` (techo 18 $ compartido con el RED)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
