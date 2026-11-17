---
id: 20261028-124244-feature-0216-node-subject-launcher
feature: 0216
title: Plan de implementación — El orquestador de sujetos pasa a Node
spec: ./spec.md
status: draft
created: 2026-10-28
---

# Plan de implementación — El orquestador de sujetos pasa a Node

## Decisiones que he tomado yo — valida estas

1. Modelo por task: la sesión (Native), sin despachos por task. — El plan fija firmas, textos y tests, y en Native implementa la sesión.
2. Ejecución: native (ver la línea `Ejecución`).
3. Cuatro tasks: núcleo de la campaña, entrada `run.mjs` con su extremo a extremo, limpieza de procesos, y batería con sus documentos. — Cada una tiene su ciclo de test y la puede rechazar un revisor sin tocar la vecina.
4. El sistema de ficheros inyectado es una interfaz mínima (`CampaignFs`), con una implementación en memoria solo para los tests (`cli/test/kit/headless/memory-fs.ts`). — Sin dependencias nuevas (memfs no está en el repo).
5. La lista de procesos real sale de `pwsh -NoProfile -Command "Get-CimInstance Win32_Process | Select-Object ProcessId,CommandLine | ConvertTo-Json -Compress"`. La carpeta del sujeto se compara sin distinguir mayúsculas y con `/` en lugar de `\`, porque `claude -p` la recibe de `cygpath -m` (`D:/…`).
6. La carrera (a) se cubre con `withLock`. Si `cli/test/lock/` no tiene un caso de dueño a medio escribir (fichero vacío) que espera sin romperlo, la Task 1 lo añade ahí.
7. Riesgo alto: los textos de salida tienen que ser idénticos a los de `run.sh`, porque los leen los tests lentos que se quedan y quien lanza. Están copiados literales en la Task 1.
8. Coste estimado: ~4 h de implementación, sin despachos salvo la revisión final (dos o tres ejes, ~250-400k tokens).
- Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: `run.sh` y `battery.sh` pasan a Node, con la lógica en un módulo probado en proceso y el contrato con `subject.sh` intacto.

**Architecture**: `tests/headless/campaign.mjs` exporta funciones puras sobre unas dependencias inyectadas (`CampaignDeps`). `run.mjs` y `battery.mjs run` construyen las dependencias reales (`node:fs`, `Date.now`, `setTimeout`, `process.kill(pid, 0)`, `child_process.spawn`, `pwsh`, `taskkill`, `withLock`) y llaman a `runCampaign`. Los tests llaman a lo mismo con dependencias falsas.

**Tech Stack**: Node ≥ 22.18 (ESM, `.mjs`, importa `.ts` de `cli/src` sin compilar), Vitest en `cli/test/kit/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks se encadenan por la interfaz de `campaign.mjs`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — herramienta de test del repo, sin módulo de producto, dependencia nueva ni contrato con la CLI; `campaign.mjs` solo importa `withLock` de `cli/src/git/lock.ts`.

## Restricciones globales

### De código

- Node ≥ 22.18, ESM; sin dependencias nuevas.
- Los textos de salida son los de `run.sh`, literales (Task 1), y los nuevos, los de la spec: `la copia del kit no lleva cli/: sácala con git archive <commit> skills .claude-plugin agents cli hooks`, `[<etiqueta>] paro <N> procesos de <carpeta>`, `· el kit no cargó en <etiqueta>`.
- Ningún test de `campaign.test.ts` ni de `battery.test.ts` lanza bash, `pwsh` ni procesos, ni usa temporizadores reales.
- Art. X: sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). Sin comentarios que citen documentos: un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
- Los comentarios de «por qué» de `run.sh` que siguen aplicando (fuente de cada regla: tickets, tasks) se conservan en `campaign.mjs` junto al código que explican, sin la cita al documento.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia (`commit-milestones.md`).
- El hook de comandos bloquea `*` suelto y tokens `/palabra`: mensajes de commit con `git commit -F <fichero del scratchpad>`.

## Review Focus

- Un `RUNS_DIR` con barras invertidas y la carpeta del sujeto en la línea de órdenes con `/` y otra capitalización → el barrido la reconoce · Task 3, `matches the subject folder whatever the slashes and case`.
- Un sujeto que acaba sin `tools.txt` mientras el orquestador sigue vivo → no es un cortado de otra tanda, y el barrido de arranque no lo toca · Task 3, `start sweep skips marks whose pid is alive`.
- `battery.mjs run` con `KIT_DIR` relativo y el cwd en otra carpeta → el sujeto recibe la ruta absoluta respecto al cwd de quien lanza · Task 4, `passes the kit as an absolute path`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un módulo y dos entradas finas; sin capa de abstracción para un solo uso.
- [x] **YAGNI gate**: sin Linux ni macOS, sin opción nueva; `CampaignFs` solo con los métodos que usa la campaña.
- [x] **Brownfield gate**: el contrato con `subject.sh` y los textos no cambian; los tests lentos que quedan solo cambian `campaign.ts`.
- [x] **Constitution check**: Art. I (sin texto de skill, sin RED), Art. X (restricciones arriba), Art. XI (lo aprendido va a `tech-stack.md`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/headless/campaign.mjs` — configuración desde el entorno, recuento, techos, cerrojo, lanzamiento, informe y limpieza, sobre `CampaignDeps`.
- `tests/headless/run.mjs` — entrada de `node tests/headless/run.mjs`: cabecera de uso, dependencias reales, señales.
- `tests/headless/real-deps.mjs` — `realDeps(io)`: las dependencias reales, compartidas por `run.mjs` y `battery.mjs run`.
- `cli/test/kit/headless/memory-fs.ts` — `memoryFs()`: `CampaignFs` en memoria para los tests.
- `cli/test/kit/headless/campaign.test.ts`, `cli/test/kit/headless/battery.test.ts` — tests en proceso.
- `cli/test/kit/headless/run.test.ts` — el único extremo a extremo.

**Modificar**:

- `tests/headless/battery.mjs` — comando `run`; `verdict` con «el kit no cargó».
- `tests/headless/lib.sh` — `other_subject_ports` comprueba el PID con `node`; mensaje de la guarda de `subject_init`.
- `cli/test/kit/headless/campaign.ts` — `runCampaign` lanza `node run.mjs`; fuera `runSh`.
- `.docs/sdd/tech-stack.md`, 13 `tests/batteries/*/battery.md`, 13 `tests/batteries/*/subject.sh` (cabecera) — comando nuevo.

**Borrar**: `tests/headless/run.sh`, `tests/headless/battery.sh`, `cli/test/kit/headless/caps-and-locks.slow.test.ts`, `run-dry.slow.test.ts`, `battery.slow.test.ts`.

**NO se tocan**:

- El resto de `lib.sh`, `extract.mjs`, `deny-kill.mjs`, los `subject.sh` salvo su cabecera — 0238.
- `moon.yml` — `kit:test-headless` ya corre `test/kit/headless` entero.
- La evidencia de `tests/*.md` y `.docs/sdd/specs/` que cita `run.sh` — artefactos de evento.

### 1.6 Dependencias

`withLock` de `cli/src/git/lock.ts` (ya en el repo). `pwsh` y `taskkill` de Windows.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un texto de salida cambia y rompe un test lento o a quien lanza | media | medio | Textos literales en la Task 1; los tests lentos que quedan corren en la Task 2 |
| `withLock` (500 ms de sondeo) alarga una tanda | baja | bajo | Se sostiene solo mientras se cuenta y se lanza |
| `pwsh` tarda ~1 s por consulta de procesos | media | bajo | Una consulta por sujeto que acaba, no por proceso |

### 1.8 Rollout

Directo: las campañas abiertas en otros worktrees siguen con su `run.sh` hasta integrar `develop`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Núcleo de la campaña en proceso

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/headless/campaign.test.ts`, `cli/test/kit/headless/memory-fs.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/campaign.test.ts` → `Tests  N passed (N)`; si añade el caso de la decisión 6, también `pnpm --dir cli exec vitest run test/lock` → `passed`.

**Interfaces**:
- Consume: `withLock(lock, timeoutMinutes, body)` de `cli/src/git/lock.ts` (solo en las dependencias reales, Task 2).
- Produce, en `tests/headless/campaign.mjs`:
  - `readConfig(env, cwd) → CampaignConfig`, que lanza `CampaignError` con el mensaje. `CampaignConfig = { specDir, phase, subjectSh, kitDir, runsDir, scenarios: string[], subject, subjectCap, costCap, subjectCost, maxParallel, dryRun, repoRoot, root, out, live, otherLive, lockPath, subjectEnv }`.
  - `runCampaign(config, deps) → Promise<number>`: el código de salida; las líneas van por `deps.log`.
  - `CampaignDeps = { fs: CampaignFs, wait(ms): Promise<void>, isAlive(pid): boolean, lock(path, body): Promise<T>, launch(request): { pid, exited: Promise<number> }, cleanup(label, folder): Promise<void>, log(line) }`, con `request = { subjectSh, args: [kit, label, scenario, out], env }`.
  - `CampaignFs = { exists(path), read(path), write(path, text), remove(path), list(dir) → string[], mkdir(dir) }`.

**Ficheros**: crear `tests/headless/campaign.mjs`, `cli/test/kit/headless/memory-fs.ts`, `cli/test/kit/headless/campaign.test.ts`.

- [ ] **Step 1: Tests RED** en `campaign.test.ts`, con `memoryFs()`, `wait` que avanza un reloj falso y `launch` que devuelve una promesa que el test resuelve:
  - `readConfig`: falta `SPEC_DIR` → `define SPEC_DIR`; `MAX_PARALLEL=0` → `MAX_PARALLEL tiene que ser un entero positivo: 0`; `RUNS_DIR` fuera → `RUNS_DIR fuera del scratchpad o de .temp/: <runs>`; `KIT_DIR` sin `cli/bin/sdd.js` → `la copia del kit no lleva cli/: sácala con git archive <commit> skills .claude-plugin agents cli hooks`; `KIT_DIR=kit` con cwd `C:\r` → `kitDir === 'C:\\r\\kit'`; `SUBJECT_COST` por omisión `COST_CAP / SUBJECT_CAP`.
  - `does not exceed SUBJECT_CAP` (finished + running + cut + 1 > cap → `techo de 2 sujetos alcanzado: decide el dev-lead`).
  - `cost cap counts every phase and the launched at SUBJECT_COST` → `techo de 1 $ alcanzado (0.60 $ gastados, 0 en curso a 0.50 $)`; igualar el tope lanza.
  - `waits for a slot counting marks of another run.mjs` → `esperando hueco: 2 sujetos en curso (MAX_PARALLEL=2)` una sola vez, lanza al morir una marca.
  - `checks the label inside the lock after waiting` → dos `runCampaign` concurrentes con la misma etiqueta y un `lock` falso que serializa: un solo `launch`, el otro imprime `ya existe a-1: sube SUBJECT`.
  - `a cut subject counts as subject and SUBJECT_COST`; `a real cut does not count in a dry run, nor the reverse`.
  - `stops on RUNS_DIR/stop` → `parada a petición`.
  - `writes the mark with the launched pid before releasing the lock and removes it when the subject ends`.
  - Informe: `red: 2 sujetos · 1.10 $`, `green: 1 sujetos · 0.00 $ · 1 sin RESULTADO`, `cortados sin salida: 1 (contados a 0.50 $ cada uno)`, `en seco: salidas en <out>`, `sujetos de la campaña: 3 · coste acumulado: 1.60 $`.
- [ ] **Step 2: Implementación** de `campaign.mjs`. Reglas y textos de `run.sh`, literales:
  - Raíz: `DRY_RUN=1` → `<RUNS_DIR>/dry`; si no, `SPEC_DIR`. `out = <root>/<fase>/out`. Marcas en `<RUNS_DIR>/live/<fase>.<etiqueta>`, y en seco en `<RUNS_DIR>/dry/live`. En curso cuentan las marcas de los dos modos; cortadas, solo las propias. Un PID vacío está en curso. `tools.txt` se mira antes y después del PID.
  - `RUNS_DIR` permitido: contiene `scratchpad` o cuelga de `<repo>/.temp/`, comparado con `/` y sin distinguir mayúsculas.
  - Coste: el último `=== RESULTADO (<n> turnos, <x> $` de cada `tools.txt`; formato `%.2f`.
  - Bucle por escenario: stop → etiqueta `<sc>-<SUBJECT>` → `lock(lockPath, …)` con, dentro y en este orden: esperar hueco (`wait(1000)`), stop o techos (salir), etiqueta tomada (seguir con la siguiente), lanzar y escribir la marca. Al final, esperar a todos los `exited` y llamar a `cleanup(label, join(runsDir, phase, label))` al acabar cada uno.
  - Cabecera de uso al principio del fichero: la de `run.sh` con `node tests/headless/run.mjs`, y «El RED de un patch se lanza con SPEC_DIR en .temp/<id>/ del repo hasta que reproduce».
- [ ] **Step 3: Caso de `withLock`** (decisión 6): si `cli/test/lock/` no prueba que un fichero de cerrojo vacío hace esperar en lugar de romperlo, añadir `waits for an owner still writing the lock` allí.
- [ ] **Step 4: Verificación** — los comandos de arriba, en verde.
- [ ] **Step 5: Commit** — `feat(headless): núcleo de la campaña en Node con sus tests en proceso`.

### Task 2 — `run.mjs`, las dependencias reales y el extremo a extremo

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/headless/run.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/run.test.ts` → `Tests  N passed (N)`.
**Verificación lenta**: `moon run kit:test-headless` (los tests lentos de `lib.sh` que quedan, ~4 min sin carga) → `passed`, sin `failed`.

**Interfaces**:
- Consume: `readConfig`, `runCampaign`, `CampaignDeps` (Task 1).
- Produce: `tests/headless/real-deps.mjs` → `realDeps({ log, err }) → CampaignDeps`, sin `cleanup` todavía (no-op hasta la Task 3); `node tests/headless/run.mjs`, que sale con el código de `runCampaign`, o con 1 y el mensaje en stderr ante un `CampaignError`.

**Ficheros**: crear `tests/headless/run.mjs`, `tests/headless/real-deps.mjs`, `cli/test/kit/headless/run.test.ts`; modificar `cli/test/kit/headless/campaign.ts`, `tests/headless/lib.sh`; borrar `tests/headless/run.sh`, `caps-and-locks.slow.test.ts`, `run-dry.slow.test.ts`.

- [ ] **Step 1: Test RED** `run.test.ts`, `launches, counts and reports with a node subject`: `SUBJECT_SH` es un `subject.mjs` falso que escribe `<out>/<label>.tools.txt` con `=== RESULTADO (1 turnos, 0.50 $)`; `SCENARIOS="a b"`, `MAX_PARALLEL=1`, `DRY_RUN=1`; `spawnSync(process.execPath, [run.mjs])`. Asserts: código 0, salida con `sujetos de la campaña: 2 · coste acumulado: 1.00 $`, `dry/live` sin marcas.
- [ ] **Step 2: Implementación**:
  - `launch` con `spawn(command, [subjectSh, ...args], { env: { ...process.env, ...request.env }, stdio: 'inherit', windowsHide: true })`. `.mjs` → `process.execPath`; `.sh` → Git Bash: `%ProgramFiles%\Git\bin\bash.exe` o el `bash` del `PATH` fuera de `System32`, con el comentario `shortcut: los subject.sh siguen en bash, se va cuando pasen a Node`.
  - `lock` con `withLock({ path, label: 'lanzamiento de sujetos', io, owner: { branch: '', worktree: runsDir } }, 120, body)`.
  - `isAlive` con `process.kill(pid, 0)` (`EPERM` cuenta como vivo); `wait` con `setTimeout`.
- [ ] **Step 3: `campaign.ts`**: `runCampaign` hace `spawnSync(process.execPath, [runMjs], …)` a fichero, como `runBash`; `runSh` desaparece y `runMjs = join(headless, 'run.mjs')`; `options.command` con bash solo para los tests que la usan.
- [ ] **Step 4: `lib.sh`**: en `other_subject_ports`, `kill -0 "$pid"` pasa a `"$NODE" -e 'process.kill(Number(process.argv[1]), 0)' "$pid" 2>/dev/null`; en `subject_init`, el mensaje de la guarda pasa a `la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin agents cli hooks`.
- [ ] **Step 5: Verificación** — rápida y lenta.
- [ ] **Step 6: Commit** — `feat(headless): run.mjs sustituye a run.sh`.

### Task 3 — Limpieza de los procesos del sujeto

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `campaign.test.ts` (bloque `cleanup`), `run.test.ts` (un caso)
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/campaign.test.ts test/kit/headless/run.test.ts` → `passed`.

**Interfaces**:
- Consume: `CampaignDeps` (Task 1), `realDeps` (Task 2).
- Produce, en `campaign.mjs`:
  - `subjectProcesses(processes, folder) → number[]`, con `processes: { pid, commandLine }[]`.
  - `stopSubjectProcesses(label, folder, deps) → Promise<void>`, que avisa con `[<label>] paro <N> procesos de <carpeta>` si N > 0.
  - `sweepCut(config, deps) → Promise<void>`, con `deps.processes(): Promise<ProcessInfo[]>` y `deps.kill(pid, tree: boolean)` como dependencias nuevas.
  - En `run.mjs`, los manejadores de `SIGINT`, `SIGTERM` y `SIGBREAK`.

**Ficheros**: modificar `tests/headless/campaign.mjs`, `tests/headless/real-deps.mjs`, `tests/headless/run.mjs`, los dos tests.

- [ ] **Step 1: Tests RED**:
  - `matches the subject folder whatever the slashes and case`: `D:\r\.temp\runs\red\a-1` frente a `claude.exe -p --add-dir d:/R/.temp/runs/red/a-1` → coincide; frente a `…/red/a-10` → no coincide (la carpeta va seguida de separador, comilla, espacio o fin).
  - `stops the subject processes when it ends and says how many`: `[a-1] paro 2 procesos de <carpeta>`.
  - `start sweep stops the processes of cut subjects` (marca con PID muerto y sin `tools.txt`) y `start sweep skips marks whose pid is alive`.
  - En `run.test.ts`, `leaves no process of the subject behind`: el `subject.mjs` falso lanza `spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000)', <su carpeta>], { detached: true, stdio: 'ignore' }).unref()` y acaba; tras `run.mjs`, la consulta real de procesos no da ninguno con esa carpeta.
- [ ] **Step 2: Implementación**: `processes` real con la consulta `pwsh` de la decisión 5 (un objeto suelto o un array); `kill(pid, true)` con `taskkill /T /F /PID <pid>`, que ignora «no existe». `runCampaign` llama a `sweepCut` antes del bucle, y `cleanup` es `stopSubjectProcesses`. Las señales matan el árbol de cada sujeto vivo, barren sus carpetas y salen con 130. Comentario: `shortcut: un proceso con nohup cuya línea no nombra la carpeta del sujeto no se para; amplíalo si vuelve a quedar uno vivo`.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit** — `feat(headless): el orquestador para los procesos del sujeto al acabar o al cortar`.

### Task 4 — `battery.mjs run`, veredicto «el kit no cargó» y documentos

**Tras**: Task 3
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/headless/battery.test.ts`
**Superficies**: tooling, docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless` → `passed` (la carpeta entera, la que corre `kit:test-headless`); `node cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`.

**Interfaces**:
- Consume: `readConfig`, `runCampaign`, `realDeps`.
- Produce, en `battery.mjs`:
  - `planRows(rows, steps)`, `savedLabel(plan, out, fs)` y `runBattery(env, cwd, deps) → Promise<number>`.
  - `judge(row, outDir, fs)` con «el kit no cargó».
  - El comando `node tests/headless/battery.mjs run`; `plan`, `field` y `verdict` no cambian de uso.

**Ficheros**: modificar `tests/headless/battery.mjs`; crear `cli/test/kit/headless/battery.test.ts`; borrar `tests/headless/battery.sh`, `battery.slow.test.ts`; modificar `.docs/sdd/tech-stack.md`, 13 `battery.md` y 13 cabeceras de `subject.sh`.

- [ ] **Step 1: Tests RED** en `battery.test.ts`, en proceso con `memoryFs()` y un `launch` falso:
  - `launches only the requested steps` (`STEPS="2"`).
  - `refuses a saved label` → `ya existe e1-1 en <out>: borra esa carpeta o cambia PHASE` y código 1.
  - `launches each index per model` (SUBJECT 1 y 2 y modelos distintos llegan a `request.env.MODEL`).
  - `passes the kit as an absolute path`.
  - `verdict marks a run whose first Skill call is unknown`: `tools.txt` con `>>> Skill: sdd-kit:sdd-explore` y la línea siguiente `<<< <tool_use_error>Unknown skill: sdd-kit:sdd-explore</tool_use_error>` → `e1 · 1/2 · umbral 2/2 · rojo · el kit no cargó en e1-2`.
- [ ] **Step 2: Implementación**: `run` repite `battery.sh`: plan, etiqueta ya guardada, índices de 1 al `n` máximo y, por índice, cada modelo con sus escenarios (`n >= índice`), con `runCampaign` en proceso y `SUBJECT_SH=<dir>/subject.sh`. Después, el veredicto, que sale con 1 si hay algún rojo. En `judge`, una ejecución cuya primera `>>> Skill:` va seguida de un `<<< ` con `Unknown skill` no pasa y se nombra.
- [ ] **Step 3: Documentos**:
  - `tech-stack.md`: líneas de método (lanzador de referencia, techo de coste, parada con `RUNS_DIR/stop`, `SPEC_DIR` absoluto, línea de `/sdd-kit:<skill>`, «Baterías por skill») con `node tests/headless/run.mjs` y `battery.mjs run`; la guarda con `cli hooks`; fuera la mención a `tests/HeadlessLauncher.Tests.ps1`.
  - En los 13 `battery.md`: `` `tests/headless/battery.sh` `` → `` `node tests/headless/battery.mjs run` `` y `` `battery.sh` da `` → `` `battery.mjs run` da ``.
  - En los 13 `subject.sh`: `Lo lanza tests/headless/battery.sh` → `Lo lanza tests/headless/battery.mjs run`.
  - Al final, `git grep -n -E "battery\.sh|headless/run\.sh" -- tests/batteries tests/headless cli .docs/sdd/tech-stack.md` sin salida.
- [ ] **Step 4: Verificación**.
- [ ] **Step 5: Commit** — `feat(headless): battery.mjs run sustituye a battery.sh y da rojo si el kit no cargó`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 4 h (3-5)
- Base de la estimación: 4 tasks de tooling con TDD, ~600 líneas de código y tests nuevos y ~30 ficheros de una línea; incertidumbre en la consulta de procesos y en los tests lentos que quedan
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop` (de `tech-stack.md` §Testing).
- [ ] Medir `kit:test-headless` antes (en `develop`) y después, para el walkthrough.
- [ ] Spec satisfecha: cada decisión tiene su task (§4).
- [ ] Cierre de rama con `sdd-archive`; al fusionar, `sdd merge --push`.

---

## 4. Self-review (cobertura spec → tasks)

- Decisión 1, comandos y textos iguales → Task 1 (tests de informe y avisos), Task 2 `launches, counts and reports with a node subject`, tests lentos que quedan. ✓
- Decisión 2, lógica inyectada → Task 1. ✓
- Decisión 3, `.mjs` con node y `.sh` con Git Bash → Task 2 (extremo a extremo con `.mjs`; tests lentos con `.sh`). ✓
- Decisión 4, `KIT_DIR` absoluto → Task 1 `readConfig`, Task 4 `passes the kit as an absolute path`. ✓
- Decisión 5, guarda de `cli/` → Task 1 `readConfig`; mensaje de `lib.sh`, Task 2 Step 4. ✓
- Decisión 6, «el kit no cargó» → Task 4 `verdict marks a run whose first Skill call is unknown`. ✓
- Decisiones 7 y 8, cerrojo y etiqueta dentro → Task 1 `checks the label inside the lock after waiting`, Step 3 (`withLock`). ✓
- Decisión 9, marcas con PID de Windows → Task 1 `writes the mark with the launched pid…`; `lib.sh`, Task 2 Step 4, cubierto por `ports.slow.test.ts`. ✓
- Decisión 10, limpieza al acabar, con señal y al arrancar → Task 3. La rama de señales no tiene test automático: se comprueba a mano en la Task 3 (Ctrl-C sobre un `run.mjs` con un sujeto colgado) y se dice en el walkthrough. ⚠
- Decisión 11, cabecera con `.temp/<id>/` → Task 1 Step 2. ✓
- Decisiones 12 y 13, tests que se van y se quedan → Tasks 2 y 4; verificación lenta de la Task 2. ✓
- Decisión 14, `moon.yml` sin cambios → §1.1 «NO se tocan». ✓
- Decisión 15, documentos → Task 4 Step 3, con su grep. ✓
- Review Focus → Task 3 (dos tests) y Task 4 (uno). ✓
