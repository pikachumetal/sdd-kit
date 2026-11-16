---
id: 20261029-082835-feature-0251-suite-lock-root-cause
feature: 0251
title: Plan de implementación — El cerrojo de suites fuera de verdad
spec: ./spec.md
status: draft
created: 2026-10-29
---

# Plan de implementación — El cerrojo de suites fuera de verdad

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, la sesión implementa las tres tasks. Revisión final en ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; sin eje Arquitectura.
2. **Ejecución**: Native (motivo en la línea `Ejecución`).
3. **Dónde vive el bucle**: en `run.ts`, una función `mergeVerified` que alterna «integrar y verificar en el worktree del cambio» (sin cerrojo) y «fusionar y publicar» (con cerrojo), hasta 3 intentos. La integración en la rama sale de `sync.ts` (`integrateRef`), que también usa `--sync`.
4. **Cualquier fallo de la ruta con `--verify` devuelve la rama del cambio al `HEAD` que tenía al empezar `sdd merge`**, aunque algún intento anterior hubiera verificado en verde: así lo pide el `MODIFIED` («vuelve al commit que tenía antes de la integración que hizo el script»).
5. **El push movido se provoca con un `pre-receive`** en el remoto *bare* del test, que mueve `develop` la primera vez y rechaza (`tech-stack.md`, «Un hook `pre-receive` de un remoto *bare* de test no puede mover refs»): con la verificación fuera del cerrojo, un gate que publica ya no llega entre el merge y el push.
6. **Riesgo alto**: los `*.slow.test.ts` de `cli/test/merge/` que esperaban la verificación en el destino (contraste, reintento, rojo). La Task 1 los corre todos y cambia solo las expectativas que el delta cambia, nombradas en su Step 1.
7. **Coste estimado**: 4,5 h de implementación, más 1 h de spec y plan; sin subagentes salvo la revisión final (~3 despachos).
8. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd merge --verify` no tenga el cerrojo de merge mientras verifica, que `cli:test` quepa dos veces a la vez en la máquina y medir si el cerrojo de suites puede salir del gate.

**Architecture**: la verificación pasa del worktree del destino, dentro de `withLock`, al worktree del cambio, fuera del cerrojo, con la integración de `--sync`. Dentro del cerrojo solo quedan el merge, la comparación con el commit verificado (`onlyDocsSince`) y el push. (b) y (c) son configuración de moon y una medida.

**Tech Stack**: Node ≥ 22.18 con TypeScript sin compilar (`cli/`), Vitest, moon 2.6.0, git.

**Spec**: `./spec.md`

**Ejecución**: native, porque 3 tasks encadenadas (la 2 y la 3 miden lo que deja la anterior), el riesgo de la 1 lo cazan sus tests de `cli/test/merge/` y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia el orden de pasos dentro de `cli/src/merge/`, sin módulo, dependencia ni contrato nuevos.

## Restricciones globales

### De código

- Literales de la spec, exactos: `merge: '<destino>' cambió durante la verificación; integro y verifico lo que se cruza (<n>/3)` · `merge: '<destino>' sigue cambiando tras 3 intentos; relanza el merge en un rato` · `push: '<destino>' avanzó en '<remoto>'; integro y reintento (<n>/3)` · `push: '<destino>' sigue moviéndose en '<remoto>' tras 3 intentos; relanza el merge en un rato` · `base: integrada '<ref>' en '<rama>': <hash corto>` · `base: '<rama>' tiene cambios sin commitear; commitéalos antes de integrar la base` · `--verify corre en el worktree de la rama; '<rama>' no está sacada en '<ruta>'` (código 2).
- Tope de 3 intentos compartido entre el merge y el push.
- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano en castellano con tildes.
- Todo test que cree repos git, lance procesos o espere va en `*.slow.test.ts`.

### De proceso

- Política de modelos de `sdd-implement`: modelo y effort explícitos en cada despacho; `fable` y `opus xhigh`, prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task; nunca `--no-verify`.
- Verificación de una task: `npx vitest run <ficheros>` desde `cli/`, con `--test-timeout 120000` en los `*.slow.test.ts`; nunca una tarea de moon con el cerrojo de suites.

## Review Focus

- Un hook `pre-merge-commit` del proyecto en rojo al integrar la base en la rama del cambio → falla como hoy en el destino (`verificación: el hook rechazó el merge.`), la rama vuelve a su commit y no se coge el cerrojo · Task 1, `un hook en rojo al integrar en la rama deja la rama como estaba`.
- `base: conflicto en <ficheros>` al integrar la base en la rama → `git merge --abort`, la rama en su commit y sin `MERGE_HEAD`; a diferencia de `--sync`, no se queda a medias · Task 1, `un conflicto al reintegrar deja la rama destino como estaba` (adaptado).
- Contraste de un rojo con el worktree del cambio desacoplado en la base: si el contraste falla al lanzar, el worktree vuelve igualmente a la rama (`finally`) · Task 1, `con la verificación en rojo la rama vuelve a su commit y el contraste corre sin cerrojo en la base`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se reutilizan `verifyMerge`, `onlyDocsSince`, `mergeAndClean`, `withDestination` y `withLock`; lo nuevo es el bucle y la integración en la rama.
- [x] **YAGNI gate**: `integrateRef` tiene dos usos (`--sync` y el merge con `--verify`); nada más se abstrae.
- [x] **Brownfield gate**: sin `--verify` y en el hotfix, el merge no cambia.
- [x] **Constitution check**: Art. I (la edición de `merge-recipe.md` no se mide, decisión 16 de la spec), Art. VI, Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/test/merge/outside-lock.slow.test.ts` — los escenarios de los dos `ADDED` y del `MODIFIED`.

**Modificar**:

- `cli/src/merge/run.ts` — `mergeBranch` elige la ruta: sin `--verify`, la de hoy; con él, `mergeVerified`. `publish` deja de verificar.
- `cli/src/merge/sync.ts` — exporta `assertNothingPending` e `integrateRef`, que usa también `syncBranch`.
- `cli/src/merge/verify.ts` — `explainFailure` recibe dónde corre el contraste.
- `cli/test/merge/push-retry.slow.test.ts`, `intersection.slow.test.ts`, `base-red.slow.test.ts`, `failures.slow.test.ts` — solo las expectativas que cambia el delta.
- `skills/sdd-archive/references/merge-recipe.md` — la frase de «The merge is a script» y dos filas de «Its outputs».
- `cli/moon.yml` — `--maxWorkers 50%` en `test`; con (c) en verde, `test-slow` sin `sdd lock run`.
- `cli/test/merge/mergiraf.slow.test.ts` — recibe los dos tests de `mergiraf.test.ts`, que se borra.
- `moon.yml` — con (c) en verde, `test-headless` sin `sdd lock run`.
- `.docs/sdd/tech-stack.md` §Testing — la medida y, según ella, el cerrojo.

**NO se tocan**:

- `cli/src/merge/hotfix.ts` — decisión 6 de la spec.
- `cli/moon.yml` `test-min`, `.github/workflows/ci.yml`, `CLAUDE.md` regla 5 — decisión 13.
- `cli/test/estimation/layout.test.ts`, `statistics.test.ts`, `cli/test/kit/subject-output-privacy.test.ts` — decisión 10.

### 1.6 Dependencias

- mergiraf 0.20.0 en el `PATH` para `mergiraf.slow.test.ts` (ya obligatorio, `tech-stack.md`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tests de `cli/test/merge/` que daban por hecho la verificación en el destino | alta | medio | la Task 1 corre toda la carpeta y lista cada expectativa cambiada |
| `--maxWorkers 50%` alarga `cli:test` solo más de lo que gana con dos a la vez | media | bajo | la Task 3 mide también el gate solo |
| La medida sale roja por carga ajena (otros worktrees con sujetos) | media | medio | antes de medir, `sdd lock` libre y sin sujetos en marcha; se apunta lo que corría |

### 1.8 Rollout

Directo: entra en la siguiente release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd merge --verify` sin el cerrojo de merge

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/merge/outside-lock.slow.test.ts`, y las expectativas cambiadas de los demás, antes del código
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/merge --test-timeout 120000` desde `cli/` → `Tests  <N> passed (<N>)`; `pnpm exec tsc --noEmit` → sin salida
**Se prueba en la aplicación**: no, porque es la CLI del kit: lo prueba el merge de esta misma feature con `sdd merge --push`.

**Interfaces**:
- Consume: `verifyMerge(worktree, { command, verifiedAt, branch, mergeBase }, io)`, `onlyDocsSince(worktree, commit)`, `runVerification`, `mergeAndClean`, `fetchBase`, `remoteForBranch`, `syncBaseBranch`, `mergeFeature`, `pushDestination`, `undoFailedMerge`, `withLock`, `withDestination`.
- Produce: `integrateRef(root: string, ref: string, report: Report): Promise<boolean>` y `assertNothingPending(root, branch)` en `sync.ts`; `explainFailure(error, { worktree, io, base })` en `verify.ts`, donde `base` es la ref sobre la que corre el contraste (o `null`: corre en `worktree` tal cual, el hotfix).

**Ficheros**: crear `cli/test/merge/outside-lock.slow.test.ts`; modificar `cli/src/merge/run.ts`, `cli/src/merge/sync.ts`, `cli/src/merge/verify.ts`, `cli/src/merge/hotfix.ts` (solo la llamada a `explainFailure`, con `base: null`), los cuatro tests de §1.1 y `merge-recipe.md`.

- [ ] **Step 1: Tests RED**. En `outside-lock.slow.test.ts`, con `mergeFixture`, `pushRemoteCommit`, `localCommit`, `nodeGate`, `publishScript` y `runMerge` de `helpers.ts`:
  - `verifica en el worktree de la rama sin el cerrojo de merge`: `pushRemoteCommit(fx, 'src/a.ts', 'x')`; gate `nodeGate` que sale con 1 si existe `fx.lock` y escribe `process.cwd()` en un fichero. `expect(code).toBe(0)`; el texto contiene `base: integrada 'origin/develop' en 'feature/0001':`; el cwd escrito es `join(fx.wt, '0001')`; `git merge-base --is-ancestor feature/0001 develop`; `sha(fx.remote,'develop') === sha(fx.repo,'develop')`.
  - `integra también la develop local con commits sin publicar`: `localCommit(fx, 'develop', 'chore: local')`; el texto contiene `base: integrada 'develop' en 'feature/0001':` y código 0.
  - `si develop cambia durante la verificación vuelve a verificar y publica`: gate = `publishScript(fx, 'src/b.ts', true)` en `nodeGate`. El texto contiene `merge: 'develop' cambió durante la verificación; integro y verifico lo que se cruza (2/3)`; código 0.
  - `con un cambio solo de docs durante la verificación publica sin otro intento`: igual, con `'notas.md'`; el texto no contiene `(2/3)`; código 0.
  - `tras tres intentos con develop cambiando falla y deja las dos ramas como estaban`: `publishScript(fx, 'src/b.ts', false)`. Código 1; contiene `merge: 'develop' sigue cambiando tras 3 intentos; relanza el merge en un rato`; `sha(fx.repo,'develop')` y `sha(fx.repo,'feature/0001')` iguales a los de antes.
  - `el push que encuentra el remoto movido repite fuera del cerrojo`: el remoto lleva un commit en `refs/heads/queue` (empujado desde `seed`) y un `pre-receive` que, si no existe su marcador, lo crea, hace `unset GIT_QUARANTINE_PATH` y `git update-ref refs/heads/develop <sha de queue>`, y sale con 1. El gate cuenta sus pasadas en un fichero y falla si existe `fx.lock`. Contiene `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`; dos pasadas; código 0.
  - `dos cierres a la vez no se esperan con un cerrojo cogido`: A = `runMerge(wt/0001, ['--push','--verify', gate que espera a que exista <x>])` sin `await`; B = `await runMerge(wt/0002, ['--push'])` → código 0 mientras A sigue pendiente (una bandera que pone `A.then`); después se crea `<x>` y `await A` → código 0 y contiene `(2/3)`; `feature/0001` y `feature/0002` en `develop`.
  - `con cambios sin commitear en la rama sale con 1 sin tocar nada`: `edit(wt/0001,'feature-0001.txt',…)`. Código 1; contiene `base: 'feature/0001' tiene cambios sin commitear; commitéalos antes de integrar la base`; `fx.lock` no existe; `develop` sin cambiar.
  - `--verify con --branch de otra rama sale con 2`: `runMerge(wt/0001, ['--branch','feature/0002','--verify','node -e ""'])` → 2 y `--verify corre en el worktree de la rama; 'feature/0002' no está sacada en '<ruta real de wt/0001>'`.
  - `sin --verify no integra en la rama`: `pushRemoteCommit`; `runMerge(wt/0001)` → 0 y `sha(fx.repo,'feature/0001')` sin cambiar.
  - `con la verificación en rojo la rama vuelve a su commit y el contraste corre sin cerrojo en la base`: `pushRemoteCommit(fx,'src/a.ts','x')`; gate que anota `existsSync(fx.lock)` y `git rev-parse HEAD` y sale con 1. Código 1; contiene `base: en rojo`; dos pasadas sin cerrojo; la segunda en `sha(fx.repo,'origin/develop')`; `feature/0001` en su sha inicial; `git -C wt/0001 branch --show-current` = `feature/0001`.
  - `un hook en rojo al integrar en la rama deja la rama como estaba`: `pushRemoteCommit`; `core.hooksPath` del repo a una carpeta con un `pre-merge-commit` que sale con 1. Código 1; contiene `verificación: el hook rechazó el merge.`; `feature/0001` en su sha inicial; `fx.lock` no existe.
  - Expectativas que cambian en los demás: `push-retry.slow.test.ts` («si la rama destino avanzó durante la verificación…» y «tras tres intentos…» pasan a los literales `merge:`; «un conflicto al reintegrar…» comprueba además `feature/0001` en su sha y sin `MERGE_HEAD`; «con un commit local y un reintento…» espera `(2/3)` con el literal `merge:`), `intersection.slow.test.ts` («crosses again on a push retry» cruza en el reintento del merge; «contrasts the crossed targets on the base», el contraste en el worktree del cambio), `base-red.slow.test.ts` y `failures.slow.test.ts` (verificación en rojo: la rama en su commit). Corre `npx vitest run test/merge --test-timeout 120000` y comprueba que fallan los nuevos y los cambiados, y por qué.
- [ ] **Step 2: Implementación**.
  - `sync.ts`: `integrateRef(root, ref, report)`: si `ref` es ancestro de `HEAD`, devuelve `false`; si no, `mergeAndClean({ worktree: root, stepName: 'base', report, mergedDestination: ref }, ['--no-edit', ref])`, escribe `base: integrada '<ref>' en '<rama>': <shortHead>` y devuelve `true`. `syncBranch` la usa y conserva su `base: al día`. `assertNothingPending` pasa a exportarse.
  - `run.ts`: `mergeBranch`, con `--verify` no vacío y sin `stable`: comprueba que `branch` es la sacada en `projectRoot` (si no, `UsageError` con el literal) y `assertNothingPending`, y llama a `mergeVerified(job, lock)`. `mergeVerified`: guarda `start = HEAD`; para `attempt` de 1 a 3, `verified = await integrateAndVerify(job, verifiedAt)` y después `outcome = await withLock(lock, …, () => withDestination(request, (path) => publishVerified(path, job, verified)))`, con `outcome` `'published' | 'changed' | 'moved'`; con `'changed'` o `'moved'` y `attempt < 3`, escribe el literal de reintento con `attempt + 1` y sigue con `verifiedAt = verified`; en el 3.º, `DomainError` con el literal de agotamiento. Cualquier error: `git reset --hard start` en `projectRoot` (con `merge --abort` antes) y se relanza.
  - `integrateAndVerify(job, verifiedAt)`: `remoteRef = fetchBase(...)`; `mergeBase = merge-base(remoteRef, HEAD)` antes de integrar; `integrateRef(remoteRef)` y, si `<into>` local no es ancestro de `HEAD`, `integrateRef(<into>)`; `verifyMerge(projectRoot, { command, verifiedAt, branch, mergeBase }, io)`; en rojo, `explainFailure(error, { worktree: projectRoot, io, base: remoteRef })` tras devolver la rama a su commit de antes de integrar; devuelve `HEAD`.
  - `publishVerified(path, job, verified)`: `syncBaseBranch`; `before = HEAD`; `mergeFeature`; si `!(await onlyDocsSince(path, verified))`, `undoFailedMerge(path, before)` y `'changed'`; con `--push`, `pushDestination` → `'moved'`: `undoFailedMerge` y `'moved'`; si no, `reportMerge` y `'published'`. Errores: `undoFailedMerge` y relanzar, como hoy `integrate`.
  - `verify.ts`: `explainFailure` con `base` no nulo hace `git checkout --detach <base>` en `worktree`, corre el contraste y, en un `finally`, `git checkout <rama>`.
  - `publish` (sin `--verify`) deja de llamar a `verifyMerge`; `integrate` sin `--verify` sigue igual.
  - `merge-recipe.md`: la frase de «The merge is a script» pasa a «With `--verify`, the script integrates the destination (remote and local) into the change's branch in its worktree and runs `--verify` there, without the lock; under one lock per repo it then merges in the destination's clean checkout or in a temporary `merge-<id>` worktree beside the others and pushes the destination by its name. If the destination changed meanwhile, outside docs, it integrates and verifies what crosses again, up to 3 times. Without `--verify`, it integrates the destination's remote into the local destination and merges under the lock.», conservando la última frase («The change's worktree stays on its branch; …»). En «Its outputs», dos filas: `merge: '<into>' cambió durante la verificación; integro y verifico lo que se cruza (n/3)` → «another session merged meanwhile» → «nothing: the script retries»; y `merge: '<into>' sigue cambiando tras 3 intentos; …` → «the destination kept changing» → «run the script once more in a while».
- [ ] **Step 3: Build** — `pnpm exec tsc --noEmit` desde `cli/`. Esperado: sin salida.
- [ ] **Step 4: Verificación** — `npx vitest run test/merge --test-timeout 120000` → todos en verde; `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` → verde.
- [ ] **Step 5: Commit de la task** — `feat(merge): verificar fuera del cerrojo de merge en el worktree del cambio`.

### Task 2 — `cli:test` con la mitad de los workers y `mergiraf.test.ts` a lento

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: ninguno: es configuración y un traslado; lo prueban la medida de la Task 3 y que los dos tests sigan pasando en el fichero lento
**Superficies**: tooling
**Verificación**: `npx vitest run test/merge/mergiraf.slow.test.ts --test-timeout 120000` → `Tests  <N+2> passed`; `moon run cli:test` desde la raíz → verde, con su duración apuntada en `tasks.md`
**Se prueba en la aplicación**: no, porque es configuración de la suite.

**Interfaces**:
- Consume: nada.
- Produce: `cli:test` con `--maxWorkers 50%`.

**Ficheros**: modificar `cli/moon.yml`, `cli/test/merge/mergiraf.slow.test.ts`; borrar `cli/test/merge/mergiraf.test.ts`.

- [ ] **Step 1: Implementación** — en `cli/moon.yml`, `test.args`: `[exec, vitest, run, --exclude, '**/*.slow.test.ts', --maxWorkers, '50%']`, con el comentario del porqué junto al de los 8 workers (dos gates a la vez caducaban a 5 s con todos los núcleos). Los dos `it` de `mergiraf.test.ts`, con sus imports, van a un `describe('mergiraf sin el programa', …)` de `mergiraf.slow.test.ts`; `git rm cli/test/merge/mergiraf.test.ts`.
- [ ] **Step 2: Build** — `pnpm exec tsc --noEmit`. Esperado: sin salida.
- [ ] **Step 3: Verificación** — los dos comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `test(cli): acotar los workers de cli:test y pasar mergiraf.test.ts a lento`.

### Task 3 — La medida de la 0240 y el cerrojo de suites

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: ninguno: es una medida
**Superficies**: tooling · docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → verde; `node cli/bin/sdd.js roadmap check --path .docs/sdd` → código 0
**Verificación lenta**: la medida, ~5 min por pasada, en segundo plano
**Se prueba en la aplicación**: no, porque es una medida de la suite.

**Interfaces**:
- Consume: el commit de la Task 2.
- Produce: la tabla de la medida en `tasks.md` (para el walkthrough) y, según ella, `moon.yml`, `cli/moon.yml` y `tech-stack.md`.

**Ficheros**: modificar `.docs/sdd/tech-stack.md`; con la medida en verde, también `moon.yml` y `cli/moon.yml`.

- [ ] **Step 1: Preparar** — comprobar que nadie tiene el cerrojo de suites (`<git-common-dir>/sdd-suite.lock` no existe) y apuntar los worktrees abiertos (`git worktree list`). Dos worktrees `git worktree add --detach <padre de los worktrees>/measure-0251-a <sha de la Task 2>` (y `-b`), en cada uno `pnpm install --frozen-lockfile` y, sin commitear, el `sdd lock run --` fuera de `moon.yml` (`test-headless`) y de `cli/moon.yml` (`test-slow`, `test-min`).
- [ ] **Step 2: Medir** — lanzar a la vez, en segundo plano, en los dos: `moon run kit:test-headless cli:typecheck cli:test`, con la salida entera a un fichero del scratchpad y la hora de inicio y fin. Después, en uno, el mismo gate solo. Tabla: pasada · resultado de cada tarea · tests · duración; los tests en rojo, con su línea literal.
- [ ] **Step 3: Aplicar** — en verde los dos y por debajo de 5 min: quitar `node`, `bin/sdd.js`/`cli/bin/sdd.js`, `lock`, `run`, `--` de `test-headless` (`moon.yml`) y de `test-slow` (`cli/moon.yml`, y su comentario «Las dos con el cerrojo del clon…» pasa a hablar solo de `test-min`); en `tech-stack.md` §Testing, el gate de cierre sin `node cli/bin/sdd.js lock run --`, el párrafo del patch 0218 dice que solo `cli:test-min` corre dentro de `sdd lock run` y deja la medida nueva junto a la de la 0240, y la «Verificación de una task» nombra solo `cli:test-min`. En rojo: nada de eso; `tech-stack.md` añade la medida nueva al párrafo de la 0240. Los dos worktrees de medida, fuera (`git worktree remove`).
- [ ] **Step 4: Verificación** — los comandos de «Verificación».
- [ ] **Step 5: Commit de la task** — en verde, `chore(moon): sacar el cerrojo de suites del gate tras medir dos gates a la vez`; en rojo, `docs(tech-stack): medir dos gates a la vez tras acotar los workers`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 4,5h (rango 3–6 h): Task 1, 3,5 h; Task 2, 0,3 h; Task 3, 0,7 h
- Base de la estimación: 3 tasks; la 1 cambia el flujo de `run.ts` con 12 tests nuevos y ~6 adaptados (la 0235, del mismo módulo, como referencia); la 3 es una medida en segundo plano
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop` (el de `tech-stack.md` §Testing hoy; si la Task 3 lo cambia, el que quede escrito ahí)
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`), con `sdd merge --push`

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «La verificación del merge corre fuera del cerrojo de merge»: integra sin cerrojo y escribe `base: integrada 'origin/develop'…` → Task 1, `verifica en el worktree de la rama sin el cerrojo de merge`. ✓
- AND develop local con commits sin publicar → Task 1, `integra también la develop local con commits sin publicar`. ✓
- AND verifica en el worktree, sin cerrojo, con el cruce → Task 1, el mismo test (cwd y cerrojo); el cruce, `intersection.slow.test.ts`. ✓
- AND solo en verde coge el cerrojo y no verifica dentro → Task 1, `el push que encuentra el remoto movido…` (el gate falla si existe el cerrojo). ✓
- AND el destino cambió fuera de docs → `(2/3)`; con solo docs, publica → Task 1, `si develop cambia durante la verificación…` y `con un cambio solo de docs…`. ✓
- AND push movido → `push: … (2/3)` fuera del cerrojo → Task 1, `el push que encuentra el remoto movido repite fuera del cerrojo`. ✓
- AND tope compartido de 3 y sus dos literales → Task 1, `tras tres intentos con develop cambiando…` y `push-retry` «tras tres intentos…». ✓
- AND base ya en la rama, sin integración; con `--verified-at` en `HEAD`, omitida → `verified-at.slow.test.ts` «omite la verificación si desde el sha solo cambian docs». ✓
- AND sin `--verify`, como antes → Task 1, `sin --verify no integra en la rama`. ✓
- AND cambios sin commitear → Task 1, `con cambios sin commitear en la rama sale con 1 sin tocar nada`. ✓
- AND `--branch` de otra rama → Task 1, `--verify con --branch de otra rama sale con 2`. ✓
- AND hotfix dentro del cerrojo → `hotfix.slow.test.ts` sin cambios, en la Verificación de la Task 1. ✓
- ADDED «Dos cierres a la vez no se esperan…» (THEN y sus dos AND) → Task 1, `dos cierres a la vez no se esperan con un cerrojo cogido`. ✓
- MODIFIED, AND la rama del cambio vuelve a su commit → Task 1, los tests de rojo, de hook y de tres intentos. ✓
- MODIFIED, AND el contraste en el worktree del cambio desacoplado en la base, sin cerrojo → Task 1, `con la verificación en rojo la rama vuelve a su commit y el contraste corre sin cerrojo en la base`. ✓
- MODIFIED, el resto de cláusulas, sin cambios → `failures.slow.test.ts`, `base-red.slow.test.ts`. ✓
- Reglas, Límites (3 intentos) → Task 1, los dos tests de tope. ✓
- Tabla «Lo que se retira…»: `merge-recipe.md:40` y `:63` → Task 1, Step 2 (`skills.test.ts`); `moon.yml`, `cli/moon.yml`, `tech-stack.md:8`, `:32`, `:34` → Task 3, Step 3; `mergiraf.test.ts` → Task 2; `CLAUDE.md:34`, `ci.yml:32` → se quedan. ✓
- Medida (c) → Task 3, Step 2, su tabla. ✓
- Review Focus → Task 1, los tres tests nombrados. ✓
