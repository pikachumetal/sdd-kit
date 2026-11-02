---
id: 20261102-193802-patch-0293-precommit-clean-git-env
task: 0293
title: Patch — el pre-commit lanza las comprobaciones sin las variables locales de git
type: patch
solution: dev-lead
status: done
created: 2026-11-02
branch: patch/0293-precommit-clean-git-env
commit: 9b1542aa
---

# Patch 0293 — El pre-commit lanza las comprobaciones sin las variables locales de git

Validación: agente, «Perfil delegate» — `validation.mode: field`: el uso real lo validan los tickets.

## Capacidades

- Ninguna, porque ninguna capacidad describe los hooks de git de este repo

## 1. Síntoma

Fila 0293 y [ticket del patch 0169](../../field-reports/20261025-151935-patch-0169-git-hooks-warning.md) §1: dentro del pre-commit, un test que lanza `git init` sin limpiar el entorno reinicializa el repo común y lo deja con `core.bare = true`; todas las ramas se paran con `this operation must be run in a work tree`. Pasó en la 0169 y en la rama de la 0192, que además dejó una rama `feature/1` y commits ajenos. El vigilante `cli/test/kit/git-env.slow.test.ts` es lento y no corre en el pre-commit.

## 2. Solución fijada

Del dev-lead, en la petición: «`.githooks/pre-commit` lanza `moon` con un entorno sin `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE` y las demás variables locales del repo», con la lista de `git rev-parse --local-env-vars` o de `GIT_ENV_NAMES` si cubre lo mismo, y un test en un repo temporal y con entorno limpio.

Lo que da por existente, comprobado: el hook y el vigilante. `GIT_ENV_NAMES` no cubre lo mismo: tiene 5 nombres frente a los 15 de `git rev-parse --local-env-vars` (git 2.x de esta máquina).

## 3. Fix

- **Fichero(s)**: `.githooks/pre-commit`, `cli/test/kit/hooks.slow.test.ts`, `.docs/sdd/tech-stack.md`.
- **Cambio**: el hook pide la lista a `git rev-parse --local-env-vars` y lanza `moon` con el entorno sin esos nombres. `.githooks/pre-merge-commit` lanza los tests delegando en `pre-commit`, así que queda cubierto sin tocarlo.
- **Decisiones**:
  - La lista sale de `git rev-parse --local-env-vars`, no de `GIT_ENV_NAMES` — dev-lead (la petición lo condiciona a que cubra lo mismo, y no cubre)
  - Si `git rev-parse` falla, el commit se bloquea en vez de correr el gate sin limpiar — sin el dev-lead
  - El test usa el `moon` real sobre un workspace temporal, porque en Windows `spawnSync` sin shell no lanza un `moon` falso que no sea `.exe`; y un worktree enlazado, porque ahí git exporta el `GIT_DIR` absoluto del incidente — sin el dev-lead
  - Tres casos: gate con `git init`, gate normal y gate en rojo, que sigue bloqueando — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: `pnpm --dir cli exec vitest run test/kit/hooks.slow.test.ts --test-timeout 120000`, antes del fix | ❌ 1 rojo de 12: `expected 'true' to be 'false'` en `core.bare` del repo temporal; `core.bare` del repo real, `false` |
| 2 | GREEN: `pnpm exec vitest run test/kit/hooks.slow.test.ts test/kit/git-env.slow.test.ts --test-timeout 120000` | ✅ 20/20: con el gate que hace `git init`, `core.bare` en `false`, solo las ramas `main` y `work`, un único commit propio, y el `feature/1` ajeno en el repo hijo; un commit normal pasa; un gate en rojo bloquea |
| 3 | `pnpm exec tsc --noEmit` | ✅ sin errores |
| 4 | Commit del fix con el pre-commit real (`git config core.hooksPath` → `.githooks`) | ✅ `cli:test` 2079 passed, 12 skipped; `core.bare` del repo después: `false` · ejecución real |

Los casos los verificó el agente. Los casos 1 y 2 son `ejecución real`: un `git commit` de verdad con el hook, `moon` y un worktree enlazado en un repo temporal.

Otros hooks: `.githooks/pre-merge-commit` lanza los tests delegando en `pre-commit`, así que hereda el arreglo; no hay más hooks en `.githooks/`.

Validación en campo: 2026-11-02 · RED→GREEN en `hooks.slow.test.ts` · commit real por el hook · el gate de cierre corre en la base integrada, porque `feature/0194-roadmap-whats-next` está abierta a la vez · no probado: el `pre-merge-commit` con un gate que hace `git init` (delega en el hook probado)

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-02T19:38Z
- Esfuerzo real: 0,06 h — reloj de la sesión 0,06 h desde 2026-11-02T19:35Z, sin 0 min de espera al dev-lead (0 esperas)
- Desvío: -89 %, sin medir
- Tokens del hilo: 1.509.548 — claude-opus-5-5 1.509.548
- Tokens de subagentes: no aplica
- Coste de la sesión: 1,69 $ (hilo 1,69 $)
- Coste de sujetos: no aplica
