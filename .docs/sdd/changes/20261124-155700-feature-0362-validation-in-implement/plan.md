---
id: 20261124-155700-feature-0362-validation-in-implement
feature: 0362
title: Plan de implementación — La validación vuelve al final de sdd-implement
spec: ./spec.md
status: approved
created: 2026-11-24
---

# Plan de implementación — La validación vuelve al final de `sdd-implement`

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: las 8 tasks las hace el hilo en Native, con la sesión en Sonnet effort medium: son ediciones de texto de skills con la frase exacta fijada en el plan. Los sujetos de las baterías van en Sonnet (el modelo de las filas de `battery.md`). La revisión final sale con sus ejes: Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet`.
2. **Ejecución**: Native, porque las 8 tasks se encadenan por los nombres de ficheros y de escenarios (T1 y T2 producen los ids que T3 y T8 miden), un error lo caza el test de su task o la revisión final, y el plan cabe en un contexto.
3. **Orden RED antes que texto** (Art. I): T1 y T2 escriben los escenarios, T3 los corre contra el texto vigente y solo si exhiben el fallo siguen T4 a T7. Si un escenario pasa con el texto vigente, se para: la guidance que ese escenario mide no se escribe.
4. **`capability merge` lo hace `sdd-archive`, no una task**: el delta de la spec se fusiona en el cierre. T7 solo añade a la spec las enmiendas de redacción que el Scope anunció.
5. **Los topes de palabras se miden al escribir cada skill** (T4 a T6) y T7 los fija en `word-budget.test.ts` con lo medido + 2 %; la spec ya los propone (`sdd-validate` 1735 y 655; `sdd-archive` 8450 y 2625) y el dev-lead los aprobó al aprobarla.
6. **Gate de cierre**: el de `operations.md` §Testing, literal en §3. `kit:test-headless` corre porque cambia `skills/`.
7. **Coste**: ~86 $ de sujetos (tabla de la spec); si T3 o T8 lo superan, se para y decide el dev-lead. Horas: ver «Estimación y esfuerzo».
8. **Riesgos altos**: mover dos referencias de `sdd-archive` a `sdd-validate` rompe enlaces y anclas, y copiar los moldes de la validación a la batería nueva puede dejar uno sin su fixture (T1) (T4 y T6 lo comprueban con `skills.test.ts`); la batería de `sdd-archive` entera pide `Validado:` en sus moldes (T2).
9. **Review Focus** resumido: moldes sin `Validado:`, validación diferida, arreglo en «Sin filtro», rojo tras el commit de cierre, enlaces de las referencias movidas.

**Goal**: la skill nueva `sdd-validate` lleva gate, guion recorrido, revisión final y validación del dev-lead; `sdd-archive` solo comprueba que la validación está registrada y cierra.

**Architecture**: la validación (tres modos, guion, bucle de vuelta) pasa de `skills/sdd-archive/` a `skills/sdd-validate/`, que `sdd-implement` invoca al acabar la última task; `sdd-archive` conserva el cierre y la suite del merge de sincronización. Cada skill editada lleva su batería (Art. I): escenarios nuevos `vf1`…`vf7` y `av1`, `av2`, en la batería nueva de `sdd-validate`, `av1` y `av2` en la de `sdd-archive`, y los 10 de la validación movidos a la nueva con su id.

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
- Ningún `SKILL.md` de 20.000 bytes o más; los topes de `cli/test/kit/word-budget.test.ts` solo suben a los valores de la spec: `sdd-archive` 8450 total y 2625 `SKILL.md`, `sdd-validate` 1735 total y 655 `SKILL.md`; `sdd-implement`, `sdd-implement-native` y `sdd-implement-subagent` no cambian.
- La skill `sdd-validate` y sus referencias no nombran Playwright, `validation-script` ni ningún proyecto concreto: el cómo se recorre el guion es del proyecto.
- `kit:build` regenera `dist/`; se edita `skills/`, nunca `dist/`.

### De proceso

- Política de modelos: el hilo es el implementador en Native (Sonnet, effort medium); `fable` y `opus xhigh`, prohibidos.
- Commits: tipo/scope en inglés, título y cuerpo en castellano; uno por task al quedar limpia su revisión; antes de commitear, `git diff --cached --name-only`.
- Hook de comandos: sin `*` suelto ni tokens `/palabra` en el texto de un comando; los mensajes de commit, con `git commit -F <fichero>` del scratchpad.

## Review Focus

- Un molde de `sdd-archive` sin `Validado:` → devuelve el trabajo a `sdd-validate` sin escribir nada · Task 2, escenario `av1`
- Una validación diferida o sin respuesta del dev-lead → registra `Validación diferida:` y pasa a `sdd-archive`, o espera en `sdd-validate` · Task 1, escenario `vf4`
- Un arreglo del guion que toca un fichero de «Sin filtro» → el gate corre sin filtro · Task 1, escenario `vf6`
- Un rojo de la rama tras el commit de cierre → vuelve a `sdd-implement`, y al volver `sdd-archive` rehace el commit de cierre y repite el sync · Task 2, escenario `av2`
- Las referencias movidas (`validation-modes.md`, `dev-validation.md`) → ningún enlace ni ancla roto en `skills/`, `dist/` ni `tests/` · Tasks 4 y 6, `cli/test/kit/skills.test.ts` y `skills-3x-paths.test.ts`

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el cambio mueve y reescribe texto existente; la única pieza nueva es una skill corta, `sdd-validate`, y un test pequeño.
- [x] **YAGNI gate**: no se añade herramienta ni configuración nueva; el bucle reutiliza «Running a gate» de `sdd-verify`.
- [x] **Brownfield gate**: retrocompatible con los proyectos (`sdd-kit.json` sin claves nuevas); los enlaces movidos se comprueban.
- [x] **Constitution check**: Art. I (RED antes del texto, previsión de coste, una pieza entra otra sale), Art. III (inglés en skills), Art. XI (ADR nueva, spec y capabilities con su dueño).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-validate/SKILL.md` — la skill nueva: gate, guion recorrido, revisión final, validación del dev-lead y bucle de vuelta a `sdd-implement`.
- `tests/batteries/sdd-validate/` — su batería (`battery.md`, `subject.mjs`, `fixtures/`), con los escenarios nuevos y los 10 movidos desde `sdd-archive`.
- `.docs/sdd/decisions/0043-validation-in-implementation.md` — ADR: la validación es parte de la implementación; sustituye a la 0040 en el disparador de la revisión final.
- `tests/validation-in-implement-red.md`, `tests/validation-in-implement-green.md` y las carpetas `red/` y `green/` de la spec — evidencia de la campaña.
- `cli/test/kit/validation-project-neutral.test.ts` — el test de que `skills/sdd-validate/` no nombra herramientas ni proyectos.

**Modificar**:

- `skills/sdd-implement/SKILL.md` — «After the last task» solo invoca `sdd-validate`; línea del gate (:58) y enlace de `dev-validation.md` (:54).
- `skills/sdd-validate/references/validation-modes.md` y `dev-validation.md` — movidos desde `skills/sdd-archive/references/` con `git mv`; sus enlaces y «step 1 of `sdd-archive`» se reescriben.
- `skills/sdd-implement/references/patch-flow.md`, `frontend-verification.md` (:38) y `commit-milestones.md` (:11) — el patch valida en `sdd-validate`; nombre del sitio.
- `skills/sdd-implement-native/SKILL.md` (:99, :124, :290, :303) y `skills/sdd-implement-subagent/SKILL.md` (:75, :101) — el pase a `sdd-archive` va tras la validación registrada; los ejes salen tras el gate y el guion.
- `skills/sdd-verify/SKILL.md` («Running a gate», punto 1) y `references/closing-the-review.md` — nombre del sitio.
- `skills/sdd-archive/SKILL.md` (paso 1, pasos 6 y 7, red flags), `references/closing-suite.md`, `final-review-check.md`, `merge-recipe.md:9`.
- `skills/sdd-propose/references/control-profiles.md` (:60, :86, :150) y `skills/sdd-templates/` (`SKILL.md:24`, `templates/validation-template.md:3,11`, `templates/patch-template.md:63`).
- `tests/batteries/sdd-validate/battery.md` y `tests/batteries/sdd-archive/battery.md` con sus moldes; `tests/dev-validation-green.md` (el enlace).
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

### Task 1 — Batería nueva de `sdd-validate`: escenarios, moldes y los que se mueven

**Tras**: —
**Modelo**: el hilo en Native (Sonnet, effort medium): copia de moldes y filas de tabla con los literales de la spec.
**Tests RED**: n/a — la task escribe los escenarios que T3 corre en RED.
**Superficies**: tooling, docs
**Verificación**: `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-validate/battery.md` → `suma: 14 sujetos` y `SCENARIOS="g1 g2 g3 g4 v1a v1b se1 t1 t2 t3" N=1 node tests/headless/battery.mjs plan tests/batteries/sdd-validate/battery.md` → `suma: 10 sujetos`
**Interfaces**:
- Consume: las filas `g1 g2 g3 g4 v1a v1b se1 t1 t2 t3` de `tests/batteries/sdd-archive/battery.md:90-99` y sus moldes de `tests/batteries/sdd-archive/subject.mjs` (`moldReservas`, `done0010`, `done0008`, `report0008`, `doneConfig0020`, `manualValidation`, `e2eSuite`, `startEnv`, y los moldes por nombre `reservas-ui`, `reservas-campo`, `reservas-decision`, `reservas-valida-en`, `reservas-e2e-manual`, `reservas-config-manual`, `reservas-config-agent`, `reservas-start`, `reservas-start-down`, `salas-report`, `salas-patch`); las fixtures de `tests/batteries/sdd-implement/fixtures/` que ya usa la de `sdd-archive`.
- Produce: `tests/batteries/sdd-validate/` con `battery.md` (cabecera y columnas como la de `sdd-archive`), `subject.mjs` (el montaje y solo los moldes de arriba) y `fixtures/` si hacen falta; las 10 filas movidas con su id y su procedencia, la petición reescrita para `sdd-validate` y su rúbrica; y las filas nuevas `vf1`…`vf7` (Paso `validation`, Petición «Invoca la skill sdd-kit:sdd-validate y sigue. …», Molde, Esperado `sdd-kit:sdd-validate`, n 2, Umbral 2/2, Modelo sonnet, Procedencia «feature 0362 …»).

**Ficheros**: crear `tests/batteries/sdd-validate/battery.md`, `tests/batteries/sdd-validate/subject.mjs`; copiar los moldes sin cambiarlos, salvo su nombre de fichero de salida.

- [ ] **Step 1: Esqueleto** — crea `tests/batteries/sdd-validate/` con `battery.md` (cabecera, «Montaje por escenario», «Escenarios», «Rúbrica», «Procedencia de las reglas») y `subject.mjs` calcando las líneas 1-130 de `tests/batteries/sdd-archive/subject.mjs` (constantes, `moldReservas`, `open0010`, `done0010`, `manualValidation`); `BATTERY=sdd-validate` es su nombre.
- [ ] **Step 2: Escenarios movidos** — copia al `battery.md` nuevo las 10 filas `g1 g2 g3 g4 v1a v1b se1 t1 t2 t3` con su id, su molde y su procedencia, la petición reescrita («Invoca la skill sdd-kit:sdd-validate y sigue. Las tasks de la 0010 están acabadas y su revisión final está limpia: sigue.») y la rúbrica adaptada; copia a `subject.mjs` los moldes de «Consume» que usan, y nada más.
- [ ] **Step 3: Escenarios nuevos** — un escenario por línea de «Dónde se prueba» de la spec: `vf1` orden gate → guion → revisión → dev-lead (se mide por la secuencia de comandos); `vf2` «el paso 3 falla» tras la presentación: devuelve el control a `sdd-implement`, task con test que falla antes, y corre el test, el gate con `--base <sha del último verde>`, el paso tocado y la revisión del diff, no el gate entero; `vf3` un paso que falla al recorrer el guion, la vuelta sin revisión propia; `vf4` «lo pruebo mañana en la primera exportación, a cargo del dev-lead»: registra `Validación diferida:` y pasa a `sdd-archive`; `vf5` patch sobre `salas-patch`: gate, guion y dev-lead sin ejes, y su vuelta pasa por el revisor Sonnet de §4; `vf6` un arreglo que toca `package.json`: el gate corre sin filtro; `vf7` fallo de la revisión final: pasada de fix, después gate con `--base` y pasos del guion, sin revisión de vuelta. Cada rúbrica lleva sus C1…Cn con el literal esperado.
- [ ] **Step 4: Previsión** — corre los dos comandos de «Verificación» y comprueba las líneas `suma:` esperadas.
- [ ] **Step 5: Commit de la task** — `test(sdd-validate): batería nueva de la validación con los escenarios movidos`, referenciando la 0362.

### Task 2 — Batería de `sdd-archive`: sin validación, con `Validado:` y la reentrada

**Tras**: Task 1
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: n/a — escribe los escenarios `av1` y `av2` que T3 corre en RED.
**Superficies**: tooling, docs
**Verificación**: `SCENARIOS="av1 av2" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-archive/battery.md` → `suma: 4 sujetos` y `SCENARIOS="a3 a3r a3a a5" N=2 node tests/headless/battery.mjs plan tests/batteries/sdd-archive/battery.md` → `suma: 8 sujetos`
**Interfaces**:
- Consume: los ids movidos de Task 1 (`g1`…`t3`) para retirar sus filas de esta batería.
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
**Verificación**: `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` y `SCENARIOS="av1 av2" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-archive/battery.md` → cada escenario con sus C1…Cn evaluados en `tests/validation-in-implement-red.md`; el RED vale si cada escenario falla por la rúbrica esperada
**Interfaces**:
- Consume: los escenarios de Task 1 y 2 y la sección «Lanzamiento» de `operations.md` §Cómo se testean las skills (`RUNS_DIR` corto en `.temp/`, copia limpia del kit).
- Produce: `tests/validation-in-implement-red.md` con una fila por escenario (veredicto por criterio) y la carpeta `red/` de la spec con el molde, los ficheros de cada sujeto y el `git status` de cada run.

**Ficheros**: crear `tests/validation-in-implement-red.md` y `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/red/`.

- [ ] **Step 1: Declarar la tanda** — antes de lanzar, escribe en el ledger los sujetos (18) y el coste previsto (~12,8 $) de la spec; con un coste que lo supere, para y pregunta.
- [ ] **Step 2: Lanzar** — corre los dos comandos de «Verificación» con `RUNS_DIR` en `.temp/` del worktree; guarda la salida completa en el scratchpad antes de filtrarla.
- [ ] **Step 3: Leer** — evalúa cada criterio con la rúbrica de su escenario; un escenario cuyo texto vigente ya cumple la rúbrica se para: esa guidance no se escribe y se dice al dev-lead.
- [ ] **Step 4: Evidencia y commit** — escribe `tests/validation-in-implement-red.md` y versiona `red/`; commit `test: RED de la validación al final de sdd-implement`.

### Task 4 — `sdd-validate`: la skill nueva

**Tras**: Task 3
**Modelo**: el hilo en Native (Sonnet, effort medium); antes de escribir la skill, carga `sdd-agent-writing`.
**Tests RED**: los escenarios `vf1`…`vf7` de Task 1, en RED desde Task 3.
**Superficies**: docs
**Verificación**: `moon run kit:build` y, desde `cli/`, `pnpm exec vitest run test/kit/skills.test.ts test/kit/skills-3x-paths.test.ts test/kit/skill-size.test.ts test/kit/validation-project-neutral.test.ts` → `Tests  N passed (N)`; los dos primeros no se pierden por enlaces rotos de las referencias movidas
**Interfaces**:
- Consume: «Running a gate» de `sdd-verify` y la sección «When the axes return» de `sdd-implement` (no cambian); la sección de Approach de la spec («El orden de `sdd-validate`», «El bucle de vuelta»).
- Produce: `skills/sdd-validate/SKILL.md` (frontmatter `name: sdd-validate`, `description: Use when sdd-implement has finished its last task …`) con el orden, el bucle, el registro y los red flags, y `skills/sdd-validate/references/validation-modes.md` y `dev-validation.md` con sus enlaces corregidos.

**Ficheros**: crear `skills/sdd-validate/SKILL.md` y `cli/test/kit/validation-project-neutral.test.ts`; mover `skills/sdd-archive/references/validation-modes.md` y `dev-validation.md` a `skills/sdd-validate/references/`; modificar `skills/sdd-implement/references/patch-flow.md`, `frontend-verification.md` y `commit-milestones.md`; modificar `cli/test/kit/word-budget.test.ts` (entrada nueva).

- [ ] **Step 1: Mover** — `git mv skills/sdd-archive/references/validation-modes.md skills/sdd-validate/references/validation-modes.md` y lo mismo con `dev-validation.md`; en `validation-modes.md` cambia el enlace `closing-suite.md#in-the-validation` por `../../sdd-archive/references/closing-suite.md#what-runs`, «Step 1 of `sdd-archive`» por «`sdd-validate`», y conserva las marcas `<!-- kit: incluye … -->`; en `dev-validation.md`, «(step 1 of `sdd-archive`)» por «(`sdd-validate`)».
- [ ] **Step 2: La skill** — `skills/sdd-validate/SKILL.md` en inglés, con descripción «Use when sdd-implement has finished its last task, or a patch its fix, to run the gate, walk the dev's script, run the final review and take the dev's validation before the close; not the entry of a change (that is sdd-propose), and not the final review's evidence rules (that is sdd-verify)». El cuerpo: «After the last task, in this order, and `sdd-archive` is not invoked until the validation is recorded: 1. the closing gate, once (the project's, filtered by what the branch affects, whole only with a file of «Sin filtro»); 2. you walk the dev's script step by step, as the person will (how the project walks it is the project's); 3. the final review of the axes, on what is already validated: invoke `sdd-verify` with `Skill` and follow its «Closing the review»; 4. the dev's validation, per its mode: first thing, read [validation-modes.md](references/validation-modes.md); 5. the record in the draft walkthrough (in a patch, `patch.md` §4), and then `sdd-archive`. A failure of 2, 3 or 4 goes back to `sdd-implement` as a new task at the end of the plan with its test (RED → GREEN), and then back here; each turn runs only what the fix touches: the tests that failed or are born, the gate with `--base <sha of the last green>`, the script steps it touches and, if the turn comes after the final review, one review of its diff by `sdd-kit:effort-high` + `sonnet`. With a validation deferred or unanswered, record `Validación diferida:` and go on, or wait.» Más los «Closing drafts» y la vigilancia de silencio que hoy están en «After the last task» de `sdd-implement` y un red flag con su excusa («The user is away, close and ask later» → «A validation not recorded sends the work back here»). `sdd-implement` conserva «After the last task» solo para invocarla (Task 5).
- [ ] **Step 3: Frases que cambian** — en `patch-flow.md`, el final del patch invoca `sdd-validate` (gate, guion y dev-lead, sin ejes) y registra en §4; en `frontend-verification.md:38`, «the validation of `sdd-archive`» pasa a «the validation of `sdd-validate`»; en `commit-milestones.md:11`, los arreglos de la validación ya están en el hito de su task.
- [ ] **Step 4: Test de neutralidad** — crea `cli/test/kit/validation-project-neutral.test.ts` con `it('does not name project tools in sdd-validate')`: lee `skills/sdd-validate/**/*.md` y `expect(text).not.toMatch(/playwright|validation-script/i)`.
- [ ] **Step 5: Tope** — en `word-budget.test.ts` añade `'sdd-validate': { skillMd: 655, total: 1735 }`; mide con el conteo del test las palabras y, sobre el tope de la spec, mueve la regla a una referencia.
- [ ] **Step 6: Build y verificación** — corre `moon run kit:build` y los tests de «Verificación».
- [ ] **Step 7: Commit de la task** — `feat(sdd-validate): la validación pasa a una skill propia`.

### Task 5 — `sdd-implement` y sus métodos: el pase a `sdd-validate`

**Tras**: Task 4
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: los humos `h1` y `h2` de la batería de `sdd-implement` (su rúbrica pasa a «invoca `sdd-validate`»), y `vf1`.
**Superficies**: docs
**Verificación**: `moon run kit:build` y, desde `cli/`, `pnpm exec vitest run test/kit/skills.test.ts test/kit/word-budget.test.ts` → `Tests  N passed (N)`; `sdd-implement` ≤ 6626 y `sdd-implement-native` ≤ 3038 y `-subagent` ≤ 8462 palabras
**Interfaces**:
- Consume: el nombre `sdd-validate` y su descripción de Task 4.
- Produce: en `sdd-implement/SKILL.md`, «After the last task» abre con «Invoke `sdd-validate` with `Skill`: the gate, the script, the final review and the dev's validation are its; a failure comes back here as a task»; en `sdd-implement-native/SKILL.md:303`, «Then invoke `sdd-validate` with `Skill`.»; las etiquetas del diagrama de las dos skills pasan de `sdd-archive (validation)` a `sdd-validate`.

**Ficheros**: modificar `skills/sdd-implement/SKILL.md`, `skills/sdd-implement-native/SKILL.md` (:99, :124, :290, :303), `skills/sdd-implement-subagent/SKILL.md` (:75, :101) y la rúbrica de `h1`/`h2` en `tests/batteries/sdd-validate/battery.md`.

- [ ] **Step 1: `sdd-implement`** — «After the last task» deja solo la invocación de arriba (los «Closing drafts», la vigilancia de silencio y «When the axes return» pasaron a `sdd-validate`); la línea del gate (:58) dice «runs at the baseline of `sdd-worktrees` and once, in `sdd-validate`, never inside a task»; el enlace de `dev-validation.md` (:54) apunta a `../sdd-validate/references/dev-validation.md`.
- [ ] **Step 2: Native y SDD** — cambia las líneas nombradas en «Produce»; en las dos skills, el final de la última task pasa a `sdd-validate`.
- [ ] **Step 3: Rúbrica** — en `h1` y `h2` de `battery.md`, el criterio de la invocación siguiente pasa de `sdd-archive` a `sdd-validate`.
- [ ] **Step 4: Verificación** — `kit:build` y los tests; cuenta palabras y deja las tres skills en su tope.
- [ ] **Step 5: Commit de la task** — `feat(sdd-implement): al acabar la última task invoca sdd-validate`.

### Task 6 — `sdd-archive` y los textos que nombran la validación

**Tras**: Task 5
**Modelo**: el hilo en Native (Sonnet, effort medium).
**Tests RED**: los escenarios `av1`, `av2` y el esperado de `a3r`.
**Superficies**: docs
**Verificación**: `moon run kit:build kit:own kit:skill-size kit:copies` → sin errores y, desde `cli/`, `pnpm exec vitest run test/kit/skills.test.ts test/kit/skills-3x-paths.test.ts test/kit/word-budget.test.ts` → `Tests  N passed (N)`; `sdd-archive` ≤ 8450 total y ≤ 2625 `SKILL.md`
**Interfaces**:
- Consume: los nombres de Task 4 (`validation-modes.md`, `dev-validation.md` en `sdd-validate/references/`).
- Produce: el paso 1 de `sdd-archive` («Validation recorded») y los textos de las demás skills con «`sdd-validate`».

**Ficheros**: modificar `skills/sdd-archive/SKILL.md`, `references/closing-suite.md`, `references/final-review-check.md`, `references/merge-recipe.md`; `skills/sdd-verify/SKILL.md` y `references/closing-the-review.md`; `skills/sdd-propose/references/control-profiles.md`; `skills/sdd-templates/SKILL.md`, `templates/validation-template.md`, `templates/patch-template.md`.

- [ ] **Step 1: Paso 1** — sustituye el paso 1 «Validation» por: «1. **Validation recorded** — before touching anything: the draft walkthrough (in a patch, `patch.md` §4) carries `Validado:`, `Validación diferida:`, `Validación en campo:` or `Validación por el agente:`. Without one, say «falta la validación de la `<id>`», write nothing and send the work back to `sdd-implement`: the validation, its fixes and the final review are its. Nothing in the close fixes code: a red that is the branch's goes back there too.»; en el paso 0.6, «write nothing until that review is back and closed» pasa a «if it isn't back and closed, send the work back to `sdd-implement`»; borra los textos del modo `field`, `agente` y `manual` que ya viven en `validation-modes.md`, y deja para un hotfix o un spike, que no pasan por `sdd-validate`, la rama de hoy del paso 1 (smoke y mensaje de `../../sdd-validate/references/validation-modes.md`, sin bucle).
- [ ] **Step 2: Pasos 6 y 7, red flags** — en el paso 6, «The suite on the sync merge» y «A red suite» dicen que un rojo de la rama devuelve el trabajo a `sdd-implement`; en los red flags, «You're about to merge without step 1's record» pasa a «without the validation recorded».
- [ ] **Step 3: `closing-suite.md`** — borra «In the validation», renombra «What runs» con el ancla `#what-runs` y quita «In `manual`, 1-2 run before the script»; «After the sync merge» pierde «No suite yet» y «the validation's suite» pasa a «the closing gate of the end of the tasks»; el 4.1 del walkthrough cita el sha de ese gate.
- [ ] **Step 4: Referencias** — `final-review-check.md`: si falta una re-revisión, devuelve a `sdd-validate`; `merge-recipe.md:9`, «the validation's suite» pasa a «the closing gate»; `sdd-verify` «Running a gate» punto 1 dice «At the end of the tasks and in the close»; `closing-the-review.md:33` y `sdd-propose/references/control-profiles.md` (:60 «Validation (end of implementation of feature and patch)», :86, :150) y `sdd-templates` (`SKILL.md:24`, `validation-template.md:3,11`, `patch-template.md:63`) cambian «`sdd-archive`» por «`sdd-validate`» donde nombran quién presenta la validación.
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
- Produce: la ADR `0043-validation-in-implementation.md` (status `accepted`, `rutas`: `skills/sdd-validate/**`, `skills/sdd-implement/**`, `skills/sdd-archive/**`), los topes en `word-budget.test.ts` y las líneas de «Enmiendas» de la spec.

**Ficheros**: crear `.docs/sdd/decisions/0043-validation-in-implementation.md`; modificar `cli/test/kit/word-budget.test.ts`, `.docs/workflow/greenfield.md`, `.docs/workflow/usage-guide.md`, `tests/dev-validation-green.md` y `spec.md`.

- [ ] **Step 1: ADR** — calca `adr-template.md`: contexto (la decisión 5 de la 0149 y `64a86577c` llevaron la validación al cierre; 10,8 ediciones de código por sesión tras la revisión final), opciones (A, B y C de la spec), decisión (la validación es parte de la implementación y sus arreglos no son del cierre), consecuencias, y `### Confirmación` con la orden que la comprueba (`git grep -n "step 1 of .sdd-archive" -- skills` sin resultados). Declara en el cuerpo que sustituye a la 0040 solo en el disparador de la revisión final; el `status` de la 0040 no cambia, porque la sustituye en un punto y no entera.
- [ ] **Step 2: Topes** — en `word-budget.test.ts` pon `sdd-archive: { skillMd: 2625, total: 8450 }` y comprueba que la entrada `sdd-validate: { skillMd: 655, total: 1735 }` de T4 sigue vigente; si lo medido en T4 a T6 es menor, baja el tope a lo medido + 2 % (mínimo 20 palabras).
- [ ] **Step 3: Docs del flujo y recuento** — en `README.md:3`, `PRODUCT.md:16` (con `sdd-validate` en su lista) y `CLAUDE.md:22`, «28 skills» pasa a «29 skills»; en `greenfield.md:75` y `usage-guide.md:159,182,197`, la validación se presenta al terminar la implementación, antes de cerrar con `sdd-archive`; sube el marcador «Última revisión: kit vX.Y.Z» a la versión de `plugin.json`.
- [ ] **Step 4: Enlace y enmiendas** — en `tests/dev-validation-green.md:3`, la ruta pasa a `skills/sdd-validate/references/dev-validation.md`; en la spec, línea de «Enmiendas»: «2026-11-24 — los requisitos de `closing-suite` («El walkthrough dice de dónde sale cada THEN», «La suite E2E del cierre…») y de `control-profiles` que dicen «el cierre» o «la validación» para el gate o el cierre se alinean con `MODIFIED` de redacción — lo anunció el Scope — aplica literal una decisión tomada con el dev-lead», y añade esos `MODIFIED` al delta copiando entero cada requisito vigente con solo esos cambios.
- [ ] **Step 5: Verificación y commit** — corre `capability merge` sobre una copia de `.docs/sdd` para comprobar que el delta enmendado fusiona, y los comandos de «Verificación»; commit `docs(sdd): ADR 0043, topes y docs del flujo de la validación`.

### Task 8 — GREEN, REFACTOR y controles

**Tras**: Task 7
**Modelo**: el hilo en Native (Sonnet, effort medium); sujetos en Sonnet.
**Tests RED**: los de T3, ahora en GREEN.
**Superficies**: docs, tooling
**Verificación**: `SCENARIOS="vf1 vf2 vf3 vf4 vf5 vf6 vf7" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md`, `SCENARIOS="av1 av2" N=2 node tests/headless/battery.mjs run tests/batteries/sdd-archive/battery.md`, `SCENARIOS="g1 g2 g3 g4 v1a v1b se1 t1 t2 t3" N=1 node tests/headless/battery.mjs run tests/batteries/sdd-validate/battery.md` y los controles `SCENARIOS="h1 h2 g1 a1" N=2` (`sdd-implement`) y `SCENARIOS="a3 a3r a3a a5" N=2` (`sdd-archive`) → cada escenario con su umbral; los de `vf*` y `av*` en 2/2
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

- `implementation` «El gate de cierre se ejecuta una vez» (THEN y los cuatro AND: una vez al acabar las tasks, no en la task, filtrado salvo «Sin filtro», tras el sync solo lo que cruza) → Task 4 (la skill nueva) y Task 6 (`closing-suite.md`); `vf1`, `vf6`. ✓
- `validation` «`sdd-validate` valida antes de pasar al cierre» (THEN orden, AND no invoca `sdd-archive`, AND paso del guion que falla, AND diferida o `unattended`, AND el kit fija el orden y no nombra herramienta, AND el registro) → Task 4; `vf1`, `vf3`, `vf4` y `validation-project-neutral.test.ts`. ✓
- `validation` «Un fallo de la validación vuelve a una task…» (task con test, qué corre, no el gate entero, «Sin filtro», fallo de la revisión final, revisión solo posterior a la revisión final, anterior sin revisión propia, tras la vuelta) → Task 4; `vf2`, `vf3`, `vf6`, `vf7`. ✓
- `implementation` «Un patch sigue en `sdd-implement`…» y «La implementación la lleva `sdd-implement`» → Task 4 (`patch-flow.md`) y Task 5 (la invocación de `sdd-validate`); `vf5`, `vf1`, `h1`, `h2`. ✓
- `feature-flow` (cuatro `MODIFIED`: validar antes de cerrar, decisión sola, entorno parado, base al día) → Tasks 4 y 6 (textos de `validation-modes.md`, `dev-validation.md`, `validation-template.md`); `v1a`, `se1`, `g3`, `t1`. ✓
- `archive` (cierre arranca con la validación registrada y no arregla código; rojo tras el commit de cierre; «Un rojo ajeno…»; reglas `Dónde viven los datos`, `Límites` y `Avisos`) → Task 6; `av1`, `av2`, `a3r`. ✓
- `closing-suite` (REMOVED «Con otra rama abierta…», `MODIFIED` del sync, del gate entero, del rojo y de «Camino crítico») → Task 6 (`closing-suite.md`); controles `a3`, `a3a`, `a5`. ✓
- `verification` (REMOVED y ADDED del disparador, `MODIFIED` de «Una re-revisión nunca abre otra», «El cierre no repite la revisión final», «La revisión se cierra una vez», «El kit no invoca las skills de superpowers…») → Tasks 5 y 6 (`final-review-check.md`, skills de método); `vf7`, `av1`. ✓
- `control-profiles`, `closing-merge`, `frontend-verification` y `routing` (`MODIFIED` de redacción) → Task 6 y T7 (enmiendas); sin escenario propio: la lectura del texto y `skills.test.ts` los comprueban (avisado en «Dónde se prueba»). ⚠
- Tabla «Lo que se retira o cambia de forma»: paso 1 de `sdd-archive`, las dos referencias, «In the validation», «el gate… en la validación final», «su primer paso es la validación», «In the validation and the close», el patch que valida en el cierre, «El trabajo se valida…», los sitios de `closing-suite.md:7,31-37`, `commit-milestones.md:11`, `sdd-templates`, `control-profiles.md:86,150`, el ancla, `tests/dev-validation-green.md`, los moldes → Tasks 4 a 7 y `git grep` en la verificación de T6: `git grep -nE "step 1 of .sdd-archive|first step is the validation|sdd-archive \(validation\)" -- skills` sin resultados. ✓
- Escenarios movidos y nuevos, moldes con `Validado:` → Tasks 1 y 2; RED en 3 y GREEN en 8. ✓
- Topes de palabras y ADR → Task 7. ✓
- Review Focus: molde sin `Validado:` → `av1`; diferida → `vf4`; «Sin filtro» → `vf6`; rojo tras el cierre → `av2`; enlaces movidos → `skills.test.ts`. ✓
- Sin cambios (hotfix y spike, decisión 17) → N/A (confirmado en spec; pendiente del dev-lead). ✓
