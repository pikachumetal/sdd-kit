---
id: 20261020-115102-feature-0203-single-id-sequence
feature: 0203
title: Plan de implementación — Ids, una sola numeración y el push a la integración como árbitro
spec: ./spec.md
status: approved
created: 2026-10-20
---

# Plan de implementación — Ids, una sola numeración y el push a la integración como árbitro

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, sin subagentes de implementación; la sesión implementa las cuatro tasks. Los sujetos de la campaña van en Sonnet con `tests/headless/battery.sh`. La revisión final va en ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`, Arquitectura `sdd-kit:effort-high` + `opus`. — Las tasks comparten interfaces (`renumber`, `claimIds`) y el plan cabe en un contexto.
2. **Ejecución**: native; ver la línea `Ejecución`.
3. **Decisiones técnicas que la spec no fija**:
   - el claim vive en `cli/src/ids/claim.ts`, la renumeración pura en `cli/src/ids/renumber.ts` y las reservas sin publicar en `cli/src/ids/unpublished.ts`;
   - reutiliza `remoteForBranch`, `fetchBase`, `syncBaseBranch`, `unpublishedCommits`/`unpublishedLines`, `remoteMoved` de `cli/src/merge/steps.ts`, `withTempWorktree` y `withLock`;
   - `roadmap check` recibe el modo leyendo `sdd-kit.json` junto al `--path` (`kitConfigPath`).
4. **Riesgos altos**: la carrera fetch → push en los tests lentos (hooks del *bare* en Windows con Git Bash); la renumeración por líneas en un `develop` que ya integró el remoto.
5. **Coste estimado**: ~6 h de implementación; campaña ~20 sujetos y ~16 $ (spec, «Previsión de la prueba»); revisión final ~3 ejes, ~300k tokens.
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el arranque reclama el id contra `origin/<merge.into>` con `sdd id claim`, y el roadmap numera con una sola secuencia.

**Architecture**: un verbo nuevo en `cli/src/ids/` que compone piezas existentes de `cli/src/merge/` (fetch, sync con limpieza de registros, push, cerrojo, worktree temporal) con dos módulos puros nuevos (reservas sin publicar y renumeración). Las skills de arranque lo invocan antes de crear la carpeta. `roadmap check` y las plantillas pasan Later a la secuencia.

**Tech Stack**: CLI `sdd` en TypeScript sin build (Node ≥ 22.18.0, solo `node:*`), Vitest; skills en Markdown con campaña de sujetos headless.

**Spec**: `./spec.md`

**Ejecución**: native, porque 4 tasks encadenadas por las interfaces de `renumber` y `claimIds`, un error lo caza el test lento de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — verbo nuevo con un contrato con el remoto (push de la integración y etiquetas `sdd-id/*`) y un módulo que consume `cli/src/merge/`.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés; funciones ≤ 20 líneas y ≤ 3 parámetros; early returns; sin duplicación; mensajes en castellano con tildes.
- Todo código que llame a git limpia `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`, `GIT_COMMON_DIR` y `GIT_OBJECT_DIRECTORY` (ya lo hace `cli/src/git/git.ts`: usarlo).
- Sin `dependencies`; solo módulos `node:*`.
- Todo test que cree repos git va en `*.slow.test.ts`.
- Los literales de salida son los de la spec, decisión 10, sin variar una letra.

### De proceso

- Native: la sesión implementa; TDD por task (RED primero); un commit por task al quedar limpia su revisión.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Campañas de skill: Art. I, RED con el kit de `develop` y GREEN con la rama; sujetos Sonnet por tandas de hasta 3.

## Review Focus

- `sdd id claim` desde una rama sin id (`feature/fix-sala`) y sin `--id` → falla con `--id: la rama 'feature/fix-sala' no lleva id; pásalo con --id` (código 2, `UsageError`) · Task 3, `requires an id when the branch has none`
- Una fila renumerada cuya celda «Tras» lista varios ids (`0197, 0203`) → solo cambia el `0203` · Task 2, `rewrites one id inside a Tras list`
- `develop` no está en ningún worktree → el claim usa uno temporal y lo borra al terminar · Task 3, `claims from a temporary worktree when develop is checked out nowhere`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se reutilizan fetch/sync/push/cerrojo de `sdd merge`; dos módulos nuevos pequeños.
- [x] **YAGNI gate**: sin opciones fuera de la spec (`--json` no se añade).
- [x] **Brownfield gate**: `sdd id next` y `roadmap publish` no cambian su contrato salvo las etiquetas en el escaneo.
- [x] **Constitution check**: Art. I (campaña en Tasks 1 y 4), Art. X, Art. XI.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/ids/unpublished.ts` — ids que añaden los commits de `develop` no publicados, e ids de una ref.
- `cli/src/ids/renumber.ts` — reescritura pura de un id en las líneas de un roadmap o `debt.md`.
- `cli/src/ids/claim.ts` — el verbo: intentos, vuelta atrás, etiqueta, rama.
- `cli/test/ids/renumber.test.ts`, `cli/test/ids/claim.slow.test.ts`.

**Modificar**:

- `cli/src/ids/scan.ts` — cuenta `refs/tags/sdd-id/*`; exporta `branchContentIds` y `BRANCH_ID`.
- `cli/src/ids/verbs.ts` — `idClaimVerb`; `cli/src/cli/verbs.ts` — lo registra.
- `cli/src/roadmap/now-next-later.ts`, `check.ts`, `duplicates.ts` — reglas de id por modo y `0000`.
- `cli/test/roadmap/now-next-later.test.ts`, `duplicates.test.ts`, `cli/test/ids/next.slow.test.ts`.
- `skills/sdd-templates/templates/now-next-later-template.md`, `roadmap-template.md`, `skills/sdd-templates/SKILL.md`.
- `skills/sdd-roadmap/SKILL.md`, `skills/sdd-propose/SKILL.md`, `skills/sdd-start-patch/SKILL.md`, `skills/sdd-start-feature/references/nombrado.md`, `skills/sdd-upgrade/references/migrations/v3.0.0.md`.
- `.docs/workflow/usage-guide.md`, `tests/WordBudget.Tests.ps1`.

**NO se tocan**:

- `cli/src/roadmap/publish.ts` — sigue sin push (spec, decisión 18).
- `skills/sdd-upgrade/references/migrations/v2.3.0.md` — migración publicada.
- `.docs/sdd/roadmap.md` de este repo, salvo el cierre — su Backlog es de la 0198.

### 1.6 Dependencias

Mergiraf ya obligatorio para la suite (`syncBaseBranch` lo usa si está).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Hooks `pre-receive` del *bare* no ejecutan en Windows | baja | alta | el patrón ya funciona en `push-retry.slow.test.ts` (`core.hooksPath` + `chmod`) |
| Renumerar toca una línea del otro | media | alta | regla «línea tal cual en `origin`» con test unitario y escenario sincronizado |
| Tope de 120 s en los lentos | media | media | un solo `mergeFixture`-like por test, como `push-retry` |

### 1.8 Rollout

Directo: entra en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Later y Backlog con id de la secuencia

**Tras**: —
**Modelo**: Native, la sesión.
**Tests RED**: hilo principal · `cli/test/roadmap/now-next-later.test.ts`, `cli/test/roadmap/duplicates.test.ts`; campaña `id3` (RED n = 1).
**Superficies**: tooling · docs (skills y plantillas)
**Verificación**: `pnpm --filter cli exec vitest run test/roadmap` → `Tests  N passed (N)`; `moon run kit:test-fast` → sin fallos; `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1 -CI"` → `Failed: 0`.
**Se prueba en la aplicación**: no, porque es una regla del validador y de la skill de planificación; se ve en la campaña `id3`.

**Interfaces**:
- Consume: `readIdsMode(root)` de `cli/src/ids/scan.ts` (hoy privada: exportarla) y `kitConfigPath`.
- Produce: `nowNextLaterProblems(lines: string[], changelogText: string, mode: 'sequence' | 'tracker'): string[]`.

**Ficheros**: `cli/src/roadmap/now-next-later.ts`, `check.ts`, `duplicates.ts`, `cli/src/ids/scan.ts`, tests de roadmap; `now-next-later-template.md` (`:15` nota del Id: «el de la feature o del patch (`<id>`), también en Later, de la misma reserva; en `tracker`, el del ticket o `0000`»; `:41` fila de ejemplo con `<id>`); `roadmap-template.md:26` («con un id de la reserva, como el resto del roadmap; los `B<n>` anteriores se quedan hasta la migración v3.0.0»); `sdd-roadmap/SKILL.md` (tabla `:23` sin `B<n>`; paso 1 `:37` «A Later row gives no prompt: say it is in Later and that raising it to Next writes its brief»; paso 4 `:52` «Later and Backlog rows enter the same reservation; in `tracker`, a Later row without ticket takes `0000`»; `:71` «of Later, with its id, if it is not decided … Raising a Later row to Next keeps its id and writes its brief and size»; paso 6 añade «For another clone the reservation is provisional until its task starts and `sdd id claim` publishes it»); `migrations/v3.0.0.md:57-58` (Backlog y Decisiones abiertas → Later con ids de una reserva `sdd id next --reserve --count N` en el orden en que aparecen, en `tracker` `0000`).

- [ ] **Step 1: RED** — en `now-next-later.test.ts`: `rejects a B<n> id in Later in sequence` → `'ROADMAP.md: línea 22: el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve'`; `accepts a sequence id in Later` (fila `0020` sin fallo); `rejects — and 0000 in sequence`; `rejects B<n> in tracker` → `'ROADMAP.md: línea 22: el id «B3» ya no se usa: usa el del ticket o 0000'`; `accepts 0000 in Later in tracker`; se borran los dos asserts viejos (`:93`, `:108`). En `duplicates.test.ts`: `does not warn a repeated 0000`. Campaña `id3` RED con el kit de `develop`.
- [ ] **Step 2: Implementación** — `idProblems(id, kind, mode)`: en `sequence`, `/^\d{4}$/` y ≠ `0000`, si no el mensaje de secuencia; en `tracker`, solo `/^B\d+$/` falla. `check.ts` lee el modo con `readIdsMode` del directorio padre de `.docs/sdd` (raíz del proyecto) y lo pasa. `duplicates.ts` filtra `0000`. Textos de skill y plantillas como en «Ficheros».
- [ ] **Step 3: Verificación** — los comandos de arriba; campaña `id3` GREEN n = 2 y humo de `sdd-roadmap` (un escenario de su batería).
- [ ] **Step 4: Commit de la task** — `feat(roadmap): Later y Backlog con id de la secuencia, sin B<n>`.

### Task 2 — Reservas sin publicar, renumeración y etiquetas en el escaneo

**Tras**: Task 1
**Modelo**: Native, la sesión.
**Tests RED**: hilo principal · `cli/test/ids/renumber.test.ts`, `cli/test/ids/next.slow.test.ts` (etiqueta).
**Superficies**: tooling
**Verificación**: `pnpm --filter cli exec vitest run test/ids` → `Tests  N passed (N)`; `moon run cli:typecheck` → sin errores.
**Se prueba en la aplicación**: no, porque es base común del claim.

**Interfaces**:
- Consume: `rowIds`, `branchContentIds` de `scan.ts`.
- Produce:
  - `renumberLines(lines: string[], change: { from: string; to: string }, remoteLines: Set<string>): string[]` en `renumber.ts`;
  - `unpublishedIds(root: string, into: string, remote: string): Promise<string[]>` en `unpublished.ts` — ids que añaden (líneas `+` de filas y carpetas nuevas) los commits de `git log --no-merges <remote>/<into>..<into>`;
  - `refIds(root: string, ref: string): Promise<string[]>` en `unpublished.ts` — `branchContentIds` exportada con otro nombre.

**Ficheros**: crear `renumber.ts`, `unpublished.ts`, `renumber.test.ts`; modificar `scan.ts` (añade a `usedIds` los de `git tag --list 'sdd-id/*'`), `next.slow.test.ts`.

- [ ] **Step 1: RED** — `renumber.test.ts`:
  - `rewrites the row id`: `'| 0203 | — | **X** | ⏳ | 0197 | L |'` → `'| 0205 | — | **X** | ⏳ | 0197 | L |'`;
  - `rewrites the dated row id`: `'| 2026-10-01 | 0203 | …'` → `'| 2026-10-01 | 0205 | …'`;
  - `rewrites tras, parent and Tras`: `'| 0204 | — | **Otra** tras 0203, \`parent: 0203\` | ⏳ | 0203 | M |'` → los tres a `0205`;
  - `rewrites one id inside a Tras list`: «Tras» `0197, 0203` → `0197, 0205`;
  - `rewrites Actuar and the debt Destino`: `'… | **Actuar → 0203** (…) |'` y `'| x | y | bajo | z | 0203 |'` → `0205`;
  - `keeps prose and remote lines`: `'… en la 0203 se vio …'` no cambia; una línea igual a una de `remoteLines` no cambia.
  - `next.slow.test.ts`: `counts sdd-id tags` — con `git tag sdd-id/0090` y ningún id mayor, `id next` → `0091`.
- [ ] **Step 2: Implementación** — `renumberLines` reescribe solo en líneas ausentes de `remoteLines`, con estas regex sobre `from` como palabra entera: celda de id (`^\|\s*(?:\d{4}-\d{2}-\d{2}\s*\|\s*)?from\s*\|`), celdas «Tras»/«Destino» (celda cuyo contenido es una lista de ids que incluye `from`), `tras from`, `parent: from`, `Actuar → from`.
- [ ] **Step 3: Verificación** — los comandos de arriba.
- [ ] **Step 4: Commit de la task** — `feat(ids): reservas sin publicar, renumeración y etiquetas sdd-id en el escaneo`.

### Task 3 — El verbo `sdd id claim`

**Tras**: Task 2
**Modelo**: Native, la sesión.
**Tests RED**: hilo principal · `cli/test/ids/claim.slow.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --filter cli exec vitest run test/ids/claim.slow.test.ts` → `Tests  N passed (N)`; `moon run cli:typecheck cli:test` → sin fallos.
**Verificación lenta**: omitir.
**Se prueba en la aplicación**: `node cli/bin/sdd.js id claim --help` lista sus opciones; el resto, en los tests con remoto *bare*.

**Interfaces**:
- Consume: `renumberLines`, `unpublishedIds`, `refIds` (Task 2); `consumeIds`, `counterPath`, `assertSequenceMode` (`ids/`); `remoteForBranch`, `fetchBase`, `syncBaseBranch`, `unpublishedCommits`, `unpublishedLines` (`merge/steps.ts`); `withTempWorktree`, `withLock`, `worktrees`.
- Produce: `claimIds(options: ClaimOptions, io: Io): Promise<string>` con `ClaimOptions = { projectRoot: string; id: string | null; into: string | null; lockTimeoutMinutes: number }`; `idClaimVerb` (`noun: 'id'`, `verb: 'claim'`, `summary: 'Reclama el id de la tarea contra la integración del remoto (ids.mode=sequence)'`).

**Ficheros**: crear `claim.ts`, `claim.slow.test.ts`; modificar `ids/verbs.ts`, `cli/verbs.ts`; exportar `consumeIds` de `next.ts`.

- [ ] **Step 1: RED** — `claim.slow.test.ts`, fixture: *bare* `origin`, clon `repo` con `develop` y `.docs/sdd/sdd-kit.json` en `sequence`, worktree de `feature/0203-single-id-sequence`, y un segundo clon `other`. Un test por cláusula; nombres y asserts:
  - `publishes the reservation`: salida contiene `id: 0203 es tuya; publicada en origin/develop`; `sha(origin,'develop') === sha(repo,'develop')`; rama en la `develop` publicada; código 0.
  - `lists the other unpublished reservations`: con la `0204` también local → `push: también publica 1 commit de 'develop' que no es de la 0203:` antes de `- <hash> <asunto>`.
  - `is idempotent`: segunda ejecución → `id: 0203 ya estaba en origin/develop; nada que publicar`, sin cambio en `origin`.
  - `refuses a dirty develop worktree`: → `destino con cambios: <ruta>; límpialo y relanza sdd id claim`, código 1, nada cambia.
  - `renumbers when another clone published the id`: `other` publica la `0203`; → `id: la 0203 ya la tiene otro en origin/develop; la 0203 pasa a 0205`, `rama: feature/0203-single-id-sequence → feature/0205-single-id-sequence`, `worktree: la carpeta sigue en <ruta>`; commit `chore(roadmap): la 0203 pasa a 0205`; la `0204` con `tras 0205`, `parent: 0205`, «Tras» `0205`; deuda `Actuar → 0205`; la fila `0203` de `other` intacta en `origin`; contador `0205`.
  - `renumbers after develop already merged the remote`: `git merge origin/develop` en `repo` antes del claim → mismo resultado.
  - `renumbers every taken reservation`: la `0204` también en `other` → `… la 0204 pasa a 0206` y commit `chore(roadmap): la 0203 pasa a 0205, la 0204 pasa a 0206`.
  - `keeps the branch with own commits` / `keeps the branch when the target exists` / `does not fast-forward a dirty branch`: los tres literales de la decisión 9.
  - `rechecks when the remote moved before the push`: hook `pre-receive` del *bare* que la primera vez hace `git update-ref refs/heads/develop <commit de other con la 0203>` y rechaza → renumera a `0205` con un solo commit y publica.
  - `gives up after 3 attempts`: el hook avanza `develop` y rechaza siempre → `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza sdd id claim en un rato`, código 1, `develop` local igual que antes, contador no baja.
  - `rolls back on a merge conflict`: conflicto al integrar → código 1, `develop` igual que antes.
  - `fixes the id with a tag when develop is protected`: hook que rechaza sin mover → `push: 'develop' no admite push directo; id fijado con la etiqueta sdd-id/0203`; `git ls-remote --tags origin sdd-id/0203` no vacío; relanzado → `id: 0203 ya fijada con la etiqueta sdd-id/0203`.
  - `renumbers when the tag belongs to another clone`: `other` empuja `sdd-id/0203` → renumera y empuja `sdd-id/0205`.
  - `takes the moved path when protected and moved`: hook que avanza y rechaza → camino de reintento, no etiqueta.
  - `keeps the local counter without a remote` → `sin remoto: la 0203 vale (contador local)`, código 0, contador sin tocar.
  - `skips the remote in a subfolder project` → `sin comprobar en el remoto: la raíz del proyecto no es la del repositorio; la 0203 vale (contador local)`.
  - `checks a branch id without a row`: `patch/0176-fast-suite-budget`, contador `0179` → `id: 0176 libre en origin/develop`, sin push ni etiqueta, contador `0179`; con `0176` en `origin` → `id: la 0176 ya la tiene otro en origin/develop; la 0176 pasa a 0180`, rama `patch/0180-fast-suite-budget`, sin commit en `develop`.
  - `rejects tracker`: aviso de `tracker` por stderr, código 1.
  - `requires an id when the branch has none` (Review Focus) y `claims from a temporary worktree when develop is checked out nowhere` (Review Focus).
- [ ] **Step 2: Implementación** — `claim.ts`: `claimIds` resuelve id (de `--id` o `BRANCH_ID` de la rama actual; si falta, `UsageError`), modo, remoto y subcarpeta; toma el cerrojo de `sdd merge` (`sdd-merge.lock`) y trabaja en el worktree de `into` (o `withTempWorktree`), comprobando `git status --porcelain` vacío. Guarda `before = rev-parse into`. Bucle de 3 intentos: `reset --hard before` · fetch con `+refs/tags/sdd-id/*:refs/tags/sdd-id/*` · `taken = unpublishedIds ∩ refIds(origin/into)` (con fila) o `id ∈ escaneo ∪ refIds(origin/into)` (sin fila) · por cada id tomado `consumeIds` y `renumberLines` en los roadmaps y `debt.md` con `remoteLines` de `git show origin/into:<fichero>` · un commit de chore · `syncBaseBranch` · push → `pushed` | `moved` (reintenta) | `protected` (etiqueta). Fallo: `reset --hard before` y relanzar el error. Después, rama: `branch -m` y `merge --ff-only into` según la decisión 9. Funciones ≤ 20 líneas: una por fase.
- [ ] **Step 3: Verificación** — los comandos de arriba.
- [ ] **Step 4: Commit de la task** — `feat(ids): sdd id claim reclama el id contra la integración del remoto`.

### Task 4 — El claim en las skills de arranque

**Tras**: Task 3
**Modelo**: Native, la sesión; sujetos Sonnet.
**Tests RED**: campaña `id1`, `id2`, `id4` (RED n = 1, con el kit de `develop`).
**Superficies**: docs (skills)
**Verificación**: campaña GREEN `id1`, `id2`, `id4` n = 2; tramo `a1` y `a3` de `tests/batteries/sdd-propose/`; humo de `sdd-start-patch`; `moon run kit:test-fast` → sin fallos; `Invoke-Pester tests/WordBudget.Tests.ps1 -CI` → `Failed: 0`.
**Se prueba en la aplicación**: no, porque son skills; se ve en la campaña.

**Interfaces**:
- Consume: `sdd id claim` y sus literales (Task 3).
- Produce: nada.

**Ficheros**: `skills/sdd-propose/SKILL.md` paso 3: «**Branch** — … In `sequence`, before the folder run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" id claim --project-root "<root>"`: it checks the id against the remote integration and publishes it; if it says `la <id> pasa a <nuevo>`, the folder and everything after use the new id, and you repeat that line to the user» y red flag «In `sequence`, you created the folder without running `sdd id claim`»; `skills/sdd-start-patch/SKILL.md` paso 2 (claim con fila y sin fila; sin fila, el id de la rama si lo lleva); `nombrado.md:7` (tercera fuente, claim, provisional); `skills/sdd-templates/SKILL.md` fila `sdd id claim`; `.docs/workflow/usage-guide.md:201`; `tests/WordBudget.Tests.ps1` (`sdd-propose = @{ SkillMd = 5250; Total = 6800 }`, `Kit = 87900`); molde y escenarios `id1`, `id2`, `id4` en la carpeta de la spec (`red/`, `green/`) y `tests/sdd-ids-claim-red.md`/`-green.md`.

- [ ] **Step 1: RED** — campaña `id1`, `id2`, `id4` con el kit de `develop`; se apunta qué hace cada sujeto (crea la carpeta con el id provisional; reserva otro id con la rama ya numerada).
- [ ] **Step 2: Implementación** — los textos de «Ficheros».
- [ ] **Step 3: Verificación** — GREEN, tramo, humo y los comandos de arriba; REFACTOR si un escenario falla (una tanda incluida).
- [ ] **Step 4: Commit de la task** — `feat(skills): el arranque reclama el id con sdd id claim`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 6h
- Base de la estimación: 4 tasks; la 3 es el grueso (verbo con remoto y ~20 tests lentos, como la 0187 de `sdd merge`); campaña de ~20 sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- `feature-ids` · reserva al planificar en Now/Next/Later y provisional → Task 1 (`sdd-roadmap` paso 4 y 6) y campaña `id3`. ✓
- `feature-ids` · el escaneo cuenta etiquetas (THEN y AND `0091`) → Task 2, `counts sdd-id tags`. ✓
- `feature-ids` · «Al arrancar…» THEN y sus 4 AND → Task 3, `publishes the reservation`, `lists the other unpublished reservations`, `is idempotent`, `refuses a dirty develop worktree`. ✓
- `feature-ids` · «Si otro publicó antes…» THEN y sus 5 AND → Task 3, `renumbers when another clone published the id`, `renumbers after develop already merged the remote`, `renumbers every taken reservation`, los tres de la rama; Task 2, `keeps prose and remote lines`. ✓
- `feature-ids` · «Si el push se rechaza…» THEN y 3 AND → Task 3, `rechecks when the remote moved before the push`, `gives up after 3 attempts`, `rolls back on a merge conflict`. ✓
- `feature-ids` · «Con la integración protegida…» THEN y 3 AND → Task 3, `fixes the id with a tag…`, `renumbers when the tag belongs…`, `takes the moved path…`. ✓
- `feature-ids` · «Sin remoto…» → Task 3, `keeps the local counter without a remote`, `skips the remote in a subfolder project`. ✓
- `feature-ids` · «Sin fila…» → Task 3, `checks a branch id without a row`; Task 4, campaña `id2`. ✓
- `feature-ids` · `tracker` con `claim` y código 1 → Task 3, `rejects tracker`. ✓
- `feature-ids` · id sin fila de la rama; claim antes de la carpeta → Task 4, `id1`, `id2`, `id4`. ✓
- `feature-ids` · «La reserva precede…» AND de la rama con id → Task 4, `id2`. ✓
- `feature-ids` · Reglas (datos, idioma, límites, avisos, conflicto) → Tasks 2-3 (etiqueta, literales, 3 intentos, contador que no baja en `gives up after 3 attempts`). ✓
- `roadmap` · filas de `ROADMAP.md` (B3 en Later, secuencia, `tracker`, `0000`) → Task 1, los cinco tests. ✓
- `roadmap` · id repetido sin `B<n>` y `0000` → Task 1, `does not warn a repeated 0000`. ✓
- `planning` · Later con id de la reserva, subir conserva el id, «dame el prompt de la 0015» → Task 1, campaña `id3` (dos turnos). ✓
- `migration` · v3.0.0 Later con ids de la reserva → Task 1, texto de `v3.0.0.md`; sin sujeto: la migración cierra con `sdd roadmap check` (spec, «Previsión»). ⚠ observado solo por el `check`
- `cli` · `--help` lista `id next|claim` → Task 3, test de `--help` existente (`cli/test/cli/`) con `id claim` añadido. ✓
- Tabla «Lo que se retira…» → Tasks 1 y 4 (cada sitio listado en sus «Ficheros»). ✓
- Review Focus → Task 3, `requires an id when the branch has none`, `claims from a temporary worktree…`; Task 2, `rewrites one id inside a Tras list`. ✓
