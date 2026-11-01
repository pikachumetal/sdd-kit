---
id: 20261101-191641-feature-0277-sdd-retro
feature: 0277
title: Plan de implementación — sdd-retro, señales del cierre y repaso por causa de cada release
spec: ./spec.md
status: done
created: 2026-11-01
---

# Plan de implementación — sdd-retro, señales del cierre y repaso por causa de cada release

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: la sesión implementa las tres tasks; ejes de la revisión final con el modelo de `sdd-verify`.
2. Ejecución: Native (abajo).
3. `causes.ts` aparte de `debt.ts`: `debt.ts` valida la forma y exporta lo que `causes.ts` lee (`caseCount`, secciones). Un verbo de lectura no se mezcla con el check.
4. La lectura de la retro anterior busca el encabezado por texto y parte las filas con el `tables.ts` existente, sin parser nuevo.
5. El RED de `sdd-retro` corre con el kit de la base, pidiendo el cierre o el corte: la skill aún no existe, y `subject.mjs` pasa la esperada solo si existe.
6. Riesgo alto: que `sdd-archive` no llegue a invocar la skill (0 de 4 con una línea que solo la nombra, feature 0147). Por eso el paso usa la forma «First thing…».
7. Coste estimado: 3 h y ~14 $ de sujetos.
8. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el cierre de feature pasa por señales con la salida más barata, y cada corte deja el repaso por causa.

**Architecture**: una skill nueva, con dos pasadas, invocada desde `sdd-archive` y `sdd-end-release`. Lo mecánico del repaso lo hace `sdd roadmap causes`, y su salida entra literal en `retro.md`, que el corte siguiente relee.

**Tech Stack**: TypeScript sin compilar, Vitest y baterías de skills (`tests/headless/battery.mjs`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks poco acopladas (solo comparten los encabezados de la tabla del verbo), un error lo caza el test o el escenario de su task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — un contrato nuevo entre el verbo y la plantilla `retro-template.md`, que el corte siguiente relee.

## Restricciones globales

### De código

- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad). Clean Code: nombres en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano en castellano con tildes.
- Literales del verbo: `## Repaso por causa`, `| Causa | En espera | Lista | Descartadas |`, `## Abiertas en «Lista»`, `| Ítem | Causa | Casos | Destino | Abierta desde |`, `Cerradas desde la <versión>: <n>`, `Sin deuda triada`, `roadmap causes: no existe steering/debt.md`, `--version debe ser X.Y.Z`.
- Literales de la skill: `corrección repetida`, `búsqueda a ciegas`, `documento o skill desmentido`, `error que cazaría un chequeo`; `Retro: <señal> → <salida> (<fichero>)`, `Retro: <señal> → ticket del kit: <qué desmiente>`, `Retro: sin señales`, `Sin propuestas`, `prioriza o descarta`.
- Los topes de `sdd-archive` no suben; el de `sdd-retro` es 700 (`skillMd` y `total`).

### De proceso

- Política de modelos: sujetos en Sonnet, `MAX_PARALLEL=1`; `KIT_DIR` es una copia con `git archive`; `RUNS_DIR` es `.temp/r0277` (máximo 100 caracteres).
- Commit por task, tipo/scope en inglés, cuerpo en castellano y atribución del sistema.
- Si la campaña supera 13,8 $, se para y decide el dev-lead (Art. I).

## Review Focus

- Una `--version` igual a la de una retro ya existente → esa retro no es la anterior, la anterior es la menor · Task 1, `skips the retro of the given version`
- Una retro anterior con la sección y la tabla vacía → es válida: cero heredadas y `Cerradas desde …: 0` · Task 1, `reads an empty previous table`
- Una fila de «Por triar» → no cuenta en ninguna tabla · Task 1, `ignores untriaged rows`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin registro de propuestas ni columna de fecha.
- [x] **YAGNI gate**: `causes.ts` reutiliza `tables.ts` y `caseCount`.
- [x] **Brownfield gate**: `retro.md` conserva su ruta; una retro vieja sin tabla se salta.
- [x] **Constitution check**: Art. I (RED, batería, tabla de reglas retiradas, una pieza sale), Art. II (hueco en la plantilla), Art. VIII, Art. X, Art. XI (`retro.md` tiene lector).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `cli/src/roadmap/causes.ts` — lee `debt.md` y la retro anterior; da las tablas.
- `cli/test/roadmap/causes.test.ts` — el contrato del verbo.
- `skills/sdd-retro/SKILL.md` — las dos pasadas.
- `skills/sdd-templates/templates/retro-template.md` — la forma de `retro.md`.
- `tests/batteries/sdd-retro/` — `battery.md`, `subject.mjs` y moldes.
- `tests/sdd-retro-red.md`, `tests/sdd-retro-green.md` — evidencia.

**Modificar**:

- `cli/src/roadmap/debt.ts` (exportar lo que lee `causes.ts`), `cli/src/roadmap/verbs.ts` y su registro.
- `cli/test/kit/word-budget.test.ts`.
- `skills/sdd-archive/SKILL.md`, `skills/sdd-archive/references/aprendizajes-skills.md`.
- `skills/sdd-end-release/SKILL.md`, `skills/sdd-roadmap/SKILL.md:99`, `skills/sdd-templates/SKILL.md`, `skills/sdd-templates/templates/walkthrough-template.md`.
- `tests/batteries/sdd-archive/battery.md` (`P3`, `c1`), `tests/batteries/sdd-roadmap/battery.md` (`m7`).
- `README.md`, `CLAUDE.md`, `.docs/sdd/mission.md`, `.docs/sdd/architecture.md`, `.docs/workflow/usage-guide.md`.

**Borrar**: `skills/sdd-templates/templates/feedback-template.md`, `skills/sdd-end-release/references/retro.md`.

**NO se tocan**:

- `skills/sdd-feedback/`, `capabilities/kit-feedback.md` — decisión 12 de la spec.
- `releases/*/feedback.md` — artefactos de evento.
- El nombre de `aprendizajes-skills.md` — decisión 16.

### 1.6 Dependencias

`debt-template.md` y `debt.ts` de la 0276.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El agente inventa señales para rellenar | media | medio | `r2`, con `Retro: sin señales` como salida explícita en la plantilla |
| El cierre no invoca la skill | media | alto | forma «First thing…» y control `a1` |
| La campaña se pasa de la previsión | media | medio | techo con `SUBJECT_CAP`, parada del Art. I |

### 1.8 Rollout

Directo: entra en la 3.0.0. Sin migración (spec, «No entra»).

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — `sdd roadmap causes`

**Tras**: —
**Modelo**: la sesión (Native).
**Tests RED**: Native: TDD del propio hilo.
**Superficies**: tooling
**Verificación**: `npx vitest run test/roadmap/causes.test.ts test/roadmap/debt.test.ts` desde `cli/` → `Tests  N passed (N)`
**Se prueba en la aplicación**: no, porque base común: el verbo lo usa la Task 3.

**Interfaces**:
- Consume: `caseCount(origin: string): number` y `HEADERS` de `cli/src/roadmap/debt.ts`; `rowsOf`, `tableBlocks`, `parseSections`.
- Produce: `sdd roadmap causes --path <docs> --version <X.Y.Z> [--json]`, con los literales de «Restricciones globales».

**Ficheros**: crear `cli/src/roadmap/causes.ts`, `cli/test/roadmap/causes.test.ts`; modificar `cli/src/roadmap/debt.ts`, `cli/src/roadmap/verbs.ts` y el registro de verbos.

- [ ] **Step 1: Implementación** — `causesReport(docsPath: string, version: string): CausesReport`, con `{ causes: {cause, waiting, listed, discarded}[], open: {item, cause, cases, destination, openSince}[], closedSinceLast: number | null, previous: string | null }`; `renderCauses(report): string[]`. Tests, con los datos de la spec: `orders causes by listed then name`; `orders open rows by version then debt order`; `inherits open since from the previous retro`; `keeps an item with escaped pipe and link`; `compares versions numerically` (`1.10.0 > 1.9.0`); `skips a retro without the section`; `ignores non-version folders`; `skips the retro of the given version`; `reads an empty previous table`; `ignores untriaged rows`; `ignores settled rows`; `counts closed since the previous retro`; `omits the closed line without a previous retro`; `gives null closed in json`; `says no triaged debt`; `exits 2 without debt.md`; `exits 2 on a malformed version`; `accepts project-root`; `rejects path with project-root`.
- [ ] **Step 2: Build** — `moon run cli:typecheck`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task**.

### Task 2 — `sdd-retro`, pasada de cierre, y `sdd-archive`

**Tras**: Task 1
**Modelo**: la sesión (Native).
**Tests RED**: `tests/batteries/sdd-retro/`, escritos y corridos contra el kit de la base antes de la skill.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`; `BATTERY=sdd-retro STEPS=close node tests/headless/battery.mjs run` y `BATTERY=sdd-archive` con `c1`, `a1` y `a2`, leídos con su rúbrica.
**Se prueba en la aplicación**: no, porque es texto de skill: lo prueba la batería.

**Interfaces**:
- Consume: nada.
- Produce: `sdd-retro`, invocada con `cierre` o `release <versión>`.

**Ficheros**: crear `skills/sdd-retro/SKILL.md`, `tests/batteries/sdd-retro/`, `tests/sdd-retro-red.md`; modificar `skills/sdd-archive/SKILL.md`, `aprendizajes-skills.md`, `walkthrough-template.md`, `tests/batteries/sdd-archive/battery.md`, `word-budget.test.ts`.

- [ ] **Step 1: RED** — moldes y filas `r1`, `r2`, `r3`; `c1`. Corre `r1` × 2, `r2` × 1 y `c1` × 2 contra el kit de la base. Una regla que el baseline no pida sale de la skill.
- [ ] **Step 2: Implementación** — el `SKILL.md` en inglés con la pasada `cierre`: cuatro señales, peldaños, documento desmentido, señal del kit, `Retro: sin señales`. En `sdd-archive`: el paso 3 con «First thing in this step: invoke `sdd-retro` with `Skill`…», la salida del destino que no cabe en el paso de aprendizajes, la oferta del paso 8; sale el paso de skills review, su red flag y su racionalización, y entra la red flag nueva de la tabla de reglas retiradas. §5 de la plantilla gana el hueco `Retro:`.
- [ ] **Step 3: GREEN** — `r1` × 2, `r2` × 2, `r3` × 1, `c1` × 2; controles `a1` y `a2`. Una tanda de REFACTOR si hace falta.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Pasada de release, plantilla, `sdd-end-release` y documentos

**Tras**: Task 1, Task 2
**Modelo**: la sesión (Native).
**Tests RED**: `r4` × 2 y `m7` × 1 contra el kit de la Task 2 sin la pasada; el test de la plantilla en `causes.test.ts`.
**Superficies**: docs, tooling
**Verificación**: `npx vitest run test/roadmap/causes.test.ts test/kit` desde `cli/` → `Tests  N passed (N)`; `r4` × 2 (`unattended`), `m7` × 1 y `rc1` × 1, leídos con su rúbrica.
**Se prueba en la aplicación**: no, porque es texto de skill y plantilla: lo prueba la batería.

**Interfaces**:
- Consume: `sdd roadmap causes`, `sdd-retro`.
- Produce: `retro-template.md`, con «Repaso por causa» (la salida del verbo), «Propuestas» y «Estimación y action items».

**Ficheros**: crear `retro-template.md`; borrar `feedback-template.md` y `references/retro.md`; modificar `skills/sdd-retro/SKILL.md`, `skills/sdd-end-release/SKILL.md`, `skills/sdd-roadmap/SKILL.md`, `skills/sdd-templates/SKILL.md`, `tests/batteries/sdd-roadmap/battery.md`, `README.md`, `CLAUDE.md`, `mission.md`, `architecture.md`, `usage-guide.md`.

- [ ] **Step 1: RED** — molde de `r4` con la deuda y la retro de la spec; `calques the retro template` en `causes.test.ts`.
- [ ] **Step 2: Implementación** — la plantilla, con `Sin propuestas` como salida explícita; la pasada `release` con la entrada única a «Propuestas» y `prioriza o descarta`; el paso 5 de `sdd-end-release` con «First thing…», tras caducar y sacar lo saldado, y la oferta del paso 1 acotada a la estimación y los action items; el resumen nombra las propuestas; `sdd-roadmap:99` y los documentos de la tabla «Lo que se retira». En `sdd-templates`, índice y `description`.
- [ ] **Step 3: GREEN** — `r4`, `m7` y `rc1`; una tanda de REFACTOR si hace falta.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: 3 h
- Base de la estimación: 3 tasks, una skill nueva con batería y un verbo pequeño; referencia: la 0276, 2,5 h estimadas y 1,23 h reales con campaña parecida.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `project-retro`, señales: THEN, sin skill, cuatro señales y peldaños → Task 2, `r1`. ✓
- Documento desmentido en su documento → Task 2, `r1`, porque `operations.md` queda desmentido. ✓
- Peldaño de chequeo y norma del revisor → Task 2, `r1` solo mide el orden; el resto, lectura en la revisión final. ⚠
- La salida que no cabe remite a aprendizajes → Task 2, `c1`. ✓
- Sin señales: la línea, nada más y sin `.claude/skills/` → Task 2, `r2` con `git status`. ✓
- Señal del kit: línea, sin editar, la oferta la nombra → Task 2, `r3`. ✓
- Repaso: `retro.md`, salida literal, propuesta, arrastre, sin escribir deuda, resumen → Task 3, `r4`. ✓
- `unattended` sin pregunta, orden y commit → Task 3, `r4`, `rc1`. ✓
- `--planta 2` fuera, `Sin propuestas`, sin repaso → Task 3, `r4` y test del verbo; `Sin propuestas` en plantilla y lectura de `r4`. ⚠
- `archive`, los dos cierres → Task 2, `a1`, `a2`. ✓
- `archive`, destino que no cabe, cada `AND` → Task 2, `c1`; `unattended` sin observar con sujeto, lectura en la revisión final. ⚠
- `release-flow`, carpeta, cada `AND` → Task 3, `r4`; el caso sin carpeta, `r6`. ✓
- `release-flow`, estimación opcional → Task 3, `r6`, la oferta; pedida sin `debt.md`, sin sujeto, lectura. ⚠
- `cli`, lista de verbos → Task 1, `lists the verb in the help`. ✓
- `cli`, `roadmap causes`, cada `AND` → Task 1, los tests nombrados. ✓
- Plantilla releída → Task 3, `calques the retro template`. ✓
- `planning`, inventario → Task 3, `m7`. ✓
- Reglas retiradas: paso 5, patrón reutilizable, racionalización → Task 2, lectura de `SKILL.md` y `r1`; `retro.md` y `feedback-template` → Task 3, `skills.test.ts` (enlaces e índice). ✓
- Review Focus → Task 1, sus tres tests. ✓
