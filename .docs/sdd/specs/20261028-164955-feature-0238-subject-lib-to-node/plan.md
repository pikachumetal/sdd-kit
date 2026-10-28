---
id: 20261028-164955-feature-0238-subject-lib-to-node
feature: 0238
title: Plan de implementación — La biblioteca del sujeto y los moldes pasan a Node
spec: ./spec.md
status: draft
created: 2026-10-28
---

# Plan de implementación — La biblioteca del sujeto y los moldes pasan a Node

## Decisiones que he tomado yo — valida estas

1. Modelo por task: la sesión (Native), sin despachos por task. — El plan fija la API, los textos y los tests; los moldes se portan línea a línea.
2. Ejecución: native (ver la línea `Ejecución`).
3. Cinco tasks: núcleo de `lib.mjs` (guardas, rutas, guardar), lanzamiento de `claude` (argumentos, turnos, tope, puertos), el e2e con `using-sdd` y el corte de lo lento, los otros 13 moldes con el test en seco, y la retirada de bash con los documentos. — Cada una cierra con su test y la puede rechazar un revisor sin tocar la vecina.
4. `lib.mjs` registra la limpieza con `process.on('exit')`, que solo admite código síncrono: toda la limpieza (borrar, `netstat`, `taskkill`) es síncrona, como el `trap … EXIT` de `lib.sh`. `die` escribe el mensaje y llama a `exit(1)`.
5. `extract.mjs` no cambia: `lib.mjs` lo lanza con `node` como hoy (`clean`, `tools`, `texts`, `last`), porque es un script con código de primer nivel que lee `process.env`.
6. `cell` de cada molde importa `field` de `battery.mjs` si está exportado; si no, la Task 3 lo exporta, sin cambiar el comando `field`.
7. `git archive … | tar -x` de los moldes pasa a `git archive -o <tar>` más `tar -xf <tar> -C <dir>` (el `tar.exe` de Windows), sin tubería.
8. `subject_show` y `seed_transcript` no los usa ningún molde de batería, pero sí las campañas (`tech-stack.md`, feature 0188): se portan (`show`, `seedTranscript`) con su test.
9. Coste estimado: ~6 h de implementación; despachos solo en la revisión final (dos ejes, ~250-400k tokens). Sin sujetos.
- Review Focus: 3 entradas; ver la sección.

**Goal**: `lib.sh` y los 14 `subject.sh` pasan a Node con el contrato de hoy, los tests del lanzador en proceso y el repo sin bash fuera de `.githooks/`.

**Architecture**: `tests/headless/lib.mjs` exporta `initSubject(argv, skill, options?)` sobre unas dependencias inyectadas (`SubjectDeps`); sin `options.deps`, usa las reales (`node:fs`, `spawnSync`, `spawn`, `netstat`, `taskkill`, `Date.now`). Cada `tests/batteries/<skill>/subject.mjs` la importa por ruta relativa. `run.mjs` (0216) los lanza con node.

**Tech Stack**: Node ≥ 22.18 (ESM, `.mjs`), Vitest en `cli/test/kit/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 5 tasks se encadenan por la API de `lib.mjs`, un error lo caza el test de su task o el de moldes en seco, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — herramienta de test del repo, sin módulo de producto, dependencia nueva ni contrato con la CLI.

## Restricciones globales

### De código

- Node ≥ 22.18, ESM; sin dependencias nuevas.
- Textos, nombres de fichero y variables de entorno de `lib.sh`, literales; los nuevos, los de la spec: `SUBJECT_SH tiene que ser un .mjs: los subject.sh se fueron con la 0238`, `no comprobado (netstat no respondió)`.
- Ningún test de `lib.test.ts` lanza procesos ni usa temporizadores reales; solo `subject.test.ts` y `molds.test.ts` lanzan node y git, y ninguno lanza bash ni duerme con reloj fijo.
- Rutas en forma Windows; sin `cygpath`.
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, ticket, `capabilities/`). Los «por qué» de `lib.sh` que siguen aplicando se conservan junto a su código, sin la cita. Nombres en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns. Texto humano en castellano con tildes.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia.
- El hook de comandos bloquea `*` suelto y tokens `/palabra`: mensajes de commit con `git commit -F <fichero del scratchpad>`.
- Verificación de una task: `pnpm --dir cli exec vitest run <sus ficheros>`, nunca una tarea de moon con el cerrojo de suites.

## Review Focus

- Una petición con comillas dobles, «», tildes y un salto de línea llega igual a `claude` por `spawn` sin shell (Node cita los argumentos para `CreateProcess`) · Task 3, `subject.test.ts` › `passes the request byte for byte`, con `"` y salto de línea además de lo de la spec.
- Un puerto que ya escuchaba antes del sujeto con el mismo número, pero otro PID cuando acaba (reinicio de un servidor ajeno) → no se para · Task 2, `does not stop a pid that was listening before the subject`, y `stops a new pid on a port that was busy before`.
- `die` dentro de la limpieza (`exit` reentrante) no deja el proceso colgado ni se salta el borrado del molde · Task 1, `cleanup runs once even if exit is called again`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un módulo con una función de entrada y un objeto; sin clases ni capas.
- [x] **YAGNI gate**: sin Linux ni macOS; sin opciones nuevas salvo `CLAUDE_BIN`, que pide el e2e.
- [x] **Brownfield gate**: contrato con `run.mjs` y ficheros de salida intactos; los moldes, línea a línea.
- [x] **Constitution check**: Art. I (sin texto de skill, sin RED), Art. X (arriba), Art. XI (lo aprendido a `tech-stack.md`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/headless/lib.mjs` — `initSubject` y el objeto del sujeto; dependencias reales por omisión.
- `tests/batteries/<skill>/subject.mjs` × 14 — los moldes.
- `cli/test/kit/headless/lib.test.ts` — `lib.mjs` en proceso, con `memoryFs()` ampliado y procesos falsos.
- `cli/test/kit/headless/subject.test.ts` — el único e2e.
- `cli/test/kit/headless/molds.test.ts` — un molde de cada clase en seco; los de `sdd-archive` con `sdd capability check`.

**Modificar**:

- `tests/headless/campaign.mjs` — `SUBJECT_SH` solo `.mjs`; cabecera.
- `tests/headless/real-deps.mjs` — fuera `findGitBash` y la rama `.sh`.
- `tests/headless/battery.mjs` — `SUBJECT_SH` a `subject.mjs`, comentario; `field` exportado si hace falta.
- `tests/headless/run.mjs` — cabecera.
- `cli/test/kit/headless/memory-fs.ts` — `copy` si `lib.mjs` lo necesita.
- `cli/test/kit/headless/campaign.ts` — fuera `bash`, `libSh`, `runLib`, `fakeClaude`, `serverLaunch` y lo que deje de usarse.
- `cli/test/kit/headless/campaign.test.ts`, `battery.test.ts`, `run.test.ts` — el `.sh` rechazado y los comentarios que nombran `lib.sh`.
- `moon.yml` — fuera `/cli/test/kit/bash.ts`.
- `.docs/sdd/tech-stack.md`, `.docs/sdd/architecture.md`, 13 `tests/batteries/*/battery.md`.

**Borrar**: `tests/headless/lib.sh`, 14 `tests/batteries/*/subject.sh`, `cli/test/kit/bash.ts`, `cli/test/kit/bash.slow.test.ts`, `cli/test/kit/headless/{lib,identity-and-show,paths-and-cleanup,ports,settings}.slow.test.ts`.

**NO se tocan**: `extract.mjs`, `deny-kill.mjs`, `no-claude/`, `.claude/settings.json`, la evidencia de `tests/*.md` y `.docs/sdd/specs/`.

### 1.6 Dependencias

`netstat`, `taskkill` y `tar` de Windows; `pwsh` solo en `real-deps.mjs` (ya estaba).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un molde portado construye otra cosa (un `sed` mal traducido) | media | alto: la batería mide otro molde | `molds.test.ts` construye una clase de cada; en la Task 4, comparar el `state.txt` en seco del `.sh` y del `.mjs` de cada clase antes de borrar el `.sh` |
| `kit:test-headless` sigue por encima de 60 s por `molds.test.ts` | media | medio | moldes en paralelo dentro del test (`it.concurrent`), y medir; si no baja, desvío con el número |
| La 0228 tocó `moon.yml` o el pre-commit | baja | bajo | integrar la base antes del gate |

### 1.8 Rollout

Directo. Las campañas abiertas en otros worktrees siguen con su `subject.sh` hasta integrar `develop`; al integrarla, `run.mjs` les dice que pasen a `.mjs`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

En orden, sin paralelo.

### Task 1 — Núcleo de `lib.mjs`: guardas, rutas, molde y guardado

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/headless/lib.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/lib.test.ts` → `passed`.

**Interfaces**:
- Produce, en `tests/headless/lib.mjs`:
  - `initSubject(argv, skill, { env = process.env, deps = realSubjectDeps() } = {}) → Subject`, con `argv = [kit, label, scenario, out]`.
  - `Subject = { KIT, LABEL, SC, R, RUN, RUNS, OUT, HEADLESS, NODE, put(path, text), git(...args) → string, commit(title, body?), die(message), save(stateText), keep(path, flatName), show(revPath, flatName), seedTranscript(branch, lines), kitVersion() → string, putKitMarker(fields), launch(ask), resume(message), converse(sheet, maxTurns), ports() → string }` (`launch`, `resume`, `converse`, `ports` en la Task 2).
  - `SubjectDeps = { fs, run(command, args, { cwd, env, input }) → { code, stdout, stderr }, spawnClaude(…) (Task 2), netstat() (Task 2), kill(pid, tree) (Task 2), now() → ms, onExit(fn), exit(code), err(line), out(line) }`.

**Ficheros**: crear `tests/headless/lib.mjs`, `cli/test/kit/headless/lib.test.ts`; modificar `memory-fs.ts` si hace falta.

- [ ] **Step 1: Tests RED** (de los `.slow` que se van, con sus mismos nombres en castellano):
  - Guardas de `initSubject`: `RUNS_DIR fuera del scratchpad o de .temp/: <runs>`; acepta `RUNS_DIR` bajo `.temp/` del repo con barras y mayúsculas distintas; `sin la skill <s> en la copia del kit <kit> (task 0040)`; copia con `.docs/` o `tests/` → `la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin agents cli hooks`; `dependencies` sin `SUPERPOWERS_DIR` → `el kit declara dependencies: define SUPERPOWERS_DIR (ruta de superpowers)`. Cada `die` sale con `[<etiqueta>] <mensaje>` y código 1.
  - Rutas: `RUN = <RUNS_DIR>/<PHASE>/<label>`, `R = RUN/<MOLD_NAME|repo>`, `OUT` absoluto; un `OUT` relativo se resuelve contra el cwd de entrada.
  - `out_path`: ruta relativa al repo ≥ 140 → `ruta de <n> caracteres (máximo 139): <rel>`; en seco con `SPEC_DIR` en disco mide la que tendría en `SPEC_DIR/<fase>/out`; **en seco sin `SPEC_DIR` en disco no mide** (carrera (c)); no corta por la ruta del scratchpad.
  - `git`: falla con `el molde <R> no es su propio repo git: falta git init en el subject.mjs antes del primer git` si el primer `git` no es `init` y `rev-parse --show-cdup` no sale vacío; pasa `-c core.longpaths=true` y la identidad `Fixture`.
  - `keep`: solo copia plana (`<label>: solo copia plana…`), `sin <path>` si no existe.
  - `save`/`keep` con la identidad de git de la máquina: no deja el fichero, escribe la marca `.leak` y el sujeto sale con 1 al limpiar.
  - Limpieza: borra el molde y la carpeta de Claude Code del sujeto (`<CLAUDE_CODE_TMPDIR|TEMP>/claude/<slug de R>`), no la de otros; `KEEP_MOLD=1` conserva el molde; con la etiqueta vacía o `RUN` fuera de `RUNS` no borra y avisa; `cleanup runs once even if exit is called again`.
  - `kitVersion` compara por SemVer entre `plugin.json` y las migraciones; `putKitMarker('"ids": …')` escribe `{"version": "<v>", "ids": …}`.
  - `show` vuelca `<rev>:<ruta>` con `git show` y aplica las reglas de `keep`; `seedTranscript` siembra en `<CLAUDE_CONFIG_DIR>/projects/<slug>/seed-<n>.jsonl` y la limpieza la borra; sin molde, `die`.
- [ ] **Step 2: Implementación**. Slug de Claude Code: la ruta Windows de `R` con cada carácter no alfanumérico cambiado por `-`. `clean` y los extractos con `deps.run(NODE, [extract.mjs, …])`, a un `.tmp` que se renombra solo si sale con 0.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit** — `feat(headless): lib.mjs con las guardas, las rutas y el guardado del sujeto`.

### Task 2 — Lanzar `claude`: argumentos, segundo turno, persona, tope y puertos

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `lib.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/lib.test.ts` → `passed`.

**Interfaces**:
- Consume: `initSubject`, `SubjectDeps` (Task 1).
- Produce: `launch`, `resume`, `converse`, `ports` en `Subject`; en `SubjectDeps`, `spawnClaude(command, args, { cwd, env, stdout, stderr, timeoutMs }) → { code, timedOut }` (síncrona por dentro con `spawnSync` y `timeout`, o asíncrona; `launch` devuelve una promesa), `netstat() → string`, `kill(pid, tree)`.

- [ ] **Step 1: Tests RED**:
  - Argumentos (`<label>.args`, uno por línea, y la petición al final): `-p --model <MODEL|sonnet> --settings <json> --plugin-dir <KIT> --add-dir <KIT> --add-dir <RUN>`; con `SUPERPOWERS_DIR`, `--setting-sources "" --plugin-dir <sp>`; `--permission-mode acceptEdits --allowedTools Bash(*) PowerShell(*) Agent <EXTRA_ALLOWED…> --disallowedTools SendMessage ListAgents AskUserQuestion <EXTRA_DISALLOWED…>`; `APPEND_SYSTEM`; `--max-turns <MAX_TURNS|60> --output-format stream-json --verbose`.
  - `SETTINGS` sin `"sdd-kit@sdd-kit":false` → `SETTINGS sin deshabilitar el kit instalado: <json>`; sin `deny-kill.mjs` → `SETTINGS sin el hook deny-kill.mjs: añade $DENY_KILL_HOOK a sus PreToolUse`; el de por omisión lleva el hook con su ruta Windows; uno propio con el hook pasa.
  - `cwd fuera del scratchpad: <cwd>` si `R` no cuelga de `RUNS`.
  - Entorno de `claude`: `PATH` con `<HEADLESS>/no-claude` delante, `GIT_CONFIG_COUNT=2` con `Fixture`; `CLAUDE_BIN` sustituye al comando, y un `.mjs` se lanza con `NODE`.
  - En seco: el stream de tres líneas de hoy (`dry-<label>`, `En seco desde <HOME> · permitidas extra: … · git: Fixture <fixture@example.com>`, `total_cost_usd` `DRY_COST`).
  - `TURN2` reanuda con `--resume <session_id>` (`<label>.resume.args`); sin `session_id` → `sin session_id: no se puede reanudar`; en seco, `total_cost_usd` doble.
  - `converse`: sigue mientras el último resultado lleva `?`, para en el tope, y añade `{"type":"result","num_turns":<n>,"total_cost_usd":<sujeto + persona>,"result":"conversación con persona: <n> respuestas"}`.
  - Tope: `SUBJECT_TIMEOUT=5` con un `spawnClaude` falso que devuelve `timedOut` → `kill(pid, true)` llamado, `[<label>] tope de 5 s: sujeto cortado` y código 124.
  - Puertos: `ports()` junta `PORT` y los `PORT=`/`localhost:` del stream, en rango y sin repetir; `does not stop a pid that was listening before the subject`; `stops a new pid on a port that was busy before`; un puerto que nombra otro sujeto en curso (marca viva en `live/`, PID vacío incluido) no se para y deja la foto en `ports/<puerto>`; el último en acabar para con la foto del primero; un puerto de un sujeto que ya no corre se para. Línea del `.err`: `puertos del sujeto: <p> · escuchando al acabar: <q|ninguno>[ · compartidos con otro sujeto en curso, sin parar: <s>]`, y `no comprobado (netstat no respondió)` si `netstat` falla.
- [ ] **Step 2: Implementación**. `listeningPids(netstat, port)` sale de `campaign.ts` a `lib.mjs` (la usa también `stopPort` del test, que la importa). La foto se toma en `initSubject` (como `SUBJECT_STARTED`). `spawnClaude` real: `spawn(command, args, { cwd: R, env, stdio: ['ignore', fd del jsonl, fd del .err], windowsHide: true })`, con un `setTimeout` de `SUBJECT_TIMEOUT` que llama a `kill(pid, true)`; el `claude` del PATH se busca con `where claude` (el primer `.exe`).
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit** — `feat(headless): lib.mjs lanza claude sin bash, con tope por árbol y puertos por netstat`.

### Task 3 — `using-sdd` en Node, el e2e y fuera los tests lentos

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/headless/subject.test.ts`, `campaign.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless` → `passed`, sin ficheros `.slow` en la carpeta.

**Interfaces**:
- Consume: `initSubject` y `Subject` (Tasks 1-2); `run.mjs` (0216).
- Produce: `tests/batteries/using-sdd/subject.mjs`; `SUBJECT_SH` `.mjs` en `battery.mjs` y `campaign.mjs`.

- [ ] **Step 1: Tests RED**:
  - `subject.test.ts`: `node run.mjs` con `SUBJECT_SH=tests/batteries/using-sdd/subject.mjs`, `SCENARIOS` con un escenario del molde `salas` (cualquiera que no sea `i1`, `i2` ni `u1`), una copia mínima del kit (`skills/using-sdd/SKILL.md`, `.claude-plugin/plugin.json` con versión `9.9.9`, `cli/bin/sdd.js`), `SUPERPOWERS_DIR` a una carpeta vacía, `CLAUDE_BIN` a un `fake-claude.mjs` que escribe `process.argv` en JSON a un fichero y un stream con `session_id` y `result`, y `BATTERY_DIR` a una copia de la batería cuyo escenario lleva la petición `Añade «reservas» con tildes: canción "ya" y salto\nde línea`. Asserts: `molde lleva el marcador con la versión del kit` (con `KEEP_MOLD=1`, `sdd-kit.json` del molde con `"version": "9.9.9"`); `passes the request byte for byte` (último argumento igual); `<label>.tools.txt` guardado; ningún `bash` en la línea de órdenes del árbol (el `fake-claude` escribe también `process.ppid` y la cadena no pasa por `bash.exe`: basta con que `SUBJECT_SH` sea `.mjs` y lo lance `run.mjs`).
  - `campaign.test.ts`: `SUBJECT_SH` acabado en `.sh` → `SUBJECT_SH tiene que ser un .mjs: los subject.sh se fueron con la 0238`.
- [ ] **Step 2: Implementación**: `using-sdd/subject.mjs` línea a línea de su `.sh`; `battery.mjs` lanza `subject.mjs`; `campaign.mjs` rechaza `.sh`; `real-deps.mjs` sin `findGitBash` ni la rama `.sh`.
- [ ] **Step 3: Lo lento**: borrar los 5 `.slow.test.ts`; antes, comprobar caso a caso que cada uno está en `lib.test.ts`, en `subject.test.ts` o en la lista de no portados del ledger, con su porqué. Limpiar `campaign.ts` de lo que quede sin uso.
- [ ] **Step 4: Verificación**.
- [ ] **Step 5: Commit** — `feat(headless): el sujeto de using-sdd en Node y el e2e con un claude falso`.

### Task 4 — Los otros 13 moldes en Node y el test de moldes en seco

**Tras**: Task 3
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/headless/molds.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless/molds.test.ts` → `passed`.

**Interfaces**:
- Consume: `Subject` (Tasks 1-2), `subject.mjs` de `using-sdd` como patrón.
- Produce: 13 `subject.mjs`; `molds.test.ts`.

- [ ] **Step 1: Test RED** `molds.test.ts`: para cada `tests/batteries/<skill>/battery.md`, un escenario por valor distinto de `Molde` (con `plan`/`field` de `battery.mjs`), lanzado con `node run.mjs` en seco (`DRY_RUN=1`, `KEEP_MOLD=1`, `SUBJECT=1`, una copia del kit sacada con `git archive HEAD skills .claude-plugin agents cli hooks` una vez por fichero) y `it.concurrent`. Assert: `<label>.tools.txt` y `<label>.state.txt` guardados y código 0. Para `sdd-archive`, además: `.docs/sdd/sdd-kit.json` del molde con `"version"` igual a `kitVersion()` y `node cli/bin/sdd.js capability check --path <molde>/.docs/sdd` con código 0.
- [ ] **Step 2: Port**, un molde por commit intermedio si ayuda. Antes de borrar cada `.sh`, el `state.txt` en seco de cada clase de molde con el `.sh` (lanzado a mano con Git Bash, una vez, fuera de los tests) y con el `.mjs` coinciden salvo rutas y hashes; las diferencias que queden, al ledger.
- [ ] **Step 3: Verificación**, y medir el tiempo de `molds.test.ts`.
- [ ] **Step 4: Commit** — `feat(batteries): los moldes de las baterías en Node, construidos en seco en el gate`.

### Task 5 — El repo sin bash y los documentos

**Tras**: Task 4
**Modelo**: la sesión (Native)
**Tests RED**: — (retirada y documentos)
**Superficies**: tooling, docs
**Verificación**: `git ls-files '*.sh' ':!:.docs/sdd/specs/**'` vacío; `git grep -n -E "lib\.sh|subject\.sh|bash\.ts|findGitBash" -- tests/headless tests/batteries cli moon.yml` vacío; `pnpm --dir cli exec vitest run test/kit/headless` → `passed`; `pnpm --dir cli exec tsc --noEmit` limpio; `node cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`.

- [ ] **Step 1: Borrar** `lib.sh`, `cli/test/kit/bash.ts`, `bash.slow.test.ts`; la línea de `moon.yml`.
- [ ] **Step 2: Documentos**:
  - `tech-stack.md`: las líneas de método que nombran `lib.sh`, `subject.sh` o sus funciones como herramienta pasan a `lib.mjs`, `subject.mjs` y la API (`subject_init` → `initSubject`, `put_kit_marker` → `putKitMarker`…), entre ellas «Un lanzador nuevo se escribe sobre `tests/headless/lib.sh`»; las lecciones fechadas no se reescriben. Línea nueva en «Sujetos headless»: el sujeto es un `.mjs` sobre `lib.mjs`, `claude` se lanza sin shell, `CLAUDE_BIN` para tests, y el tope mata el árbol.
  - `architecture.md:60-61`: `subject.sh` → `subject.mjs`.
  - Los 13 `battery.md` que nombran `subject.sh` o una función de `lib.sh`.
  - Cabeceras de `run.mjs` y `campaign.mjs` («con node si es .mjs y con Git Bash si es .sh»).
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit** — `chore(headless): el repo sin bash fuera de .githooks`.

### Task 6 — enmienda 2026-10-28: la suite en el CI de Linux, los rápidos en `cli:test`, el tope por omisión y la longitud de `RUNS_DIR`

**Tras**: Task 5
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `campaign.test.ts`, `battery.test.ts`, `lib.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/headless` → `passed`; `pnpm --dir cli exec vitest run` sin `SDD_KIT_HEADLESS` corre `lib.test.ts`, `campaign.test.ts`, `battery.test.ts` y `listening-pids.test.ts`; la suite de `test/kit/headless` en Linux (contenedor o CI) → `passed`.

- [ ] **Step 1: Tests RED**: `readConfig` con un `RUNS_DIR` de 81 caracteres → `RUNS_DIR de 81 caracteres (máximo 80): <ruta>; usa .temp/<corto> del worktree`, y con 80 pasa; `lib.mjs` sin `SUBJECT_TIMEOUT` pone un tope de 1 800 000 ms y con `SUBJECT_TIMEOUT=0` no pone ninguno. Antes, `CWD` y las rutas de `campaign.test.ts` y `battery.test.ts` pasan a `resolve('/w')` y `join`.
- [ ] **Step 2: Implementación**: la guarda de longitud en `readConfig`; el tope por omisión en `runClaude`; en `real-deps.mjs`, `processes` y `kill` con `ps` y `process.kill` fuera de Windows; `cli/vitest.config.ts` excluye fuera de `kit:test-headless` solo `run.test.ts`, `subject.test.ts` y `molds.test.ts`.
- [ ] **Step 3: Verificación**, en Windows y en Linux.
- [ ] **Step 4: Commit** — `fix(headless): la suite del lanzador en Linux, los rápidos en cli:test y los topes de la 0230`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,3 h
- Estimación de implementación: 6 h (4-8)
- Base de la estimación: la 0216 (4 tasks, ~600 líneas) costó 2,39 h; aquí ~400 líneas de biblioteca con su test y ~1.300 de moldes portados línea a línea, con incertidumbre en los `sed` de los moldes grandes
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test-min --affected --base develop` (de `tech-stack.md` §Testing).
- [ ] Medir `kit:test-headless` sin carga, para el walkthrough (antes: 262,6 s sin carga, ~740 s con carga).
- [ ] Spec satisfecha: cada decisión tiene su task (§4).
- [ ] Cierre de rama con `sdd-archive`; al fusionar, `sdd merge --push`.

---

## 4. Self-review (cobertura spec → tasks)

- Decisión 1, API y textos literales → Tasks 1 y 2. ✓
- Decisión 2, rutas Windows → Task 1 (rutas, `RUNS_DIR` con barras y mayúsculas). ✓
- Decisión 3, `spawn` sin shell, `no-claude/`, `CLAUDE_BIN` → Task 2 (entorno), Task 3 (e2e). ✓
- Decisión 4, tope que mata el árbol con 124 → Task 2. ✓
- Decisión 5, carrera (c) → Task 1. ✓
- Decisión 6, puertos con foto de `netstat` → Task 2. ✓
- Decisión 7, `.sh` rechazado → Task 3. ✓
- Decisión 8, 14 moldes → Tasks 3 y 4. ✓
- Decisión 9, tests en proceso y los `.slow` fuera → Tasks 1-3 (Step 3 de la Task 3 cruza caso a caso). ✓
- Decisión 10, e2e con las dos comprobaciones recuperadas → Task 3. ✓
- Decisión 11, moldes en seco y cierre vivo → Task 4. ✓
- Decisión 12, objetivo de 60 s → §3, medido. ✓
- Decisiones 13 y 14, se borran y se quedan → Tasks 3 y 5. ✓
- Decisión 15, documentos → Task 5. ✓
- Review Focus → Task 1 (uno), Task 2 (dos), Task 3 (uno). ✓
