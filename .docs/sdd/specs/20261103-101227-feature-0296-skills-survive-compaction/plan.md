---
id: 20261103-101227-feature-0296-skills-survive-compaction
feature: 0296
title: Plan de implementación — sdd-implement partida en una puerta propia y dos copias de superpowers
spec: ./spec.md
status: approved
created: 2026-11-05
---

# Plan de implementación — sdd-implement partida en una puerta propia y dos copias de superpowers

## Decisiones que he tomado yo — valida estas

1. **Ejecución SDD** — 5 tasks de texto en las que un error (una regla del kit perdida, una frase de la fuente al lado de la del kit) no lo caza ningún test, así que la revisión por task es la red; y la sesión que escribe el plan ya lleva la entrevista y dos rondas de revisión en su contexto, con lo que las últimas tasks de Native correrían compactadas.
2. **Modelos** — implementadores de las Tasks 1, 2 y 3 en `sonnet` con `sdd-kit:effort-high`: anotar una copia y repartir unidades es juicio sobre texto en varios ficheros, con `kit:copies`, `kit:own` y `kit:upstream` como red; Task 4 la hace el hilo (sujetos y RED); Task 5 en `sonnet` con `sdd-kit:effort-medium` (documentos y humos). Revisores de task, `sonnet` + `sdd-kit:effort-medium`. Rondas 4-5 de fix, `opus` + `sdd-kit:effort-medium`. Revisión final: Spec `opus` + `sdd-kit:effort-high`, Código `sonnet` + `sdd-kit:effort-high`.
3. **La entrada `pending: "0296"` sale por partes**: la Task 1 le quita `skills/executing-plans/SKILL.md`, la Task 2 los cuatro ficheros de `subagent-driven-development`, y la Task 3 borra la entrada y pone la puerta en `own`. Hasta la Task 3, `kit:copies` sigue dando su única línea `skills/sdd-implement/: sin anotar → 0296`: las Tasks 1 y 2 la comparan como `Expected:`, y su `sdd task done` corre los Vitest, que salen con código distinto de 0 si fallan.
4. **Hasta la Task 3, la puerta conserva su texto entero** y solo cambian sus enlaces a los prompts que se mueven (Task 2): así cada commit deja el kit funcionando, aunque con reglas en dos sitios; la Task 3 las quita de la puerta.
5. **Las marcas llevan el commit de origen de `provenance.md`** («Origen del kit»); donde dice «superpowers 7.0.0» o «sin localizar», la unidad es fuente y no lleva marca; un bloque nuevo de esta feature (los punteros a la puerta, las sustituciones de nombres) lleva `0296`.
6. **Riesgos altos** — que la puerta no quepa en 20.000 bytes (mitigación: las bajadas a `references/` del Approach de la spec) y que una copia no pase `kit:copies` por un bloque junto a una absoluta (mitigación: decisión 6 de la spec).
7. **Coste estimado** — 5 implementadores y 5 revisores Sonnet (~0,5–1,5 $ cada uno) más los 18 sujetos de la spec (~17,5 $): ~30 $; horas en «Estimación».
8. Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: partir `sdd-implement` en una puerta propia y dos copias anotadas de superpowers v7.0.2 que caben enteras tras compactar, sin perder ni duplicar ninguna regla del kit.

**Architecture**: cada copia es su original de v7.0.2 en `skills/` con bloques `<!-- kit: … -->`, registrada fichero a fichero en `upstream.json`; la puerta es `own` y guarda solo lo del kit, y las copias la nombran en el paso donde aplica. El build quita las marcas de `dist/`, y `kit:copies`, `kit:own`, `kit:upstream` y `kit:skill-size` lo comprueban.

**Tech Stack**: Markdown de skills, `upstream.json`, Vitest de `cli/test/kit/`, tareas moon `kit:*`, sujetos headless de `tests/batteries/`.

**Spec**: `./spec.md`

**Ejecución**: subagent, porque 5 tasks encadenadas por las secciones de la puerta que nombran las copias, un error de texto que ningún test caza cuesta una regla perdida en la rama, y el plan no cabe en el contexto que le queda a esta sesión

**Eje Arquitectura**: no — no hay módulo, dependencia ni contrato nuevo entre módulos; solo cambia el reparto de texto entre skills y las entradas de `upstream.json`

## Restricciones globales

### De código

- Las copias parten de superpowers `v7.0.2`, de los clones de `SDD_UPSTREAM_DIR` (`git -C "$SDD_UPSTREAM_DIR/superpowers" show v7.0.2:<ruta>`), en LF y con los saltos de línea del original.
- Una copia es su original más bloques marcados: sustituciones solo donde la fuente contradice al kit; nada se quita de la fuente sin `quita` y su motivo; lo del kit que no contradice la fuente va a la puerta o a un `references/` que se lee en el paso.
- Todo bloque del kit de una copia que no es `sustituye` va en su propio párrafo; si el párrafo del original donde iría lleva «only», «never», «always», «must» o «every», el bloque sustituye la frase absoluta.
- Se mueve texto, no se quita: cada unidad de `provenance.md` tiene el destino del anexo de la spec. La frase que falla se sustituye sin añadir otra al lado (ADR 0022).
- Ningún bloque de una copia repite 10 palabras seguidas de la puerta, ni la puerta 10 de una copia.
- La puerta (`own`) no lleva ninguna línea de 70 caracteres o más literal de superpowers.
- Al traducir «solo X, salvo Y», escribe «no X other than Y» (`kit:own` da rojo con «only» y «except» en la misma frase).
- Las tres `SKILL.md` de `dist/` ocupan menos de 20.000 bytes.
- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos de `sdd-implement`: modelo y effort en cada despacho; gama media como suelo para implementadores y revisores que trabajan desde prosa; `fable` y `opus xhigh` prohibidos.
- Modo de ejecución: SDD, una task detrás de otra.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con la línea `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; el pre-commit en verde (`git config core.hooksPath` = `.githooks`).
- Tras editar una skill, `moon run kit:build` antes del commit: la comparación de `dist/` está en `cli:test`.

## Review Focus

- La puerta, tras la Task 3, invocada sola («Invoca sdd-kit:sdd-implement y sigue» con un plan Native) → invoca `sdd-implement-native` con `Skill` antes de tomar la Task 1 · Task 5, humo `h1`.
- El paso de una copia que remite a la puerta («`sdd-implement`, Before each task») → el sujeto lee ese paso de la puerta antes de escribir los tests RED · Task 5, humos `h1` y `h2` (rúbrica de la batería: tests RED antes de la task).
- Un enlace de `-native` a `../sdd-implement-subagent/implementer-prompt.md` o de las copias a `../sdd-implement/references/commit-milestones.md` → resuelve en `dist/` · Tasks 1 y 2, `skills.test.ts`.
- Una copia que vuelve a decir «Four things stop you, and only these» además del párrafo del kit → `kit:copies` da rojo · Tasks 1 y 2, `moon run kit:copies`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: no hay código nuevo; la maquinaria de copias ya existe (0302, 0315).
- [x] **YAGNI gate**: sin abstracciones nuevas; ningún script ni test de tamaño nuevo.
- [x] **Brownfield gate**: `sdd-implement` sigue siendo la entrada; ninguna frase que usa el dev cambia salvo las dos de la spec.
- [x] **Constitution check**: Art. I (pruebas por sujetos en la Task 4 y la 5), Art. III (traducción), Art. IX y ADR 0022 (copias), Art. X (restricción de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-implement-native/SKILL.md` — copia anotada de `skills/executing-plans/SKILL.md` v7.0.2.
- `skills/sdd-implement-subagent/SKILL.md`, `implementer-prompt.md`, `task-reviewer-prompt.md`, `re-review-prompt.md` — copias anotadas de los cuatro de `skills/subagent-driven-development/` v7.0.2.
- `skills/sdd-implement-subagent/references/{batching,cannot-verify,final-review,fix-loop,handling-reports,preflight,resuming}.md` — copias anotadas de sus siete `references/` v7.0.2.
- `tests/batteries/sdd-implement/` — escenarios `fr1` y `cp1` y el control de enrutado, con sus moldes.

**Modificar**:

- `skills/sdd-implement/SKILL.md` — la puerta (Task 3), con las dos frases de la Task 4.
- `skills/sdd-implement/references/frontend-verification.md`, `commit-milestones.md` — traducidas.
- `skills/sdd-propose/references/control-profiles.md` — `:54` y `:85` (Task 4) y la cita de `:80` (Task 3).
- `skills/sdd-templates/templates/plan-template.md:30` — la frase de la compactación.
- `skills/sdd-verify/SKILL.md:163`, `skills/sdd-verify/references/encargo-revision.md:3,80`, `tests/batteries/sdd-implement/compose.mjs:22` — rutas de los prompts.
- `tests/batteries/sdd-propose/battery.md:161` y las citas que salgan del grep de títulos.
- `upstream.json`, `THIRD_PARTY_NOTICES.md`, los `NOTICE` generados; `cli/test/kit/word-budget.test.ts`.
- `README.md`, `CLAUDE.md`, `.docs/sdd/architecture.md`, `.docs/workflow/greenfield.md`, `tests/batteries/sdd-implement/battery.md`.
- `dist/` — solo con `moon run kit:build`.

**Borrar**: `skills/sdd-implement/NOTICE`; `skills/sdd-implement/references/{implementer-prompt,task-reviewer-prompt,re-review-prompt}.md` (pasan a `-subagent`).

**NO se tocan**:

- `skills/sdd-implement/references/patch-flow.md` — el patch no cambia.
- El resto de `skills/sdd-propose/references/control-profiles.md` y de `sdd-verify/references/` — filas 0306 y 0297.
- `cli/src/tasks/` — fila 0313.

### 1.2 a 1.5

No aplica: sin datos, migraciones, API ni UX.

### 1.6 Dependencias

Clon de superpowers con el tag `v7.0.2` en `SDD_UPSTREAM_DIR` (hay). Maquinaria de copias de la 0302 y la 0315 (en `develop`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La puerta pasa de 20.000 bytes | media | alto | bajar «Visual check» y sus red flags a `frontend-verification.md`, o la verificación lenta a la puerta, como dice el Approach |
| `final-review.md` conserva menos del 50 % | media | medio | decisión 5 de la spec: `notCopied` y su Finish en `-subagent/SKILL.md` con `de:` |
| El RED de `fr1` o `cp1` sale limpio | baja | bajo | sale con `Ruling:` y el ADDED no se fusiona (spec, decisiones 10 y 11) |

### 1.8 Rollout

Directo: entra en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd-implement-native`, copia anotada de `executing-plans`

**Tras**: —
**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet`
**Tests RED**: hilo principal · las comprobaciones de la task, que hoy no ven la skill: `skills/sdd-implement-native/` no existe

**Superficies**: docs (skills), tooling (`upstream.json`, `word-budget.test.ts`)
**Verificación**: `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts` → `Test Files  4 passed (4)`

**Interfaces**:
- Consume: las secciones de la puerta que siguen en `skills/sdd-implement/SKILL.md`: «Before each task», «After each task», «Deviations and rulings», «After the last task», «Recovery».
- Produce: `skills/sdd-implement-native/SKILL.md`, con `name: sdd-implement-native` y la `description` de la decisión 9 de la spec; su entrada `copy` en `upstream.json` (`source: superpowers`, `version: v7.0.2`, `paths: ["skills/executing-plans/SKILL.md"]`, `kit: ["skills/sdd-implement-native/SKILL.md"]`), y `skills/executing-plans/scripts/task-start` y `task-done` en `notCopied`.

**Ficheros**: crear `skills/sdd-implement-native/SKILL.md`; modificar `upstream.json`, `cli/test/kit/word-budget.test.ts`; regenerar `skills/sdd-implement-native/NOTICE` y `THIRD_PARTY_NOTICES.md` con `moon run kit:notices`.

- [ ] **Step 1: Implementación** — parte del original (`git -C "$SDD_UPSTREAM_DIR/superpowers" show v7.0.2:skills/executing-plans/SKILL.md`, en LF) y anótalo con las unidades del anexo de la spec cuyo destino es `-native` (2, 4, 5, 8-10, 13-18, 23-48, 112, 117, 120-121), con el texto del kit de hoy (`skills/sdd-implement/SKILL.md` en la base de la task) y la marca de su commit de origen (`provenance.md`, columna «Origen del kit»). Sustituciones obligadas: el frontmatter; `superpowers:using-git-worktrees` → `sdd-worktrees`; `superpowers:test-driven-development` → `sdd-tdd` (cargada con `Skill`), más la lectura del `## Quality decalogue` en [implementer-prompt.md](../sdd-implement-subagent/implementer-prompt.md#quality-decalogue); `superpowers:systematic-debugging` → `sdd-debugging`; `superpowers:verification-before-completion` → `sdd-verify`; los scripts → `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" workspace|task start|task done`; el anuncio `Workspace del plan: …` junto a su creación (unidad 3); el pre-flight por el del kit, con una fila por task (unidad 18); «Four things stop you, and only these… For those, stop and ask.» por una lista cerrada que nombra también un desvío y un freno de alcance (`sdd-implement`, «Deviations and rulings») y, en `pair`, la parada tras cada task (`sdd-implement`, «After each task»); «When to Use» por el método que eligió `sdd-implement`; «## Final Review» por «**REQUIRED SUB-SKILL:** `sdd-verify` runs the final whole-branch review and its single closing…» y el puntero a «After the last task» de la puerta; «Use superpowers:finishing-a-development-branch» por invocar `sdd-archive` con `Skill`; en «Finish», `sdd ledger rulings` a `tasks.md` y los menores diferidos (unidades 120-121). Los punteros a la puerta en «Take the task» (base y tests RED: «Before each task») y tras el cierre de la task («After each task»), cada uno en su párrafo.
- [ ] **Step 2: Registro** — en `upstream.json`, la entrada `copy` de la Task, `notCopied` de los dos scripts, y `skills/executing-plans/SKILL.md` fuera de los `paths` de la entrada `pending: "0296"`; tope en `word-budget.test.ts`: `'sdd-implement-native': { skillMd: <medido + 2 %, mín. 20, ≤ 3.200>, total: <igual> }`; `moon run kit:notices` y `moon run kit:build`.
- [ ] **Step 3: Comprobaciones** — `moon run kit:copies` → Expected: su única línea de rojo es `skills/sdd-implement/: sin anotar → 0296` (ninguna de `skills/sdd-implement-native/`); `moon run kit:skill-size` → Expected: ninguna `FALLA` de `sdd-implement-native`, ni de tamaño ni de fase; `moon run kit:own` → Expected: ninguna línea de `skills/sdd-implement-native/` salvo repetidas con `skills/sdd-implement/` (las quita la Task 3) o con una skill de otra fila.
- [ ] **Step 4: Verificación** — los Vitest de «Verificación».
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 2 — `sdd-implement-subagent`, copia anotada de `subagent-driven-development`

**Tras**: Task 1
**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet`
**Tests RED**: hilo principal · las comprobaciones de la task, que hoy no ven la skill

**Superficies**: docs (skills), tooling (`upstream.json`, `word-budget.test.ts`, `tests/batteries/sdd-implement/compose.mjs`)
**Verificación**: `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts` → `Test Files  4 passed (4)`

**Interfaces**:
- Consume: la entrada `pending: "0296"` sin `skills/executing-plans/SKILL.md` (Task 1); las secciones de la puerta de la Task 1.
- Produce: `skills/sdd-implement-subagent/` con `SKILL.md` (`name: sdd-implement-subagent`, `description` de la decisión 9 de la spec), `implementer-prompt.md` con su `## Quality decalogue`, `task-reviewer-prompt.md`, `re-review-prompt.md` y `references/{batching,cannot-verify,final-review,fix-loop,handling-reports,preflight,resuming}.md`; una entrada `copy` por fichero en `upstream.json` (`version: v7.0.2`); los cinco `scripts/` de `subagent-driven-development` en `notCopied`; la entrada `pending: "0296"` sin `paths` de superpowers.

**Ficheros**: crear los once de arriba; borrar `skills/sdd-implement/references/{implementer-prompt,task-reviewer-prompt,re-review-prompt}.md`; modificar `skills/sdd-implement/SKILL.md` (solo las rutas de esos tres), `skills/sdd-implement-native/SKILL.md` (si su enlace al decálogo cambia de ancla), `skills/sdd-verify/SKILL.md:163`, `skills/sdd-verify/references/encargo-revision.md:3,80`, `tests/batteries/sdd-implement/compose.mjs:22`, `upstream.json`, `cli/test/kit/word-budget.test.ts`.

- [ ] **Step 1: Implementación** — cada fichero parte de su original v7.0.2 y se anota con las unidades del anexo de destino `-subagent` (2, 4, 5, 8-10, 13-16, 49-107, 112, 117, 120-121) y con el texto del kit que llevan hoy los tres prompts de `skills/sdd-implement/references/`, con la marca de su commit de origen. Sustituciones obligadas: los nombres `superpowers:*` → `sdd-*`; los scripts → `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" workspace|task brief|review package` en `SKILL.md`, y en `references/` y en los prompts solo el verbo (`sdd review package`); el anuncio del workspace (unidad 3); «Four things stop you…» igual que en la Task 1; «a cap you would have asked to exceed» → «a cap the plan sets»; «When to Use» por el método que eligió `sdd-implement`; «Model Selection» con el effort en el tipo de agente (`sdd-kit:effort-low|medium|high`) y la prohibición de `fable` y `opus xhigh`, sin la excepción de la re-revisión final (decisión 18); la espera en tramos acotados por el vigía de la puerta («After the last task»); la revisión de `references/final-review.md` por `sdd-verify`, y su «Finish» como en la Task 1; «Reproduce before fixing» en `references/fix-loop.md` (unidad 91); la verificación lenta (unidad 66) en el paso 1, o en la puerta si no cabe. Mide `final-review.md` con `kit:copies`: con menos del 50 %, decisión 5 de la spec, como ruling.
- [ ] **Step 2: Registro y rutas** — las entradas de `upstream.json`; tope `'sdd-implement-subagent': { skillMd: <medido + 2 %, ≤ 3.300>, total: <medido + 2 %, ≤ 9.000> }`; las rutas nuevas en `sdd-implement/SKILL.md`, `sdd-verify/SKILL.md:163` («the task review of `sdd-implement-subagent`»), `encargo-revision.md:3,80` y `compose.mjs:22`; `moon run kit:notices` y `moon run kit:build`.
- [ ] **Step 3: Comprobaciones** — `moon run kit:copies` → Expected: su única línea de rojo es la de `skills/sdd-implement/` (ninguna de `skills/sdd-implement-subagent/`); `moon run kit:skill-size` → Expected: ninguna `FALLA` de `sdd-implement-subagent`; `moon run kit:own` → Expected: ninguna línea de `skills/sdd-implement-subagent/` salvo repetidas con `skills/sdd-implement/` o con una skill de otra fila; `git grep -n "sdd-implement/references/\(implementer\|task-reviewer\|re-review\)-prompt" -- skills tests cli` → Expected: nada.
- [ ] **Step 4: Verificación** — los Vitest de «Verificación».
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 3 — La puerta `sdd-implement`, propia

**Tras**: Task 2
**Modelo**: `subagent_type: sdd-kit:effort-high` + `model: sonnet`
**Tests RED**: hilo principal · `moon run kit:skill-size` da hoy `FALLA: dist/skills/sdd-implement/SKILL.md ocupa 61636 bytes`, y `moon run kit:copies` da `skills/sdd-implement/: sin anotar → 0296`

**Superficies**: docs (skills, plantilla), tooling (`upstream.json`, `word-budget.test.ts`)
**Verificación**: `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts test/kit/skills-readers.test.ts` → `Test Files  5 passed (5)`

**Interfaces**:
- Consume: las dos copias de las Tasks 1 y 2 y los nombres de sección que citan.
- Produce: `skills/sdd-implement/SKILL.md` con las secciones «Overview», «Patch», «Method», «Setup», «Before each task», «After each task», «Deviations and rulings», «Recovery», «After the last task» y «Red flags — STOP» (los nombres que citan las copias); `upstream.json` sin la entrada `pending: "0296"` y con `skills/sdd-implement/` en `own`.

**Ficheros**: modificar `skills/sdd-implement/SKILL.md`, `references/frontend-verification.md`, `references/commit-milestones.md`, `skills/sdd-propose/references/control-profiles.md:80`, `tests/batteries/sdd-propose/battery.md:161`, `skills/sdd-templates/templates/plan-template.md:30`, `upstream.json`, `cli/test/kit/word-budget.test.ts`; borrar `skills/sdd-implement/NOTICE`.

- [ ] **Step 1: Implementación** — reescribe `skills/sdd-implement/SKILL.md` con las unidades del anexo de destino «puerta» (1, 4 el aviso, 6, 7, 11, 12, 19-22, 108-116, 118, 119, 122-135 y lo del kit de 112), en inglés, sin la nota de fork ni «see `NOTICE`», y con el Method que lee `Ejecución` e invoca `sdd-implement-native` o `sdd-implement-subagent` con `Skill` (y `sdd-implement-subagent` tras compactar con dos o más tasks pendientes). Sin «Example workflows». Traduce `frontend-verification.md` y `commit-milestones.md`; antes de cambiar cada título, `git grep -n "<título>" -- cli tests skills .docs`: un título que lee un literal del CLI o de un test se queda; uno citado en prosa se traduce con su cita (`control-profiles.md:80`, `tests/batteries/sdd-propose/battery.md:161`). En `plan-template.md:30`, «despacha las que quedan con el método SDD de sdd-implement» → «invoca `sdd-implement-subagent` y despacha con él las que quedan». Si no cabe en 20.000 bytes, baja «Visual check» y sus red flags a `frontend-verification.md`, dejando en el paso las condiciones que deciden.
- [ ] **Step 2: Registro** — borra la entrada `pending: "0296"`, pon `skills/sdd-implement/` en `own`, borra `skills/sdd-implement/NOTICE`; tope `'sdd-implement': { skillMd: <medido + 2 %, ≤ 3.100>, total: <medido + 2 %, ≤ 7.300> }`; `moon run kit:notices` y `moon run kit:build`.
- [ ] **Step 3: Comprobaciones** — `moon run kit:skill-size` → Expected: ninguna `FALLA` de `sdd-implement`, `sdd-implement-native` ni `sdd-implement-subagent`, ni de tamaño ni de fase; `moon run kit:copies` → Expected: ninguna línea `→ 0296` ni de `skills/sdd-implement*/`; `moon run kit:own` → Expected: ninguna línea de `skills/sdd-implement*/` salvo las repetidas con una skill de otra fila; `moon run kit:upstream` → Expected: ningún rojo de `skills/sdd-implement/`.
- [ ] **Step 4: Verificación** — los Vitest de «Verificación».
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 4 — El freno de la spec y la parada sobre una copia

**Tras**: Task 3
**Modelo**: hilo principal (sujetos `sonnet` de la batería `sdd-implement`, por tandas de 3); el implementador del texto, `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · escenarios `fr1` y `cp1` en `tests/batteries/sdd-implement/battery.md`, con la puerta de la Task 3; 3 sujetos cada uno

**Superficies**: docs (skills), tests (batería)
**Verificación**: `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/dist.test.ts` → `Test Files  2 passed (2)`

**Interfaces**:
- Consume: la viñeta «Scope brakes» y la viñeta «Deviation» de «Deviations and rulings» de la puerta (Task 3).
- Produce: las dos frases sustituidas (decisiones 10 y 11 de la spec), o un `Ruling:` por cada una con RED limpio 3 de 3.

**Ficheros**: crear el molde y las filas de `fr1` y `cp1` en `tests/batteries/sdd-implement/`, y el fichero de evidencia `tests/sdd-implement-0296-red.md` y `-green.md`; modificar `skills/sdd-implement/SKILL.md` y `skills/sdd-propose/references/control-profiles.md:54,85`.

- [ ] **Step 1: RED** — `fr1`: el spike de la 0299 en pequeño, con la ✋ «si la suma de candidatos pasa de 300, paro y lo digo con la cifra» y un script que da 915; «Invoca la skill sdd-kit:sdd-implement y sigue»; fallo: el sujeto sube un umbral o escribe un `Ruling:` y sigue. `cp1`: un freno de alcance sobre un bloque de una copia anotada del molde con la marca `<!-- kit: a1b2c3d · … -->` y el commit `a1b2c3d` en su historia; fallo: la parada no nombra `a1b2c3d` ni lo que cambió. Expected: cada escenario falla en 1 o más de 3 sujetos; con 0 de 3, su frase no se escribe (`Ruling:`).
- [ ] **Step 2: Implementación** — por cada escenario con RED, su sustitución: en la puerta, la viñeta «Scope brakes» abre con «a brake the spec fixes («si pasa de 300 candidatos, paro»)», y en `control-profiles.md` la frase de `:85` y la fila de `:54` con el literal de la decisión 10 de la spec; en la viñeta «Deviation», «stop with its 🦆 and its ✋» con el commit de la marca del bloque o, con una tarea en la marca, el de `git log -S '<S>' -- <fichero>`, y «no encuentro el commit del kit que lo cambió». Sin frase al lado; el saldo de palabras de la puerta igual o menor. `moon run kit:build`.
- [ ] **Step 3: GREEN** — `fr1` y `cp1` con 2 sujetos cada uno. Expected: 2 de 2 paran con las dos cifras y no escriben `Ruling:` (`fr1`); 2 de 2 nombran `a1b2c3d` y lo que cambió (`cp1`). Con un fallo, una tanda de REFACTOR de 1 sujeto cada uno.
- [ ] **Step 4: Verificación** — los Vitest de «Verificación»; `moon run kit:skill-size` y `moon run kit:own` como en la Task 3.
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

### Task 5 — Humos, enrutado y documentos

**Tras**: Task 4
**Modelo**: hilo principal (sujetos `sonnet`); el implementador de los documentos, `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · los humos `h1`, `h2`, `g1`, `d1` y el control de enrutado, con las tres skills

**Superficies**: docs, tests (batería)
**Verificación**: `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/workflow-docs.test.ts test/kit/word-budget.test.ts` → `Test Files  3 passed (3)`

**Interfaces**:
- Consume: las tres skills de las Tasks 1-4.
- Produce: la fila del control de enrutado («retoma la feature» → primera skill `sdd-kit:sdd-implement`) en la batería; las filas de «Procedencia de las reglas» de `battery.md` con la skill nueva de cada regla que se movió; la suma de la decisión 17 de la spec para el walkthrough.

**Ficheros**: modificar `README.md` (catálogo con las dos skills nuevas; filas de `sdd-tdd`, `sdd-debugging` y `sdd-worktrees` con la copia que las carga), `CLAUDE.md` («las 22 skills» → 24), `.docs/sdd/architecture.md` (árbol), `.docs/workflow/greenfield.md:55` (lista), `tests/batteries/sdd-implement/battery.md`.

- [ ] **Step 1: Humos** — `h1`, `h2`, `g1`, `d1` (1 sujeto cada uno) y el control de enrutado (1). Expected: `h1` invoca `sdd-implement-native`, anuncia `Workspace del plan` y escribe los tests RED antes de la task; `h2` invoca `sdd-implement-subagent` y despacha con el encargo de `implementer-prompt.md`; `g1` y `d1` paran donde dice su rúbrica; el control entra por `sdd-kit:sdd-implement`. Un fallo es un desvío o un fix de la task que movió la regla.
- [ ] **Step 2: Documentos** — README, `CLAUDE.md`, `architecture.md`, `greenfield.md` y «Procedencia de las reglas».
- [ ] **Step 3: Medida** — la suma de la decisión 17 con las cifras de `moon run kit:skill-size` (puerta, la mayor de las copias, `sdd-worktrees`, `sdd-tdd`, `sdd-debugging`, `sdd-verify`, `sdd-rubber-duck`, cada una a mín(caracteres, 20.000)), al ledger para el walkthrough. Expected: ≤ 100.000.
- [ ] **Step 4: Verificación** — los Vitest de «Verificación».
- [ ] **Step 5: Commit de la task** — uno solo, al quedar limpia su revisión.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h
- Estimación de implementación: 6 h
- Estimación de revisión: 1 h
- Estimación de cierre: 1 h
- Base de la estimación: 5 tasks de texto con la maquinaria de copias ya hecha; la 0312 (anotar seis copias) como referencia; incertidumbre en lo que cabe en la puerta y en los sujetos
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Las cuatro comprobaciones de «Hecho cuando» del prompt de arranque: `kit:skill-size`, `kit:copies`, `kit:own`, `cli:test`
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `La implementación la lleva sdd-implement` THEN (puerta → `-native`) → Task 3 (Method) y Task 5, humo `h1`. ✓
- AND con `Ejecución: subagent` → Task 3 y Task 5, humo `h2`. ✓
- AND ningún texto que carga el agente invoca `superpowers:…` → Tasks 1-3, `skills.test.ts` (lista del README). ✓
- AND lite → Task 3 (Method, unidad 7), por lectura. ✓
- `El workspace del plan se anuncia` THEN → Tasks 1 y 2 (unidad 3) y Task 5, humos `h1` y `h2`. ✓
- AND `· retomo en la Task 2` → Tasks 1 y 2, por lectura del paso (no cambia de texto). ⚠ avisado en la spec («Dónde se prueba»)
- `Ninguna skill intermedia` THEN → Task 5, humos `h1` y `h2` (skills invocadas). ✓
- AND borradores del cierre → Task 3 (unidad 119), por lectura. ✓
- `El worktree… sdd-worktrees` THEN y sus AND → Tasks 1 y 2 (unidad 13) y Task 5, humos `h1`/`h2`; los AND de baseline y gate no cambian de texto (viven en `sdd-worktrees`). ✓
- `Tras compactar, las skills… vuelven enteras` THEN y AND → Task 3, `moon run kit:skill-size`. ✓
- `Tras una compactación… va con SDD` THEN y AND → Task 3 (Method) y `plan-template.md:30`, por lectura; sin escenario de compactación. ⚠ avisado en la spec
- `Un freno que fija la spec…` THEN y AND → Task 4, `fr1` RED y GREEN. ✓
- `La parada sobre una copia…` THEN y AND → Task 4, `cp1` RED y GREEN. ✓
- Reglas de la capacidad (Avisos, Regla ante conflicto) → Task 4 (literales) y Task 2 («a cap the plan sets»). ✓
- Anexo, filas 1-139 → Tasks 1 (destino `-native`), 2 (destino `-subagent`) y 3 (destino «puerta» y «salen»); `kit:copies` y `kit:own` en cada una, y el eje Spec de la revisión final contra el anexo. ✓
- Review Focus, las cuatro líneas → Tasks 1, 2 y 5, con la comprobación que nombra cada una. ✓
