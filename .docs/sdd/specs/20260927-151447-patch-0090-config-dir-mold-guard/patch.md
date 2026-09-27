---
id: 20260927-151447-patch-0090-config-dir-mold-guard
task: 0090
title: Patch — transcripts de todas las configuraciones de Claude Code y molde que no es su propio repo
type: patch
status: done
created: 2026-09-27
branch: patch/0090-config-dir-mold-guard
commit: <hash>
---

# Patch 0090 — transcripts de todas las configuraciones de Claude Code y molde que no es su propio repo

Dos piezas que decidió el dev-lead el 2026-09-27, antes del corte de la 2.0.0, sin sujetos.

## Capacidades

- Modificadas: `estimation` — sin `-ProjectsRoot`, el script junta los transcripts de todas las configuraciones de Claude Code

## 1. Síntoma

**Pieza 1** (ticket de la feature 0032 §3, ticket de la feature 0085 §4 y [ticket de la feature 0086](../../field-reports/20260927-135601-feature-0086-spec-review-weight.md) §6): con la configuración en `~/.claude-gco`, cada cierre dio «no medido» hasta pasar `-ProjectsRoot` a mano.

**Pieza 2** ([ticket de la feature 0086](../../field-reports/20260927-135601-feature-0086-spec-review-weight.md) §1): un `subject.sh` sin `git init`, con `%TEMP%` dentro de un repo, cambió el HEAD de ese repo y le dejó 377 objetos.

## 2. Causa raíz

**Pieza 1**: `Measure-SessionTokens.ps1` fijaba `[string]$ProjectsRoot = (Join-Path $HOME '.claude/projects')`. En esta máquina, `CLAUDE_CONFIG_DIR=C:\Users\pikac\.claude-gco`: la carpeta de transcripts de este worktree existe en `~/.claude-gco/projects/` y no en `~/.claude/projects/`. La versión original del script da «no medido» con un home falso que solo tiene `~/.claude-gco`.

Durante el patch, el dev-lead amplió la decisión: tiene dos cuentas y cambió de una a otra hoy, así que las sesiones de un mismo worktree pueden quedar repartidas. Elegir una sola carpeta perdería las de la otra: «la solución debe ser que sea transparente a dónde esté claude, si en .claude o .claude-<loquesea>».

**Pieza 2**: `g()` de `tests/headless/lib.sh` es `git -C "$R" …` sin comprobar que `$R` tiene su propio `.git`. `subject_init` crea `$R` con `mkdir` y no hace `git init`. Sin el `g init` del `subject.sh`, git sube por los padres hasta el primer repo que encuentra. Reproducido en `HeadlessLauncher.Tests.ps1` con un molde sin `g init` dentro de un repo: el sujeto terminó «listo» y el commit fue al repo de fuera.

## 3. Fix

- **Ficheros**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`, `tests/headless/lib.sh`, `tests/Measure-SessionTokens.Tests.ps1`, `tests/HeadlessLauncher.Tests.ps1`; docs: `tech-stack.md`, `estimation.md`, fila de deuda quitada y fila 0090 del `roadmap.md`.
- **Cambio 1**: sin `-ProjectsRoot`, el script junta `$env:CLAUDE_CONFIG_DIR`, `~/.claude` y `~/.claude-*`, sin repetir la misma carpeta, y lee la carpeta del worktree en cada una que exista. `-ProjectsRoot` acepta ahora varias rutas.
- **Cambio 2**: `g` llama a `mold_is_repo` antes de su primer uso que no sea `init`, y aborta con «el molde … no es su propio repo git: falta g init en el subject.sh antes del primer g». El predicado es `git rev-parse --show-cdup` vacío, que equivale a «`--show-toplevel` es `$R`» sin comparar `C:/…` con `/c/…` ni nombres cortos de Windows.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Home con `.claude` y `.claude-gco`: suma las dos (3.505.005). RED con el script original: 2.605.005 | ✅ |
| 2 | `CLAUDE_CONFIG_DIR` con un nombre distinto de `.claude*`: la lee. RED: 2.605.005 | ✅ |
| 3 | `CLAUDE_CONFIG_DIR` que coincide con `~/.claude-gco`: no cuenta dos veces (2.605.005). RED: «no medido» | ✅ |
| 4 | Molde sin `g init` dentro de un repo (`DRY_RUN=1`): aborta, el repo de fuera sigue sin HEAD y no hay salidas. RED: «[a-1] listo» | ✅ |
| 5 | Los 50 `subject.sh` versionados: los que cargan `lib.sh` hacen `g init` antes del primer `g` en el flujo principal | ✅ |
| 6 | Este worktree sin `-ProjectsRoot`: mide la sesión (3.430.767 tokens del hilo) | ✅ |
| 7 | `Invoke-Pester tests`: 957 pasan, 0 fallan, 10 skipped | ✅ |

## 5. Tiempo (ligero)

- Estimación: S
- Real: 0,5 h

## 6. Delta de capacidad

### Capacidad: `estimation`

**ADDED — Sin `-ProjectsRoot`, junta todas las configuraciones de Claude Code**
- GIVEN un home con `~/.claude/projects/<carpeta del worktree>/` y `~/.claude-gco/projects/<carpeta del worktree>/`, cada una con una sesión, y `CLAUDE_CONFIG_DIR` que apunta a `~/.claude-gco` o a otra carpeta
- WHEN se ejecuta `Measure-SessionTokens.ps1` sin `-ProjectsRoot`
- THEN el hilo suma las sesiones de `CLAUDE_CONFIG_DIR`, `~/.claude` y todas las `~/.claude-*` que tengan carpeta del worktree
- AND una carpeta que nombran a la vez `CLAUDE_CONFIG_DIR` y el home cuenta una sola vez
