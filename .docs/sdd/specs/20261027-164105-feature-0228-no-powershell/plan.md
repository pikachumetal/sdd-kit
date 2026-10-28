---
id: 20261027-164105-feature-0228-no-powershell
feature: 0228
title: Plan de implementación — Sin PowerShell en el repo y un turno del cerrojo por gate
spec: ./spec.md
status: approved
created: 2026-10-27
---

# Plan de implementación — Sin PowerShell en el repo y un turno del cerrojo por gate

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las cuatro tasks; la revisión final con Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`, Arquitectura no (ver «Eje Arquitectura»).
2. Ejecución: native — ver la línea `Ejecución`.
3. `start-kit-session.mjs` lanza `claude` con `runInherited` de `cli/src/tasks/command.ts` (la CLI ya resuelve el `PATH` y los `.cmd` de Windows): `claude.exe` se lanza directo, y el `claude.cmd` falso del test pasa por `cmd.exe`, así que no hace falta una variable para sustituir `claude`. Las variables del hijo se ponen en `process.env` del propio script, que muere al acabar: la terminal no las ve.
4. El turno anidado vive en `cli/src/lock/verbs.ts` y lee al dueño con una función nueva exportada de `cli/src/git/lock.ts` (`lockHolderPid`); la cola es una opción `queue` de `Lock`, que solo pasa `sdd lock run`: `withLock` sin `queue` no cambia (ids y merge).
5. El gate de cierre de §3 es el nuevo (lo escribe la Task 4 en `tech-stack.md`): el vigente nombra `kit:test`, que esta feature borra.
6. Riesgo alto: que moon no pase al hijo el entorno del `sdd lock run` que lo envuelve — sin eso el turno anidado no funciona. La Task 1 lo mide con un `moon run` real antes de cerrar.
7. Coste: ~4 h de implementación en la sesión; revisión final ~2 subagentes (~200k tokens).
8. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el repo corre sin PowerShell (arranque, hook, moon, pre-commit, tests de `cli/test/kit/`) y el gate de cierre coge el cerrojo de suites una sola vez, con cola por orden de llegada.

**Architecture**: `sdd lock run` exporta su PID al hijo y reconoce a un padre que ya tiene el cerrojo; las esperas se apuntan en una carpeta de cola junto al cerrojo y solo la primera viva lo coge. El arranque y el hook pasan a módulos de Node sin dependencias, y moon y el pre-commit pierden las tareas de Pester.

**Tech Stack**: Node 22.18+ (TypeScript sin compilar en `cli/`, `.mjs` en la raíz), Vitest, moon 2.6, Git Bash para el pre-commit.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 4 tasks casi independientes (solo la 4 usa el gate de la 1), un error lo caza el test de su task o el gate de cierre y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — ni módulo nuevo en la CLI ni dependencia ni contrato entre módulos: la cola es una opción del `withLock` existente y los dos `.mjs` son herramientas del repo.

## Restricciones globales

### De código

- Node ≥ 22.18.0 sin dependencias nuevas; los `.mjs` de la raíz y de `.claude/hooks/` solo usan `node:*` y, el arranque, `cli/src/tasks/command.ts`.
- Textos para personas en castellano con tildes; código en inglés.
- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); funciones ~20 líneas y ≤ 3 parámetros, early returns, sin duplicación.
- Para parar procesos, por PID o por puerto, nunca por nombre.
- Todo test que lance procesos, cree repos git o espere va en `*.slow.test.ts`.

### De proceso

- Native: la sesión implementa con TDD (`sdd-tdd`); cada task se cierra con `sdd task done`.
- Commits con tipo/scope en inglés y título y cuerpo en castellano, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Antes de commitear, `git diff --cached --name-only`.

## Review Focus

- Un `sdd lock run` que muere con su entrada en la cola y el cerrojo libre → el siguiente no se queda esperando: borra la entrada huérfana y lo coge · Task 1, `drops the queue entry of a dead waiter`
- Dos esperas que llegan en el mismo milisegundo → el orden lo deshace el PID, sin que las dos se crean primeras · Task 1, `orders two waiters by arrival and lets the first one in`
- `CLAUDE_CODE_TMPDIR` vacía (`""`) en el entorno → cuenta como ausente y se fija a `<raíz>/.temp` · Task 2, `sets CLAUDE_CODE_TMPDIR when it is empty`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: la cola es una carpeta de ficheros junto al cerrojo, como el cerrojo mismo; el turno anidado, una variable de entorno.
- [x] **YAGNI gate**: la cola solo la activa `sdd lock run`; ids y merge no la piden.
- [x] **Brownfield gate**: `withLock` sin `queue` conserva su conducta y sus textos; los tests de ids y merge no cambian.
- [x] **Constitution check**: Art. I (RED antes del código, por TDD de la CLI), Art. X (código), Art. XI (lo aprendido a `tech-stack.md`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `start-kit-session.mjs` — arranque de sesión del repo.
- `.claude/hooks/kit-session-source.mjs` — aviso de `SessionStart`.

**Modificar**:

- `cli/src/git/lock.ts` — opción `queue`, texto de la espera con puesto, `lockHolderPid`.
- `cli/src/lock/verbs.ts` — turno anidado, `SDD_SUITE_LOCK_OWNER`, 180 min.
- `cli/test/lock/run.slow.test.ts` — escenarios del turno y la cola.
- `cli/test/kit/kit-session-source.slow.test.ts` — hook y arranque en Node.
- `cli/test/kit/headless/campaign.ts` — `stopPort` sin `pwsh`.
- `.claude/settings.json`, `moon.yml`, `.githooks/pre-commit`.
- `CLAUDE.md`, `README.md`, `.docs/sdd/tech-stack.md`, `.docs/sdd/architecture.md`.

**Borrar**: `Start-KitSession.ps1`, `.claude/hooks/Test-KitSessionSource.ps1`, `tests/Invoke-KitTests.ps1`.

**NO se tocan**: `tests/headless/lib.sh`, `cli/test/merge/failures.slow.test.ts`, `cli/src/merge/verify.ts`, `skills/sdd-start-feature/references/nombrado.md` (decisión 11 de la spec); `cli/src/ids/next.ts`, `cli/src/merge/*.ts` (no piden cola).

### 1.6 Dependencias

- La 0226 y la 0227, ya en `develop`: no queda ningún `tests/*.Tests.ps1`.
- `Select-Claude.ps1` (fuera del repo): lo cambia la sesión `powershell-be` cuando la 0228 esté en `develop`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| moon no hereda `SDD_SUITE_LOCK_OWNER` al hijo | baja | alto | Task 1, paso de medida con `moon run` real |
| La TUI pierde el modo raw o Ctrl+C con `stdio: 'inherit'` | baja | alto | Task 2, prueba a mano en Orca antes de borrar el `.ps1` |
| `netstat` sin la columna PID o con otro formato | baja | medio | Task 3, los tests de headless que usan `stopPort` |

### 1.8 Rollout

Directo, al fusionar en `develop`. Después, aviso a `powershell-be` para `Select-Claude.ps1`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Un turno del cerrojo por gate, con cola

**Tras**: —
**Modelo**: sesión (Native)
**Tests RED**: TDD del propio hilo · `cli/test/lock/run.slow.test.ts`
**Superficies**: tooling (CLI)
**Verificación**: `pnpm --dir cli exec vitest run test/lock test/ids/reserve.slow.test.ts test/merge/lock-and-base.slow.test.ts --test-timeout 120000` → `Tests  N passed (N)`

**Interfaces**:
- Consume: nada.
- Produce: `sdd lock run` exporta `SDD_SUITE_LOCK_OWNER=<pid>` al hijo; `export function lockHolderPid(path: string): number | null` en `cli/src/git/lock.ts`; `Lock.queue?: string` (ruta de la carpeta de cola).

**Ficheros**: modificar `cli/src/git/lock.ts`, `cli/src/lock/verbs.ts`, `cli/test/lock/run.slow.test.ts`.

- [ ] **Step 1: Implementación**
  - `cli/src/lock/verbs.ts`: `SUITE_LOCK_TIMEOUT_MINUTES = 180`; `lock.queue = resolve(commonDir, 'sdd-tests.queue')`. Antes de `withLock`: si `process.env.SDD_SUITE_LOCK_OWNER` es un entero y `lockHolderPid(lock.path)` devuelve ese mismo número, `return runInherited(command, cwd)` sin cerrojo. Si no, dentro del cuerpo de `withLock`, `process.env.SDD_SUITE_LOCK_OWNER = String(process.pid)` antes de `runInherited`.
  - `cli/src/git/lock.ts`, con `lock.queue`: al empezar a esperar crea `<queue>/<Date.now() en 13 dígitos>-<pid en 10 dígitos>.json` con el `LockOwner` propio (`mkdirSync(queue, { recursive: true })`); en cada sondeo lista la carpeta ordenada por nombre, borra las entradas de esta máquina con PID muerto (`isOrphan`) y, solo si la propia es la primera, intenta `tryCreate`. Al coger el cerrojo, o al salir por error o timeout, borra su entrada (`finally`).
  - Texto con cola, cuando cambia `<dueño>|<puesto>|<delante>`: `Esperando el cerrojo de suites: vas ${n}.º en la cola; lo tiene ${formatOwner(owner)}` con `formatOwner` sin el punto final y, si hay entradas delante, `; delante de ti, ${rama (worktree, PID n)}, …` y `.` al final. `n` = índice de la propia entrada + 1. Sin `queue`, el texto de hoy, sin cambiar.
- [ ] **Step 2: Tests** (procesos reales, como el `lockRun` del fichero):
  - `makes a suite in another worktree of the clone wait for the running one, and says so` — regex pasa a `/Esperando el cerrojo de suites: vas 1\.º en la cola; lo tiene main \(.+, PID \d+\) desde /`.
  - `runs a nested lock run without waiting when its parent holds the lock` — `lockRun(repo, <script que lanza con spawnSync 'node bin lock run -- node -e "console.log(\'inner\')"' heredando env>)`: stdout `inner`, stderr sin `Esperando`, y el exterior acaba con 0 en menos de 30 s.
  - `asks for the lock when the inherited owner is not the holder` — con `SDD_SUITE_LOCK_OWNER=1` y otro proceso con el cerrojo: stderr contiene `Esperando el cerrojo de suites`.
  - `orders two waiters by arrival and lets the first one in` — A tiene el cerrojo 3 s; B llega, luego C; C imprime `vas 2.º en la cola` y `delante de ti, feature/otra` y acaba después que B (cada uno escribe su hora de inicio en un fichero).
  - `drops the queue entry of a dead waiter` — se escribe a mano en `.git/sdd-tests.queue/` una entrada con un PID muerto; un `lockRun` sin nadie con el cerrojo acaba con 0 y la carpeta queda vacía.
- [ ] **Step 3: Build** — `moon run cli:typecheck` → verde.
- [ ] **Step 4: Medida de moon** — en el worktree, `node cli/bin/sdd.js lock run -- moon run kit:test-headless --force` en segundo plano 10 s: la salida no lleva `Esperando el cerrojo` del `sdd lock run` interior (ver `.temp/` del log); cortar por PID. Si lo lleva, parar y avisar: es un desvío.
- [ ] **Step 5: Verificación** — el comando de «Verificación».
- [ ] **Step 6: Commit de la task** — `feat(cli): un turno del cerrojo de suites por gate, con cola por orden de llegada`.

### Task 2 — Arranque de sesión y hook en Node

**Tras**: —
**Modelo**: sesión (Native)
**Tests RED**: TDD del propio hilo · `cli/test/kit/kit-session-source.slow.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/kit-session-source.slow.test.ts` → `Tests  N passed (N)`
**Se prueba en la aplicación**: `node start-kit-session.mjs --model sonnet` en un terminal de Orca abre la TUI con las skills del worktree (el `Base directory` de una skill apunta al worktree), las flechas y Esc funcionan, Ctrl+C dentro de la TUI llega a `claude` y, al salir, `$env:SDD_KIT_SESSION_ROOT` de esa terminal sigue vacía.

**Interfaces**:
- Consume: `runInherited(command: string[], cwd: string): Promise<number>` de `cli/src/tasks/command.ts`.
- Produce: `start-kit-session.mjs`, `.claude/hooks/kit-session-source.mjs`.

**Ficheros**: crear `start-kit-session.mjs`, `.claude/hooks/kit-session-source.mjs`; modificar `.claude/settings.json`, `cli/test/kit/kit-session-source.slow.test.ts`; borrar `Start-KitSession.ps1`, `.claude/hooks/Test-KitSessionSource.ps1` (este, tras la prueba en Orca).

- [ ] **Step 1: Implementación**
  - `start-kit-session.mjs`: cabecera de comentarios como la del `.ps1` (qué hace, `--resume`/`--continue` con los mismos argumentos), cambiando el nombre. `root` = carpeta del script; `process.env.SDD_KIT_SESSION_ROOT = root`; `CLAUDE_CODE_TMPDIR` solo si falta o está vacía, a `join(root, '.temp')`; `process.on('SIGINT', () => {})`; `process.exitCode = await runInherited(['claude', '--settings', '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}', '--plugin-dir', root, ...process.argv.slice(2)], process.cwd())`.
  - `.claude/hooks/kit-session-source.mjs`: misma lógica que `Test-KitSessionSource.ps1` (normaliza rutas: absoluta, sin barra final, `\`→`/`, minúsculas; ruta que no resuelve → `null`; `git -C <proyecto> config --get core.hooksPath`), mismo JSON (`systemMessage`, `hookSpecificOutput.hookEventName: 'SessionStart'`, `additionalContext`), mismos textos con `./Start-KitSession.ps1` → `node start-kit-session.mjs` y `Start-KitSession.ps1` → `start-kit-session.mjs`; sin aviso no escribe nada; sale siempre con 0. El JSON con `JSON.stringify` (no hace falta escapar a ASCII: Claude Code lo lee en UTF-8).
  - `.claude/settings.json`: `"command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/kit-session-source.mjs\""`, `"shell": "bash"`.
- [ ] **Step 2: Tests**
  - `invokeKitSessionHook` lanza `run(process.execPath, [hookScript], { env })` con `hookScript = .claude/hooks/kit-session-source.mjs`; las aserciones del hook se quedan; `systemMessage nombra start-kit-session.mjs` (`/start-kit-session\.mjs/`).
  - `describe('start-kit-session.mjs')`, con un `claude.cmd` falso en un `bin` temporal al principio del `PATH` que llama a `node <fake.mjs> %*`, y `fake.mjs` escribe en `seen.json` `{ tmp: CLAUDE_CODE_TMPDIR, root: SDD_KIT_SESSION_ROOT, args: argv.slice(2) }` y sale con 7:
    - `passes the variables and the arguments to claude` — sin `CLAUDE_CODE_TMPDIR` en el env: `tmp` = `join(kitRoot, '.temp')`, `root` = `kitRoot` sin barra final, `args` = `['--settings', '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}', '--plugin-dir', <root>, '--model', 'sonnet']`.
    - `keeps CLAUDE_CODE_TMPDIR when it is already set` — con `CLAUDE_CODE_TMPDIR=D:/otra/.temp`: `tmp` = ese valor.
    - `sets CLAUDE_CODE_TMPDIR when it is empty` — con `""`: `tmp` = `join(kitRoot, '.temp')`.
    - `exits with the code of claude` — código 7.
  - `.claude/settings.json`: `registra un hook SessionStart que ejecuta kit-session-source.mjs con node` (`/^node\s/` y `/kit-session-source\.mjs/`), y `ningún hook llama a pwsh` (`/\bpwsh\b/` en ningún `command`).
  - Fuera los tests que leían el texto de `Start-KitSession.ps1`.
- [ ] **Step 3: Verificación** — el comando de «Verificación».
- [ ] **Step 4: Prueba en Orca** — la línea «Se prueba en la aplicación», en un terminal de Orca (`orca terminal create/send/read`); si la TUI pierde las flechas o Ctrl+C, parar y avisar (desvío). Resultado al ledger. Con la prueba bien, borrar `Start-KitSession.ps1` y `Test-KitSessionSource.ps1`.
- [ ] **Step 5: Commit de la task** — `feat(repo): arranque de sesión y hook SessionStart en Node`.

### Task 3 — moon, pre-commit y `stopPort` sin PowerShell

**Tras**: Task 1
**Modelo**: sesión (Native)
**Tests RED**: ninguno nuevo: `stopPort` lo ejercitan los tests de `cli/test/kit/headless/` que ya lo llaman.
**Superficies**: tooling
**Verificación**: `moon run cli:typecheck cli:test kit:roadmap` con `$env:PATH` sin la carpeta de `pwsh` → `Tasks: 3 completed`; `moon run kit:test-headless --force` → `Tests  N passed (N)`
**Verificación lenta**: `moon run kit:test-headless --force` · ~260 s, en segundo plano.

**Interfaces**:
- Consume: el turno anidado de la Task 1.
- Produce: el gate `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min --affected --base develop`.

**Ficheros**: modificar `moon.yml`, `.githooks/pre-commit`, `cli/test/kit/headless/campaign.ts`; borrar `tests/Invoke-KitTests.ps1`.

- [ ] **Step 1: Implementación**
  - `moon.yml`: fuera `language: powershell`, `test-fast` y `test` (con sus comentarios); se quedan `test-headless`, `roadmap`, `upstream`.
  - `.githooks/pre-commit`: `moon run cli:typecheck cli:test kit:roadmap` en la llamada y en el mensaje de bloqueo.
  - `stopPort(port: number): void`: `run('netstat', ['-ano', '-p', 'TCP'])`; por cada línea con 5 columnas cuya local acaba en `:${port}` y cuya remota es `0.0.0.0:0` o `[::]:0`, `process.kill(Number(pid))` dentro de `try` (un PID que ya murió no es un error). Fuera de Windows, sin cambio de conducta: no hace nada (hoy `pwsh` tampoco hacía nada allí).
  - Borrar `tests/Invoke-KitTests.ps1`.
- [ ] **Step 2: Verificación** — los comandos de «Verificación».
- [ ] **Step 3: Commit de la task** — `build(repo): moon y pre-commit sin PowerShell`.

### Task 4 — Documentación

**Tras**: Task 3
**Modelo**: sesión (Native)
**Tests RED**: ninguno: lo vigilan `cli/test/kit/word-budget.test.ts` y `cli/test/kit/workflow-docs.test.ts`.
**Superficies**: docs
**Verificación**: `pnpm --dir cli exec vitest run test/kit` (sin slow) → `Tests  N passed (N)`; `git grep -n 'Start-KitSession\|Invoke-KitTests\|Test-KitSessionSource\|kit:test-fast\|kit:test\b' -- CLAUDE.md README.md .docs/sdd/tech-stack.md .docs/sdd/architecture.md moon.yml .githooks .claude` → sin salida.

**Interfaces**:
- Consume: el gate de la Task 3.
- Produce: nada.

**Ficheros**: modificar `CLAUDE.md`, `README.md`, `.docs/sdd/tech-stack.md`, `.docs/sdd/architecture.md`.

- [ ] **Step 1: Implementación**
  - `CLAUDE.md`: líneas 3 y 30, `node start-kit-session.mjs` (también el `--model sonnet`); línea 23, sin «los Pester que quedan son de conducta».
  - `tech-stack.md`: línea 6, tareas moon sin `kit:test-fast` ni `kit:test` y sin «Los Pester que quedan…»; línea 8, el pre-commit nuevo y «`kit:test-headless`, `cli:test-slow` y `cli:test-min` corren dentro de `sdd lock run`… dentro del gate de cierre, el `sdd lock run` que lo envuelve coge el cerrojo una vez y los de dentro no lo vuelven a pedir; las esperas van en cola por orden de llegada (feature 0228)», enlazando el requisito de `capabilities/cli.md` sin copiar el texto; línea 32, el gate nuevo; línea 65, sin `Invoke-KitTests.ps1`; línea 152, `start-kit-session.mjs`; línea 215, sin la frase de Pester.
  - `architecture.md:33`: `hooks/kit-session-source.mjs`, y `start-kit-session.mjs` en el árbol si la raíz lista ficheros.
  - `README.md`: el bloque de arranque con `node start-kit-session.mjs`, sin «los Pester que quedan… `pwsh` 7+», el pre-commit nuevo y el bloque de tests sin `kit:test`.
- [ ] **Step 2: Verificación** — los comandos de «Verificación».
- [ ] **Step 3: Commit de la task** — `docs(repo): arranque en Node y gate en un turno del cerrojo`.

---

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 4 h
- Base de la estimación: 4 tasks; la cola y el turno anidado son lo único con lógica nueva (~1,5 h con sus tests de procesos); arranque y hook son traducción con la prueba en Orca (~1 h); moon y `stopPort` (~0,5 h + la verificación lenta); docs (~0,5 h); gate de cierre ~0,5 h aparte.
- Confianza: media — la herencia del entorno por moon y la TUI no están medidas.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min --affected --base develop` (el de `tech-stack.md` §Testing tras la Task 4; el vigente al escribir el plan nombraba `kit:test`, que esta feature borra — decisión 5).
- [ ] Verificación de los criterios de éxito de la spec: `moon run cli:typecheck cli:test kit:roadmap` sin `pwsh` en el `PATH`; dos gates a la vez en dos worktrees, el segundo con su puesto.
- [ ] Spec satisfecha: cada requisito tiene su task.
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`).

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED: el segundo escribe «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene …» y no arranca hasta que acaba el primero → Task 1, `makes a suite in another worktree of the clone wait…`. ✓
- MODIFIED AND: sale con el código del comando → Task 1, `exits with the code of the command`. ✓
- ADDED anidado THEN: arranca sin esperar ni escribir «Esperando» → Task 1, `runs a nested lock run without waiting…`; con moon real → Task 1 Step 4. ✓
- ADDED anidado AND: con un dueño heredado que no es el del cerrojo, lo pide → Task 1, `asks for the lock when the inherited owner is not the holder`. ✓
- ADDED cola THEN: «vas 2.º…; delante de ti, …» → Task 1, `orders two waiters by arrival…`. ✓
- ADDED cola AND: lo coge el que llegó antes → Task 1, `orders two waiters by arrival…`. ✓
- ADDED cola AND: una espera muerta sale de la cola → Task 1, `drops the queue entry of a dead waiter`. ✓
- Arranque: variables solo para el hijo, argumentos tal cual, código de salida → Task 2, tests de `start-kit-session.mjs`; TUI → Task 2 Step 4. ✓
- Hook con `node` y mismos avisos → Task 2, tests del hook y de `settings.json`. ✓
- Sin `pwsh`: pre-commit → Task 3, «Verificación» sin `pwsh` en el `PATH`. ✓
- `stopPort` → Task 3, `kit:test-headless`. ✓
- «Lo que se retira o cambia de forma», cada fila → Task 2 (arranque, hook), Task 3 (`Invoke-KitTests.ps1`, `kit:test*`, `language`, `stopPort`), Task 1 (timeout), Task 4 (docs, gate, «los Pester que quedan»); el `MODIFIED` de `cli.md`, al cerrar con `sdd-archive`. ✓
- Gate en un turno con dos ramas reales → §3, criterios de éxito. ✓
- Review Focus → Task 1 y Task 2, los tests nombrados. ✓
