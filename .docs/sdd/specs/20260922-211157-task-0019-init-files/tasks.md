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
| 1 | Paridad migración–init | done | `ba20ef5` | el test destapó que ninguna init nombraba `ids.mode` literal |
| 2 | Configuración y log que deja la init, y su migración | done | `80a0617` | la regla de `true` sube también al `SKILL.md` de brownfield (anatomía: lo que decide no va solo en `references/`) |
| 3 | Proyecto de referencia | done | `bc33a97` | |
| 4 | «Ficheros que toca» en la tabla de release | done | `4dfa57b` | |
| 5 | GREEN headless y evidencia | done | `e1efdc3` | 18 sujetos (14 + 4 de re-verificación), 8,14 $; dos REFACTOR, en `tests/init-files-green.md` |

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests` verde (325/0)
- [x] Task 2 — `Invoke-Pester tests` verde (333/0)
- [x] Task 3 — `Invoke-Pester tests` verde (336/0)
- [x] Task 4 — `Invoke-Pester tests` verde (338/0)
- [x] Task 5 — veredicto por THEN en `tests/init-files-green.md` (suite 339/0)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
