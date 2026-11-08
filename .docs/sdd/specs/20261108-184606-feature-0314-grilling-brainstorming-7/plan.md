---
id: 20261108-184606-feature-0314-grilling-brainstorming-7
feature: 0314
title: Plan de implementación — sdd-grilling con brainstorming de superpowers 7.0.2 y grilling de mattpocock v1.3.2
spec: ./spec.md
status: approved
created: 2026-11-08
---

# Plan de implementación — sdd-grilling con brainstorming de superpowers 7.0.2 y grilling de mattpocock v1.3.2

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las tasks las hace la sesión (Native); los sujetos de la batería, en `sonnet` (columna Modelo de la batería), en tandas de hasta 3 (`MAX_PARALLEL=3`); la revisión final con los ejes de `sdd-verify` (Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`).
2. Ejecución: Native (`execution: auto` en `sdd-kit.json`, recomiendo yo) — dos tasks encadenadas por el veredicto del RED, un error lo caza la batería de su task y el plan cabe en un contexto. La compactación que hubo antes de escribir este plan no activa la frase del cambio de método: el plan y el ledger se escriben después de ella, con la spec releída, y tu `CLAUDE.md` pide lo mecánico con plan claro sin subagent-driven. La frase vale para una compactación posterior a este plan.
3. El RED corre con el kit de `HEAD` antes de tocar la skill: `KIT_DIR` sale de `git archive HEAD:dist` en `.temp/k0314r` (ruta corta), y el GREEN, de `dist/` reconstruido y sin commitear, copiado a `.temp/k0314g`. Los controles, con `git archive develop:dist` en `.temp/k0314d`.
4. El molde `salas-csv` es el de `salas` con la fila 2 añadida a «Próximo» de `.docs/sdd/roadmap.md` del sujeto, escrita desde `subject.mjs`: no se copia la carpeta del molde.
5. W3 en las salidas guardadas se lee sobre los 25 `*.texts.txt` del conjunto fijo de la decisión 13 de la spec, el último mensaje de cada turno.
6. Coste: ~2,5 h de implementación y campaña; sujetos 9,93 $ previstos, techo 13 $ (spec, «Previsión de coste»), con `COST_CAP` por tanda.
7. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: medir con `p1`-`p3` si `sdd-grilling` falla en lo que corrige brainstorming 7.0.2, sustituir solo las frases cuyo RED falle, y dejar las dos fuentes de `sdd-grilling` al día en `upstream.json`.

**Architecture**: tres escenarios y cinco filas de rúbrica en la batería de `sdd-grilling`, un molde derivado de `salas`, hasta cuatro frases sustituidas en su sitio en `skills/sdd-grilling/SKILL.md` (ADR 0022) y dos versiones en `upstream.json`, con los avisos regenerados.

**Tech Stack**: Markdown de `skills/`, `moon run kit:build`, `kit:notices`, `kit:upstream`, `kit:copies`, `kit:own`, `kit:skill-size`, el lanzador de `tests/headless/` y Vitest en `cli/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks encadenadas por el veredicto del RED, un error lo caza la batería de su propia task y el plan cabe en un contexto (`execution: auto` en `sdd-kit.json`). Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — cambia el texto de una skill, una batería y dos versiones de `upstream.json`; ni módulo, ni dependencia, ni contrato, ni datos.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende, y antes se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo).
- Sin comentarios que citen documentos. Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`; la trazabilidad vive en el commit y en el walkthrough.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. Texto humano en castellano con tildes (Art. III).
- Las skills, en inglés (Art. III).
- Cada frase nueva sustituye entera a la vieja, en su sitio: ninguna al lado, ni con «except» o «unless» pegado (ADR 0022). Los textos exactos, los del Approach de la spec.
- `dist/` y `THIRD_PARTY_NOTICES.md` no se editan a mano: salen de `moon run kit:build` y `moon run kit:notices`.
- La entrada de `cli/src/tasks/` en `upstream.json` no se toca (0313).

### De proceso

- Política de modelos: la de la spec (✋, «Política de modelos»); `fable` y `opus xhigh`, prohibidos.
- Método: Native.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task; trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Una sustitución que entra con 1 sujeto de 2 que falla, y el GREEN con 2 de 2 que pasan, pero la batería entera da una fila roja que también falla con el kit de `develop` → no es rojo nuevo; se apunta en la evidencia con las dos salidas · Task 2, controles con `.temp/k0314d`.
- `kit:notices` tras subir las dos versiones → solo cambian las dos filas de `sdd-grilling` en `THIRD_PARTY_NOTICES.md` y `dist/THIRD_PARTY_NOTICES.md` · Task 2, `git diff --stat` tras `kit:notices` y `npx vitest run test/kit/notices.test.ts`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cuatro frases sustituidas como máximo, y un molde que reutiliza `salas` con una fila de roadmap.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Brownfield gate**: los escenarios `g1`-`sk-c` y las filas R/C/F/A/T/B no cambian; la procedencia de `battery.md:78` solo se reescribe si entra la (1).
- [x] **Constitution check**: Art. I (RED antes, previsión en la spec, una pieza entra y otra sale), Art. V y IX (las fuentes al día en `upstream.json`), Art. X (código de `subject.mjs`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-grilling-0314-red.md` — el RED: tabla por sujeto y fila W1-W5, el recuento de W3 en las salidas guardadas y qué sustituciones entran.
- `tests/sdd-grilling-0314-green.md` — el GREEN, los controles y la medición tras la revisión final (solo si entra alguna sustitución).
- `red/`, `green/`, `control/` en la carpeta de la spec — las salidas de los sujetos.

**Modificar**:

- `tests/batteries/sdd-grilling/subject.mjs` — molde `salas-csv`.
- `tests/batteries/sdd-grilling/battery.md` — filas `p1`-`p3`, rúbrica W1-W5 y procedencia.
- `skills/sdd-grilling/SKILL.md` — las sustituciones que entren (Task 2).
- `upstream.json` — superpowers a `v7.0.2` con su nota, mattpocock a `v1.3.2` (Task 2).
- `cli/test/kit/word-budget.test.ts` — tope 921, solo si entran las cuatro.
- `THIRD_PARTY_NOTICES.md`, `dist/` — regenerados.
- la spec y `tasks.md` — enmienda si alguna sustitución sale limpia.

**NO se tocan**:

- `tests/batteries/using-sdd/mold-salas/` — lo comparten otras baterías; `salas-csv` añade su fila en el sujeto.
- `.docs/sdd/capabilities/interviewing.md` — el delta lo fusiona `sdd-archive`.
- La entrada de `cli/src/tasks/` en `upstream.json`.

### 1.6 Dependencias

El lanzador de baterías (`battery.mjs plan` y `run`, `N`, `KIT_DIR`, `PHASE`, `SPEC_DIR`, `RUNS_DIR`, `MAX_PARALLEL`, `COST_CAP`).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| RED limpio en las cuatro | media | sin cambio de texto | enmienda: la Task 2 solo sube las versiones; la feature cuesta el RED |
| El primer turno de `p1`-`p3` termina en la pregunta de carril y no llega a una de diseño | media | W1-W4 sin pregunta que juzgar | la petición ya dice «Carril feature, modo full»; si aun así pasa, se apunta como «sin pregunta de diseño» y no cuenta ni como fallo ni como limpio; con todos así, parar como desvío |
| La tanda supera el techo | baja | 13 $ | `COST_CAP` por tanda; parar y decides tú |

### 1.8 Rollout

Directo: entra en la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — RED de `p1`, `p2` y `p3` con el kit de `HEAD`

**Tras**: —
**Modelo**: la sesión (Native); sujetos `sonnet`, el de la fila.
**Tests RED**: los escenarios `p1`, `p2` y `p3` de `tests/batteries/sdd-grilling/battery.md`, lanzados con el kit de `HEAD`, y W3 sobre las salidas guardadas.
**Superficies**: tooling (batería), docs (evidencia).
**Verificación**: `node tests/headless/battery.mjs plan tests/batteries/sdd-grilling/battery.md` con `SCENARIOS="p1 p2 p3"` → «suma: 6 sujetos»; `DRY_RUN=1 BATTERY=sdd-grilling SCENARIOS=p3 … node tests/headless/battery.mjs run` monta `salas-csv` y su `.docs/sdd/roadmap.md` tiene la fila 2 en «Próximo»; después `BATTERY=sdd-grilling SCENARIOS="p1 p2 p3" SPEC_DIR=<carpeta de la spec> PHASE=red KIT_DIR=.temp/k0314r RUNS_DIR=.temp/r0314 MAX_PARALLEL=3 COST_CAP=3 node tests/headless/battery.mjs run`, puerta `sdd-kit:sdd-propose` en los 6, y la rúbrica W1-W5 leída sujeto a sujeto. Desde `cli/`, `npx vitest run test/kit/headless/molds.test.ts` → `Test Files  1 passed (1)` si construye los moldes de la batería.

**Interfaces**:
- Consume: el molde `salas` de `subject.mjs` (`s.copy(SALAS)`, `s.putKitMarker(SALAS_MARKER)`).
- Produce: la tabla del RED en `tests/sdd-grilling-0314-red.md`, con qué sustituciones entran: (1) si W2 falla en ≥ 1 de 4; (2) si W1 falla en ≥ 1 de 2; (3) si W3 falla en ≥ 1 de 6 o en ≥ 1 salida guardada; (4) si W4 falla en ≥ 1 de 2.

**Ficheros**: crear `tests/sdd-grilling-0314-red.md`; modificar `tests/batteries/sdd-grilling/subject.mjs` y `battery.md`.

- [ ] **Step 1: Molde** — en `molds` de `subject.mjs`, `'salas-csv'`: el de `salas` y, después, la fila `| 2 | Exportar a CSV las reservas de una sala, para que el responsable las cuadre los lunes en su hoja de cálculo; separador punto y coma (su Excel está en castellano) y solo las reservas desde hoy (responsable de salas, 2026-11-01: «así me sirve») | ⏳ |` tras la fila 1 de «Próximo» en `.docs/sdd/roadmap.md` del sujeto.
- [ ] **Step 2: Batería** — filas `p1`, `p2` y `p3` con las peticiones literales de la decisión 11 de la spec (paso `sdd-propose`, moldes `salas`, `salas` y `salas-csv`, esperado `` `sdd-kit:sdd-propose` ``, n 2, umbral 2/2, `sonnet`, procedencia «feature 0314: brainstorming 7.0.2 (porqué primero, sin relleno, pasos de proceso, lo ya decidido)»); las filas W1-W5 de la rúbrica con el texto de la decisión 12; `p1`-`p3` añadidos a R2 y R12, que dicen «todos»; ninguna otra fila R cambia.
- [ ] **Step 3: Seco** — `battery.mjs plan` y `DRY_RUN=1` de `p3`, con la fila 2 comprobada.
- [ ] **Step 4: RED** — `git archive HEAD:dist` a `.temp/k0314r`, la tanda de 6 sujetos, la rúbrica leída con cita literal por fallo; W3 en los 25 `*.texts.txt` del conjunto de la decisión 13; la tabla y qué entra en `tests/sdd-grilling-0314-red.md`. Cada sustitución con 0 fallos: enmienda en la spec (su requisito sale del delta y su escenario queda como regresión), `tasks.md` y este plan.
- [ ] **Step 5: Commit de la task** — `test(sdd-grilling): RED del porqué, el relleno, los pasos de proceso y lo ya decidido`, con la batería, la evidencia, las salidas en `red/` y la enmienda si la hay.

### Task 2 — Las sustituciones que entran, las dos fuentes al día, GREEN y controles

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `sonnet`.
**Tests RED**: las filas W1-W4 que fallaron en la Task 1; `moon run kit:upstream` da hoy las líneas de superpowers y mattpocock de `skills/sdd-grilling/SKILL.md`.
**Superficies**: skills, tooling (`upstream.json`, batería, `word-budget.test.ts`), docs.
**Verificación**: `moon run kit:notices`, y `git diff --stat` solo con `THIRD_PARTY_NOTICES.md` y `dist/THIRD_PARTY_NOTICES.md` además de lo editado; `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos frente a la línea base de la Task 1; `moon run kit:upstream` sin línea de `skills/sdd-grilling/SKILL.md` (queda la de `cli/src/tasks/`); desde `cli/`, `npx vitest run test/kit/notices.test.ts test/kit/word-budget.test.ts test/kit/dist.test.ts` → `Test Files  3 passed (3)`. Si entra alguna sustitución: GREEN `BATTERY=sdd-grilling SCENARIOS="p1 p2 p3" PHASE=green KIT_DIR=.temp/k0314g … COST_CAP=3` con 2 de 2 en cada fila que entró y W5 limpia; batería entera `N=1 PHASE=control KIT_DIR=.temp/k0314g … COST_CAP=6`, y cada fila roja repetida con `KIT_DIR=.temp/k0314d`.

**Interfaces**:
- Consume: qué sustituciones entran, de `tests/sdd-grilling-0314-red.md`.
- Produce: `skills/sdd-grilling/SKILL.md` con esas frases y `upstream.json` al día.

**Ficheros**: modificar `skills/sdd-grilling/SKILL.md`, `upstream.json`, `tests/batteries/sdd-grilling/battery.md` (procedencia), `cli/test/kit/word-budget.test.ts` si entran las cuatro; crear `tests/sdd-grilling-0314-green.md`; regenerar `THIRD_PARTY_NOTICES.md` y `dist/`.

- [ ] **Step 1: Sustituciones** — en `skills/sdd-grilling/SKILL.md`, cada frase que entra sustituye entera a la suya:
  - (1) `:12` «Grill relentlessly until nothing is left silently assumed: every assumption becomes a question or a «decided by me» entry.» → «Leave nothing silently assumed: ask only what changes what gets built, its scope, level or cost, and nothing answers; the rest you fill in is a «decided by me» proposal with its reason, never what only the user knows.»
  - (2) `:12` «Ask next the decision that reshapes most others; one that depends on a decision still open waits.» → «If neither they nor the project say why they want it, ask that first, open, even if you can guess. Then the decision that reshapes most others; one that depends on a decision still open waits.»
  - (3) `:12` «Facts are your job; decisions are the user's.» → «Facts and process steps (writing it up, where it goes, looking further) are yours: do them and say so; decisions, the user's.»
  - (4) `:16` «Skip what the request says or delegates, or the project shows.» → «Skip what the request says or delegates, what the project shows, and what was already decided: don't reopen it.»
  Con la (1), la procedencia de `battery.md:78` deja de citar «supuesto en silencio» como frase de la skill. Con las cuatro, `sdd-grilling: { skillMd: 921, total: 921 }` en `word-budget.test.ts`.
- [ ] **Step 2: Fuentes** — en `upstream.json`, superpowers de `skills/sdd-grilling/SKILL.md` a `"version": "v7.0.2"` con `"note": "La frase de pensar varias ideas antes de proponer; desde v7.0.2, también <las que entren>."` (o la nota vieja si no entra ninguna); mattpocock a `"version": "v1.3.2"`, sin nota.
- [ ] **Step 3: Build** — `moon run kit:notices` y `moon run kit:build`; `git status` sin ajenos.
- [ ] **Step 4: GREEN y controles** — si entra alguna: `dist/` a `.temp/k0314g`, GREEN de `p1`-`p3`, una tanda de REFACTOR si una fila no da 2 de 2, batería entera con N = 1 y los controles con `develop`; evidencia en `tests/sdd-grilling-0314-green.md` y salidas en `green/` y `control/`. Si la (3) entra, la evidencia dice que su GREEN es no regresión.
- [ ] **Step 5: Commit de la task** — `feat(sdd-grilling): <las sustituciones que entran> de brainstorming 7.0.2` o, sin ninguna, `chore(kit): sdd-grilling al día con superpowers v7.0.2 y mattpocock v1.3.2`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2 h
- Estimación de implementación: 2,5 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 2 tasks; la campaña (RED, GREEN, una batería entera y controles, ~10 min por tanda) manda; referencia, la 0297
- Confianza: media (un RED limpio cambia el alcance)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «Una decisión por turno», GIVEN con el porqué dicho → Task 2, con la (2): `p2` (el porqué dicho, W1 no aplica) y R1 de la batería entera. ✓
- MODIFIED, REMOVED de «nada supuesto en silencio» → Task 2, con la (1): el AND vive en «Solo se pregunta…», W5 en `p1`-`p3`. ✓
- ADDED «El porqué va primero», THEN → Task 1 y 2, `p1`, W1. AND (con el porqué, no lo pregunta) → `p2` y `p3`, W2. ✓
- ADDED «Solo se pregunta lo que cambia…», THEN y primer AND → `p2`, `p3`, W2; AND de lo que solo sabe el usuario y AND de alcance, nivel y coste → W5, y R5, R8 y R10 en la batería entera (controles). ✓
- ADDED «Los pasos de proceso no se preguntan», THEN y AND → `p1`-`p3` y las 25 salidas guardadas, W3; AND de las operativas del llamante → W3 no las cuenta, y la puerta y R2 de la batería entera las vigilan. ⚠ el GREEN es no regresión (decisión 13), avisado en la spec.
- ADDED «Lo ya decidido no se reabre», THEN → `p3`, W4; AND «rebate una vez» → `g4`, R7, en la batería entera; AND «repetirlo no es reabrir» → W4 no lo cuenta. ✓
- «Lo que se retira o cambia de forma»: las cuatro frases → Task 2, Step 1; `upstream.json` y avisos → Task 2, `kit:upstream` y `notices.test.ts`; tope → `word-budget.test.ts`. ✓
- Review Focus → Task 2, controles con `develop` y `notices.test.ts`. ✓
