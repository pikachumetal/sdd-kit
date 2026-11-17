---
id: 20261026-162553-feature-0226-drop-phrase-tests
feature: 0226
title: Plan de implementación — Frases fuera y anatomía a Vitest
spec: ./spec.md
status: draft
created: 2026-10-26
---

# Plan de implementación — Frases fuera y anatomía a Vitest

## Decisiones que he tomado yo — valida estas

1. **Dos tasks, no tres**: la Task 1 porta y borra los 57 Pester a la vez. Borrar por tandas rompe el pre-commit: `PlanEntry.Tests.ps1` (de frase) lee `tests/WorkflowDocs.Tests.ps1` (portado).
2. **Modelo**: Native, con la sesión como implementadora (Opus 5.5; el dev-lead aprobó sin parar antes de la Task 1). La revisión final va en ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
3. **Redondeo de los topes con margen**: al par, como el `[int]` de PowerShell. Con `Math.round`, `using-sdd` (570 × 1,25 = 712,5) pasaría de 712 a 713 y `sdd-config` (1.450 × 1,25 = 1.812,5) de 1.812 a 1.813: dejarían de ser «los mismos topes».
4. **Ayudante común**: `cli/test/kit/kit-files.ts` con la raíz del repo, el listado de `.md` y el frontmatter. No se reutilizan los de `docs-claims.test.ts` ni `docs-integrity.test.ts`, que no los exportan; no se tocan.
5. **`path-length`** usa `gitSync` de `cli/src/git/git.ts`, que ya limpia las variables de git de un hook.
6. **Skills invocadas**: se reconocen `sdd-kit:<nombre>` (debe existir `agents/<nombre>.md` o `skills/<nombre>/`) y una skill del kit entre comillas invertidas, `` `sdd-<nombre>` ``, `` `using-sdd` `` o `` `add-to-changelog` `` (debe existir `skills/<nombre>/`). Fuera: `references/migrations/` y los `NOTICE`. Medido: hoy todos los nombres existen.
7. **`NOTICE`**: toda carpeta de skill con un `.md` que contiene «Adapted from» o «Adaptado de» lleva `NOTICE`. Medido: hoy los diez lo llevan.
8. Coste: ~2 h de sesión, sin sujetos ni subagentes salvo los dos ejes de la revisión final.
- Review Focus: 3 entradas; ver la sección.

**Goal**: dejar en `tests/` solo los 10 Pester de conducta y llevar a `cli/test/kit/` lo que rompe algo de verdad más los topes.

**Architecture**: ficheros Vitest nuevos dentro del paquete `cli/`, que `cli:test` ya ejecuta en el pre-commit; `cli/moon.yml` amplía los `testInputs` para que moon no los dé por buenos desde la caché.

**Tech Stack**: TypeScript con Vitest, solo módulos `node:*`; moon 2.6.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks, la segunda solo cambia texto y no consume ninguna interfaz de la primera, un error de la primera lo caza su propio RED y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — ficheros de test dentro de un paquete que ya existe y `inputs` de una tarea de moon; ni módulo, ni dependencia, ni contrato

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo).
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. Texto humano (nombres de test, mensajes de fallo) en castellano con tildes.
- Topes de palabras idénticos a los de `tests/WordBudget.Tests.ps1`, con su margen `1.25` de la fila B21 y su comentario; ruta máxima 140 caracteres; `description` de 1.024 caracteres como máximo.
- No se tocan: `moon.yml` raíz, `.githooks/`, `tests/Invoke-KitTests.ps1`, ni los 10 Pester de conducta (`HeadlessLauncher`, `Battery`, `SubjectOutputPrivacy`, `UpstreamWatch`, `Clear-GitEnv`, `Hook`, `DenyKillHook`, `KitSessionSource`, `TempDir`, `FastSuiteBudget`).

### De proceso

- Política de modelos: la de `sdd-implement` (Art. IV); `fable` y `opus xhigh`, prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; antes de commitear, `git diff --cached --name-only`.
- Nunca `--no-verify`.

## Review Focus

- Un tope con el margen que cae en ,5 (570, 1.450, 1.750) → el mismo entero que daba PowerShell (712, 1.812, 2.188) · Task 1, `aplica el margen redondeando al par`
- Una ruta sin versionar y no ignorada de 140 caracteres → falla igual que una versionada · Task 1, verificación del RED de `path-length` con un fichero sin `git add`
- `sdd-kit:effort-<low|medium|high>` escrito como plantilla en una skill → no es una skill invocada y no falla · Task 1, `toda skill invocada existe`, que pasa con el árbol de hoy

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se porta menos de lo que había; los nombres retirados pasan de 11 listas a un test.
- [x] **YAGNI gate**: el ayudante común tiene 9 usuarios.
- [x] **Brownfield gate**: sigue el patrón de `cli/test/docs-claims.test.ts`.
- [x] **Constitution check**: Art. I (topes intactos, RED mecánico de las ediciones de skill), Art. X, Art. XI (ADR nueva sin editar la 0011).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/test/kit/kit-files.ts` — `repoRoot: string`, `markdownFiles(dir: string, skip?: RegExp): string[]`, `frontmatter(text: string): Record<string, string>`, `readText(relative: string): string`.
- `cli/test/kit/word-budget.test.ts` — topes de palabras.
- `cli/test/kit/path-length.test.ts` — rutas de menos de 140.
- `cli/test/kit/skills.test.ts` — carga y navegación de las skills, índice de `sdd-templates`, lista de superpowers del README, manifests, skills invocadas, `NOTICE`, nombres de proyectos reales.
- `cli/test/kit/agents.test.ts` — los tres tipos de agente por effort.
- `cli/test/kit/workflow-docs.test.ts` — marcador de revisión y enlaces rotos de `.docs/workflow/`.
- `cli/test/kit/migration-init-parity.test.ts` — paridad migración–init.
- `cli/test/kit/roadmap-template.test.ts` — cabecera de release del validador igual a la de la plantilla.
- `cli/test/kit/manifests.slow.test.ts` — `claude plugin validate`.
- `.docs/sdd/decisions/0019-skills-not-tested-by-phrases.md` — ADR.

**Modificar**:

- `cli/moon.yml` — `testInputs`.
- `skills/sdd-upgrade/SKILL.md`, `skills/sdd-templates/templates/spec-template.md` — ruta.
- `.docs/sdd/constitution.md`, `.docs/sdd/architecture.md`, `.docs/sdd/tech-stack.md` (líneas de estado 6-8 y 32), `README.md`, `CLAUDE.md` — rutas y el estado de los Pester.
- `.docs/sdd/roadmap.md` — texto de las filas 0224 y 0227.

**Borrar**: los 57 `tests/*.Tests.ps1` que no son de conducta.

**NO se tocan**:

- Los 10 Pester de conducta, `tests/Invoke-KitTests.ps1`, `moon.yml`, `.githooks/` — 0227 y 0228.
- Las ADR 0001-0018 — inmutables (spec, decisión 11).
- `capabilities/` — cambia al fusionar el delta en el cierre.
- Los aprendizajes de `tech-stack.md` que citan Pester — historia.

### 1.6 Dependencias

Ninguna nueva.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un `It` útil borrado por error en un fichero mixto | baja | un commit roto pasa | tabla de la spec; la revisión final la contrasta con los ficheros borrados (`git show develop:tests/<x>.Tests.ps1`) |
| `claude` en Windows es un `.cmd` y `spawnSync` sin shell no lo encuentra | media | `manifests` se salta siempre | resolverlo con `where`/`which` y lanzar la ruta; el RED comprueba que corre |

### 1.8 Rollout

Directo.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Lo útil a Vitest y los 57 Pester fuera

**Tras**: —
**Modelo**: sesión (Native), Opus 5.5
**Tests RED**: hilo principal, Native: cada test nuevo se ve fallar una vez con un mutante (abajo) antes de darlo por bueno; el mutante se deshace y su salida va al walkthrough.
**Superficies**: tooling
**Verificación**: `cd cli && NO_COLOR=1 pnpm exec vitest run test/kit --exclude "**/*.slow.test.ts"` → `Test Files  8 passed (8)`; `NO_COLOR=1 pnpm exec vitest run test/kit/manifests.slow.test.ts` → `1 passed`; `moon run kit:test-fast` → verde con 10 ficheros
**Se prueba en la aplicación**: no, porque es tooling del repo: lo que se ve es un commit que el pre-commit para o deja pasar.

**Interfaces**:
- Consume: `gitSync(cwd: string, args: string[]): string[] | null` de `cli/src/git/git.ts`.
- Produce: los ficheros de `cli/test/kit/` y sus rutas, que la Task 2 escribe en los documentos: `cli/test/kit/word-budget.test.ts`, `cli/test/kit/migration-init-parity.test.ts`, `cli/test/kit/workflow-docs.test.ts`, `cli/test/kit/path-length.test.ts`, `cli/test/kit/skills.test.ts`, `cli/test/kit/manifests.slow.test.ts`.

**Ficheros**: crear los de `cli/test/kit/`; modificar `cli/moon.yml`; borrar 57 `tests/*.Tests.ps1`.

- [ ] **Step 1: `kit-files.ts`** — `repoRoot = fileURLToPath(new URL('../../../', import.meta.url))`; `markdownFiles(dir, skip)` recursivo, absoluto; `frontmatter` lee el bloque `---` inicial y devuelve `clave: valor` recortado (como `Get-Frontmatter` de `tests/Skills.Tests.ps1`).
- [ ] **Step 2: `word-budget.test.ts`** — copia literal de la tabla `Budgets` de `tests/WordBudget.Tests.ps1` (`skills`, `kit: 91328`, `anchors` de `constitution.md`, `mission.md`, `architecture.md`, `tech-stack.md` en `.docs/sdd/`) y `const slack = 1.25` con el comentario «Margen del 25 % sobre cada tope hasta la v3 y su limpieza (dev-lead, patch 0220, 2026-10-26).». `words(text) = text.split(/\s+/).filter(Boolean).length`; skill completa = todos los `.md` de su carpeta salvo `references/migrations/`. `budgetWithSlack(n) = roundHalfToEven(n * slack)`. Tests: `toda skill tiene tope: %s`, `%s: SKILL.md cabe en su tope`, `%s: la skill completa cabe en su tope`, `el kit entero cabe en su presupuesto`, `%s cabe en su tope` (documentos), y `aplica el margen redondeando al par`: `expect([570, 1450, 1750].map(budgetWithSlack)).toEqual([712, 1812, 2188])`. Mensaje de fallo: `mide <n> y el tope es <t>: recorta, o sube el tope con la decisión del dev-lead escrita en la spec`. RED: bajar el tope de `sdd-archive` a 100 → falla `sdd-archive: SKILL.md cabe en su tope`.
- [ ] **Step 3: `path-length.test.ts`** — `gitSync(repoRoot, ['-c', 'core.quotepath=off', 'ls-files', '--cached', '--others', '--exclude-standard'])`; `MAX_RELATIVE_LENGTH = 140` con el comentario del Pester sobre los 260 de Windows. Tests: `lista ficheros versionados` (> 0) y `ninguna ruta relativa llega a 140 caracteres` (lista `"<n> <ruta>"` vacía). RED: un fichero sin versionar en `.temp/`… no vale (ignorado): crear `tests/` + nombre de 140 caracteres sin `git add` → falla; borrarlo.
- [ ] **Step 4: `skills.test.ts`** — por cada carpeta de `skills/`: `name` igual a la carpeta, carpeta en kebab-case, `description` ≤ 1024, sin `/@(references|templates|scripts|skills)\//`, cada enlace `](references|templates|scripts/…)` existe, cada `references/*.md` enlazado desde `SKILL.md` (sin `references/` se salta). `sdd-templates`: los enlaces `](templates/x)` de `SKILL.md`, únicos y ordenados, igual a los `.md` de `templates/`. README: la frase `invoca **N skills de superpowers**: …` da la misma lista y el mismo número que las `superpowers:<nombre>` citadas en `skills/`. Manifests: `plugin.json` versión `^\d+\.\d+\.\d+$`, una dependencia `superpowers` con `marketplace: 'superpowers-marketplace'`; `marketplace.json` con `allowCrossMarketplaceDependenciesOn` igual a `['superpowers-marketplace']`, la entrada del plugin con `source: '.'` y `description` no vacía. `toda skill invocada existe` (decisión 6 de este plan, regex `/sdd-kit:([a-z]+(?:-[a-z]+)*)(?![-<a-z])/g` y ``/`((?:sdd|using)-[a-z]+(?:-[a-z]+)*|add-to-changelog)`/g``; lista de `fichero: nombre` sin destino, vacía). `toda skill adaptada lleva NOTICE` (decisión 7). `ningún fichero de skills/ nombra un proyecto real: %s`, con la lista `RealProjectNames` literal de `tests/NamingConvention.Tests.ps1` y su comentario, sobre todos los ficheros de `skills/`. RED: `sdd-end-feature` entre comillas invertidas en una skill → falla `toda skill invocada existe`; un enlace a `references/nope.md` → falla el de enlaces.
- [ ] **Step 5: `agents.test.ts`** — los `.md` de `agents/` son exactamente `effort-high`, `effort-low`, `effort-medium`; cada uno con `name: effort-<nivel>`, `description:` no vacía, `model: inherit`, `effort: <nivel>` y sin `tools:`. RED: `model: sonnet` en uno → falla.
- [ ] **Step 6: `workflow-docs.test.ts`** — existen `greenfield.md`, `brownfield.md`, `evidence-and-references.md`, `usage-guide.md`; `markerIsCurrent(text, pluginVersion)` (`Última revisión: kit vX.Y.Z` ≥ `plugin.json`) en los tres primeros salvo el anexo; `brokenRelativeLinks(text, baseDir)` con el slug de GitHub de `Get-HeadingSlug` y su `shortcut:` sobre títulos repetidos, sin enlaces rotos en los cuatro. Se portan sus tests de unidad: `acepta un marcador igual o posterior a plugin.json`, `rechaza un marcador anterior a plugin.json o ausente`, `detecta un enlace relativo roto y descarta URLs y anclas del propio documento`, `detecta un ancla que no es ningún título del fichero destino`, con los mismos valores del Pester. RED: el marcador de `usage-guide.md` a `kit v0.1.0` → falla.
- [ ] **Step 7: `migration-init-parity.test.ts`** — port de «Paridad migración–init» de `tests/MigrationInitParity.Tests.ps1` sin `sdd-upgrade fija la regla…`: migraciones `v*.md` que nombran `sdd-kit.json` (≥ 3); `v1.0.0.md`, `v1.1.0.md`, `v2.0.0.md` con tokens en `**Escribe**:`; corpus de `sdd-init` (`SKILL.md`, `references/*.md`, los `.md` que enlazan, `cli/src/init/*.ts`, sin `references/migrations/` ni `skills/sdd-upgrade/`) que contiene cada token; el corpus no contiene `**Escribe**:` ni `control.inventedKey`. RED: un token inventado en la línea `**Escribe**:` de `v2.3.0.md` → falla.
- [ ] **Step 8: `roadmap-template.test.ts`** — la línea `> | id |…` de `roadmap-template.md`, sin `> `, aparece entre comillas simples en `cli/src/roadmap/tables.ts`. RED: cambiar `Estado` por `State` en la plantilla → falla.
- [ ] **Step 9: `manifests.slow.test.ts`** — `claude plugin validate --strict skills`, `--strict .claude-plugin/marketplace.json` y `.claude-plugin/plugin.json` sin strict (el aviso por el `CLAUDE.md` de la raíz es inherente al repo), cada uno con `success: true` en su salida JSON como en `tests/Manifests.Tests.ps1`; `describe.skipIf(!claudePath)`. RED: comprobar que no se salta en esta máquina.
- [ ] **Step 10: `cli/moon.yml`** — `testInputs: ['/cli/**', '/skills/**', '/.docs/**', '/README.md', '/.claude-plugin/**', '/agents/**', '/tests/**']` (`/.docs/sdd/capabilities/**` queda dentro de `/.docs/**`); el comentario dice por qué. Prueba: `moon run cli:test` dos veces, tocar solo `.docs/workflow/usage-guide.md` (un espacio) y una tercera: la tercera no sale de la caché; deshacer el espacio.
- [ ] **Step 11: borrar los 57** — `git rm` de todos los `tests/*.Tests.ps1` menos los 10 de conducta; comprobar `ls tests/*.Tests.ps1 | wc -l` → 10.
- [ ] **Step 12: Verificación** — los comandos de «Verificación».
- [ ] **Step 13: Commit** — `test(kit): las frases fuera y lo que rompe algo a Vitest`.

### Task 2 — Las rutas nuevas en skills y documentos, y la ADR 0019

**Tras**: Task 1
**Modelo**: sesión (Native), Opus 5.5
**Tests RED**: smoke único (spec, decisión 7): `git grep -nE "(WordBudget|MigrationInitParity|RoadmapStructure|WorkflowDocs|Skills|PathLength|Manifests)\.Tests\.ps1" -- skills` antes (dos líneas: `sdd-upgrade/SKILL.md` y `spec-template.md`) y después (ninguna); las dos salidas al walkthrough.
**Superficies**: docs, skills
**Verificación**: el smoke de arriba → sin salida; `node cli/bin/sdd.js decision check --path .docs/sdd` → sale con 0; `node cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`; `cd cli && NO_COLOR=1 pnpm exec vitest run test/kit/word-budget.test.ts` → verde
**Se prueba en la aplicación**: no, porque solo cambia texto.

**Interfaces**:
- Consume: las rutas de la Task 1: `cli/test/kit/word-budget.test.ts`, `cli/test/kit/migration-init-parity.test.ts`, `cli/test/kit/workflow-docs.test.ts`, `cli/test/kit/path-length.test.ts`, `cli/test/kit/skills.test.ts`, `cli/test/kit/manifests.slow.test.ts`.
- Produce: nada.

**Ficheros**: los de «Modificar» de abajo y la ADR nueva.

- [ ] **Step 1: skills** — `skills/sdd-upgrade/SKILL.md`: «`tests/MigrationInitParity.Tests.ps1` checks it» → «`cli/test/kit/migration-init-parity.test.ts` checks it». `spec-template.md`, título de «Topes de palabras»: «como `tests/WordBudget.Tests.ps1`» → «como `cli/test/kit/word-budget.test.ts`». Mismo número de palabras.
- [ ] **Step 2: documentos** — `constitution.md` Art. I: «viven en `tests/WordBudget.Tests.ps1`» → «viven en `cli/test/kit/word-budget.test.ts`». `architecture.md` líneas 74-76: `WordBudget.Tests.ps1` → `word-budget.test.ts`. `tech-stack.md`: la última frase de la línea 6 («Los Pester que quedan… hasta la 0152») pasa a decir que los Pester que quedan (`tests/*.Tests.ps1`) son los de conducta, hasta la 0227, y que lo que rompe algo de las skills y los topes están en `cli/test/kit/` ([ADR 0019](decisions/0019-skills-not-tested-by-phrases.md)); la línea 7 (««CI» local») nombra `cli/test/kit/skills.test.ts` y `cli/test/kit/manifests.slow.test.ts` en vez de los dos Pester y quita lo que ya no se comprueba (description que empieza por «Usar», H1, Overview, recuento de plantillas del README); la línea 8 dice la excepción de `cli/test/kit/path-length.test.ts` (una llamada a `git ls-files` en el conjunto rápido); la línea 32 dice que la CLI corre si cambian `cli/`, `skills/`, `.docs/`, `tests/`, `agents/`, `.claude-plugin/` o `README.md`. `README.md:159`: los tests de la CLI y los de las skills son Vitest; Pester, solo para los de conducta que quedan. `CLAUDE.md`: línea 21, `tests/WorkflowDocs.Tests.ps1` → `cli/test/kit/workflow-docs.test.ts`; línea 23, «los Pester que quedan son de frases y anatomía de skills» → «los Pester que quedan son de conducta; lo que rompe algo de las skills, en `cli/test/kit/`». Comprobar que `constitution.md`, `architecture.md` y `tech-stack.md` siguen en sus topes (Verificación).
- [ ] **Step 3: ADR 0019** — calco de `adr-template.md`: `status: accepted`, `date: 2026-10-26`, `rutas: [tests/**, cli/test/kit/**]`. Contexto: 67 Pester, 1139 líneas de frases, el dev-lead. Opciones: portar las frases a Vitest · quedarse con las frases de contrato (criterio de la 0045) · portar toda la estructura · portar solo lo que rompe algo más lo que fija una regla escrita (elegida). Decisión: la spec, decisiones 1 y 6. Consecuencias: sustituye la consecuencia de la ADR 0011 «los Pester que quedan (frases y anatomía de skills) siguen hasta la 0152», que no se edita; las «Confirmación» de las ADR 0001, 0002, 0005-0008, 0010, 0012, 0014-0016 que citan un Pester de frase ya no tienen test, y su prueba es la batería RED/GREEN; una comprobación de nombre retirado es un smoke de una vez. Confirmación: `cli/test/kit/`.
- [ ] **Step 4: roadmap** — fila 0224 (b): `tests/WordBudget.Tests.ps1` → `cli/test/kit/word-budget.test.ts`; fila 0227: quitar «`PathLength` si la 0226 no lo lleva…» (la 0226 lo lleva). Las filas 0226, 0045 y la deuda de los ~416 tests las cierra `sdd-archive`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación».
- [ ] **Step 6: Commit** — `docs(sdd): las rutas de los tests del kit y la ADR 0019`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 2 h
- Base de la estimación: 2 tasks; ~600 líneas de TypeScript que portan lógica ya escrita; incertidumbre en `claude` desde Node en Windows
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test kit:test-headless cli:typecheck cli:test-min --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `tests/` solo con los 10 de conducta → Task 1, Step 11 (`ls` → 10). ✓
- Topes con los mismos valores y el margen B21 → Task 1, `word-budget.test.ts` y `aplica el margen redondeando al par`. ✓
- Lo que rompe algo sigue parando el commit desde `cli:test` → Task 1, RED de cada fichero; la caché, Step 10. ✓
- Nombres retirados sin listas, test genérico → Task 1, `toda skill invocada existe` con el mutante `sdd-end-feature`. ✓
- Referencias a los Pester, smoke único → Task 2, «Tests RED». ✓
- `cli/moon.yml` `testInputs` (decisión 3) → Task 1, Step 10. ✓
- `path-length` en el conjunto rápido (decisión 4) → Task 1, Step 3 (sin `.slow`). ✓
- ADR 0019 sin editar la 0011 (decisiones 10 y 11) → Task 2, Step 3; `decision check`. ✓
- Filas 0224 y 0227 (decisión 13) → Task 2, Step 4; 0226, 0045 y la deuda → cierre. ✓
- Delta: `migration` ×3, `roadmap`, `feature-flow`, regla `archive` → fusión en el cierre (`sdd-archive`), probada ya sobre una copia (`Capacidades válidas: 20`). ✓
- Topes de los documentos editados sin cambio → Task 2, Verificación. ✓
- Review Focus ×3 → Task 1, Steps 2, 3 y 4. ✓
