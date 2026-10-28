---
id: 20261028-205941-feature-0235-verify-runs-intersection
feature: 0235
title: Plan de implementación — sdd merge --verify corre solo lo que se cruza y sin shell
spec: ./spec.md
status: approved
created: 2026-10-28
---

# Plan de implementación — `sdd merge --verify` corre solo lo que se cruza y sin shell

## Decisiones que he tomado yo — valida estas

1. Modelo por task: la sesión (Native), sin despachos por task. — El plan fija las firmas, los literales y los tests.
2. Ejecución: native (ver la línea `Ejecución`).
3. Tres tasks: el gate sin shell (con las fixtures a Node), el cruce con moon en el merge, el reintento, el contraste y el hotfix, y los textos de las skills con su batería. — Cada una cierra con sus tests, y un revisor puede rechazar una sin tocar la vecina.
4. El cruce vive en un módulo nuevo, `cli/src/merge/affected.ts`; `verify.ts` lo llama. — `verify.ts` ya tiene 148 líneas, y el cruce es una responsabilidad propia: leer el gate de moon y preguntar a moon.
5. El contraste viaja en el error: `VerificationFailed` lleva `contrast: string[] | null`, los argumentos que corre `explainFailure` sobre la base. — Así `run.ts` y `hotfix.ts` no pasan nada nuevo a `explainFailure`.
6. `moon query tasks --affected` se lanza con `stdin: 'ignore'`. — Con el stdin abierto se cuelga esperando la lista de ficheros: lo medí con moon 2.6.0 en un workspace de dos proyectos (más de 180 s colgado; con `</dev/null`, `[ 'frontend:test' ]` al momento).
7. Las tareas de la fixture de moon se escriben como `command: 'node'` con `args: ['<script>.mjs']`, con `toolchains: ['system']` y `options: { shell: false, cache: false }`. — Con `node -e "…"`, el comando de moon sin shell rompió las comillas en el prototipo (`Process node failed: exit code 1`).
8. Coste estimado: ~5 h de implementación. Despachos: la revisión final (dos ejes, más Arquitectura) y dos sujetos de `sdd-upgrade` (~0,9 $).
- Review Focus: 4 entradas; ver la sección.

**Goal**: `--verify` parte el gate en argumentos y lo lanza sin shell; con un gate `moon run … --affected`, cada pasada corre solo los targets que tocan la rama y la base.

**Architecture**: `verify.ts` parte el gate (`parseGate`) y lo lanza con `resolveCommand`/`launchSpec` de `cli/src/tasks/command.ts`. `affected.ts` reconoce el `moon run` dentro de los argumentos, pregunta a moon las dos listas y devuelve los argumentos que corren (o ninguno) y los del contraste. `run.ts` y `hotfix.ts` pasan a `verifyMerge` la rama y su merge-base.

**Tech Stack**: TypeScript de `cli/` (Node ≥ 22.18), Vitest, moon 2.6.0.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 3 tasks se encadenan por la interfaz de `verifyMerge`, un error lo caza el test de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — la CLI pasa a lanzar `moon` (herramienta externa) desde `merge/`, y aparece el módulo `merge/affected.ts`.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); clean code y los umbrales del proyecto.
- Literales exactos de la spec, sin variar ni una coma:
  - `verificación: <tarea>: saltada (la base no toca sus inputs)`
  - `verificación: <tarea>: saltada (solo la toca la base)`
  - `verificación: corre <tarea> <tarea> (las tocan la rama y la base)`
  - `verificación: sin cruce: '<opción o target>' no admitido; corre lo que toca la rama`
  - `verificación: sin cruce: moon query falló (<primera línea del error>); corre lo que toca la rama`
  - `--verify: el gate encadena comandos con '<operador>'; hazlo una tarea de moon o un script de package.json`
  - `verificación: no se encuentra '<programa>' en el PATH`
- Todo test que cree repos git, lance procesos o espere va en `*.slow.test.ts` (`tech-stack.md`).
- Los temporales de los tests, bajo el `TEMP` que da la tarea de moon (`.temp/` del worktree); cada fixture se borra al acabar (`afterAll` de `helpers.ts`).

### De proceso

- Native: la sesión implementa; la revisión final va con los ejes de `sdd-verify` (Spec opus+high, Código sonnet+high, Arquitectura opus+high).
- Verificación de una task: `pnpm --dir cli exec vitest run <ficheros> --test-timeout 120000`, nunca una tarea de moon con el cerrojo de suites.
- Commits en castellano con tipo/scope en inglés, con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un gate envuelto (`node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop`) → el cruce sustituye solo los targets que siguen a `moon run` y el `--base`; el envoltorio queda igual · Task 2, `keeps the wrapper and replaces only targets and base`
- `--base=develop` y `--affected` con valor (`--affected=local`) → se reconocen igual que separados · Task 2, `reads --base=<ref> and --affected=<value>`
- Un `&&` entre comillas (`node -e "a && b"`) → no se rechaza; pegado (`test&&lint`) → sí · Task 1, `rejects operators outside quotes only`
- Un rojo de una tarea cruzada → el contraste corre `moon run <esos targets>` sin `--affected` ni `--base` sobre la base · Task 2, `contrasts the crossed targets on the base`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: reutiliza el lanzador de `tasks/command.ts` y el rastreador de moon; ningún algoritmo de lo afectado propio.
- [x] **YAGNI gate**: solo moon; nx y los targets `#tag:` corren sin cruce.
- [x] **Brownfield gate**: `onlyDocsSince`, `failureReport` y `findLockedFile` no cambian; las fixtures cambian de forma, no de conducta.
- [x] **Constitution check**: Art. I con la batería de `sdd-upgrade` (Task 3); Art. X en las Restricciones.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/merge/affected.ts` — leer el `moon run` de los argumentos del gate, preguntar a moon y cruzar.
- `cli/test/merge/affected.test.ts` — unitarios del cruce, con la salida real de `moon query tasks`.
- `cli/test/merge/intersection.slow.test.ts` — el cruce de punta a punta con un workspace de moon, y el gate sin `pwsh`.

**Modificar**:

- `cli/src/merge/verify.ts` — `parseGate`, el lanzamiento sin shell, `verifyMerge` con el cruce y `VerificationFailed.contrast`; fuera `WINDOWS_SHELLS`, `shellCommand` y `runs`.
- `cli/src/tasks/command.ts` — exporta `launchSpec`.
- `cli/src/merge/run.ts` — `parseGate` antes del cerrojo; el merge-base de la rama en `integrate` y en `publish`.
- `cli/src/merge/hotfix.ts` — el merge-base de cada destino en `mergeStable` y `mergeBack`.
- `cli/test/merge/verify.test.ts`, `helpers.ts` y los `*.slow.test.ts` con gates de shell — a Node.
- `skills/sdd-archive/references/merge-recipe.md` — la viñeta de `--verify`.
- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — paso 9.
- `tests/batteries/sdd-upgrade/` — escenario `v3`; `tests/` — su evidencia RED/GREEN.

**NO se tocan**:

- `skills/sdd-archive/SKILL.md` — el paso de la base integrada sigue a mano (No entra de la spec).
- `cli/src/lock/` — `sdd lock run` ya lanza sin shell.

### 1.6 Dependencias

- moon 2.6.0 en el `PATH` para los tests lentos (`.prototools`); la CI de Linux lo instala con proto.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `moon query` lento en un repo grande y en cada reintento | media | +segundos por pasada | se consulta solo si `onlyDocsSince` no corta; medirlo en el slow test |
| moon cambia el JSON de `query tasks` | baja | sin cruce | si no se entiende, se corre lo de la rama (decisión 6 de la spec) |
| fixtures de moon frágiles en la CI de Linux | media | rojo en `cli:test-slow` | `toolchains: ['system']`, scripts `.mjs`, sin shell |

### 1.8 Rollout

Directo, en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El gate sin shell

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/merge/verify.test.ts`, `cli/test/merge/intersection.slow.test.ts` (solo el bloque «sin shell»)
**Superficies**: tooling (CLI)
**Verificación**: `pnpm --dir cli exec vitest run test/merge --test-timeout 120000` → `Tests  N passed (N)`
**Verificación lenta**: la misma línea corre los `*.slow.test.ts` de `test/merge` (~5 min)
**Se prueba en la aplicación**: no, porque es tooling: lo prueba `sdd merge` en los tests lentos.

**Interfaces**:
- Consume: `resolveCommand(command: string): string | null` y `launchSpec(path: string, args: string[]): { file: string; args: string[] }` de `cli/src/tasks/command.ts` (exportar `launchSpec`).
- Produce: `parseGate(text: string): string[]` en `verify.ts`, que lanza `UsageError` con un operador; `runTee` lanza un `string[]`.

**Ficheros**: `cli/src/merge/verify.ts`, `cli/src/tasks/command.ts`, `cli/src/merge/run.ts`, `cli/test/merge/*`

- [ ] **Step 1: Tests RED**
  - `verify.test.ts`, `describe('merge --verify gate')`, que sustituye a `merge --verify shell`:
    - `splits on spaces and groups quotes`: `parseGate('node -e "process.exit(1)"')` → `['node', '-e', 'process.exit(1)']`; `parseGate("moon run 'a b'")` → `['moon', 'run', 'a b']`.
    - `rejects operators outside quotes only`: con cada uno de `a && b`, `a || b`, `a; b`, `a | b`, `a > f`, `a < f` y `test&&lint`, lanza `UsageError` con el mensaje `--verify: el gate encadena comandos con '<op>'; hazlo una tarea de moon o un script de package.json`, donde `<op>` es el primer operador (`&&`, `||`, `;`, `|`, `>`, `<`). `parseGate('node -e "a && b"')` no lanza.
    - `keeps variables literal`: `parseGate('echo $HOME %PATH% ~')` → `['echo', '$HOME', '%PATH%', '~']`.
  - `intersection.slow.test.ts`, `describe('merge --verify sin shell')`:
    - `runs the gate with a PATH without pwsh`: `PATH` = carpetas de `process.execPath` y de `git` (resueltas con `resolveCommand`), gate `node -e "require('fs').writeFileSync('ran.txt','x')"`; el merge sale con 0 y `ran.txt` existe en el destino. Restaura `PATH` en `finally`.
    - `rejects a chained gate before the lock`: `--verify "node -e 1 && node -e 2"` → código 2, el texto lleva `encadena comandos con '&&'` y `fx.lock` no existe.
    - `names a missing program`: `--verify "no-existe-xyz"` → código distinto de 0 y el texto lleva `verificación: no se encuentra 'no-existe-xyz' en el PATH`.
- [ ] **Step 2: Implementación**
  - `parseGate(text: string): string[]`: recorre carácter a carácter; `"` y `'` abren y cierran un grupo sin escapes; fuera de comillas, los espacios separan y `&&`, `||`, `;`, `|`, `>` y `<` lanzan el `UsageError` (`&&` y `||` antes que `|`).
  - `runTee({ worktree, argv, io }, log)`: `resolveCommand(argv[0])`; si es `null`, lanza `DomainError('verificación: no se encuentra \'<argv[0]>\' en el PATH')`; si no, `launchSpec` y `spawn(file, args, { cwd, windowsHide: true, stdio: ['ignore','pipe','pipe'], windowsVerbatimArguments: file !== resolved })`. Fuera `WINDOWS_SHELLS`, `ShellProbe`, `runs` y `shellCommand`.
  - `Verification` pasa de `command: string` a `argv: string[]`.
  - `mergeBranch` (`run.ts`): `if (options.verify !== null && options.verify.trim() !== '') parseGate(options.verify)` antes de `resolveMergePolicy`, para salir con 2 sin cerrojo.
  - Fixtures a Node: `helpers.ts` gana `nodeGate(script: string): string`, que escribe `script` en un `.mjs` dentro de la fixture y devuelve `node "<ruta>"`. `publishFromSeed`, `sleepCommand` y los gates de `base-red`, `failures`, `verified-at`, `mergiraf`, `push-retry`, `hotfix` y `lock-and-base` pasan a `nodeGate(...)` o a `node -e "..."`, con la misma conducta (`exit 1` → `process.exit(1)`; el `[IO.File]::WriteAllText` del fichero bloqueado → `fs.openSync` con bloqueo, o se mantiene con `pwsh` solo si el test es solo de Windows y lo dice su `it`).
- [ ] **Step 3: Verificación** — la línea de «Verificación»: verde, con los tests nuevos.
- [ ] **Step 4: Commit de la task** — `feat(merge): lanzar el gate de --verify sin shell`.

### Task 2 — El cruce con moon

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/merge/affected.test.ts`, `cli/test/merge/intersection.slow.test.ts` (bloque «cruce»)
**Superficies**: tooling (CLI)
**Verificación**: `pnpm --dir cli exec vitest run test/merge --test-timeout 120000` → `Tests  N passed (N)`
**Verificación lenta**: igual que la Task 1
**Se prueba en la aplicación**: no, porque es tooling: lo prueba `sdd merge` en los tests lentos.

**Interfaces**:
- Consume: `parseGate`, `runTee({ worktree, argv, io }, log)` y `onlyDocsSince` de `verify.ts`; `git`/`gitLines` de `git/git.ts`.
- Produce:
  - `affected.ts`:
    - `interface MoonGate { before: string[]; targets: string[]; options: string[]; affected: boolean; base: string | null; relations: boolean; blocker: string | null }`.
    - `readMoonGate(argv: string[]): MoonGate | null`: `null` si no hay `moon`/`moon.exe` seguido de `run`. `before` es todo hasta `run` incluido; `targets`, lo que sigue hasta la primera opción; `options`, el resto sin `--base`/`--base=`/`--head`/`--head=`. `blocker` es la primera de `--stdin`, `--status`, `--force` o del target que no casa con `^[^:#~^]+:[^:]+$|^:[^:]+$`.
    - `matches(target: string, task: string): boolean` (`:t` casa con `*:t`).
    - `queryTasks(worktree: string, base: string, head: string, relations: boolean): Promise<string[]>`: `moon query tasks --affected` con `cwd: worktree`, `stdin: 'ignore'` y el entorno con `MOON_BASE`, `MOON_HEAD` y, con `relations`, `MOON_INCLUDE_RELATIONS=true`; devuelve las claves `proyecto:tarea` de `tasks`. Lanza `Error(<primera línea de stderr>)` si sale distinto de 0 o el JSON no se entiende.
    - `interface Plan { run: string[] | null; contrast: string[] | null; lines: string[] }`.
    - `planGate(gate: MoonGate, sides: { branch: string[]; base: string[] | null }, bases: { mergeBase: string; verifiedAt: string | null }): Plan`. Con `base` `null` (sin `--verified-at`) corre los targets de la rama con `--base <mergeBase>`.
  - `verify.ts`:
    - `interface VerifyRequest { command: string | null; verifiedAt: string | null; branch: string; mergeBase: string }`.
    - `verifyMerge(worktree, request, io): Promise<string | null>` devuelve el sha verificado (`HEAD`) o `null` si no corrió.
    - `class VerificationFailed { contrast: string[] | null }`.
    - `explainFailure(error, { worktree, io })` corre `error.contrast`.

**Ficheros**: crear `cli/src/merge/affected.ts`, `cli/test/merge/affected.test.ts`; modificar `verify.ts`, `run.ts`, `hotfix.ts`, `intersection.slow.test.ts`.

- [ ] **Step 1: Tests RED**
  - `affected.test.ts`, con `const QUERY = <la salida real de moon query tasks --affected recortada a tasks.cli.test y tasks.kit.roadmap>`:
    - `reads the targets after moon run`: `readMoonGate(parseGate('moon run :test --affected --base develop'))` → `targets: [':test']`, `affected: true`, `base: 'develop'`.
    - `keeps the wrapper and replaces only targets and base`: con `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop`, la rama `['cli:test']` y la base `['cli:test','kit:roadmap']`, `planGate(...).run` → `['node','cli/bin/sdd.js','lock','run','--','moon','run','cli:test','--affected','--base','a1b2c3d']`.
    - `reads --base=<ref> and --affected=<value>`: `moon run :test --affected=local --base=develop` → `affected: true`, `base: 'develop'`, y `--affected=local` sigue en `options`.
    - `skips what does not cross`: la rama `['frontend:test']`, la base `['backend:test']`, el gate `:test` → `run: null` y `lines` = `['verificación: frontend:test: saltada (la base no toca sus inputs)', 'verificación: backend:test: saltada (solo la toca la base)']`.
    - `runs what crosses`: la rama y la base `['frontend:test']` → `lines[0]` = `verificación: corre frontend:test (las tocan la rama y la base)`.
    - `contrasts the crossed targets on the base`: `contrast` = `['moon','run','frontend:test']`, sin `--affected` ni `--base`.
    - `runs the branch without verified-at`: `base: null` → `run` con los targets de la rama y `--base <mergeBase>`, sin líneas de `saltada`.
    - `refuses to cross a tag target`: `moon run '#ci:test' --affected` → `blocker: '#ci:test'`; `moon run :test --affected --force` → `blocker: '--force'`.
    - `matches project and any-project targets`: `matches(':test','cli:test')` y `matches('cli:test','cli:test')` son verdaderos; `matches('kit:test','cli:test')` es falso.
    - `reads the task keys of moon query`: el parser de `queryTasks` sobre `QUERY` → `['cli:test','kit:roadmap']`.
  - `intersection.slow.test.ts`, `describe('merge --verify cruza con la base')`, con `moonFixture()` = `mergeFixture` + `.moon/workspace.yml` (`frontend: apps/frontend`, `backend: apps/backend`) y dos `moon.yml` (decisión 7) cuyo `.mjs` escribe `ran-<proyecto>.txt` en la raíz del repo:
    - `skips when the base does not touch the branch inputs`: la rama toca `apps/frontend/a.txt`, `--verified-at <su punta>`, el remoto trae `apps/backend/a.txt` → código 0, el texto lleva las dos líneas `saltada` y no hay `ran-*.txt`.
    - `runs the task both sides touch`: el remoto también toca `apps/frontend/b.txt` → `ran-frontend.txt` existe y `ran-backend.txt` no.
    - `runs a branch commit after verified-at`: la rama tiene un commit en `apps/frontend/` después de `--verified-at` y el remoto solo toca el backend → corre `frontend:test`.
    - `runs the branch without verified-at`: sin la opción → corre `frontend:test` y no `backend:test`.
    - `crosses again on a push retry`: con `publishFromSeed` que publica `apps/backend/c.txt` → `push: … (2/3)` y ningún `ran-*.txt`.
    - `contrasts the crossed targets on the base`: el script de `frontend` sale con 1 → el texto acaba en `base: en verde: el rojo lo trae la rama`.
    - `falls back to the branch when moon query fails`: `PATH` sin moon y gate `moon run :test --affected` → el texto lleva `verificación: sin cruce: moon query falló`. Ese caso acaba en `no se encuentra 'moon'`, y sirve.
    - `crosses on a hotfix`: como `hotfix.slow.test.ts`, con la rama del hotfix tocando `apps/frontend/` y `develop` solo `apps/backend/` → no corre nada en la vuelta.
- [ ] **Step 2: Implementación**
  - `verifyMerge`:
    1. `onlyDocsSince` como hoy.
    2. `const argv = parseGate(command)`.
    3. `const gate = readMoonGate(argv)`. Sin `gate` o sin `affected`, corre `argv` y el contraste es `argv`.
    4. Con `blocker` o con `queryTasks` que lanza, escribe la línea de `sin cruce` y corre el gate con `--base <mergeBase>`. El contraste es el gate sin `--affected`, `--base` ni `--head`.
    5. Si no, `branch = queryTasks(worktree, mergeBase, request.branch, relations)` y `base = verifiedAt === null ? null : queryTasks(worktree, verifiedAt, 'HEAD', relations)`. Después `planGate`: escribe `lines` y corre `run` si no es `null`.
  - `run.ts`, `integrate`: `mergeBase = git merge-base <before> <branch>` antes de `mergeFeature`. `publish` recibe `mergeBase` y, en cada reintento, `verifiedAt` = `HEAD` antes de integrar, como hoy. Sin `--verified-at`, el primer `verifyMerge` devuelve `HEAD`, que es el verificado del primer reintento.
  - `hotfix.ts`: `mergeStable` y `mergeBack` calculan su `mergeBase` con el `HEAD` de su destino antes de `mergeFeature` y `job.branch`; `explainFailure` pierde `command`.
- [ ] **Step 3: Verificación** — la línea de «Verificación»: verde.
- [ ] **Step 4: Commit de la task** — `feat(merge): --verify corre solo lo que se cruza con la base`.

### Task 3 — Las skills y la migración

**Tras**: Task 2
**Modelo**: la sesión (Native); sujetos `sonnet`, persona `haiku`, con `node tests/headless/run.mjs` de la batería
**Tests RED**: hilo principal · escenario `v3` de `tests/batteries/sdd-upgrade/battery.md`, corrido contra el kit de `develop` (RED) y el de la rama (GREEN)
**Superficies**: docs (skills), tests del kit
**Verificación**: el escenario `v3` en GREEN (el informe lleva `Gate que encadena comandos: «pnpm lint && pnpm test»`) y `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` → `passed`
**Se prueba en la aplicación**: no, porque son textos de skills: lo prueba el sujeto.

**Interfaces**:
- Consume: los literales de salida de las Tasks 1 y 2.
- Produce: nada para otras tasks.

**Ficheros**: `skills/sdd-archive/references/merge-recipe.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`, `tests/batteries/sdd-upgrade/battery.md` y su `subject.mjs` si el molde necesita el «Gate de merge», `tests/v3-gate-warning-red.md`, `tests/v3-gate-warning-green.md`

- [ ] **Step 1: RED** — añade a la batería el escenario `v3` sobre `mold-v2x`, con `- **Gate de merge**: pnpm lint && pnpm test` en el `tech-stack.md` del molde. «Esperado»: el informe final lleva `Gate que encadena comandos: «pnpm lint && pnpm test» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json`, y la línea del gate no cambia. Corre 1 sujeto con el kit sin el paso 9: debe faltar el aviso. Evidencia en `tests/v3-gate-warning-red.md`.
- [ ] **Step 2: Implementación**
  - `v3.0.0.md`, paso **9. Gates que `sdd merge --verify` no admite**, sin gate y tras el 8. Lee la línea «Gate de merge» de `steering/operations.md` §Testing (sin ella, «Gate de cierre»; con el paso 2 pendiente, la del `tech-stack.md`).
    - Con `&&`, `||`, `;`, `|`, `>` o `<` fuera de comillas, el informe dice `Gate que encadena comandos: «<línea>» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json`.
    - Con `$`, `%…%` o `~`, dice `Gate con variables: «<línea>» — sdd merge --verify no las expande; ponlas en la tarea de moon o en el script`.
    - No reescribe nada. Sin aviso, el paso se salta y lo dice.
    - Y la `Verificación` gana: «el informe lista el aviso del paso 9 o dice que se saltó».
  - `merge-recipe.md:42`, la viñeta de `--verify`: el gate va como argumentos, sin shell, y un gate con `&&` es una tarea de moon o un script de `package.json`. Con un gate `moon run … --affected`, el script corre solo lo que se cruza, y sus líneas `verificación: <tarea>: saltada (…)` y `verificación: corre …` van a la línea `Gate:`.
- [ ] **Step 3: GREEN** — 1 sujeto con el kit de la rama; el informe lleva el aviso. Evidencia en `tests/v3-gate-warning-green.md`. Si falla, una tanda de REFACTOR (tope de la previsión: ~1,8 $).
- [ ] **Step 4: Commit de la task** — `feat(sdd-upgrade): avisar de un gate que encadena comandos`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 5 h
- Base de la estimación: 3 tasks. La 2 es la gorda: un módulo nuevo y un workspace de moon en las fixtures. Las fixtures de shell pasan a Node en 7 ficheros. Como referencia, el `--verified-at` y el contraste de la base (0128, 0230) fueron de 3 a 4 h cada uno.
- Confianza: media (las fixtures de moon en la CI de Linux)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Los `*.slow.test.ts` de `cli/test/merge/`, que no van en el gate: `pnpm --dir cli exec vitest run test/merge --test-timeout 120000`
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- No corre nada, dos `saltada` y fusiona → Task 2, `skips when the base does not touch the branch inputs` y `skips what does not cross`. ✓
- La base también toca frontend → `corre frontend:test …` y `moon run frontend:test --affected --base a1b2c3d` → Task 2, `runs the task both sides touch` y `keeps the wrapper and replaces only targets and base`. ✓
- Commit de la rama posterior al verificado → Task 2, `runs a branch commit after verified-at`. ✓
- La rama desde el merge-base y el `--base` declarado no cuenta → Task 2, `keeps the wrapper…` (sustituye `develop`). ✓
- Sin `--verified-at` → Task 2, `runs the branch without verified-at` (unitario y lento). ✓
- `-g`/`--include-relations` → Task 2: `readMoonGate` pone `relations`, y `queryTasks` pasa `MOON_INCLUDE_RELATIONS`. Sin test de punta a punta con dependencias. ⚠ Avisado: lo garantiza moon con su variable, comprobada en la decisión 1 de la spec.
- Tarea que no toca nadie, no sale → Task 2, `skips what does not cross` (las `lines` solo tienen dos). ✓
- Gate sin `--affected` o no moon → Task 1, todos los lentos con `node`. ✓
- `--stdin`/`--status`/`--force`/target no admitido → Task 2, `refuses to cross a tag target`. ✓
- `moon query` falla → Task 2, `falls back to the branch when moon query fails`. ✓
- Hotfix ida y vuelta → Task 2, `crosses on a hotfix` (la vuelta); la ida usa el mismo `mergeStable` → `verifyMerge`. ✓
- Sin shell en Windows sin `pwsh` → Task 1, `runs the gate with a PATH without pwsh`. ✓
- Comillas agrupan → Task 1, `splits on spaces and groups quotes`. ✓
- `.cmd` con `cmd.exe` de `ComSpec` → `launchSpec` ya probado por `sdd lock run`; sin test nuevo. ✓
- Rechazo de `&&`, `||`, `;`, `|`, `>`, `<`, con código 2 y sin cerrojo → Task 1, `rejects operators outside quotes only` y `rejects a chained gate before the lock`. ✓
- `$VAR`, `%VAR%`, `~` literales → Task 1, `keeps variables literal`. ✓
- Programa que no está → Task 1, `names a missing program`. ✓
- MODIFIED «La suite no se repite…»: omitida con solo docs, sin cambios → `verified-at.slow.test.ts` (pasado a Node en la Task 1); el cruce → Task 2; Mergiraf → `mergiraf.slow.test.ts` con `--verified-at`, sin cambios de conducta. ✓
- MODIFIED del reintento → Task 2, `crosses again on a push retry`; los AND sin cambios → `push-retry.slow.test.ts`. ✓
- MODIFIED del merge que falla, el contraste → Task 2, `contrasts the crossed targets on the base` (unitario y lento); sin cruce → `base-red.slow.test.ts` con gate de Node. ✓
- Migración: el aviso, la línea sin cambios, sin gate, «Gate de cierre» si no hay «Gate de merge» y «se salta y lo dice» → Task 3, escenario `v3` (solo el caso `&&`). Variables, «Gate de cierre» y el salto: ⚠ los fija el texto del paso, sin sujeto propio (previsión de coste).
- Review Focus → Tasks 1 y 2, los tests nombrados. ✓
