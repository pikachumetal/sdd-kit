---
id: 20260924-082516-task-0055-native-default
title: Tasks — Native por defecto, SDD para tasks grandes
spec: ./spec.md
plan: ./plan.md
created: 2026-09-24
---

# Tasks — Native por defecto, SDD para tasks grandes (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0055`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Contrato del método | done | `5c9f401` | 1 ronda de fix: barra sin escapar en la fila del handoff |
| 2 | Init y migración preguntan `execution` | done | `b3f2bb7` | ruling: el helper `Get-TableRow` del RED acepta filas indentadas |
| 3 | El aviso del hook nombra los agentes | done | `0030a51` | 3 RED (el plan decía 2) |
| 4 | GREEN | done | `0c43874` | en línea; REFACTOR del gate del paso 5 en `pair` (ruling, entra en la revisión final) |

## Verificación por task

- [x] Task 1 — `Invoke-Pester` de `NativeDefault`, `SuperpowersCompat`, `Skills` y `ControlProfiles`
- [x] Task 2 — `Invoke-Pester` de `NativeDefault`, `MigrationInitParity` y `Skills`
- [x] Task 3 — `Invoke-Pester` de `KitSessionSource`
- [x] Task 4 — campaña GREEN con el techo común

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| Colisión de id: `develop` trae el patch 0056 (otro worktree), el mismo id que la partición dio a la parte (b) | `Get-NextSddId.ps1` devolvió 0056 antes de que el patch se fusionara en `develop`; las dos reservas se hicieron a la vez en ramas distintas | Ruling: la parte (b) pasa a 0057 y la (c) a 0058 (el script da 0058 como siguiente libre); se corrige en la apertura, que no está publicada | apertura |
