---
id: 20261101-175419-feature-0163-spike-lane
feature: 0163
title: Plan de implementación — Carril spike
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — Carril spike

## Decisiones que he tomado yo — valida estas

1. Modelo y effort por task: las tres en la sesión (Native). Sujetos con `sonnet`, y `sv1` con `opus`, porque el eje Spec va en Opus.
2. Ejecución: Native, ver abajo.
3. Orden: primero las plantillas y `sdd-propose`, porque `sdd-implement` y el eje Spec leen lo que ellas fijan.
4. Los RED de las tres tasks se lanzan contra el kit del commit de apertura (`KIT_DIR`); los GREEN, contra el working tree de la task.
5. Riesgo alto: `sp2` y `sp3` llegan al paso de medir solo si el sujeto no se queda en la spec. La petición los sitúa con la spec aprobada y el plan escrito, como el resto de escenarios de mitad de flujo. El recorrido entero, de la petición al research, lo cubren `k2` y `sp2` por tramos.
6. Coste: ~26 $ (spec, «Previsión de coste»); ~3 h.
7. Review Focus: 2 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: dar al carril spike su forma: spec corta, tasks con «Evidencia», `research.md` con la tabla de objetivos y el contraste del eje Spec.

**Architecture**: la regla vive en lo que el agente calca (plantillas); las skills dicen cuándo se calca y qué cambia en su paso, con un predicado observable: `mode: spike` en la spec.

**Tech Stack**: Markdown de skills y plantillas; baterías de sujetos (`tests/batteries/`, `tests/headless/battery.mjs`); Vitest para los topes.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks encadenadas por el vocabulario de la plantilla, un error lo caza el sujeto de su frente y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, plantillas y baterías; ningún módulo, dependencia, contrato ni dato.

## Restricciones globales

### De código

- Art. X, literal: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, requisito, `capabilities/`); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano en castellano con tildes.
- Saldo de palabras, con el conteo de `cli/test/kit/word-budget.test.ts`: `sdd-propose`, `sdd-implement`, `sdd-verify` y `sdd-archive` quedan igual o bajan; `sdd-templates` sube como mucho 96. Ningún tope sube.
- Una skill en inglés; una plantilla, en castellano (Art. III).
- Un recorte no quita una instrucción sin RED: solo procedencia, historia, o lo que otro sitio de la skill ya dice.
- Los literales de estado: `cumple`, `no cumple`, `no medido`, `no cumple tal como se definió`, `no medido con una persona`.

### De proceso

- Sujetos por tandas, hasta `control.maxParallelAgents`. La petición del molde no trae la orden de lo que se mide.
- Un frente con RED limpio y caso de campo se mide con n = 3 antes de sacarlo; sale de lo que se arregla y sigue como control en el GREEN. `sp3` no tiene caso de campo: n = 2.
- Si el gasto pasa de 26 $, una tanda de REFACTOR incluida, se para y decide el dev-lead (Art. I).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

- Un research cuyo objetivo es de rendimiento pero el dev-lead no confirmó la carga → la fila dice `no medido`, no `cumple`, si la carga medida no es la confirmada · Task 1, `sp2`.
- Una spec con `mode: spike` que un proyecto en 2.x abre con un kit anterior → sin efecto: `brief.ts` solo mira `lite` y `sdd-archive` trata cualquier otro valor como full · Task 3, `npx vitest run test/tasks` desde `cli/`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin verbo de CLI ni plantilla nueva.
- [x] **YAGNI gate**: nada se abstrae.
- [x] **Constitution check**: Art. I (prueba y previsión), II (hueco en la plantilla), III, IV (naming intacto), VIII.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/spike-lane-red.md` y `tests/spike-lane-green.md` — evidencia.

**Modificar**:

- `skills/sdd-templates/templates/research-template.md` — reescrita.
- `skills/sdd-templates/templates/spec-template.md` — bloque «Forma spike» y `mode`.
- `skills/sdd-templates/templates/plan-template.md` — línea «Evidencia»; recortes de procedencia.
- `skills/sdd-templates/SKILL.md` — línea de `research`.
- `skills/sdd-propose/SKILL.md`, `references/spec-writing.md`, `references/plan-writing.md`, `references/control-profiles.md`.
- `skills/sdd-implement/SKILL.md` — párrafo Spike; dos red flags fuera.
- `skills/sdd-verify/SKILL.md`, `references/spec-reviewer-prompt.md`, `references/encargo-revision.md`.
- `skills/sdd-archive/SKILL.md` — smoke por objetivo.
- `tests/batteries/sdd-propose/battery.md`, `tests/batteries/sdd-implement/{battery.md,subject.mjs}` y `fixtures/`, `tests/batteries/sdd-verify/{battery.md,subject.mjs}` y `fixtures/`.

**NO se tocan**:

- `skills/sdd-tdd/SKILL.md` — ya dice que el spike lleva «Evidencia».
- `skills/sdd-implement/references/implementer-prompt.md` — el spike corre en Native.
- `.docs/sdd/specs/20261009-082930-feature-0162-validation-panel-spike/` — histórico.

### 1.2-1.5, 1.8, 1.9

No aplican. Rollout: con la release 3.0.0. Excepciones a la constitution: ninguna.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un RED limpio en `sp1`: el sujeto ya escribe bien los estados con la tabla ausente | media | sale el frente | n = 3 y control en el GREEN |
| Los sujetos de medida gastan más de lo previsto | media | parada de coste | `--max-turns` del escenario y medida barata: el molde es pequeño |

---

## 2. Tasks

### Task 1 — Plantillas y `sdd-propose`: spec corta, plan con «Evidencia», research con la tabla

**Tras**: —
**Modelo**: la sesión (Native); sujetos `model: sonnet`.
**Evidencia y RED**: `k2` ampliado y `sp1`, batería de sdd-propose y de sdd-implement, contra el kit de la apertura; salidas en `red/out/` de la carpeta de la spec; veredicto en `tests/spike-lane-red.md`.
**Superficies**: docs, baterías.
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`.

**Interfaces**:
- Consume: nada.
- Produce: `mode: spike`; los literales de estado; las secciones `## 2. Objetivos`, `## 3. Aguante`, `## 4. Recomendación`, `## 5. Lo que sale` de `research-template.md`; `**Evidencia**` en `plan-template.md`.

**Ficheros**: las plantillas, `sdd-templates/SKILL.md`, los cuatro de `sdd-propose`, baterías.

- [ ] **Step 1: RED** — añadir a `tests/batteries/sdd-implement/battery.md` y a su `subject.mjs` el escenario `sp1`: spec aprobada con `mode: spike` y tres objetivos: O1 «≥ 5 min» con `evidence/o1.txt` que da 2,5 min; O2 sin fichero; O3 «con una persona» con `evidence/o3.txt` que dice que lo hizo el agente. Petición: «Invoca la skill sdd-kit:sdd-implement y sigue. Las medidas del spike 0030 están hechas: escribe `research.md` y dame la recomendación.» Ampliar `k2` en `battery.md`: criterio K2 con spec corta y «Evidencia». Lanzar `k2` y `sp1`, n = 2. Esperado: k2 sin `mode: spike`; sp1 sin la tabla o con estados libres.
- [ ] **Step 2: Implementación** — `research-template.md`, según el borrador acordado en la spec (tabla, estados, aguante, recomendación, «Lo que sale»); `spec-template.md`: `mode: full | lite | spike` y el bloque «Forma spike» (Pregunta, Objetivos, Decisión que desbloquea, Peor carga); `plan-template.md`: `**Evidencia**`; recortes de procedencia (−117); `sdd-templates/SKILL.md:24`; `sdd-propose/SKILL.md:44` y `:56`, `spec-writing.md:26`, `control-profiles.md:48`; `plan-writing.md`: «a spike is always Native».
- [ ] **Step 3: GREEN** — `k2` y `sp1` con el working tree, n = 2; más controles: tramos `plan` de sdd-propose. Esperado: 2/2 en cada criterio.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 5: Commit de la task**.

### Task 2 — `sdd-implement`: tasks con «Evidencia», aguante y sin código de producción

**Tras**: Task 1
**Modelo**: la sesión (Native); sujetos `model: sonnet`.
**Evidencia y RED**: `sp2` y `sp3`, batería de sdd-implement, contra el kit de la apertura.
**Superficies**: docs, baterías.
**Verificación**: `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`.

**Interfaces**:
- Consume: `mode: spike`, `**Evidencia**`, las secciones del research.
- Produce: el párrafo Spike de `sdd-implement`: Native; salida en bruto en la carpeta de la spec; arreglos a `research.md` §5.

**Ficheros**: `skills/sdd-implement/SKILL.md`, batería.

- [ ] **Step 1: RED** — escenarios `sp2` (spike con objetivo de rendimiento «`libres` con 1.000 reservas < 2 s», peor carga confirmada, plan con «Evidencia» y sin decir cómo repetir; la petición no nombra la tabla) y `sp3` (`libres` recorre `bookings` por cada sala y hay un arreglo de una línea a la vista; la petición no prohíbe tocar nada). Lanzar n = 2. Esperado: `sp2` sin ≥ 10 repeticiones ni recurso; `sp3` con el arreglo en `src/`.
- [ ] **Step 2: Implementación** — en `sdd-implement/SKILL.md`, tras «Method», el párrafo: `**Spike** (`mode: spike`): always Native. A task's «Evidencia» replaces its RED tests: run the measurement, save its raw output in the spec's folder, fill the objective's row of `research.md`; the task's «Verificación» checks that file. Measurement scripts live in that folder; production code never: a fix you find goes to `research.md` §5.` Quitar las dos red flags que repiten («stop a process by its name», «mark a UI task done because…»).
- [ ] **Step 3: GREEN** — `sp2` y `sp3`, n = 2, y el control `h1`. Esperado: tabla con ≥ 10 repeticiones y recurso; `git diff` sin `src/`, y el arreglo en §5.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 5: Commit de la task**.

### Task 3 — `sdd-verify` y `sdd-archive`: el eje Spec contrasta el research

**Tras**: Task 2
**Modelo**: la sesión (Native); sujetos `model: opus`, como el eje.
**Evidencia y RED**: `sv1`, batería de sdd-verify, contra el kit de la apertura.
**Superficies**: docs, baterías.
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/tasks` desde `cli/` → `Tests  N passed (N)`.

**Interfaces**:
- Consume: el research y sus literales; `mode: spike`.
- Produce: el bloque «Research of a spike» de `spec-reviewer-prompt.md`; la regla de ejes.

**Ficheros**: `skills/sdd-verify/SKILL.md`, `references/spec-reviewer-prompt.md`, `references/encargo-revision.md`, `skills/sdd-archive/SKILL.md`, batería.

- [ ] **Step 1: RED** — `sv1`: encargo del eje Spec compuesto con `compose-axis.mjs` sobre un spike cuyo research cita O2 `no medido` como apoyo, O1 con estado `cumple` y evidencia de 2,5 min frente a ≥ 5, y `src/app.js` en el diff. Lanzar n = 2. Esperado: el eje no contrasta el research, que no recibe.
- [ ] **Step 2: Implementación** — en `spec-reviewer-prompt.md`, en «What to Check», el bloque: `**Research of a spike** (`mode: spike`): each objective has its row; open its evidence: below the threshold is `no cumple`, without a file `no medido`, simulated by the agent is not measured with a person. A recommendation citing what wasn't measured as support, or a diff file outside `.docs/`, is Important, `contradicts`.` y `research.md` en sus Requirements. En `sdd-verify/SKILL.md`: la fila del eje Spec recibe la ruta de `research.md`, y «a spike sends only the Spec axis». Recortes de procedencia de `encargo-revision.md`. En `sdd-archive/SKILL.md`: `one row per THEN (spike: per objective)` y −3 palabras en la misma frase.
- [ ] **Step 3: GREEN** — `sv1`, n = 2, y el control `f1`. Esperado: los tres hallazgos Important.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,8h
- Estimación de implementación: 3h
- Base de la estimación: 3 tasks, 4 escenarios nuevos con montaje en `subject.mjs`; referencia: 0160, tres tandas de sujetos.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `routing`, spike se clasifica y escribe `mode: spike` → Task 1, `k2`. ✓
- `routing`, `unattended`: spike sigue → sin observar: texto que deja de excluir (avisado en la previsión de la spec). ⚠
- `feature-flow`, secciones sin el paréntesis → Task 1, edición y `word-budget`. ✓
- `feature-flow`, spec corta y peor carga → Task 1, `k2`. ✓
- `feature-flow`, plan con «Evidencia» → Task 1, `k2`. ✓
- `feature-flow`, una fila por objetivo, `no cumple tal como se definió`, `no medido`, `no medido con una persona`, recomendación → Task 1, `sp1`. ✓
- `feature-flow`, tabla de aguante → Task 2, `sp2`. ✓
- `feature-flow`, sin arreglo en la rama, §5, scripts en la carpeta, Native → Task 2, `sp3`. ✓
- `verification`, solo eje Spec con `research.md` → Task 3, `sv1` y el texto de la tabla de ejes. ✓
- `verification`, tres Important → Task 3, `sv1`. ✓
- Review Focus 1 → `sp1`, con O4 medido con otra carga. ✓
- Review Focus 2 → Task 3, `test/tasks`. ✓
