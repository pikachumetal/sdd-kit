---
id: 20261120-150821-feature-0361-plain-language-questions
feature: 0361
title: Plan de implementación — Las preguntas de la entrevista hablan en el idioma del producto
spec: ./spec.md
status: approved
created: 2026-11-20
---

# Plan de implementación — Las preguntas de la entrevista hablan en el idioma del producto

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: las dos tasks las hace el hilo (Native); los sujetos de la batería, Sonnet (los fija `battery.md`). Revisión final: eje Spec `sdd-kit:effort-high` + `opus`, eje Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native (ver la línea `Ejecución`).
3. El brazo base del RED y del A/B es `git archive 004c18a3d:dist` (el `develop` de donde sale la rama, sin cambios en `dist/` desde entonces), extraído en `.temp/k361-base`; el brazo de la rama, `dist/` tras `moon run kit:build`, copiado a `.temp/k361-new`. `RUNS_DIR` en `.temp/r361` (ruta corta: `operations.md`, «RUNS_DIR en una ruta corta…»).
4. Riesgo alto: que la base pase J1 y J2 en el RED. Si pasa, la feature para (decisión 7 de la spec).
5. Coste: ~1,5 h de hilo; 22 sujetos, ~4,30 $ (previsión de la spec).
6. Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: llevar la regla de hablar llano al molde de la pregunta de `sdd-grilling` y medirla con un escenario nuevo de su batería.

**Architecture**: solo texto de skills, una fila de batería y dos topes de un test. El escenario `j1` va primero y se mide en la base (RED); después se editan las dos skills, se mueven los topes y se mide la rama (GREEN) y el A/B.

**Tech Stack**: Markdown de skills, `tests/headless/battery.mjs` (sujetos headless Sonnet), Vitest (`cli/test/kit/word-budget.test.ts`), moon (`kit:build`, `kit:own`, `kit:copies`, `kit:skill-size`).

**Spec**: `./spec.md`

**Ejecución**: native, porque son 2 tasks en cadena (la 2 depende del rojo de la 1), un error lo caza la batería o `kit:own`, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: invoca `sdd-implement-subagent` y despacha con él las que quedan sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de dos skills, una batería y dos números de un test.

## Restricciones globales

### De código

- Las skills van en inglés; los ejemplos en castellano, solo entre «» o en código en línea (`kit:own`).
- Ninguna racha de 10 palabras repetida entre dos skills (`kit:own`).
- `skills/sdd-spec-writing/SKILL.md` es copia de `brainstorming`: lo que sale se tapa con `<!-- kit: 0361 · sustituye: «…» -->` … `<!-- kit: fin -->`, como la 0359 en esa misma sección (`kit:copies`).
- Topes: `sdd-grilling` 974 (skillMd y total), `sdd-spec-writing` 3362 (skillMd y total).
- Art. X: sin comentarios que repitan el código ni que citen documentos.

### De proceso

- Commits: tipo/scope en inglés, título y cuerpo en castellano; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Sujetos Sonnet, por tandas, hasta `control.maxParallelAgents` (3).

## Review Focus

- La pregunta de `sdd-config` sobre una clave (`merge.push`) → la nombra, con su efecto en la misma frase · Task 2, A/B de g7 (C1).
- Un hecho de un fichero en una pregunta de descubrimiento de `sdd-init` → enseña el hecho con su fuente, sin casos añadidos · Task 2, A/B de g8 (R5).
- Una pregunta tras una búsqueda en la web → cita el enlace entre paréntesis · Task 2, A/B de g9 (R11).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres viñetas y un molde; nada más simple mueve la regla al paso.
- [x] **YAGNI gate**: sin abstracciones.
- [x] **Brownfield gate**: las reglas medidas de la fuente, el descubrimiento y las claves se conservan; el A/B lo comprueba.
- [x] **Constitution check**: Art. I (cada paso cambiado con escenario o motivo: decisiones 9 y 10 de la spec), Art. II (contraejemplo de la clave en J1), Art. III (inglés), Art. IX (A/B de lo que sale).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `tests/batteries/sdd-grilling/battery.md` — fila `j1`, filas J1 y J2 de la rúbrica, línea en «Procedencia de las reglas», `TURN2` de `j1` en el párrafo de turnos extra.
- `tests/batteries/sdd-grilling/subject.mjs` — `turn2.j1`.
- `skills/sdd-grilling/SKILL.md` — «Shape of a question».
- `skills/sdd-spec-writing/SKILL.md` — «The Conversation» y «Play It Back».
- `cli/test/kit/word-budget.test.ts` — dos topes.
- `dist/` — por `moon run kit:build`.

**NO se tocan**:

- `.docs/sdd/capabilities/interviewing.md` — el delta lo fusiona `sdd-archive`.
- `skills/sdd-rubber-duck/SKILL.md` — sus reglas del 🦆 se quedan; la viñeta nueva no las copia.

### 1.6 Dependencias

Ninguna.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La base pasa J1 y J2 | media | la feature no se justifica | Task 1 primero; si pasa, parar y avisar |
| `kit:copies` rechaza la marca de la copia | media | rojo del pre-commit | calcar la forma de la marca 0359 de las líneas 124-126 |
| A/B a n = 2 da ruido | media | falsa regresión | relanzar a n = 4 antes de concluir |

### 1.8 Rollout

Directo: va en la siguiente release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Escenario `j1` y su RED en la base

**Tras**: —
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · escenario `j1` de `tests/batteries/sdd-grilling/battery.md`, puntuado con J1 y J2 sobre la base
**Superficies**: tooling (batería)
**Verificación**: `BATTERY=sdd-grilling SCENARIOS="j1" N=2 PHASE=red KIT_DIR=.temp/k361-base RUNS_DIR=.temp/r361 node tests/headless/battery.mjs run` → los dos sujetos con `RESULTADO`; veredicto de la puerta `sdd-kit:sdd-propose`; lectura de cada `texts.txt` con J1 y J2, al menos 1 de 2 falla
**Interfaces**:
- Consume: nada
- Produce: `j1` en `battery.md` y `turn2.j1` en `subject.mjs`, que la Task 2 relanza sobre la rama

**Ficheros**: modificar `tests/batteries/sdd-grilling/battery.md`, `tests/batteries/sdd-grilling/subject.mjs`

- [ ] **Step 1: Escenario** — fila en «Escenarios»: `| j1 | sdd-propose | Carril feature, modo full: \`libres\` no tiene en cuenta el día: Norte tiene reserva el lunes de 10:00 a 12:00 y \`libres 10:00-12:00\` no la da ningún día. Arréglalo. | salas | \`sdd-kit:sdd-propose\` | 2 | 2/2 | sonnet | feature 0361: la pregunta habla en el idioma del producto y devuelve la regla del dev-lead (ticket de la 0356 §1; 0727 y 0737 de document-manager) |`. En `subject.mjs`, `turn2.j1 = 'ya te lo digo yo: una sala está libre si ese día a esa hora no tiene reserva'`; en el párrafo de turnos extra, «j1 lleva `TURN2` «ya te lo digo yo: …»».
- [ ] **Step 2: Rúbrica** — filas J1 y J2, literales de la decisión 5 de la spec; línea en «Procedencia de las reglas»: «La pregunta cuenta lo hallado por su efecto, con la fuente detrás; el caso añadido, marcado como del agente; la regla del usuario, devuelta en sus palabras | feature 0361: ticket de la 0356 §1, transcripts de la 0727 y la 0737 de document-manager; RED `j1` <resultado> | j1; g7, g8, g9, p2 (A/B)».
- [ ] **Step 3: Previsión** — `SCENARIOS="j1" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-grilling/battery.md` → `suma: 2 sujetos · coste previsto: <x> $`; si difiere de 0,42 $, corrige las filas RED, GREEN y REFACTOR de la previsión de la spec.
- [ ] **Step 4: Kit base** — `git archive 004c18a3d:dist` extraído en `.temp/k361-base`.
- [ ] **Step 5: RED** — el comando de «Verificación»; anota en el ledger cada sujeto con J1/J2 y la cita literal que falla. Sin rojo: parar y avisar al dev-lead (decisión 7 de la spec).
- [ ] **Step 6: Commit de la task** — `test(sdd-grilling): escenario j1 de preguntas en el idioma del producto`.

### Task 2 — Mudar la regla, topes, GREEN y A/B

**Tras**: Task 1
**Modelo**: hilo principal (Native)
**Tests RED**: los de la Task 1 (`j1`, J1 y J2)
**Superficies**: docs (skills) · tooling (test de topes, batería)
**Verificación**:
- `moon run kit:build kit:own kit:copies kit:skill-size` → verde
- `pnpm exec vitest run test/kit/word-budget.test.ts` desde `cli/` → `Tests  N passed (N)`, sin fallos
- GREEN: `BATTERY=sdd-grilling SCENARIOS="j1" N=2 PHASE=green KIT_DIR=.temp/k361-new RUNS_DIR=.temp/r361 node tests/headless/battery.mjs run` → J1 y J2 pasan 2 de 2 (con 1 de 2, n = 4)
- A/B: `SCENARIOS="g7 g8 g9 p2" N=2` con `PHASE=ab-base KIT_DIR=.temp/k361-base` y con `PHASE=ab-new KIT_DIR=.temp/k361-new` → el brazo nuevo igual o mejor por fila (C1, R10, R5, R11, W2, W3, R2, R12); una fila que cae se relanza a n = 4
**Interfaces**:
- Consume: `j1` de la Task 1
- Produce: nada

**Ficheros**: modificar `skills/sdd-grilling/SKILL.md`, `skills/sdd-spec-writing/SKILL.md`, `cli/test/kit/word-budget.test.ts`, `tests/batteries/sdd-grilling/battery.md` (resultado en «Procedencia»)

- [ ] **Step 1: `sdd-grilling`** — en «Shape of a question»: molde `<what you found, with sources>` → `<what you found, by its effect (its source)>`; tras «say it, confirm it;» añade «a rule the user already said: repeat it in their words, ask only if that's it.»; quita « Tell limits by their effect, not their cause.»; viñeta nueva antes de «- For how a screen»: «- Tell it by what changes in the product: «cada factura sale con su vencimiento», not «añado `dueDate` a `InvoiceDto`». Code names go to what the step writes, or nowhere; one the decision is about carries its effect in that sentence. A case the user didn't bring: one line with its data, saying it's yours and from where.»
- [ ] **Step 2: `sdd-spec-writing`** — tapa con marca `kit: 0361 · sustituye: «…»` «Use plain language, pitched just a little above where your human partner is. Match their vocabulary; never use process jargon.» y «Be clear and concise. Lead with what matters. Avoid jargon.» (se queda «When you report what you found, give them the most important findings and offer the rest.»); en «Play It Back» (bloque kit 0359), «, in plain words and with an example with data, and its question is about that: «…», not «…». Code names, files and internal flags go after it, only if needed (the short mode of `sdd-rubber-duck`): a» → «, with an example with data, and its question is about that, asked as `sdd-grilling` says: a».
- [ ] **Step 3: Topes** — `'sdd-grilling': { skillMd: 974, total: 974 }`, `'sdd-spec-writing': { skillMd: 3362, total: 3362 }`.
- [ ] **Step 4: Build y chequeos** — la primera línea de «Verificación» y Vitest de topes; `wc -w dist/skills/sdd-grilling/SKILL.md` → 954 ± lo que cambie la marca.
- [ ] **Step 5: GREEN** — kit de la rama en `.temp/k361-new` (copia de `dist/`); el comando GREEN; ledger con J1/J2 por sujeto. Si sigue con casos añadidos que lían, parar y avisar (decisión 7).
- [ ] **Step 6: A/B** — los dos brazos; tabla por fila y brazo en el ledger y en `walkthrough.md`.
- [ ] **Step 7: Commit de la task** — `feat(sdd-grilling): la pregunta habla en el idioma del producto`.

> Enmienda 2026-11-20: la Task 2 cerró con el texto enmendado de las skills y los topes; su GREEN y su A/B (Steps 5 y 6) pasan a la Task 3.

### Task 3 — enmienda 2026-11-20: `j1` en `reservas`, RED, GREEN y A/B

**Tras**: Task 2
**Modelo**: hilo principal (Native)
**Tests RED**: hilo principal · `j1` sobre el molde `reservas`, puntuado con J1 (vocabulario del proyecto) y J2
**Superficies**: tooling (batería)
**Verificación**:
- RED: `BATTERY=sdd-grilling SCENARIOS="j1" N=2 PHASE=red-reservas KIT_DIR=.temp/k361-base …` → al menos 1 de 2 falla J1 o J2
- GREEN: `PHASE=green-reservas KIT_DIR=.temp/k361-new` → J1 y J2 pasan 2 de 2 (con 1 de 2, n = 4)
- A/B: `SCENARIOS="g7 g8 g9 p2" N=2 PHASE=ab-new KIT_DIR=.temp/k361-new` frente a `ab-base/` → igual o mejor por fila
**Interfaces**:
- Consume: el texto de las skills de la Task 2; `ab-base/` del brazo base
- Produce: nada

**Ficheros**: modificar `tests/batteries/sdd-grilling/battery.md`

- [ ] **Step 1: `j1`** — molde `reservas` en su fila; fila J1 con el texto de la decisión 5 de la spec enmendada; J2 con «una pregunta que confirme esa regla (en prosa, o con opciones numeradas de confirmarla o corregirla)»; procedencia con el RED nuevo.
- [ ] **Step 2: RED** en la base; ledger con J1/J2 y citas.
- [ ] **Step 3: GREEN** con `.temp/k361-new` reconstruido desde `dist/`.
- [ ] **Step 4: A/B** brazo nuevo; tabla por fila y brazo.
- [ ] **Step 5: Commit de la task** — `test(sdd-grilling): j1 sobre reservas y medida de la enmienda`.

> Enmiendas segunda y tercera (2026-11-20): la Task 3 añadió la tanda de corrección (la regla en la nota de entendimiento de `sdd-spec-writing` y la devolución en «Answers» de `sdd-grilling`), siguió en rojo y cerró devolviendo las skills, `dist/` y los topes a los de `develop`; su commit real es `test(sdd-grilling): j1 sobre reservas y cierre solo con la prueba`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 1h (la mayor parte, espera de sujetos)
- Estimación de revisión: 0,3h
- Estimación de cierre: 0,4h
- Base de la estimación: 2 tasks de texto con batería; la 0359 y la 0356 de tamaño parecido
- Confianza: media (el RED puede parar la feature)

---

## 3. Validación final

> Tercera enmienda: el criterio de éxito pasa a ser la prueba `j1` en rojo con el kit de `develop` y su evidencia; los ADDED y el rojo → verde del Self-review de abajo ya no se entregan.

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (Intent): `j1` rojo → verde; g7, g8, g9 y p2 igual o mejor
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- ADDED 1, THEN (lo hallado por su efecto, con la fuente detrás) → Task 2, GREEN `j1` J1. ✓
- ADDED 1, AND nombres del código al documento o a ninguna parte; la clave objeto de la decisión, con su efecto → Task 2, GREEN `j1` J1 (contraejemplo) y A/B g7 C1. ✓
- ADDED 1, AND caso añadido en una línea, marcado → Task 2, GREEN `j1` J1. ✓
- ADDED 1, AND descubrimiento sin cambios → Task 2, A/B g8 R5. ✓
- ADDED 2, THEN repetir en sus palabras y sí/no en prosa → Task 2, GREEN `j1` J2. ✓
- ADDED 2, AND sin alternativas sobre la regla → Task 2, GREEN `j1` J2. ✓
- ADDED 2, AND rebatir antes si choca con un hecho → sin observar en `j1`: la regla del `TURN2` no choca con el código; lo cubre g4 (R7), fuera del A/B porque su texto no cambia. ⚠
- Fila «molde `with sources`» → Task 2 Step 1; `git grep "with sources" skills/` vacío. ✓
- Fila «Tell limits…» → Task 2 Step 1; A/B no lo mide (g3 y g6 fuera, su escena no cambia). ⚠ avisado en la decisión 1 de la spec.
- Filas de `sdd-spec-writing` → Task 2 Step 2; A/B p2 y `kit:copies`. ✓
- Fila de topes → Task 2 Step 3; Vitest de topes. ✓
- Review Focus (g7, g8, g9) → Task 2 Step 6. ✓
