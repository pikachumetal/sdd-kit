---
id: 20261026-170842-feature-0227-behavior-tests-to-vitest
feature: 0227
title: Plan de implementación — Conducta a Vitest: el lanzador de sujetos, los hooks y git
spec: ./spec.md
status: approved
created: 2026-10-26
---

# Plan de implementación — Conducta a Vitest: el lanzador de sujetos, los hooks y git

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, así que todas las tasks las hace la sesión (Opus 5.5, la que eligió el dev-lead al aprobar sin parar antes de la Task 1). Revisión final: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`; Arquitectura no (ver «Eje Arquitectura»).
2. **Ejecución**: native (motivo en la línea `Ejecución`).
3. **La tabla `It` → `it` de la decisión 2 de la spec es un cotejo de nombres, no una lista escrita a mano**: cada `it` lleva el nombre literal del `It` de Pester (con `<Param>` sustituido como hace `-ForEach`, en Vitest con `it.each` y `$param`). `compare-names.mjs`, un script desechable del scratchpad, saca los nombres de cada `.Tests.ps1` de `develop` (`git show develop:tests/<f>`) y de los `cli/test/kit/**` de la rama, y lista los que faltan en cada lado. Cada task lo corre sobre sus ficheros y espera `faltan 0` salvo los 3 retirados por la spec (decisiones 9 y 10); el walkthrough pega su salida final. Escribir a mano 170 filas sería una transcripción que nadie coteja.
4. **Los nombres de `describe`** también se conservan; los ficheros nuevos van en inglés kebab-case (`run-dry.slow.test.ts`), como el resto de `cli/test/`.
5. **Excepción a la regla de git (Task 1)**: la lectura de lo staged del control de privacidad hereda el entorno a propósito (dentro del hook, `GIT_INDEX_FILE` dice qué índice se commitea). La regla acepta `env: process.env` escrito, con su comentario del porqué; el Pester lo resolvía igual (no limpiaba en esa función).
6. **Riesgo alto**: que `kit:test-headless` en Vitest tarde lo mismo o más (el coste está en `bash` y `git` por sujeto, no en Pester). Mitigación: medir antes y después; no hay umbral en la spec.
7. **Coste estimado**: 4,5 h (ver «Estimación»), sin subagentes salvo los dos ejes de la revisión final (~2-4 $).
8. Review Focus: 4 entradas; ver la sección.

**Goal**: los 10 Pester de conducta pasan a Vitest caso a caso y salen de `tests/`, con el lanzador aparte en `kit:test-headless`.

**Architecture**: cada `.Tests.ps1` se porta a uno o varios `*.slow.test.ts` en `cli/test/kit/` (o `cli/test/kit/headless/`), que lanzan los mismos procesos con `spawnSync`/`spawn` y un `env` propio por llamada. Los helpers comunes viven junto a sus tests. `moon.yml` y `cli/moon.yml` separan la carpeta `headless/` para conservar el «solo cuando cambia» de la 0223.

**Tech Stack**: Vitest 5 y Node ≥ 22.18.0 sin dependencias nuevas (`node:child_process`, `node:fs`), moon 2.6.0; Git Bash para `tests/headless/*.sh`, `pwsh` para los dos `.ps1` que siguen hasta la 0228.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 5 tasks repiten el mismo patrón sin interfaces entre ellas salvo `resolveBash()` y el `env` limpio de la Task 1, un error lo caza el cotejo de nombres y el test de su propia task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo mueve tests de `tests/` a `cli/test/kit/` y cambia args e inputs de tareas moon existentes; ningún módulo de `cli/src/`, dependencia ni contrato nuevo.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo).
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`. Los comentarios de porqué del Pester que citan un ticket o un patch («ticket de la feature 0099 §1») se conservan solo si dicen el porqué sin la cita; la cita va en el nombre del `it`, que la conserva literal.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. Texto humano (nombres de test, mensajes) en castellano con tildes.
- Todo test que lanza procesos o crea repos git va en `*.slow.test.ts`; el único rápido es `cli/test/kit/subject-output-privacy.test.ts` (el control del commit).
- Ningún test muta `process.env`, salvo `cli/test/kit/git-env.slow.test.ts`, que repone lo que cambia en `afterEach`.
- Toda llamada directa a git en `cli/test/**/*.ts` pasa `env` en sus opciones.
- Temporales bajo `os.tmpdir()` (que `temp-setup.ts` pone en `.temp/vitest-*`), nunca en el `%TEMP%` del sistema; `RUNS_DIR` de las campañas, bajo `.temp/`.
- Cada `it` lleva el nombre literal de su `It` de Pester.

### De proceso

- Modelos: el implementador es la sesión (Native). Revisión final según `sdd-verify`. `fable` y `opus xhigh`, prohibidos.
- Commits: uno por task al quedar limpia, `test(kit): …` con título y cuerpo en castellano y `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Antes de commitear, `git diff --cached --name-only`.
- El pre-commit corre `cli:test` y `kit:test-fast`: un `.Tests.ps1` borrado en una task no rompe nada que no sea suyo.

## Review Focus

- Un caso con `-ForEach` de Pester (`DenyKillHook` 17 casos, `HeadlessLauncher` «aborta si la copia del kit lleva <Folder>/», «aborta con MAX_PARALLEL o SUBJECT_CAP…», `SubjectOutputPrivacy` «<Mode> salta una línea…») → cada fila del `-ForEach` es una fila de `it.each`, con el mismo nombre expandido · Tasks 1, 3 y 4, cotejo de nombres.
- `GIT_INDEX_FILE` heredado del pre-commit → el control del commit lee el índice del commit en curso, no el del worktree · Task 3, `toma como evidencia las salidas de sujetos y los RED y GREEN de tests/, y nada más` más la ejecución real del pre-commit en el commit de la task.
- Una salida con tildes (`user.name` con «Àngel», comillas latinas en `battery.sh`) → se lee en UTF-8 (`encoding: 'utf8'` en el `spawnSync`), sin depender de la página de códigos de la consola · Tasks 3 y 4, `extract.mjs falla con el user.name de la máquina aunque lleve tilde…` y `la petición llega intacta con comillas latinas y tildes`.
- El `bash` de `System32` delante en el `PATH` → `resolveBash()` devuelve Git Bash · Task 1, `resolveBash prefiere Git Bash al lanzador de WSL`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se porta lo que hay; los helpers nuevos son los del Pester traducidos, no abstracciones nuevas.
- [x] **YAGNI gate**: `resolveBash()` lo usan `HeadlessLauncher`, `Battery`, `SubjectOutputPrivacy` y `DenyKillHook` no; tres usos reales.
- [x] **Brownfield gate**: sigue el patrón de `cli/test/` (helpers por carpeta, `cleanEnv`, `*.slow.test.ts`); los dos tests de `merge/` solo ganan su `env`.
- [x] **Constitution check**: Art. X en «De código»; Art. III (nombres de test en castellano); Art. VI en los commits.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/test/kit/bash.ts` — `resolveBash(): string`.
- `cli/test/kit/process.ts` — `run(command: string, args: string[], options: { cwd?: string; env?: NodeJS.ProcessEnv; input?: string }): { output: string; code: number }`: `spawnSync` con `encoding: 'utf8'`, stdout y stderr juntos (como `2>&1` del Pester) y el `env` limpio de git por defecto (`cleanEnv` de `cli/test/ids/helpers.ts`).
- `cli/test/kit/git-env.slow.test.ts` — Clear-GitEnv (a) y (b).
- `cli/test/kit/deny-kill.slow.test.ts`, `hooks.slow.test.ts` (Hook), `upstream-watch.slow.test.ts`.
- `cli/test/kit/kit-session-source.slow.test.ts` — KitSessionSource y el caso de `Start-KitSession.ps1` de TempDir.
- `cli/test/kit/subject-output-privacy.test.ts` (rápido: el control del commit) y `subject-output-privacy.slow.test.ts` (el resto), con sus helpers en `privacy.ts`.
- `cli/test/kit/headless/campaign.ts` — `newCampaign`, `fakeClaude`, `runCampaign`, `subjects`, `maxConcurrent`, `setTools`.
- `cli/test/kit/headless/*.slow.test.ts` — 5-6 ficheros de `HeadlessLauncher` y `battery.slow.test.ts`.

**Modificar**:

- `cli/test/merge/histogram.slow.test.ts:30-31`, `cli/test/merge/sync.slow.test.ts:96` — `env: cleanEnv`.
- `cli/moon.yml` — `testInputs` y `--exclude` de `test-slow` y `test-min` (spec, decisión 13).
- `moon.yml` — `kit:test-headless` y el comentario de `kit:test` (decisión 12).
- `tests/Invoke-KitTests.ps1` — sin `-Headless` (decisión 14).
- `.docs/sdd/tech-stack.md` — líneas 6, 8, 38 y 42 (decisión 16).
- `.docs/sdd/roadmap.md` — fila 0228, solo si los helpers se quedan (decisión 15).

**Borrar**: los 10 `tests/*.Tests.ps1` de la decisión 1 de la spec, cada uno en la task de su port; `tests/Clear-GitEnv.ps1` y `tests/Resolve-Bash.ps1` según la decisión 15.

**NO se tocan**: `tests/headless/**`, `tests/upstream/check.ts` (lo que se prueba); `Start-KitSession.ps1`, `.claude/**`, `.githooks/**`, `kit:test` y `kit:test-fast` (0228); los Pester de la 0226 y `architecture.md` (0226).

### 1.6 Dependencias

La 0226, en paralelo: toca `cli/moon.yml` (`testInputs`, la misma línea) y `tech-stack.md` (líneas 6-8). El segundo cierre junta las dos listas en `sdd merge --sync`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Vitest más lento que Pester en el lanzador | media | medio | medir antes y después (decisión 17), partir el fichero |
| Un caso portado prueba menos | media | alto | cotejo de nombres y aserción literal; eje Código de la revisión final |
| `pnpm --dir cli exec vitest` desde la raíz no encuentra `vitest.config.ts` | baja | bajo | `--dir` cambia el cwd a `cli/`; se comprueba en la Task 4 |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Base: bash, git y los ports pequeños

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: Native, TDD del hilo: `git-env.slow.test.ts` (b) falla sobre `merge/histogram.slow.test.ts` y `merge/sync.slow.test.ts` antes de arreglarlos.
**Superficies**: tooling.
**Verificación**: `pnpm --dir cli exec vitest run test/kit test/merge/histogram test/merge/sync` → `Tests  N passed (N)`; `node <scratchpad>/compare-names.mjs Clear-GitEnv DenyKillHook Hook UpstreamWatch` → `faltan 0`.

**Interfaces**:
- Consume: `cleanEnv` de `cli/test/ids/helpers.ts`; `git`, `gitSync` de `cli/src/git/git.ts`.
- Produce: `resolveBash(): string` en `cli/test/kit/bash.ts`; `run(command, args, { cwd, env, input })` → `{ output, code }` en `cli/test/kit/process.ts`.

**Ficheros**: crear `cli/test/kit/{bash.ts,process.ts,git-env.slow.test.ts,deny-kill.slow.test.ts,hooks.slow.test.ts,upstream-watch.slow.test.ts}`; modificar `cli/test/merge/{histogram,sync}.slow.test.ts`, `cli/moon.yml` (`testInputs`); borrar `tests/{Clear-GitEnv,DenyKillHook,Hook,UpstreamWatch}.Tests.ps1`.

- [ ] **Step 1: Implementación**
  - `resolveBash()`: en `win32`, el primero que exista de `${ProgramFiles}\Git\bin\bash.exe` y `${ProgramFiles(x86)}\Git\bin\bash.exe`; si no, el `bash` del `PATH` cuya ruta no contenga `System32` (`where bash`); fuera de Windows, `'bash'`. Tests: `resolveBash prefiere Git Bash al lanzador de WSL` → `expect(resolveBash()).not.toMatch(/System32/i)` y `run(resolveBash(), ['-c', 'echo ok']).output.trim()` → `'ok'`.
  - `git-env.slow.test.ts`, describe `Clear-GitEnv.ps1` → `git() de cli/src/git no hereda las variables de git`: con `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` y `GIT_OBJECT_DIRECTORY` apuntando a un repo A en `process.env`, `gitSync(B, ['rev-parse', '--show-toplevel'])` → `[B]`, y `git(B, …)` igual; `afterEach` repone el snapshot. Los cinco `It` del helper `.ps1` (dot-source, borrar, reponer…) prueban el helper que se borra: su equivalente es este caso, y el cotejo los marca como «sustituidos», no como perdidos (se anota en `tasks.md`).
  - Describe `Los tests que llaman a git limpian las variables de git`: `findGitCallsWithoutEnv(source: string): number[]` (líneas) reconoce `(spawnSync|spawn|execFileSync|execFile)\(\s*'git'` y mira si sus opciones llevan `env`. `it.each(['spawnSync(\'git\', [\'init\'], { cwd })', 'execFileSync(\'git\', args, { cwd: dir })'])('señala un test con %s sin env')` → `toHaveLength(1)`; `acepta el mismo test con env` → `[]`; `no señala git dentro de un texto` (`"spawnSync('git'"` dentro de un string de otro test) → `[]`; `cada cli/test/**/*.ts que llama a git pasa un env` → offenders `[]`.
  - `deny-kill.slow.test.ts`: `it.each` con los 11 «deniega» y los 6 «deja pasar» literales del Pester; `run(process.execPath, [denyKill], { input: JSON.stringify({ tool_input: { command } }) }).output` contiene / no contiene `"deny"`.
  - `hooks.slow.test.ts`: los 5 casos; el modo `100755` con `git ls-files -s` sobre la raíz del kit.
  - `upstream-watch.slow.test.ts`: los 10 casos con `newRoot()`, `newSource(root, tags, url?)`, `newNotices(root, seen, repo?)` y `check(notices, upstream?)` → `{ output, code }`, pasando `SDD_UPSTREAM_DIR` en el `env` del hijo.
  - `cli/moon.yml`: `testInputs` gana `'/tests/**', '/hooks/**', '/.githooks/**', '/.claude/**', '/Start-KitSession.ps1'`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 2 — Hook de sesión del repo y Start-KitSession

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: Native; los casos se portan contra el script vigente, que ya los pasa: el RED es el cotejo de nombres antes de escribirlos.
**Superficies**: tooling.
**Verificación**: `pnpm --dir cli exec vitest run test/kit/kit-session-source` → `Tests  N passed (N)`; `node <scratchpad>/compare-names.mjs KitSessionSource TempDir FastSuiteBudget` → `faltan 3` (los retirados por las decisiones 9 y 10 de la spec, nombrados).

**Interfaces**:
- Consume: `run` de `cli/test/kit/process.ts`.
- Produce: nada.

**Ficheros**: crear `cli/test/kit/kit-session-source.slow.test.ts`; borrar `tests/{KitSessionSource,TempDir,FastSuiteBudget}.Tests.ps1`.

- [ ] **Step 1: Implementación**
  - `invokeKitSessionHook(sessionRoot: string | null, projectDir: string)` → `run('pwsh', ['-NoProfile', '-File', hookScript], { env: { ...cleanEnv, CLAUDE_PROJECT_DIR: projectDir, SDD_KIT_SESSION_ROOT?: sessionRoot } })`; sin `sessionRoot`, la variable no va en el `env`. Los 24 casos con sus aserciones literales (`systemMessage` con `hooks de git`, `git config core.hooksPath .githooks`, `skills/<nombre>/SKILL.md`…).
  - Caso de TempDir `lanza claude con CLAUDE_CODE_TMPDIR en .temp/ y restaura el valor anterior`: un `claude.ps1` falso en una carpeta temporal, delante en el `PATH` del hijo, que escribe `$env:CLAUDE_CODE_TMPDIR` en un fichero; `run('pwsh', ['-NoProfile', '-Command', "$env:CLAUDE_CODE_TMPDIR='antes'; & '<Start-KitSession.ps1>'; $env:CLAUDE_CODE_TMPDIR"])` → el fichero dice `<repo>/.temp` y la última línea de la salida es `antes`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Privacidad de las salidas de sujetos

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: Native; el cotejo de nombres, y el control del commit comprobado con un fichero de evidencia staged que lleva `C:\Users\alice\` (falla) antes de quitarlo.
**Superficies**: tooling.
**Verificación**: `pnpm --dir cli exec vitest run test/kit/subject-output-privacy` → `Tests  N passed (N)`; `node <scratchpad>/compare-names.mjs SubjectOutputPrivacy` → `faltan 0`; el commit de la task pasa el pre-commit con `cli:test` listando `subject-output-privacy.test.ts`.

**Interfaces**:
- Consume: `run`, `resolveBash` de la Task 1.
- Produce: nada.

**Ficheros**: crear `cli/test/kit/{privacy.ts,subject-output-privacy.test.ts,subject-output-privacy.slow.test.ts}`; borrar `tests/SubjectOutputPrivacy.Tests.ps1`.

- [ ] **Step 1: Implementación**
  - `privacy.ts`: `selectEvidencePath(paths: string[]): string[]` con la expresión literal `^\.docs/sdd/specs/[^/]+/[^/]+/|^tests/[^/]+-(red|green)\.md$`; `stagedEvidence(): string[]` con `git -c core.quotePath=false diff --cached --name-only --diff-filter=ACMR` y `env: process.env` (decisión 5 del plan); `USER_PATH_PATTERN` literal del Pester; `machineUserPattern()` desde la hoja de `USERPROFILE ?? HOME`; `findMachineLeak(files: { path: string; text: string }[]): string[]` con `user.name` y `user.email` de `git config` leídos con `cleanEnv`.
  - Rápido: los 2 casos de `La evidencia que lleva el commit no tiene el home de la máquina`.
  - Lento: los 19 restantes, con `extract.mjs` lanzado por `run(process.execPath, …)` y `USERPROFILE`/`HOME` de Alice en el `env`; la identidad fija por `GIT_CONFIG_GLOBAL`, `GIT_CONFIG_COUNT`, `GIT_CONFIG_KEY_0` y `GIT_CONFIG_VALUE_0` en el `env` del hijo.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit de la task**.

### Task 4 — Lanzador de sujetos y baterías

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: Native; el cotejo de nombres, y `moon run kit:test-headless` en rojo con la tarea apuntando a la carpeta vacía antes de portar.
**Superficies**: tooling.
**Verificación**: `moon run kit:test-headless` → `Tests  N passed (N)`, con N igual a los casos del Pester de `HeadlessLauncher` y `Battery` con sus filas de `-ForEach` expandidas (la cifra, la de la línea base); `node <scratchpad>/compare-names.mjs HeadlessLauncher Battery` → `faltan 0`.
**Verificación lenta**: `moon run kit:test-headless` · ~5-12 min (la línea base en Pester, medida antes de la Task 1, en `tasks.md`).

**Interfaces**:
- Consume: `run`, `resolveBash` de la Task 1.
- Produce: nada.

**Ficheros**: crear `cli/test/kit/headless/{campaign.ts,*.slow.test.ts,battery.slow.test.ts}`; modificar `moon.yml`, `cli/moon.yml`, `tests/Invoke-KitTests.ps1`; borrar `tests/{HeadlessLauncher,Battery}.Tests.ps1`.

- [ ] **Step 1: Implementación**
  - `campaign.ts`: `newCampaign(root: string, options?: { keepName?: string; init?: string; launch?: string }): Campaign` con `{ spec, runs, kit, out, dry }` y el `subject.sh` literal del Pester; `fakeClaude(name: string, before?: string): string` (carpeta con un `claude` que imprime `{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"hecho"}`); `runCampaign(campaign: Campaign, env: Record<string, string>, command?: string): { output: string; code: number }` con las variables por defecto del Pester (`USERPROFILE=C:\Users\alice`, `HOME=/c/Users/alice`, `NODE`, `DRY_RUN=1`, `SPEC_DIR`, `RUNS_DIR`, `KIT_DIR`, `SUBJECT_SH`, `SCENARIOS='a b c'`, `SUBJECT_CAP='10'`, `COST_CAP='10'`) en el `env` del hijo; `subjects(campaign)`, `maxConcurrent(campaign)`, `setTools(dir, label, text)`. `RUNS_DIR` bajo `.temp/` del repo.
  - Reparto de `HeadlessLauncher`: `run-dry` (líneas 86-150 del Pester), `settings` (159-283), `ports` (284-401 y 509-530), `identity-and-show` (402-508), `caps-and-locks` (531-692), `paths-and-cleanup` (693-825), `lib` (826-921). Si un fichero pasa de ~3 min, se parte más.
  - `battery.slow.test.ts`: los 10 casos, con la tabla literal.
  - `moon.yml` `kit:test-headless`: `args: [cli/bin/sdd.js, lock, run, --, pnpm, --dir, cli, exec, vitest, run, test/kit/headless, --test-timeout, '120000', --maxWorkers, '8']`; `inputs`: `/tests/headless/**`, `/tests/batteries/**`, `/cli/test/kit/headless/**`, `/cli/test/kit/bash.ts`, `/cli/test/kit/process.ts`; el comentario de `kit:test` dice «el conjunto rápido» en lugar de `FastSuiteBudget`.
  - `cli/moon.yml`: `test-slow` y `test-min` ganan `--exclude, '**/kit/headless/**'`.
  - `tests/Invoke-KitTests.ps1`: fuera `[switch]$Headless`, `$headlessTests` y su comentario; `$pester = @{ Path = $PSScriptRoot }`.
- [ ] **Step 2: Build** — `pnpm --dir cli exec tsc --noEmit`.
- [ ] **Step 3: Verificación** — y `moon run cli:test-slow` no lista `kit/headless`.
- [ ] **Step 4: Commit de la task**.

### Task 5 — Documentos y helpers

**Tras**: Tasks 1-4
**Modelo**: la sesión (Native).
**Tests RED**: ninguno: docs; el tope de `WordBudget` lo comprueba el pre-commit.
**Superficies**: docs.
**Verificación**: `moon run kit:test-fast` → exit 0; `git grep -n "Resolve-Bash.ps1\|Clear-GitEnv.ps1" -- tests` → vacío o solo Pester de la 0226 (decisión 15).

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `.docs/sdd/tech-stack.md`; quizá `.docs/sdd/roadmap.md`; quizá borrar `tests/{Clear-GitEnv,Resolve-Bash}.ps1`.

- [ ] **Step 1: Implementación**
  - `tech-stack.md:6`: `kit:test-headless` (los Vitest del lanzador de sujetos, `cli/test/kit/headless/`, fuera de `cli:test-slow` y `cli:test-min`); la frase de los Pester que quedan no se toca (es de la 0226).
  - `:8`: fuera «o con `-Tag 'Slow'` (Pester)» y la frase de `FastSuiteBudget`.
  - `:38`: «Un test que invoque bash usa `resolveBash()` (`cli/test/kit/bash.ts`), que prefiere Git Bash y descarta el de `System32`».
  - `:42`: «en los tests, el `env` limpio de cada llamada (`cleanEnv`), que exige `cli/test/kit/git-env.slow.test.ts`».
  - Decisión 15 de la spec: con el `git grep` vacío, borrar los dos `.ps1`; si no, la fila 0228 gana «borrar `tests/Clear-GitEnv.ps1` y `tests/Resolve-Bash.ps1`» antes de su «· Ficheros:».
- [ ] **Step 2: Build** — no aplica.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,9 h
- Estimación de implementación: 4,5 h (rango 3-6 h)
- Base de la estimación: 5 tasks, ~1.900 líneas Pester de patrón repetido; la Task 4 es la mitad (921 + 228 líneas, procesos con puertos y concurrencia). Incertidumbre: tiempos de Vitest con `bash` en Windows.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent y «Dónde se prueba»), con la medida de `kit:test-headless` antes y después
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Cada caso portado con su `it` → Tasks 1-4, cotejo de nombres (`faltan 0`, salvo los 3 retirados). ✓
- El lanzador corre solo cuando cambia → Task 4, inputs de `kit:test-headless`; en la validación, `--affected` en la rama y en un worktree desechable con un cambio solo en `skills/`. ✓
- `cli:test-slow` y `cli:test-min` no corren el lanzador → Task 4, Step 3. ✓
- El control de privacidad sigue en el commit y no sale de la caché → Task 3 (fichero rápido) y Task 1 (`/tests/**` en `testInputs`); en la validación, `moon run cli:test` tras tocar solo un `tests/*.md`. ✓
- La regla de git → Task 1, `señala un test con … sin env` y `cada cli/test/**/*.ts que llama a git pasa un env`. ✓
- La medida → Task 4, «Verificación lenta», y `tasks.md`. ✓
- Filas de «Lo que se retira o cambia de forma» → Tasks 4 (`moon.yml`, `Invoke-KitTests.ps1`) y 5 (`tech-stack.md`, helpers). ✓
- Review Focus → Tasks 1, 3 y 4, con los tests nombrados. ✓
