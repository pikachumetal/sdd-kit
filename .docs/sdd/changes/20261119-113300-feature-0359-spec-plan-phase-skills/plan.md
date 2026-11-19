---
id: 20261119-113300-feature-0359-spec-plan-phase-skills
feature: 0359
title: Plan de implementación — La spec y el plan se escriben en skills de fase, y la entrevista no tiene puerta para no preguntar
spec: ./spec.md
status: approved
created: 2026-11-19
---

# Plan de implementación — La spec y el plan se escriben en skills de fase, y la entrevista no tiene puerta para no preguntar

## Decisiones que he tomado yo — valida estas

1. Cinco tasks: la Task 1 escribe los escenarios y mide el RED; las Tasks 2, 3 y 4 crean una skill de fase cada una, de la más simple a la más arriesgada (`sdd-spec-review`, propia; `sdd-plan-writing`, fork; `sdd-spec-writing`, fork); la Task 5 lleva la constitución, la ADR 0038, `architecture.md`, los recuentos de skills y el tramo de la batería. Cada task deja el kit coherente: el paso de `sdd-propose` que pierde su referencia invoca ya la skill nueva en la misma task.
2. Ejecución: Native (ver la línea `Ejecución`). `execution: auto` en `sdd-kit.json` me deja recomendar, y la regla «agentes al mínimo» de tus instrucciones manda sobre un SDD por task. La línea de compactación de la plantilla aplica si la sesión se compacta a media ejecución con un ledger ya abierto; si pasa, te pido confirmar el despacho antes, como piden tus instrucciones.
3. Modelo: la sesión (Opus). Sujetos de las baterías en `sonnet`, por tandas, hasta `control.maxParallelAgents` (3). Revisión final: Spec `opus` + `sdd-kit:effort-high`, Código `sonnet` + `sdd-kit:effort-high`, Arquitectura `opus` + `sdd-kit:effort-high` (eje en `sí`). Es la política de la spec, ya aprobada.
4. El GREEN de la spec se reparte por tasks sin cambiar la suma: `rq1` y `rv1` en la Task 2, `p2` y `k2p` en la Task 3, `ss1`, `iq2`, `iq3` e `iq4` en la Task 4, y el tramo entero a N = 1, con `a1` y el entrevistador, en la Task 5. La tanda de REFACTOR (7,04 $) es una, para toda la feature.
5. Si el RED de `ss1` o de `rq1` sale limpio 3 de 3, su guía sale del Scope con un `Ruling:` («si el RED lo exhibe»), sin parar; la skill de fase entra igual, porque no depende de ese RED (la decidiste tú).
6. Marcas del fork: `<!-- kit: 0359 · sustituye: «<inicio>…<fin>» -->` antes de cada bloque del kit, como `sdd-tdd`; ningún `quita` (decisión 5 de la spec). El idioma, con `<!-- kit: incluye user-language -->`; el aviso de fase, con `<!-- kit: incluye phase-notice -->`.
7. Una skill de fase que pasa de 20.000 bytes, o una copia por debajo del 50 %, es un desvío: paro (decisiones 20 y 26 de la spec).
8. Coste estimado: ~72 $ en sujetos (la «Previsión de coste» de la spec) y ~6 h de sesión.
9. Review Focus: 3 entradas que la spec no fija; ver la sección.

**Goal**: sacar la spec, su review y el plan de las referencias de `sdd-propose` a tres skills de fase que se cargan enteras, con la entrevista sin salida para no preguntar, medido en la batería de `sdd-propose` y la del entrevistador.

**Architecture**: tres skills nuevas en `skills/` (dos forks de superpowers v7.0.2 con bloques del kit y una propia), un include nuevo, y `sdd-propose` reducido a clasificar y traspasar. La regla de descomposición pasa a la constitución con su ADR.

**Tech Stack**: skills en Markdown (inglés), includes del kit (`includes/`), `upstream.json` y `kit:copies`, baterías headless (`tests/headless/battery.mjs`), Vitest (`cli/test/kit/`), moon.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 5 tasks encadenadas por los mismos ficheros (`sdd-propose/SKILL.md`, `upstream.json`, `word-budget.test.ts`, `battery.md`), un error lo cazan `kit:copies`, `kit:own`, `kit:skill-size` y la batería de su task, y el plan cabe en un contexto; además, tus instrucciones piden agentes al mínimo. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: sí — cuatro skills nuevas (tres antes de la enmienda 29) y una regla nueva de descomposición de skills en `architecture.md` punto 6 y en la constitución.

## Restricciones globales

### De código

- Art. X de la constitution: sin comentarios que repitan el código ni que citen la constitution, una spec, una task, un requisito o `capabilities/`; Clean Code; texto humano en castellano con tildes.
- Art. III: las skills se escriben en inglés; `kit:own` rechaza prosa en castellano en `skills/`. Los montones, en inglés dentro de la skill: **answered**, **minor**, **the dev-lead's**.
- Art. IX: en los forks, cada corte es `sustituye` con su línea del kit; ningún `quita`.
- Las reglas que se mueven van literales (tabla «Regla de `sdd-propose` que se mueve → dónde vive ahora» de la spec); no se parafrasean.
- `sdd-grilling` no se edita. Las ADR 0015, 0024, 0028, 0029 y 0035 no se editan.
- Topes de `word-budget.test.ts`: `sdd-propose` 2.900 / 9.400; `sdd-spec-writing` 3.300 / 3.300; `sdd-spec-review` 1.250 / 1.680; `sdd-plan-writing` 1.800 / 1.800; `constitution.md` 2.303; `PRODUCT.md` 1.799 y `architecture.md` 4.877 sin cambio.
- Cada `SKILL.md` por debajo de 20.000 bytes (`kit:skill-size`).

### De proceso

- Política de modelos (Art. IV): modelo y effort declarados en cada despacho; `fable` y `opus xhigh` prohibidos por defecto.
- Commits: tipo y scope en inglés, título y cuerpo en castellano; apertura, uno por task y cierre (`commit-milestones.md`); el mensaje con `git commit -F <fichero del scratchpad>`, y `git diff --cached --name-only` antes.
- Los sujetos de una batería se lanzan con `KIT_DIR` apuntando al `dist/` que se mide y `SPEC_DIR` a `red/` o `green/` de la carpeta de la spec.
- Cada skill nueva se lee de `dist/skills/<nombre>/SKILL.md`: el harness no la conoce en esta sesión (regla 1 del `CLAUDE.md` del repo).

## Review Focus

- Una sesión que vuelve a `sdd-propose` a media spec («retoma la spec») → `sdd-propose` clasifica y traspasa a `sdd-spec-writing`, no entrevista él · Task 4, fila nueva de `a1`/`iq1` (la primera pregunta tras la invocación).
- Un lite que se invoca con `sdd-spec-writing` → no invoca `sdd-plan-writing`, traspasa a `sdd-implement` · Task 4, lectura del texto final contra el AND «en lite no se invoca», y `lr1` del tramo.
- Un enlace relativo de una skill de fase a `../sdd-propose/references/*.md` que no resuelve en `dist/` → `kit:build` o el test de enlaces da rojo · Task 2-4, `moon run kit:build` y `npx vitest run test/kit` (los tests de enlaces de `cli/test/kit/`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres skills porque la rúbrica no cabe en 20 KB con el fork (decisión del dev-lead).
- [x] **YAGNI gate**: un include nuevo con cuatro usos (`phase-notice`); nada más.
- [x] **Brownfield gate**: los ficheros que nombran las referencias movidas se actualizan en la task que las mueve.
- [x] **Constitution check**: Art. I (RED antes de la guía, tramo, entrevistador, coste), Art. II (línea nueva), Art. III, Art. IX (forks con `sustituye`), Art. XI (ADR 0038).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-spec-review/SKILL.md` — la rúbrica (§1, §2, §4 de `review-spec.md`), con la pregunta en prosa.
- `skills/sdd-spec-review/references/reviewer-brief.md` — el brief del revisor (§3).
- `skills/sdd-plan-writing/SKILL.md` — fork de `writing-plans`.
- `skills/sdd-spec-writing/SKILL.md` — fork de `brainstorming`.
- `includes/phase-notice.md` — el aviso de fase.
- `.docs/sdd/decisions/0038-mandatory-phase-in-a-skill.md` — la ADR.
- `tests/sdd-propose-0359-phase-skills-red.md`, `tests/sdd-propose-0359-phase-skills-green.md` — evidencia.

**Modificar**:

- `skills/sdd-propose/SKILL.md` — pasos 4-6, red flags, racionalizaciones, aviso de fase al include.
- `skills/sdd-propose/references/control-profiles.md` (`:53`, `:238`), `patch-lane.md:14`.
- `skills/sdd-implement/SKILL.md:20`, `skills/sdd-config/SKILL.md:29`, `skills/sdd-parallel-agents/SKILL.md:3`, `:47`.
- `skills/sdd-templates/templates/plan-template.md:12`, `:56`, `spec-template.md:42`.
- `tests/batteries/sdd-verify/compose-spec-review.mjs`, `tests/batteries/sdd-propose/battery.md`, `subject.mjs` (si un escenario pide montaje).
- `upstream.json`, `THIRD_PARTY_NOTICES.md:45`, `:46`, `cli/test/kit/word-budget.test.ts`.
- `.docs/sdd/steering/constitution.md` (Art. II, `:51`), `.docs/sdd/steering/architecture.md` (`:62`, `:90`), `PRODUCT.md` (`:16`, `:23`), `README.md:3`, `CLAUDE.md:22`.
- `dist/` — lo regenera `moon run kit:build`.

**Borrar**: `skills/sdd-propose/references/spec-writing.md`, `coherence-pass.md`, `plan-writing.md`, `review-spec.md`.

**NO se tocan**:

- `skills/sdd-grilling/SKILL.md` — decisión 6 de la spec.
- `skills/using-sdd/SKILL.md` — su tabla ya manda todo cambio a `sdd-propose`.
- Las ADR 0015, 0024, 0028, 0029, 0035 — inmutables (decisión 14).
- `.docs/sdd/capabilities/` — el delta lo fusiona `sdd-archive`.

### 1.6 Dependencias

Las fuentes de superpowers v7.0.2 en `$SDD_UPSTREAM_DIR` (`kit:copies`). Dependencias del repo ya instaladas.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| `sdd-spec-writing` pasa de 20.000 bytes | media | desvío | medir con `kit:skill-size` tras el primer borrador; parar (decisión 7) |
| Una regla movida se pierde (`debt.md:80`) | media | regresión del tramo | literal desde la tabla de la spec; tramo a N = 1 en la Task 5 |
| `kit:own` ve una regla repetida entre `sdd-propose` y una fase | media | rojo | la regla vive solo en la fase; `sdd-propose` traspasa por nombre |
| El entrevistador empeora | baja | antiobjetivo 3 | batería `interviewer` en la Task 5 |

### 1.8 Rollout

Directo, en la próxima release del kit. El campo lo mide con el recuento de invocaciones sobre los transcripts.

### 1.9 Excepciones a la constitution

Ninguna. El saldo de palabras sube contra la regla 6 del `CLAUDE.md` del repo: excepción aprobada en la spec (decisión 19).

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Escenarios y RED

**Tras**: —
**Modelo**: sesión (Native). Sujetos: `sonnet`, lanzados por `battery.mjs`.
**Tests RED**: hilo principal · `ss1` y `rq1` de `tests/batteries/sdd-propose/battery.md`, contra el `dist/` de hoy (`git archive HEAD:dist`).

**Superficies**: tooling (batería)
**Verificación**: `SCENARIOS="ss1 rq1" node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` con `KIT_DIR` del kit de hoy y `SPEC_DIR` en `red/` → tabla de veredictos; se espera rojo en los dos.

**Interfaces**:
- Consume: nada.
- Produce: los ids `ss1` y `rq1`, y las filas de rúbrica nuevas o cambiadas (`IQ3` de `iq3`, `IQ5` de `iq2`, `tools:` de `iq4`, `rv1`, `p2`, `k2p`, `a1`/`iq1`), que las Tasks 2-5 relanzan tal cual.

**Ficheros**: modificar `tests/batteries/sdd-propose/battery.md` (y `subject.mjs` si hace falta); crear `tests/sdd-propose-0359-phase-skills-red.md`.

- [ ] **Step 1: Escenarios** — paso `interview`, molde `reservas`, `delegate`, `sonnet`, procedencia «feature 0359: ticket de la 0633 §1 y §2»:
  - `ss1`, n 3: prompt con la forma de `launch-prompt-template.md`: «Abierto» con dos puntos con propuesta (uno de producto y uno de método), «Decisiones ya tomadas» con un enfoque técnico que obliga a un efecto visible que nadie pidió, y «Antes de diseñar, lee» con seis o más ficheros del molde.
  - `rq1`, n 3: como `rv1` (spec redactada de dos revisores), sin delegar, con un `CLAUDE.md` de usuario en el montaje que pide confirmar antes de paralelizar y usar diálogos para preguntas cerradas.
- [ ] **Step 2: Rúbrica** —
  - `SS1` (ss1): falla si `tools: /Skill.*sdd-spec-writing/` no aparece antes de un `Write` de `spec.md`.
  - `SS2` (ss1): en prosa, falla si el turno no enseña los tres montones con un porqué por punto fuera del del dev-lead, o si un porqué no cita la línea del prompt, el fichero o la regla.
  - `SS3` (ss1): en prosa, falla si un punto de «Abierto» o el efecto visible no está en el montón del dev-lead, o si la primera pregunta no cita la propuesta como «propuesta del prompt».
  - `SS4` (ss1): falla si `spec.md` se escribe en ese turno.
  - `RQ1` (rq1): falla si `tools: /AskUserQuestion/` aparece; en prosa, falla si la pregunta de los revisores no va numerada al final con el modelo y el coste de cada uno.
  - `IQ3` (iq3): el nombre del fichero de test queda en el montón del dev-lead con su propuesta, sin preguntarse en ese turno.
  - `IQ5` (iq2): una parada con montones, enfoque en una línea y diseño corto; falla si pregunta lo que la petición ya dice.
  - Filas `tools:` de invocación: `sdd-spec-writing` en `iq4` (sin mensaje de montones) e `iq1`/`a1` (la primera pregunta tras la invocación); `sdd-spec-review` en `rv1`; `sdd-plan-writing` en `p2` y `k2p`.
  - Peticiones «sigue: paso 4» / «paso 5» de `rv1`, `rv2`, `rv3`, `lr1`, `rr1`, `p2`, `k2p`: quedan como hoy en esta task; las cambia la task que crea su skill.
- [ ] **Step 3: RED** — `plan` con `SCENARIOS="ss1 rq1"` (cita la línea `suma:`), después `run`. Esperado: rojo en los dos; lectura por regla (qué frase cita el sujeto al no preguntar o al usar el diálogo).
- [ ] **Step 4: Evidencia** — `tests/sdd-propose-0359-phase-skills-red.md` con la tabla, las citas y la causa. Con uno limpio 3 de 3: `Ruling:` y su guía sale del Scope (decisión 5).
- [ ] **Step 5: Commit de la task**.

### Task 2 — `sdd-spec-review`

**Tras**: Task 1
**Modelo**: sesión (Native). Sujetos: `sonnet`.
**Tests RED**: `rq1` (Task 1) y la fila `tools:` de `rv1`.

**Superficies**: docs (skills), tooling (batería, `compose-spec-review.mjs`, `word-budget.test.ts`)
**Verificación**:
- `moon run kit:build kit:own kit:copies kit:skill-size` → verde.
- `npx vitest run test/kit` desde `cli/` → `Tests  N passed (N)`.
- `SCENARIOS="rq1 rv1" node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` con el `dist/` nuevo → verde.

**Interfaces**:
- Consume: `rq1`, fila `tools:` de `rv1`.
- Produce: la skill `sdd-spec-review`, invocada con `Skill` tras el repaso de coherencia; devuelve hallazgos y no edita la spec. `sdd-propose` paso 4 la invoca hasta la Task 4.

**Ficheros**: crear `skills/sdd-spec-review/SKILL.md`, `references/reviewer-brief.md`; borrar `skills/sdd-propose/references/review-spec.md`; modificar `sdd-propose/SKILL.md` (la frase de la review), `control-profiles.md:53`, `sdd-parallel-agents/SKILL.md:3`, `:47`, `compose-spec-review.mjs`, `PRODUCT.md:23`, `upstream.json` (`own`), `word-budget.test.ts`, `battery.md` (peticiones de `rv1`-`rv3`, `rr1`).

- [ ] **Step 1: Skill** — frontmatter `name: sdd-spec-review`, `description: Use when sdd-spec-writing reaches the spec review, to size it and brief the reviewers. Invoked from there; not the entry of a change (that is sdd-propose).`; include `user-language` y `phase-notice`; §1, §2 y §4 de `review-spec.md` literales; en §2, en la línea de la pregunta: numbered prose at the end of the message that carries the 🦆 and the ✋, never `AskUserQuestion` or another dialog tool, also when the user's instructions ask for dialogs for closed questions; §3 literal en `references/reviewer-brief.md`.
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde; `dist/skills/sdd-spec-review/` existe.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task**.

### Task 3 — `sdd-plan-writing`

**Tras**: Task 2
**Modelo**: sesión (Native). Sujetos: `sonnet`.
**Tests RED**: filas `tools:` de `p2` y `k2p` (Task 1).

**Superficies**: docs (skills, plantilla, constitución), tooling (`upstream.json`, `word-budget.test.ts`, batería)
**Verificación**:
- `moon run kit:build kit:own kit:copies kit:skill-size` → verde; `kit:copies` con la copia por encima del 50 %.
- `npx vitest run test/kit` desde `cli/` → `Tests  N passed (N)`.
- `SCENARIOS="p2 k2p" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` → verde.

**Interfaces**:
- Consume: nada de la Task 2 salvo el `dist/` coherente.
- Produce: la skill `sdd-plan-writing`, que escribe `plan.md` con la línea `Ejecución`, el `Eje Arquitectura` y el gate de §3, y traspasa a `sdd-implement`.

**Ficheros**: crear `skills/sdd-plan-writing/SKILL.md`; borrar `skills/sdd-propose/references/plan-writing.md`; modificar `sdd-propose/SKILL.md` (paso 5 → invocar `sdd-plan-writing`; red flags de plan), `control-profiles.md:238`, `sdd-implement/SKILL.md:20`, `plan-template.md:12`, `:56`, `constitution.md:51`, `architecture.md:90`, `upstream.json` (`concept` → `copy`), `THIRD_PARTY_NOTICES.md:46`, `word-budget.test.ts`, `battery.md` (peticiones de `p2`, `k2p`).

- [ ] **Step 1: Fork** — copia de `skills/writing-plans/SKILL.md` v7.0.2; `sustituye` en «Plan Document Header» y «Task Structure» (→ `plan-template.md`), «Save plans to» (→ `changes/<carpeta>/plan.md`), la línea `REQUIRED SUB-SKILL` y «Execution Handoff» (→ «Execution handoff», «The architecture axis», «Where you stop» y «The closing gate» de `plan-writing.md`, literales, y el traspaso a `sdd-implement`). Conserva Overview, Scope Check, File Structure, Task Right-Sizing, Step Granularity, What a Step Contains, Self-Review y el texto de Global Constraints y Review Focus. Red flags: escribir `plan.md` sin aprobación explícita; editar código sin plan aprobado; en `delegate`, acabar el turno sin invocar `sdd-implement`. `description: Use when sdd-spec-writing hands off an approved full or spike spec, to write plan.md. Invoked from there; not the entry of a change (that is sdd-propose).`
- [ ] **Step 2: Build** — `moon run kit:build`. Esperado: verde.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task**.

### Task 4 — `sdd-spec-writing` y `sdd-propose` reducido

**Tras**: Task 3
**Modelo**: sesión (Native). Sujetos: `sonnet`.
**Tests RED**: `ss1` (Task 1), `IQ3` de `iq3`, `IQ5` de `iq2`, filas `tools:` de `iq4` e `iq1`/`a1`.

**Superficies**: docs (skills, plantilla, include), tooling (`upstream.json`, `word-budget.test.ts`, batería)
**Verificación**:
- `moon run kit:build kit:own kit:copies kit:skill-size` → verde; `sdd-spec-writing/SKILL.md` < 20.000 bytes y copia ≥ 50 %.
- `npx vitest run test/kit` desde `cli/` → `Tests  N passed (N)`.
- `SCENARIOS="ss1 iq2 iq3 iq4" node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` → verde.

**Interfaces**:
- Consume: `sdd-spec-review` (Task 2) y `sdd-plan-writing` (Task 3), por nombre.
- Produce: la skill `sdd-spec-writing`; `sdd-propose` traspasa feature, lite y spike a ella en el mismo turno del anuncio; el include `phase-notice`.

**Ficheros**: crear `skills/sdd-spec-writing/SKILL.md`, `includes/phase-notice.md`; borrar `skills/sdd-propose/references/spec-writing.md`, `coherence-pass.md`; modificar `sdd-propose/SKILL.md` (pasos 4 y 6, red flags y racionalizaciones de la spec, el aviso de fase al include), `patch-lane.md:14`, `sdd-config/SKILL.md:29`, `spec-template.md:42`, `upstream.json` (`concept` → `copy` con `notCopied`: `builder-check-prompt.md`, `visual-companion.md`, `scripts/`), `THIRD_PARTY_NOTICES.md:45`, `word-budget.test.ts`, `battery.md` (peticiones «paso 4» que queden).

- [ ] **Step 1: Include** — `includes/phase-notice.md` con el párrafo «Phase notice» de `sdd-propose/SKILL.md`, literal; `sdd-propose`, `sdd-spec-review` y `sdd-plan-writing` lo incluyen.
- [ ] **Step 2: Fork** — copia de `skills/brainstorming/SKILL.md` v7.0.2 con los cortes de la decisión 5 de la spec, cada uno `sustituye`; «Get them describing», «Ask one at a time» y pensar varias ideas → «ask with `sdd-grilling`»; las frases de la decisión 6 se quedan como texto de la fuente. «Your First Message» lleva la nota de entendimiento y los tres montones (decisión 8), sin la frase «With nothing in the dev-lead's pile, don't ask: write the spec»; «Abierto» siempre al montón del dev-lead con el contraejemplo de método (decisión 23) y el de «lo impone la técnica» (decisión 21); la delegada y `unattended` sin mensaje de montones (decisión 9). Literales de `spec-writing.md` («What the spec covers», «Approaches», «Design by sections», «Starting right away»), `coherence-pass.md` entero en su sección, la invocación de `sdd-spec-review`, el gate de aprobación del paso 4 en lugar del `<HARD-GATE>`, la aprobación por delegación, y los traspasos (full y spike → `sdd-plan-writing`; lite → `sdd-implement`). Red flags y racionalizaciones de la tabla de la spec. `description: Use when sdd-propose hands off a feature, lite or spike, to interview and write spec.md through its approval. Invoked from there; not the entry of a change (that is sdd-propose).`
- [ ] **Step 3: `sdd-propose`** — paso 4: invoca `sdd-spec-writing` con `Skill` en el mismo turno del anuncio, sin preguntar nada de la entrevista; pasos 5 y 6 quedan en el traspaso de patch y config; red flags y racionalizaciones de clasificar y trocear se quedan.
- [ ] **Step 4: Build y medida** — `moon run kit:build kit:skill-size`. Esperado: verde. Por encima de 20.000 bytes: para (desvío).
- [ ] **Step 5: Verificación** — la de arriba. Rojo: la tanda de REFACTOR, una sola en la feature; si sigue rojo, para.
- [ ] **Step 6: Commit de la task**.

### Task 5 — Constitución, ADR, documentos y tramo

**Tras**: Task 4
**Modelo**: sesión (Native). Sujetos: `sonnet`.
**Tests RED**: ninguno nuevo: el tramo y el entrevistador son controles.

**Superficies**: docs (steering, ADR, README), tooling (batería)
**Verificación**:
- `npx vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`.
- `node cli/bin/sdd.js decision index --files skills/sdd-spec-review/SKILL.md` → nombra la 0038.
**Verificación lenta**:
- `SCENARIOS="iq1 iq2 iq3 iq4 iq5 pb a5 g1 g1b s1 cp1 sp1 p2 ax pl2 pl3 k2p t1 co1 co2 co2p co3 co4 co5 co6 co7 co8 cr1 cr2 cr3 rc1 rc2 sr1 rv1 rv2 rv3 lr1 rr1 f1 h1 adr adr6 a1" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-propose/battery.md` → verde, ~40 min, en segundo plano.
- `SCENARIOS="p1 p2 p3 fp pe" node tests/headless/battery.mjs run tests/batteries/interviewer/battery.md` → verde.

**Interfaces**:
- Consume: las tres skills de fase.
- Produce: nada.

**Ficheros**: crear `.docs/sdd/decisions/0038-mandatory-phase-in-a-skill.md`, `tests/sdd-propose-0359-phase-skills-green.md`; modificar `constitution.md` (Art. II), `architecture.md:62`, `PRODUCT.md:16`, `README.md:3`, `CLAUDE.md:22` (24 → 27 skills), `word-budget.test.ts` (constitución 2.303).

- [ ] **Step 1: ADR y constitución** — ADR 0038 con la plantilla de ADR de `sdd-templates`: decisión, alternativa descartada (referencias con «First thing in this step: read»), evidencia (14 de 15 sesiones leen `spec-writing.md`, 5 no invocan `sdd-grilling`; 0/2 sujetos leyeron el auxiliar de la 0013), `rutas` con las tres skills nuevas, y las cinco ADR que rigen el texto movido. Art. II: una línea en «Elemento omitido» con enlace a la 0038. `architecture.md` punto 6: una fase obligatoria va en su skill y un auxiliar es de consulta, sin crecer.
- [ ] **Step 2: Recuentos** — 27 skills en los tres sitios.
- [ ] **Step 3: Verificación** — rápida y lenta. Un rojo del tramo: se lee contra la tabla de reglas movidas; si es una regla perdida, va a la tanda de REFACTOR si queda; si no, para.
- [ ] **Step 4: Evidencia** — `tests/sdd-propose-0359-phase-skills-green.md`: RED → GREEN por escenario, tramo, entrevistador, bytes y palabras de cada skill, porcentaje de cada copia.
- [ ] **Step 5: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 5h
- Estimación de implementación: 6h
- Estimación de revisión: 1h
- Estimación de cierre: 1h
- Base de la estimación: 5 tasks; las tandas de sujetos marcan el tiempo (el tramo, ~40 min); incertidumbre en los bytes de `sdd-spec-writing` y en el tramo.
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- feature-flow «El diseño…»: THEN con `sdd-grilling` → Task 4, `ss1` (`SS1`); AND de las tres skills invocadas con `Skill` → Tasks 2-4, filas `tools:` de `rv1`, `p2`, `k2p`, `ss1`; AND de `sdd-spec-review` no aprueba → Task 2, lectura del texto. ✓
- «La entrevista pregunta solo…»: THEN de `iq1` → tramo (Task 5); AND del prompt completo → `iq2` (`IQ5`, Task 4); AND de «Abierto» → `iq3` (`IQ3`, Task 4); AND de `iq5` → tramo; AND de la delegada → `iq4` (Task 4). ✓
- ADDED de los tres montones: THEN y sus cuatro AND → `ss1` (`SS1`-`SS4`), Tasks 1 y 4. ✓
- ADDED del plan: THEN → `p2`, `k2p` (Task 3); AND «en lite no se invoca» → `lr1` del tramo y lectura del texto. ✓
- «El gate de cierre del plan» → `pl2`, `pl3` del tramo (Task 5). ✓
- «`sdd-propose` entrega el cambio…» → `p2`, `k2p` (Task 3), `t1` del tramo; AND de lite y patch → lectura y tramo. ✓
- «Pedir empezar ya» → `s1` del tramo. ✓
- «La spec se repasa antes del gate» y sus AND → `co1`-`co8`, `cr1`-`cr3` del tramo. ✓
- «Una feature grande…» → `sp1` del tramo; AND de `pair` con el montón vacío → sin observar: sin escenario en `pair`, como en la 0356 (spec). ⚠
- «Cada cambio de paso…» → `ax` del tramo y lectura de los includes. ✓
- interviewing «Cuándo para…», «Rebatir una vez», «Lo que decide el agente…» → `iq2` (Task 4), `rc1`, `rc2`, `a5`, `pb` del tramo y batería `interviewer` (Task 5). ✓
- routing «Una petición entra por el kit…» → `a1` (Task 5); AND de las fases que no son puerta → `a1`. ✓
- routing «El patch registra…» → lectura de `patch-lane.md` (Task 4); sin escenario nuevo. ✓
- routing «Full y spike anuncian y siguen» → `a1`/`iq1`, fila de la invocación en el mismo turno (Task 4 y tramo). ✓
- spec-review «La spec propone su propio nivel…»: AND de la prosa sin diálogo → `rq1` (Task 2); el resto → `rv1`-`rv3`, `rr1`, `lr1` del tramo. ✓
- control-profiles «Un cambio a la spec aprobada…» → lectura de `control-profiles.md` (Task 2); `h1` del tramo. ✓
- verification «El eje Arquitectura…» → lectura de `sdd-plan-writing` (Task 3); la batería de `sdd-verify` no cambia. ✓
- Tabla «regla retirada → dónde vive ahora»: cada fila → la task que crea su destino, con `git grep` de la regla en su destino en la verificación de esa task; el conjunto, el tramo (Task 5). ✓
- Antiobjetivo 4 (20.000 bytes) → `kit:skill-size` en las Tasks 2-4. ✓
- Review Focus → Task 4 y Tasks 2-4 (enlaces). ✓
- `unattended` y «empieza ya» sin mensaje de montones → sin observar: decisión 9 de la spec. ⚠
