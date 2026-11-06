---
id: 20261105-161645-feature-0306-propose-rework
feature: 0306
title: Plan de implementación — sdd-propose rehecha, con sus references/ como copia o propia
spec: ./spec.md
status: draft
created: 2026-11-05
---

# Plan de implementación — sdd-propose rehecha, con sus references/ como copia o propia

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa cada task; ningún subagente implementador. Los sujetos de la batería, `sonnet`, por `battery.mjs` (su `Modelo` en `battery.md`). La revisión final, con los ejes de `sdd-verify`: Spec y Arquitectura `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native (motivo en la línea `Ejecución`).
3. Orden: las references primero (Tasks 1 a 3) y el `SKILL.md` después (Task 4), porque el `SKILL.md` enlaza lo que ellas dejan y recibe sus anclas nuevas; la batería entera de control, al final (Task 5), con todo el texto ya en su sitio.
4. `own` de `upstream.json`: se sustituyen las cinco rutas sueltas de `skills/sdd-propose/` por la carpeta `skills/sdd-propose/`, como `skills/juguete-propia/` en `kit-distribution`: con la copia fuera, todo fichero de la skill es propio, y los tres nuevos no hay que listarlos uno a uno.
5. Molde de los escenarios nuevos: `reservas` (el de la batería), con lo que cada uno necesita plantado por `subject.mjs`, como hacen `t1`, `co1` y `sp1`: una spec ya escrita para `rv1`, `rv2`, `rv3`, `lr1`, `rr1`, `co7` y `co8`; el fallo de `a2` para `pr1`. `rv3` lleva en el `CLAUDE.md` del molde «Antes de paralelizar subagentes, pide confirmación con el modelo de cada uno».
6. El RED de los diez frentes es estructural (spec, decisión 15): cada task deja en `tests/sdd-propose-0306-green.md` la línea `RED estructural: <fichero>:<línea> «<cita>»` antes de editar.
7. Riesgo alto: una regla que baja a una reference y el sujeto no abre. Lo mide la Task 5 con la batería entera; un rojo de control es un REFACTOR de la frase del paso que apunta a la reference, nunca subir el bloque entero.
8. Coste estimado: 6 h de hilo; ~57,50 $ de sujetos (previsión de la spec) con `COST_CAP` por tanda; la revisión final, ~3 $.
9. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: dejar `sdd-propose` por debajo de 20.000 bytes, sus `references/` propias y en inglés, con la rúbrica de review, el repaso de coherencia y las secciones en `delegate` nuevos.

**Architecture**: solo texto de skills, un registro (`upstream.json`) y la batería; la CLI no cambia. Los bloques que bajan a `references/` se enlazan desde el paso con «First thing …: read», y las tres references nuevas son propias.

**Tech Stack**: Markdown de skills, `moon run kit:build`, `kit:notices`, `kit:own`, `kit:copies`, `kit:skill-size`, `kit:upstream`; Vitest en `cli/`; `tests/headless/battery.mjs` con sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, porque las 5 tasks editan los mismos ficheros encadenados por sus enlaces y anclas (el `SKILL.md` apunta a lo que dejan las tres primeras), un error lo cazan `kit:*`, `cli:test` y la batería de cada task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills, `upstream.json` y la batería: ningún módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Constitution Art. X: sin comentarios que repitan el código; sin comentarios que citen la constitution, una spec, una task, un requisito ni `capabilities/`; nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell; texto humano (mensajes, warnings) en castellano con tildes.
- ADR 0022: la frase que falla se sustituye entera; nunca se añade otra al lado ni una excepción («except», «unless», «instead of») junto a una absoluta.
- Skills en inglés (Art. III); una restricción con salvedad se escribe «no X other than Y»; un literal que el agente escribe para el proyecto o el usuario sigue en castellano, en un bloque `text`.
- Antes de cambiar un título de una reference, `git grep` del título en `cli/` y `tests/`.
- `SKILL.md` de `dist/skills/sdd-propose/` por debajo de 20.000 bytes.
- Topes de `cli/test/kit/word-budget.test.ts` sin cambio: `'sdd-propose': { skillMd: 5250, total: 14200 }`.
- La fila `ws3` de `tests/batteries/sdd-propose/battery.md` no se toca.
- Nunca se edita `dist/` a mano: `moon run kit:build`.

### De proceso

- Política de modelos del Art. IV y la línea `Política de modelos` de la spec: sujetos sonnet; ejes de la revisión final Spec opus+high, Código sonnet+high; en paralelo hasta `control.maxParallelAgents` (3).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task (`commit-milestones.md`); antes de cada commit, `git diff --cached --name-only`.
- Temporales en el scratchpad de la sesión; `RUNS_DIR` en `.temp/<corto>` del worktree; `KIT_DIR` construido con `moon run kit:build` y copiado de `dist/`.

## Review Focus

- Una petición «patch: …» o una sesión `unattended` que clasifica un patch sin pregunta → lee `patch-lane.md` igual · Task 4, escenario `a3` (control, «patch:» en la petición) con `tools: /patch-lane\.md/` presente.
- Un enlace de otra skill a una ancla vieja de `control-profiles.md` (`#vigía-de-silencio`, `#validación-en-campo`, `#quién-valida`) → resuelve a la nueva · Task 3, `cli/test/kit/skills.test.ts` (enlaces), más `git grep -n "vigía-de-silencio\|validación-en-campo\|quién-valida" -- skills CLAUDE.md` vacío.
- Una spec de lite que toca un rol → su revisor va en Sonnet, no en Opus · Task 1, escenario `lr1`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: mover bloques enteros, sin reescribir lo que no falla; tres references nuevas, no una skill nueva.
- [x] **YAGNI gate**: ninguna abstracción; la carpeta en `own` en vez de cinco rutas.
- [x] **Brownfield gate**: los enlaces de otras skills cambian solo el ancla; `patch-flow.md`, dos frases.
- [x] **Constitution check**: Art. I (batería entera), Art. III (inglés), Art. IX y ADR 0022 (sustituir), Art. XI (lo aprendido a `tech-stack.md`, si lo hay).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-propose/references/config-lane.md` — el carril config, pasos 1-5, y su red flag.
- `skills/sdd-propose/references/patch-lane.md` — «Is it really a patch?»: árbol, solución fijada, predicados del ajuste y de la retirada (K16 reescrito), la estimación del patch, sus red flags y racionalizaciones.
- `skills/sdd-propose/references/coherence-pass.md` — el repaso de coherencia, con la frase nueva de `git grep` y los casos reales.
- `tests/sdd-propose-0306-green.md` — la evidencia: RED estructural por frente, GREEN, REFACTOR y controles.

**Modificar**:

- `skills/sdd-propose/SKILL.md` — por debajo de 20.000 bytes (Task 4).
- `skills/sdd-propose/references/review-spec.md` — inglés y rúbrica nueva (Task 1).
- `skills/sdd-propose/references/spec-writing.md`, `plan-writing.md` — propias, frases de `brainstorming` 7.0.2, secciones en `delegate` (Task 2); reciben `§Frontend`, `Se valida en:` y el gate del plan en `pair` (Task 4).
- `skills/sdd-propose/references/control-profiles.md`, `modo-lite.md`, `nombrado.md` — inglés (Task 3); `nombrado.md` recibe red flags de ids (Task 4).
- `skills/sdd-implement/references/patch-flow.md` — paso 5 y su red flag (Task 1); el ancla de `:3` (Task 4).
- `skills/sdd-config/SKILL.md`, `skills/sdd-implement/SKILL.md`, `skills/sdd-verify/SKILL.md`, `skills/sdd-verify/references/encargo-revision.md`, `skills/sdd-archive/SKILL.md`, `CLAUDE.md` — solo el ancla (Task 3).
- `upstream.json` — sin la copia `pending`, dos `concept`, `own` con la carpeta (Task 2).
- `skills/sdd-propose/NOTICE` (borrado), `THIRD_PARTY_NOTICES.md` — por `moon run kit:notices` (Task 2).
- `tests/batteries/sdd-verify/compose-spec-review.mjs` — literales en inglés (Task 1).
- `tests/batteries/sdd-propose/battery.md`, `subject.mjs` — escenarios, filas y procedencia (Tasks 1, 2, 4 y 5).
- `.docs/sdd/mission.md` — glosario «Nivel de review» (Task 1).
- `dist/` — `moon run kit:build` en cada task.

**NO se tocan**:

- `cli/src/` — la CLI no lee nada de lo que cambia.
- `skills/sdd-templates/` — la forma de las plantillas es de la 0309 (`walkthrough-template.md:35` queda con su `no`).
- `tests/batteries/sdd-verify/fixtures/review-spec-c*.md` — otro fichero con el mismo nombre.
- `.docs/sdd/capabilities/` — la fusiona `sdd-archive` desde el delta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una regla bajada a una reference no se lee | media | alto | «First thing …: read» en el paso, con las condiciones que deciden; batería entera en la Task 5 |
| El `SKILL.md` no baja de 20.000 con lo previsto | media | medio | `kit:skill-size` al cerrar la Task 4; si falta, sale otro bloque que solo se lee en un paso (el gate de la spec), con su escenario `g1` |
| Un sujeto de `pr1` no llega al commit del fix | media | bajo | `TURN2` «Sí, como patch.» como `a2`; `COST_CAP` de la tanda |
| La traducción pierde una condición de `control-profiles.md` | media | alto | traducción por sección, comparando cada fila de la tabla de gates; tramo `control` y `gate` de la batería |

### 1.8 Rollout

Directo: entra en `develop` con la 3.0.0, que corta la 0311.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La rúbrica de review en inglés, con dos revisores por defecto, el de lite y patch, y la segunda ronda

**Tras**: —
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · estructural: `review-spec.md:20` «**Por defecto, ninguna.** 0–3 señales no proponen review.», `:3` «En modo lite no se aplica.», `:64` «Después, el gate», `patch-flow.md:19` «don't dispatch any axis or reviewer» · escenarios nuevos `rv1`, `rv2`, `rv3`, `lr1`, `rr1`, `pr1` en `tests/batteries/sdd-propose/battery.md`, con sus filas de rúbrica
**Superficies**: docs (skills), tooling (batería)
**Verificación**:
- `moon run kit:build kit:own` → sin líneas `kit:own | dist/skills/sdd-propose/references/review-spec.md`
- `npx vitest run test/kit/skills.test.ts test/kit/headless/battery.test.ts` desde `cli/` → `Tests  <N> passed (<N>)`
- `BATTERY=sdd-propose SCENARIOS="rv1 rv2 rv3 lr1 rr1 pr1" SPEC_DIR=<carpeta de la spec> PHASE=green KIT_DIR=<copia de dist/> RUNS_DIR=.temp/b306 COST_CAP=8 node tests/headless/battery.mjs run` → una línea `<id> · 2/2 · umbral 2/2 · verde` (o `puerta verde`, con las filas en prosa leídas) por escenario
- `BATTERY=sdd-verify SCENARIOS="s1" … node tests/headless/battery.mjs run` → `s1 · 1/1 …`

**Interfaces**:
- Consume: nada.
- Produce: los títulos en inglés de `review-spec.md` (`## 1. Count the signals`, `## 2. Decide how many reviewers`, `## 3. Dispatch the reviewers`, `## 4. Fold the findings in before the gate`); el encargo empieza por `> You are an adversarial reviewer of an SDD spec, with the \`<domain|technical>\` lens.`

**Ficheros**: modificar `skills/sdd-propose/references/review-spec.md`, `skills/sdd-implement/references/patch-flow.md`, `tests/batteries/sdd-verify/compose-spec-review.mjs`, `tests/batteries/sdd-propose/battery.md`, `tests/batteries/sdd-propose/subject.mjs`, `.docs/sdd/mission.md`; crear `tests/sdd-propose-0306-green.md`

- [ ] **Step 1: Implementación**
  - `review-spec.md` en inglés, mismas cuatro secciones. §2 sustituye «Por defecto, ninguna…» y la línea de 4 señales por: full → dos revisores (domain, technical); Scope de menos de ~50 líneas sin contrato público ni `MODIFIED` → uno de siete puntos; lite → uno de siete puntos, `model: sonnet`; spike y config, ninguno; un nivel que pide el dev-lead en la petición se aplica y su frase va a «Decisiones tomadas con el dev-lead»; `unattended`, nunca menos que la rúbrica. La regla «two reviewers, restricted parallelism and delegated spec → one» se queda. Sale «Proponer no es activar» y «Con un nivel de «ninguna», sigue siendo ninguna». La única pregunta: instrucciones del usuario que piden confirmar antes de paralelizar y spec no delegada → una pregunta con los dos revisores, su modelo y su coste. El modelo del dominio (o el revisor único de full): Opus con reglas de negocio, roles o reglas del flujo; Sonnet si no; técnico, Sonnet; lite y patch, Sonnet siempre. El bloque `text` «Review de spec propuesta: …» y su ejemplo siguen en castellano (lo lee el dev-lead en la spec).
  - §4 sustituye «Después, el gate» por la segunda ronda: Crítico aceptado o decisión central (la del enfoque elegido; sin mensaje de enfoques, la condición de éxito del Intent) reescrita → un revisor nuevo de siete puntos, `model: sonnet`, relee la spec corregida una vez, en full y lite; un Crítico de esa ronda va al gate aceptado o rechazado, sin tercera; después, el gate.
  - El encargo en inglés; la salida pedida sigue siendo `` `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>` `` (la lee el dev-lead en la spec).
  - `patch-flow.md:19`: «A patch has **no final review**: don't invoke `sdd-verify` for it and don't dispatch any axis or reviewer (dev-lead, 2026-10-21: «Solo la verificación»).» → «A patch has **no final review** and no axes: before the fix commit, dispatch one reviewer (`subagent_type: sdd-kit:effort-medium`, `model: sonnet`) with `patch.md` and the diff, to check the root cause, the fix and its test, and answer each finding in §4: fixed, or rejected with its reason (dev-lead, 2026-11-04: «lite y patch minimo tendriamos que levantar uno en sonnet»).» `:31`: «You're about to dispatch a reviewer «to be safe»: a patch has the verification of step 5 and nothing else.» → «You're about to dispatch a final review or an axis for a patch: it has step 5's verification and its one reviewer.»
  - `compose-spec-review.mjs`: los seis literales a los del encargo en inglés (`> You are an adversarial reviewer`, `<domain|technical>` → `domain`, `` `<path of spec.md>` ``, `` `<touched capabilities from capabilities/>` ``, `[technical lens: …]`, la frase de la frontera), y su `throw` si falta el encargo.
  - `mission.md:54`: «Nivel de review» → uno o dos revisores, decidido por la rúbrica (dos por defecto en full, uno con un Scope pequeño sin contrato ni `MODIFIED`; uno en Sonnet en lite y en patch), y la segunda ronda tras un Crítico aceptado; sus hallazgos entran en «Decisiones a validar» antes del gate.
  - Batería: escenarios `rv1` (spec de la 0011 con 2 señales, rol y ~120 líneas; falla si pregunta si hacer review, si no despacha dos `Agent`, o si el de dominio no lleva `model: opus`), `rv2` (spec con dos líneas en `docs/guia.md` y un `ADDED`; falla con más de un `Agent` o con ninguno), `rv3` (`rv1` con la instrucción de confirmar en el `CLAUDE.md` del molde; falla si despacha antes de preguntar o si la pregunta no lleva modelos y coste), `lr1` (spec lite que toca un rol; falla sin un `Agent` con `model: sonnet`), `rr1` (spec con la primera ronda incorporada y un Crítico aceptado; falla sin un `Agent` nuevo con `model: sonnet` antes de la pregunta del gate), `pr1` (el flujo de `d1` con `TURN2` «Sí, como patch.»; falla si `tools: /Agent/ antes de /git commit/` no casa o si §4 de `patch.md` no responde los hallazgos). Filas de rúbrica en máquina donde se pueda (`tools:`).
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación», con su resumen.
- [ ] **Step 4: Commit de la task** — `feat(sdd-propose): rúbrica de review con dos revisores por defecto, uno en lite y patch, y segunda ronda`.

### Task 2 — `spec-writing.md` y `plan-writing.md` propias, con las frases de `brainstorming` 7.0.2 y las secciones al ✋ en `delegate`

**Tras**: Task 1
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · estructural: `spec-writing.md:24` «marking what you're guessing as your guess», `:26` «they apply in `pair` and in `delegate`», ningún mensaje de enfoques en `spec-writing.md`; `kit:copies` «sin anotar → 0306» · escenarios `pb` (cambia su fila PB: en `delegate`, mensaje de enfoques con la elección y sin parar, y `spec-new.md` con las secciones en el ✋) y `pb-p` (nuevo, `pair`: el mensaje de los enfoques acaba en pregunta, sin `spec-new.md`)
**Superficies**: docs (skills), tooling (registro, batería)
**Verificación**:
- `moon run kit:notices kit:build kit:copies` → ninguna línea `→ 0306`; `Copias al día: <n> ficheros.`
- `moon run kit:upstream` → sin rojo en las dos `concept` de superpowers v7.0.2
- `npx vitest run test/kit/skills.test.ts test/kit/notices.test.ts` desde `cli/` → `Tests  <N> passed (<N>)`
- `BATTERY=sdd-propose SCENARIOS="pb pb-p" … node tests/headless/battery.mjs run` → `pb · 2/2 …` y `pb-p · 2/2 …`

**Interfaces**:
- Consume: nada.
- Produce: `spec-writing.md` con la sección «Approaches» antes de «Design by sections»; `upstream.json` sin `pending: "0306"`.

**Ficheros**: modificar `skills/sdd-propose/references/spec-writing.md`, `plan-writing.md`, `upstream.json`, `tests/batteries/sdd-propose/battery.md`, `subject.mjs`; borrar `skills/sdd-propose/NOTICE` (con `kit:notices`); regenerar `THIRD_PARTY_NOTICES.md`

- [ ] **Step 1: Implementación**
  - `spec-writing.md:3` y `plan-writing.md:3`: «Adapted from superpowers `brainstorming` (MIT, see NOTICE).» → «Inspired by superpowers `brainstorming` (MIT).»; igual con `writing-plans`.
  - `spec-writing.md`, sección nueva «Approaches», antes de «Design by sections»: before sections or `spec.md`, a message of its own with two or three ways of building it, what each trades off, and the one you recommend; in `pair` the user picks; in `delegate`, say you go with yours and go on in the same turn; with one sensible way, say so and why the others don't fit.
  - `spec-writing.md:24`: «marking what you're guessing as your guess» → «Anything you filled in goes in as your proposal, with your reason».
  - `spec-writing.md:26`: «they apply in `pair` and in `delegate`» → «they apply in `pair`; in `delegate` they go to the spec's ✋ and its stop approves them».
  - `upstream.json`: quita la entrada `copy` de `skills/brainstorming/SKILL.md`+`skills/writing-plans/SKILL.md`; añade dos `concept` de `superpowers` en `v7.0.2` (`paths: ["skills/brainstorming/SKILL.md"]`, `kit: ["skills/sdd-propose/references/spec-writing.md"]`; `paths: ["skills/writing-plans/SKILL.md"]`, `kit: ["skills/sdd-propose/references/plan-writing.md"]`), con `note` en castellano; `own`: las cinco rutas de `skills/sdd-propose/` → `"skills/sdd-propose/"`.
  - `moon run kit:notices`: borra `skills/sdd-propose/NOTICE` y regenera `THIRD_PARTY_NOTICES.md`.
  - Batería: fila PB y escenario `pb-p` (petición de `pb` con «Perfil pair.»).
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(sdd-propose): spec-writing y plan-writing propias, con los enfoques y las secciones al ✋ en delegate`.

### Task 3 — `control-profiles.md`, `modo-lite.md` y `nombrado.md` en inglés

**Tras**: Task 2
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · estructural: `kit:own` da 131 líneas «prosa en castellano» en `control-profiles.md`, 9 en `modo-lite.md` y 12 en `nombrado.md`; K23 (`control-profiles.md:62` y `:237`) y K24 (`:9` y `:58`) dicen la misma regla dos veces
**Superficies**: docs (skills, `CLAUDE.md`)
**Verificación**:
- `moon run kit:build kit:own` → ninguna línea `dist/skills/sdd-propose/references/(control-profiles|modo-lite|nombrado).md` salvo `control-profiles.md` con `sdd-archive` («el kit no define ese valor…», de la 0311)
- `git grep -n "vigía-de-silencio\|validación-en-campo\|quién-valida" -- skills CLAUDE.md` → vacío
- `npx vitest run test/kit/skills.test.ts` desde `cli/` → `Tests  <N> passed (<N>)`

**Interfaces**:
- Consume: nada.
- Produce: anclas `#silence-watch`, `#field-validation` y `#who-validates` (de `## Silence watch`, `## Field validation`, `## Who validates`), o las que salgan de los títulos traducidos, que se escriben en los siete sitios de la decisión 10 de la spec.

**Ficheros**: modificar `skills/sdd-propose/references/control-profiles.md`, `modo-lite.md`, `nombrado.md`, `skills/sdd-config/SKILL.md:28`, `skills/sdd-implement/SKILL.md:316`, `skills/sdd-verify/SKILL.md:242`, `skills/sdd-verify/references/encargo-revision.md:25`, `skills/sdd-archive/SKILL.md:28`, `skills/sdd-propose/references/review-spec.md` (su enlace a la vigía), `CLAUDE.md:32`

- [ ] **Step 1: Implementación** — traducción sección a sección, con cada fila de la tabla de gates comparada contra la de hoy; los literales que el agente escribe en el proyecto o al usuario, en castellano en bloque `text`; K23: «the agent never writes, without the user's literal phrase, a `profile`, a `control.*`, a `merge` or a `validation.mode` that removes a stop» una sola vez, donde se decide (el resumen de `sdd-kit.local.json`); K24: el push de la integración en `unattended`, solo en la fila de la tabla. Antes de cambiar cada título, `git grep` en `cli/` y `tests/`.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `docs(sdd-propose): control-profiles, modo-lite y nombrado en inglés`.

### Task 4 — `SKILL.md` por debajo de 20.000 bytes, con el repaso de coherencia nuevo

**Tras**: Task 3
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · estructural: `kit:skill-size` «FALLA: dist/skills/sdd-propose/SKILL.md ocupa 33332 bytes»; `kit:own` `SKILL.md:21` («only» … «unless») y `:64` («never» … «except»); `SKILL.md:62` «search each name and each id in `capabilities/`, the project's documents and, in a skills kit, `skills/`» · escenarios nuevos `co7` y `co8`
**Superficies**: docs (skills), tooling (batería)
**Verificación**:
- `moon run kit:build kit:skill-size kit:own` → sin `FALLA` en `sdd-propose`; en `skills/sdd-propose/` solo las tres repetidas de la 0311 (`SKILL.md` con trece skills, con `sdd-templates` y con `sdd-implement`) y la de `control-profiles.md` con `sdd-archive`
- `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  <N> passed (<N>)`
- `BATTERY=sdd-propose SCENARIOS="co7 co8 a3 k1 g1" … node tests/headless/battery.mjs run` → verde los cinco (`a3` con `tools: /patch-lane\.md/` presente, del Review Focus)

**Interfaces**:
- Consume: los títulos de la Task 1 y las anclas de la Task 3.
- Produce: `references/config-lane.md`, `references/patch-lane.md` (con `## Is it really a patch?`), `references/coherence-pass.md`.

**Ficheros**: modificar `skills/sdd-propose/SKILL.md`, `references/spec-writing.md`, `references/plan-writing.md`, `references/nombrado.md`, `skills/sdd-implement/references/patch-flow.md:3`, `tests/batteries/sdd-propose/battery.md`, `subject.mjs`; crear las tres references

- [ ] **Step 1: Implementación** — los movimientos de la tabla del Approach y las decisiones 6, 7, 8, 12 y 17 de la spec, texto movido sin cambiarlo salvo:
  - Paso 2, carril patch: «Before you classify a change as patch, asked or not, read [references/patch-lane.md](references/patch-lane.md)».
  - Paso 2, carril config: «With the lane confirmed, first thing: read [references/config-lane.md](references/config-lane.md)».
  - Paso 4: «**Coherence pass**, in both modes, before dispatching the review and before the gate: first thing, read [references/coherence-pass.md](references/coherence-pass.md)»; en `coherence-pass.md`, la frase sustituida (decisión 12 de la spec, literal), con las carpetas de evidencia nombradas.
  - Paso 4, review: «Spec review *(full and lite)*: open [review-spec.md](references/review-spec.md) …».
  - `SKILL.md:21` y `:64` reescritas con su caso dentro de la regla; K16 en `patch-lane.md`: el predicado con la retirada como segundo caso.
  - `patch-flow.md:3`: `../../sdd-propose/SKILL.md#is-it-really-a-patch` → `../../sdd-propose/references/patch-lane.md`.
  - Batería: `co7` (molde con `"base": "."` → `"./out"` y `toBe('.')` en `test/config.test.js`; falla si «Lo que se retira…» no lo nombra), `co8` (spec que cita `src/invoice.js:42`, un importe cero, con un THEN que solo rechaza negativos; falla si el agente no cambia el THEN ni lo señala); la «Procedencia de las reglas» con el sitio nuevo de cada regla movida.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación»; si `kit:skill-size` sigue en FALLA, sale el siguiente bloque de un solo paso (riesgo 2) antes del commit.
- [ ] **Step 4: Commit de la task** — `refactor(sdd-propose): SKILL.md por debajo de 20.000 bytes y repaso de coherencia con git grep`.

### Task 5 — Batería entera de control, REFACTOR y evidencia

**Tras**: Task 4
**Modelo**: sesión (Native)
**Tests RED**: no aplica (controles de lo existente)
**Superficies**: tooling (batería), docs (evidencia)
**Verificación**:
- `BATTERY=sdd-propose SPEC_DIR=<carpeta> PHASE=control KIT_DIR=<copia de dist/> RUNS_DIR=.temp/b306 COST_CAP=40 node tests/headless/battery.mjs run` → todos `verde` o `puerta verde` con las filas leídas
- `BATTERY=using-sdd SCENARIOS="p1 v1 c1w pc1 bt1 c2" … node tests/headless/battery.mjs run` → los seis verdes
- `npx vitest run test/kit/headless/battery.test.ts` desde `cli/` → `Tests  <N> passed (<N>)`
**Verificación lenta**: la batería entera, ~99 sujetos (~40-60 min), en segundo plano desde el hilo principal.

**Interfaces**:
- Consume: todo lo anterior.
- Produce: `tests/sdd-propose-0306-green.md` con cada frente (RED estructural, GREEN, REFACTOR, controles) y el coste real.

**Ficheros**: modificar `tests/sdd-propose-0306-green.md`, `tests/batteries/sdd-propose/battery.md` (procedencia), y la skill si un rojo pide REFACTOR

- [ ] **Step 1: Implementación** — lanzar los controles; cada rojo se lee (no se relanza para sacar verde) y, si es de esta feature, una tanda de REFACTOR de la frase del paso que apunta a la reference y su escenario repetido; la evidencia con cada veredicto y su fichero.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `test(sdd-propose): batería entera de control de la 0306`.

### Task 6 — enmienda 2026-11-05: los recuentos del repaso y los enfoques al ✋ en `delegate`

**Tras**: Task 4
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · estructural: `spec-writing.md:30` «In `delegate`, say you go with your pick and go on in the same turn», `review-spec.md:66` (la decisión central «in the approaches message»), la `note` de `brainstorming` en `upstream.json` («los enfoques en un mensaje propio»)
**Superficies**: docs (skills), tooling (registro)
**Verificación**:
- `moon run kit:notices kit:build kit:own` → ninguna línea de `skills/sdd-propose/` salvo las repetidas con la skill de otra fila
- `node cli/node_modules/vitest/vitest.mjs run --root cli test/kit/skills.test.ts test/kit/notices.test.ts` → `Tests  <N> passed (<N>)`

**Interfaces**:
- Consume: la spec enmendada (decisiones 2, 4 y 12).
- Produce: `spec-writing.md` sin mensaje de enfoques en `delegate`; la decisión central «in the approaches message or in the ✋».

**Ficheros**: modificar `skills/sdd-propose/references/spec-writing.md`, `skills/sdd-propose/references/review-spec.md`, `upstream.json`, `THIRD_PARTY_NOTICES.md` (por `kit:notices`)

- [ ] **Step 1: Implementación** — las tres frases de `spec-writing.md` (enfoques en `delegate` al ✋, «after the approaches», sin mensaje de enfoques con la spec delegada o en `unattended`), la decisión central de `review-spec.md:66` y la `note` de `upstream.json`, sustituidas en su sitio.
- [ ] **Step 2: Build** — `moon run kit:notices kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — los comandos de «Verificación».
- [ ] **Step 4: Commit de la task** — `feat(sdd-propose): enmienda 2026-11-05, los enfoques al ✋ en delegate`.
---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5 h
- Estimación de implementación: 4 h
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 5 tasks de texto de skill y batería; referencias del log: la 0185 (`sdd-propose`, 4 h estimadas, 13,98 reales, por las rondas de REFACTOR), la 0281 (repaso de coherencia, 1,5 / 1) y la 0316 (traducción, 2,5 / 0,88). Las baterías corren solas en segundo plano (0116).
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec: `moon run kit:skill-size` sin FALLA en `sdd-propose`; `moon run kit:copies` sin «→ 0306»; `moon run kit:own` sin líneas en `skills/sdd-propose/` salvo las repetidas con la skill de otra fila; `cli:test` en verde
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Nivel: dos revisores en full, sin preguntar; el bloque cita la spec; dominio en Opus por roles → Task 1, `rv1`. ✓
- AND un revisor con Scope pequeño sin contrato ni `MODIFIED`; dos con contrato → Task 1, `rv2` y `rv1`. ✓
- AND delegada con instrucción de confirmar → uno sin preguntar → Task 1, leído en `review-spec.md` (regla sin cambio). ✓
- AND no delegada con instrucción de confirmar → una pregunta con modelos y coste → Task 1, `rv3`. ✓
- AND 4 señales y delta grande, dos; ninguna línea genérica → Task 5, `r1` (control). ✓
- AND `unattended` nunca menos; lite uno en Sonnet → Task 1, `lr1`; `unattended` leído en `review-spec.md`. ✓
- AND spike y config sin review → Task 5, `k2` y `k1` con `tools: /Agent/` ausente. ✓
- AND «sin review» se aplica y se registra → Task 5, `s1` y `g1` (control). ✓
- Review adversarial: hallazgos antes del gate; lentes disjuntas; revisor único con los siete → Task 5, `sr1` (control). ✓
- AND segunda ronda tras Crítico aceptado o decisión central reescrita, en Sonnet, full y lite → Task 1, `rr1`. ✓
- AND sin Crítico no hay segunda ronda; sin tercera ronda → Task 5, `sr1` (control, sin otro `Agent` tras incorporar); la tercera, leída en `review-spec.md`. ✓
- Effort: dominio Opus por roles, Sonnet si no; revisor único igual en full; lite y patch Sonnet → Task 1, `rv1`, `rv2`, `lr1`, `pr1`. ✓
- AND el prompt nombra el modelo → lo aplica → leído en `review-spec.md` (regla sin cambio). ✓
- AND cada despacho con `subagent_type` y `model` → Task 1, `rv1` (`tools`). ✓
- Secciones: enfoques en un mensaje propio, en `pair` espera → Task 2, `pb-p`. ✓
- AND lo corregido entra en la spec; lo rellenado como propuesta con motivo → Task 2, `pb-p` (texto de la sección). ✓
- AND recuento de la feature especificada; 2 tasks, lite o spike sin secciones → Task 5, `pb-c` (control). ✓
- AND en `delegate`, enfoques con elección sin esperar y secciones al ✋ → Task 2, `pb`. ✓
- AND delegada o `unattended` sin secciones; empezar ya → Task 5, `h1` (control). ✓
- AND cada sección abre con lo que ve el usuario → Task 2, `pb-p` (fila PB-L). ✓
- Repaso: contradicciones; `MODIFIED` fuera; lo cambiado en ✋ → Task 5, `t1`, `co1`, `co5` (control). ✓
- AND `git grep` en todo el repo con cada forma del literal → Task 4, `co7`. ✓
- AND etiqueta de plantilla a `MODIFIED` → Task 5, `sp1` (control). ✓
- AND cada caso real contra su THEN → Task 4, `co8`. ✓
- AND pasos numerados; ids de fila; `capability merge` → Task 5, `co6`, `t1`, `sp1` (control). ✓
- Patch: `sdd-implement` con `patch-flow.md`; §4 con el comando → Task 5, `d1` (control). ✓
- AND un revisor en Sonnet antes del commit del fix; §4 responde → Task 1, `pr1`. ✓
- AND ningún eje de la revisión final → Task 1, `pr1` (`tools: /sdd-verify/` ausente). ✓
- Dos revisores con `sdd-parallel-agents`; tope; tasks no en paralelo → Task 5, `sr1` (control). ✓
- Política de modelos como confirmación; sin la línea no pasa el repaso → Task 5, `sp1` (control). ✓
- Regla «Límites» → la fusiona `sdd-archive`; los valores, Task 1 (`review-spec.md`). ✓
- Tabla del Approach «regla que sale → dónde vive»: cada fila → Task 4, `git grep` de su frase en el destino (`patch-lane.md`, `config-lane.md`, `coherence-pass.md`, `spec-writing.md`, `plan-writing.md`, `nombrado.md`), y Task 5, la batería entera. ✓
- Review Focus: «patch:» lee `patch-lane.md` → Task 4, `a3`; anclas → Task 3, `skills.test.ts` y `git grep`; lite con rol en Sonnet → Task 1, `lr1`. ✓
