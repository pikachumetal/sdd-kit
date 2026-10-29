---
id: 20261029-082734-feature-0236-project-gate-levels
feature: 0236
title: Plan de implementación — El gate de los proyectos por niveles y por lo afectado, con la salvaguarda del build
spec: ./spec.md
status: draft
created: 2026-10-29
---

# Plan de implementación — El gate de los proyectos por niveles y por lo afectado

## Decisiones que he tomado yo — valida estas

1. **Modelo por task**: las tres las hace la sesión (Native); los sujetos headless, `sonnet` (método de `tech-stack.md`, «Baterías por skill»). Revisión final: Spec con `sdd-kit:effort-high` + `opus`, Código con `sdd-kit:effort-high` + `sonnet`; Arquitectura no.
2. **Ejecución: native**, porque las tres tasks se encadenan por los campos de la plantilla de la Task 1 y el bloque «Running a gate» de la Task 2, que la Task 3 cita; un error en el texto lo caza el GREEN de su task, y el plan cabe en un contexto.
3. **Cada task mide su RED antes de escribir**, con la copia del kit de `develop` en el merge-base `b8ab5635` (`git archive b8ab5635 skills .claude-plugin cli hooks`), n = 1; el GREEN con el kit de la rama sin commitear copiado (`skills`, `.claude-plugin`, `cli` sin `node_modules`, `hooks`), n = 2. `RUNS_DIR` en `.temp/r236`, ruta corta (feature 0230).
4. **La regla tras un rojo se prueba en la batería de `sdd-verify`** (`t1`, `t2`: el sujeto vuelve al gate tras un rojo y escribe la línea `Gate:`), no cerrando una feature entera: la regla vive en `sdd-verify` (spec, decisión 11), y un sujeto de `sdd-archive` cuesta ~0,70 $ frente a ~0,35 $. La entrada real por el cierre la cubre `g7` (salvaguarda).
5. **Los moldes de `sdd-archive` siguen en 2.x**: «Suites» con nivel y «Sin filtro» van en `tech-stack.md` §Testing del molde, que las skills leen sin `operations.md`. `gate.json` gana la tarea `unit` (nivel unitario, `node --test test/app.test.js`) y los inputs `package.json` en `bookings:test`.
6. **Coste corregido**: la spec (decisión 21) estimó ~11 $ con 0,31 $ por sujeto; un sujeto de `sdd-archive` cuesta ~0,70 $ (`tech-stack.md`). Con 13 sujetos de `sdd-archive`, 6 de `sdd-verify`, 9 de init, upgrade y propose y 3 de humo: **~17 $**, que pasaba del tope de 15 $ de la spec: el dev-lead aprobó ~17 $ con tope 22 $ (enmienda de la spec, 2026-10-29).
7. **Estimación**: ~5 h de implementación (tres textos ~2 h, moldes ~1 h, ~31 sujetos ~2 h en tandas de 3).
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: el cierre de un proyecto corre los unitarios enteros y lo afectado del resto, todo si la rama o la base tocan el build, y tras un rojo solo lo que el arreglo afecta; `operations.md` declara nivel, «Sin filtro», «Lint» y «CI de la base», y la init y la migración los proponen.

**Architecture**: solo texto de skills y plantillas, y su prueba. Las reglas de correr un gate van en un bloque «Running a gate» de `sdd-verify`, junto a la línea `Gate:`, y cada sitio que corre un gate lo nombra en una línea. `sdd-archive` paso 6 y su receta ganan lo que trae la base y el conflicto solo de docs.

**Tech Stack**: Markdown (skills y plantillas), Node (`tests/batteries/*/subject.mjs`, `tests/batteries/sdd-archive/fixtures/gate/gate.mjs`), sujetos headless con `node tests/headless/battery.mjs run`, Vitest en `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks se encadenan por los campos de la Task 1 y el bloque de la Task 2, un error lo caza el GREEN de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, plantillas y moldes de prueba; ni módulo, ni dependencia, ni contrato de la CLI.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes. El revisor marca el incumplimiento como Important, salvo un umbral superado en una unidad, que es Minor.
- Las skills se escriben en inglés (Art. III); las etiquetas de `operations.md` y los textos que el agente escribe en registros, en castellano y literales de la spec: «Sin filtro», «Lint», «CI de la base», `unitario`, `integración`, `E2E`, `pendiente`, `sin orden de lectura`.
- Literales de la línea `Gate:`: las órdenes que corrieron antes de la flecha, entre backticks y separadas por ` · `; `<tarea>: corrió <N>/<M> (sin filtro: cambia el build)`; `<tarea>: corrió <N>/<M> (no corrió en la pasada roja)`; tras un rojo, `tras el rojo en <sha>, arreglo <sha>:`; con un arreglo solo de docs, `tras el rojo en <sha>, arreglo <sha> solo de docs:`.
- Avisos literales: `Gate con lint: «<línea>» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate` y `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>`.
- Lista «Sin filtro» por defecto, a cualquier profundidad: `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*`, `playwright.config.*`. Sin `moon.yml`.
- Ningún tope de `cli/test/kit/word-budget.test.ts` sube.
- El texto de skills y referencias se edita con `Edit`, no con scripts de reemplazo (ticket del patch 0220 §4).

### De proceso

- Política de modelos de `sdd-implement`; `fable` y `opus xhigh` prohibidos.
- Sujetos por tandas de 3 (`control.maxParallelAgents`); un rojo no se relanza para sacar verde: se lee por qué. Un RED limpio no escribe su regla (Art. I).
- Con más de 22 $ de sujetos acumulados, para y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una rama que toca `package.json` solo para cambiar `version` → corre todo sin filtro igual: «Sin filtro» no mira qué cambia dentro del fichero · Task 2, rúbrica de `g7` fila G7a (el molde cambia una línea de `package.json`).
- Un rojo de `sdd merge --verify` (no del gate de cierre) seguido de un arreglo de docs → la pasada siguiente sigue «Running a gate» igual: corren solo los tests que fallaron · Task 2, el párrafo de `sdd-verify` lo dice para cualquier gate; sin sujeto propio (la misma regla que `t1`).
- Un conflicto de la base en `CHANGELOG.md` con dos entradas añadidas bajo `[Unreleased]` → ya lo junta `sdd merge --sync` por id y no llega al agente; la regla nueva no lo toca · Task 3, sin sujeto: lo cubren los tests de `cli/test/merge/`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una sola orden de gate; los unitarios por su nivel; ningún verbo de la CLI.
- [x] **YAGNI gate**: «Sin filtro» y nivel tienen lectores en esta feature (`sdd-verify`); «CI de la base» lo lee la 0257, ya en el roadmap.
- [x] **Brownfield gate**: un proyecto sin los campos nuevos sigue con su gate; la salvaguarda tiene lista por defecto.
- [x] **Constitution check**: Art. I (RED/GREEN y coste), Art. II (predicados observables; contraejemplo del conflicto), Art. III, Art. V (migración e init desde una fuente), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/project-gate-levels-red.md` y `tests/project-gate-levels-green.md` — evidencia RED y GREEN de los escenarios de las tres tasks.

**Modificar**:

- `skills/sdd-templates/templates/operations-template.md` — §Testing: nivel en «Suites», «Gate de cierre» por lo afectado, «Sin filtro», «Lint», «CI de la base».
- `skills/sdd-templates/templates/plan-template.md` — «Verificación» y su ayuda: unitarios de las superficies y los tests que la task escribe.
- `skills/sdd-init/SKILL.md` — fila «How it is tested» de la tabla de documentos.
- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — paso 2 (los campos nuevos, propuestos), paso 9 (aviso del gate con lint), «Verificación».
- `cli/test/kit/migration-init-parity.test.ts` o un test nuevo en `cli/test/kit/` — los campos de la plantilla y su mención en la migración y la init.
- `skills/sdd-verify/SKILL.md` — bloque «Running a gate» y la línea `Gate:`.
- `skills/sdd-archive/SKILL.md` — paso 1 («The suite»: remite a «Running a gate») y paso 6 (viñetas, lo que trae la base, conflicto de docs).
- `skills/sdd-archive/references/merge-recipe.md` — «Integrated base» (`base: conflicto en`, «The suite again» remite al paso 6), «A red suite» (el arreglo remite a «Running a gate»), tabla de salidas.
- `skills/sdd-start-feature/SKILL.md` paso 7, `skills/sdd-worktrees/SKILL.md` Step 3, `skills/sdd-propose/SKILL.md` «Config lane» paso 2 — una línea cada uno que remite a «Running a gate».
- `tests/batteries/sdd-archive/{battery.md,subject.mjs}` y `fixtures/gate/gate.json` — escenarios `g7`, `g8`, `m1`, `m2`.
- `tests/batteries/sdd-verify/{battery.md,subject.mjs}` — escenarios `t1`, `t2`.
- `tests/batteries/sdd-init/{battery.md,subject.mjs}` — escenario `n7`.
- `tests/batteries/sdd-upgrade/{battery.md,subject.mjs}` y `mold-v2x/` — escenarios `v4`, `g2`.
- `tests/batteries/sdd-propose/{battery.md,subject.mjs}` — escenario `pl3`.

**NO se tocan**:

- `cli/src/` — `sdd merge --verify` ya cruza y lee `--include-relations` (0235); no lee «Sin filtro» (spec, decisión 14).
- `skills/sdd-end-release/` — 0257.
- `.docs/sdd/tech-stack.md` §Testing de este repo — spec, «No entra».
- `skills/sdd-start-patch/`, `skills/sdd-tdd/`, `skills/sdd-implement/` — spec, «No entra».

### 1.6 Dependencias

- Feature 0235 (`--verify` por intersección, `--include-relations`), ya en `develop`. La 0257 va tras esta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED sale limpio en algún escenario | media | medio | se lee de dónde sacó la conducta; si fue de una fuente incidental, otra tanda; si no, la regla de ese escenario no se escribe (Art. I) |
| El paso 7 de `sdd-start-feature` no abre «Running a gate» | media | medio | `g7` entra por `sdd-archive`; si el GREEN falla por no leerlo, la regla sube al paso (spec, decisión 11) |
| Un merge de sincronización con conflicto real en el molde de `m1` sale distinto al de la 0235 §3 | media | bajo | el molde planta las dos versiones de la fila con `git` y comprueba `base: conflicto en .docs/sdd/roadmap.md.` antes de lanzar |
| El coste pasa de lo aprobado | media | medio | tope de proceso a 22 $ (decisión 6) |

### 1.8 Rollout

Directo: entra en la 3.0.0, aún sin publicar; los campos van en el paso 2 de `v3.0.0.md` (spec, decisión 19).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `operations.md` con nivel, «Sin filtro», «Lint» y «CI de la base», y quien los propone

**Tras**: —
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: hilo principal · `n7` (`sdd-init`), `v4` y `g2` (`sdd-upgrade`), `pl3` (`sdd-propose`), con el kit de `b8ab5635`, n = 1; y el test de Vitest de los campos, en rojo
**Superficies**: docs (skills, plantillas), tooling (tests)
**Verificación**: `npx vitest run test/kit/migration-init-parity.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`; GREEN de `n7`, `v4`, `g2`, `pl3`, n = 2 → sus filas 2/2

**Interfaces**:
- Consume: nada
- Produce: en `operations-template.md` §Testing, los campos con estas etiquetas literales, que leen las Tasks 2 y 3:
  - `- **Suites**: <una por línea: nombre · comando · duración · nivel (unitario, integración, E2E o pendiente), p. ej. `unit` · `dotnet test Api.UnitTests` · ~20 s · unitario>`
  - `- **Gate de cierre**: <una orden: la integración y los E2E por lo afectado, p. ej. `moon run :integration :e2e --affected --base develop --include-relations`; sin forma de filtrar, la suite entera. Las suites unitarias y pendientes no van aquí: el cierre las corre enteras>`
  - `- **Sin filtro**: <globs a cualquier profundidad del build, la configuración, las dependencias y los helpers comunes de los tests; si la rama o la base tocan uno, el gate corre sin filtro>`
  - `- **Lint**: <formato y estilo, al editar y en el pre-commit, solo sobre los ficheros tocados; nunca en el gate; typecheck y build siguen en el gate · ninguno>`
  - `- **CI de la base**: <pipeline que corre todas las suites en cada push a la rama de integración, un job a la vez · la orden que lee su último resultado, o `sin orden de lectura` · o `ninguna`>`
- Escenarios:
  - `n7` (`sdd-init`): molde con `package.json` (`test`: `vitest run`, `e2e`: `playwright test`, `lint`: `eslint .`), `vitest.config.ts`, `playwright.config.ts`, `tests/helpers/`, `.github/workflows/ci.yml`. Rúbrica: N7a «Suites» con nivel (`unit` pendiente, `e2e` E2E); N7b «Sin filtro» con `package.json`, `package-lock.json` y las dos configs y `tests/helpers/**`; N7c «Lint» `npm run lint`; N7d «CI de la base» con `.github/workflows/ci.yml` y la orden `gh run list …`.
  - `v4` (`sdd-upgrade`): molde `mold-v2x` con §Testing `backend` · `dotnet test` · ~13 min y `e2e` · `npx playwright test` · ~3 min, `.husky/pre-commit` con `lint-staged`, `azure-pipelines.yml`. Rúbrica: V4a nivel `pendiente` y `E2E`; V4b «Sin filtro» con `*.csproj` y `package.json`; V4c «Lint» `lint-staged`; V4d «CI de la base» `azure-pipelines.yml` · `sin orden de lectura`; V4e nada escrito antes del «sí».
  - `g2` (`sdd-upgrade`): «Gate de cierre» `moon run :test :lint` y una tarea `:typecheck` en otro gate. Rúbrica: G2a el informe lleva el aviso `Gate con lint: «moon run :test :lint» — …` literal; G2b la línea del gate no cambia; G2c no avisa del typecheck.
  - `pl3` (`sdd-propose`, plan): spec aprobada que cambia `Domain/Pricing.cs`, con «Suites» `unit` (unitario) y `api` (integración). Rúbrica: PL3a la «Verificación» de la task corre `unit` y no `api`; PL3b una task que escribe `Api.IntegrationTests/PeopleTests.cs` corre también ese fichero.

**Ficheros**: `operations-template.md`, `plan-template.md`, `sdd-init/SKILL.md`, `v3.0.0.md`, el test de `cli/test/kit/`, las baterías de `sdd-init`, `sdd-upgrade` y `sdd-propose`, `tests/project-gate-levels-red.md`

- [ ] **Step 1: Implementación** — test de Vitest `'operations-template declara los campos del gate'`: `expect(template).toContain('- **Sin filtro**:')`, `'- **Lint**:'`, `'- **CI de la base**:'`, y la línea de «Suites» contiene `unitario`; `'la migración a v3.0.0 propone los campos del gate'`: el paso 2 de `v3.0.0.md` nombra «Sin filtro», «Lint» y «CI de la base»; `'la init propone los campos del gate'`: la fila «How it is tested» de `sdd-init` también. Después, los moldes y la rúbrica, el RED, y los textos con los literales de «Produce» y de «De código».
- [ ] **Step 2: Build** — n/a (texto).
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; el RED y el GREEN en `tests/project-gate-levels-red.md` y `-green.md`, una fila por rúbrica.
- [ ] **Step 4: Commit de la task**.

### Task 2 — Correr un gate: unitarios enteros, salvaguarda, tras un rojo y lint

**Tras**: Task 1
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: hilo principal · `g7` (`sdd-archive`), `t1` y `t2` (`sdd-verify`), con el kit de `b8ab5635`, n = 1
**Superficies**: docs (skills), tooling (moldes)
**Verificación**: GREEN de `g7`, `t1`, `t2`, n = 2 → sus filas 2/2; humo de `g6` (`sdd-start-feature` paso 7), `w2` (`sdd-worktrees`) y `k6` (carril config), n = 1, sin regresión; `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: las tandas de sujetos, ~40 min, en segundo plano

**Interfaces**:
- Consume: las etiquetas «Suites» con nivel y «Sin filtro» (Task 1)
- Produce: en `sdd-verify`, el bloque `**Running a gate.**` con cuatro reglas, que la Task 3 y los pasos que lo nombran citan como «Running a gate of `sdd-verify`»:
  1. las suites de «Suites» con nivel `unitario` o `pendiente` corren enteras, con su orden, antes del gate; la línea las nombra primero;
  2. si la rama (o, tras `--sync`, la base) toca un fichero de «Sin filtro» —sin el campo, la lista por defecto de «De código»—, el gate corre sin `--affected` y cada tarea lleva `(sin filtro: cambia el build)`; el `moon.yml` de un proyecto es «cambia su definición», no build;
  3. tras una pasada roja en `<sha>`: los tests que fallaron, los de la tarea roja que no corrieron (o la tarea entera si la salida no lo dice), el gate con `--base <sha>` y las tareas que moon saltó por la roja; un arreglo solo de `.docs/` o `*.md` corre solo los tests que fallaron; un rojo que no es de un test repite su tarea; un arreglo que toca «Sin filtro» corre todo sin filtro;
  4. el lint no va en el gate: un rojo de lint se arregla en el fichero, lo comprueba el pre-commit y no repite el gate.
- Escenarios:
  - `g7` (`sdd-archive`): molde `reservas-gate-build`: `reservas` + `affectedGate`, `tech-stack.md` §Testing con `unit` · `node --test test/app.test.js` · ~1 s · unitario, `bookings:test` y `rooms:test` como integración, sin «Sin filtro»; la 0010 cambia `package.json` (un script nuevo) y `src/app.js`. Rúbrica: G7a corre el gate sin `--affected` (las dos tareas) y la suite `unit`; G7b la línea `Gate:` nombra `node --test test/app.test.js` y el gate antes de la flecha, y `rooms:test: corrió N/M (sin filtro: cambia el build)`.
  - `t1` (`sdd-verify`): molde con una pasada roja guardada en `a1b2c3d` (dos tests rojos de `bookings:test`) y un arreglo que solo toca `README.md`; petición: «el gate dio rojo en a1b2c3d; he arreglado el README; vuelve al gate y dame la línea Gate:». Rúbrica: T1a corre solo los dos tests rojos; T1b la línea empieza por `tras el rojo en a1b2c3d, arreglo <sha> solo de docs:`.
  - `t2` (`sdd-verify`): la misma pasada roja, con `rooms:test` saltada por depender de la roja, y un arreglo en `src/app.js`. Rúbrica: T2a corre los dos tests rojos, el gate con `--base a1b2c3d` y `rooms:test`; T2b la línea lleva `rooms:test: corrió N/M (no corrió en la pasada roja)`.

**Ficheros**: `skills/sdd-verify/SKILL.md`; `skills/sdd-archive/SKILL.md` paso 1 («The suite»: una frase que remite a «Running a gate of `sdd-verify`»); `skills/sdd-archive/references/merge-recipe.md` «A red suite» («fix it with a failing test first and go back to the gate as Running a gate says»); `skills/sdd-start-feature/SKILL.md` paso 7, `skills/sdd-worktrees/SKILL.md` Step 3 y `skills/sdd-propose/SKILL.md` «Config lane» paso 2, una frase cada uno; las baterías de `sdd-archive` y `sdd-verify`

- [ ] **Step 1: Implementación** — moldes y rúbrica, el RED, y el bloque con los literales de «De código»; cada paso que corre un gate lo nombra en la frase donde corre la suite.
- [ ] **Step 2: Build** — n/a.
- [ ] **Step 3: Verificación** — GREEN, humo y topes.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Lo que trae la base y el conflicto solo de docs

**Tras**: Task 2
**Modelo**: sesión (Native); sujetos `sonnet`
**Tests RED**: hilo principal · `g8`, `m1` y `m2` (`sdd-archive`), con el kit de `b8ab5635`, n = 1
**Superficies**: docs (skills), tooling (moldes)
**Verificación**: GREEN de `g8`, `m1`, `m2`, n = 2, y de `g5` (deuda de la 0230), n = 1 → sus filas en verde; control de `a3` (n = 1) sin regresión; `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`
**Verificación lenta**: las tandas de sujetos, ~45 min, en segundo plano

**Interfaces**:
- Consume: «Running a gate of `sdd-verify`» (Task 2)
- Produce: el paso 6 de `sdd-archive` en viñetas: (a) sin suite todavía: el gate de cierre una vez sobre el merge de sincronización, como dice «Running a gate»; (b) con suite: si la base trae un fichero de «Sin filtro», el gate sin filtro; si trae cambios que no son docs, las suites unitarias enteras y, con un gate filtrado, las tareas que salen con `--base <merge.into>` y también con `--base <sha de la suite de la validación>`; sin filtro, el gate entero; (c) el conflicto solo de docs con su contraejemplo, y el aviso literal; (d) el rojo, a la receta.
- Escenarios:
  - `g8`: `reservas-gate-base` con la 0015 que trae también `package-lock.json`. Rúbrica: G8a corre el gate sin `--affected` tras `--sync`; G8b la línea lleva `(sin filtro: cambia el build)`.
  - `m1`: la 0010 pone `**[Feature 0010, <fecha>: parcial — …]**` a una fila de deuda del roadmap cuyo «Destino» `develop` cambió de `**Esperar 2.º ticket**` a `**Actuar → 0012**`. Rúbrica: M1a la fila queda con el prefijo y `**Actuar → 0012**`, sin marcadores de conflicto; M1b el merge de sincronización está commiteado y el cierre fusiona; M1c el mensaje final lleva `Conflicto de la base resuelto por el agente: .docs/sdd/roadmap.md — …`.
  - `m2`: la rama pone `**Actuar → 0011**` y `develop` `**Descartada**` en el «Destino» de la misma fila. Rúbrica: M2a no resuelve el conflicto; M2b el cierre acaba en «No terminado» y `develop` sin la rama.

**Ficheros**: `skills/sdd-archive/SKILL.md` paso 6; `skills/sdd-archive/references/merge-recipe.md` («Integrated base»: `base: conflicto en` remite al paso 6; «The suite again» se queda en una frase que remite al paso 6; fila `base: conflicto en` de la tabla de salidas); la batería de `sdd-archive`

- [ ] **Step 1: Implementación** — moldes y rúbrica, el RED, y el paso 6 con los literales de «De código».
- [ ] **Step 2: Build** — n/a.
- [ ] **Step 3: Verificación** — GREEN, control y topes.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 5 h
- Base de la estimación: 3 tasks de texto con 31 sujetos; la 0221 (4 tasks, 4,5 h estimadas) se hizo en 2,45 h, y la 0235 (5 h) en 2,36 h; aquí hay el doble de sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `node cli/bin/sdd.js lock run -- moon run kit:test-headless cli:typecheck cli:test --affected --base develop` (`tech-stack.md` §Testing)
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `archive` «El gate corre entero si la rama toca el build…»: THEN y AND de la línea → Task 2, `g7` G7a y G7b. ✓ AND `README.md` y roadmap, no corre nada → Task 2, humo `k6` y el texto; sin sujeto propio. ⚠ AND `pendiente` corre entera → Task 2, texto de «Running a gate»; sin sujeto. ⚠ AND lista por defecto → Task 2, `g7` (sin «Sin filtro» en el molde). ✓ AND `moon.yml` → Task 2, humo `k6` (cambia su definición). ✓
- `archive` «Tras un rojo…»: THEN y la línea → Task 2, `t2`. ✓ AND bail → Task 2, texto; sin sujeto. ⚠ AND solo docs → `t1`. ✓ AND typecheck, «Sin filtro» y lint → Task 2, texto; sin sujeto. ⚠
- `archive` «Un conflicto de la base solo en docs…»: THEN y el aviso → Task 3, `m1`. ✓ AND frase en `tech-stack.md` → Task 3, texto; sin sujeto (misma regla que `m1`). ⚠ AND contraejemplo → `m2`. ✓
- `archive` `MODIFIED` «El cierre integra la base…»: lo vigente → `g5`. ✓ AND `pnpm-lock.yaml` → `g8`. ✓ AND unitarias tras `--sync` → Task 3, texto; sin sujeto. ⚠
- `archive` `MODIFIED` «Un rojo ajeno…» y «El walkthrough dice…»; `control-profiles` `MODIFIED`; Reglas de `archive` → Task 2 y Task 3, texto de la receta y del paso 6; control `a3`. ✓
- `verification` `MODIFIED` «La línea `Gate:`…» → `g7`, `t1`, `t2`. ✓
- `onboarding` dos `MODIFIED` → Task 1, Vitest y `n7`. ✓
- `migration` `ADDED` y `MODIFIED` → Task 1, `v4` y `g2`. ✓
- `feature-flow` `MODIFIED` → Task 1, `pl3`. ✓
- Las cláusulas ⚠ se cubren por el texto que las fija y la revisión final: cada sujeto de más cuesta 0,35-0,70 $ y la regla vecina ya la mide su escenario (avisado aquí antes de ejecutar).
- Review Focus → Task 2 (`g7` G7a), Task 2 (texto), Task 3 (tests de `cli/test/merge/`). ✓
