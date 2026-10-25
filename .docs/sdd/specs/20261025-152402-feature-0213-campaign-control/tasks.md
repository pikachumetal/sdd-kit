---
id: 20261025-152402-feature-0213-campaign-control
title: Tasks — Control de campaña en tests/headless/run.sh
spec: ./spec.md
plan: ./plan.md
created: 2026-10-25
---

# Tasks — Control de campaña en `tests/headless/run.sh` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0213-campaign-control`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Ensayo en seco fuera de la spec y coste por carpeta | done | — | `run.sh` y `battery.sh` cargan `lib.sh` (`campaign_root`, `REPO_ROOT` con la ruta Windows arreglada) |
| 2 | Recuento de sujetos: etiqueta existente, techo con lo lanzado, cortados y MAX_PARALLEL | done | — | recuento con builtins; cerrojo `RUNS_DIR/live/.lock` entre lanzadores; `battery.sh` sin `CHUNK` |
| 3 | `claude` anidado bloqueado en el sujeto | done | — | sujeto real (haiku, 0,0096 $): Bash y PowerShell bloqueados |
| 4 | Tabla de coste por tipo de sujeto y `tech-stack.md` al día | pending | — | |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI`
- [x] Task 2 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI`
- [x] Task 3 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI` y el sujeto real
- [ ] Task 4 — `Invoke-Pester -Path tests/WordBudget.Tests.ps1 -CI`

## Fixes adicionales

1. Línea base: «acepta RUNS_DIR bajo .temp/ del repo» rojo también en `develop` (`74607f4d`): `run.sh` calcula `REPO_ROOT` con `dirname` sobre `BASH_SOURCE`, que con la ruta Windows de Pester (`D:\…\run.sh`) da `.`, y la raíz sale del cwd. Se arregla en la Task 1 (fichero que ya toca).
2. Línea base: `FastSuiteBudget` 31,6 s frente a 30 con la máquina cargada; fila de deuda del patch 0190 (parcial), ajeno.
