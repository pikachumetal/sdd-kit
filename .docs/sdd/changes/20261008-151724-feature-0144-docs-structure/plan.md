---
id: 20261008-151724-feature-0144-docs-structure
feature: 0144
title: Plan de implementación — Documentos de la 3.0.0: estructura nueva, plantillas y rutas de la CLI
spec: ./spec.md
status: approved
created: 2026-10-08
---

# Plan de implementación — Documentos de la 3.0.0

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: cuatro tasks en serie, y las dos de CLI comparten el módulo de rutas que fija la Task 1. Un error se ve en los tests Vitest de cada task, y la revisión independiente la hace el revisor final. SDD costaría un contexto nuevo por task y por revisión, y no compensa con este tamaño.
2. **Modelo**: la sesión implementa (Opus 5.5, la que corre ahora). Los sujetos del humo de la Task 3 van con Sonnet. El revisor final va con `sdd-kit:effort-high` + `opus`.
3. **Un módulo de rutas, `cli/src/cli/layout.ts`**, que trabaja con la ruta de `.docs/sdd` (o `docs/sdd`) que ya reciben los verbos: la raíz del proyecto es `dirname(dirname(docsPath))`. Los verbos no cambian de opciones.
4. **Los globs, con una función propia de unas 15 líneas** (`globToRegExp`), no con `path.matchesGlob`, que es experimental en Node 22.
5. **`rutas` sin parser YAML**: se leen la lista en bloque y la lista en línea con una expresión regular sobre el frontmatter, que es lo único que admite la regla de la capacidad.
6. **Riesgo**: que una ADR de este repo (de la 0001 a la 0011) no pase `decision check`. La Task 2 lo ejecuta sobre `.docs/sdd/decisions/`. Si alguna falla por la forma, se corrige la ADR: cambiar la forma no cambia la decisión. Si falla por otra cosa, es un ruling.
7. **Coste**: unas 5 h de implementación; humo, unos 3 $; revisor final, unos 150k tokens.
8. Review Focus: 5 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: plantillas de la estructura 3.0.0, la CLI leyendo esa estructura y la 2.x, el sustantivo `decision` y la constitution enmendada.

**Architecture**: un módulo de rutas resuelve cada documento (primero el 3.0.0, después el 2.x, y avisa si existen los dos) y las carpetas de cambios. Los verbos que hoy tienen las rutas fijas se las piden a ese módulo. `decision` es un dominio nuevo de `cli/src`, con la misma forma que `capabilities`.

**Tech Stack**: TypeScript sin build (Node ≥ 22.18.0), Vitest, Pester (`tests/AnchorTemplates.Tests.ps1`), lanzador de sujetos `tests/headless/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son cuatro tasks en serie que comparten la interfaz de la Task 1 y la revisión final cubre la independiente. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Node ≥ 22.18.0 sin dependencias de runtime; TypeScript sin build, como el resto de `cli/`.
- Art. X de la constitution, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III). El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Todo código que llame a git limpia `GIT_DIR` y compañía del entorno del hijo (dentro del pre-commit, git las exporta).
- Mensajes literales de la spec: `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee`; `Decisiones válidas`; `Sin decisiones`; `<fichero>: status «<valor>» no es proposed, accepted, rejected, deprecated ni superseded by NNNN`; `<fichero>: sustituida por <NNNN>, que no existe`; `<fichero>: date «<valor>» no es AAAA-MM-DD`; `<fichero>: falta rutas`; `<fichero>: glob no soportado «<glob>»`; `<fichero>: el nombre no es NNNN-<slug>.md`; `número <NNNN> repetido: <ficheros por orden alfabético, separados por coma>`; `(sin título)`.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; revisor final de Native con `sdd-kit:effort-high` + `opus`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por task (`commit-milestones.md`).

## Review Focus

- Un roadmap con `ROADMAP.md` en una rama y `.docs/sdd/roadmap.md` en otra → `id next` cuenta los dos · Task 1, `id next lee ROADMAP.md y changes/ de otra rama`
- `--path` con barra final o relativo (`.docs/sdd/`, `./.docs/sdd`) → la misma raíz del proyecto · Task 1, `projectRoot normaliza la barra final`
- Una ADR con CRLF o con BOM (escrita en Windows) → se valida igual · Task 2, `check acepta CRLF y BOM`
- `rutas` con un glob con `./` delante (`./src/**`) → no se admite: `glob no soportado` · Task 2, `check rechaza ./ al principio del glob`
- `roadmap publish ./ROADMAP.md` → se acepta igual que `ROADMAP.md`, porque es la misma ruta resuelta · Task 1, `publish acepta ./ROADMAP.md`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: un módulo de rutas con tres documentos y una lista de carpetas; nada de detección de versión.
- [x] **YAGNI gate**: sin abstracción para «cualquier documento»; tres entradas fijas.
- [x] **Brownfield gate**: los proyectos 2.x leen igual (casos «solo 2.x» en cada test); sin refactor fuera de las rutas.
- [x] **Constitution check**: Art. I (humo en la Task 3), Art. VIII (plantillas solo en `sdd-templates`), Art. X (restricciones de arriba), Art. IV y XI enmendados en la Task 4.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/cli/layout.ts` — rutas de los documentos y de las carpetas de cambios.
- `cli/src/decisions/{document,glob,check,index,verbs}.ts` — el sustantivo `decision`.
- `cli/test/layout.test.ts`, `cli/test/decisions/{check,index,glob}.test.ts`.
- `skills/sdd-templates/templates/{PRODUCT,operations,adr}-template.md`.
- `.docs/sdd/decisions/0012-documents-by-reader.md`.
- `tests/sdd-templates-smoke.md` y `./green/` (molde, lanzador y salida de los sujetos).

**Modificar**:

- `cli/src/ids/scan.ts`, `cli/src/roadmap/{check,releases,publish,verbs}.ts`, `cli/src/estimation/{log,releases,verbs}.ts`, `cli/src/merge/registries.ts`, `cli/src/cli/verbs.ts` — piden las rutas a `layout.ts`; registro de `decision`.
- Tests: `cli/test/ids/next.slow.test.ts`, `cli/test/roadmap/{check.test,cut.slow.test,publish.slow.test}.ts`, `cli/test/estimation/{fixtures.test,releases.slow.test}.ts`, `cli/test/cli.test.ts` (ayuda).
- `skills/sdd-templates/templates/constitution-template.md`, `skills/sdd-templates/SKILL.md`.
- `tests/AnchorTemplates.Tests.ps1`.
- `.docs/sdd/constitution.md` (Art. IV y XI), `.docs/sdd/architecture.md`, `THIRD_PARTY_NOTICES.md`.

**NO se tocan**:

- Las plantillas 2.x (`mission`, `tech-stack`, `environments`, `client-changelog`) y sus consumidores — decisión 11 de la spec.
- `cli/src/capabilities/` — `capabilities/` no cambia de ruta.
- Las plantillas de artefactos de cambio y `roadmap-template.md` — decisión 14 de la spec.

### 1.6 Dependencias

- impeccable 4.3.1 (encabezados de `PRODUCT.md`, `reference/init.md`); mattpocock/skills `b0618bc` (`GLOSSARY-FORMAT.md`, `ADR-FORMAT.md`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una ADR del repo no pasa `decision check` | media | bajo | La Task 2 lo ejecuta y corrige la forma |
| El tope de palabras de `sdd-templates` no cabe | baja | bajo | Recortar ayuda de las plantillas nuevas antes que subir el tope |
| La constitution pasa de 2.200 palabras | media | bajo | Condensar el Art. IV; el porqué largo va a la ADR 0012 |

### 1.8 Rollout

Directo a `develop`; llega a los proyectos con la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna. Que no salga ninguna pieza está aprobado en el gate de la spec (decisión 12).

---

## 2. Tasks

### Task 1 — Rutas de la CLI para la estructura 3.0.0 y la 2.x

**Modelo**: la sesión (Native).
**Tests RED**: hilo principal, TDD; copia de los RED en el scratchpad antes del código.
**Superficies**: tooling.
**Verificación**: `pnpm -C cli exec tsc --noEmit` · `pnpm -C cli exec vitest run test/layout.test.ts test/roadmap test/estimation test/ids --test-timeout 120000`
**Se prueba en la aplicación**: no, porque es tooling: se prueba con la CLI sobre un proyecto de fixture (smoke del cierre).

**Interfaces**:
- Consume: nada.
- Produce, en `cli/src/cli/layout.ts`:
  - `type DocumentName = 'roadmap' | 'changelog' | 'estimation'`
  - `projectRoot(docsPath: string): string`: `dirname(dirname(resolve(docsPath)))`.
  - `documentCandidates(docsPath: string, name: DocumentName): [string, string]`: [ruta 3.0.0, ruta 2.x]. roadmap → `<raíz>/ROADMAP.md`, `<docs>/roadmap.md`; changelog → `<raíz>/CHANGELOG.md`, `<docs>/changelog.md`; estimation → `<docs>/steering/estimation.md`, `<docs>/estimation.md`.
  - `resolveDocument(docsPath: string, name: DocumentName): { file: string | null; shadowed: string | null }`: `file` es la primera candidata que existe; `shadowed` es la 2.x cuando existen las dos.
  - `shadowWarning(docsPath: string, shadowed: string): string` → `aviso: también existe <ruta relativa a la raíz con />, que no se lee`.
  - `changeFolders(docsPath: string): string[]`: las que existen de `<docs>/changes` y `<docs>/specs`, en ese orden.
  - `estimationLogPath(docsPath: string): string`: `estimation-log.md` en la carpeta de `resolveDocument(…,'estimation').file`, o en `<docs>` si no hay `estimation.md`.
  - `ROOT_DOCUMENTS = ['PRODUCT.md', 'ROADMAP.md', 'CHANGELOG.md']`.

**Ficheros**: crear `cli/src/cli/layout.ts`, `cli/test/layout.test.ts`; modificar `ids/scan.ts`, `roadmap/{check,releases,publish}.ts`, `estimation/{log,releases,verbs}.ts`, `merge/registries.ts` y sus tests.

- [ ] **Step 1: Tests RED**, uno por THEN:
  - `layout.test.ts`: `resolveDocument elige ROADMAP.md y marca el viejo como sombra` (los dos existen → `file` termina en `ROADMAP.md`, `shadowed` en `.docs/sdd/roadmap.md`); `solo 2.x devuelve el viejo sin sombra`; `changeFolders devuelve changes y specs`; `projectRoot normaliza la barra final` (`.docs/sdd/` y `./.docs/sdd` dan la misma raíz); `estimationLogPath va a steering con estimation.md en steering`.
  - `roadmap/check.test.ts`: `valida ROADMAP.md de la raíz con prefijo ROADMAP.md:`; `con los dos roadmaps avisa y termina en Roadmap válido` (`lines` contiene `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee`, la última es `Roadmap válido` y `code` es 0); `solo roadmap.md sigue con prefijo roadmap.md:`.
  - `roadmap/cut.slow.test.ts`: `una fila saldada que enlaza .docs/sdd/changes/ desde ROADMAP.md decide por el tag` y `un patch que enlaza changes/ decide por el tag`.
  - `roadmap/publish.slow.test.ts`: `publish acepta ROADMAP.md de la raíz`, `publish acepta ./ROADMAP.md` y `publish rechaza docs/ROADMAP.md con 2` (exit 2, `develop` sin cambios).
  - `ids/next.slow.test.ts`: `id next cuenta changes/ y los dos roadmaps` (fixture de la spec: `specs/…-0079-b`, `changes/…-0081-c`, `ROADMAP.md` con `0083`, `.docs/sdd/roadmap.md` con `0085` → `0086`); `id next lee ROADMAP.md y changes/ de otra rama` (una rama con solo `ROADMAP.md` con la fila `0090` → `0091`); `una carpeta en changes y otra en specs con el mismo id son duplicado`.
  - `estimation/fixtures.test.ts`: `el log lee changes y specs` (filas `0079` y `0160`); `el log va a steering y avisa de estimation.md en las dos rutas`; `CHANGELOG.md manda sobre changelog.md y avisa`; `sin changes ni specs dice qué carpetas buscó`.
- [ ] **Step 2: Implementación** — `layout.ts` con las firmas de arriba. `scan.ts`: `specArtifacts` recorre `changeFolders`; `roadmapIds` lee las dos candidatas de `documentCandidates(…,'roadmap')`; `branchContentIds` hace `git show <rama>:ROADMAP.md` y `<rama>:.docs/sdd/roadmap.md`, y `ls-tree` de `.docs/sdd/changes` y `.docs/sdd/specs`. `check.ts`: `resolveDocument`, el prefijo es `basename(file)`, la sombra va primera en `warnings`; `Cut` lleva `dir` (la carpeta del roadmap) en vez de `sddPath`. `releases.ts`: `ARTIFACT_LINK = /\]\(((?:\.docs\/sdd\/)?(?:specs|changes)\/[^)\s]+)\)/`. `publish.ts`: `docsRelativePath` acepta una ruta relativa a la raíz que sea exactamente un `ROOT_DOCUMENTS`. `log.ts`: `resolveDocsPath` acepta `changes` o `specs`; filas de todas las `changeFolders`, ordenadas por carpeta; error `No se encuentra changes/ ni specs/ bajo .docs/sdd ni docs/sdd en '<raíz>'.`. `releases.ts` (estimation): `resolveDocument(…,'changelog')` y `addedCommits` de cada carpeta. `verbs.ts` y `registries.ts`: `estimationLogPath`. Avisos de sombra por `warn`/`io.err`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»: todo verde; los tests que ya existían, sin tocar sus asserts.
- [ ] **Step 4: Commit de la task** — `feat(cli): leer la estructura de documentos 3.0.0 junto a la 2.x`.

### Task 2 — Sustantivo `decision`: `check` e `index`

**Modelo**: la sesión (Native).
**Tests RED**: hilo principal, TDD; copia de los RED en el scratchpad.
**Superficies**: tooling.
**Verificación**: `pnpm -C cli exec tsc --noEmit` · `pnpm -C cli exec vitest run test/decisions test/cli.test.ts test/docs-claims.test.ts` · `node cli/bin/sdd.js decision check --path .docs/sdd` (sale con 0 sobre las ADR del repo)
**Se prueba en la aplicación**: no, porque es tooling: smoke con la CLI en el cierre.

**Interfaces**:
- Consume: `readText`, `readLines` de `cli/src/cli/files.ts`; `requiredOption` de `cli/src/cli/args.ts`; forma de `Verb` de `cli/src/cli/verbs.ts`.
- Produce:
  - `globToRegExp(glob: string): RegExp | null` (`glob.ts`): `null` si el glob lleva `?`, `{`, `}`, `[`, `]`, `!` o empieza por `./`; `*` → `[^/]*`; `**/` → `(?:.*/)?`; `/**` final → `/.+`; sensible a mayúsculas.
  - `readDecision(path: string): Decision` (`document.ts`), con `Decision = { file: string; number: string | null; title: string | null; status: string | null; date: string | null; rutas: string[]; sections: string[] }`. Acepta CRLF y BOM; `rutas` en bloque (`- x`) o en línea (`[x, "y"]`), con comillas simples, dobles o sin ellas.
  - `checkDecisions(docsPath: string): { lines: string[]; code: number }` (`check.ts`), con los mensajes literales de las restricciones.
  - `decisionIndex(docsPath: string, files?: string[]): string[]` (`index.ts`): líneas `` - `NNNN` — <título> (<status>) · `.docs/sdd/decisions/<fichero>` ``, ordenadas por número; con `files` solo `accepted` y `proposed` cuyo glob case con algún fichero (normalizado `\` → `/`).
  - Verbos `decision check` (`--path`, `--json`) y `decision index` (`--path`, `--files` múltiple, `--json`), registrados en `cli/src/cli/verbs.ts`.

**Ficheros**: crear `cli/src/decisions/*.ts`, `cli/test/decisions/*.test.ts`; modificar `cli/src/cli/verbs.ts`, `cli/test/cli.test.ts`.

- [ ] **Step 1: Tests RED**, uno por THEN de «Una ADR tiene la forma de la plantilla» y de «El índice de decisiones…» (con los ficheros y valores literales de la spec: `0001-use-postgres.md` … `0005-orm.md`, `src/db/cache.ts`, `skills\x\scripts\run.ts`), más `check acepta CRLF y BOM`, `check rechaza ./ al principio del glob` y `--help lista decision check y decision index`. Las plantillas: `adr-template.md calcada y rellenada pasa`, `adr-template.md sin rellenar falla solo por date`; viven en la Task 3, así que estos dos tests se escriben aquí con la plantilla como fixture en `cli/test/fixtures/decisions/` y la Task 3 los apunta a la de `sdd-templates`.
- [ ] **Step 2: Implementación** — las firmas de arriba. Orden de secciones exigido: `## Contexto y problema`, `## Opciones consideradas`, `## Decisión`, `### Consecuencias`, `### Confirmación`. `status` válido: `proposed|accepted|rejected|deprecated|superseded by \d{4}`. `date`: `^\d{4}-\d{2}-\d{2}$`. Nombre: `^\d{4}-[a-z0-9-]+\.md$`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación». Si una ADR del repo falla por la forma, se corrige la ADR (decisión 6) y se anota como ruling.
- [ ] **Step 4: Commit de la task** — `feat(cli): validar e indexar las ADR con sdd decision`.

### Task 3 — Plantillas de la 3.0.0 e índice de `sdd-templates`, con su humo

**Modelo**: la sesión (Native); sujetos del humo con Sonnet, lanzados con `tests/headless/`.
**Tests RED**: `tests/AnchorTemplates.Tests.ps1` con los casos nuevos, antes de las plantillas; el humo es narrativa, sin RED (Art. I: humo, n = 1).
**Superficies**: docs (skills), tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "exit (Invoke-Pester -Path tests/AnchorTemplates.Tests.ps1,tests/WordBudget.Tests.ps1,tests/FrontendVerification.Tests.ps1 -PassThru -Output Minimal).FailedCount"` · `pnpm -C cli exec vitest run test/decisions test/docs-claims.test.ts`
**Se prueba en la aplicación**: no, porque son plantillas: el humo h1 y h2 es la prueba en uso.

**Interfaces**:
- Consume: `sdd decision check` (Task 2) para el humo h2; el test de plantilla de la Task 2.
- Produce: `PRODUCT-template.md`, `operations-template.md`, `adr-template.md` con la forma de la spec.

**Ficheros**: crear las tres plantillas, `tests/sdd-templates-smoke.md` y `./green/`; modificar `constitution-template.md`, `skills/sdd-templates/SKILL.md`, `tests/AnchorTemplates.Tests.ps1`, `THIRD_PARTY_NOTICES.md` y los tests de la Task 2 que usan la plantilla.

- [ ] **Step 1: Tests RED** en `AnchorTemplates.Tests.ps1`: `existe <_>-template.md` y `no nombra proyectos reales` con `PRODUCT`, `operations` y `adr` añadidas a la lista; `PRODUCT-template.md tiene Users, Product Purpose, Capabilities and Constraints y Terminology en orden y sin impeccable:product-schema`; `Terminology muestra **<Término>**: y _Evitar_:`; `operations-template.md tiene Comandos, Testing, Frontend y Entornos, sin versiones ni Decisiones abiertas`; `§Testing pide comando, duración, lo afectado, gate de cierre, gate de merge, acceso del agente y motor de producción`; `§Frontend de operations tiene los campos de tech-stack` (compara los nombres en negrita de las dos secciones); `el índice de sdd-templates da los destinos 3.0.0` (las ocho filas del ADDED de `onboarding`, con su destino) y `marca 2.x las cuatro plantillas viejas con la feature que las retira`.
- [ ] **Step 2: Implementación** — las plantillas, con la forma de la spec (decisiones 6 a 9). En `SKILL.md`: `description` con `PRODUCT, constitution, operations, architecture, roadmap, estimation, changelog, ADR`; filas nuevas con destino; filas 2.x marcadas `2.x: la retira la 0156` (`0150` la de cliente); regla de rutas con la estructura 3.0.0 y «las carpetas de `specs/` anteriores a la 3.0.0 se leen y no se mueven»; fila de `sdd decision check` y `sdd decision index` en la tabla de verbos. `THIRD_PARTY_NOTICES.md`: glosario y ADR de mattpocock/skills (`b0618bc`, MIT) y encabezados de impeccable 4.3.1.
- [ ] **Step 3: Humo** — h1 y h2 de la decisión 15 de la spec, en un molde en el scratchpad con la estructura 3.0.0. Criterio h1: existe `.docs/sdd/steering/operations.md` con `## Testing`, calcado de la plantilla. Criterio h2: existe `.docs/sdd/decisions/0001-*.md` y `sdd decision check` sale con 0. Resultado en `tests/sdd-templates-smoke.md`; molde, lanzador y lo producido en `./green/`. Si la previsión (2 sujetos, ~20 min, ~3 $) se supera con una tanda de REFACTOR incluida, se para y decide el dev-lead.
- [ ] **Step 4: Verificación** — los comandos de «Verificación».
- [ ] **Step 5: Commit de la task** — `feat(templates): plantillas de documentos de la 3.0.0 y ADR`.

### Task 4 — Constitution y ADR 0012

**Modelo**: la sesión (Native).
**Tests RED**: ninguno nuevo: lo que se verifica es documental (tope de palabras y forma de la ADR).
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "exit (Invoke-Pester -Path tests/WordBudget.Tests.ps1 -PassThru -Output Minimal).FailedCount"` · `node cli/bin/sdd.js decision check --path .docs/sdd`
**Se prueba en la aplicación**: no, porque es documentación del kit.

**Interfaces**:
- Consume: `sdd decision check` (Task 2); `adr-template.md` (Task 3).
- Produce: Art. IV y XI enmendados; `.docs/sdd/decisions/0012-documents-by-reader.md`.

**Ficheros**: `.docs/sdd/constitution.md`, `.docs/sdd/decisions/0012-documents-by-reader.md`, `.docs/sdd/architecture.md`.

- [ ] **Step 1: Implementación** — Art. IV, viñeta «Artefactos»: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz del proyecto; el resto en `.docs/sdd/` (`steering/`, `decisions/`, `capabilities/`, `changes/`, `releases/`); el naming de carpeta se mantiene, en `changes/`; las carpetas de `specs/` anteriores a la 3.0.0 y las `-task-` se leen y no se mueven. *Por qué* del Art. IV: enlaza también la ADR 0012. Art. XI: «Todo documento de `.docs/sdd/` y de la raíz que fija el Art. IV…». ADR 0012 calcada de `adr-template.md`, con `rutas` `.docs/sdd/**`, `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` y `skills/sdd-templates/**`, y en Contexto la propuesta 0131 y la 0005, que sigue `accepted` para naming, ids y merge. `architecture.md`: `decisions/` en la tabla con su verbo, y la CLI con el módulo de rutas.
- [ ] **Step 2: Verificación** — los comandos de «Verificación»: el tope de 2.200 palabras se cumple y `decision check` da `Decisiones válidas`.
- [ ] **Step 3: Commit de la task** — `docs(constitution): fijar la estructura de documentos de la 3.0.0`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 5 h
- Base de la estimación: 4 tasks; dos de CLI con tests Vitest sobre módulos que ya existen y un dominio nuevo pequeño, un humo de 2 sujetos y documentación. La incertidumbre está en los tests lentos de ramas de `id next` y en el tope de palabras.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run cli:typecheck cli:test cli:test-slow kit:test kit:roadmap`
- [ ] Smoke con una fila por THEN de la spec (`suite` · `ejecución real` · `no probado`)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre con `sdd-end-feature` (validación en campo)

---

## 4. Self-review (cobertura spec → tasks)

- `decisions`: «Una ADR tiene la forma…» y «El índice…» → Task 2; «La plantilla de ADR» → Task 3 (plantilla y humo h2). ✓
- `cli`: ayuda con `decision check|index` → Task 2, `--help lista decision…`. ✓
- `roadmap`: ADDED `ROADMAP.md` → Task 1 (`check.test.ts`); MODIFIED «Una fila saldada…» y «Un patch publicado…» → Task 1 (`cut.slow.test.ts`). ✓
- `release-flow`: MODIFIED publish → Task 1 (`publish.slow.test.ts`); los mensajes con la ruta publicada ya los da el código y se comprueban con `ROADMAP.md`. ✓
- `estimation`: los dos MODIFIED → Task 1 (`fixtures.test.ts`; `registries.ts` con `estimationLogPath`). ✓
- `feature-ids`: los tres MODIFIED y la regla → Task 1 (`next.slow.test.ts`). ✓
- `onboarding`: los tres ADDED → Task 3 (`AnchorTemplates.Tests.ps1`). ✓
- Decisión 13 (constitution y ADR 0012) → Task 4. ✓
- Review Focus → Task 1 (`projectRoot…`, `publish acepta ./ROADMAP.md`, `id next lee… otra rama`) y Task 2 (`CRLF y BOM`, `./ al principio`). ✓
- Cada escenario de la spec tiene su task (perfil delegate: sin gate de plan). ✓
