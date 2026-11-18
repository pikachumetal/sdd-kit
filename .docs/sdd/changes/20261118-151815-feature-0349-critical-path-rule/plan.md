---
id: 20261118-151815-feature-0349-critical-path-rule
feature: 0349
title: Plan de implementación — El camino crítico
spec: ./spec.md
status: draft
created: 2026-11-18
---

# Plan de implementación — El camino crítico

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las cinco tasks; sujetos de batería en `sonnet` (el lanzador de `tests/headless/battery.mjs`), en tandas de hasta 3. Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native, ver la línea `Ejecución`.
3. Una task por skill que se mide, más una de plantillas: cada una lleva su RED con el texto vigente, la edición y su GREEN; la de plantillas va primero porque las demás leen sus campos.
4. Los escenarios nuevos se llaman `cp1` (`sdd-propose`), `cp2` (`sdd-implement`), `cp3` (`sdd-verify`), `cp4` y `cp5` (`sdd-archive`). El check falso de los moldes es `scripts/critical-path.mjs`, un script Node que imprime líneas fijas de un fichero `critical-path.out` del molde y sale con el código que dice su primera línea (`exit: <n>`): el molde fija lo que el check dice sin parsers.
5. La regla de niveles entra en `sdd-tdd` sustituyendo «Rule 1: Name the Core Flow» de `writing-e2e.md`, que pasa a «Rule 1: The List Decides What Stays»; el saldo de `sdd-tdd` queda igual o baja.
6. Riesgo alto: el RED de `cp4` puede salir limpio (el cierre vigente no borra nada, y un sujeto sin la regla tampoco borra): su fila «Falla si…» mira que el borrado ocurre, así que el RED falla por omisión, que es el fallo que la regla cura (Art. II, elemento omitido).
7. Coste estimado: 37 sujetos, ~21,7 $ (spec, «Previsión de coste»); ~6 h de implementación.
- Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que un proyecto con «Camino crítico» cierre cada feature y cada patch dejando en la base solo unitarios y filas de `critical-path.md`.

**Architecture**: solo texto del kit: plantillas de `sdd-templates`, reglas de `sdd-tdd`, el brief del implementador, el encargo del eje Código y el paso 1 de `sdd-archive`. El check es del proyecto; el kit lee dos campos de `operations.md` y los prefijos de su salida.

**Tech Stack**: Markdown de skills y plantillas; baterías de `tests/batteries/`; Vitest de `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las cinco tasks son texto que comparte un contrato (los campos y los prefijos) sin interfaces de código entre ellas, un error lo caza la batería de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo texto de skills y plantillas, sin módulo, dependencia ni contrato de código

## Restricciones globales

### De código

- Contrato con `sdd-project-template`, literal: `.docs/sdd/steering/critical-path.md`, tabla `Nivel | Camino | Crit. | Test | Evidencia`; campo «Camino crítico: `` `<comando>` · cubre <suites> ``»; campo «Tests de feature: `` `<comando>` ``», que pasa solo los `fuera:`; línea del check `<prefijo> <id del test>`; prefijos `fuera:`, `ya-en-base:`, `lista-tocada:`, `fila-nueva:`, `freno-modificado:`, `sin-base:`; código distinto de 0 solo con `fuera:` o un fallo propio del check.
- La pregunta, literal: «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.»
- El aviso, literal: «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.»
- El aviso, literal: «`Camino crítico` declarado sin `critical-path.md`: no borro nada.»
- Skills en inglés (Art. III); `kit:own` rechaza castellano en `skills/` salvo literales entre comillas o backticks.
- Ningún `SKILL.md` de 20.000 bytes o más; topes de `cli/test/kit/word-budget.test.ts`: solo sube `sdd-templates` total a 17.460.
- Art. X: sin comentarios que repitan el código ni que citen documentos; funciones de 20 líneas como mucho y 3 parámetros; texto humano en castellano con tildes.

### De proceso

- Política de modelos: la de la spec (`Política de modelos:`); sujetos en `sonnet`.
- Antes de commitear, `git diff --cached --name-only`; el pre-commit corre con `core.hooksPath` `.githooks`.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia.
- Tras editar `skills/`, `moon run kit:build` antes de lanzar sujetos.

## Review Focus

- Un `fuera:` cuyo id casa con dos ficheros de la rama por el final de su ruta (`login.spec.ts` en dos carpetas) → el cierre no adivina: para y nombra los dos · Task 5, fila de `cp4` con dos ficheros que acaban igual
- La persona contesta «no» a la fila propuesta → el test se borra como los demás y el 4.1 lo dice · Task 5, fila de `cp4` con la respuesta en `TURN2`
- `Camino crítico` con `cubre` que nombra una suite que no está en «Suites» → el cierre para sin borrar y la nombra · Task 5, fila de `cp4`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: solo texto; el mecanismo es del proyecto.
- [x] **YAGNI gate**: ninguna abstracción nueva.
- [x] **Brownfield gate**: retrocompatible: sin «Camino crítico», el kit se comporta como hoy.
- [x] **Constitution check**: Art. I (RED/GREEN por skill), Art. II (huecos en plantilla), Art. VIII (plantilla en `sdd-templates`), Art. XI (fila de documento).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/templates/critical-path-template.md` — la lista: tabla y criterios A, B, C y Arnés.

**Modificar**:

- `skills/sdd-templates/templates/operations-template.md` — campos «Camino crítico» y «Tests de feature».
- `skills/sdd-templates/templates/spec-template.md` — «Dónde se prueba»: el nivel más bajo; con camino crítico, de feature o fila propuesta.
- `skills/sdd-templates/templates/patch-template.md` — §4: la fila propuesta.
- `skills/sdd-templates/templates/walkthrough-template.md` — 4.1: la línea de los tests de feature borrados.
- `skills/sdd-templates/SKILL.md` — la plantilla nueva en su índice, si lo tiene.
- `skills/sdd-tdd/references/writing-e2e.md`, `skills/sdd-tdd/SKILL.md` — la regla de niveles y de tests de feature.
- `skills/sdd-implement-subagent/implementer-prompt.md` — la regla en el brief.
- `skills/sdd-verify/SKILL.md` (fila del encargo del eje Código), `skills/sdd-verify/references/code-reviewer-prompt.md`.
- `skills/sdd-archive/SKILL.md` (paso 1 y mensaje final), `skills/sdd-archive/references/closing-suite.md`, `skills/sdd-archive/references/validation-modes.md`.
- `tests/batteries/{sdd-propose,sdd-implement,sdd-verify,sdd-archive}/battery.md` y sus `subject.mjs` — los escenarios `cp1`-`cp5`.
- `cli/test/kit/word-budget.test.ts` — tope de `sdd-templates`.
- `.docs/sdd/steering/architecture.md` — fila de `critical-path.md`.
- `PRODUCT.md` — glosario: «camino crítico», «test de feature».

**NO se tocan**:

- «Flujos core», «Títulos heredados» y el test de títulos de `writing-e2e.md` fuera de la regla 1 — los retira la 0350.
- `skills/sdd-upgrade/`, `skills/sdd-init/` — 0350.

### 1.6 Dependencias

- Contrato con `sdd-project-template` (su 0105-0107); el check real no se usa en las pruebas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| RED limpio en `cp2` o `cp3` | media | se pierde la evidencia de la regla | la fila mira la omisión (el test de componente no escrito, la lista sin marcar); si sale limpio igual, Art. I: no se escribe esa regla y se dice |
| `sdd-tdd` no cabe | media | rojo de `word-budget` | la regla 1 se reescribe entera, no se añade |

### 1.8 Rollout

Sale en la misma release que la 0350, que retira «Flujos core».

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Plantillas, documentos y la regla de «Dónde se prueba»

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sonnet`
**Tests RED**: escenario `cp1` en `tests/batteries/sdd-propose/battery.md`, n = 1, con el texto vigente: sobre el molde `reservas` con `ReservationServiceTests` unitario, «Camino crítico: `node scripts/critical-path.mjs` · cubre `api`» y una petición de cancelar reserva; «Falla si…» `file: spec.md /Dónde se prueba[\s\S]*ReservationServiceTests/` ausente, o una línea de «Dónde se prueba» que nombra un test de `api` sin «de feature, se borra al cerrar» ni «fila propuesta:».
**Superficies**: docs · tooling
**Verificación**: `pnpm exec vitest run test/kit/word-budget.test.ts test/kit/templates.test.ts` desde `cli/` → `Tests  N passed (N)`; `SCENARIOS="cp1" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` → `cp1` verde
**Interfaces**:
- Consume: nada
- Produce: los campos «Camino crítico» y «Tests de feature» de `operations-template.md`; `critical-path-template.md`; el hueco de «Dónde se prueba»

**Ficheros**: crear `skills/sdd-templates/templates/critical-path-template.md`; modificar las plantillas de 1.1, `cli/test/kit/word-budget.test.ts`, `.docs/sdd/steering/architecture.md`, `PRODUCT.md`, `tests/batteries/sdd-propose/battery.md`

- [ ] **Step 1: RED** — `cp1` con el texto vigente; guardar la salida en `red/cp1/` de la carpeta de la spec.
- [ ] **Step 2: Implementación** — `critical-path-template.md`: frontmatter-less, título `# Camino crítico — <proyecto>`, un bloque `>` con los criterios A, B, C y Arnés (los de la spec) y «un test por camino, en el nivel más bajo que lo ve; solo la edita una persona», y la tabla `| Nivel | Camino | Crit. | Test | Evidencia |`. `operations-template.md` §Testing, tras «Temporales»: `- **Camino crítico**: <comando del check del proyecto · cubre <suites de «Suites» de nivel integración o E2E>; lista en .docs/sdd/steering/critical-path.md; o «ninguno»>` y `- **Tests de feature**: <comando que pasa una vez los tests que el check marca fuera:, los que añade la rama>`. `spec-template.md:93`: «Una línea por comportamiento: dónde se prueba y como qué prueba existente, en el nivel más bajo que ve el fallo. Con «Camino crítico» en `operations.md`, cada test de una suite de su alcance dice «de feature, se borra al cerrar» o «fila propuesta: <criterio A, B, C o Arnés>», y la fila propuesta va también al ✋.» `patch-template.md` §4: línea `- Fila propuesta: <test · criterio> | ninguna` (solo con «Camino crítico»). `walkthrough-template.md` 4.1: `- Tests de feature: <comando> → <resultado> · borrados: <ids> *(solo con «Camino crítico»)*`. `word-budget.test.ts`: `'sdd-templates': { skillMd: 1614, total: 17460 }`. `architecture.md`: fila de `critical-path.md` (estado · la escribe una persona · la leen el check y `sdd-verify` · un test por camino). `PRODUCT.md` glosario: los dos términos de la spec.
- [ ] **Step 3: Build** — `moon run kit:build`.
- [ ] **Step 4: GREEN** — `cp1` con el texto nuevo, n = 1; salida en `green/cp1/`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación».
- [ ] **Step 6: Commit de la task**.

### Task 2 — `sdd-tdd` y el brief del implementador

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sonnet`
**Tests RED**: escenario `cp2` en `tests/batteries/sdd-implement/battery.md`, como `t1a` (encargo compuesto por `subject.mjs`), n = 2: molde `reservas` con «Camino crítico» que cubre `api` (integración), `critical-path.md` con 3 filas, `ReservationServiceTests` unitario, y una task «cancelar reserva no reembolsa tras 24 h» sin fila propuesta; «Falla si…»: `file: critical-path.md` cambiado (`tools: /critical-path\.md/` en una escritura presente), o el test nuevo va a `api` cuando `ReservationServiceTests` ve la regla.
**Superficies**: docs
**Verificación**: `pnpm exec vitest run test/kit/word-budget.test.ts` → verde; `SCENARIOS="cp2 t1a" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-implement/battery.md` → `cp2` verde, `t1a` verde (control)
**Interfaces**:
- Consume: «Camino crítico» de Task 1
- Produce: nada

**Ficheros**: `skills/sdd-tdd/references/writing-e2e.md`, `skills/sdd-tdd/SKILL.md`, `skills/sdd-implement-subagent/implementer-prompt.md`, `tests/batteries/sdd-implement/battery.md`

- [ ] **Step 1: RED** — `cp2` con el texto vigente; salida en `red/cp2/`.
- [ ] **Step 2: Implementación** — `writing-e2e.md` «Rule 1: The List Decides What Stays»: with «Camino crítico» in `operations.md` §Testing, `critical-path.md` is the list and «Flujos core» isn't read; a test goes at the lowest level that sees the failure; a test of a covered suite that isn't a row is a feature test: it runs in the task's «Verificación» and the close deletes it; never edit `critical-path.md`: a new row is a proposal for the spec's ✋; without «Camino crítico», the current Flujos core paragraphs, shortened so the total of `sdd-tdd` stays ≤ 4.036. `sdd-tdd/SKILL.md`: one line pointing «lowest level that sees the failure» to that rule, replacing an equal number of words. `implementer-prompt.md`: in the brief, «Tests at the lowest level that sees the failure; with «Camino crítico» they're feature tests the close deletes; don't edit `critical-path.md`.», replacing words so the total stays ≤ 8.462.
- [ ] **Step 3: Build** — `moon run kit:build`.
- [ ] **Step 4: GREEN** — `cp2` n = 2 y `t1a` n = 1 de control; salida en `green/cp2/`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación».
- [ ] **Step 6: Commit de la task**.

### Task 3 — El eje Código de `sdd-verify`

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sonnet`
**Tests RED**: escenario `cp3` en `tests/batteries/sdd-verify/battery.md`, como `f5`, n = 2: el diff de `f5` (dos E2E, timeouts subidos, la espera a `savedStatus`) más una línea añadida a `critical-path.md`, con «Camino crítico: `node scripts/critical-path.mjs` · cubre `e2e`» en el encargo y `StatusSelect.test.ts` de componente en el molde; «Falla si…»: `text: /flujo core|core flow/` presente como Important, o ausente un Important sobre el test que cuenta opciones con `StatusSelect`, o ausente un Important sobre `critical-path.md`.
**Superficies**: docs
**Verificación**: `pnpm exec vitest run test/kit/word-budget.test.ts` → verde; `SCENARIOS="cp3 f5" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-verify/battery.md` → `cp3` verde, `f5` verde
**Interfaces**:
- Consume: «Camino crítico» de Task 1
- Produce: nada

**Ficheros**: `skills/sdd-verify/SKILL.md`, `skills/sdd-verify/references/code-reviewer-prompt.md`, `tests/batteries/sdd-verify/battery.md` y su `subject.mjs`

- [ ] **Step 1: RED** — `cp3` con el texto vigente; salida en `red/cp3/`.
- [ ] **Step 2: Implementación** — `SKILL.md:227`: el eje Código recibe «Camino crítico» literal en lugar de «Flujos core» cuando existe, junto a «Retries» y «Timeouts». `code-reviewer-prompt.md` «E2E tests»: with «Camino crítico» in «Project E2E», the first bullet doesn't apply; instead, Important: a test at a higher level than the one that sees the failure, when a lower-level test of that code already exists; and any change in the diff to `critical-path.md`.
- [ ] **Step 3: Build** — `moon run kit:build`.
- [ ] **Step 4: GREEN** — `cp3` n = 2 y `f5` n = 1 de control; salida en `green/cp3/`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación».
- [ ] **Step 6: Commit de la task**.

### Task 4 — `commit-history` y el hueco del walkthrough

**Tras**: Task 1
**Modelo**: la sesión (Native)
**Tests RED**: ninguno: `commit-milestones.md` no cambia de pasos; lo cubre la fila de `cp4` que mira el commit de cierre (Task 5)
**Superficies**: docs
**Verificación**: `grep -n "Camino crítico" skills/sdd-implement/references/commit-milestones.md` → una línea
**Interfaces**:
- Consume: nada
- Produce: la frase del commit de cierre que lee Task 5

**Ficheros**: `skills/sdd-implement/references/commit-milestones.md`

- [ ] **Step 1: Implementación** — en el commit de cierre de feature y de patch: «With «Camino crítico», the closing commit also carries the deletion of the feature tests (`sdd-archive`, step 1).»
- [ ] **Step 2: Build** — `moon run kit:build`.
- [ ] **Step 3: Verificación** — el `grep` de «Verificación» y `pnpm exec vitest run test/kit/word-budget.test.ts`.
- [ ] **Step 4: Commit de la task**.

### Task 5 — El cierre de `sdd-archive`

**Tras**: Task 1, Task 4
**Modelo**: la sesión (Native); sujetos `sonnet`
**Tests RED**: escenarios en `tests/batteries/sdd-archive/battery.md`, n = 2, sobre el molde de `e1` con `scripts/critical-path.mjs` falso:
- `cp4`: la rama añade `e2e/export-pdf.spec.ts`, `e2e/share-pdf.spec.ts` y `exporta en A4` dentro de `e2e/print.spec.ts`, y modifica `e2e/login.spec.ts`; la spec propone fila para `share-pdf.spec.ts › comparte el PDF`; `validation.mode: field`. «Falla si…»: `file: e2e/export-pdf.spec.ts` presente al acabar; `e2e/login.spec.ts` borrado; `print.spec.ts` sin sus otros tests; `share-pdf.spec.ts` borrado sin respuesta; `text: /¿Pegas en `critical-path.md` la fila/` ausente; escritura en `critical-path.md` presente; la línea de tests de feature ausente en el 4.1 de `walkthrough.md`.
- `cp5`: la base trae `e2e/comments.spec.ts` y el check tras `sdd merge --sync` da `ya-en-base: comments.spec.ts › comenta`; «Falla si…»: `text: /La base trae .* tests fuera de la lista/` ausente; `e2e/comments.spec.ts` borrado; una fila nueva en la deuda.
**Superficies**: docs
**Verificación**: `pnpm exec vitest run test/kit/word-budget.test.ts` → verde; `SCENARIOS="cp4 cp5 e1 g5" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-archive/battery.md` → los cuatro verdes
**Interfaces**:
- Consume: los campos de Task 1, la frase de Task 4
- Produce: nada

**Ficheros**: `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/closing-suite.md`, `skills/sdd-archive/references/validation-modes.md`, `tests/batteries/sdd-archive/battery.md` y su `subject.mjs`

- [ ] **Step 1: RED** — `cp4` y `cp5` con el texto vigente; salida en `red/cp4/` y `red/cp5/`.
- [ ] **Step 2: Implementación** — `closing-suite.md`, sección nueva «With «Camino crítico»» antes de «What runs»: the order (feature tests once → check → proposed rows → deletion → the suite on the deleted tree); before the deletion decide by prefix: stop without deleting on `sin-base:`, an unknown prefix, a non-zero exit with no known prefix, `critical-path.md` missing or without rows, or a `cubre` suite missing from «Suites»; delete only `fuera:` of suites with level `integración` or `E2E`; find each file among `git diff --name-only <merge-base>` by the end of its path, and stop if two match; a test in a file with others removes only that test; after the deletion a non-zero exit is red; after a fix pass the order repeats; in `manual`, feature tests and check before presenting the script; the 4.1 line. `SKILL.md` paso 1: una frase que lo dispara («With «Camino crítico» in `operations.md`, first thing in **The suite**: the order of [closing-suite.md](references/closing-suite.md#with-camino-critico)»), y en el mensaje final los avisos `ya-en-base:` (literal de Restricciones) y `lista-tocada:`, `fila-nueva:`, `freno-modificado:`. `validation-modes.md`: la pregunta de la fila, sola, por la vía de «a decision the final review left to the user», en todo modo; sin respuesta no se borra ese test; en `unattended`, se borra y su propuesta va a la deuda con el sha de su task. El saldo de `sdd-archive` ≤ 9.904.
- [ ] **Step 3: Build** — `moon run kit:build`.
- [ ] **Step 4: GREEN** — `cp4` y `cp5` n = 2, `e1` y `g5` n = 2 de control; salida en `green/`.
- [ ] **Step 5: Verificación** — los comandos de «Verificación».
- [ ] **Step 6: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h
- Estimación de implementación: 6 h
- Estimación de revisión: 1 h
- Estimación de cierre: 1 h
- Base de la estimación: 5 tasks de texto con 5 escenarios nuevos de batería; la 0343 y la 0348 como referencia de tiempo por escenario
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` «Dónde se prueba» THEN (endpoint y captura) → Task 1, `cp1` (la línea nombra la superficie). ✓
- AND unitario `ReservationServiceTests` → Task 1, fila de `cp1`. ✓
- AND con «Camino crítico», «de feature» o «fila propuesta», y la fila en el ✋ → Task 1, fila de `cp1`. ✓
- `feature-flow` «la task escribe tests de feature y no toca la lista»: THEN el test se escribe y corre → Task 2, `cp2`. ✓
- AND `git diff` sin `critical-path.md` → Task 2, fila de `cp2`. ✓
- AND unitario y no integración → Task 2, fila de `cp2`. ✓
- `feature-flow` test de títulos (tres requisitos) y prueba de estrés, AND «con Camino crítico, no» → Task 2, regla 1 de `writing-e2e.md`; sin escenario propio: el test de títulos no se pide, y `cp2` falla si el sujeto lo escribe (`tools: /--list/` presente). ✓
- `verification` «ejes»: AND el eje Código recibe «Camino crítico» → Task 3, `cp3` (el encargo lo lleva). ✓
- `verification` «E2E»: AND no marca flujo core, marca el test de opciones y `critical-path.md` → Task 3, filas de `cp3`; las cuatro cláusulas vigentes → control `f5`. ✓
- `archive` cierre: THEN «Tests de feature» y check → Task 5, `cp4` (`tools:` en orden). ✓
- AND la pregunta de la fila, sin respuesta no se borra → Task 5, `cp4`. ✓
- AND «Tests de feature» no pasa `login.spec.ts` → Task 5, `cp4`: el check falso lo marca `ya-en-base:`. ✓
- AND borra `export-pdf`, solo `exporta en A4`, no `login`, no `unit`; en el commit de cierre; el 4.1 → Task 5, `cp4`. ✓
- AND la suite sobre el árbol borrado, código distinto de 0 es rojo → Task 5, `cp4` (`tools:` el check tras el borrado). ✓
- AND la sesión no escribe la lista → Task 5, `cp4`. ✓
- AND lista ausente o `sin-base:` → Task 5, Review Focus y fila de `cp4`. ✓
- AND patch → sin escenario propio: mismo paso de la misma skill (spec, segunda ronda 5). ⚠ avisado en la spec
- `archive` base: THEN el aviso con hasta diez; AND no borra ni abre fila; avisos → Task 5, `cp5`. ✓
- `archive` reglas (cuatro) → Tasks 1 y 5, el texto de `closing-suite.md` y `validation-modes.md`. ✓
- `commit-history` (dos requisitos), AND el borrado en el commit de cierre → Task 4 y fila de `cp4`. ✓
- Review Focus (tres líneas) → Task 5, filas de `cp4`. ✓
