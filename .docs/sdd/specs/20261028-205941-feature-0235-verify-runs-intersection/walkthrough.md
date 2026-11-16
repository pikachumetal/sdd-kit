---
id: 20261028-205941-feature-0235-verify-runs-intersection
feature: 0235
title: Walkthrough — sdd merge --verify corre solo lo que se cruza y sin shell
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-28
---

# Walkthrough — `sdd merge --verify` corre solo lo que se cruza y sin shell

## 1. Cambios realizados

- **Gate sin shell** (Task 1, `b11eefb`): `parseGate` de `cli/src/merge/verify.ts` parte el valor de `--verify` en argumentos (las comillas agrupan; una sin cerrar llega hasta el final) y rechaza `&&`, `||`, `;`, `|`, `>` y `<` fuera de comillas con salida 2 antes del cerrojo (`run.ts`). `runTee` lo lanza con `resolveCommand` y `launchSpec` de `cli/src/tasks/command.ts`, que ahora devuelve también `windowsVerbatimArguments`; un programa que no está da `verificación: no se encuentra '<programa>' en el PATH`. Fuera `WINDOWS_SHELLS`, `shellCommand` y `verify.slow.test.ts`. Las fixtures de `cli/test/merge/` pasan a `node` (`nodeGate`, `publishScript`, `failGate`, `failsIfExists`, `sleepCommand`).
- **El cruce con moon** (Task 2, `df9da2e`..`7dbd57c`): módulo nuevo `cli/src/merge/affected.ts` (`readMoonGate`, `planGate`, `branchOnly`, `queryTasks`, `noCross`). Con un gate `moon run … --affected`, `verifyMerge` pregunta a moon por la rama (merge-base..rama) y por la base (verificado..`HEAD`) y corre la intersección con `--affected --base <verificado>`; sin `--verified-at`, lo de la rama con `--base <merge-base>`; sin cruce posible, lo mismo con la línea `verificación: sin cruce: …`. `VerificationFailed.contrast` lleva lo que corrió, y `explainFailure` lo repite sobre la base sin `--affected`. `run.ts` (merge y reintentos) y `hotfix.ts` (ida y vuelta) pasan la rama y su merge-base (`branchMergeBase` de `steps.ts`). Tests: `affected.test.ts`, `affected.slow.test.ts` (un `moon.cmd` falso) e `intersection.slow.test.ts` (un workspace de moon de dos proyectos: 11 casos).
- **Skills** (Task 3, `e050555`): paso 9 de `skills/sdd-upgrade/references/migrations/v3.0.0.md`, con las dos líneas del informe en un bloque; la viñeta de `--verify` y cuatro filas de salidas en `skills/sdd-archive/references/merge-recipe.md`; escenario `g1` (`v2x-gate`) en `tests/batteries/sdd-upgrade/`, con `tests/v3-gate-warning-red.md` y `-green.md`.
- **Pasada de fix** y arreglos de lo que dejó la re-revisión, juntados en el cierre: ver §3. `architecture.md` describe el contrato con moon; `cli/test/docs-claims.test.ts` lee un valor entre comillas como valor.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5 h
- Esfuerzo real: 2,36 h — reloj de la sesión 2,79 h desde 2026-10-28T19:53Z, sin 25 min de espera al dev-lead (2 esperas)
- Desviación: −2,64 h (−53 %)
- Causa de la desviación: la estimación se hizo en horas de persona, contando la Task 2 como la gorda por las fixtures de moon; el prototipo de moon de la spec dejó resuelto el contrato (`MOON_BASE`, el stdin), y el lanzador sin shell ya existía (`tasks/command.ts`). Las suites lentas (~10 min cada pasada de `test/merge`) corrieron en segundo plano mientras avanzaba la task siguiente.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 87.210.716 — claude-opus-5-5 87.210.716
- Tokens de subagentes: 8.299.822 en 6 despachos — Final review — Architecture axis claude-opus-5-5 1.992.614 / 3 min; Final review — Code axis claude-sonnet-5-5 1.051.615 / 3 min; Revisor técnico spec 0235 claude-sonnet-5-5 490.177 / 1 min; Final review — Spec axis claude-opus-5-5 2.240.805 / 5 min; Revisor de dominio spec 0235 claude-opus-5-5 508.122 / 2 min; Re-review final 0235 claude-opus-5-5 2.016.489 / 5 min
- Coste de la sesión: 32,08 $ (hilo 25,62 $ + subagentes 6,47 $)
- Coste de sujetos: 1,31 $ en 3 sujetos sonnet — sdd-upgrade g1: red 0,44 $; green 0,44 $; refactor1 0,43 $
- Review de spec: 2 revisores · hallazgos 19, aceptados 18

## 3. Desviaciones del plan

- El escenario de la batería es `g1` (paso `v3-gate`), no `v3`: ese id ya era el de E2E.
- Una tanda de REFACTOR en la Task 3: el GREEN avisó con sus palabras; el paso 9 pasó a un contrato (bloque `text`) y el REFACTOR dio el literal.
- La revisión final pidió más de lo previsto en `affected.ts` y `verify.ts`: los targets tras las opciones, los argumentos de paso tras `--`, el `moon.cmd`, el moon del gate, `GIT_*`, el timeout y `parseGate` como expresión regular.
- Tras la re-revisión, un arreglo más de dos Important que dejó abiertos, juntado en el cierre; queda **sin revisar**.
- La Task 2 queda en tres commits (`df9da2e`, `1f16c68`, `7dbd57c`) sin juntar: los dos arreglos de entorno de sus tests llegaron tras su primer `sdd task done` en rojo, ya con la Task 3 encima, y juntarlos exige reescribir la Task 3 (la receta no admite `rebase -i`).

### Decisiones tomadas sin el dev-lead

- Task 1: se borra `cli/test/merge/verify.slow.test.ts` (powershell.exe cuando no hay pwsh) — prueba el respaldo de shell que la spec retira; lo sustituye «runs the gate with a PATH without pwsh» — coste si está mal: ninguno
- Task 2: `verifyMerge` devuelve `void`, no el sha verificado — `publish` ya toma `HEAD` antes de integrar — coste: ninguno
- Task 2: `parseTaskTargets` lee el campo `target` de `moon query tasks` — moon 2.6.0 lo trae y es el id que acepta `moon run` — coste: un proyecto con alias saldría con su id
- Task 2: `branchMergeBase(worktree, branch)` en `steps.ts` usa `HEAD` antes del merge — el mismo commit que `before`, compartido por `run.ts` y `hotfix.ts` — coste: ninguno
- Task 2: `queryTasks` cierra el stdin de moon (`child.stdin.end()`) — `execFile` no admite `stdio`; mismo efecto — coste: ninguno
- Task 2: `withPath` del test lento quita también `MSYSTEM` — lanzado desde Git Bash, el `git.exe` de `Git\cmd` no añade mingw64 al `PATH` restringido y `git fetch` falla — coste: ninguno
- Task 2: `hookTimeout` 120 s en `helpers.ts` — el `afterAll` que borra las fixtures de moon pasó de 10 s con la máquina cargada — coste: ninguno
- Task 3: tanda de REFACTOR — fallo de forma (Art. II) → contrato del output; campaña 3 sujetos, 1,31 $ de 1,8 $ — coste: ninguno
- Task 3: la verificación es `test/kit` con `--test-timeout 120000` — sin él, `upstream-watch.slow.test.ts` cae por el tope de 5 s de vitest — coste: ninguno
- Final (Spec I6): `merge-recipe.md` sin batería propia (ADR 0002) — la decisión 16 de la spec lo decidió: solo nombra la salida de la CLI — coste: un agente que no copie las líneas `verificación:` al `Gate:`
- Final (Código m4): sin `--verified-at` y nada que toque la rama no sale línea — decisión 7 de la spec — coste: un gate que no corrió nada sin decirlo
- Final (Código m8): `branchMergeBase` corre también sin `--verify` — sin historia común el merge falla igual — coste: otro texto de error
- Final (Arquitectura m5): `tasks/command.ts` es infraestructura compartida en un dominio — fila de deuda — coste: ninguno ahora
- Final (Arquitectura m7): «no las expande» no vale para `%VAR%` en un `.cmd` — literal de la decisión 13, límite de la decisión 10 — coste: un aviso algo optimista en Windows con `.cmd`
- Final (Spec m): `--affected <valor>` separado — el contraste quita `--affected` y su valor — coste: ninguno
- Final (Spec m): log del contraste en el temporal de la pasada sin borrar en el lento — patrón de `base-red` — coste: ninguno
- Final (Spec m): `QUERY` sintético en el unitario — la forma es la de moon 2.6.0, y los lentos usan salidas reales — coste: ninguno
- Final (N3): el timeout de `queryTasks` mata solo `cmd.exe` con un `moon.cmd` — el fallback corre igual — coste: un `moon.exe` huérfano tras 5 min colgado
- Final: el RED de `docs-claims` no se reproduce en el commit de la pasada de fix — la línea era del delta de capacidad sin commitear — coste: ninguno
- ✋ sin revisar: juntado en el cierre — un target tras las opciones vuelve a los targets y cruza; el valor de una opción se queda en su sitio (`--concurrency 2`); el contraste quita `--affected` con su valor; una comilla sin cerrar llega hasta el final; los `\n` de dos mensajes

## 4. Verificación

### 4.1 Builds

- Línea base, sin filtro (rama nueva): `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test` → kit:test-headless: corrió 221/221 · cli:typecheck: verde · cli:test: corrió 1583/1595 (12 omitidos) · 2 min 24 s · sobre `bb63995`
- Verificación de las tasks: `pnpm --dir cli exec vitest run test/merge --test-timeout 120000` → 158/158 (Task 1), 178/178 (Task 2), 186/186 (pasada de fix), 189/189 (arreglos tras la re-revisión); `test/kit` → 428/440 (12 omitidos) (Task 3).
- Gate de cierre: corre una vez sobre el merge de sincronización (la base iba 33 commits por delante); su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-28 · `test/merge` 189/189 sobre los arreglos tras la re-revisión (con los 11 lentos de cruce contra moon 2.6.0 real y el de `moon.cmd`) · `sdd merge --check --verify "pnpm lint && pnpm test"` → salida 2 con el literal, ejecución real · batería `sdd-upgrade` g1 verde (refactor1) · revisión final en tres ejes sobre `e050555` y re-revisión de la pasada de fix, 1 sin revisar (los arreglos posteriores, juntados en el cierre)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Rama en frontend, base en backend: no corre nada, dos `saltada`, fusiona | suite (`skips when the base does not touch the branch inputs`, merge real con moon) | ✅ |
| La base también toca frontend: `corre frontend:test` y `moon run frontend:test --affected --base a1b2c3d` | suite (`runs the task both sides touch`; unitario del argv) | ✅ |
| Commit de la rama posterior al verificado corre | suite (`runs a branch commit after verified-at`) | ✅ |
| La rama desde el merge-base; el `--base` declarado no cuenta | suite (`keeps the wrapper and replaces only targets and base`) | ✅ |
| Sin `--verified-at`, corre lo de la rama | suite | ✅ |
| `-g`/`--include-relations` | suite (unitario de `relations`); el efecto lo da moon con `MOON_INCLUDE_RELATIONS` | ✅ parcial |
| Tarea que nadie toca no sale | suite (`leaves out tasks the gate does not name`) | ✅ |
| Gate sin `--affected` o no moon corre como está | suite (todos los lentos con `node`) | ✅ |
| `--stdin`/`--status`/`--force`/target no admitido → `sin cruce` | suite (unitarios de `blocker`, `noCross`, `branchOnly`) | ✅ |
| `moon query` falla → `sin cruce: moon query falló` | suite (`falls back to the branch when moon query fails`) | ✅ |
| Hotfix ida y vuelta | suite (`crosses on a hotfix`) | ✅ |
| Windows sin `pwsh` ni `powershell.exe`: el gate corre | suite (`runs the gate with a PATH without pwsh`) | ✅ |
| Las comillas agrupan | suite | ✅ |
| `.cmd` con el `cmd.exe` de `ComSpec` | suite (`asks a moon.cmd with its arguments intact…`) | ✅ |
| `pnpm lint && pnpm test` → salida 2 sin cerrojo | ejecución real (`sdd merge --check --verify …` → exit 2 y el literal) | ✅ |
| `$VAR`, `%VAR%`, `~` literales | suite (`keeps variables literal`) | ✅ |
| Programa que no está → `no se encuentra` | suite (`names a missing program`) | ✅ |
| MODIFIED «La suite no se repite…»: omitida, cruce, Mergiraf | suite (`verified-at.slow`, `mergiraf.slow`, cruce) | ✅ |
| MODIFIED del reintento | suite (`crosses again on a push retry`, `push-retry.slow`) | ✅ |
| MODIFIED del merge que falla: contraste de lo que corrió | suite (`contrasts the crossed targets on the base`, `base-red.slow`) | ✅ |
| Migración: aviso con el literal, la línea sin cambios, sin gate | batería `g1` (refactor1) | ✅ |
| Migración: variables, «Gate de cierre» sin «Gate de merge», salto | no probado (lo fija el mismo bloque; sin sujeto propio por la previsión) | — |

### 4.3 Residuales / deuda generada

- `cli/src/tasks/command.ts` es el lanzador de procesos de toda la CLI y vive en `tasks/` → fila de deuda.
- `runTee` lanza el gate sin `isolatedEnv`: un `moon run` lanzado desde un hook heredaría `GIT_DIR` → fila de deuda.

## 5. Aprendizajes

- `moon query tasks --affected` sigue `MOON_BASE`, `MOON_HEAD` y `MOON_INCLUDE_RELATIONS`, y con el stdin abierto espera la lista de ficheros sin acabar → `architecture.md` (contrato con moon).
- Con un `PATH` restringido, el `git.exe` de `Git\cmd` heredando `MSYSTEM` de Git Bash no encuentra lo de mingw64 y `git fetch` falla → `tech-stack.md` §Testing.
- Un `.cmd` lanzado sin shell necesita `windowsVerbatimArguments`, y el lanzador lo devuelve junto al fichero para que ningún llamante lo olvide → `architecture.md` (contrato con moon y lanzador).
- Skills: `sdd-upgrade` (paso 9) y `sdd-archive` (receta) se editaron en la feature; `.claude/skills/` del repo solo lleva enlaces a skills de terceros (`skill-creator`, `writing-for-agents`, `writing-skills`), sin nada que tocar.

## 6. Adendas
