---
id: 20260923-143450-task-0040-close-push
title: Tasks — Final del cierre: push autorizado y aviso de terminado
spec: ./spec.md
plan: ./plan.md
created: 2026-09-23
---

# Tasks — Final del cierre: push autorizado y aviso de terminado (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0040`

## Estado de las tasks

Status: `pending` → `in_progress` → `done` (o `blocked` / `skipped`).

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `merge.push`: clave, gates y pregunta | done | `8843a37` | en línea; RED 7 fallos por aserción → 53/0 |
| 2 | Push en el paso de rama | done | `5e157eb` | en línea; RED 2 → 32/0. El hook `block-dangerous-git.js` casó `--force` en el mensaje de commit: mensaje por fichero |
| 3 | Paso «Mensaje final» | done | `b16db17` | en línea; RED 4 → 160/0 (ControlProfiles, Skills, KitFeedback) |
| 4 | GREEN | done | (este commit) | en línea; tres tandas y dos REFACTOR (`6c9d689`, `5f9315d`); 12,75 $ |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/ControlProfiles.Tests.ps1, tests/MigrationInitParity.Tests.ps1`: 53/0
- [x] Task 2 — `Invoke-Pester -Path tests/ControlProfiles.Tests.ps1`: 32/0
- [x] Task 3 — `Invoke-Pester -Path tests/ControlProfiles.Tests.ps1`: 35/0
- [x] Task 4 — veredictos del GREEN en `green/out/`, `out2/`, `out3/`, `f2/` y `f3/` (`tests/close-push-green.md`)

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |
| La línea de terminado ofrecía borrar el checkout principal en un repo sin worktrees (GREEN, escenario F) | la spec suponía siempre un worktree enlazado | enmienda aprobada por el dev-lead («si»); un AND en el requisito y una frase en los dos cierres | `5f9315d` |
| Los `state.txt` de las campañas llevaban rutas locales con el usuario de la máquina | el `sed` del lanzador de la 0009 solo reemplazaba la ruta en forma Unix | ruling: limpiadas en esta task y el lanzador del GREEN reemplaza las dos formas; la carpeta de la 0009 queda a deuda | (este commit) |
