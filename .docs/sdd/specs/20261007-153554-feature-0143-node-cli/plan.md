---
id: 20261007-153554-feature-0143-node-cli
feature: 0143
title: Plan de implementación — CLI sdd en Node
spec: ./spec.md
status: approved
created: 2026-10-07
---

# Plan de implementación — CLI `sdd` en Node

## Decisiones que he tomado yo — valida estas

1. **Ejecución: subagent-driven-development**. Son 14 tasks: en Native, las últimas (barrido de skills, humo, evaluación) correrían con el contexto compactado (Art. IV). Los ports son casi independientes y cada uno tiene un contrato claro (el script viejo y sus Pester), así que la revisión por task es barata y para a tiempo un port que se desvía.
2. **Modelos**: implementadores con `sdd-kit:effort-medium` + `sonnet`: portar con tests existentes es juicio acotado, no diseño. T1 (esqueleto e interfaces que usan todas) y T7 (`roadmap publish`, git y cerrojo sin código previo) con `sdd-kit:effort-high` + `sonnet`. Revisores de task con `sdd-kit:effort-medium` + `sonnet`. Revisor final con `sdd-kit:effort-high` + `opus`. T13 (humo) y T14 (evaluación) las ejecuta el hilo, porque lanzan sujetos headless.
3. **Tests RED del hilo**: el hilo escribe antes de despachar los tests de los THEN de la spec y el test de paridad de cada port. Los casos Pester portados no son THEN de esta spec: son el contrato que escribieron otras features, y los porta el implementador con el script delante.
4. **El borrado de los `.ps1` va en la T11**, no en el commit siguiente a cada port: hasta que la T11 cambia las skills, borrarlos dejaría a las skills llamando a scripts que no existen. Los tests de paridad se borran en ese mismo commit.
5. **Versiones de desarrollo**: `typescript` ^7.0.2 y `vitest` ^5.0.3 (las últimas en npm a 2026-10-07).
6. **Riesgo alto**: `sdd merge` y `roadmap publish` tocan git en worktrees reales. Sus tests aíslan las variables `GIT_*` (la lección de la task 0042) y crean repos en el directorio temporal.
7. **Coste estimado**: unos 28 despachos Sonnet (14 implementadores y 14 revisores, ~150k tokens cada uno), un revisor final Opus y los sujetos del Art. I (~12 $, spec, decisión 23). En horas: 12-18 h de reloj.
8. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: una CLI `sdd` en TypeScript sin build que sustituye los 12 scripts PowerShell, el hook bash y los 5 bash de superpowers con la misma salida, más `roadmap publish` (0049) y `ledger rulings` (0054).

**Architecture**: `cli/bin/sdd.js` (JS plano) comprueba la versión de Node y carga `cli/src/main.ts`, que despacha cada `sdd <sustantivo> <verbo>` a un módulo por dominio. Cada verbo es una función pura sobre un `Io` inyectado, así los tests no lanzan procesos salvo los que prueban git o la propia `bin`.

**Tech Stack**: Node ≥ 22.18.0 (repo en 26.10.0), TypeScript ejecutado por type stripping, Vitest, pnpm workspaces, moon, proto. Pester solo para los tests de frases que quedan.

**Spec**: `./spec.md`

**Ejecución**: subagent, porque el plan tiene 14 tasks y en Native las últimas correrían con el contexto compactado (`execution: auto` en `.docs/sdd/sdd-kit.json`).

## Restricciones globales

### De código

- Node ≥ 22.18.0. `cli/bin/sdd.js` es JS plano y no importa nada de `src/` antes de comprobar la versión.
- TypeScript solo con sintaxis que se borra (`erasableSyntaxOnly`): sin `enum`, `namespace` ni propiedades de parámetro; imports relativos con extensión `.ts`.
- `cli/package.json` sin `dependencies`. `devDependencies`: solo `typescript` y `vitest`. Solo módulos `node:*`.
- Ningún import de moon, pnpm ni proto en `cli/src/`.
- Opciones en inglés kebab-case; mensajes al usuario en castellano con tildes, idénticos a los del script que se porta (los de los bash de superpowers, en inglés, idénticos a los suyos).
- Códigos de salida: 0 bien, 1 fallo del dominio, 2 uso incorrecto. `sdd task done` sale con el código del comando, y con 127 si no existe.
- Todo código que llame a git limpia `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` y `GIT_OBJECT_DIRECTORY` en el entorno del hijo; todo test que cree repos va en `*.slow.test.ts`.
- **Art. X de la constitution, literal:**
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho (`sdd-kit:effort-<nivel>` + `model`); `fable` y `opus xhigh` prohibidos.
- Ejecución con `superpowers:subagent-driven-development`; cada worktree de un implementador ejecuta `pnpm install` en la raíz antes de los tests.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por task al quedar limpia su revisión.
- El hilo para los procesos que arranca por PID, nunca por nombre.

## Review Focus

- Una ruta con tildes o espacios (`D:\código\mi proyecto`) en `--project-root`, `--path` o el plan → el verbo la lee y la escribe igual que el script; los `.ps1` lo resolvían forzando UTF-8 · T4, `next id reads a project path with accents and spaces`.
- Ficheros con CRLF (los de Windows) en roadmap, capacidades y walkthroughs → el parser los lee igual que con LF y la fusión conserva el fin de línea del fichero · T2, `merge keeps CRLF endings`; T3, `check accepts a CRLF roadmap`.
- Un verbo ejecutado desde un hook de git (el pre-commit exporta `GIT_INDEX_FILE`) → opera sobre el repo que se le pasa, no sobre el del hook · T4, `next id ignores inherited GIT_INDEX_FILE`.
- La salida redirigida a un fichero o tubería desde Git Bash → sale en UTF-8 con «—» y tildes, sin depender de la página de códigos · T1, `writes utf-8 when stdout is a pipe`.
- `sdd task done` con un comando que lleva comillas y espacios desde PowerShell (`pwsh -NoProfile -Command "Invoke-Pester -Path tests/Foo.Tests.ps1 -CI"`) → el comando recibe los argumentos tal cual y la línea del ledger lo muestra entrecomillado como el bash · T10, `done keeps quoted arguments intact`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un módulo por dominio, sin framework de CLI; `parseArgs` de `node:util`.
- [x] **YAGNI gate**: sin capa de plugins ni configuración de la CLI; el registro de verbos es un objeto literal.
- [x] **Brownfield gate**: misma salida que los scripts (paridad) salvo la decisión 7 de la spec; nada fuera del Scope.
- [x] **Constitution check**: Art. I (humo en T13), Art. III (mensajes en castellano), Art. IX (aviso MIT en T10), Art. X (bloque «De código»), Art. XI (ADR 0011 en T12).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.prototools` — `node = "26.10.0"`, `pnpm = "12.9.1"`, `moon = "2.6.0"`.
- `package.json` (raíz, privado, `packageManager: "pnpm@12.9.1"`), `pnpm-workspace.yaml` (`packages: [cli]`), `pnpm-lock.yaml`.
- `.moon/workspace.yml` (proyectos `cli` y `kit`), `.moon/toolchains.yml` (node y pnpm desde proto), `cli/moon.yml`, `moon.yml` (raíz, proyecto `kit`).
- `cli/package.json`, `cli/tsconfig.json` (`erasableSyntaxOnly`, `allowImportingTsExtensions`, `noEmit`, `strict`, `module: nodenext`), `cli/vitest.config.ts`.
- `cli/bin/sdd.js`, `cli/bin/node-version.js`.
- `cli/src/main.ts`, `cli/src/cli/{args,io,verbs}.ts` y un directorio por dominio (lo fija cada task).
- `cli/test/**` y `cli/test/fixtures/**` (las de `tests/fixtures/` se mueven en la task que las usa).
- `.docs/sdd/decisions/0011-node-cli.md`.

**Modificar**:

- `.githooks/pre-commit`, `hooks/hooks.json`, `.gitignore` (`node_modules/`, `.moon/cache/`).
- `skills/**` (llamadas), `.docs/sdd/capabilities/*.md` (barrido), `README.md`, `THIRD_PARTY_NOTICES.md`, `.docs/sdd/{architecture,tech-stack,constitution}.md`.

**Borrar** (T11): `skills/sdd-templates/scripts/*.ps1`, `hooks/session-start`, `tests/{Build-EstimationLog,Get-CapabilityIndex,Get-NextSddId,Invoke-SddMerge,Measure-SessionTokens,Merge-CapabilityDelta,Test-Capabilities,Test-Roadmap,Watch-SubagentSilence,Hook,DispatchBrief,FinalReviewPackage,GitEnvConvention}.Tests.ps1` y `tests/fixtures/` cuando quede vacía.

**NO se tocan**:

- `tests/headless/` — el lanzador de sujetos; su futuro lo decide T14 y lo hace la 0152.
- `.claude/hooks/Test-KitSessionSource.ps1` — hook de este repo, no del kit.
- Los `*.Tests.ps1` de frases y anatomía, salvo los literales que nombran scripts.

### 1.6 Dependencias

`typescript` ^7.0.2 y `vitest` ^5.0.3 como `devDependencies` de `cli/`. Ninguna de runtime.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Claude Code no sustituye `${CLAUDE_PLUGIN_ROOT}` en `args` de un hook en forma exec | media | alto: proyectos sin `using-sdd` | smoke con `--plugin-dir` en T9, antes de borrar el bash; si falla, forma shell `node "${CLAUDE_PLUGIN_ROOT}/…"` sin `"shell": "bash"` |
| Un port pierde un caso de borde que el Pester no cubría | media | medio | paridad sobre los documentos reales de este repo, no solo fixtures |
| Vitest 5 no corre en Node 22.18.0 | baja | medio | `cli:test-min` en T1; si falla, es un desvío (cambia el mínimo de Node o el runner) y se para a decidirlo |
| `pnpm install` olvidado en un worktree | alta | bajo | el encargo lo dice; `moon` lo hace como dependencia de `cli:test` |

### 1.8 Rollout

Directo, con la 3.0.0. La nota de migración (Node obligatorio) es de la 0144.

### 1.9 Excepciones a la constitution

Ninguna. El Art. X se ajusta en T12 por la decisión 21 de la spec.

---

## 2. Tasks

### Task 1 — Herramientas, esqueleto de la CLI y pre-commit

**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet` — fija las interfaces que usan las otras 13.
**Tests RED**: hilo principal · `cli/test/cli.test.ts` (THEN de «La CLI se ejecuta…», «Node demasiado viejo…», «Un verbo, una opción o un valor fuera de tope…»).
**Superficies**: tooling.
**Verificación**: `pnpm install` · `moon run cli:typecheck cli:test` · `proto run node 22.18.0 -- node cli/bin/sdd.js --help` (sale 0).

**Interfaces**:
- Consume: nada.
- Produce:
  - `cli/bin/node-version.js`: `export function nodeVersionProblem(version: string): string | null` → `null` si ≥ 22.18.0; si no, `sdd necesita Node 22.18 o posterior; tienes <version>`.
  - `cli/src/cli/io.ts`: `interface Io { out(line: string): void; err(line: string): void; json(value: unknown): void }`, `processIo(): Io` (escribe UTF-8 en `process.stdout` y `process.stderr`), `memoryIo(): Io & { stdout: string[]; stderr: string[] }` para los tests.
  - `cli/src/cli/verbs.ts`: `interface Verb { noun: string; verb?: string; summary: string; options: ParseArgsOptionsConfig; positionals?: string[]; run(args: VerbArgs, io: Io): Promise<number> }`, `type VerbArgs = { values: Record<string, unknown>; positionals: string[] }`, `const VERBS: Verb[]`. Cada task siguiente añade sus verbos aquí.
  - `cli/src/cli/args.ts`: `class UsageError extends Error`; `parseVerbArgs(verb: Verb, argv: string[]): VerbArgs` (lanza `UsageError`).
  - `cli/src/main.ts`: `export async function run(argv: string[], io: Io): Promise<number>` — `--help` sin verbo lista `sdd <noun> <verb>  <summary>` por verbo; `UsageError` → stderr con el mensaje y `uso: sdd <noun> <verb1>|<verb2> …`, código 2.
  - Opción común `--json` declarada por cada verbo que la admite.

**Ficheros**: crear los de 1.1 de herramientas, `cli/bin/*`, `cli/src/main.ts`, `cli/src/cli/*`; modificar `.githooks/pre-commit`, `.gitignore`.

- [ ] **Step 1: Implementación** — `bin/sdd.js`: `nodeVersionProblem(process.versions.node)`; si da texto, stderr y `process.exit(2)`; si no, `const { run } = await import('../src/main.ts')` y `process.exitCode = await run(process.argv.slice(2), processIo())`. Mientras no haya verbos reales, T1 registra uno de prueba solo en los tests. Tests:
  - `help lists every registered verb` — `run(['--help'], io)` → 0 y una línea por verbo de un `VERBS` de prueba.
  - `rejects node 20.11.0` — `nodeVersionProblem('20.11.0') === 'sdd necesita Node 22.18 o posterior; tienes 20.11.0'`; `nodeVersionProblem('22.18.0') === null`; `nodeVersionProblem('26.10.0') === null`.
  - `bin exits 2 on old node without loading src` (slow) — lanza `bin/sdd.js` con `--import` de un módulo que simula `process.versions.node = '20.11.0'`; stderr con el mensaje, código 2, sin `SyntaxError`.
  - `unknown verb exits 2` — `run(['capability','lista'])` → 2 y stderr contiene `lista` y `uso: sdd capability`.
  - `unknown option exits 2` — `run(['capability','index','--ruta','x'])` → 2 y stderr contiene `--ruta`.
  - `writes utf-8 when stdout is a pipe` (slow) — `bin/sdd.js` de un verbo de prueba que escribe «— día» leído por tubería como UTF-8.
  - `package has no runtime dependencies` — `cli/package.json` sin clave `dependencies`.
- [ ] **Step 2: Herramientas** — `.prototools`, workspace, `moon.yml` con tareas `cli:typecheck` (`tsc --noEmit -p cli`), `cli:test` (`vitest run --exclude '**/*.slow.test.ts'`), `cli:test-slow`, `cli:test-min` (`proto run node 22.18.0 -- vitest run`), `kit:test-fast` (el `Invoke-Pester … -ExcludeTagFilter Slow` de hoy), `kit:test`, `kit:roadmap` (de momento `pwsh -NoProfile -File skills/sdd-templates/scripts/Test-Roadmap.ps1 -Path .docs/sdd/roadmap.md`). Pre-commit: sin `moon` en el `PATH`, `Commit bloqueado: falta moon; instálalo con «proto install» en la raíz del repo` y sale con 1; si no, `moon run cli:typecheck cli:test kit:test-fast kit:roadmap`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 2 — `sdd capability index|check|merge`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/capability/index.test.ts` (THEN de «Los verbos de datos dan JSON…»), `cli/test/parity/capability.parity.slow.test.ts`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test` · `pnpm --filter @sdd-kit/cli exec vitest run test/parity/capability.parity.slow.test.ts`.

**Interfaces**:
- Consume: `Verb`, `Io`, `VERBS` (T1).
- Produce: `cli/src/capabilities/sections.ts` (el parser de `CapabilitySections.ps1`: `readCapability(path: string): Capability`, `readDelta(artifactPath: string): Delta[]`); verbos `capability index` (`--path`, `--json`), `capability check` (`--path`, `--artifact`, `--json`), `capability merge` (`--path`, `--artifact`). JSON del índice: `[{ "name": string, "purpose": string | null }]`. JSON de `check`: `{ "valid": number, "errors": string[] }`.

**Ficheros**: `cli/src/capabilities/*.ts`, `cli/test/capability/*.test.ts`, mover `tests/fixtures/capabilities/` a `cli/test/fixtures/capabilities/` (y actualizar las rutas en los Pester que aún la usan).

- [ ] **Step 1: Implementación** — portar `CapabilitySections.ps1`, `Get-CapabilityIndex.ps1`, `Test-Capabilities.ps1` y `Merge-CapabilityDelta.ps1` con sus casos de `Get-CapabilityIndex.Tests.ps1`, `Test-Capabilities.Tests.ps1` y `Merge-CapabilityDelta.Tests.ps1`, uno a uno, a `cli/test/capability/`. Tests del hilo:
  - `index json` — fixture `bookings.md` + `rooms.md` → stdout `[{"name":"bookings","purpose":"Reservar, consultar y cancelar salas por franja horaria."},{"name":"rooms","purpose":null}]`, código 0.
  - `index text` — mismas dos líneas que hoy.
  - `merge keeps CRLF endings` — una capacidad con CRLF fusionada sigue con CRLF.
  - Paridad: cada verbo y su `.ps1` sobre `cli/test/fixtures/capabilities/` y sobre `.docs/sdd/` de este repo → mismo stdout y mismo código.
- [ ] **Step 2: Build** — `moon run cli:typecheck`.
- [ ] **Step 3: Verificación**.
- [ ] **Step 4: Commit de la task**.

### Task 3 — `sdd roadmap check`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/parity/roadmap.parity.slow.test.ts`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test kit:roadmap` · la paridad.

**Interfaces**:
- Consume: T1.
- Produce: verbo `roadmap check` (`--path`, `--json`); JSON `{ "valid": boolean, "errors": string[], "warnings": string[] }`. `kit:roadmap` pasa a `node cli/bin/sdd.js roadmap check --path .docs/sdd/roadmap.md`.

**Ficheros**: `cli/src/roadmap/check.ts`, sus tests; mover `tests/fixtures/roadmap-structure/`; `moon.yml`.

- [ ] **Step 1: Implementación** — portar `Test-Roadmap.ps1` con los casos de `Test-Roadmap.Tests.ps1`. Test añadido: `check accepts a CRLF roadmap`. Paridad sobre la fixture y sobre `.docs/sdd/roadmap.md`.
- [ ] **Step 2–4**: build, verificación, commit.

### Task 4 — Cerrojo y `sdd id next`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/parity/id.parity.slow.test.ts`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test` · `pnpm --filter @sdd-kit/cli exec vitest run test/ids test/parity/id.parity.slow.test.ts`.

**Interfaces**:
- Consume: T1.
- Produce: `cli/src/git/git.ts`: `git(cwd: string, args: string[]): Promise<GitResult>` con el entorno `GIT_*` limpio y salida UTF-8; `worktrees(cwd: string): Promise<Worktree[]>` (`{ path, branch | null }`); `commonDir(cwd: string): Promise<string>`. `cli/src/git/lock.ts`: `withLock<T>(lockPath: string, label: string, timeoutMinutes: number, io: Io, body: () => Promise<T>): Promise<T>` con los mensajes de `SddLock.ps1` (`Esperando el cerrojo de <label>: lo tiene …`, `Cerrojo huérfano: lo tenía …`, `cerrojo: no se libera; lo tiene …`). Verbo `id next` (`--project-root`, `--reserve`, `--count` 1–99, `--lock-timeout` por defecto 2, `--json`); JSON `{ "ids": string[], "reserved": boolean }`.

**Ficheros**: `cli/src/git/*.ts`, `cli/src/ids/next.ts`, tests; mover `tests/fixtures/task-ids/`.

- [ ] **Step 1: Implementación** — portar `SddLock.ps1` y `Get-NextSddId.ps1` con los casos de `Get-NextSddId.Tests.ps1` (slow). Tests añadidos: `next id reads a project path with accents and spaces`, `next id ignores inherited GIT_INDEX_FILE` (el test exporta `GIT_INDEX_FILE` a un fichero ajeno y comprueba que no cambia), `count 0 exits 2`. Paridad sobre las fixtures de `task-ids/`.
- [ ] **Step 2–4**.

### Task 5 — `sdd estimation log`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/parity/estimation.parity.slow.test.ts`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test` · la paridad.

**Interfaces**:
- Consume: T1.
- Produce: verbo `estimation log` (`--root`, `--out`); `buildEstimationLog(root: string): string` en `cli/src/estimation/log.ts` (lo usa T6).

**Ficheros**: `cli/src/estimation/*.ts`, tests; mover `tests/fixtures/estimation-log/`.

- [ ] **Step 1: Implementación** — portar `Build-EstimationLog.ps1` con los 70 casos de su Pester. Paridad sobre las fixtures y sobre la raíz de este repo (mismo `estimation-log.md` byte a byte).
- [ ] **Step 2–4**.

### Task 6 — `sdd merge`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/parity/merge.parity.slow.test.ts`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test` · `pnpm --filter @sdd-kit/cli exec vitest run test/merge`.

**Interfaces**:
- Consume: `git`, `worktrees`, `commonDir`, `withLock` (T4); `buildEstimationLog` (T5).
- Produce: verbo `merge` (`--project-root`, `--branch`, `--push`, `--verify`, `--lock-timeout` por defecto 30); `cli/src/merge/temp-worktree.ts`: `withTempWorktree<T>(repo: string, branch: string, body: (path: string) => Promise<T>): Promise<T>` (nombre corto junto a los demás worktrees, se retira siempre) — lo usa T7. Cerrojo en `<commonDir>/sdd-merge.lock`, etiqueta `merge`.

**Ficheros**: `cli/src/merge/*.ts`, tests.

- [ ] **Step 1: Implementación** — portar `Invoke-SddMerge.ps1` con los 23 casos de su Pester. `--verify` se ejecuta con el shell del sistema (como hoy con `pwsh -NoProfile -Command`: en Windows `pwsh`, en otros `sh -c`). Paridad sobre repos de prueba creados por el test.
- [ ] **Step 2–4**.

### Task 7 — `sdd roadmap publish` (0049)

**Modelo**: `sdd-kit:effort-high` + `sonnet` — git en worktrees reales sin código previo.
**Tests RED**: hilo · `cli/test/roadmap/publish.slow.test.ts`, un test por THEN de «La reserva se publica antes de arrancar».
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck` · `pnpm --filter @sdd-kit/cli exec vitest run test/roadmap`.

**Interfaces**:
- Consume: `git`, `worktrees`, `withLock` (T4); `withTempWorktree` (T6).
- Produce: verbo `roadmap publish` (`--message`, `--into`, `--project-root`, `--lock-timeout` por defecto 30, posicionales: ficheros).

**Ficheros**: `cli/src/roadmap/publish.ts`, tests.

- [ ] **Step 1: Implementación** — algoritmo: (1) valida que cada fichero está bajo `.docs/sdd/` y que hay rama (`--into` o `merge.into` de `.docs/sdd/sdd-kit.json`), si no código 2; (2) toma `sdd-merge.lock` con etiqueta `merge`; (3) para cada fichero, si `git diff --quiet <merge-base> <into> -- <f>` da cambios, `<into> cambió <f> desde tu base: integra <into> antes de publicar` y 1; (4) busca el worktree con `<into>` sacada; si tiene cambios en algún fichero, `destino con cambios: <f> en <worktree>` y 1; (5) copia los ficheros, `git add -- <ficheros>` y `git commit -m <message> -- <ficheros>` en ese worktree o en `withTempWorktree`. Tests del hilo, con `develop` como integración y los mensajes exactos de la spec:
  - `publishes into the worktree where develop is checked out` — un commit con el mensaje que solo toca `roadmap.md`, con el contenido de la sesión.
  - `publishes proposal in the same commit`.
  - `uses a temp worktree when develop is not checked out` — el commit existe y no queda el worktree temporal.
  - `waits for the merge lock then publishes` — un cerrojo de un PID vivo liberado a los 2 s.
  - `gives up when the lock is not released` — `--lock-timeout 0.05` → 1, `cerrojo: no se libera`, `develop` sin cambios.
  - `refuses when develop changed the file since the base` → 1 y el mensaje exacto.
  - `refuses a dirty target` → 1 y `destino con cambios: .docs/sdd/roadmap.md en <ruta>`.
  - `exits 2 without integration branch` y `exits 2 for a path outside .docs/sdd`.
- [ ] **Step 2–4**.

### Task 8 — `sdd session tokens` y `sdd watch subagent|command`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/parity/session.parity.slow.test.ts`.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test` · la paridad.

**Interfaces**:
- Consume: T1.
- Produce: `cli/src/session/transcripts.ts` (`TranscriptPaths.ps1`); verbos `session tokens` (`--path`, `--branch`, `--projects-root` repetible, `--json`) y `watch subagent` (`--description`, `--worktree`, `--projects-root`, `--once`) / `watch command` (`--path`, `--once`). JSON de `tokens`: el objeto con los campos de las tres líneas de hoy.

**Ficheros**: `cli/src/session/*.ts`, `cli/src/watch/*.ts`, tests; mover `tests/fixtures/session-tokens/`.

- [ ] **Step 1: Implementación** — portar `TranscriptPaths.ps1`, `Measure-SessionTokens.ps1` y `Watch-SubagentSilence.ps1` con los casos de sus Pester; el vigía con temporizadores falsos de Vitest (`vi.useFakeTimers`). Paridad de `tokens` sobre las fixtures.
- [ ] **Step 2–4**.

### Task 9 — `sdd hook session-start` y `hooks.json`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/hook/session-start.test.ts` (THEN de «El hook de sesión es un verbo de la CLI») y las fixtures `cli/test/fixtures/hook/*.json`, generadas por el hilo con el `hooks/session-start` bash antes de despachar.
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck cli:test`; el smoke con `--plugin-dir` lo hace el hilo tras la revisión.

**Interfaces**:
- Consume: T1.
- Produce: verbo `hook session-start` (sin opciones; lee `CLAUDE_PROJECT_DIR` o el directorio actual, y la raíz del plugin desde la ruta de `bin/sdd.js`). Exento de la comprobación de versión de `bin/sdd.js`: con Node < 22.18.0, `bin/sdd.js` delega en `bin/session-start.js` (JS plano) en vez de salir con 2.

**Ficheros**: `cli/src/hook/session-start.ts`, `cli/bin/session-start.js`, `hooks/hooks.json`, tests y fixtures.

- [ ] **Step 1: Implementación** — `bin/session-start.js` es JS plano y hace todo el hook (es pequeño y tiene que correr en cualquier Node); `src/hook/session-start.ts` lo reexporta para el registro de verbos. Fixtures: `pending-migration.json` (proyecto 2.2.0, kit 3.0.0, migraciones hasta 2.3.0), `outdated-kit.json` (kit menor que el proyecto), `up-to-date.json`, y `no-sdd` sin salida. Tests: cada fixture byte a byte; `old node adds the warning` → mismo JSON con `sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0` en `systemMessage`, código 0; `missing files do not break the hook` (sin `sdd-kit.json`, sin carpeta de migraciones). `hooks.json`: `{"type":"command","command":"node","args":["${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js","hook","session-start"]}`, matcher `startup|clear|compact`.
- [ ] **Step 2–4**. Después de la revisión, el hilo ejecuta el smoke headless con `--plugin-dir` (~0,03 $) y apunta en `tasks.md` el `hook_response`; si la variable no se sustituye en `args`, aplica la mitigación de 1.7 como ruling.

### Task 10 — Verbos de los bash de superpowers y `sdd ledger rulings`

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/tasks/native.slow.test.ts` (THEN de «Las tasks Native se abren y cierran desde cualquier shell»), `cli/test/tasks/rulings.test.ts` (THEN de «Los rulings del ledger se cosechan…»).
**Superficies**: tooling.
**Verificación**: `moon run cli:typecheck` · `pnpm --filter @sdd-kit/cli exec vitest run test/tasks`.

**Interfaces**:
- Consume: `git` (T4).
- Produce: `workspaceFor(plan: string): Promise<string>` en `cli/src/tasks/workspace.ts`; verbos `workspace <plan>`, `task start <plan> <n>`, `task done <plan> <n> <base> -- <comando…>`, `task brief <plan> <n> [out]`, `review package <plan> <base> <head> [out]`, `ledger rulings <plan> [--json]`. Mismo workspace, ledger y textos (en inglés) que superpowers 6.4.2, salvo: rutas en la forma del sistema, `→ (sin salida)` cuando el comando no imprime nada, 127 si el comando no existe.

**Ficheros**: `cli/src/tasks/*.ts`, tests, `THIRD_PARTY_NOTICES.md` (superpowers 6.4.2, MIT: `task-start`, `task-done`, `task-brief`, `review-package`, `sdd-workspace`).

- [ ] **Step 1: Implementación** — portar los cinco bash de `skills/executing-plans/scripts/` y `skills/subagent-driven-development/scripts/` de superpowers 6.4.2, con los casos de su `tests/claude-code/test-executing-plans-scripts.sh` y `test-sdd-workspace.sh`, y los de `tests/DispatchBrief.Tests.ps1` y `tests/FinalReviewPackage.Tests.ps1` de este repo. `task done` ejecuta el comando con `spawn(cmd, args)` sin shell; en Windows resuelve `.cmd`/`.exe` por `PATHEXT`. Tests del hilo:
  - `start prints a windows path` (solo en win32) — la ruta empieza por letra de unidad.
  - `done records a silent command` — comando que no imprime nada → ledger con `→ (sin salida)`.
  - `done does not record a failing command` — sale con su código y el ledger no tiene `Task 1: complete`.
  - `done exits 127 for a missing command`.
  - `done keeps quoted arguments intact` — `-- node -e "console.log(process.argv[1])" "a b"` → imprime `a b`.
  - `start fails without a plan` — código distinto de 0 y sin ruta en stdout.
  - `rulings lists rulings and deferred minors in ledger order` — las tres líneas de la spec, en orden.
  - `rulings without ledger` → `Sin rulings`, código 0.
- [ ] **Step 2–4**.

### Task 11 — Las skills y las capacidades pasan a los verbos; se borran los scripts

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: hilo · `cli/test/docs-claims.test.ts` (THEN de «Las skills solo nombran verbos que existen»).
**Superficies**: docs, tooling.
**Verificación**: `moon run cli:typecheck cli:test kit:test-fast kit:roadmap`.

**Interfaces**:
- Consume: `VERBS` completo (T1-T10).
- Produce: ningún `.ps1` del kit ni `hooks/session-start`.

**Ficheros**: `skills/**/SKILL.md`, `skills/**/references/*.md`, `skills/sdd-templates/templates/*.md`, `skills/sdd-init-brownfield/references/migrations/v{1.0.0,2.0.0,2.3.0}.md`, `.docs/sdd/capabilities/*.md`, `CLAUDE.md` (cita `Test-Roadmap.ps1`), los `*.Tests.ps1` de frase que citan scripts; borrar lo de «Borrar» en 1.1 y los `cli/test/parity/`.

- [ ] **Step 1: Implementación** — en cada `SKILL.md`, `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/<Script>.ps1" <params>` pasa a `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo> <opciones>` con las tablas 4 y 5 de la spec; en `references/` y plantillas, `sdd <verbo>` sin ruta. En el paso 6 de `sdd-start-feature` y en sus referencias, las frases de Git Bash/WSL, `cygpath` y `sh -c '… && echo ok'` salen, y `task-start`/`task-done` pasan a `sdd task start`/`sdd task done`. Paso 1 de `sdd-end-feature`: ejecutar `sdd ledger rulings <plan>` antes de que el workspace se borre. Paso 6 de `sdd-roadmap`: `sdd roadmap publish`. Barrido literal de `capabilities/` (decisión 13 de la spec) y fusión del delta de `feature-flow` y `release-flow` no: la fusión es del cierre. Test del hilo: `docs-claims` con la extracción, los literales prohibidos y las exclusiones de la spec.
- [ ] **Step 2–4**.

### Task 12 — Documentos: README, tech-stack, architecture, constitution y ADR 0011

**Modelo**: `sdd-kit:effort-medium` + `sonnet`.
**Tests RED**: ninguno nuevo; los Pester de documentos (`WorkflowDocs`, `WordBudget`, `Skills`) en verde.
**Superficies**: docs.
**Verificación**: `moon run kit:test-fast`.

**Interfaces**: Consume: nada. Produce: nada.

**Ficheros**: `README.md` (Node ≥ 22.18.0 obligatorio en «Dependencias»; fuera `npx skills add`), `.docs/sdd/tech-stack.md` («Contenido y build» y «Distribución» reescritos: CLI, proto/moon/pnpm, Vitest, sin canal `npx`), `.docs/sdd/architecture.md` (estructura con `cli/`; «Scripts portables» reescrito), `.docs/sdd/constitution.md` (Art. X: «El bloque de ayuda de `Get-Help`» → «La ayuda de `--help`»), `.docs/sdd/decisions/0011-node-cli.md` (MADR mínima como la 0001: contexto, decisión, alternativas descartadas —PowerShell, JS plano con `node:test`, Bun, TypeScript con build—, consecuencias, `rutas: cli/**`).

- [ ] **Step 1–4**.

### Task 13 — Humo de las skills editadas (Art. I)

**Modelo**: el hilo; sujetos Sonnet n = 1 con el lanzador de `tests/headless/`.
**Superficies**: docs (evidencia).
**Verificación**: `tests/cli-smoke-green.md` con un escenario por skill de la decisión 23 de la spec, cada uno con el comando visto en el stream y su código.

- [ ] **Step 1**: molde mínimo por skill en el scratchpad; plugin por `--plugin-dir` sobre una copia limpia del worktree.
- [ ] **Step 2**: lanzar los 10 sujetos (tandas de 5) y anotar coste; si se pasa de 12 $ en total con T14, parar.
- [ ] **Step 3**: evidencia y commit.

### Task 14 — Evaluación de `claude plugin eval`

**Modelo**: el hilo.
**Superficies**: docs (research).
**Verificación**: `research.md` en la carpeta de la spec con veredicto por escenario de los dos arneses, coste y recomendación.

- [ ] **Step 1**: pasar a `evals/` los escenarios de `tests/batteries/using-sdd/battery.md` con graders `tool_used` (la skill invocada) y `regex`.
- [ ] **Step 2**: `claude plugin eval . --runs 2 --model sonnet --max-cost-usd 4 --json` y `battery.sh` con los mismos escenarios y n.
- [ ] **Step 3**: `research.md` y commit (los `evals/` se quedan si la recomendación es sustituir; si no, se borran).

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2.5h
- Estimación de implementación: 12-18h (punto medio 15h)
- Base de la estimación: 14 tasks, 10 de ellas ports con contrato escrito (~330 casos Pester), 2 de comportamiento nuevo con git, 2 de evidencia; el log da mediana real/estimado 0,49 en las 10 últimas, pero los ports son código y no guidance, así que no aplico el factor entero.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo: `pnpm install` · `moon run cli:typecheck cli:test cli:test-slow cli:test-min kit:test kit:roadmap`.
- [ ] Smoke con una fila por THEN de la spec, con su evidencia (`suite`, `ejecución real` o `no probado`); los THEN de CLI e hook, con ejecución real.
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre con `sdd-end-feature` (validación en campo).

---

## 4. Self-review (cobertura spec → tasks)

- `cli`: La CLI se ejecuta con Node y sin dependencias → T1. ✓
- `cli`: Node demasiado viejo → T1. ✓
- `cli`: Un verbo, una opción o un valor fuera de tope → T1 (y `count 0` en T4). ✓
- `cli`: Los verbos de datos dan JSON → T2 (y `--json` en T3, T4, T8, T10). ✓
- `cli`: El hook de sesión es un verbo → T9. ✓
- `cli`: Las skills solo nombran verbos que existen → T11. ✓
- `feature-flow`: Rulings cosechados → T10 (verbo), T11 (paso 1 de `sdd-end-feature`). ✓
- `feature-flow`: MODIFIED minors diferidos → T10, T11. ✓
- `feature-flow`: MODIFIED task Native en el ledger → T10, T11. ✓
- `feature-flow`: Tasks Native desde cualquier shell → T10. ✓
- `feature-flow`: REMOVED ×2 → T11 (frases fuera de la skill). ✓
- `release-flow`: MODIFIED reserva publicada → T7 (verbo), T11 (paso 6 de `sdd-roadmap`). ✓
- Decisiones 1-3 (herramientas) → T1; 9 (`npx`), 20 (ADR), 21 (Art. X) → T12; 14 (paridad) → T2-T9; 18 (migraciones viejas) → T11; 19 → T14; 23 → T13. ✓
- Review Focus → T1, T2, T3, T4, T10 con sus tests nombrados. ✓
