---
id: 20261025-134222-patch-0169-git-hooks-warning
task: 0169
title: Patch — el arranque de sesión del repo avisa si los hooks de git no están activos
type: patch
solution: dev-lead
status: done
created: 2026-10-25
branch: feature/0169-git-hooks-warning
commit: f5bc0055
---

# Patch 0169 — el arranque de sesión del repo avisa si los hooks de git no están activos

## Capacidades

- Ninguna, porque ninguna capacidad describe el hook `SessionStart` del repo (`.claude/hooks/Test-KitSessionSource.ps1`) ni `Start-KitSession.ps1`: son herramientas de este repo, no del kit que reciben los proyectos.

## 1. Síntoma

Del [ticket del patch 0167](../../field-reports/20261010-205531-patch-0167-superpowers-7-compat.md) §1: en el clon del dev-lead `git config --show-origin core.hooksPath` no devolvía nada, así que ni `.githooks/pre-commit` ni `pre-merge-commit` corrieron en seis commits; el fix `4da56991` entró con `tests/WordBudget.Tests.ps1` en rojo mientras `patch.md` decía «pre-commit en verde».

De la fila de deuda «Una sesión reanudada fuera del script pierde los agentes y las skills del working tree» ([ticket 0058](../../field-reports/20260925-072843-task-0058-session-model-policy.md) §2, ticket del patch 0069 §3): tras una pausa, la sesión se reanudó sin `Start-KitSession.ps1`; los tipos `sdd-kit:effort-*` desaparecieron y `sdd-feedback` dio `Unknown skill`.

## 2. Solución fijada

Fila 0169 del roadmap (dev-lead, 2026-10-10): «`.claude/hooks/Test-KitSessionSource.ps1` avisa si `git config core.hooksPath` no es `.githooks` y da el comando». Fila de deuda, «Actuar → 0169» (dev-lead): «el aviso dice que una skill que no resuelve se lee de `skills/<nombre>/SKILL.md` de la rama, y `Start-KitSession.ps1` documenta cómo reanudar (`--resume` o `--continue` con los mismos argumentos)».

Lo que da por existente, comprobado: el hook, registrado en `.claude/settings.json` como `SessionStart`; `Start-KitSession.ps1`; y sus tests en `tests/KitSessionSource.Tests.ps1`.

## 3. Fix

- **Fichero(s)**: `.claude/hooks/Test-KitSessionSource.ps1`, `Start-KitSession.ps1`, `tests/KitSessionSource.Tests.ps1`
- **Cambio**: el hook hace dos comprobaciones independientes —de dónde salen las skills y si `git -C <proyecto> config --get core.hooksPath` devuelve `.githooks`— y junta en un solo `systemMessage` y un solo `additionalContext` los avisos que tocan. El aviso de la caché añade cómo reanudar y qué hacer con una skill que no resuelve; `Start-KitSession.ps1` documenta la reanudación en su cabecera.
- **Decisiones**:
  - El comando del aviso es `git config core.hooksPath .githooks` — dev-lead
  - El aviso de la caché manda leer con `Read` de `skills/<nombre>/SKILL.md` una skill que no resuelve, y el script documenta `--resume` o `--continue` con los mismos argumentos — dev-lead
  - Sin texto de skill: no pide RED de sujetos (Art. I) — dev-lead
  - El aviso de los hooks también va al agente (`additionalContext`): no escribir «pre-commit en verde» sin haber ejecutado sus comprobaciones, que es la segunda mitad de la propuesta del ticket §1 — sin el dev-lead (no cambia lo que ve ni puede hacer el usuario del kit: es el contexto del agente en este repo)
  - El aviso de los hooks sale aunque la sesión venga del script: son dos comprobaciones independientes — sin el dev-lead (lo exige el criterio de aceptación del ticket, que arranca con `Start-KitSession.ps1`)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: 6 tests nuevos en `tests/KitSessionSource.Tests.ps1` (aviso de hooks, su comando, su contexto, sin aviso de caché desde el script, reanudación en el aviso y en el script, skill que no resuelve) | 18/6 antes del fix |
| 2 | GREEN: `Invoke-Pester tests/KitSessionSource.Tests.ps1` | 24/0 |
| 3 | Smoke con la invocación del settings (`pwsh -NoProfile -File`): sesión del script en este worktree, con `core.hooksPath` = `.githooks` | sin salida, exit 0 |
| 4 | Smoke en un repo recién creado, sin `core.hooksPath` y fuera del script | los dos avisos en un `systemMessage`, con `git config core.hooksPath .githooks`; exit 0 |
| 5 | Commit del fix con el pre-commit activo (`git config core.hooksPath` → `.githooks`, comprobado) | `kit:test-fast` 1284/0 |
| 6 | Gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` | kit:test 1370/0/12 · cli:test 1164/1164 · cli:test-slow 295/295 · cli:test-min 1459/1459 |

Incidente durante el fix: la primera versión de los tests hacía `git init` sin limpiar las variables de git, y el pre-commit exporta `GIT_DIR`. Dentro del hook ese `git init` reinicializó el repo compartido del kit y dejó `core.bare = true` en su `config`, y el checkout principal dejó de funcionar (`fatal: this operation must be run in a work tree`). Se restauró a `false` en cuanto se vio. El test carga ahora `tests/Clear-GitEnv.ps1` en todo el fichero, y se comprobó con `GIT_DIR` apuntando a un repo señuelo, que siguió sin `bare`.

Validación en campo: 2026-10-25 · RED 18/6 → GREEN 24/0 en `tests/KitSessionSource.Tests.ps1` · smoke del hook 2/2 casos con la invocación de `.claude/settings.json` · gate de cierre en verde · no probado: una sesión interactiva de Claude Code real arrancada en un clon sin `core.hooksPath`

## 5. Tiempo (ligero)

- Estimación: 0,5 h
- Inicio: 2026-10-25T13:42Z
- Esfuerzo real: 0,42 h — reloj de la sesión 0,42 h desde 2026-10-25T13:41Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: no aplica
