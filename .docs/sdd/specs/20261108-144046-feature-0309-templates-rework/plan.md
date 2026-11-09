---
id: 20261108-144046-feature-0309-templates-rework
feature: 0309
title: Plan de implementación — sdd-templates, una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador
spec: ./spec.md
status: draft
created: 2026-11-08
---

# Plan de implementación — sdd-templates, una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las dos tasks; ningún subagente implementador. Los sujetos de la batería, `sonnet`, por `battery.mjs` (su `Modelo` en `battery.md`). La revisión final, con los ejes de `sdd-verify`: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`; Arquitectura no (ver `Eje Arquitectura`).
2. Ejecución: native (motivo en la línea `Ejecución`).
3. Orden: la Task 1 lleva lo medido con sujetos (Approach y previsión, con el molde, las filas, el RED y el GREEN); la Task 2, lo que solo cambia forma (P10-P20), con su humo de `sdd-archive` y el test de la CLI que rellena el hueco.
4. El RED de la Task 1 corre `co4` con el molde y las filas nuevas sobre el `dist/` de hoy (sin las plantillas cambiadas): sale rojo si el kit de hoy no pide los enfoques ni la línea del comando. `pb` no corre en el RED (spec, decisión 11).
5. `scripts/plan.mjs` del molde lee `battery.md` del argumento, filtra por `SCENARIOS` (separados por espacio) y aplica `N`, con 0,70 $ por sujeto, e imprime `<id> · <n> sujetos · <x.xx> $` por escenario y `suma: <n> sujetos · coste previsto: <x.xx> $`: la forma de `battery.mjs plan`, sin su lectura de campañas.
6. La evidencia va en `tests/sdd-templates-0309-green.md`: RED, GREEN, REFACTOR si lo hay, controles y humo, con la línea `Tanda:` de cada una.
7. Riesgo alto: un sujeto escribe la previsión con la línea `suma:` sin haber corrido el comando (copiando el ejemplo de la plantilla). La fila CO4 pide `tools` con la llamada a `scripts/plan.mjs`.
8. Coste estimado: ~2,5 h de hilo; 11,88 $ de sujetos (previsión de la spec) con `COST_CAP` por tanda; la revisión final, ~3 $.
9. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: el Approach de la spec con sus enfoques y su `Elegido:`, la «Previsión de coste» con la salida del comando de previsión, y cada regla de `sdd-templates` con una sola forma dentro de la skill (P10, P11, P12, P16, P19, P20).

**Architecture**: solo texto de plantillas y de dos skills (`sdd-propose`, `sdd-archive`), la batería de `sdd-propose` con su molde, un test de la CLI que rellena una plantilla y `upstream.json`. La CLI no cambia.

**Tech Stack**: Markdown de skills, `moon run kit:build`, `kit:copies`, `kit:own`, `kit:skill-size`; Vitest en `cli/`; `tests/headless/battery.mjs` con sujetos Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks que no comparten interfaces de código (la Task 2 solo depende de que la Task 1 deje `spec-template.md` editada), un error lo cazan la batería, `cli:test` y `kit:*` de cada task, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y plantillas, la batería, un test y `upstream.json`: ningún módulo, dependencia ni contrato entre módulos nuevos.

## Restricciones globales

### De código

- Constitution Art. X: sin comentarios que repitan el código; sin comentarios que citen la constitution, una spec, una task, un requisito ni `capabilities/`; nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano (mensajes, warnings) en castellano con tildes.
- ADR 0022: la frase que falla se sustituye entera; nunca se añade otra al lado ni una excepción («except», «unless», «instead of») junto a una absoluta.
- Skills en inglés (Art. III); las plantillas, en castellano.
- Una frase de plantilla que mide una batería se queda: antes de mover o quitar una, `git grep` de su literal en `tests/batteries/`.
- Topes de `cli/test/kit/word-budget.test.ts` sin cambio: `'sdd-templates': { skillMd: 1700, total: 15720 }`, `'sdd-propose': { skillMd: 5250, total: 14200 }`, `'sdd-archive': { skillMd: 3920, total: 8000 }`, kit 89328.
- Nunca se edita `dist/` a mano: `moon run kit:build`.

### De proceso

- Política de modelos de la spec: sujetos sonnet; ejes de la revisión final Spec opus+high, Código sonnet+high; en paralelo hasta `control.maxParallelAgents` (3).
- Commits: tipo/scope en inglés, título y cuerpo en castellano, `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`; uno por task (`commit-milestones.md`); antes de cada commit, `git diff --cached --name-only`.
- Temporales en el scratchpad de la sesión; `RUNS_DIR` en `.temp/<corto>` del worktree; `KIT_DIR` construido con `moon run kit:build` y copiado de `dist/`.
- Quitar en un REFACTOR algo que la spec dice que se queda es un desvío: se para, no se resuelve con un ruling.

## Review Focus

- Un sujeto copia la línea `suma:` del ejemplo de la plantilla en vez de correr el comando del molde → la fila CO4 falla · Task 1, fila CO4 con `tools: /scripts\/plan\.mjs/`.
- La plantilla del walkthrough sin rellenar, leída por `sdd estimation log` → su `Esfuerzo real` rellenado se lee como real · Task 2, `cli/test/estimation/statistics.test.ts` («walkthrough con evidencia por THEN»).
- Un `Validado:` de un sí sin detalle → lleva `· no detalló qué probó`, en patch y walkthrough igual · Task 2, `git grep -n "no detalló qué probó" -- skills/sdd-templates` da las dos plantillas.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sustituir frases y huecos, sin mecanismo nuevo (enfoque A de la spec).
- [x] **YAGNI gate**: `scripts/plan.mjs` solo en el molde, ninguna abstracción.
- [x] **Brownfield gate**: las filas de la batería cambian solo las conductas que la spec mueve; `cr1`, `cr2` y `cr3` comparten molde y `cr1` va de control.
- [x] **Constitution check**: Art. I (RED y GREEN con sujetos), Art. II (el hueco obligatorio de la previsión sigue), Art. VIII (plantillas solo en `templates/`), ADR 0022 (sustituir).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/sdd-templates-0309-green.md` — la evidencia: RED, GREEN, controles y humo.

**Modificar**:

- `skills/sdd-templates/templates/spec-template.md` — hueco del Approach, «Previsión de coste» (Task 1); «Regla de reparto» y la regla del nombre de la capacidad (Task 2).
- `skills/sdd-propose/references/spec-writing.md` — `:16`, `:30` y `:36` (Task 1).
- `skills/sdd-templates/templates/patch-template.md` — P10, P11, P19 y P20 (Task 2).
- `skills/sdd-templates/templates/walkthrough-template.md` — P10 y P19 (Task 2).
- `skills/sdd-archive/SKILL.md:29` — el literal `Validado` (Task 2).
- `tests/batteries/sdd-propose/battery.md` — filas CO4, PB y AP, procedencia (Task 1).
- `tests/batteries/sdd-propose/subject.mjs` — molde `reservas-skills` (Task 1).
- `cli/test/estimation/statistics.test.ts:199` — el relleno del hueco nuevo (Task 2).
- `upstream.json` — el concepto `brainstorming` 7.0.2 (Task 1).
- `dist/` — `moon run kit:build` en cada task.

**NO se tocan**:

- `cli/src/` — lee la etiqueta `Esfuerzo real` (`REAL_LABEL`), que no cambia, y ningún `Validado`.
- `skills/sdd-templates/templates/plan-template.md`, `capability-template.md`, `estimation-template.md`, `operations-template.md` — son el destino de las reglas que salen (P12, P13, P16, P10), sin cambio.
- `launch-prompt-template.md` — fuera de alcance.
- `.docs/sdd/capabilities/` — la fusiona `sdd-archive` desde el delta.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El sujeto copia el ejemplo de la plantilla sin correr el comando | media | medio | CO4 pide `tools` con `scripts/plan.mjs` |
| `pb` deja los enfoques solo en el ✋ porque el `SKILL.md` de `sdd-propose` paso 4 dice «they go to the ✋» | media | alto | el GREEN mide `pb`; si sale rojo, REFACTOR de la frase del paso 4, con el mismo sentido que `spec-writing.md:30` |
| El molde cambiado rompe `cr1`-`cr3` | baja | medio | `cr1` de control con n = 1 |

### 1.8 Rollout

Directo: entra en `develop`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — El Approach con sus enfoques y la previsión con la salida del comando

**Tras**: —
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · `co4` (filas CO4 y AP nuevas) sobre el `dist/` de hoy, con el molde nuevo
**Superficies**: docs (skills), tooling (batería)
**Verificación**:
- `moon run kit:build kit:copies kit:own` → `kit:own` con las mismas 26 líneas que la base
- `npx vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` desde `cli/` → `Tests  <N> passed (<N>)`
- `moon run kit:test-headless` → verde
- RED: `BATTERY=sdd-propose SCENARIOS="co4" SPEC_DIR=<carpeta de la spec> PHASE=red KIT_DIR=<copia del dist/ de hoy> RUNS_DIR=.temp/b309 COST_CAP=3 node tests/headless/battery.mjs run` → `co4 · <k>/2 · umbral 2/2 · rojo`, con CO4 o AP en rojo
- GREEN: `… SCENARIOS="co4 pb" PHASE=green KIT_DIR=<copia de dist/ con el cambio> COST_CAP=6 …` → `co4 · 2/2 · … verde` y `pb · 2/2 · … verde` (o `puerta verde`, con las filas en prosa leídas)
- Controles: `… SCENARIOS="cr1 pb-p" N=1 PHASE=control COST_CAP=2 …` → `cr1 · 1/1` y `pb-p · 1/1`

**Interfaces**:
- Consume: nada.
- Produce: `spec-template.md` con el hueco del Approach y la «Previsión de coste» nuevos, que la Task 2 deja como están.

**Ficheros**: modificar `tests/batteries/sdd-propose/subject.mjs`, `tests/batteries/sdd-propose/battery.md`, `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-propose/references/spec-writing.md`, `upstream.json`; crear `tests/sdd-templates-0309-green.md`

- [ ] **Step 1: Molde y filas (RED)**
  - `subject.mjs`, molde `reservas-skills`: `s.put('scripts/plan.mjs', …)` con la conducta de la decisión 5; la línea de `tech-stack.md` pasa a «- Sujetos: Sonnet. Un sujeto de `aviso-cierre` cuesta ~0,70 $, porque cierra una feature entera. La previsión de una tanda: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`.»
  - `battery.md`, fila CO4: «`spec-new.md` no lleva la previsión con RED, GREEN, una tanda de REFACTOR, controles, medición tras la revisión final y su suma; o una fila no cita la línea `suma: <n> sujetos · coste previsto: <x> $` de `scripts/plan.mjs` para sus escenarios, o no lo corrió (`tools`)».
  - Fila nueva «AP Enfoques en el Approach | co4 | el `## Approach` de `spec-new.md` no lleva dos o tres enfoques, cada uno con lo que cuesta, y una línea `Elegido:` con su porqué; o, con una sola vía, no dice por qué no encajan las otras».
  - Fila PB: «para a preguntar por el enfoque o por una sección antes de escribir `spec-new.md`; o escribe, antes de la spec, un mensaje propio de enfoques; o el `## Approach` de `spec-new.md` no lleva los enfoques con lo que cuesta cada uno y su `Elegido:`; o su ✋ no lleva el elegido con por qué se descartan los otros, y las secciones del diseño».
  - RED, con su línea `Tanda:` en la evidencia.
- [ ] **Step 2: Plantilla y `spec-writing.md` (GREEN)**: el hueco del Approach y la ayuda de la «Previsión de coste» literales del borrador (spec, Approach; `draft-skills.diff` del scratchpad); `spec-writing.md` `:16`, `:30` y `:36` con el texto del borrador; `upstream.json`: `spec-template.md` en `kit` del concepto `brainstorming` v7.0.2 y la nota «Cómo se escribe la spec: los enfoques antes de la spec (en `pair`, en un mensaje propio; en `delegate`, al Approach, y el elegido al ✋) y lo rellenado como propuesta con su motivo. Conserva el 1 % del original (feature 0306).»; procedencia: la fila de `spec-writing.md` (feature 0306) dice «en `delegate`, al Approach y el elegido al ✋ (feature 0309)», y la de «Previsión de coste» añade «feature 0309: la salida del comando de previsión; RED `co4` <k>/2».
- [ ] **Step 3: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 4: Verificación** — GREEN y controles de «Verificación»; un rojo de `pb` va al riesgo 2 (REFACTOR en el paso 4 de `sdd-propose`).
- [ ] **Step 5: Commit de la task**.

### Task 2 — Una forma por regla en `sdd-templates` (P10, P11, P12, P16, P19, P20)

**Tras**: Task 1
**Modelo**: sesión (Native)
**Tests RED**: hilo principal · `cli/test/estimation/statistics.test.ts` («walkthrough con evidencia por THEN») en rojo con el hueco nuevo y el relleno viejo
**Superficies**: docs (plantillas, skills), tooling (test de la CLI)
**Verificación**:
- `npx vitest run test/estimation/ test/kit/` desde `cli/` → `Tests  <N> passed (<N>)`
- `moon run kit:build kit:copies kit:own kit:skill-size` → `kit:own` con 26 líneas y `kit:skill-size` solo con el rojo heredado de `sdd-roadmap` (21.680 bytes)
- Humo: `BATTERY=sdd-archive SCENARIOS="a2 t3" N=1 SPEC_DIR=<carpeta de la spec> PHASE=smoke KIT_DIR=<copia de dist/> RUNS_DIR=.temp/b309 COST_CAP=2 node tests/headless/battery.mjs run` → `a2 · 1/1` y `t3 · 1/1`

**Interfaces**:
- Consume: `spec-template.md` de la Task 1 (no se toca su Approach ni su previsión).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-templates/templates/patch-template.md`, `walkthrough-template.md`, `spec-template.md`, `skills/sdd-archive/SKILL.md`, `cli/test/estimation/statistics.test.ts`, `tests/sdd-templates-0309-green.md`

- [ ] **Step 1: Test (RED)** — en `statistics.test.ts:199`, `.replace(/^- Esfuerzo real: <[^\n]*/m, '- Esfuerzo real: 3h')`; corre en verde con la plantilla de hoy y queda como guarda del hueco nuevo. El RED es el hueco nuevo con el relleno viejo (`/^- Esfuerzo real: <Zh>/m`): rojo, apuntado en la evidencia.
- [ ] **Step 2: Implementación**, con el texto del borrador (`draft-skills.diff`) y lo que añadió la review:
  - P10: el mismo hueco `Esfuerzo real` en `patch-template.md` §5 y `walkthrough-template.md` §2.
  - P11: `patch-template.md:26`, el criterio de `spec-template.md` y el atajo con la frase literal.
  - P12: `spec-template.md:101` → «Una capacidad nueva se nombra con la regla 1 de `capability-template.md`, que se calca al declararla.»
  - P16: sale la segunda frase de la «Regla de reparto» de `spec-template.md`.
  - P19: `walkthrough-template.md` 4.2 → `- Validado: <fecha> · «<frase literal del dev-lead>»[ · no detalló qué probó]`; `patch-template.md` §4, `` `Validado: <fecha> · «<frase literal>»[ · no detalló qué probó]` ``; `sdd-archive/SKILL.md:29`, «A «Validado» the dev-lead didn't give…».
  - P20: `patch-template.md` §6, «> Sin delta («Capacidades» dice «Ninguna, porque…»), esta sección se borra. Si no, misma…».
  - Antes de cada frase que sale, `git grep` de su literal en `tests/batteries/`: si la mide una fila, se queda y se apunta.
- [ ] **Step 3: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 4: Verificación** — los comandos de «Verificación»; la tabla de la decisión 3 de la spec, fila a fila, contra `git diff develop -- skills/sdd-templates`.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2h
- Estimación de implementación: 2,5h
- Estimación de revisión: 0,5h
- Estimación de cierre: 0,5h
- Base de la estimación: 2 tasks de texto con batería (16 sujetos, ~50 min de tandas); la 0306, del mismo tipo con 5 tasks, en el estimation-log
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent): `moon run kit:build kit:copies kit:own kit:skill-size` sin rojos nuevos; `co4` y `pb` 2/2
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Medición tras la revisión final: `SCENARIOS="co4 pb" N=1`
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED THEN: el Approach lleva dos o tres enfoques con su coste y `Elegido:` → Task 1, fila AP (`co4`) y PB (`pb`). ✓
- ADDED AND: en `pair`, los del mensaje y el elegido por el dev-lead; en `unattended` o tras «empieza ya», los del agente → sin observar: ningún escenario llega al Approach en `pair` ni en `unattended` (spec, decisión 11). ⚠
- ADDED, con una sola vía sensata → sin observar (spec, decisión 11). ⚠
- MODIFIED secciones, THEN y AND de `pair` (mensaje de enfoques, secciones, «¿va bien?») → sin cambio; control `pb-p` (PB-P, PB-L). ✓
- MODIFIED secciones, AND de `delegate` (enfoques al Approach, elegido y secciones al ✋) → Task 1, fila PB (`pb`). ✓
- MODIFIED secciones, AND de delegación, `unattended` y «empieza ya» → `spec-writing.md:36` cambiado en la Task 1; sin escenario propio (spec, decisión 11). ⚠
- MODIFIED secciones, AND con 2 tasks, lite o spike → sin cambio; `pb-c` no se corre (sin cambio de su frase). ✓
- MODIFIED previsión, THEN (filas RED, GREEN, REFACTOR, controles, medición) → Task 1, fila CO4. ✓
- MODIFIED previsión, AND cada fila cita la línea `suma:` del comando → Task 1, fila CO4 con `tools`. ✓
- MODIFIED previsión, AND sin comando, el precio por sujeto → sin observar: el molde lleva comando; la frase de la plantilla sigue como hoy. ⚠
- MODIFIED previsión, AND una spec que no edita una skill probada no lleva la sección → sin cambio de texto. ✓
- Tabla «Lo que se retira»: previsión (`spec-template.md:149`, CO4) → Task 1. ✓
- Tabla: enfoques al ✋ (`spec-writing.md:30`, `:36`, PB, `upstream.json:477`) → Task 1. ✓
- Tabla: `spec-writing.md:16` → Task 1. ✓
- Tabla: `Validado por el dev-lead` (`walkthrough-template.md:65`, `sdd-archive/SKILL.md:29`) → Task 2, humo `t3` y `git grep -n "Validado por el dev-lead" -- skills` vacío. ✓
- Tabla: cómo se cuenta el esfuerzo real → Task 2, sigue en `estimation-template.md:8`. ✓
- Tabla: hueco `Esfuerzo real` y `statistics.test.ts` → Task 2, el test. ✓
- Tabla: P16 y P12 → Task 2, la frase en `plan-template.md:75` y `capability-template.md:4`. ✓
- Tabla: P20 → Task 2, `patch-template.md:30`. ✓
- Tabla: `estimation`, `archive`, `control-profiles`, `timing.test.ts` → sin cambio, comprobado en la spec. ✓
- Review Focus: las tres líneas → Task 1 (CO4) y Task 2 (test, `git grep`). ✓
