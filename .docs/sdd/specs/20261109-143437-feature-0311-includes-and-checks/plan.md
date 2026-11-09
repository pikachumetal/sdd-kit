---
id: 20261109-143437-feature-0311-includes-and-checks
feature: 0311
title: Plan de implementación — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI
spec: ./spec.md
status: approved
created: 2026-11-09
---

# Plan de implementación — Una sola fuente por regla en las skills, y las comprobaciones del corte en el pre-commit y la CI

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: Native, implementa la sesión; sin implementadores. Sujetos de las baterías en `sonnet` (el modelo de cada escenario). Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: native (abajo).
3. **Orden** (spec, decisión 10): la maquinaria (Task 1), las salidas y las inclusiones sin la de idioma (Task 2), la traducción (Task 3) y `learnings.md` (Task 4) antes que la frase de idioma; la frase de idioma, el pre-commit y la CI van juntos en la Task 5, porque con `kit:own` en el pre-commit antes de que salga verde cada commit siguiente quedaría parado.
4. **El humo de las baterías corre una vez, en la Task 5**, con todo el texto escrito: cada escenario mide a la vez su paso (filas 2-21, traducción) y la fila L de idioma. Hacerlo tras la Task 2 y otra vez tras la 5 pagaría dos veces los mismos sujetos.
5. **Kits de los sujetos**: el de `develop` con `git archive develop:dist` en `.temp/k11d`; el de la rama, `moon run kit:build` y copia de `dist/` en `.temp/k11g`. `RUNS_DIR` en `.temp/r11`. `SPEC_DIR` es la carpeta de la spec, con `PHASE` por tanda (`red-c2`, `green-c2`, `humo`, `control`, `refactor`).
6. **`includes/` nuevos, en inglés kebab-case**: `user-language`, `document-literals`, `patch-lane-exit`, `suites-before-gate`, `last-reviewed-sha`, `base-red-debt`, `roadmap-check-failures`, `squash-cited-shas`, `field-validation-defined`, `visual-evidence`, `start-here-offer`, `effort-unavailable`, `deviation`, `unapproved-plan-flag`, `slug-branch-rename`. Cada uno con salto final y sin enlaces relativos (spec, decisión 8).
7. **Riesgo alto**: una inclusión dentro de un elemento de lista o de un paso numerado rompe el párrafo en `dist/`. Mitigación: la línea de la inclusión va sin sangría dentro del párrafo (continuación perezosa de Markdown), y `kit:dist-compare` de cada fichero tocado contra `develop` debe dar solo cambios de texto, no de forma.
8. **Coste estimado**: ~60 sujetos y ~30 $ de baterías (spec, «Previsión de coste»); la sesión, ~7 h.
- Review Focus: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: `node tests/own/check.ts` da `Skills al día`, `grep -rn "Restricciones de código" skills/` no da nada, el pre-commit y la CI corren `kit:own`, `kit:skill-size` y `kit:copies`, y las baterías tocadas no tienen rojos nuevos contra `develop`, con `kitBudget` sin subir.

**Architecture**: un cambio de gramática en la fuente anotada de las copias (`tests/copies/annotated.ts`) para admitir una inclusión dentro de un bloque del kit; quince ficheros de `includes/` que el build ya expande (`build/dist.ts`, `renderLines`); `kit:skill-size` pasa a leer la fuente con `renderLines`; y el pre-commit y la CI ganan las tres comprobaciones.

**Tech Stack**: skills en Markdown con marcas `<!-- kit: … -->`, build y comprobaciones en TypeScript sin compilar (Node ≥ 22.18.0), Vitest en `cli/`, moon 2.6.0, baterías headless (`tests/headless/battery.mjs`), GitHub Actions.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 5 tasks en orden con una sola interfaz entre ellas (la gramática de la Task 1, que usan las Tasks 2 y 5), un error que llega a la rama lo cazan `kit:own`, `kit:copies`, `word-budget.test.ts` o el humo de la Task 5, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia texto de skills, una regla de la gramática de las copias y la orden de dos hooks; ningún módulo, dependencia ni contrato entre módulos nuevo.

## Restricciones globales

### De código

- Una regla vive en un solo sitio: en `includes/<nombre>.md` si la necesitan dos skills, o en el paso que la decide (ADR 0022, regla 3). Al unir dos redacciones, la inclusión toma la más corta que conserva cada condición de las dos; lo que solo dice una se queda en esa skill junto a la inclusión.
- Antes de quitar la copia de una regla de una skill, relee cada paso de esa skill que la nombra por su posición y comprueba que su orden deja aplicarla; la relectura va al walkthrough.
- Una inclusión no lleva enlaces relativos ni marcas `<!-- kit: … -->`; acaba en salto de línea. En una copia, la línea de la inclusión va dentro de un bloque `add` o `sustituye`.
- Un cambio en una copia va con su marca (`<!-- kit: 0311 -->` para añadir, `<!-- kit: 0311 · sustituye: «…» -->` para sustituir), y `kit:copies` en verde.
- `kitBudget` (103.372) no sube; los topes por skill suben solo con la cifra de «Tope propuesto» de la spec y, al cierre, bajan a su medida exacta.
- `tech-stack.md` (23.181) y `architecture.md` (2.253) no crecen.
- Art. X de la constitution: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano (mensajes, avisos) en castellano con tildes. Incumplirlo es Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Skills en inglés; tests, evidencia, avisos y commits en castellano (Art. III).
- Una `|` en el regex de una fila de rúbrica de máquina va escapada, `\|`.

### De proceso

- Política de modelos: el modelo y el effort se declaran en cada despacho; ejes con `sdd-kit:effort-high`; `fable` y `opus xhigh`, prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano (Art. VI), con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; mensaje por fichero con `git commit -F` (el hook bloquea `*` suelto y tokens `/palabra`); antes de commitear, `git diff --cached --name-only`.
- Historia: apertura, un commit por task, cierre (`commit-milestones.md`).
- Temporales solo en el scratchpad de la sesión o en `.temp/` del worktree; se borran por nombre al acabar.
- Al cerrar, el aviso del ticket va a la sesión «sdd-kit develop»; si `ListAgents` no la muestra, al dev-lead.

## Review Focus

- Un bloque `sustituye` de una copia cuyo único contenido es la línea de la inclusión → no da «la marca sustituye no tiene contenido» · Task 1, `copies.test.ts` «una inclusión es el contenido de un sustituye».
- Una frase de idioma que compartía línea con «Forked from…» en una copia, partida en dos líneas → `kit:copies` no da «se come el original» ni «añadido junto a una absoluta» por la línea de procedencia · Task 5, `moon run kit:copies` → `Copias al día`.
- Un commit que solo toca `upstream.json` → corre `kit:copies` · Task 5, la prueba del pre-commit.
- Una inclusión dentro de un paso numerado (`patch-flow.md` paso 2, `sdd-roadmap` paso 7) → en `dist/` el paso sigue siendo un solo elemento de lista · Task 2, `kit:dist-compare` de esos ficheros contra `develop` sin cambios de forma.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: la gramática cambia lo mínimo (una línea de inclusión es contenido del bloque); `kit:skill-size` reutiliza `renderLines`.
- [x] **YAGNI gate**: ninguna abstracción nueva; quince inclusiones con dos usos o más cada una.
- [x] **Brownfield gate**: las copias sin inclusión no cambian de gramática; los avisos de `kit:own` y `kit:skill-size` siguen nombrando `dist/`.
- [x] **Constitution check**: Art. I (humo y RED/GREEN de `c2`), Art. III, Art. IX (sustituir, no añadir), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `includes/{user-language,document-literals,patch-lane-exit,suites-before-gate,last-reviewed-sha,base-red-debt,roadmap-check-failures,squash-cited-shas,field-validation-defined,visual-evidence,start-here-offer,effort-unavailable,deviation,unapproved-plan-flag,slug-branch-rename}.md` — una regla cada uno.
- `tests/batteries/sdd-archive/` — escenario `c2` (fila, molde y montaje).

**Modificar**:

- `tests/copies/annotated.ts` — la inclusión como línea de bloque; avisos fuera de bloque y dentro de valla.
- `tests/own/check.ts` — sale `includeInCopyProblems`.
- `tests/own/repeated.ts` — `REMEDY` nuevo.
- `tests/skill-size/check.ts` — lee `skills/*/SKILL.md` con `renderLines` e `includesFrom`.
- `moon.yml` — `own` y `skill-size` sin `deps`; comentarios de `copies`, `own` y `skill-size`.
- `cli/test/kit/{copies,own,skill-size,dist,word-budget}.test.ts` — casos nuevos y topes.
- Las skills de la tabla del Approach de la spec (filas 1-21) y los ficheros del bloque del encargo (spec, decisión 6).
- `tests/batteries/sdd-implement/battery.md` (`h2`), `tests/batteries/sdd-verify/battery.md` (`f1`), `tests/batteries/sdd-verify/compose-axis.mjs`.
- `skills/sdd-archive/references/learnings.md` — si el RED de `c2` lo exhibe.
- `.githooks/pre-commit`, `.github/workflows/ci.yml`.
- `.docs/sdd/tech-stack.md`, `CLAUDE.md`, `.docs/sdd/roadmap.md` (filas 0152 y 0198), `.docs/sdd/architecture.md` (línea de `includes/`).

**NO se tocan**:

- `build/dist.ts` — `renderLines` e `includesFrom` ya hacen lo que hace falta.
- `skills/sdd-agent-writing/` — spec, decisión 3.
- `.docs/sdd/capabilities/` — el delta lo fusiona el cierre.
- `.docs/sdd/decisions/0022-three-rules-for-kit-text.md` — inmutable.

### 1.6 Dependencias

`SDD_UPSTREAM_DIR` con los clones de las fuentes, en la máquina (ya está) y en la CI (Task 5).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una inclusión rompe un elemento de lista en `dist/` | media | un paso partido en dos | `kit:dist-compare` contra `develop` en la Task 2 y la 5 |
| El saldo de palabras pasa de `kitBudget` | baja | rojo de `word-budget` | salidas antes del idioma; si pasa con todo hecho, desvío |
| El RED de `c2` sale limpio | media | la frase de `learnings.md` no entra | la spec lo prevé: `Ruling:` y fila de deuda abierta |
| La CI no puede clonar una fuente | baja | job rojo antes de la suite | se relanza (`tech-stack.md`, «CI de la base») |

### 1.8 Rollout

Directo: el plugin viaja con el corte de la 0152.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Una copia admite una inclusión dentro de un bloque del kit, y `kit:skill-size` lee la fuente

**Tras**: —
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `cli/test/kit/copies.test.ts`, `cli/test/kit/own.test.ts`, `cli/test/kit/skill-size.test.ts`, `cli/test/kit/dist.test.ts`.
**Superficies**: tooling
**Verificación**: `pnpm --dir cli exec vitest run test/kit/copies.test.ts test/kit/own.test.ts test/kit/skill-size.test.ts test/kit/dist.test.ts` → `Tests  <n> passed (<n>)`; `node tests/copies/check.ts` → `Copias al día: 31 ficheros.`; `node tests/skill-size/check.ts` → las dos líneas `OK:`.
**Se prueba en la aplicación**: no, porque es tooling del repo: lo prueban sus tests y las comprobaciones sobre el kit.

**Interfaces**:
- Consume: `renderLines(text, file, readInclude)` e `includesFrom(repoRoot)` de `build/dist.ts`; `INCLUDE_MARK`.
- Produce: en una copia anotada, `<!-- kit: incluye <nombre> -->` dentro de un bloque `add` o `sustituye` es una línea del bloque; los avisos `<fichero>:<línea>: una inclusión en una copia va dentro de un bloque del kit` y `<fichero>:<línea>: una inclusión va en el texto, fuera de un bloque de código`; `REMEDY` = `déjala en un solo sitio, en includes/ si la necesitan varias skills; antes de quitar una copia, relee cada paso que la nombra por su posición: su orden tiene que dejar aplicarla`.

**Ficheros**: modificar `tests/copies/annotated.ts`, `tests/own/check.ts`, `tests/own/repeated.ts`, `tests/skill-size/check.ts`, `moon.yml` y los cuatro tests.

- [ ] **Step 1: Tests RED** — en `copies.test.ts`: «una inclusión es una línea de un bloque add» (sin problemas), «una inclusión es el contenido de un sustituye» (sin `empty`), «una inclusión justo antes de fin es del bloque», «una inclusión tras la línea en blanco que cierra el bloque da rojo» (`message` = `una inclusión en una copia va dentro de un bloque del kit`), «una inclusión dentro de una valla da el aviso del build»; en `own.test.ts`: el `REMEDY` nuevo, «una racha incluida en una copia y en una propia no da rojo», «escrita a mano en un bloque del kit de una copia, sí», y fuera el caso de «una inclusión es solo de las propias»; en `skill-size.test.ts`: «mide la fuente con sus inclusiones sin dist/» (repo temporal sin `dist/`, `includes/x.md` que lleva un `SKILL.md` a 20.000 bytes → `FALLA: dist/skills/<skill>/SKILL.md ocupa 20000 bytes`); en `dist.test.ts`: «el build expande una inclusión dentro de un bloque de una copia».
- [ ] **Step 2: Implementación** — en `annotated.ts`, el lector trata una línea que casa con `INCLUDE_MARK` como contenido del bloque abierto (no la parsea con `parseMark`), y da los dos avisos fuera de bloque y en valla; `check.ts` de `own` sin `includeInCopyProblems`; `repeated.ts` con el `REMEDY` nuevo; `skillTexts` de `skill-size/check.ts` lee `skills/<nombre>/SKILL.md` con `renderLines(…, includesFrom(repoRoot))` y mide los bytes de ese texto; `moon.yml`: `own` y `skill-size` sin `deps: ['~:build']`, y sus comentarios dicen que no reconstruyen `dist/`.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(kit): una copia incluye dentro de un bloque del kit, y kit:own y kit:skill-size leen la fuente`.

### Task 2 — Las reglas repetidas, en una sola fuente (filas 2 a 21)

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `node tests/own/check.ts` da hoy 23 líneas; tras la task, solo las dos de la frase de idioma (filas 1).
**Superficies**: docs (texto de skills)
**Verificación**: `node tests/own/check.ts` → solo las líneas que empiezan por los sitios de la fila 1 («write everything the user reads in the language of their» y «… in their language skill announcements»); `moon run kit:build kit:copies` → `Copias al día: 31 ficheros.`; `pnpm --dir cli exec vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts` → `Tests  <n> passed (<n>)`; `moon run kit:dist-compare -- <ficheros de dist/ tocados>` → sin cambios de forma.
**Se prueba en la aplicación**: no, porque es texto de skills: lo mide el humo de la Task 5.

**Interfaces**:
- Consume: la inclusión en una copia de la Task 1.
- Produce: los catorce ficheros de `includes/` de las filas 2-21 (todos menos `user-language`), y las marcas `<!-- kit: incluye <nombre> -->` en su sitio.

**Ficheros**: crear los catorce `includes/`; modificar las skills de las filas 2-21 de la tabla del Approach de la spec, que se copian aquí con su destino:

| # | Sitios | Destino |
| --- | --- | --- |
| 2 | `sdd-end-release`, `sdd-retro` (Overview) | `document-literals`: «The literals of the project's documents stay as written here, in Spanish.» |
| 3 | `sdd-archive` cláusula de escalado, `patch-flow.md` paso 3 | `patch-lane-exit` |
| 4 | `closing-suite.md`, `sdd-verify` «Running a gate» paso 1 (copia) | `suites-before-gate` |
| 5 | `final-review-check.md` paso 2, `control-profiles.md` (re-revisión), `closing-the-review.md` «The last reviewed sha» | `last-reviewed-sha` |
| 6 | `merge-recipe.md`, `sdd-worktrees` «If tests fail» (copia) | `base-red-debt` |
| 7 | `records.md`, `sdd-roadmap` paso 5 | `roadmap-check-failures` |
| 8 | `records.md`, `commit-milestones.md` | `squash-cited-shas` |
| 9 | `validation-modes.md`, `control-profiles.md` §Field validation | `field-validation-defined` |
| 10 | `validation-modes.md`, `sdd-implement` «In `pair`» | `visual-evidence` |
| 11 | `sdd-explore` (Config), `sdd-roadmap` paso 7 | `start-here-offer` |
| 12 | `encargo-revision.md` | sale «It goes out in the background as soon as the last task's commit exists»; queda el porqué del worktree |
| 13 | `closing-the-review.md` «The single re-review» | sale «the «What to Check» of the axes that went out»: «filled as its first paragraph says» |
| 14 | `sdd-implement` (método) | sale la frase de los cuatro factores |
| 15 | `sdd-implement` «Effort», `sdd-parallel-agents` (copia) | `effort-unavailable` |
| 16 | `control-profiles.md` «Task's file changed in the base» | el «Trigger» remite al paso 1 de `sdd-implement`, que gana la excepción de los tres registros compartidos |
| 17 y 19 | `sdd-implement` «Deviation» y «Rulings», `control-profiles.md` §Deviation | `deviation`, con las ramas de la decisión 17 de la spec |
| 18 | celda de la tabla de gates de `control-profiles.md` | «Scope brake (see «Scope brakes»)» |
| 20 | red flags de `sdd-propose` y `sdd-implement` | `unapproved-plan-flag` |
| 21 | `patch-flow.md` paso 2, `nombrado.md` | `slug-branch-rename` |

Ramas de `deviation` (spec, decisión 17): en la inclusión, la definición, el «si el RED lo exhibe», el ruling, la corrección en su sitio sin commitear, el revisor `sonnet` + `sdd-kit:effort-medium` con los siete puntos de `review-spec.md` si cambia el delta, la parada con 🦆 y ✋, la task nueva al final para una task cerrada, `unattended`, la ronda de REFACTOR o fix que cambia un THEN o un AND, y el AND de «Decisiones tomadas con el dev-lead»; se quedan en `control-profiles.md` §Deviation el detalle de la aprobación y los ficheros añadidos; en §Scope brakes, la respuesta a un freno.

- [ ] **Step 1: RED** — `node tests/own/check.ts` → 23 líneas, guardadas en el workspace.
- [ ] **Step 2: Relectura** — por cada fila de salida (12, 13, 14, 16, 18) y por cada frase que la inclusión une con otra redacción, relee los pasos que la nombran por su posición en la skill que la pierde y anota en el ledger `Ruling:` qué paso la aplica y en qué orden.
- [ ] **Step 3: Implementación** — los catorce `includes/` y sus marcas; en las copias, dentro de un bloque `<!-- kit: 0311 -->` o `sustituye`.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; `node <scratchpad>/words.mjs .` → el total del kit ≤ 103.338.
- [ ] **Step 5: Commit de la task** — `refactor(skills): una sola fuente por regla, en includes/ o en el paso que la decide`.

### Task 3 — Las secciones fijas del encargo de los ejes, en inglés

**Tras**: Task 2
**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `grep -rn "Restricciones de código" skills/` da hoy 15 líneas.
**Superficies**: docs (texto de skills), tooling de baterías
**Verificación**: `grep -rn "Restricciones de código" skills/` → sin salida (código 1); `grep -rn "Cómo revisar" skills/ tests/batteries/` → sin salida; `moon run kit:build kit:copies kit:own` → `Copias al día` y solo las líneas de la fila 1; `node --check tests/batteries/sdd-verify/compose-axis.mjs` → código 0.
**Se prueba en la aplicación**: no, porque es texto de los encargos: lo mide el humo de la Task 5 (`h2`, `f1`).

**Interfaces**:
- Consume: nada.
- Produce: `## Code constraints` y `## How to review` como títulos fijos de los encargos; `compose-axis.mjs` busca «How to review».

**Ficheros**: modificar `skills/sdd-verify/references/{encargo-revision,spec-reviewer-prompt,code-reviewer-prompt,architecture-reviewer-prompt}.md`, `skills/sdd-implement-subagent/{implementer-prompt,task-reviewer-prompt,re-review-prompt}.md`, `skills/sdd-implement/SKILL.md` (red flag), `tests/batteries/sdd-implement/battery.md` (`h2`), `tests/batteries/sdd-verify/battery.md` (`f1`), `tests/batteries/sdd-verify/compose-axis.mjs`.

- [ ] **Step 1: Implementación** — `## Restricciones de código` → `## Code constraints`; `## Cómo revisar` → `## How to review`; el castellano dentro de los bloques (cabecera de `encargo-revision.md`, «Cómo revisar», cuerpo de «Review Focus», «Revisas `<sha>` como si fuera el último commit…», «Si una regla de aquí choca con las Restricciones de código, mandan las Restricciones») en inglés con el mismo sentido; «De código», «De proceso» y «Restricciones globales» se quedan; en las copias, `sustituye`.
- [ ] **Step 2: Verificación** — los comandos de «Verificación».
- [ ] **Step 3: Commit de la task** — `refactor(skills): las secciones fijas del encargo de los ejes en inglés`.

### Task 4 — El aprendizaje se mide contra el tope de la base (si el RED lo exhibe)

**Tras**: Task 3
**Modelo**: la sesión (Native); sujetos `sonnet`
**Tests RED**: hilo principal · escenario `c2` de `tests/batteries/sdd-archive/battery.md`: molde con `tech-stack.md` de 900 palabras, tope 950 en la rama y 920 en `origin/develop` (otra feature bajó el tope sin tocar el contenido), un walkthrough con un aprendizaje de 40 palabras para `tech-stack.md`, y un pre-commit que mide el tope. Fila de rúbrica: falla si el sujeto escribe el aprendizaje sin medir contra el tope de `origin/develop` (`tools: /git show origin\/develop:.*(budget\|cap\|tope)/ antes de /Edit.*tech-stack/` o equivalente) o si el commit del merge de sincronización sale rojo. n = 2, kit de `develop`.
**Superficies**: docs (texto de skill), baterías
**Verificación**: `DRY_RUN=1 BATTERY=sdd-archive SCENARIOS=c2 node tests/headless/battery.mjs run`; `node tests/headless/battery.mjs verdict` de la tanda RED (2 sujetos) y de la GREEN (2 sujetos) → la línea de `c2`; `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts` → verde.
**Verificación lenta**: las tandas de `c2`, ~15 min cada una, en segundo plano.
**Se prueba en la aplicación**: no, porque es texto de skill: lo mide `c2`.

**Interfaces**:
- Consume: nada.
- Produce: la frase de la decisión 7 de la spec en «A destination at its word cap» de `skills/sdd-archive/references/learnings.md`, o un `Ruling:` si el RED sale limpio.

**Ficheros**: crear el molde y la fila de `c2`; modificar `skills/sdd-archive/references/learnings.md`.

- [ ] **Step 1: RED** — `c2` con el kit de `develop`, n = 2. Limpio en los dos: `Ruling:` en el ledger, la frase no se escribe, y el MODIFIED de `archive` sale del delta (enmienda `sin aprobar` aplicando la decisión 14 de la spec).
- [ ] **Step 2: Implementación** — la frase de la decisión 7, en sustitución del primer párrafo; saldo ≤ 0 en `sdd-archive` con lo que salió en la Task 2.
- [ ] **Step 3: GREEN** — `c2` con el kit de la rama, n = 2.
- [ ] **Step 4: Commit de la task** — `fix(sdd-archive): medir el aprendizaje contra el tope de la base antes de escribirlo`.

### Task 5 — La frase de idioma, las comprobaciones en el pre-commit y la CI, y el humo

**Tras**: Task 4
**Modelo**: la sesión (Native); sujetos `sonnet`
**Tests RED**: hilo principal · `node tests/own/check.ts` da las dos líneas de la fila 1; `.githooks/pre-commit` no corre `kit:own`: un commit con una frase repetida entra (prueba en un worktree de prueba desanclado de la rama, antes del cambio).
**Superficies**: docs (texto de skills), tooling (hooks, CI)
**Verificación**: `node tests/own/check.ts` → `Skills al día: <n> ficheros.`; `moon run kit:build kit:copies kit:skill-size` → verde; `pnpm --dir cli exec vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts test/kit/dist.test.ts` → `Tests  <n> passed (<n>)`; la prueba del pre-commit (Step 3); el humo (Step 5).
**Verificación lenta**: el humo de las baterías (34 sujetos) y sus controles, en segundo plano.
**Se prueba en la aplicación**: no, porque es texto de skills y hooks del repo: lo miden el humo y la prueba del pre-commit.

**Interfaces**:
- Consume: la inclusión en una copia (Task 1); las inclusiones y salidas (Task 2); la traducción (Task 3).
- Produce: `includes/user-language.md` = «Write everything the user reads in the language of their message, skill announcements and the one-line notes between tool calls included, also while the reference you follow is in English.»; el pre-commit con `kit:own`, `kit:skill-size` y, si `git diff --cached --name-only` toca `skills/`, `includes/` o `upstream.json`, `kit:copies`; la CI con el paso de clones y las tres tareas.

**Ficheros**: crear `includes/user-language.md`; modificar el Overview de los 15 `SKILL.md` de la fila 1, `.githooks/pre-commit`, `.github/workflows/ci.yml`, `cli/test/kit/word-budget.test.ts`, `.docs/sdd/tech-stack.md`, `CLAUDE.md`, `.docs/sdd/roadmap.md` (0152, 0198), `.docs/sdd/architecture.md`.

- [ ] **Step 1: Frase de idioma** — la inclusión en los 15 Overview (en las cinco copias, dentro de su bloque del kit, partida de «Forked from…»); los topes de `word-budget.test.ts` con las cifras de «Tope propuesto» de la spec.
- [ ] **Step 2: Hooks y CI** — `.githooks/pre-commit`: `checks` gana `kit:own` y `kit:skill-size`, y `kit:copies` si el diff staged toca esas rutas; `ci.yml`: un paso que lee las `sources` de `upstream.json` con `node -e`, clona cada `repo` entero en `$RUNNER_TEMP/upstream` y escribe `SDD_UPSTREAM_DIR` en `$GITHUB_ENV`, y la línea de `moon run` gana `kit:copies kit:own kit:skill-size`.
- [ ] **Step 3: Prueba del pre-commit** — en un worktree de prueba de la rama, con `core.hooksPath` en `.githooks`: un commit con la misma frase de 10 palabras en dos skills propias → parado con la línea de `kit:own`; sin `SDD_UPSTREAM_DIR`, un commit que toca `skills/` → parado con su aviso; uno que solo toca `.docs/` → entra. Salida literal al walkthrough; el worktree se borra.
- [ ] **Step 4: Docs** — `tech-stack.md` («Herramientas del repo», «Conjunto rápido», «CI de la base») sin crecer; `CLAUDE.md` (decisión 12 de la spec); filas 0152 y 0198 (decisión 11); `architecture.md` (línea de `includes/`) sin crecer.
- [ ] **Step 5: Humo** — las tandas de la tabla de «Previsión de coste» de la spec con el kit de la rama, N=1; cada rojo, con el mismo escenario y el kit de `develop`; un rojo nuevo es hallazgo y lleva su ronda de REFACTOR.
- [ ] **Step 6: Commit de la task** — `feat(kit): la frase de idioma en una inclusión, y kit:own, kit:copies y kit:skill-size en el pre-commit y la CI`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2,5h
- Estimación de implementación: 7h
- Estimación de revisión: 1h
- Estimación de cierre: 1h
- Base de la estimación: 5 tasks, una de código con tests (Task 1), dos de texto en ~30 ficheros (Tasks 2 y 3), un escenario nuevo con RED y GREEN (Task 4) y el humo de 11 baterías (Task 5); referencia: la 0322 (3 tasks de texto con baterías).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] `node cli/bin/sdd.js lock run -- moon run kit:build kit:skill-size kit:own kit:copies cli:test-slow cli:test-min` en verde (spec, Intent)
- [ ] El run de `ci.yml` del commit empujado de la rama, verde, con las tres tareas en su log
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `kit-distribution` «Una inclusión se escribe una vez…», el AND que remite a las copias → Task 1, `copies.test.ts` y `dist.test.ts`. ✓
- «Una copia incluye dentro de un bloque del kit», THEN y cada AND (bordes, fuera de bloque, valla, `pending`, no se empareja) → Task 1, un caso de `copies.test.ts` / `own.test.ts` por AND; `pending`, en `own.test.ts` («una inclusión en una copia pending vale en cualquier sitio»). ✓
- «Una frase del kit repetida…», THEN con el aviso nuevo y el AND de inclusión en copias → Task 1, `own.test.ts`. ✓
- «Lo que dice kit:own», sin `dist/` y `<n>` de `skills/` → Task 1, `own.test.ts`; corre en el pre-commit y la CI → Task 5, Step 3 y el run de la CI. ✓
- «Ninguna skill ni ninguna fase…», mide la fuente → Task 1, `skill-size.test.ts`; pre-commit y CI → Task 5. ✓
- «Lo que dice kit:copies…», remite al ADDED → Task 5. ✓
- «Las comprobaciones de las skills corren en el commit y en la CI», THEN y ANDs (frase repetida, sin variable, solo `.docs/`, clon sin tag, CI) → Task 5, Step 3 (los tres primeros, ejecución real); clon sin tag, ejecución real con un clon de prueba sin el tag en el mismo Step; CI, el run de la rama. ✓
- Reglas de `kit-distribution` → Task 1 y Task 5; las fusiona el cierre. ✓
- `verification` «La revisión final sale en ejes…», «Code constraints» y «How to review» → Task 3, `grep`; humo `f1` (Task 5). ✓
- `verification` Idioma de los nombres → Task 3. ✓
- `feature-flow` «El encargo del implementador lleva el decálogo…» → Task 3; humo `h2` (Task 5). ✓
- `archive` «Un aprendizaje cuyo destino no cabe…», THEN y ANDs → Task 4, `c2` RED/GREEN. ✓
- `archive` Límites (sin cifras) → lo fusiona el cierre. ✓
- Intent: `check.ts` → `Skills al día` → Task 5; `grep` vacío → Task 3; orden de corte en verde → §3; baterías sin rojos nuevos → Task 5, Step 5. ✓
- Topes (decisión 10) → Task 2, Step 4, y Task 5, Step 1; medida exacta al cierre. ✓
- Review Focus → Task 1 (`sustituye` con solo la inclusión), Task 5 (`kit:copies` con la frase partida; commit que toca `upstream.json`, en el Step 3), Task 2 (`kit:dist-compare`). ✓
