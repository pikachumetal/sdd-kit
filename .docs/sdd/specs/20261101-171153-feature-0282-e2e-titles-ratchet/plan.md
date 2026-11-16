---
id: 20261101-171153-feature-0282-e2e-titles-ratchet
feature: 0282
title: Plan de implementación — El test de títulos E2E se adopta con ratchet y lee playwright test --list
spec: ./spec.md
status: approved
created: 2026-11-01
---

# Plan de implementación — El test de títulos E2E se adopta con ratchet

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las dos tasks; sujetos Sonnet con `tests/headless`. Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native (motivo abajo).
3. `RUNS_DIR` en `.temp/r0282` del worktree, no en el scratchpad: la ruta del scratchpad pasa de los 100 caracteres que admite `campaign.mjs`. Se borra al cerrar.
4. Los moldes reales son clones en `RUNS_DIR/molds/{dm,ody}` con `.docs/` sustituido por los documentos 2.x mínimos que necesita cada escenario, sin el `CLAUDE.md` del proyecto, para no gastar en leer su historia. Sus salidas no se versionan (decisión 10 de la spec); en `red/` y `green/` van `subject.mjs` y recuentos.
5. Coste: 7,2 $ en sujetos (spec); ~1,5 h.
6. Review Focus: 3 entradas; ver la sección.

**Goal**: la guía, la plantilla, la init y la migración dejan un test de títulos que nace en verde, solo encoge y lee `playwright test --list`.

**Architecture**: solo texto de skills; el test lo escribe cada proyecto. La prueba son sujetos sobre copias de suites reales y sondas a mano sobre el test que dejan.

**Tech Stack**: Markdown de skills; `tests/headless`; Vitest en `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks de texto sin interfaces entre ellas, un error lo caza el sujeto de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y evidencia.

## Restricciones globales

### De código

- Saldo de palabras igual o menor en `writing-e2e.md` (1002), `operations-template.md` (1143), `sdd-init/SKILL.md` (2662) y `v3.0.0.md` (3558 medidas con `wc -w`, y comparadas igual al acabar).
- Ningún recorte quita una instrucción; si la quita, lleva su RED.
- Art. III: skills en inglés salvo las que siguen en castellano (`v3.0.0.md` y la plantilla, en castellano; `writing-e2e.md` y `sdd-init`, en inglés).
- Ningún título de producto de una suite real en un fichero versionado.
- Art. X: sin comentarios que repitan el código ni que citen documentos; clean code.

### De proceso

- Política de modelos: la de la línea `Política de modelos:` de la spec. Sujetos por tandas, hasta `control.maxParallelAgents`.
- Commits con la atribución de la sesión; `git commit -F` con el mensaje en el scratchpad.

## Review Focus

- Un mismo test en dos `projects` de una config → cuenta como un título, no como repetido ni rojo · Task 1, sonda sobre el test de `a1` (document-manager, config audit).
- Un test `@slow` nuevo, escondido por `grepInvert` → sale en rojo · Task 1, sonda sobre el test de `a1`.
- Una spec de smoke que lee el entorno al cargar, sin `appsettings.local.json` → el test no da verde con lista vacía · Task 1, `a2` y su sonda de spec que lanza.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin verbo de CLI ni helper; una regla en la guía.
- [x] **YAGNI gate**: nada abstraído.
- [x] **Brownfield gate**: la suite del proyecto no se toca salvo el test nuevo.
- [x] **Constitution check**: Art. I (RED antes), Art. V (la pregunta va en migración e init), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/e2e-titles-ratchet-red.md`, `tests/e2e-titles-ratchet-green.md` — evidencia, solo recuentos.
- `.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/{red,green}/subject.mjs` — lanzadores.

**Modificar**:

- `skills/sdd-tdd/references/writing-e2e.md` — regla 1 y lo que la paga.
- `skills/sdd-templates/templates/operations-template.md` — «Flujos core».
- `skills/sdd-init/SKILL.md` — fila «How it is tested».
- `skills/sdd-upgrade/references/migrations/v3.0.0.md` — paso 2, «Escribe», verificación.

**NO se tocan**:

- `code-reviewer-prompt.md`, `sdd-verify/SKILL.md`, `e2e-suite.md`, `frontend-verification.md` — leen el campo entero (decisión 7 de la spec).

### 1.6 Dependencias

Patch 0278 cerrado; `tests/headless`; copias de document-manager y OdySIF.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Títulos reales en un fichero versionado | media | alto | `git diff` buscando títulos del listado antes de cada commit |
| Un RED de init o migración cuesta más de lo previsto | media | medio | Tope por sujeto; si la suma pasa de 7,2 $ + una tanda, para (Art. I) |
| El saldo obliga a recortar una instrucción | baja | medio | Lleva su RED, o se acorta el texto nuevo |

### 1.8 Rollout

Directo: entra en la 3.0.0.

### 1.9 Excepciones a la constitution

Ninguna. Se aparta de la costumbre de `tech-stack.md` de versionar lo que produce cada sujeto (decisión 10 de la spec).

---

## 2. Tasks

### Task 1 — La guía y la plantilla: el test nace en verde, solo encoge y lee `--list`

**Tras**: —
**Modelo**: Native: la sesión; effort: el de la sesión. Sujetos Sonnet.
**Tests RED**: hilo principal · `a1` sobre la copia de document-manager con el texto de hoy.
**Superficies**: docs
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts test/kit/path-length.test.ts test/kit/operations-gate-fields.test.ts` desde `cli/` → `Tests  N passed`; sondas a mano.
**Se prueba en la aplicación**: no, porque es texto de skills: lo prueban los sujetos.

**Interfaces**:
- Consume: nada.
- Produce: la regla 1 de `writing-e2e.md` y el bloque «Títulos heredados» del campo «Flujos core», que nombran init y migración.

**Ficheros**: modificar `writing-e2e.md`, `operations-template.md`; crear evidencia.

- [ ] **Step 1: RED** — `a1`: copia de document-manager sin «Flujos core», una task que amplía un E2E. Con el texto de hoy, esperado: sin test de títulos, o con regex o en rojo; cualquiera de las tres reproduce.
- [ ] **Step 2: Texto** — la regla 1 dice: una vez por config, `playwright test --list --reporter=json` con el entorno que apaga `grep` y `grepInvert` de la config; no arranca nada; títulos `describe › título` sin repetir entre `projects`; rojo con un título en ninguna lista, con un heredado que no existe y con salida distinta de 0, con el error de Playwright; spec que lee el entorno al cargar: la lectura a una fixture o el entorno al listado; timeout de 30 s; al faltar, con el primer E2E, «Títulos heredados» con todos los de hoy, y nunca una línea más. La plantilla: el bloque en «Flujos core». Saldo pagado como dice la spec.
- [ ] **Step 3: GREEN** — `a1`, `a2` (copia de OdySIF, sin `appsettings.local.json`), `n1` (molde sin E2E de la 0278). Sondas sobre el test de `a1` y `a2`: test nuevo, título en bucle, heredado borrado, `@slow` nuevo (`a1`), spec que lanza. Cada sonda en una copia, restaurada al acabar.
- [ ] **Step 4: Verificación** — los comandos de arriba; `git grep` de un título real en lo versionado: 0.
- [ ] **Step 5: Commit de la task**

### Task 2 — La init y la migración ofrecen el test

**Tras**: Task 1
**Modelo**: Native: la sesión; effort: el de la sesión. Sujetos Sonnet.
**Tests RED**: hilo principal · `m1` e `i1` con el texto de hoy.
**Superficies**: docs
**Verificación**: los mismos cuatro tests de `cli/test/kit/` y además `migration`, si existe un test del fichero; `Tests  N passed`.
**Se prueba en la aplicación**: no, porque es texto de skills: lo prueban los sujetos.

**Interfaces**:
- Consume: regla 1 de `skills/sdd-tdd/references/writing-e2e.md` y el bloque «Títulos heredados» del campo «Flujos core» de `operations-template.md`.
- Produce: nada.

**Ficheros**: modificar `sdd-init/SKILL.md`, `v3.0.0.md`; ampliar la evidencia.

- [ ] **Step 1: RED** — `m1` (proyecto 2.x con E2E, hasta el gate del paso 2) e `i1` (proyecto con E2E, hasta la fila de Testing), hasta la tabla o la pregunta, con el texto de hoy. Esperado: no ofrecen el test.
- [ ] **Step 2: Texto** — la fila de la init y la celda del paso 2 ofrecen el test con «Títulos heredados» de `--list`, por la regla 1; con el «sí» lo escriben, en verde; sin E2E no lo nombran. En `v3.0.0.md`, «Escribe» nombra el test y la verificación de `git status` lo admite. Saldo pagado como dice la spec.
- [ ] **Step 3: GREEN** — `m1`, `i1`, `n2` (migración sin E2E). En `m1`, el «sí» en el mensaje de arranque: el test queda y sale en verde.
- [ ] **Step 4: Verificación** — los comandos de arriba; `wc -w` de los cuatro ficheros contra el saldo.
- [ ] **Step 5: Commit de la task**

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: 1,5 h + ~10 min de gate de cierre
- Base de la estimación: 2 tasks; 0278 (0,19 h de implementación con un molde hecho, patch.md §5), con moldes reales que hay que preparar
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow`, requisito modificado: título fuera de la lista en rojo, en la lista en verde, sin E2E no se pide → Task 1, sondas de `a1`; `n1`. ✓
- Nace en verde, con todos los títulos en heredados → Task 1, `a1` y `a2`, test corrido a mano. ✓
- `test(...)` nuevo y título en bucle en rojo con su nombre; heredado borrado en rojo → Task 1, sondas. ✓
- La task no añade su línea → Task 1, `a1`: una task que añade un título; se mira `operations.md`. ✓
- 70 títulos con `grepInvert`, 19 distintos en 2 `projects` → Task 1, sonda `@slow` y recuento en `a1`. ✓
- Sin servidor, `globalSetup` ni navegador → spec, medidas; Task 1, la copia no tiene entorno. ✓
- Salida distinta de 0, rojo con el error → Task 1, sonda de spec que lanza. ✓
- Migración: ofrece; con «sí», bloque y test en verde; sin E2E no lo nombra → Task 2, `m1`, `n2`. ✓
- Init: ofrece; con «sí», test en verde; sin E2E no lo nombra → Task 2, `i1`; sin E2E, solo lectura de la fila, con el predicado «With E2E tests». ⚠ sin sujeto propio: la previsión no lo lleva, y el predicado ya existe.
- Review Focus → Task 1, sondas nombradas. ✓
