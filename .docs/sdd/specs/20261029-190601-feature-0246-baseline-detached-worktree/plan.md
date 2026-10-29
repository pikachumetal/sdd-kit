---
id: 20261029-190601-feature-0246-baseline-detached-worktree
feature: 0246
title: Plan de implementación — La línea base corre en un worktree desanclado, y la pasada de fix prueba el efecto y no adjudica lo que mete
spec: ./spec.md
status: approved
created: 2026-10-29
---

# Plan de implementación — La línea base corre en un worktree desanclado, y la pasada de fix prueba el efecto y no adjudica lo que mete

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: Native, la sesión implementa las tres tasks; sin subagentes por task. Los sujetos de las campañas son Sonnet, por el lanzador de baterías (`battery.mjs`, `MAX_PARALLEL` 3), no por `Agent`. Revisión final: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. Ejecución: native (abajo).
3. Los escenarios nuevos van en las baterías que ya existen, con ids libres: `w2` en `sdd-implement` (`w1` ya es el humo de `sdd-worktrees`); `c7`, `c8` y `c9` en `sdd-verify` (sus `s1` y `t1` ya existen); `t6` en `sdd-implement` para el humo de `sdd-tdd` (su paso `tdd-brief` ya compone encargos de implementador). Cada uno con un paso propio para lanzarlo solo con `STEPS`.
4. El RED de cada task se lanza con el texto de las skills sin tocar (el del commit de apertura) y el GREEN tras editarlas: los escenarios y sus fixtures viven en `tests/`, fuera de `skills/`.
5. La fila `Wt` de `w1` cambia: hoy falla si el sujeto «ejecuta `git worktree add`», y la línea base lo hace a propósito con `--detach`. Pasa a fallar si crea un worktree con rama (`git worktree add` sin `--detach`) o una herramienta nativa.
6. Riesgo alto: `c6` (un Important que la pasada de fix metió y cuyo arreglo cambia la spec) puede leerse con la regla nueva como «arréglalo en el hilo». Va al Review Focus y `c6` corre como control en la Task 3.
7. Coste: ~3 h de implementación y campaña; ~24 sujetos, ~12 $, techo 15 $ (decisión 10 de la spec).
8. Review Focus: 3 entradas; ver la sección.

**Goal**: la línea base corre en un worktree desanclado en `HEAD`, y la pasada de fix prueba el efecto, toma los valores de la spec y no adjudica lo que mete, sin que crezca ninguna skill.

**Architecture**: solo texto de skills y baterías. Cada regla va en el paso donde se decide (paso 3 de `sdd-worktrees`, «Verify RED» de `sdd-tdd`, «Closing the review» de `sdd-verify`), y las demás skills la nombran sin copiarla.

**Tech Stack**: Markdown de `skills/`; baterías de `tests/batteries/` con `tests/headless/battery.mjs`; Vitest de `cli/test/kit/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son 3 tasks de texto independientes entre sí, un error lo caza la campaña RED/GREEN de su task y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia texto de skills y escenarios de baterías existentes

## Restricciones globales

### De código

- Ningún fichero editado de `skills/` acaba con más palabras que hoy, contadas como `words()` de `cli/test/kit/word-budget.test.ts` (`text.split(/\s+/).filter(Boolean).length`): `sdd-worktrees/SKILL.md` 1435, `sdd-implement/SKILL.md` 9583, `sdd-tdd/SKILL.md` 1716, `sdd-verify/SKILL.md` 3567, `sdd-propose/references/plan-writing.md` 896.
- Las skills se escriben en inglés; la evidencia y las baterías, en castellano (Art. III).
- Art. X: sin comentarios que repitan el código ni que citen documentos (constitution, spec, task, capacidad); nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación.
- Texto copiado de superpowers (`sdd-worktrees`, `sdd-tdd`) se conserva salvo donde el kit trabaja distinto (Art. IX): los recortes salen de texto del kit.

### De proceso

- Native; sujetos Sonnet por `battery.mjs`, hasta 3 a la vez; techo de campaña 15 $: con más, para y decide el dev-lead.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Un rojo de batería no se relanza para sacar verde: se lee por qué falló.

## Review Focus

- `c6`: un Important que metió la pasada de fix y cuyo arreglo de vuelta a la spec deshace el hallazgo que la pasada arreglaba → para como desvío, no lo arregla en el hilo ni lo adjudica · Task 3, `c6` (control).
- Línea base roja en el worktree desanclado → el worktree se quita igual (y `env:clean` si hubo `env:setup`) antes de repetir en la rama de integración · Task 1, `w2` (fila `Wb`).
- Un Important de la re-revisión en código que no tocó la pasada de fix → se sigue adjudicando con `Final: Ruling:` · Task 3, `c8` (fila `C8`: el informe trae además un Important en código ya revisado).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: tres reglas en los pasos que ya existen, sin pasos nuevos.
- [x] **YAGNI gate**: nada abstrae.
- [x] **Brownfield gate**: la línea base roja sigue el camino de hoy; la revisión final no cambia.
- [x] **Constitution check**: Art. I (prueba y previsión de coste en la spec), Art. II (prohibición en el paso que decide), Art. IX (recortes fuera del texto de superpowers).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/sdd-worktrees/SKILL.md` — paso 3: la línea base en `git worktree add --detach <worktrees parent>/baseline-<id> HEAD`, con el paso 2 allí y quitado al acabar; «If tests fail» acortado; filas de «Quick Reference» del paso 3 fundidas.
- `skills/sdd-implement/SKILL.md` — Setup paso 1: «the baseline, in a detached worktree at `HEAD`».
- `skills/sdd-tdd/SKILL.md` — «Verify RED», viñeta «Fails because feature missing»: el efecto.
- `skills/sdd-verify/SKILL.md` — «Closing the review»: Native nombra el efecto; «In both…» gana el valor de la spec; «What it leaves open» funde el Critical y el Important de la pasada.
- `skills/sdd-propose/references/plan-writing.md` — punto 1 de «Self-review» nombra la regla de `sdd-tdd`.
- `tests/batteries/sdd-implement/` — `w2`, `t6`, fila `Wt` de `w1`, sus fixtures y su procedencia.
- `tests/batteries/sdd-verify/` — `c7`, `c8`, `c9`, sus fixtures y su procedencia.

**Crear**:

- `tests/baseline-detached-red.md`, `tests/baseline-detached-green.md` — evidencia de `w2` y `w1`.
- `tests/fix-pass-effect-red.md`, `tests/fix-pass-effect-green.md` — evidencia de `c7`, `c8`, `c9`, `t6` y los controles.

**NO se tocan**:

- `skills/sdd-templates/templates/plan-template.md` — la regla llega al test por `sdd-tdd` (decisión 6 de la spec).
- `skills/sdd-verify/references/*`, `re-review-prompt.md` — la re-revisión no cambia; «achacado a la pasada» lo decide el hilo por las líneas.
- `cli/` — sin código.

### 1.6 Dependencias

`claude` en el `PATH` para los sujetos; `SUPERPOWERS_DIR` en la versión del README.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El saldo de palabras obliga a recortar texto que mide otra batería | media | medio | los controles de cada task; recortes solo de texto del kit que repite el paso |
| El RED de `c7` o `c9` sale limpio | media | bajo | se recorta la regla y se vuelve a pedir la aprobación (spec, decisión 8) |
| `c6` se rompe con la viñeta fundida | media | medio | Review Focus; REFACTOR de la frase del desvío |

### 1.8 Rollout

Directo: entra en la próxima release del kit.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — La línea base en un worktree desanclado

**Tras**: —
**Modelo**: Native, la sesión
**Tests RED**: hilo principal · `w2` en `tests/batteries/sdd-implement/` (escenario y fixtures), lanzado con el texto de las skills sin tocar

**Superficies**: docs (skills) · tooling (batería)
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`; recuento de palabras de `sdd-worktrees/SKILL.md` (≤ 1435) y `sdd-implement/SKILL.md` (≤ 9583); `BATTERY=sdd-implement STEPS="worktree-baseline worktree"` con el veredicto de `w2` y `w1`.

**Interfaces**:
- Consume: nada.
- Produce: nada que usen las demás tasks.

**Ficheros**: modificar `skills/sdd-worktrees/SKILL.md`, `skills/sdd-implement/SKILL.md`, `tests/batteries/sdd-implement/battery.md`, `tests/batteries/sdd-implement/subject.mjs`; crear `tests/batteries/sdd-implement/fixtures/rooms-half.test.js`, `tests/baseline-detached-red.md`, `tests/baseline-detached-green.md`.

- [ ] **Step 1: RED** — `w2`, paso `worktree-baseline`, petición la de `w1`, n = 2 (RED n = 1), Sonnet. Montaje: el de `w1` más `env:clean` en `package-w1.json` (si falta) y, sin commitear, `test/rooms-half.test.js`: un test a medio escribir que falla (importa `listRooms` de `src/app.js`, que no existe). Rúbrica `Wb`: falla si la línea base corre en el árbol del sujeto (el gate se ejecuta con cwd en el worktree de la rama, o su salida incluye `rooms-half`), si no usa `git worktree add --detach … HEAD`, si no corre allí la instalación y `env:setup`, o si al acabar el worktree desanclado sigue en `git worktree list`. Lanzar con el texto sin tocar y escribir `tests/baseline-detached-red.md`.
- [ ] **Step 2: Implementación** — paso 3 de `sdd-worktrees`: la primera frase pasa a «Run the project's closing gate in a detached worktree at `HEAD`, the opening commit (`git worktree add --detach <worktrees parent>/baseline-<id> HEAD`), never in your own tree: your RED tests land there while it runs. Run Step 2 there first, and remove it when done, red or green (`env:clean` first if `env:setup` ran).», seguida de la fuente del gate de hoy; «If tests fail: run the same command in a detached worktree of the integration branch (`git worktree add --detach`, removed when done)» → «If tests fail: run it again in one at the integration branch». «Quick Reference»: «Baseline command», «Gate filters by a base» y «Tests fail during baseline» se funden en una fila «Baseline | Detached worktree at `HEAD`, the closing gate (Step 3)». `sdd-implement` Setup paso 1: «and the baseline with the project's closing gate» → «and the baseline, in a detached worktree at `HEAD`». Fila `Wt` de `w1` como la decisión 5. El texto exacto lo ajusta el recuento: cada fichero ≤ su cifra.
- [ ] **Step 3: Verificación** — la de arriba; GREEN `w2` n = 2 y `w1` n = 1 como control; `tests/baseline-detached-green.md`.
- [ ] **Step 4: Commit de la task**.

### Task 2 — El test afirma el efecto

**Tras**: —
**Modelo**: Native, la sesión
**Tests RED**: hilo principal · `c7` en `tests/batteries/sdd-verify/` y `t6` en `tests/batteries/sdd-implement/`, lanzados con el texto sin tocar

**Superficies**: docs (skills) · tooling (baterías)
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`; recuento de `sdd-tdd/SKILL.md` (≤ 1716), `sdd-verify/SKILL.md` (≤ 3567) y `plan-writing.md` (≤ 896); `BATTERY=sdd-verify STEPS="closing-effect"` y `BATTERY=sdd-implement STEPS="tdd-effect"`.

**Interfaces**:
- Consume: nada.
- Produce: la frase de `sdd-verify` Native que nombra el efecto (la Task 3 edita el mismo apartado: su recuento parte del de esta).

**Ficheros**: modificar `skills/sdd-tdd/SKILL.md`, `skills/sdd-verify/SKILL.md`, `skills/sdd-propose/references/plan-writing.md`, las dos `battery.md` y `subject.mjs`; crear `tests/batteries/sdd-verify/fixtures/app-c7.js`, `review-code-c7.md`, `tests/batteries/sdd-implement/fixtures/` del `t6`, `tests/fix-pass-effect-red.md`.

- [ ] **Step 1: RED** — `c7`, paso `closing-effect`, petición la de `c1`, n = 2, Sonnet. Montaje: el de `c1` con `fixtures/app-c7.js` (`canceladas --desde <fecha>`; sin fecha, `parseArgs` pone `sinceMissing: true` y no imprime nada ni filtra) y `review-code.md` = `review-code-c7.md` con un Important: «`canceladas --desde` sin fecha no filtra nada y no avisa». Rúbrica `C7`: falla si el test que escribe la pasada solo afirma `sinceMissing` (o cualquier valor de `parseArgs`) o un nombre de fichero, en vez de ejecutar `canceladas --desde` y afirmar el aviso impreso o lo listado. `t6`, paso `tdd-effect`, n = 1: encargo de implementador (compuesto como `t1a`) de una task «Pasa `scripts/deploy.sh` a Node; Verificación: sin scripts de bash en `scripts/`», con `scripts/hooks/pre-push` sin extensión y `#!/usr/bin/env bash` en el molde. Rúbrica `T6`: falla si el test de ausencia mira la extensión `.sh` y no la primera línea `#!`. Lanzar los dos con el texto sin tocar y escribir el RED.
- [ ] **Step 2: Implementación** — `sdd-tdd`, «Verify RED»: «Fails because feature missing (not typos)» → «Fails because feature missing (not typos), on the effect the requirement or finding names —what runs, the output, the file it leaves—, not an intermediate flag or a file name». Para el saldo, recortar texto del kit de `sdd-tdd` que repite otra parte (p. ej. el párrafo de «"Other tests" means the task's «Verificación»» condensado). `sdd-verify` Native: «write the test that reproduces the finding» → «write the test that reproduces the finding's effect (`sdd-tdd`, «Verify RED»)». `plan-writing.md` punto 1: «A task whose test only reads what was written doesn't cover «has asked…».» → «A test that reads only what was written, or a flag, doesn't cover the effect (`sdd-tdd`, «Verify RED»).». Si un RED sale limpio: no se escribe su regla y se vuelve a pedir la aprobación de la spec recortada.
- [ ] **Step 3: Verificación** — la de arriba; GREEN `c7` n = 2, `t6` n = 1; controles `c1` y `c1f` n = 1; `tests/fix-pass-effect-green.md` (sección de esta task).
- [ ] **Step 4: Commit de la task**.

### Task 3 — La pasada de fix toma los valores de la spec y no adjudica lo que mete

**Tras**: Task 2
**Modelo**: Native, la sesión
**Tests RED**: hilo principal · `c8` y `c9` en `tests/batteries/sdd-verify/`, lanzados con el texto de la Task 2 (sin la regla de esta)

**Superficies**: docs (skills) · tooling (batería)
**Verificación**: `npx vitest run test/kit/word-budget.test.ts test/kit/skills.test.ts` desde `cli/` → `Tests  N passed (N)`; recuento de `sdd-verify/SKILL.md` (≤ 3567); `BATTERY=sdd-verify STEPS="closing-fixpass closing-value closing closing-deviation"`.

**Interfaces**:
- Consume: el texto de «Closing the review» que deja la Task 2.
- Produce: nada.

**Ficheros**: modificar `skills/sdd-verify/SKILL.md`, `tests/batteries/sdd-verify/battery.md`, `subject.mjs`; crear `fixtures/app-c8.js`, `re-review-c8.md`, `review-spec-c9.md`, y la sección de esta task en `tests/fix-pass-effect-red.md` y `-green.md`.

- [ ] **Step 1: RED** — `c8`, paso `closing-fixpass`, petición la de `c5`, con `validation.mode: field`, n = 1 (GREEN 2). Montaje: la pasada de fix commiteada con `fixtures/app-c8.js` (la pasada recorta el motivo, y un `--motivo "   "` queda vacío y cancela igual; el hallazgo: «la pasada de fix guarda el motivo vacío cuando solo tiene espacios y cancela igual») y `re-review.md` = `re-review-c8.md` con ese Important, que cae en líneas de la pasada, y otro Important en código que vio la revisión final. Rúbrica `C8`: falla si adjudica con `Final: Ruling:` el de la pasada; si no escribe el test que lo reproduce y lo ve fallar; si no lleva a ✋ `sin revisar: <sha> — …`; si despacha otra re-revisión; o si no adjudica el otro Important. `c9`, paso `closing-value`, petición la de `c1f`, n = 2, con `"review": {"minors": "fix"}`: la spec de la 0010 del molde lleva la decisión «el motivo se guarda recortado a 80 caracteres» y `review-spec.md` = `review-spec-c9.md` con un Minor «no dice cuánto se recorta el motivo». Rúbrica `C9`: falla si el arreglo usa un valor distinto de 80. Lanzar con el texto de la Task 2.
- [ ] **Step 2: Implementación** — `sdd-verify`, «In both, the reproduce-before-fixing rule of the fix loop applies.» → «In both, the reproduce-before-fixing rule of the fix loop applies, and a value a fix picks (a sha, a literal, a threshold) comes from the spec's decisions and THENs.». «What it leaves open»: «An Important or a Minor: adjudicate it…» gana «on code the final review saw»; la viñeta del Critical pasa a «**A Critical, or an Important in lines the fix pass changed, is never adjudicated.** Fix it yourself: …» con el resto igual. Para el saldo, recortar texto del kit de `sdd-verify` que repite el paso (p. ej. la fila de racionalización que repite «A re-review never opens another»).
- [ ] **Step 3: Verificación** — la de arriba; GREEN `c8` n = 2 y `c9` n = 2; controles `c5` y `c6` n = 1; sección de la task en `tests/fix-pass-effect-green.md`. Procedencia de las reglas nuevas en las dos `battery.md`.
- [ ] **Step 4: Commit de la task**.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 3 h (tres tasks de texto con campaña, ~24 sujetos en tandas de 3)
- Base de la estimación: 3 tasks; la 0257 (S, 2 skills, 8+8 sujetos) y la 0236; incertidumbre en los moldes nuevos y en el saldo de palabras
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow` ADDED, THEN (worktree desanclado en `HEAD`, dependencias y `env:setup` allí, resultado del commit de apertura) → Task 1, `w2` fila `Wb`. ✓
- AND (se quita al acabar, `env:clean`; la sesión sigue en el suyo) → Task 1, `w2` fila `Wb`. ✓
- AND (roja → repite en la rama de integración) → Task 1, texto del paso 3 sin cambio de conducta; Review Focus. ✓
- `verification` MODIFIED «La revisión se cierra una vez», AND del Important en código ya revisado → Task 3, `c8` (segundo Important). ✓; el resto de cláusulas, sin cambio → `c1`, `c1f`, `c5` como control. ✓
- ADDED «Un Important que mete la pasada de fix no se adjudica», THEN y AND (sin otra re-revisión) → Task 3, `c8`. ✓; AND (lo dice el informe, sin caer en sus líneas) → sin observar: un escenario más no compensa; lo cubre el texto («or the re-review says so» no entra si el saldo no lo permite: entonces la regla es solo por líneas y la spec se enmienda). ⚠
- ADDED «El test de la pasada de fix afirma el efecto del hallazgo», THEN y primer AND → Task 2, `c7`. ✓; AND del test de una task → Task 2, `t6`. ✓
- ADDED «Un valor que elige la pasada de fix sale de la spec» → Task 3, `c9` (Native); SDD → sin observar con sujetos: la frase es la misma («In both»). ⚠
- Tabla «Lo que se retira o cambia de forma» → Tasks 1-3, recuento por fichero y `rg` de las frases viejas tras editar. ✓
- Review Focus → Task 3 `c6`, Task 1 `w2` (`Wb`), Task 3 `c8`. ✓
