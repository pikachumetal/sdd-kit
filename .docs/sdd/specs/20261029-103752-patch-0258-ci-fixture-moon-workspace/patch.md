---
id: 20261029-103752-patch-0258-ci-fixture-moon-workspace
task: 0258
title: Patch — moon dentro de una tarea de moon resuelve el workspace de fuera
type: patch
solution: causa raíz
status: done
created: 2026-10-29
branch: patch/0258-ci-fixture-moon-workspace
commit: <hash>
---

# Patch 0258 — moon dentro de una tarea de moon resuelve el workspace de fuera

## Capacidades

- Ninguna, porque el fix devuelve `sdd merge --verify` a lo que ya dice `archive`: cruza con las tareas del workspace del worktree que fusiona

## 1. Síntoma

Reportado (fila 0258 del roadmap): desde el merge de la 0235 (`b7aae71f`), el run 40782953211 de `ci.yml` sale en rojo en `cli:test-min` con 7 tests de `cli/test/merge/intersection.slow.test.ts`; en Windows pasan. El `moon query` del fixture hashea `.temp/vitest-…/sdd-merge-…` relativo a la raíz del kit, corre su `cli:test` y su git da:

```text
verificación: sin cruce: moon query falló (…)
  × Process git failed: exit code 128
  │ fatal: bad object b538f11b1228f180195c1e2704a19ab6883d96ee
```

Medido: no es de Linux. En Windows, `pnpm exec vitest run test/merge/intersection.slow.test.ts` con `MOON_WORKSPACE_ROOT` apuntando a la raíz del kit da los mismos 7 rojos (11 tests, 7 failed); sin la variable, 11/11 en verde. En la CI los tests corren dentro de la tarea `cli:test-min` de moon; en el cierre de la 0235 corrieron con vitest fuera de moon.

## 2. Causa raíz

moon exporta a cada proceso de tarea su contexto: `MOON_WORKSPACE_ROOT`, `MOON_WORKING_DIR`, `MOON_CACHE_DIR`, `MOON_PROJECT_ROOT`, `MOON_PROJECT_ID`, `MOON_TARGET`, `MOON_TASK_*`… (medido con una tarea que lista las variables `MOON_` de su entorno). Un `moon` lanzado por ese proceso toma `MOON_WORKSPACE_ROOT` como su workspace en vez de buscar `.moon/` desde el `cwd`: en un workspace de prueba bajo `.temp/`, `moon query tasks` da `a:test` limpio y `cli:test`, `kit:roadmap`… con la variable heredada.

`queryTasks` (`cli/src/merge/affected.ts`) lanza `moon query tasks --affected` con `cwd` en el worktree y el entorno de `isolatedEnv()`, que solo quita las variables de git (`GIT_DIR`, `GIT_WORK_TREE`…): hereda `MOON_WORKSPACE_ROOT` del `moon run cli:test-min` de fuera, consulta el workspace del kit y su git no conoce el sha de la base del fixture. El gate del `--verify` (`runTee` de `cli/src/merge/verify.ts`, con `spawn` sin `env`) hereda lo mismo: el rojo corre el `cli:test` del kit en lugar del `:test` del fixture.

Lo sufre un proyecto real, no solo el test: cualquier `sdd merge --verify` lanzado dentro de una tarea de moon (un hook o una CI que lo envuelva en `moon run`) consultaría y correría las tareas del workspace de fuera. El `.temp/` del repo no es la causa: sin la variable, el fixture bajo `.temp/` resuelve su propio workspace.

## 3. Fix

- **Fichero(s)**: `cli/src/merge/affected.ts`, `cli/src/merge/verify.ts`, `cli/test/merge/intersection.slow.test.ts`
- **Cambio**: `withoutMoonTask` quita del entorno las variables de contexto que moon exporta a una tarea (`MOON_WORKSPACE_ROOT`, `MOON_WORKING_DIR`, `MOON_CACHE_DIR`, `MOON_PROJECT_*`, `MOON_TARGET`, `MOON_TASK_*`); lo usan `queryTasks` y el `runTee` del gate. Las de configuración (`MOON_LOG`, `MOON_THEME`…) se heredan. `run.ts` no se toca (la 0251 lo cambia).
- **Decisiones**:
  - El arreglo va en el código y no en el fixture: un `sdd merge --verify` dentro de una tarea de moon lo sufre igual — dev-lead (regla del prompt: «queryTasks… si un proyecto real también la sufre»)
  - El gate de `verify.ts` también se limpia, por la misma causa; `GIT_DIR` en el gate sigue fuera (su fila de deuda, «Esperar 2.º ticket») — sin el dev-lead
  - La reproducción se hizo en Windows con la condición de la CI (`MOON_WORKSPACE_ROOT` heredado), no en un contenedor Linux: la medida mostró que la causa no depende del sistema; Linux lo confirma el run de `ci.yml` sobre el merge — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Test nuevo «ignores the moon workspace it inherits from a task» (fija `MOON_WORKSPACE_ROOT` a otro workspace) | ✅ RED antes del fix: `fatal: bad object 02c40743…`, el síntoma de la CI → GREEN |
| 2 | `intersection.slow.test.ts` entero, limpio y con `MOON_WORKSPACE_ROOT` = raíz del kit | ✅ antes del fix: 11/11 limpio, 7 rojos heredado → después: 12/12 en los dos |
| 3 | `tsc --noEmit` | ✅ |
| 4 | run de `ci.yml` sobre el merge en `develop` (Linux) | pendiente: tras el merge |

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,2 h del gate de cierre (12 min, patch 0245)
- Inicio: 2026-10-29T10:31Z
