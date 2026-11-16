---
id: 20261108-184209-feature-0313-tasks-superpowers-7
feature: 0313
title: Plan de implementación — cli/src/tasks al día con los scripts de superpowers 7.0.2
spec: ./spec.md
status: approved
created: 2026-11-08
---

# Plan de implementación — `cli/src/tasks` al día con los scripts de superpowers 7.0.2

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: implementador y revisor de cada task, `sdd-kit:effort-medium` + `sonnet`: tocan varios ficheros con su integración (repo, verbos, workspace) y el plan lleva firmas, literales y tests. La revisión final, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: SDD. Esta sesión ya se compactó una vez antes del plan, y la regla de Native la mandaría a subagentes con dos tasks pendientes. Además, la Task 2 usa `requireRepo` de la Task 1, y un contexto limpio por task sale más barato que seguir en este.
3. Dos tasks, no las tres que preveía la parada de la spec: la entrada de `upstream.json` solo vale con todo portado, así que va al final de la Task 2 (configuración dentro de la task cuyo entregable la necesita).
4. `writeBrief` resuelve el workspace antes de la comprobación de `tasks.md`, como la fuente (`sdd-workspace` antes de awk), para cumplir el orden de la decisión 11 de la spec (repo antes que `tasks.md`). Con OUTFILE no pide repo.
5. El escaneo del plan es un port línea a línea del awk de `task-brief` v7.0.2: una función pura que devuelve lo capturado, la cuenta de tasks, los encabezados con forma de task y el estado del último bloque abierto. `writeBrief` decide con eso.
6. Los avisos de `writeBrief` vuelven en el resultado (`warnings`), y los verbos los escriben en stderr: `writeBrief` no tiene `io`.
7. `capabilities/cli.md` no se toca en las tasks: el delta lo fusiona `sdd-archive`.
8. Coste: ~1,5 h de implementación; subagentes, 2 implementadores y 2 revisores sonnet (~2-3 $) y la revisión final (~3 $).
9. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: portar a `cli/src/tasks/` los 15 cambios «se trae» de `v6.4.2..v7.0.2`, cada uno con un test que falla hoy, y subir su entrada de `upstream.json` a v7.0.2.

**Architecture**: un resolvedor del repo nuevo (`repo.ts`) para los cinco verbos y la opción `-C` como `process.chdir` en el `run` del verbo. El escaneo del plan de `brief.ts` se reescribe como port del awk de la fuente. Ni módulos ni dependencias nuevas.

**Tech Stack**: TypeScript sin dependencias (ADR 0011), `node:util` `parseArgs`, Vitest en `cli/`, `moon run kit:notices`, `kit:build` y `kit:upstream`.

**Spec**: `./spec.md`

**Ejecución**: subagent, porque esta sesión se compactó antes del plan y quedan dos tasks, la Task 2 consume `requireRepo` de la Task 1, un error que llegue a la rama rompe los verbos que usan todas las skills de implementación, y un contexto limpio por task cabe mejor que este.

**Eje Arquitectura**: no — un fichero nuevo dentro de `cli/src/tasks/` y cambios en sus verbos; ni módulo, ni dependencia, ni contrato entre módulos, ni datos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
- Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Sin dependencias nuevas: Node y `node:*` (ADR 0011).
- Los mensajes nuevos, literales como los fija la spec; los que ya existen (`bad BASE: …`, `task N not found in … (no heading matching 'Task N')`, `usage: …`, `plan with N tasks and no tasks.md: …`) no cambian.
- Códigos de salida: la parada fuera de un repo o sin commits y el `-C` no válido, 2 (`UsageError`); el bloque sin cerrar, 1 (`DomainError`).
- `dist/`, `THIRD_PARTY_NOTICES.md` y los `NOTICE` no se editan a mano: salen de `moon run kit:notices` y `moon run kit:build`.

### De proceso

- Política de modelos: la de la spec (✋, «Política de modelos») y la decisión 1 de este plan; `fable` y `opus xhigh`, prohibidos.
- Método: SDD (`sdd-implement-subagent`).
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task; trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- `-C` con una ruta relativa → se resuelve desde el directorio actual del que llama, y la ruta del plan desde el directorio de `-C` · Task 1, `a relative -C resolves from the current directory`.
- Plan con finales de línea CRLF y un bloque sin cerrar → la línea que cita el mensaje es la misma que con LF · Task 2, `cites the same fence line in a CRLF plan`.
- `sdd task brief plan.md a1` con `## Task A1` en el plan → no la encuentra: el id distingue mayúsculas · Task 2, `compares ids case-sensitively`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un fichero nuevo (`repo.ts`); `-C` es un `chdir` y no una firma nueva en cuatro módulos.
- [x] **YAGNI gate**: `requireRepo` tiene 5 usos reales (los cinco verbos); nada más se abstrae.
- [x] **Brownfield gate**: los mensajes y códigos existentes no cambian; `ledger rulings` no toma `-C` (no lo tiene la fuente).
- [x] **Constitution check**: Art. I (test primero, falla con el port de hoy), Art. III (mensajes en castellano), Art. V (registro de fuentes al día), Art. X (código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/tasks/repo.ts` — dónde trabajan los verbos de tasks: `-C` y el repo del directorio actual, con o sin commit.
- `cli/test/tasks/repo.slow.test.ts` — `-C`, la parada fuera de un repo o sin commits y el `.gitignore`, con el binario.
- `cli/test/tasks/task-ids.slow.test.ts` — los ids nuevos y los inválidos en `task start|brief|done`, y el aviso del bloque en stderr, con el binario.
- `.docs/sdd/specs/20261108-184209-feature-0313-tasks-superpowers-7/tasks.md` — registro vivo.

**Modificar**:

- `cli/src/tasks/workspace.ts` — la raíz sale de `requireRepo('repo')`; `.gitignore` solo si no existe.
- `cli/src/tasks/verbs.ts` — opción `directory` (`-C`) en `workspace`, `task brief` y `review package`; `requireRepo('commit')` en `task start`; validación del id con la gramática nueva; avisos a stderr.
- `cli/src/tasks/done.ts`, `cli/src/tasks/package.ts` — `requireRepo('commit')` antes de nada.
- `cli/src/tasks/brief.ts` — escaneo del plan portado del awk de v7.0.2: ids, sub-tasks, bloque sin cerrar y pista de plan traducido.
- `cli/test/tasks/brief.test.ts` — casos de ids, sub-tasks, bloques y pista.
- `upstream.json` — la entrada de `cli/src/tasks/` a `v7.0.2` con `sdd-repo`; `THIRD_PARTY_NOTICES.md` y `dist/` regenerados.

**NO se tocan**:

- `skills/sdd-verify/references/encargo-revision.md` — decisión 3 de la spec.
- `cli/src/session/timing.ts` — fuera de alcance (spec, Scope).
- `.docs/sdd/capabilities/cli.md` — el delta lo fusiona `sdd-archive`.

### 1.6 Dependencias

- Fuente: `D:\code\github\upstream\superpowers`, tag `v7.0.2` (`skills/subagent-driven-development/scripts/task-brief` y `sdd-repo`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `process.chdir` en un test que llama a `run()` en proceso cambia el cwd de Vitest | baja | medio | los tests de `-C` van con el binario (`sdd()` del harness) |
| El directorio temporal del sistema cae dentro de un repo y la prueba «fuera de un repo» no sale de él | baja | alto | `GIT_CEILING_DIRECTORIES` con el padre del directorio de prueba |

### 1.8 Rollout

Directo: sale con la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Resolvedor del repo, `-C` y `.gitignore`

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; revisor de la task, el mismo.
**Tests RED**: hilo principal · `cli/test/tasks/repo.slow.test.ts`, escritos antes de despachar y sin commitear: van en el commit de la task.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/tasks/repo.slow.test.ts test/tasks/workspace.slow.test.ts test/tasks/executing.slow.test.ts test/tasks/brief.test.ts test/tasks/done.test.ts --test-timeout 120000` → `Test Files  5 passed (5)`; `npx tsc --noEmit -p .` sin errores.
**Se prueba en la aplicación**: no, porque es una CLI sin aplicación; lo observa el binario en los tests.

**Interfaces**:
- Consume: `git(cwd, args): Promise<GitResult>` de `cli/src/git/git.ts` (`{ code, stdout, stderr }`); `UsageError` y `text(args, name)` de `cli/src/cli/args.ts`; `VerbArgs` de `cli/src/cli/verbs.ts`.
- Produce, en `cli/src/tasks/repo.ts`:
  - `export const DIRECTORY_OPTION = { directory: { type: 'string', short: 'C' } } as const`
  - `export function enterDirectory(args: VerbArgs): void` — sin la opción no hace nada; si el directorio no existe o no es un directorio, `throw new UsageError(\`directorio de -C no válido: ${dir}\`)`; si no, `process.chdir(dir)`.
  - `export async function requireRepo(need: 'repo' | 'commit'): Promise<string>` — devuelve la raíz del working tree de `process.cwd()` con `resolve()`, como `toplevel`. Fuera de un repo, o con `'commit'` y sin `HEAD`, lanza `UsageError` con dos líneas: el mensaje de la variante y `git dijo: <primera línea del stderr de git>`. El stderr sale de `git rev-parse --show-toplevel` en `process.cwd()` o de `git rev-parse --verify HEAD` en la raíz.

Literales (`<dir>` es `process.cwd()`):

```text
Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y vuelve a lanzarlo.
Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas, con al menos un commit (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y un primer commit, y vuelve a lanzarlo.
git dijo: <primera línea del stderr de git>
directorio de -C no válido: <dir>
```

**Ficheros**: crear `cli/src/tasks/repo.ts`; modificar `cli/src/tasks/workspace.ts`, `cli/src/tasks/verbs.ts`, `cli/src/tasks/brief.ts`, `cli/src/tasks/done.ts`, `cli/src/tasks/package.ts`.

- [ ] **Step 1: Implementación**
  - `workspace.ts`: `planContext` toma la raíz de `requireRepo('repo')` (desaparece `fatal: not a git repository` y el import de `toplevel`); `workspaceFor` escribe `.gitignore` con `*\n` solo si `!existsSync`.
  - `verbs.ts`: `options: DIRECTORY_OPTION` en `workspaceVerb`, `taskBriefVerb` y `reviewPackageVerb`, y `enterDirectory(args)` como primera línea de su `run`. `taskStartVerb`: `await requireRepo('commit')` tras validar el id y antes de `writeBrief`. `taskStartVerb` y `taskDoneVerb` siguen con `options: {}`.
  - `brief.ts`: en `writeBrief`, la ruta (`request.out ?? join(await workspaceFor(plan), …)`) se resuelve antes de `requireTasksFile`.
  - `done.ts`: `finishTask` empieza con `await requireRepo('commit')`. `package.ts`: `writePackage` empieza con `await requireRepo('commit')`.
  - Tests de `repo.slow.test.ts` (con `sdd`, `sddWithEnv`, `emptyRepo`, `scratchDir`, `write`, `commitAll` y `git` del harness; `outside = scratchDir()` con `GIT_CEILING_DIRECTORIES: dirname(outside)`):
    - `workspace -C from the review worktree prints the feature workspace`: repo con `plan.md` commiteado, `git worktree add --detach <dirname(repo)>/review-0300-abc1234`; `sdd(review, 'workspace', '-C', repo, 'plan.md')` → `code 0`, `out.trim() === join(repo, '.temp', 'sdd', 'plan')`, `existsSync(join(review, '.temp', 'sdd')) === false`.
    - `task brief and review package with -C write into the same workspace`: segundo commit; `task brief -C repo plan.md 1` → `out` contiene `join(repo, '.temp', 'sdd', 'plan', 'task-1-brief.md')`; `review package -C repo plan.md <base> <head>` → `out` contiene `join(repo, '.temp', 'sdd', 'plan', 'review-')`.
    - `a relative -C resolves from the current directory`: `sdd(dirname(repo), 'workspace', '-C', basename(repo), 'plan.md')` → la misma ruta.
    - `--directory is the same as -C and --help shows it`: `workspace --directory repo plan.md` → la misma ruta; `--help` de `workspace`, `task brief` y `review package` → `out` contiene `[--directory <valor>]`.
    - `an -C that does not exist stops with 2 and writes nothing`: `code 2`, `err` contiene `directorio de -C no válido: ${missing}`, sin `.temp` en el cwd.
    - `task start and task done reject -C`: `code 2`, `err` contiene `opción desconocida: «-C»`.
    - `outside a repo the commit verbs stop with the commit message`: `review package plan.md HEAD~1 HEAD`, `task done plan.md 1 HEAD -- node -v` y `task start plan.md 1` → `code 2`, `err` contiene el literal «con al menos un commit» con `outside`, `err` casa con `/^git dijo: \S/m`, y `readdirSync(outside)` es `['plan.md']`.
    - `outside a repo workspace and task brief stop with the repo message`: `workspace plan.md` y `task brief plan.md 1` → `code 2`, el literal sin «commit», `git dijo:` y nada escrito.
    - `task brief with OUTFILE needs no repo`: `task brief plan.md 1 brief.md` fuera → `code 0` y `brief.md` existe.
    - `in a repo without commits the commit verbs stop`: `emptyRepo()` con `plan.md` sin commitear; `task start plan.md 1`, `task done plan.md 1 HEAD -- node -v`, `review package plan.md HEAD HEAD` → `code 2`, literal «con al menos un commit», y sin `.temp/sdd/plan/task-1-brief.md`.
    - `in a repo without commits workspace and task brief work`: `code 0` los dos.
    - `keeps an existing .temp/sdd/.gitignore`: con `*\n!*/progress.md\n` escrito antes, tras `workspace plan.md` el fichero sigue igual.
- [ ] **Step 2: Build** — `npx tsc --noEmit -p .` desde `cli/`. Esperado: sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(cli): -C y parada fuera de un repo en los verbos de tasks (0313)`.

### Task 2 — Ids, sub-tasks, bloque sin cerrar, pista de plan traducido y registro a v7.0.2

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`; revisor de la task, el mismo.
**Tests RED**: hilo principal · casos nuevos en `cli/test/tasks/brief.test.ts` y `cli/test/tasks/task-ids.slow.test.ts`, escritos antes de despachar y sin commitear: van en el commit de la task.
**Superficies**: tooling
**Verificación**: desde `cli/`, `npx vitest run test/tasks/brief.test.ts test/tasks/task-ids.slow.test.ts test/tasks/repo.slow.test.ts test/tasks/executing.slow.test.ts test/tasks/native.slow.test.ts test/kit/notices.test.ts --test-timeout 120000` → `Test Files  6 passed (6)`; `npx tsc --noEmit -p .` sin errores; desde la raíz, `moon run kit:notices` y `moon run kit:build`, y `moon run kit:upstream` sin ninguna línea que nombre `cli/src/tasks/` (sigue la de `skills/sdd-grilling/SKILL.md`).
**Se prueba en la aplicación**: no, porque es una CLI sin aplicación; lo observa el binario en los tests.

**Interfaces**:
- Consume: `requireRepo` de `cli/src/tasks/repo.ts` (Task 1), a través de `workspaceFor`.
- Produce, en `cli/src/tasks/brief.ts`:
  - `export function isTaskId(value: string): boolean` — `/^[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*$/` y al menos un dígito.
  - `export function scanPlan(planText: string, task: string): PlanScan`, con `interface PlanScan { picked: string[]; tasks: number; shaped: string[]; fence: { line: number; hidden: boolean } | null; inTask: boolean }`. `fence` es el bloque que sigue abierto al final, o `null`.
  - `writeBrief(request): Promise<{ path: string; lines: number; warnings: string[] }>`.

Algoritmo de `scanPlan`, port del awk de `task-brief` v7.0.2, línea a línea, con el número de línea desde 1:
1. Una línea que empieza por tres comillas invertidas alterna `inFence`; al abrir, `fence = { line, hidden: false }`; al cerrar, `fence = null`.
2. Dentro de un bloque, una línea `^#+[ \t]+Task[ \t]` pone `fence.hidden = true`.
3. Fuera, en una línea `^#+[ \t]+Task[ \t]`, el id es el prefijo `^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*` de lo que sigue a `Task` y espacios; si tiene un dígito, `tasks++`, y `depth` es el número de `#`. Es sub-task si `inTask && depth > level && id.startsWith(task) && /[A-Za-z.]/.test(id[task.length] ?? '')`. Si no es sub-task: `inTask = id === task` y `level = depth`.
4. Fuera de un bloque, una línea `^#+[ \t]+[^ \t]+[ \t]+[A-Za-z0-9.]*[0-9]` entra en `shaped` mientras tenga menos de 5.
5. Con `inTask`, la línea entra en `picked`.

Decisión de `writeBrief` (spec no lite; una spec lite sigue como hoy, entera y sin avisos), por orden: `fence?.hidden && inTask` → `DomainError(<oculta>)`, sin escribir; `picked` vacío → `DomainError` con, por líneas, `<oculta>` si `fence?.hidden`, la pista y los `shaped` con dos espacios delante si `tasks === 0 && shaped.length > 0 && !fence?.hidden`, y el «not found» de siempre; `fence && !fence.hidden && inTask` → `warnings = [<completo>]`. `requireTasksFile` cuenta con `scan.tasks`.

Literales (`<plan>` es la ruta tal como llega):

```text
el bloque de código abierto en la línea <n> de <plan> no se cierra y oculta los encabezados de task que le siguen: ciérralo en el plan y vuelve a lanzarlo
el bloque de código abierto en la línea <n> de <plan> no se cierra; no oculta ningún encabezado de task, así que el brief está completo
no hay encabezados de task: se escriben con la palabra inglesa «Task» («### Task 1: …») aunque el plan esté en otro idioma. Encabezados con forma de task:
```

**Ficheros**: modificar `cli/src/tasks/brief.ts`, `cli/src/tasks/verbs.ts`, `upstream.json`; regenerar `THIRD_PARTY_NOTICES.md` y `dist/`.

- [ ] **Step 1: Implementación**
  - `brief.ts`: `scanPlan` sustituye a `ANY_TASK`, `withFenceState`, `extractTask` y `countTasks`; `writeBrief` según la decisión de arriba.
  - `verbs.ts`: `taskNumber` pasa a `taskId(value, usage)` con `isTaskId`; `taskStartVerb` y `taskBriefVerb` escriben cada `warnings[i]` con `io.err`.
  - `upstream.json`: en la entrada `"kit": ["cli/src/tasks/"]`, `"version": "v7.0.2"` y `"skills/subagent-driven-development/scripts/sdd-repo"` al final de `paths`; después `moon run kit:notices` y `moon run kit:build`.
  - Tests de `brief.test.ts` (`writeBrief` con `out`, plan en un directorio temporal con `tasks.md`):
    - `briefs only the requested id`: plan con `## Task 6`, `## Task 6b`, `## Task A1`, `## Task Overview`, `## Task 2`, `## Task 2.1`; el brief de `6b` empieza por `## Task 6b` y no tiene otro `## Task`; el de `6` no contiene `## Task 6b`; el de `2`, no `## Task 2.1`; el de `A1` contiene `## Task Overview`.
    - `keeps a deeper sub-task that extends the id`: `### Task 7`, `#### Task 7a`, `### Task 8`, `### Task 1`, `#### Task 12`; `7` contiene `#### Task 7a`; `1` no contiene `#### Task 12`.
    - `compares ids case-sensitively`: `a1` con `## Task A1` → `rejects.toThrow(/task a1 not found/)`.
    - `refuses a brief an unclosed fence would run on`: la `## Task 1` abre en la línea 7 un bloque sin cerrar y después viene `## Task 2`; `1` → `rejects.toThrow` con el literal «oculta» y `línea 7 de <plan>`, y `existsSync(out) === false`; `2` → el mensaje casa con `/oculta los encabezados[^\n]*\ntask 2 not found in /`.
    - `cites the same fence line in a CRLF plan`: el mismo plan con `\r\n` → `línea 7`.
    - `warns on a stray fence that hides no task`: `## Task 1` y `## Task 2` con bloques cerrados y una última línea con solo tres comillas invertidas dentro de la Task 2; `2` → `warnings` igual a `[<completo> con su línea>]`; `1` → `warnings` igual a `[]`.
    - `lists task-shaped headings of a translated plan`: `## Tarea 1: Login`, `## Tarea 2: Logout` → el mensaje es exactamente la pista, `  ## Tarea 1: Login`, `  ## Tarea 2: Logout` y `task 1 not found in <plan> (no heading matching 'Task 1')`, por líneas; con seis `## Tarea N`, solo cinco con dos espacios delante.
    - `opens a lite spec whole without the hint`: `mode: lite` con `## Fase 1` → resuelve y el brief es la spec entera.
  - Tests de `task-ids.slow.test.ts` (repo con commits, plan con `## Task 6b` y `## Task 7` y `tasks.md`):
    - `task start, brief and done accept 6b`: `task start plan.md 6b` → `code 0`, `out` contiene `task-6b-brief.md`; `task brief plan.md 6b` → `code 0`; tras un commit, `task done plan.md 6b <base> -- node -v` → `code 0` y `out` contiene `Task 6b: complete`.
    - `rejects ids without a digit, with other characters or a dot at the edge`: para `Overview`, `6*` y `6.`, `task start|brief|done` → `code 2` y `err` contiene `usage: sdd task <verbo>`.
    - `task brief prints the stray-fence warning on stderr`: `code 0` y `err` contiene `no oculta ningún encabezado de task`.
- [ ] **Step 2: Build** — `npx tsc --noEmit -p .` desde `cli/`; `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(cli): ids de task, bloque sin cerrar y plan traducido en task brief, y superpowers a v7.0.2 (0313)`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 1,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks con firmas y tests fijados en el plan; el port del awk es lo único con algoritmo; referencia, la 0297 (registro de fuentes) y los verbos de tasks.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `moon run kit:upstream` sin `cli/src/tasks/`; cada «se trae» con su test.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `-C`, THEN (ruta, 0, sin `.temp` en el worktree de revisión) → Task 1, `workspace -C from the review worktree…`. ✓
- `-C`, AND brief y package en el mismo workspace, plan desde el directorio → Task 1, `task brief and review package with -C…`. ✓
- `-C`, AND `--directory` y `--help` → Task 1, `--directory is the same as -C…`. ✓
- `-C`, AND directorio que no existe → Task 1, `an -C that does not exist…`. ✓
- `-C`, AND `task start` y `task done` → Task 1, `task start and task done reject -C`. ✓
- Parada, THEN de los verbos con commit fuera de un repo → Task 1, `outside a repo the commit verbs stop…`. ✓
- Parada, AND `workspace` y `task brief` → Task 1, `outside a repo workspace and task brief stop…`. ✓
- Parada, AND OUTFILE sin repo → Task 1, `task brief with OUTFILE needs no repo`. ✓
- Parada, AND repo sin commits (y sin brief de `task start`) → Task 1, `in a repo without commits the commit verbs stop`. ✓
- Parada, AND `workspace` y `task brief` sin commits → Task 1, `in a repo without commits workspace and task brief work`. ✓
- Ids, THEN `6b` → Task 2, `briefs only the requested id`. ✓
- Ids, AND `6`, `2`, `A1` → Task 2, `briefs only the requested id`. ✓
- Ids, AND sub-tasks `7a` y `12` → Task 2, `keeps a deeper sub-task that extends the id`. ✓
- Ids, AND los tres verbos aceptan y rechazan → Task 2, `task start, brief and done accept 6b` y `rejects ids without a digit…`. ✓
- Bloque, THEN error de la Task 1 sin brief → Task 2, `refuses a brief an unclosed fence would run on`. ✓
- Bloque, AND la línea antes del «not found» → Task 2, el mismo test, caso `2`. ✓
- Bloque, AND aviso y 0 → Task 2, `warns on a stray fence…` (`writeBrief`) y `task brief prints the stray-fence warning on stderr` (el verbo). ✓
- Bloque, AND sin aviso para la Task 1 → Task 2, `warns on a stray fence…`, caso `1`. ✓
- Plan sin `Task`, THEN la pista, la lista y el «not found» → Task 2, `lists task-shaped headings of a translated plan`. ✓
- Plan sin `Task`, AND cinco como mucho → Task 2, el mismo test, seis encabezados. ✓
- Plan sin `Task`, AND la spec lite entera → Task 2, `opens a lite spec whole without the hint`. ✓
- `.gitignore`, THEN conserva sus líneas → Task 1, `keeps an existing .temp/sdd/.gitignore`. ✓
- `.gitignore`, AND sin fichero lo crea con `*` → `workspace.slow.test.ts`, `creates a self-ignoring .gitignore…`, que ya existe y corre en la Verificación de la Task 1. ✓
- Reglas de la capacidad (Límites, Avisos, Regla ante conflicto) → las fusiona `sdd-archive`; los valores los observan los tests de arriba. ✓
- «Lo que se retira»: `fatal: not a git repository` → Task 1, `outside a repo workspace…`; id solo con dígitos → Task 2, `task start, brief and done accept 6b`; `.gitignore` reescrito → Task 1, `keeps an existing…`; entrada `v6.4.2` → Task 2, `kit:upstream` y `notices.test.ts`. ✓
- Review Focus → Task 1, `a relative -C…`; Task 2, `cites the same fence line in a CRLF plan` y `compares ids case-sensitively`. ✓
