---
id: 20261117-162953-feature-0348-move-specs-to-changes
feature: 0348
title: Plan de implementación — La 3.0.1 mueve specs/ a changes/
spec: ./spec.md
status: approved
created: 2026-11-17
---

# Plan de implementación — La 3.0.1 mueve `specs/` a `changes/`

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las cuatro tasks las hace el hilo principal (Native), sin despachos. La revisión final de `sdd-verify` va con Spec `sdd-kit:effort-high` + `opus` y Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native. Las tasks se encadenan: el texto de la migración de la Task 2 es lo que aplica la Task 3. Son cuatro, un error lo para el pre-commit de cada commit, y el plan cabe en el contexto que ya tiene la sesión.
3. Commits de la Task 3. El de mover lleva los renombrados y, además, los tres lectores de `specs/` del repo (`statistics.test.ts`, `battery.mjs`, `upstream.json`): si no, su pre-commit falla. Lo demás de la migración va en el segundo. Comprobado en el clon: `sdd roadmap check` da «Roadmap válido» con los enlaces aún sin reescribir.
4. El comando de reescritura de este repo es el publicado más un filtro de exclusiones. Se escribe en el scratchpad y se prueba en un clon nuevo antes de aplicarlo.
5. Riesgo alto: el pre-commit del commit de mover recorre 35.000 rutas renombradas. Mitigación: el buffer de 256 MB del hook ya cubrió la 3.0.0 (35.208 rutas).
6. Coste estimado: ~2,5 h de implementación. Sin subagentes, salvo la revisión final (dos ejes, ~1 $).
7. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: publicar la 3.0.1 con la migración que junta `specs/` en `changes/`, aplicada a este repo.

**Architecture**: la migración es texto con dos comandos `node -e`. La CLI solo cambia en `addedCommits`, para que una carpeta movida conserve su release. Este repo se migra con los mismos comandos más sus exclusiones.

**Tech Stack**: Node 22 y TypeScript (CLI, Vitest), Markdown de skills, moon para el build y el gate.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 4 tasks se encadenan (la Task 3 aplica el texto que escribe la Task 2), un error lo para el pre-commit de cada commit y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — no hay módulo, dependencia ni contrato nuevos; `addedCommits` cambia por dentro y mantiene su firma.

## Restricciones globales

### De código

- **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). La ayuda de `--help` no es un comentario.
- **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- El texto de las skills se escribe en inglés y no crece: `sdd-upgrade/SKILL.md` ≤ 980 palabras, `sdd-templates/SKILL.md` ≤ 1.614, `add-to-changelog` ≤ 500, `constitution.md` ≤ 2.250, `architecture.md` ≤ 4.877.

### De proceso

- Native, sin despachos salvo la revisión final.
- Commits: tipo y scope en inglés; título y cuerpo en castellano; cierre con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. El mensaje va por `git commit -F` desde el scratchpad.
- Antes de cada commit, `git diff --cached --name-only`.

## Review Focus

- `specs/` con una subcarpeta vacía (git no la versiona) → el comando 1 la lista y no mueve nada · Task 2, prueba en el clon con `mkdir`.
- Un `.md` con CRLF → la reescritura conserva los finales de línea (`split`/`join` no toca `\r`) · Task 3, `git diff --stat` sin cambios de EOL en el commit (`git diff --cached --ignore-cr-at-eol --stat` igual que sin la opción).
- Una ruta con tildes (`…-task-0012-exportación`) → `git grep -z` la da sin comillas y se reescribe · Task 3, `git grep` final vacío fuera de las zonas.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: dos comandos y un arreglo de una función.
- [x] **YAGNI gate**: sin abstracción ni verbo nuevo.
- [x] **Brownfield gate**: la CLI sigue leyendo `specs/`; los tests 2.x se quedan.
- [x] **Constitution check**: Art. X en las restricciones; Art. XI, topes sin cambio.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-upgrade/references/migrations/v3.0.1.md` — la migración.
- `.docs/sdd/decisions/0036-documents-by-reader-single-changes.md` — sustituye a la 0034.

**Modificar**:

- `cli/src/estimation/releases.ts` — `addedCommits` sobre las dos carpetas.
- `cli/test/estimation/releases.slow.test.ts` — test de la carpeta movida.
- `cli/test/kit/path-length.test.ts` — `MAX_RELATIVE_LENGTH = 142`.
- `cli/test/kit/skills-3x-paths.test.ts` — dos entradas menos en `ALLOWED`.
- `skills/sdd-upgrade/SKILL.md`, `skills/add-to-changelog/SKILL.md`, `skills/sdd-propose/references/coherence-pass.md`, `skills/sdd-templates/SKILL.md` — frases de la spec.
- `.docs/sdd/decisions/0034-documents-by-reader-3.md` — `status: superseded by 0036`.
- `CLAUDE.md`, `.docs/sdd/steering/constitution.md`, `.docs/sdd/steering/architecture.md`, `.docs/workflow/{greenfield,brownfield,usage-guide}.md`.
- `.claude-plugin/plugin.json` — `3.0.1`; `CHANGELOG.md` — entrada.
- La migración en este repo: `.docs/sdd/specs/**` → `.docs/sdd/changes/**`, los `.md` reescritos, `cli/test/estimation/statistics.test.ts`, `tests/headless/battery.mjs`, `upstream.json`, `THIRD_PARTY_NOTICES.md` y `dist/` (build), `.docs/sdd/steering/estimation-log.md` (regenerado), `.docs/sdd/sdd-kit.json` (`--mark`).

**NO se tocan**:

- `cli/src/cli/layout.ts`, `cli/src/ids/scan.ts` — la lectura de `specs/` sigue hasta la 4.0.0.
- `cli/src/roadmap/releases.ts` — decisión 10 de la spec.
- `tests/batteries/**`, `migrations/v*.md` publicadas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El pre-commit tarda o se queda corto con 35.000 renombrados | media | medio | buffer de 256 MB del hook; se lanza en primer plano con timeout largo |
| Un `.md` de este repo queda mal reescrito | baja | medio | se prueba primero en un clon nuevo; `git diff` por muestreo |

### 1.8 Rollout

Directo: la publicación la hace el corte de la release.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd estimation log` cuenta una carpeta movida desde su nacimiento

**Tras**: —
**Modelo**: hilo principal (Native)
**Tests RED**: Native: TDD del propio hilo · `cli/test/estimation/releases.slow.test.ts`
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/estimation/releases.slow.test.ts` → `Tests  2 passed (2)`

**Interfaces**:
- Consume: nada.
- Produce: `addedCommits(docsPath: string): Map<string, string>`, clave `<carpeta>/<fichero>`, valor el commit más viejo que añadió ese fichero en `changes/` o `specs/`.

**Ficheros**: modificar `cli/src/estimation/releases.ts`, `cli/test/estimation/releases.slow.test.ts`

- [ ] **Step 1: RED** — test `a folder moved from specs/ to changes/ after a tag keeps its release`. Changelog `## [0.1.0] - 2026-10-08` y `## [0.2.0] - 2026-10-09`. `addPatch(root, '20261008-080000-patch-0056-primera')` en `specs/`, `git tag v0.1.0`. Después, `git mv specs/<carpeta> changes/<carpeta>`, commit y `git tag v0.2.0`. Assert: `expect(text).toMatch(/^\| 0\.1\.0 \| 1 \|/m)` y `expect(text).not.toMatch(/^\| 0\.2\.0 \| 1 \|/m)`. Hay que ver que falla.
- [ ] **Step 2: Implementación** — `addedCommits(docsPath)` hace un solo `git log --no-renames --diff-filter=A --format=%H --name-only -- changes specs` desde `docsPath`, y gana el último (el más viejo). La llamada de `:77` pasa `docsPath` en vez de iterar `changeFolders(docsPath)`. El comentario `ponytail` sobre el renombrado se actualiza: renumerar una carpeta sigue contando desde el renombrado.
- [ ] **Step 3: Verificación** — el comando de arriba, y `pnpm --dir cli exec vitest run test/estimation` en verde.
- [ ] **Step 4: Commit** — `fix(cli): sdd estimation log cuenta una carpeta movida desde el commit que la creó`.

### Task 2 — La migración v3.0.1 y los textos del kit

**Tras**: Task 1
**Modelo**: hilo principal (Native)
**Tests RED**: Native · los existentes que fijan la forma: `migration-init-parity`, `skills-3x-paths`, `word-budget`, `workflow-docs`, `path-length`, `docs-claims`, y la prueba de la versión con su migración
**Superficies**: docs, tooling
**Verificación**: `moon run kit:build` y después `pnpm --dir cli exec vitest run test/kit` → `Tests  N passed (N)` sin fallos; prueba del comando 1 en un clon nuevo con una subcarpeta vacía y con una carpeta repetida → mensaje y exit 1, `git status` vacío.

**Interfaces**:
- Consume: los dos comandos de `scratchpad/cmds.txt` (spec, Approach).
- Produce: `v3.0.1.md` con los pasos 1-6 de la spec y su línea `**Writes**:`; `plugin.json` en `3.0.1`.

**Ficheros**: los de §1.1, salvo la Task 1 y lo que mueve la Task 3.

- [ ] **Step 1: Comando 1 completo** — en `cmds.txt`, antes de mover: `git ls-files -o -- .docs/sdd/specs` (lo sin versionar y lo ignorado) y las entradas vacías hacen parar con la lista. Probado en un clon nuevo.
- [ ] **Step 2: `v3.0.1.md`** — título, a qué aplica, predicado, pasos 1-6 (mover, reescribir, listar, marcador, reglas) con «no gate» en mover y reescribir, el retroceso `git reset --hard HEAD` en el informe, `**Writes**: ` con `sdd-kit.json` → `version`, `channel`, `updated` y los `.md` reescritos, y «Verification»: `specs/` no existe; el `git grep` de las dos rutas solo da subcarpetas de `changes/<carpeta>/`; `git status` del commit de mover solo tiene renombrados; `version` `3.0.1`.
- [ ] **Step 3: Skills** — las frases de las decisiones 2 y 11 de la spec en `sdd-upgrade/SKILL.md`, `add-to-changelog/SKILL.md`, `coherence-pass.md` y `sdd-templates/SKILL.md:73`.
- [ ] **Step 4: Tests del kit** — `ALLOWED` sin `add-to-changelog/SKILL.md` ni `coherence-pass.md`; `MAX_RELATIVE_LENGTH = 142`, con el comentario de margen a ~118.
- [ ] **Step 5: Docs** — ADR 0036 (con la plantilla `adr-template.md`), la 0034 `superseded by 0036`, `CLAUDE.md:20` y su nota de `field-reports/`, `constitution.md:47` y `:73`, `architecture.md:92`, `greenfield.md:105`, `brownfield.md:60`, y los tres marcadores «kit v3.0.1».
- [ ] **Step 6: Versión** — `plugin.json` `3.0.1` (y `marketplace.json` si la lleva).
- [ ] **Step 7: Verificación** — la de arriba.
- [ ] **Step 8: Commit** — `feat(sdd-upgrade): migración v3.0.1 que mueve specs/ a changes/`.

### Task 3 — Este repo, migrado

**Tras**: Task 2
**Modelo**: hilo principal (Native)
**Tests RED**: Native · el criterio de hecho y las zonas de la spec (decisión 8)
**Superficies**: docs, tooling
**Verificación**:
- `test -e .docs/sdd/specs` → falso.
- `git grep -n -F -e ".docs/sdd/specs/" -e "../specs/" -- "*.md"` → solo subcarpetas de `changes/<carpeta>/`, `migrations/`, `tests/batteries/`, `dist/`, la carpeta 0348, las 4 líneas de capacidades y los requisitos nuevos de `migration`.
- `node dist/cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`.
- `sdd estimation log`: tabla de releases igual que `log-before.md` del scratchpad.
- Pre-commit en verde.

**Interfaces**:
- Consume: los comandos de `v3.0.1.md`; `addedCommits` de la Task 1.
- Produce: el repo en 3.0.1.

**Ficheros**: §1.1, «la migración en este repo».

- [ ] **Step 1: Mover** — comando 1. `statistics.test.ts:201-202` y `battery.mjs:30` pasan a `changes`. `upstream.json`: las seis notas, `.docs/sdd/specs/` → `.docs/sdd/changes/`. Commit `chore(sdd): mover specs/ a changes/`.
- [ ] **Step 2: Comando de este repo** — el comando 2 con el filtro `^(skills/sdd-upgrade/references/migrations/|tests/batteries/|dist/|\.docs/sdd/changes/20261117-162953-feature-0348-move-specs-to-changes/)`, en `scratchpad/cmds-repo.txt`, probado en un clon nuevo.
- [ ] **Step 3: Reescribir** — aplicarlo; Edit inverso de `estimation.md:11`, `feature-ids.md:46` y `:48`, `migration.md:398`; reescribir a mano la fila 0348 de `ROADMAP.md` con `specs/` sin prefijo.
- [ ] **Step 4: Derivados** — `moon run kit:build` (`dist/`, `THIRD_PARTY_NOTICES.md`); `sdd estimation log` y comparar la tabla de releases con `log-before.md`; `sdd upgrade --root . --mark 3.0.1`.
- [ ] **Step 5: `git grep` de lectores** — `'specs'`, `"specs"` y `specs/` en `*.ts`, `*.mjs`, `*.js` y `*.json`, fuera de `dist/` y de las fixtures: cada resultado está en la decisión 9.
- [ ] **Step 6: Verificación** — la de arriba.
- [ ] **Step 7: Commit** — `chore(sdd): migrar al kit v3.0.1`.

### Task 4 — `CHANGELOG.md` de la 3.0.1

**Tras**: Task 3
**Modelo**: hilo principal (Native)
**Tests RED**: Native · `sdd roadmap check`
**Superficies**: docs
**Verificación**: `node dist/cli/bin/sdd.js roadmap check --path .docs/sdd` → `Roadmap válido`; pre-commit en verde.

**Interfaces**:
- Consume: la carpeta de esta feature en `changes/`.
- Produce: `## [Unreleased]` con la entrada de la 0348, en la forma de `add-to-changelog`, con `specs/` sin prefijo.

**Ficheros**: `CHANGELOG.md`

- [ ] **Step 1** — entrada con `add-to-changelog`.
- [ ] **Step 2: Commit** — `docs(changelog): entrada de la feature 0348`.

---

## Estimación y esfuerzo

- Tipo: migration
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 2,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 4 tasks; el riesgo es el tamaño del commit de mover. La mediana de la 3.0.0 es de 0,53 h por artefacto, pero esta feature toca más superficie.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Junta: `specs/` no existe y `changes/` tiene las dos → Task 3, verificación `test -e`; clon de la Task 2. ✓
- Commit de mover solo con renombrados y `--follow` → Task 3, Step 1 (`git show --stat` del commit, solo `R100` en `.docs/sdd/`); clon: 3 commits en `--follow`. ✓
- `ROADMAP.md` y `debt.md` reescritos → Task 3, `git grep` final y `roadmap check`. ✓
- Evidencia sin cambios → Task 3, el filtro del comando 2; `git diff HEAD~1 -- ".docs/sdd/changes/*/red/**"` vacío en el segundo commit. ✓
- `docs/guia.md` fuera de `.docs/sdd/` no cambia → Task 2, regla del comando (`startsWith('.docs/sdd/')`); en este repo, `tests/*.md` con `../.docs/sdd/specs/` cambia por la primera regla. ✓
- Sin gate → Task 2, «no gate» en `v3.0.1.md`. ✓
- Informe de no `.md` → Task 2, paso 4 de `v3.0.1.md`; Task 3, Step 5. ✓
- Marcador y commit → Task 3, Step 4 y 7. ✓
- Carpeta repetida, árbol sucio, algo ignorado → Task 2, prueba en clon. ✓
- Sin `specs/`, solo marcador → Task 2, predicado de `v3.0.1.md`; sin observar en un proyecto real (ninguno a mano sin `specs/`): el predicado es una comprobación de existencia. ⚠
- Regla ante conflicto → la fusiona `sdd-archive`. ✓
- `estimation`: carpeta movida en su release → Task 1, test nuevo; Task 3, tabla igual que antes. ✓
- Tabla «Lo que se retira» → Task 2, Steps 3-5 (cada fila); `skills-3x-paths` y `word-budget` en verde. ✓
- Review Focus → Task 2 (vacía) y Task 3 (EOL, tildes). ✓
