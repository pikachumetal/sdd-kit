---
id: 20261019-092924-feature-0193-better-merge
feature: 0193
title: Plan de implementación — Merge mejor que el de git por defecto
spec: ./spec.md
status: approved
created: 2026-10-19
---

# Plan de implementación — Merge mejor que el de git por defecto

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la sesión implementa las 5 tasks; los sujetos de la prueba de `sdd-archive` (Task 3), `sonnet` con `sdd-kit:effort-medium`, como la batería; revisión final por `sdd-verify` (Spec y Arquitectura `opus` + `sdd-kit:effort-high`, Código `sonnet` + `sdd-kit:effort-high`).
2. **Ejecución**: Native (ver cabecera).
3. **La cadena de resolución devuelve lo que queda**: `resolveConflicts` devuelve los ficheros sin resolver y solo commitea si no queda ninguno; `completeMergeAttempt` aborta con ellos. Así Mergiraf recibe solo lo que el kit no resolvió.
4. **Un registro que la unión por id no resuelve cae en la unión de trozos que solo añaden** (la de hoy) antes de Mergiraf: nunca resuelve menos que hoy.
5. **Líneas sin id en un trozo de registro** (encabezados, texto): la unión por id exige que sean las mismas, en el mismo orden, en los dos lados; si no, devuelve `null` y cae en el punto 4.
6. **Fila nueva de la rama**: se inserta tras su ancla, la línea que la precede en el lado de la rama y existe en el resultado (por id, o por texto si no tiene id), detrás de las nuevas de la destino que cuelgan de esa ancla; sin ancla, al principio del trozo.
7. **zdiff3 no se observa tras un abort**: el AND «un conflicto que llega a una persona lleva las marcas de `zdiff3`» se fija con un test unitario de los argumentos de `git merge` (`mergeArgs`) y otro de la reescritura `--conflict=zdiff3`; no hay fichero con marcas que mirar después del `merge --abort`.
8. **`PATH` sin `mergiraf` en los tests**: un helper quita de `process.env.PATH` las carpetas que contienen `mergiraf`/`mergiraf.exe` mientras dura el test; el test con `mergiraf` se salta si `mergiraf --version` no arranca.
9. **Orden de los errores de uso de `--sync`**: el primero de `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at`, `--check` que venga.
10. **Riesgo alto**: la unión por id es la pieza nueva con más casos; va como función pura con su batería de tests unitarios antes de conectarla.
11. **Coste**: ~5 h de implementación; prueba de `sdd-archive` ~6 $ (spec, decisión 15).
12. Review Focus: 5 entradas; ver la sección.

**Goal**: que `sdd merge` (y el nuevo `--sync`) resuelva los conflictos falsos de registros, capacidades y código, y que el hotfix compruebe todo antes de tocar nada.

**Architecture**: una cadena de resolución en `cli/src/merge/` que usan los cuatro `git merge` de la CLI: log regenerado, registros por id (función pura en `keyed.ts`), trozos que solo añaden y Mergiraf (`mergiraf.ts`). `--sync` (`sync.ts`) reutiliza `mergeArgs` y `completeMergeAttempt` en el worktree de la feature. El hotfix adelanta sus comprobaciones a `prepareHotfix` y al principio de `mergeHotfix`.

**Tech Stack**: CLI Node ≥ 22.18 en TypeScript sin build, Vitest (`cli/test/`, `*.slow.test.ts` con repos temporales); baterías headless para la skill.

**Spec**: `./spec.md`

**Ejecución**: native, porque 5 tasks encadenadas por la interfaz de `completeMergeAttempt`/`resolveConflicts`, un error lo caza el test lento de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — los módulos nuevos (`keyed.ts`, `mergiraf.ts`, `sync.ts`) son internos de `cli/src/merge/`, sin dependencia en `package.json` ni contrato entre módulos nuevo; `mergiraf` es un binario opcional que se lanza si está.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano (mensajes) en castellano con tildes.
- Cada `git merge` de la CLI lleva `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram`; la reescritura de marcas, `--conflict=zdiff3`.
- Registros, por ruta desde la raíz: `.docs/sdd/roadmap.md`, `.docs/sdd/changelog.md`, `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/steering/debt.md`; `estimation-log.md` por nombre, se regenera.
- Literales: `mergiraf: resuelto <fichero>` · `mergiraf: no resuelve <fichero>` · `registros: dos filas distintas con el id '<id>' en <fichero>; se quedan las dos, revísalas` · `base: al día: '<ref>' ya está en '<rama>'` · `base: integrada '<ref>' en '<rama>': <hash corto>` · `base: conflicto en <ficheros>.` · `base: '<rama>' tiene cambios sin commitear; commitéalos antes de integrar la base` · `--sync no admite --<opción>` · `--tag: '<nombre>' no es un nombre de etiqueta válido` · `--tag: ya existe '<nombre>' en '<remoto>'` · `vuelta: no se pudo hacer fetch de las release/ de '<remoto>'` · `vuelta: no se pudo consultar '<vuelta>' en '<remoto>'` · `push: '<into>' y '<vuelta>' tienen remotos distintos ('<a>', '<b>'); fusiona a mano` · salida 2 del destino sacado: `Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, deuda, estimation-log).`
- Sin `git config` ni `.gitattributes` escritos por la CLI.

### De proceso

- Política de modelos del kit (Art. IV): modelo y effort declarados al despachar; `fable` y `opus xhigh` prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Hooks activos (`git config core.hooksPath` = `.githooks`); nunca `--no-verify`.

## Review Focus

- Un trozo de registro donde un lado borra una fila y el otro la cambia → conflicto (`null`), no se pierde el cambio · Task 2, `keyed: delete vs change is a conflict`
- Fila nueva de la rama cuya ancla es una fila que la destino borró → va al principio del trozo, no se pierde · Task 2, `keyed: new row whose anchor was removed goes first`
- `mergiraf solve` que sale con 0 pero deja marcas → se trata como no resuelto · Task 1, `mergiraf output with markers is not resolved`
- `--sync` en un worktree en mitad de otro merge (`MERGE_HEAD`) → sale por cambios sin commitear, sin tocar nada · Task 3, `sync refuses a worktree with a merge in progress`
- Hotfix `--check` con dos `release/` remotas → lo dice como el merge, sin fetch · Task 4, `check reports several open releases without fetching`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una cadena, una función pura nueva; `--sync` reutiliza las piezas del merge.
- [x] **YAGNI gate**: sin merge driver, sin configuración de Mergiraf, sin detección de duplicados fuera de los trozos en conflicto.
- [x] **Brownfield gate**: la unión de trozos que solo añaden sigue igual para lo que hoy resuelve; las salidas existentes no cambian salvo la salida 2 del destino sacado.
- [x] **Constitution check**: Art. I (prueba de la edición de `sdd-archive`, Task 3), Art. X (Task 5 salda los umbrales).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/merge/keyed.ts` — unión por id de un trozo de registro (pura).
- `cli/src/merge/mergiraf.ts` — detección y `mergiraf solve` por fichero.
- `cli/src/merge/sync.ts` — `sdd merge --sync`.
- `cli/test/merge/keyed.test.ts`, `cli/test/merge/mergiraf.slow.test.ts`, `cli/test/merge/registries.slow.test.ts`, `cli/test/merge/sync.slow.test.ts`.

**Modificar**:

- `cli/src/merge/attempt.ts` — `mergeArgs`, `MergeConflict`, `completeMergeAttempt` con `report`.
- `cli/src/merge/registries.ts` — `resolveConflicts` (cadena), `isRegistry` por ruta, `--conflict=zdiff3`.
- `cli/src/merge/exits.ts` — usa `isRegistry` de `registries.ts`; texto de la salida 2.
- `cli/src/merge/steps.ts`, `run.ts`, `hotfix.ts`, `verify.ts`, `verbs.ts` — opciones de git, `--sync`, hotfix, menores.
- `cli/test/merge/*.ts` existentes — los menores de test (8, 10, 13).
- `skills/sdd-archive/SKILL.md` (paso 6), `skills/sdd-archive/references/merge-recipe.md` — `--sync`.
- `tests/batteries/sdd-archive/battery.md` y `subject.sh` — escenario `a3c` y su molde.

**NO se tocan**:

- `.docs/sdd/capabilities/` — el delta lo fusiona el cierre.
- `cli/src/capabilities/` — `capability check` no cambia.

### 1.6 Dependencias

`mergiraf` opcional (probado con 0.20.0); git ≥ 2.35 por `zdiff3` (la máquina, 2.55).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La unión por id descoloca filas en un caso no previsto | media | alto (registro mal) | función pura con tests de cada caso; fallo → `null` y cae a la unión de hoy |
| Mergiraf resuelve mal un fichero | baja | medio | `--verify` corre sobre el resultado, y en el cierre la suite completa ya corrió; decisión del dev-lead |
| El sujeto de `a3c` no ve `--sync` por la caché del plugin | media | coste de un sujeto | `KIT_DIR` del worktree, como el resto de la batería |

### 1.8 Rollout

Directo, con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Opciones de git y Mergiraf en la cadena de resolución

**Tras**: —
**Modelo**: Native (la sesión)
**Tests RED**: `cli/test/merge/attempt.test.ts` (nuevo, unitario), `cli/test/merge/mergiraf.slow.test.ts`
**Superficies**: tooling
**Verificación**: `npx vitest run cli/test/merge` desde `cli/` → `Tests  N passed (N)`
**Interfaces**:
- Consume: nada.
- Produce: `mergeArgs(args: string[]): string[]` (en `attempt.ts`) → `['-c', 'merge.conflictStyle=zdiff3', 'merge', '-X', 'diff-algorithm=histogram', ...args]`; `MergeAttempt` gana `report: (line: string) => void`; `resolveConflicts(attempt: MergeAttempt, conflicted: string[]): Promise<string[]>` (en `registries.ts`) devuelve los que quedan y commitea si no queda ninguno; `solveWithMergiraf(worktree: string, files: string[], report): Promise<string[]>` y `mergirafRuns(program?: string): boolean` en `mergiraf.ts`.

**Ficheros**: `cli/src/merge/attempt.ts`, `steps.ts`, `registries.ts`, `mergiraf.ts`; tests.

- [ ] **Step 1: Implementación** — `syncBaseBranch` y `mergeFeature` llaman `gitWithOutput(worktree, mergeArgs([...]))` y pasan `report` (`io.out`) a `completeMergeAttempt` (sube por `mergeFeature(worktree, branch, target)` con un objeto de opciones, sin cuarto parámetro). `mergeAddedLines` usa `--conflict=zdiff3`. `resolveConflicts`: regenera log, une trozos (los registros por id llegan en la Task 2), lo que quede a `solveWithMergiraf` si `mergirafRuns()`; `mergiraf solve <f>` con 0 y sin marcas (`MARKER`) → `mergiraf: resuelto <f>`; si no → `mergiraf: no resuelve <f>`. Tests: `mergeArgs puts zdiff3 and histogram before the merge arguments`; `mergiraf solves two methods added at the same place` (`.ts` con dos métodos, `mergiraf: resuelto src/rooms.ts`, merge hecho, `--verify` corrido); `without mergiraf the conflict fails as before` (sin línea `mergiraf:`, `merge: conflicto en src/rooms.ts.`); `mergiraf failing leaves the file in conflict` (los dos cambian el cuerpo del mismo método: `mergiraf: no resuelve`, rama destino intacta); `mergiraf output with markers is not resolved` (programa falso vía `mergirafRuns`/`solveWithMergiraf` con el nombre inyectado en un test unitario).
- [ ] **Step 2: Build** — `npx tsc --noEmit -p cli` (o `moon run cli:typecheck`). Verde.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd merge con histogram, zdiff3 y Mergiraf opcional`.

### Task 2 — Registros por id

**Tras**: Task 1
**Modelo**: Native (la sesión)
**Tests RED**: `cli/test/merge/keyed.test.ts`, `cli/test/merge/registries.slow.test.ts`, `cli/test/merge/exits.test.ts`
**Superficies**: tooling
**Verificación**: `npx vitest run cli/test/merge` → `Tests  N passed (N)`
**Interfaces**:
- Consume: `resolveConflicts`, `MergeAttempt.report` (Task 1).
- Produce: `mergeKeyedHunk(hunk: { ours: string[]; base: string[]; theirs: string[] }): { lines: string[]; duplicates: string[] } | null` y `lineKey(line: string): string | null` en `keyed.ts`; `isRegistry(file: string): boolean` exportada desde `registries.ts`.

**Ficheros**: `cli/src/merge/keyed.ts`, `registries.ts`, `exits.ts`; tests.

- [ ] **Step 1: Implementación** — `lineKey`: fila de tabla (`/^\|/`) que no es separador (`/^\|[\s:|-]+\|?\s*$/`) → primera celda sin espacios; entrada `- **<id>** —` → `<id>`; si no, `null`. La cabecera de tabla tiene id (su primera celda, `Id`) y es igual en los tres lados, así que no estorba. El id se califica con el último encabezado `#` del trozo. Algoritmo: decisiones 5 y 6 del plan y 7 y 8 de la spec. En `resolveConflicts`, un registro (`isRegistry`) pasa primero por `mergeKeyedHunk` en cada trozo; si un trozo da `null`, el fichero va a la unión de hoy; cada id de `duplicates` → `registros: dos filas distintas con el id '<id>' en <fichero>; se quedan las dos, revísalas`. `exits.ts` importa `isRegistry` y cambia el texto de la salida 2. Tests unitarios: `keyed: change on one side and new row on the other`, `keyed: same new row on both sides stays once`, `keyed: two different rows with the same id stay and are reported`, `keyed: same id in Added and Changed are different ids`, `keyed: both sides change the same base row differently is a conflict`, `keyed: delete vs change is a conflict`, `keyed: new row whose anchor was removed goes first`, `keyed: different plain lines is null`. Lentos (dos ramas): `roadmap: a state change and a new row below merge` (2.x) y lo mismo en `ROADMAP.md` (3.0.0); `changelog: same entry added twice stays once` (`CHANGELOG.md`); `debt: two rows with the same item and different text are kept and reported` (`.docs/sdd/steering/debt.md`). `exits.test.ts`: `docs/roadmap.md` dirty → dos salidas; `.docs/sdd/steering/debt.md` dirty → tres, con el texto nuevo.
- [ ] **Step 2: Build** — typecheck verde.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task** — `feat(cli): sdd merge une los registros por id`.

### Task 3 — `sdd merge --sync` y el merge de sincronización de `sdd-archive`

**Tras**: Task 2
**Modelo**: Native (la sesión); sujetos `sonnet` + `sdd-kit:effort-medium` por la batería
**Tests RED**: `cli/test/merge/sync.slow.test.ts`, `cli/test/merge/usage.test.ts`; RED de la skill: escenario `a3c` con el texto vigente
**Superficies**: tooling · docs (skill)
**Verificación**: `npx vitest run cli/test/merge` → `Tests  N passed (N)`; `pwsh -NoProfile -Command "Invoke-Pester tests/WordBudget.Tests.ps1, tests/ArchiveSkill.Tests.ps1 -CI"` → `Tests Passed: N, Failed: 0`; batería: `BATTERY=sdd-archive STEPS="base capbase" … bash tests/headless/battery.sh` con veredicto de puerta y conducta
**Interfaces**:
- Consume: `mergeArgs`, `completeMergeAttempt`, `remoteForBranch`, `resolveMergePolicy`.
- Produce: opción `sync` en `mergeVerb`; `syncBranch(options: MergeOptions, io: Io): Promise<void>` en `sync.ts`.

**Ficheros**: `cli/src/merge/sync.ts`, `verbs.ts`, `run.ts`; `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/merge-recipe.md`; `tests/batteries/sdd-archive/battery.md`, `subject.sh`; tests.

- [ ] **Step 1: CLI** — `syncBranch`: opciones incompatibles → `UsageError('--sync no admite --<opción>')` (orden: decisión 9); `git status --porcelain` no vacío o `MERGE_HEAD` → `DomainError` de cambios sin commitear; `remoteForBranch(projectRoot, policy.into)`; con remoto, `git fetch <remoto> +refs/heads/<into>:refs/remotes/<remoto>/<into>` (fallo → `base: no se pudo hacer fetch de '<remoto>'.`, como `syncBaseBranch`); ref = `<remoto>/<into>` o `<into>`; antecesora de `HEAD` → `base: al día`; si no, `mergeArgs(['--no-edit', ref])` + `completeMergeAttempt` (`stepName: 'base'`) → `base: integrada`. Tests: `sync is a no-op when the base is an ancestor`, `sync integrates the base and keeps both requirements of a capability` (dos requisitos al final de `capabilities/routing.md` + fila del roadmap; `capability check` pasa sobre el resultado), `sync aborts a real conflict and leaves the branch as it was` (`base: conflicto en src/slots.js.`, `HEAD` igual), `sync refuses uncommitted changes`, `sync refuses a worktree with a merge in progress`; `usage.test.ts`: `--sync --push` sale con 2 y `--sync no admite --push`.
- [ ] **Step 2: RED de la skill** — en `battery.md`, escenario `a3c` (paso `capbase`, molde `reservas-capbase`: `reservas-base` donde la 0015 y la 0010 añaden cada una un requisito al final de `capabilities/bookings.md`), esperado: la capacidad queda con los dos requisitos y el cierre sigue sin parar; su fila en la rúbrica y en la procedencia (ticket de la 0185 §3). Molde en `subject.sh`. Lanzar `a3c`, n = 1, con `KIT_DIR` en `develop` (texto vigente): esperado rojo (para o aborta). Registrar el veredicto en `tasks.md`.
- [ ] **Step 3: Texto** — paso 6 de `SKILL.md`: `sdd merge --sync --project-root "<worktree>"` en vez de `git merge --no-edit …`, y con `base: conflicto en` una persona resuelve; paso 7: quitar «except the sync merge of the recipe». Receta, «Integrated base»: `--sync` y sus salidas (`base: al día`, `base: integrada`, `base: conflicto en`), sin la resolución a mano de los registros ni «This is the only `git merge` by hand»; línea 34, la cadena de resolución en una frase; línea 80, el script hace el fetch de `release/*` él mismo; tabla de salidas: `mergiraf: …` y `registros: dos filas distintas …` (cítalo en el mensaje final). Medir con `WordBudget.Tests.ps1`: sin subir topes.
- [ ] **Step 4: GREEN** — `a3`, `a3n`, `a3c`, n = 1, Sonnet, `KIT_DIR` del worktree; veredicto de puerta y conducta en `tasks.md`. Si un rojo: leer por qué, no relanzar.
- [ ] **Step 5: Commit de la task** — `feat(sdd-archive): el merge de sincronización lo hace sdd merge --sync`.

### Task 4 — Hotfix: etiqueta y vuelta antes de tocar nada

**Tras**: Task 3
**Modelo**: Native (la sesión)
**Tests RED**: `cli/test/merge/hotfix.slow.test.ts`, `cli/test/merge/usage.test.ts`
**Superficies**: tooling
**Verificación**: `npx vitest run cli/test/merge` → `Tests  N passed (N)`
**Interfaces**:
- Consume: `HotfixPlan`, `Job`.
- Produce: `prepareHotfix` sin `back` de relleno (`back` se decide en `decideBack(root, job, plan)`); `--check` y `mergeHotfix` usan la misma función.

**Ficheros**: `cli/src/merge/hotfix.ts`, `run.ts`; tests.

- [ ] **Step 1: Implementación** — `--tag`: `git check-ref-format refs/tags/<tag>` antes de la política del hotfix → `UsageError` (2). Etiqueta remota: `git ls-remote --tags <remoto> refs/tags/<tag>` con salida → `DomainError` `--tag: ya existe '<tag>' en '<remoto>'`. Remotos: `remoteForBranch` de la vuelta distinto del de `--into` → `push: … tienen remotos distintos …`. `mergeHotfix`: fetch de `release/*` (código ≠ 0 → `vuelta: no se pudo hacer fetch de las release/ de '<remoto>'`) y decisión de la vuelta **antes** de `syncBaseBranch`; `openReleases` con remoto lee solo `refs/remotes/<remoto>/release/`. `ls-remote --exit-code --heads` de la vuelta: 0 publicada, 2 no publicada, otro → `vuelta: no se pudo consultar …`. Comentario de `mergeHotfix` corregido; `back: ''` fuera. Tests: `invalid tag exits 2 before touching anything` (`--tag 'v3.0.1 beta'`), `tag existing only on the remote fails before touching anything`, `two open releases on the remote abort before syncing the stable branch` (la estable local no se mueve), `a local-only release does not count when there is a remote`, `check reports several open releases without fetching`, `different remotes for stable and back fail before touching anything`.
- [ ] **Step 2: Build** — typecheck verde.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task** — `fix(cli): el hotfix de sdd merge valida etiqueta y vuelta antes de tocar nada`.

### Task 5 — Menores de código de la 0187

**Tras**: Task 4
**Modelo**: Native (la sesión)
**Tests RED**: `cli/test/merge/verified-at.slow.test.ts` (menores 8 y 10); el resto es refactor sin comportamiento nuevo: la suite de `cli/test/merge` verde antes y después
**Superficies**: tooling
**Verificación**: `npx vitest run cli/test/merge` → `Tests  N passed (N)`
**Interfaces**:
- Consume: todo lo anterior.
- Produce: `class MergeConflict extends DomainError { files: string[] }` en `attempt.ts`; `verifyMerge(request: { worktree; command; verifiedAt }, io)`, `explainFailure(error, verification: Verification)`.

**Ficheros**: `cli/src/merge/*.ts`; `cli/test/merge/*.ts`.

- [ ] **Step 1: Implementación** — (1) ≤ 3 parámetros en `explainFailure`, `verifyMerge`, `mergeFeature`, `openReleases`; (2) `mergeBranch` e `integrate` ≤ 20 líneas; (3) `MergeConflict` en `completeMergeAttempt`, y `mergeBack` lo captura por tipo (fuera `MERGE_CONFLICT`); (4) un esqueleto común de «integrar, verificar, publicar, informar» si sale más corto y legible; si no, ruling con el motivo; (13) el hook `pre-receive` de los tests con `chmodSync(path, 0o755)`. Tests: `verified-at with a sha from another branch` (no antecesor: corre `--verify`), `verified-at runs the gate when the branch changed code`.
- [ ] **Step 2: Build** — typecheck verde.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task** — `refactor(cli): menores de sdd merge diferidos de la 0187`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 5 h
- Base de la estimación: 5 tasks; la 0187 (5 tasks del mismo módulo) estimó 4 h y salió en 1,5 h; aquí pesan la unión por id y la batería de `sdd-archive`
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- histogram/zdiff3: THEN `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram` → Task 1, `mergeArgs puts zdiff3 and histogram…`. ✓
- AND marcas de `zdiff3` en el conflicto que llega a una persona → Task 1, test de `mergeArgs` y de `--conflict=zdiff3`; el fichero con marcas no se observa tras el abort (decisión 7). ⚠
- Registros: THEN `0190` ✅ + `0201` → Task 2, `keyed: change on one side…` y `roadmap: a state change…` (2.x y 3.0.0). ✓
- AND misma fila una vez → Task 2, `keyed: same new row…`, `changelog: same entry added twice…`. ✓
- AND dos filas distintas, aviso → Task 2, `keyed: two different rows…`, `debt: two rows…`. ✓
- AND Added/Changed ids distintos → Task 2, `keyed: same id in Added and Changed…`. ✓
- AND misma fila cambiada distinto → conflicto → Task 2, `keyed: both sides change…`. ✓
- Mergiraf: THEN resuelve, línea, commit, `--verify` → Task 1, `mergiraf solves two methods…`. ✓
- AND otro código → `no resuelve` y conflicto → Task 1, `mergiraf failing…`. ✓
- AND sin mergiraf, sin línea → Task 1, `without mergiraf…`. ✓
- AND sin `git config` ni `.gitattributes` → Task 1, el test de Mergiraf comprueba `git config --get-regexp merge\\.` vacío y sin `.gitattributes`. ✓
- `--sync`: THEN integra con dos requisitos y fila, línea `base: integrada` → Task 3, `sync integrates the base…`. ✓
- AND al día → Task 3, `sync is a no-op…`. ✓
- AND conflicto → Task 3, `sync aborts a real conflict…`. ✓
- AND cambios sin commitear → Task 3, `sync refuses uncommitted changes`. ✓
- AND opciones → Task 3, `usage.test.ts`. ✓
- MODIFIED «parte de la rama destino publicada» → Task 1 (cadena en `syncBaseBranch`) y los tests de `lock-and-base.slow.test.ts` que ya existen. ✓
- MODIFIED «une los registros que solo añaden líneas» → tests existentes + Task 1/2. ✓
- MODIFIED destino sacado → Task 2, `exits.test.ts`. ✓
- MODIFIED «Un conflicto solo en los registros…» y «…es de una persona» y `archive` → Task 3, batería `a3`, `a3c`. ✓
- MODIFIED hotfix (vuelta remota, etiqueta inválida, etiqueta remota) → Task 4. ✓
- MODIFIED vuelta que falla (remotos distintos, consulta) → Task 4, `different remotes…`; la consulta que falla, por revisión (simularla exige un remoto que falle solo en `ls-remote`). ⚠
- Tabla «Lo que se retira»: paso 6, receta :9, :11-12, :15, :34, :80 → Task 3, Step 3, y `tests/ArchiveSkill.Tests.ps1` si fija frases. ✓
- Review Focus → Tasks 1-4, tests nombrados. ✓
