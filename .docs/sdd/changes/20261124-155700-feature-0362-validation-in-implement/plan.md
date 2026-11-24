---
id: 20261124-155700-feature-0362-validation-in-implement
feature: 0362
title: Plan de implementación — La validación vuelve al final de sdd-implement
spec: ./spec.md
status: draft
created: 2026-11-24
---

# Plan de implementación — La validación vuelve al final de `sdd-implement`

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: las 8 tasks las hace el hilo en Native, con la sesión en Sonnet effort medium: son ediciones de texto de skills con la frase exacta fijada en el plan. Los sujetos de las baterías van en Sonnet (el modelo de las filas de `battery.md`). La revisión final sale con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: Native, porque las 8 tasks se encadenan por los nombres de ficheros y de escenarios (T1 y T2 producen los ids que T3 y T8 miden), un error lo caza el test de su task o la revisión final, y el plan cabe en un contexto.
3. **Orden RED antes que texto** (Art. I): T1 y T2 escriben los escenarios, T3 los corre contra el texto vigente y solo si exhiben el fallo siguen T4 a T7. Si un escenario pasa con el texto vigente, se para: la guidance que ese escenario mide no se escribe.
4. **`capability merge` lo hace `sdd-archive`, no una task**: el delta de la spec se fusiona en el cierre. T7 solo añade a la spec las enmiendas de redacción que el Scope anunció.
5. **Los topes de palabras se miden al escribir cada skill** (T4 a T6) y T7 los fija en `word-budget.test.ts` con lo medido + 2 %; la spec ya los propone (8450, 2625, 8221, 2781) y el dev-lead los aprobó al aprobarla.
6. **Gate de cierre**: el de `operations.md` §Testing, literal en §3. `kit:test-headless` corre porque cambia `skills/`.
7. **Coste**: ~86 $ de sujetos (tabla de la spec); si T3 o T8 lo superan, se para y decide el dev-lead. Horas: ver «Estimación y esfuerzo».
8. **Riesgos altos**: mover dos referencias de `sdd-archive` a `sdd-implement` rompe enlaces y anclas (T4 y T6 lo comprueban con `skills.test.ts`); la batería de `sdd-archive` entera pide `Validado:` en sus moldes (T2).
9. **Review Focus** resumido: moldes sin `Validado:`, validación diferida, arreglo en «Sin filtro», rojo tras el commit de cierre, enlaces de las referencias movidas.

**Goal**: el final de `sdd-implement` lleva gate, guion recorrido, revisión final y validación del dev-lead; `sdd-archive` solo comprueba que la validación está registrada y cierra.

**Architecture**: la validación (tres modos, guion, bucle de vuelta) pasa de `skills/sdd-archive/` a `skills/sdd-implement/`; `sdd-archive` conserva el cierre y la suite del merge de sincronización. Cada skill editada lleva su batería (Art. I): escenarios nuevos `vf1`…`vf7` y `av1`, `av2`, y los 10 de la validación movidos con id nuevo.

**Tech Stack**: Markdown de skills (inglés), baterías de `tests/batteries/` con `tests/headless/battery.mjs`, Vitest en `cli/test/kit/`, moon (`kit:build`, `kit:own`, `kit:skill-size`, `kit:copies`).

**Spec**: `./spec.md`

**Ejecución**: native, porque 8 tasks encadenadas por los ids de escenario y los nombres de fichero, un error lo caza el test de su task o la revisión final, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, relee este plan y el ledger y sigue con `sdd-implement-subagent` sobre el mismo ledger, sin parar en `delegate`; con una sola task, sigue en Native.

**Eje Arquitectura**: no — solo cambia texto de skills, referencias, baterías y un test; no hay módulo, dependencia ni contrato entre módulos nuevos (las referencias movidas conservan su contenido).

## Restricciones globales

### De código

- Sin comentarios que repitan el código: un comentario existe solo si sin él la línea no se entiende, y lo que se conserva es el porqué no deducible.
- Sin comentarios que citen documentos: un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación; texto humano (mensajes, ayuda) en castellano con tildes.
- Las skills y sus referencias se escriben en inglés (`kit:own` rechaza castellano en `skills/`); antes de editar una skill, carga `sdd-agent-writing`.
- Ningún `SKILL.md` de 20.000 bytes o más; los topes de `cli/test/kit/word-budget.test.ts` solo suben a los valores de la spec: `sdd-archive` 8450 total y 2625 `SKILL.md`, `sdd-implement` 8221 total y 2781 `SKILL.md`; `sdd-implement-native` y `sdd-implement-subagent` no cambian.
- La skill de `sdd-implement` no nombra Playwright, `validation-script` ni ningún proyecto concreto: el cómo se recorre el guion es del proyecto.
- `kit:build` regenera `dist/`; se edita `skills/`, nunca `dist/`.

### De proceso

- Política de modelos: el hilo es el implementador en Native (Sonnet, effort medium); `fable` y `opus xhigh`, prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia su revisión; antes de commitear, `git diff --cached --name-only`.
- Hook de comandos: sin `*` suelto ni tokens `/palabra` en el texto de un comando; los mensajes de commit, con `git commit -F <fichero>` del scratchpad.

## Review Focus

- Un molde de `sdd-archive` sin `Validado:` → devuelve el trabajo a `sdd-implement` sin escribir nada · Task 2, escenario `av1`
- Una validación diferida o sin respuesta del dev-lead → registra `Validación diferida:` y pasa a `sdd-archive`, o espera en `sdd-implement` · Task 1, escenario `vf4`
- Un arreglo del guion que toca un fichero de «Sin filtro» → el gate corre sin filtro · Task 1, escenario `vf6`
- Un rojo de la rama tras el commit de cierre → vuelve a `sdd-implement`, y al volver `sdd-archive` rehace el commit de cierre y repite el sync · Task 2, escenario `av2`
- Las referencias movidas (`validation-modes.md`, `dev-validation.md`) → ningún enlace ni ancla roto en `skills/`, `dist/` ni `tests/` · Tasks 4 y 6, `cli/test/kit/skills.test.ts` y `skills-3x-paths.test.ts`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el cambio mueve y reescribe texto existente; la única pieza nueva es una sección corta de `sdd-implement` y un test pequeño.
- [x] **YAGNI gate**: no se añade herramienta ni configuración nueva; el bucle reutiliza «Running a gate» de `sdd-verify`.
- [x] **Brownfield gate**: retrocompatible con los proyectos (`sdd-kit.json` sin claves nuevas); los enlaces movidos se comprueban.
- [x] **Constitution check**: Art. I (RED antes del texto, previsión de coste, una pieza entra otra sale), Art. III (inglés en skills), Art. XI (ADR nueva, spec y capabilities con su dueño).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/decisions/0043-validation-in-implementation.md` — ADR: la validación es parte de la implementación; sustituye a la 0040 en el disparador de la revisión final.
- `tests/validation-in-implement-red.md`, `tests/validation-in-implement-green.md` y las carpetas `red/` y `green/` de la spec — evidencia de la campaña.
- `cli/test/kit/validation-project-neutral.test.ts` — el test de que `skills/sdd-implement/` no nombra herramientas ni proyectos.

**Modificar**:

- `skills/sdd-implement/SKILL.md` — sección «Validation» y red flag; línea del gate (:58) y enlace de `dev-validation.md` (:54).
- `skills/sdd-implement/references/validation-modes.md` y `dev-validation.md` — movidos desde `skills/sdd-archive/references/` con `git mv`; sus enlaces y «step 1 of `sdd-archive`» se reescriben.
- `skills/sdd-implement/references/patch-flow.md`, `frontend-verification.md` (:38) y `commit-milestones.md` (:11) — el patch valida aquí; nombre del sitio.
- `skills/sdd-implement-native/SKILL.md` (:99, :124, :290, :303) y `skills/sdd-implement-subagent/SKILL.md` (:75, :101) — el pase a `sdd-archive` va tras la validación registrada; los ejes salen tras el gate y el guion.
- `skills/sdd-verify/SKILL.md` («Running a gate», punto 1) y `references/closing-the-review.md` — nombre del sitio.
- `skills/sdd-archive/SKILL.md` (paso 1, pasos 6 y 7, red flags), `references/closing-suite.md`, `final-review-check.md`, `merge-recipe.md:9`.
- `skills/sdd-propose/references/control-profiles.md` (:60, :86, :150) y `skills/sdd-templates/` (`SKILL.md:24`, `templates/validation-template.md:3,11`, `templates/patch-template.md:63`).
- `tests/batteries/sdd-implement/battery.md` y `tests/batteries/sdd-archive/battery.md` con sus moldes; `tests/dev-validation-green.md` (el enlace).
- `cli/test/kit/word-budget.test.ts` — topes de la spec con lo medido.
- `.docs/workflow/greenfield.md:75` y `usage-guide.md:159,182,197`, con su marcador «Última revisión».
- `spec.md` de esta carpeta — enmiendas de redacción de capacidades (Task 7).

**NO se tocan**:

- `.docs/sdd/capabilities/` — el delta lo fusiona `sdd-archive` con `sdd capability merge`, nunca a mano.
- `.docs/sdd/steering/operations.md:115` — registro histórico de la 0236.
- `dist/` — lo genera `kit:build`.
- `skills/sdd-archive/references/e2e-suite.md`, `learnings.md`, `records.md` — no nombran la validación.

### 1.6 Dependencias

Ninguna nueva. T1 y T2 antes que T3; T3 antes que T4 a T7; T8 al final.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un molde de `sdd-archive` sin `Validado:` se devuelve y el escenario deja de medir lo suyo | alta | medio | T2 añade la línea a los moldes y T8 corre `a3 a3r a3a a5` como control |
| El texto movido deja un enlace o ancla rota | media | medio | `skills.test.ts`, `skills-3x-paths.test.ts` y `kit:copies` en la verificación de T4 y T6 |
| Un escenario nuevo pasa con el texto vigente (el RED no exhibe el fallo) | media | alto | T3 para: esa guidance no se escribe |
| Los topes de palabras no caben | media | medio | se miden en T4 a T6 y se mueve la regla a una referencia o se recorta otra |
| El coste de los sujetos supera ~86 $ | media | medio | se declara el número de sujetos antes de lanzar cada tanda y se para si se supera |

### 1.8 Rollout

Directo: skills y baterías del plugin; la release la corta `sdd-end-release`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

Las tasks se ejecutan en orden, sin paralelo; `Tras` dice de cuál depende cada una.

### Task 1 — Batería de `sdd-implement`: escenarios nuevos y movidos

**Tras**: —
**Modelo**: el hilo en Native (Sonnet, effort medium): filas de tabla y rúbricas con los literales de la spec.
**Tests RED**: n/a — la task escribe los escenarios que T3 corre en RED.
**Superficies**: tooling, docs
**Verificación**: `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-implement/battery.md` → `suma: 14 sujetos` y `SCENARIOS="vg1 vg2 vg3 vg4 vv1a vv1b vse1 vt1 vt2 vt3" N=1 node tests/headless/battery.mjs plan tests/batteries/sdd-implement/battery.md` → `suma: 10 sujetos`
**Interfaces**:
- Consume: los ids vigentes de `tests/batteries/sdd-archive/battery.md:90-99` (`g1 g2 g3 g4 v1a v1b se1 t1 t2 t3`) y sus moldes (`reservas-ui`, `reservas-campo`, `reservas-decision`, `reservas-valida-en`, `reservas-conf*`, `reservas-start`, `salas-report`).
- Produce: filas `vf1`…`vf7` (Id, Paso `validation-end`, Petición «Invoca la skill sdd-kit:sdd-implement y sigue. …», Molde, Esperado `sdd-kit:sdd-implement`, n 2, Umbral 2/2, Modelo sonnet, Procedencia «feature 0362 …») y las 10 filas movidas con id `vg1`, `vg2`, `vg3`, `vg4`, `vv1a`, `vv1b`, `vse1`, `vt1`, `vt2`, `vt3` y la procedencia de su fila de origen; sus rúbricas en la sección «Rúbrica».

**Ficheros**: modificar `tests/batteries/sdd-implement/battery.md`; crear moldes `reservas-final*` en `tests/batteries/sdd-implement/fixtures/` solo si ningún molde vigente sirve.

- [ ] **Step 1: Escenarios nuevos** — un escenario por línea de «Dónde se prueba» de la spec: `vf1` orden gate → guion → revisión → dev-lead (se mide por la secuencia de comandos); `vf2` «el paso 3 falla» tras la presentación: task con test que falla antes, y corre el test, el gate con `--base <sha del último verde>`, el paso tocado y la revisión del diff, no el gate entero; `vf3` un paso que falla al recorrer el guion, la vuelta sin revisión propia; `vf4` «lo pruebo mañana en la primera exportación, a cargo del dev-lead»: registra `Validación diferida:` y pasa a `sdd-archive`; `vf5` patch sobre `salas-patch`: gate, guion y dev-lead sin ejes, y su vuelta pasa por el revisor Sonnet de §4; `vf6` un arreglo que toca `package.json`: el gate corre sin filtro; `vf7` fallo de la revisión final: pasada de fix, después gate con `--base` y pasos del guion, sin revisión de vuelta. Cada rúbrica lleva sus C1…Cn con el literal esperado.
- [ ] **Step 2: Escenarios movidos** — copia las 10 filas de la validación con id nuevo (`g1`→`vg1`, `g2`→`vg2`, `g3`→`vg3`, `g4`→`vg4`, `v1a`→`vv1a`, `v1b`→`vv1b`, `se1`→`vse1`, `t1`→`vt1`, `t2`→`vt2`, `t3`→`vt3`), con la petición reescrita para `sdd-implement` («Las tasks de la 0010 están acabadas y su revisión final está limpia: sigue») y la rúbrica adaptada; la procedencia conserva el id viejo.
- [ ] **Step 3: Previsión** — corre los dos comandos de «Verificación» y comprueba las líneas `suma:` esperadas.
- [ ] **Step 4: Commit de la task** — `test(sdd-implement): escenarios de la validación al final de la implementación`, referenciando la 0362.

### Task 2 — Batería de `sdd-archive`: sin validación, con `Validado:` y la reentrada

**Tras**: Task 1
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: n/a — escribe los escenarios `av1` y `av2` que T3 corre en RED.
**Superficies**: tooling, docs
**Verificación**: `SCENARIOS="av1 av2" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-archive/battery.md` → `suma: 4 sujetos` y `SCENARIOS="a3 a3r a3a a5" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-archive/battery.md` → `suma: 8 sujetos`
**Interfaces**:
- Consume: los ids movidos de Task 1 (`vg1`…`vt3`) para retirar sus filas de esta batería.
- Produce: `av1` (molde `reservas` sin `Validado:`, «Invoca la skill sdd-kit:sdd-archive y sigue. La 0010 está implementada y su revisión final está limpia. Ciérrala.»: devuelve el trabajo a `sdd-implement` sin escribir nada), `av2` (molde `reservas-red`, con `Validado:` y commit de cierre hecho, un rojo de la rama tras `sdd merge --sync`: devuelve a `sdd-implement`; al volver rehace el commit de cierre y repite el sync); `a3r` con su C1 cambiado a «devuelve el trabajo a `sdd-implement`»; los moldes de cierre (`reservas*`, `salas*`) con un borrador de `walkthrough.md` que lleva `Validado: 2026-11-24 · «probé reservar y cancelar y funciona»` (en `salas-*`, `patch.md` §4).

**Ficheros**: modificar `tests/batteries/sdd-archive/battery.md`; modificar los moldes de `tests/batteries/sdd-archive/fixtures/` y de `tests/batteries/using-sdd/mold-salas` que usa la batería, salvo el molde de `av1`.

- [ ] **Step 1: Retirar y cambiar** — quita de `battery.md` las filas `g1 g2 g3 g4 v1a v1b se1 t1 t2 t3` y sus rúbricas; cambia el esperado de `a3r` (C1: «el rojo de la rama devuelve el trabajo a `sdd-implement`» en lugar de «arregla con un test que falla primero»).
- [ ] **Step 2: Escenarios nuevos** — escribe `av1` y `av2` como arriba, con su rúbrica (`av1`: C1 dice «falta la validación de la 0010», C2 no escribe ningún registro, C3 no corre el gate; `av2`: C1 no edita código, C2 devuelve a `sdd-implement`, C3 al volver rehace el commit de cierre y repite `sdd merge --sync` con el `--verified-at` del nuevo gate).
- [ ] **Step 3: Moldes** — añade la línea `Validado:` al borrador de walkthrough de cada molde de cierre, salvo el de `av1`; no cambia ninguna otra línea del molde.
- [ ] **Step 4: Previsión** — corre los dos comandos de «Verificación».
- [ ] **Step 5: Commit de la task** — `test(sdd-archive): escenarios del cierre con la validación ya registrada`.

### Task 3 — RED: los escenarios nuevos exhiben el fallo con el texto vigente

**Tras**: Task 2
**Modelo**: el hilo en Native (Sonnet, effort medium); sujetos en Sonnet.
**Tests RED**: la propia campaña: `vf1`…`vf7` y `av1`, `av2`, con el texto vigente de las skills.
**Superficies**: docs, tooling
**Verificación**: `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-implement/battery.md` y `SCENARIOS="av1 av2" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-archive/battery.md` → cada escenario con sus C1…Cn evaluados en `tests/validation-in-implement-red.md`; el RED vale si cada escenario falla por la rúbrica esperada
**Interfaces**:
- Consume: los escenarios de Task 1 y 2 y la sección «Lanzamiento» de `operations.md` §Cómo se testean las skills (`RUNS_DIR` corto en `.temp/`, copia limpia del kit).
- Produce: `tests/validation-in-implement-red.md` con una fila por escenario (veredicto por criterio) y la carpeta `red/` de la spec con el molde, los ficheros de cada sujeto y el `git status` de cada run.

**Ficheros**: crear `tests/validation-in-implement-red.md` y `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/red/`.

- [ ] **Step 1: Declarar la tanda** — antes de lanzar, escribe en el ledger los sujetos (18) y el coste previsto (~12,8 $) de la spec; con un coste que lo supere, para y pregunta.
- [ ] **Step 2: Lanzar** — corre los dos comandos de «Verificación» con `RUNS_DIR` en `.temp/` del worktree; guarda la salida completa en el scratchpad antes de filtrarla.
- [ ] **Step 3: Leer** — evalúa cada criterio con la rúbrica de su escenario; un escenario cuyo texto vigente ya cumple la rúbrica se para: esa guidance no se escribe y se dice al dev-lead.
- [ ] **Step 4: Evidencia y commit** — escribe `tests/validation-in-implement-red.md` y versiona `red/`; commit `test: RED de la validación al final de sdd-implement`.

### Task 4 — `sdd-implement`: el final lleva la validación

**Tras**: Task 3
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: los escenarios `vf1`…`vf7` de Task 1, en RED desde Task 3.
**Superficies**: docs
**Verificación**: `moon run kit:build` y, desde `cli/`, `pnpm exec vitest run test/kit/skills.test.ts test/kit/skills-3x-paths.test.ts test/kit/skill-size.test.ts test/kit/validation-project-neutral.test.ts` → `Tests  N passed (N)`; los dos primeros ficheros no se pierden por enlaces rotos de las referencias movidas
**Interfaces**:
- Consume: «Running a gate» de `sdd-verify` y la sección «When the axes return» de `sdd-implement` (no cambian).
- Produce: en `skills/sdd-implement/SKILL.md`, la sección `## Validation` y el red flag «You're about to invoke `sdd-archive` without the validation recorded»; en `skills/sdd-implement/references/`, `validation-modes.md` y `dev-validation.md` con sus enlaces corregidos.

**Ficheros**: modificar `skills/sdd-implement/SKILL.md`, `references/patch-flow.md`, `references/frontend-verification.md`, `references/commit-milestones.md`; mover `skills/sdd-archive/references/validation-modes.md` y `dev-validation.md` a `skills/sdd-implement/references/`.

- [ ] **Step 1: Mover** — `git mv skills/sdd-archive/references/validation-modes.md skills/sdd-implement/references/validation-modes.md` y lo mismo con `dev-validation.md`; en `validation-modes.md` cambia el enlace `closing-suite.md#in-the-validation` por `../../sdd-archive/references/closing-suite.md#what-runs`, «Step 1 of `sdd-archive`» por «The end of `sdd-implement`», y conserva las marcas `<!-- kit: incluye … -->`; en `dev-validation.md`, «(step 1 of `sdd-archive`)» por «(the end of `sdd-implement`)».
- [ ] **Step 2: La sección** — añade a `skills/sdd-implement/SKILL.md`, entre «After the last task» y «Red flags», `## Validation` con estas frases: «After the last task, in this order, and `sdd-archive` is not invoked until the validation is recorded: 1. the closing gate, once (the project's, filtered by what the branch affects, whole only with a file of «Sin filtro»); 2. you walk the dev's script step by step, as the person will, and fix what fails in a task with its test (how the project walks it is the project's); 3. the final review of the axes, on what is already validated, as «When the axes return» says; 4. the dev's validation, per its mode: first thing, read [validation-modes.md](references/validation-modes.md); 5. the record in the draft walkthrough (in a patch, `patch.md` §4), and then `sdd-archive`. A failure of 2, 3 or 4 goes back to a task with its test and each turn runs only what the fix touches: the tests that failed or are born, the gate with `--base <sha of the last green>`, the script steps it touches and, if the turn comes after the final review, one review of its diff by `sdd-kit:effort-high` + `sonnet`. With a validation deferred or unanswered, record `Validación diferida:` and go on, or wait.»
- [ ] **Step 3: Frases que cambian** — en `SKILL.md` línea del gate: «runs at the baseline of `sdd-worktrees` and once, at the end of the tasks (see Validation), never inside a task»; el enlace de `dev-validation.md` pasa a `references/dev-validation.md`; «When the axes return» pasa a empezar «After the gate and the script»; en `patch-flow.md`, el final del patch sigue gate, guion y dev-lead (sin ejes) y registra en §4; en `frontend-verification.md:38`, «the validation of `sdd-archive`» pasa a «the validation at the end of `sdd-implement`»; en `commit-milestones.md:11`, los arreglos de la validación ya están en el hito de su task.
- [ ] **Step 4: Red flag** — añade a la tabla y a la lista de `SKILL.md` el red flag y su excusa («The user is away, close and ask later» → «A validation not recorded sends the work back here»).
- [ ] **Step 5: Test de neutralidad** — crea `cli/test/kit/validation-project-neutral.test.ts` con `it('does not name project tools in sdd-implement')`: lee `skills/sdd-implement/**/*.md` y `expect(text).not.toMatch(/playwright|validation-script|document-manager/i)` salvo en `references/frontend-verification.md`, que ya nombra Playwright y se excluye por nombre.
- [ ] **Step 6: Build y verificación** — corre `moon run kit:build` y los tests de «Verificación»; mide con el conteo del test las palabras de `sdd-implement` y anótalas en el ledger; sobre el tope de la spec (8221 total, 2781 `SKILL.md`), mueve la regla a una referencia.
- [ ] **Step 7: Commit de la task** — `feat(sdd-implement): la validación pasa al final de la implementación`.

### Task 5 — Métodos Native y SDD: el pase a `sdd-archive` y el disparador de los ejes

**Tras**: Task 4
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: los escenarios `vf1` y `vf7`.
**Superficies**: docs
**Verificación**: `moon run kit:build` y, desde `cli/`, `pnpm exec vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` → `Tests  N passed (N)`; `sdd-implement-native` ≤ 3038 y `sdd-implement-subagent` ≤ 8462 palabras
**Interfaces**:
- Consume: la sección `## Validation` de Task 4.
- Produce: en `sdd-implement-native/SKILL.md:303`, «Then, with the validation recorded as `sdd-implement`'s Validation says, invoke `sdd-archive` with `Skill`.»; las etiquetas del diagrama de las dos skills pasan de `sdd-archive (validation)` a `sdd-archive`, y su flecha parte de «Validation recorded»; el disparador de los ejes dice «after the closing gate and the script are green on that sha».

**Ficheros**: modificar `skills/sdd-implement-native/SKILL.md` y `skills/sdd-implement-subagent/SKILL.md`.

- [ ] **Step 1: Native** — cambia las líneas 99, 124, 290 y 303 como en «Produce» y, donde dice que los ejes salen con el commit de la última task, añade «once the closing gate and the script are green on it».
- [ ] **Step 2: SDD** — cambia las líneas 75 y 101 del diagrama y el mismo disparador.
- [ ] **Step 3: Verificación** — `kit:build` y los tests; cuenta palabras y deja `sdd-implement-native` y `-subagent` en su tope.
- [ ] **Step 4: Commit de la task** — `feat(sdd-implement): los ejes salen tras el gate y el guion`.

### Task 6 — `sdd-archive` y los textos que nombran la validación

**Tras**: Task 5
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: los escenarios `av1`, `av2` y el esperado de `a3r`.
**Superficies**: docs
**Verificación**: `moon run kit:build kit:own kit:skill-size kit:copies` → sin errores y, desde `cli/`, `pnpm exec vitest run test/kit/skills.test.ts test/kit/skills-3x-paths.test.ts test/kit/word-budget.test.ts` → `Tests  N passed (N)`; `sdd-archive` ≤ 8450 total y ≤ 2625 `SKILL.md`
**Interfaces**:
- Consume: los nombres de Task 4 (`validation-modes.md`, `dev-validation.md` en `sdd-implement/references/`).
- Produce: el paso 1 de `sdd-archive` («Validation recorded») y los textos de las demás skills con «the end of `sdd-implement`».

**Ficheros**: modificar `skills/sdd-archive/SKILL.md`, `references/closing-suite.md`, `references/final-review-check.md`, `references/merge-recipe.md`; `skills/sdd-verify/SKILL.md` y `references/closing-the-review.md`; `skills/sdd-propose/references/control-profiles.md`; `skills/sdd-templates/SKILL.md`, `templates/validation-template.md`, `templates/patch-template.md`.

- [ ] **Step 1: Paso 1** — sustituye el paso 1 «Validation» por: «1. **Validation recorded** — before touching anything: the draft walkthrough (in a patch, `patch.md` §4) carries `Validado:`, `Validación diferida:`, `Validación en campo:` or `Validación por el agente:`. Without one, say «falta la validación de la `<id>`», write nothing and send the work back to `sdd-implement`: the validation, its fixes and the final review are its. Nothing in the close fixes code: a red that is the branch's goes back there too.»; en el paso 0.6, «write nothing until that review is back and closed» pasa a «if it isn't back and closed, send the work back to `sdd-implement`»; borra los textos del modo `field`, `agente` y `manual` que ya viven en `validation-modes.md`.
- [ ] **Step 2: Pasos 6 y 7, red flags** — en el paso 6, «The suite on the sync merge» y «A red suite» dicen que un rojo de la rama devuelve el trabajo a `sdd-implement`; en los red flags, «You're about to merge without step 1's record» pasa a «without the validation recorded».
- [ ] **Step 3: `closing-suite.md`** — borra «In the validation», renombra «What runs» con el ancla `#what-runs` y quita «In `manual`, 1-2 run before the script»; «After the sync merge» pierde «No suite yet» y «the validation's suite» pasa a «the closing gate of the end of the tasks»; el 4.1 del walkthrough cita el sha de ese gate.
- [ ] **Step 4: Referencias** — `final-review-check.md`: si falta una re-revisión, devuelve a `sdd-implement`; `merge-recipe.md:9`, «the validation's suite» pasa a «the closing gate»; `sdd-verify` «Running a gate» punto 1 dice «At the end of the tasks and in the close»; `closing-the-review.md:33` y `sdd-propose/references/control-profiles.md` (:60 «Validation (end of implementation of feature and patch)», :86, :150) y `sdd-templates` (`SKILL.md:24`, `validation-template.md:3,11`, `patch-template.md:63`) cambian «`sdd-archive`» por «`sdd-implement`» donde nombran quién presenta la validación.
- [ ] **Step 5: Build y verificación** — `moon run kit:build kit:own kit:skill-size kit:copies` y los tests de «Verificación»; mide palabras de `sdd-archive`; sobre el tope, recorta antes de seguir.
- [ ] **Step 6: Commit de la task** — `refactor(sdd-archive): el cierre comprueba la validación y no la hace`.

### Task 7 — ADR, topes, docs del flujo y enmiendas de redacción

**Tras**: Task 6
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: n/a — documentos y topes; los comprueban `decision check`, `word-budget.test.ts` y `workflow-docs.test.ts`.
**Superficies**: docs, tooling
**Verificación**: `node dist/cli/bin/sdd.js decision check --path .docs/sdd` → exit 0 y, desde `cli/`, `pnpm exec vitest run test/kit/word-budget.test.ts test/kit/workflow-docs.test.ts test/kit/decision-routes.test.ts` → `Tests  N passed (N)`
**Interfaces**:
- Consume: lo medido en T4 a T6 y el texto de «Topes de palabras» de la spec.
- Produce: la ADR `0043-validation-in-implementation.md` (status `accepted`, `rutas`: `skills/sdd-implement/**`, `skills/sdd-archive/**`), los topes en `word-budget.test.ts` y las líneas de «Enmiendas» de la spec.

**Ficheros**: crear `.docs/sdd/decisions/0043-validation-in-implementation.md`; modificar `cli/test/kit/word-budget.test.ts`, `.docs/workflow/greenfield.md`, `.docs/workflow/usage-guide.md`, `tests/dev-validation-green.md` y `spec.md`.

- [ ] **Step 1: ADR** — calca `adr-template.md`: contexto (la decisión 5 de la 0149 y `64a86577c` llevaron la validación al cierre; 10,8 ediciones de código por sesión tras la revisión final), opciones (A, B y C de la spec), decisión (la validación es parte de la implementación y sus arreglos no son del cierre), consecuencias, y `### Confirmación` con la orden que la comprueba (`git grep -n "step 1 of .sdd-archive" -- skills` sin resultados). Declara en el cuerpo que sustituye a la 0040 solo en el disparador de la revisión final; el `status` de la 0040 no cambia, porque la sustituye en un punto y no entera.
- [ ] **Step 2: Topes** — en `word-budget.test.ts` pon `sdd-archive: { skillMd: 2625, total: 8450 }` y `sdd-implement: { skillMd: 2781, total: 8221 }`; si lo medido en T4 a T6 es menor, baja el tope a lo medido + 2 % (mínimo 20 palabras).
- [ ] **Step 3: Docs del flujo** — en `greenfield.md:75` y `usage-guide.md:159,182,197`, la validación se presenta al terminar la implementación, antes de cerrar con `sdd-archive`; sube el marcador «Última revisión: kit vX.Y.Z» a la versión de `plugin.json`.
- [ ] **Step 4: Enlace y enmiendas** — en `tests/dev-validation-green.md:3`, la ruta pasa a `skills/sdd-implement/references/dev-validation.md`; en la spec, línea de «Enmiendas»: «2026-11-24 — los requisitos de `closing-suite` («El walkthrough dice de dónde sale cada THEN», «La suite E2E del cierre…») y de `control-profiles` que dicen «el cierre» o «la validación» para el gate o el cierre se alinean con `MODIFIED` de redacción — lo anunció el Scope — aplica literal una decisión tomada con el dev-lead», y añade esos `MODIFIED` al delta copiando entero cada requisito vigente con solo esos cambios.
- [ ] **Step 5: Verificación y commit** — corre `capability merge` sobre una copia de `.docs/sdd` para comprobar que el delta enmendado fusiona, y los comandos de «Verificación»; commit `docs(sdd): ADR 0043, topes y docs del flujo de la validación`.

### Task 8 — GREEN, REFACTOR y controles

**Tras**: Task 7
**Modelo**: el hilo en Native (Sonnet, effort medium); sujetos en Sonnet.
**Tests RED**: los de T3, ahora en GREEN.
**Superficies**: docs, tooling
**Verificación**: `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-implement/battery.md`, `SCENARIOS="av1 av2" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-archive/battery.md`, `SCENARIOS="vg1 vg2 vg3 vg4 vv1a vv1b vse1 vt1 vt2 vt3" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-implement/battery.md` y los controles `SCENARIOS="h1 h2 g1 a1" N=2` (`sdd-implement`) y `SCENARIOS="a3 a3r a3a a5" N=2` (`sdd-archive`) → cada escenario con su umbral; los de `vf*` y `av*` en 2/2
**Interfaces**:
- Consume: el texto final de T4 a T7 y la previsión de coste de la spec.
- Produce: `tests/validation-in-implement-green.md`, la carpeta `green/` de la spec y, si un escenario no llega a su umbral, una tanda de REFACTOR (un cambio de texto y una nueva ronda de los escenarios que fallaron).

**Ficheros**: crear `tests/validation-in-implement-green.md` y `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/green/`; modificar las skills solo para un REFACTOR.

- [ ] **Step 1: Declarar la tanda** — escribe en el ledger los sujetos (28 + 16 de controles) y su coste previsto; con un coste que supere ~86 $ en total, para y pregunta al dev-lead.
- [ ] **Step 2: Correr GREEN y controles** — lanza los comandos de «Verificación» y guarda cada salida entera antes de filtrar.
- [ ] **Step 3: Leer y decidir** — un escenario por debajo de su umbral abre una única tanda de REFACTOR con un contraejemplo medido; un control (`a3 a3r a3a a5`, `h1 h2 g1 a1`) que cae vuelve a su texto.
- [ ] **Step 4: Evidencia y commit** — escribe `tests/validation-in-implement-green.md`, versiona `green/`; commit `test: GREEN de la validación al final de sdd-implement`.

---

## Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec + plan: 2,5 h
- Estimación de implementación: 3 h (rango 2,5–4,5 h: la guidance se estima condicionada al RED y las campañas corren en paralelo)
- Estimación de revisión: 0,5 h
- Estimación de cierre: 0,5 h
- Base de la estimación: 8 tasks, casi todas de texto; el reloj es el de redactar y las campañas (T3 y T8) corren sujetos en segundo plano; sin referencia en el log para una feature que toca 9 capacidades
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de éxito de la spec (§Intent): en la batería, un sujeto de feature corre gate, guion, revisión y validación antes de `sdd-archive`; un fallo vuelve a una task y corre solo el gate con `--base`; `sdd-archive` no arregla código
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- `implementation` «El gate de cierre se ejecuta una vez» (THEN y los cuatro AND: una vez al acabar las tasks, no en la task, filtrado salvo «Sin filtro», tras el sync solo lo que cruza) → Task 4 (sección Validation) y Task 6 (`closing-suite.md`); `vf1`, `vf6`. ✓
- `implementation` «El final de `sdd-implement` valida antes de pasar al cierre» (THEN orden, AND no invoca `sdd-archive`, AND paso del guion que falla, AND diferida o `unattended`, AND el kit fija el orden y no nombra herramienta, AND el registro) → Task 4; `vf1`, `vf3`, `vf4` y `validation-project-neutral.test.ts`. ✓
- `implementation` «Un fallo de la validación vuelve a una task…» (task con test, qué corre, no el gate entero, «Sin filtro», fallo de la revisión final, revisión solo posterior a la revisión final, anterior sin revisión propia, tras la vuelta) → Task 4; `vf2`, `vf3`, `vf6`, `vf7`. ✓
- `implementation` «Un patch sigue en `sdd-implement`…» y «La implementación la lleva `sdd-implement`» → Task 4 (`patch-flow.md`) y Task 5; `vf5`, `vf1`. ✓
- `feature-flow` (cuatro `MODIFIED`: validar antes de cerrar, decisión sola, entorno parado, base al día) → Tasks 4 y 6 (textos de `validation-modes.md`, `dev-validation.md`, `validation-template.md`); `vv1a`, `vse1`, `vg3`, `vt1`. ✓
- `archive` (cierre arranca con la validación registrada y no arregla código; rojo tras el commit de cierre; «Un rojo ajeno…»; reglas `Dónde viven los datos`, `Límites` y `Avisos`) → Task 6; `av1`, `av2`, `a3r`. ✓
- `closing-suite` (REMOVED «Con otra rama abierta…», `MODIFIED` del sync, del gate entero, del rojo y de «Camino crítico») → Task 6 (`closing-suite.md`); controles `a3`, `a3a`, `a5`. ✓
- `verification` (REMOVED y ADDED del disparador, `MODIFIED` de «Una re-revisión nunca abre otra», «El cierre no repite la revisión final», «La revisión se cierra una vez», «El kit no invoca las skills de superpowers…») → Tasks 5 y 6 (`final-review-check.md`, skills de método); `vf7`, `av1`. ✓
- `control-profiles`, `closing-merge`, `frontend-verification` y `routing` (`MODIFIED` de redacción) → Task 6 y T7 (enmiendas); sin escenario propio: la lectura del texto y `skills.test.ts` los comprueban (avisado en «Dónde se prueba»). ⚠
- Tabla «Lo que se retira o cambia de forma»: paso 1 de `sdd-archive`, las dos referencias, «In the validation», «el gate… en la validación final», «su primer paso es la validación», «In the validation and the close», el patch que valida en el cierre, «El trabajo se valida…», los sitios de `closing-suite.md:7,31-37`, `commit-milestones.md:11`, `sdd-templates`, `control-profiles.md:86,150`, el ancla, `tests/dev-validation-green.md`, los moldes → Tasks 4 a 7 y `git grep` en la verificación de T6: `git grep -nE "step 1 of .sdd-archive|first step is the validation|sdd-archive \(validation\)" -- skills` sin resultados. ✓
- Escenarios movidos y nuevos, moldes con `Validado:` → Tasks 1 y 2; RED en 3 y GREEN en 8. ✓
- Topes de palabras y ADR → Task 7. ✓
- Review Focus: molde sin `Validado:` → `av1`; diferida → `vf4`; «Sin filtro» → `vf6`; rojo tras el cierre → `av2`; enlaces movidos → `skills.test.ts`. ✓
- Sin cambios (hotfix y spike, decisión 17) → N/A (confirmado en spec; pendiente del dev-lead). ✓
