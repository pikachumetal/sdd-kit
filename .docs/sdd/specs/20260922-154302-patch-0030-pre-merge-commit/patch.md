---
id: 20260922-154302-patch-0030-pre-merge-commit
task: 0030
title: Patch — la suite corre también en los commits de merge
type: patch
status: done
created: 2026-09-22
branch: feature/pre-merge
commit: <hash>
---

# Patch 0030 — la suite corre también en los commits de merge

## 1. Síntoma

Del dev-lead: «en este repo la suite no corre en los merges. Git no ejecuta pre-commit en un commit de merge, solo pre-merge-commit, que .githooks/ no tiene (ticket de la task 0025 §2), y todas las tasks se fusionan con --no-ff: un conflicto resuelto a mano puede dejar develop en rojo sin que nada lo diga». Pide además el ancla del ticket 0025 §3: un test que falle si la regla 6 del `CLAUDE.md` no nombra las paradas del perfil `delegate`.

## 2. Causa raíz

- `core.hooksPath` vale `.githooks` y está en la config compartida del repo bare (`git config --show-origin` → `file:D:/code/git/sdd-kit/.git/config`), así que vale para `develop` y para todos los worktrees.
- En `develop` (`b54deac`), `.githooks/` solo tiene `pre-commit` (100755), que ejecuta `Invoke-Pester -Path tests` y bloquea el commit si hay fallos o no hay `pwsh`.
- Según `githooks(5)`, `git merge` que cierra el commit solo invoca `pre-merge-commit`, no `pre-commit`. Sin ese hook, un merge `--no-ff` sin conflictos textuales no pasa la suite. Es lo que vio la task 0025: su merge no imprimió la suite.
- Matiz sobre el reporte: un merge **con conflicto** se cierra con `git commit` (o `git merge --continue`), y ahí sí corre `pre-commit`. El hueco real es el merge que git cierra solo: sin conflicto textual, pero con el resultado roto (dos ramas que cambian cosas compatibles en el texto e incompatibles en la suite).
- Regla 6 del `CLAUDE.md`: hoy nombra bien las paradas («aprobación de la spec», «desvío», «validación final»), pero ningún test lo comprueba, y en la task 0025 la versión anterior («sin checkpoints intermedios») contradijo `control-profiles.md` (ticket 0025 §3).

## 3. Fix

- **Fichero(s)**: `.githooks/pre-merge-commit` (nuevo, 100755, LF), `tests/Hook.Tests.ps1`, `tests/ControlProfiles.Tests.ps1`
- **Cambio**: el hook hace `exec "$(dirname "$0")/pre-commit"`, sin duplicar la suite ni el mensaje de bloqueo. `Hook.Tests.ps1` exige que exista, sea ejecutable en git y delegue en `pre-commit` sin llamar a `Invoke-Pester`. `ControlProfiles.Tests.ps1` exige que la regla 6 cite `control-profiles.md` y nombre las tres paradas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED del hook: tests nuevos sin el fichero | ✅ agente: 3 fallan (no existe, no es 100755, no delega) |
| 2 | RED del ancla: regla 6 con la redacción antigua («ejecuta la task entera sin checkpoints intermedios») | ✅ agente: falla con `Expected regular expression 'aprobación de la spec'`; `CLAUDE.md` restaurado |
| 3 | Suite completa con el fix | ✅ agente: 302 pasan, 0 fallan, 6 skipped |
| 4 | Merge `--no-ff` real de `feature/pre-merge` sobre `develop` en worktree temporal `D:/code/.worktrees/sdd-kit/pm-check` (detached, sin mover `develop`) | ✅ agente: la salida del merge muestra `Tests Passed: 302, Failed: 0, Skipped: 6` y después `Merge made by the 'ort' strategy.` (commit `0a864c9`, padres `b54deac` y la rama) |
| 5 | Mismo merge con un test que falla (`tests/Broken.Tests.ps1` sin trackear) | ✅ agente: `Tests Passed: 302, Failed: 1` y `Commit bloqueado: la suite del kit tiene fallos`; HEAD sigue en `b54deac` |
| 6 | `develop` intacto y worktree temporal retirado | ✅ agente: `develop` en `b54deac`; `pm-check` no aparece en `git worktree list` |

## 5. Tiempo (ligero)

- Estimación: 0,3h
- Real: 0,4h
