---
id: 20260924-105352-task-0057-native-adapt
task: 0057
title: Plan de implementación — Adaptar el kit a Native
spec: ./spec.md
status: approved
created: 2026-09-24
---

# Plan de implementación — Adaptar el kit a Native

## Decisiones que he tomado yo — valida estas

1. **Ejecución: Native**, lo que recomienda el handoff. Las Tasks 1 a 4 editan los mismos ficheros (`sdd-start-task/SKILL.md` en las cuatro), así que van en serie y cada una consume el texto de la anterior. Son cortas, y un error cuesta poco: lo ven la revisión final y el GREEN. El plan no es tan largo como para compactar a mitad. Además, esta task es la validación en uso de la 0055.
2. **Modelo**: la sesión (Opus 5.5) implementa, sin subagentes. El revisor final va con `sdd-kit:effort-high` + `model: opus`, la regla que esta task escribe. La Task 5 lanza sujetos Sonnet headless, como el RED.
3. **Tests RED**: `tests/NativeAdapt.Tests.ps1`, un bloque `Describe` por task. El hilo escribe el de cada task al empezarla, aparta una copia en el scratchpad y la compara antes del commit de la task, que es la regla que se escribe aquí.
4. **Ledger**: el de `executing-plans` (`task-start` y `task-done` con `bash`, rutas con `cygpath -w`), más `tasks.md` como registro vivo.
5. **Coste estimado**: ~1,5 h de implementación y ~1 h de GREEN (15 sujetos, ~12 $, dentro del techo común de 65 $). Un revisor final Opus, ~150k tokens.
6. **Cobertura escenario → task**: cada escenario de la spec tiene su task (§4). Comprobado. Perfil `delegate`: sin gate del plan.

**Goal**: una task Native conserva lo que el kit exige en SDD (base, RED comparados, revisión final con techo y effort, historia de commits) con las piezas de `executing-plans`, y el plan dice cuándo pasar a SDD tras compactar.

**Architecture**: cambios de texto en las fuentes únicas. El bucle Native y la comprobación del tipo van al paso 6; la historia de commits, a `commit-milestones.md` y a los pasos 5 y 6; el revisor final, al Art. IV y a `encargo-revision.md`; el cierre, a los pasos 1 y 9 de `sdd-end-task`; el cambio de método, a la cabecera de `plan-template.md` y al paso 5, porque tras compactar solo se relee el plan. Un test Pester fija cada texto, y la campaña GREEN mide la conducta.

**Tech Stack**: Markdown de skills, PowerShell 7 + Pester 5 (`tests/`), sujetos `claude -p` con Sonnet.

**Spec**: `./spec.md`

**Ejecución**: native, porque las cuatro tasks de texto tocan en serie los mismos ficheros y un error lo ven la revisión final y el GREEN. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de skill y de fichero en inglés kebab-case (Art. III).
- Valores literales de la spec: revisor final `subagent_type: sdd-kit:effort-high` + `model: opus`; frase de respaldo «effort: no disponible en este harness, hereda el de la sesión»; umbral del cambio de método «dos o más tasks»; frase de la cabecera «Si retomas este plan tras una compactación y quedan dos o más tasks, sigue con subagent-driven-development sobre el mismo ledger.».
- Art. X (calidad de código), literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- En el texto de una skill no se citan tasks, tickets ni specs de este repo como justificación nueva: el porqué se escribe en llano, y la medición se cita por su fichero de `tests/`.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho; `fable` y `opus xhigh` prohibidos.
- Ejecución: Native (`superpowers:executing-plans`); no se toca el paso 2 de `sdd-start-task` ni los ficheros de la 0059.
- Commits: tipo/scope en inglés, cuerpo en castellano, con el trailer de atribución de la sesión; un commit por task (`commit-milestones.md`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada regla va a la fuente que ya existe; solo se crean el test y la evidencia.
- [x] **YAGNI gate**: sin controlador anidado, sin contador de tasks; la señal es la compactación.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 5), Art. IV (techo del revisor final), Art. VIII (se toca la plantilla canónica), Art. IX (se adopta `executing-plans` y se añade lo que el RED muestra).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/NativeAdapt.Tests.ps1` — fija los textos de las Tasks 1 a 4.
- `tests/native-adapt-green.md` — evidencia GREEN.

**Modificar**:

- `skills/sdd-start-task/SKILL.md` — pasos 5 y 6.
- `skills/sdd-start-task/references/overrides-superpowers.md` — filas de `executing-plans` y de las rutas en Windows.
- `skills/sdd-start-task/references/commit-milestones.md` — fila «Task N», receta, «Tests RED sin commitear».
- `skills/sdd-start-task/references/encargo-revision.md` — «Rutas del workspace en Windows» y «Revisor final».
- `skills/sdd-end-task/SKILL.md` — pasos 1 y 9.
- `skills/sdd-templates/templates/plan-template.md` — línea `Ejecución`.
- `.docs/sdd/constitution.md` — Art. IV.
- `.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/subject.sh` y `mold.sh` — escenarios del GREEN.

**NO se tocan**:

- El paso 2 de `sdd-start-task`, `nombrado.md`, `Get-NextSddId.ps1`, `sdd-start-patch` y `sdd-start-release`: son de la 0059.
- `control-profiles.md`: la regla del cambio de método vive en el plan y en overrides; la capacidad se fusiona en el cierre.
- `.docs/sdd/capabilities/*`: el delta se fusiona en el cierre (`sdd-end-task`).

### 1.6 Dependencias

superpowers 6.4.1 (`executing-plans` con `task-start` y `task-done`). Molde `salas` de la 0044 y lanzador común de `red/`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Tras la compactación simulada, el sujeto lee la frase del plan y sigue en Native | media | medio | Si falla 2/2, una tanda de REFACTOR; si sigue fallando, el frente se cierra como deuda medida (decisión 1 de la spec) |
| El párrafo Native alarga un paso 6 ya largo y un sujeto no lo lee | baja | medio | Va justo tras la primera línea del paso, que enruta por método |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Bucle Native en el paso 6: ledger, base antes de cada task, RED apartados y rutas en Windows

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/NativeAdapt.Tests.ps1`, bloque `Describe 'Task 1 — bucle Native'`; Native: TDD del propio hilo, con copia apartada
**Superficies**: docs · tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/NativeAdapt.Tests.ps1,tests/NativeDefault.Tests.ps1,tests/SuperpowersCompat.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: nada.
- Produce: el párrafo que empieza por «**En Native**» en el paso 6, que la Task 3 amplía con la comprobación del tipo.

**Ficheros**: modificar `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-task/references/overrides-superpowers.md`, `skills/sdd-start-task/references/encargo-revision.md`.

- [ ] **Step 1: RED** — escribe el bloque con estos `It`, apártalo y míralo fallar:
  - el paso 6 tiene un párrafo que empieza por `**En Native**` y nombra `scripts/task-start` y `scripts/task-done`;
  - ese párrafo dice «Antes de empezar **cada** task»;
  - dice «guarda una copia fuera del repo» y «`git diff --no-index`»;
  - dice el orden «comparar los RED, el commit de la task y `task-done`»;
  - la fila de Windows de overrides nombra `task-start` de `executing-plans`, y la sección de Windows de `encargo-revision.md`, también.
- [ ] **Step 2: párrafo Native** — en `skills/sdd-start-task/SKILL.md`, justo tras la primera línea del paso 6 («… `superpowers:executing-plans` (Native) o `superpowers:subagent-driven-development`. En modo lite, sin plan: el valor de `execution` si está fijado; con `auto`, Native.»), un párrafo nuevo con sangría de tres espacios:

  > **En Native** ejecutas tú cada task con `executing-plans` y su ledger: ábrela con su `scripts/task-start` y ciérrala con `scripts/task-done` y el comando de su «Verificación», los dos con `bash <ruta>`. `tasks.md` no sustituye al ledger: tras una compactación es el ledger lo que dice qué está hecho. Antes de empezar **cada** task, no solo la primera, haz la comprobación de la base que se describe abajo para el despacho. Al empezarla, escribe los tests de sus THEN antes del código y guarda una copia fuera del repo; antes del commit de la task, compárala con `git diff --no-index`, y un cambio que no sea de formato es un ruling del ledger: el mismo agente escribe el test y el código, y la copia es lo único que prueba que el test no se ajustó al código. El cierre de la task va en este orden: comparar los RED, el commit de la task y `task-done`, que apunta en el ledger el `HEAD` del momento. Medido en `tests/native-adapt-red.md`: sin este párrafo, 2 de 2 sujetos llevaron el registro solo en `tasks.md`, comprobaron la base una sola vez y no apartaron los RED.
- [ ] **Step 3: Windows** — en `overrides-superpowers.md`, la primera celda de la fila de Windows pasa a «`sdd-workspace` y `task-brief` de `subagent-driven-development`, y `task-start` de `executing-plans`, en Windows: imprimen la ruta de Git Bash (`/tmp/claude/…`, `/d/code/…`)». En `encargo-revision.md`, «Rutas del workspace en Windows», «En Windows, `sdd-workspace`, `task-brief` y `review-package` imprimen…» pasa a «En Windows, `sdd-workspace`, `task-brief`, `task-start` y `review-package` imprimen…».
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 5: Commit de la task** — compara el RED con su copia; `docs(skills): el paso 6 en Native lleva el ledger, la base por task y los RED apartados`; después `task-done`.

### Task 2 — Historia de commits: el hilo escribe el mensaje del hito y la apertura va antes de los RED

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/NativeAdapt.Tests.ps1`, bloque `Describe 'Task 2 — historia de commits'`; Native: TDD del propio hilo, con copia apartada
**Superficies**: docs · tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/NativeAdapt.Tests.ps1,tests/CommitMilestones.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: el párrafo «**En Native**» de la Task 1 (su «commit de la task»).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-start-task/references/commit-milestones.md`, `skills/sdd-start-task/SKILL.md`.

- [ ] **Step 1: RED** — `It`s:
  - la receta dice «también con un solo commit» y ya no dice «Con un solo commit en `<base>..HEAD` no hay nada que juntar»;
  - la fila «Task N» de la tabla nombra Native y `task-done`;
  - «Tests RED sin commitear» dice «antes de escribir los RED» y «apártalo»;
  - el paso 5 dice «Antes de escribir los RED de la primera task»;
  - el paso 6 dice «con el mensaje que escribes tú, también si el rango tiene un solo commit».
- [ ] **Step 2: tabla** — en `commit-milestones.md`, la fila `| Task N | … |` pasa a: `| Task N | sus tests RED, su implementación, los arreglos de su revisión, su evidencia | con su revisión (y re-revisión) limpia, antes de despachar la siguiente o la revisión final; en Native, con su contrato de cierre cumplido y antes de \`task-done\` | el \`BASE\` que apuntaste antes de despacharla (en Native, el que imprime \`task-start\`) |`.
- [ ] **Step 3: receta** — sustituye «Con un solo commit en `<base>..HEAD` no hay nada que juntar. Nunca `rebase -i`, `push --force` ni `--no-verify`.» por: «La receta vale también con un solo commit en el rango: el mensaje del hito lo escribes tú con la convención del proyecto, nunca se hereda del implementador, porque el paquete de la revisión de task muestra el asunto y no el cuerpo. Medido en `tests/native-adapt-red.md`: con «un solo commit, nada que juntar», 2 de 2 sujetos dejaron en la rama un cuerpo sin tildes. Nunca `rebase -i`, `push --force` ni `--no-verify`.»
- [ ] **Step 4: RED sin commitear** — al final de «Tests RED sin commitear», un párrafo: «La apertura se junta antes de escribir los RED de la primera task, y cada hito, antes de los de la task siguiente. Si con un RED en el árbol tienes que commitear otra cosa (un ruling, un fix del hilo, un merge de sincronización), apártalo antes —la copia ya está fuera del repo—, commitea y devuélvelo: un `pre-commit` que corre la suite también ve los ficheros sin seguimiento. En el RED, 1 de 2 sujetos escribió el RED con la apertura sin juntar (`tests/native-adapt-red.md`).»
- [ ] **Step 5: pasos 5 y 6** — en el paso 5, «Antes del primer despacho, junta la apertura en un commit» pasa a «Antes de escribir los RED de la primera task, junta la apertura en un commit». En el paso 6, «Cuando la revisión de una task queda limpia, junta su rango en un commit antes de despachar la siguiente» pasa a «Cuando la revisión de una task queda limpia, junta su rango en un commit, con el mensaje que escribes tú, también si el rango tiene un solo commit, antes de despachar la siguiente».
- [ ] **Step 6: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 7: Commit de la task** — compara el RED; `docs(skills): el hilo escribe el mensaje de cada hito y junta la apertura antes de los RED`; después `task-done`.

### Task 3 — Revisor final con techo y effort, tipo comprobado antes del primer despacho y cierre sin revisión duplicada

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/NativeAdapt.Tests.ps1`, bloque `Describe 'Task 3 — revisión final y cierre'`; Native: TDD del propio hilo, con copia apartada
**Superficies**: docs · tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/NativeAdapt.Tests.ps1,tests/Skills.Tests.ps1,tests/AgentDefinitions.Tests.ps1,tests/CommitMilestones.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: el párrafo «**En Native**» de la Task 1.
- Produce: nada.

**Ficheros**: modificar `.docs/sdd/constitution.md`, `skills/sdd-start-task/references/encargo-revision.md`, `skills/sdd-start-task/SKILL.md`, `skills/sdd-end-task/SKILL.md`.

- [ ] **Step 1: RED** — `It`s:
  - el Art. IV dice «va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto»;
  - «Revisor final» de `encargo-revision.md` dice `subagent_type: sdd-kit:effort-high` + `model: opus`;
  - el paso 6 dice «Antes del primer despacho de la task» y la frase de respaldo literal;
  - el paso 9 de `sdd-end-task` dice «No lances otra» y ya no dice «solo si la task se ejecutó **en línea**»;
  - el paso 1 de `sdd-end-task` nombra `executing-plans` y «Deferred minors».
- [ ] **Step 2: Art. IV** — en `.docs/sdd/constitution.md`, tras «`fable` y `opus xhigh` siguen prohibidos por defecto, con justificación escrita en la task.», añade: «El revisor final de rama de una ejecución Native, que `executing-plans` pide en «the most capable available model», va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto.»
- [ ] **Step 3: encargo del revisor final** — en `encargo-revision.md`, al principio de «## Revisor final», antes de «Tras la cabecera y antes de `code-reviewer.md`:», un párrafo: «Se despacha con `subagent_type: sdd-kit:effort-high` + `model: opus`, también en Native, donde `executing-plans` pide «the most capable available model»: es el techo del kit. Sin esta frase, 2 de 2 sujetos en Native lo despacharon con el modelo de los subagentes del plan y sin effort (`tests/native-adapt-red.md`).»
- [ ] **Step 4: tipo antes del primer despacho** — en `skills/sdd-start-task/SKILL.md`, al final del párrafo «**En Native**» de la Task 1, y como frase para los dos métodos: «Antes del primer despacho de la task —el implementador en SDD, el revisor final en Native— comprueba que el tipo `sdd-kit:effort-<nivel>` está entre los agentes de la sesión. Si falta, dilo antes de despachar, despacha con el `model` y la frase de respaldo «effort: no disponible en este harness, hereda el de la sesión», y regístralo como ruling. El revisor final de Native lleva el despacho de «Revisor final» en [encargo-revision.md](references/encargo-revision.md).»
- [ ] **Step 5: `sdd-end-task`** — paso 9 completo pasa a: «9. **Code-review** — comprueba que hubo revisión final de rama y con qué modelo: `subagent-driven-development` y `executing-plans` (Native) la lanzan ellas, y queda en el ledger (`Final`) o en el informe del revisor. No lances otra: duplicaría la revisión de rama. Solo si no hubo revisión final, `superpowers:requesting-code-review` antes de darla por cerrada.» En el paso 1, «(los «Rulings I made» del informe final de `subagent-driven-development`)» pasa a «(los «Rulings I made» del mensaje final de `subagent-driven-development` o de `executing-plans`, y en Native también sus «Deferred minors»)».
- [ ] **Step 6: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 7: Commit de la task** — compara el RED; `docs(skills): el revisor final va con Opus y effort high y el cierre no lo repite`; después `task-done`.

### Task 4 — Cambio a SDD tras una compactación

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/NativeAdapt.Tests.ps1`, bloque `Describe 'Task 4 — cambio tras compactar'`; Native: TDD del propio hilo, con copia apartada
**Superficies**: docs · tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/NativeAdapt.Tests.ps1,tests/NativeDefault.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: nada.
- Produce: la frase literal de la cabecera, que usa la Task 5.

**Ficheros**: modificar `skills/sdd-templates/templates/plan-template.md`, `skills/sdd-start-task/SKILL.md`, `skills/sdd-start-task/references/overrides-superpowers.md`.

- [ ] **Step 1: RED** — `It`s:
  - la línea `**Ejecución**` de `plan-template.md` lleva la frase literal «Si retomas este plan tras una compactación y quedan dos o más tasks, sigue con subagent-driven-development sobre el mismo ledger.»;
  - el paso 5 dice «tras compactar, la sesión relee el plan y el ledger»;
  - la fila de `executing-plans` en overrides dice «Tras una compactación con dos o más tasks pendientes».
- [ ] **Step 2: plantilla** — la línea `**Ejecución**: <native | subagent>, porque <motivo del plan> · o, con \`execution\` fijado en \`sdd-kit.json\`: <valor>, fijado en sdd-kit.json` pasa a `**Ejecución**: <native | subagent>, porque <motivo del plan> · o, con \`execution\` fijado en \`sdd-kit.json\`: <valor>, fijado en sdd-kit.json · con native, añade: Si retomas este plan tras una compactación y quedan dos o más tasks, sigue con subagent-driven-development sobre el mismo ledger.`
- [ ] **Step 3: paso 5** — tras «… y va en la línea `Ejecución` de la cabecera; dónde se para, según la [tabla de gates](references/control-profiles.md).», añade: «Con Native, la línea lleva además la frase del cambio de método de la plantilla, literal: tras compactar, la sesión relee el plan y el ledger, no esta skill (2 de 2 sujetos en `tests/native-adapt-red.md`).»
- [ ] **Step 4: overrides** — al final de la segunda celda de la fila de `executing-plans`, añade: «Tras una compactación con dos o más tasks pendientes, lo que queda sigue con `subagent-driven-development` sobre el mismo ledger, como dice la línea `Ejecución` del plan: sin parar en `delegate` ni `unattended`, registrado como ruling. Con una sola task pendiente, o sin compactación, se sigue en Native.»
- [ ] **Step 5: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 6: Commit de la task** — compara el RED; `docs(skills): tras una compactación, lo que queda de un plan Native va con subagentes`; después `task-done`.

### Task 5 — GREEN

**Modelo**: sujetos Sonnet (`claude -p`), como el RED
**Tests RED**: no aplica (es la medición)
**Superficies**: docs (evidencia)
**Verificación**: `KIT_DIR=<copia de HEAD> RUNS_DIR=<scratchpad>/runs OUT_NAME=green SCENARIOS=… SUBJECTS=… bash .docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/run.sh`

**Interfaces**:
- Consume: los textos de las Tasks 1–4 en `HEAD`; la frase de la cabecera de la Task 4.
- Produce: `tests/native-adapt-green.md`.

- [ ] **Step 1: molde** — en `red/mold.sh` y `red/subject.sh` (sin una tanda en marcha): `native_plan` añade a su línea `Ejecución` la frase de la cabecera; un escenario `n4c` (control): el mismo estado de `n4` con una petición sin compactación («sigue con la Task 3 y para en cuanto quede completa»); un escenario `c1`: el estado de `n2` más una línea `Final review: … (opus, effort high) — Ready` y dos `Final: minor (deferred)` en el ledger, con la petición «invoca sdd-kit:sdd-end-task; validé: probé `salas reservar Norte 1012` y da el error; no hagas merge ni push y para antes del paso 10»; un escenario `h1`: `base_files` con `free(slot)` ya existente (sin el hueco de «libres») y la spec aprobada, con la petición del paso 5 de la 0055 que sigue hasta escribir el RED de la Task 1.
- [ ] **Step 2: tanda** — `n1`, `n2` (kit sin `agents/`), `n4`, `s1` y `s2` ×2; `n4c` ×1; `c1` ×2; `h1` ×2. Veredictos contra el RED; si un escenario falla 2/2, una tanda de REFACTOR dentro del techo.
- [ ] **Step 3: evidencia** — `tests/native-adapt-green.md`: tabla de sujetos, coste, veredicto frente al RED y acumulado de la campaña.
- [ ] **Step 4: Commit de la task** — `test(skills): GREEN de la task 0057`; después `task-done`.

---

## Estimación y esfuerzo

- Tipo: docs
- Estimación de implementación: 2,5 h (1,5 h de las Tasks 1–4 y 1 h de GREEN)

## 3. Validación final

- [ ] Gate de cierre: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`, una vez.
- [ ] Revisión final de rama: `review-package` sin `red/` ni `green/` (`tech-stack.md`, «Paquete de revisión sin evidencia»), `sdd-kit:effort-high` + `model: opus`, con la cabecera de `encargo-revision.md`.
- [ ] Verificación de los criterios de éxito de la spec.

## 4. Cobertura escenario → task

| Escenario de la spec | Task |
| --- | --- |
| Una task Native se registra en el ledger de `executing-plans` | 1 (texto), 5 (`n1`) |
| La base se comprueba antes de cada task Native | 1, 5 (`n1`) |
| Los RED de una task Native se apartan y se comparan | 1, 5 (`n1`) |
| El revisor final de Native va con el techo del kit | 3, 5 (`n2`) |
| Sin el tipo de effort, se dice antes del primer despacho | 3, 5 (`n2`) |
| El cierre no repite la revisión final de Native | 3, 5 (`c1`) |
| Los minors diferidos llegan al walkthrough | 3, 5 (`c1`) |
| En Windows, el workspace de ejecución se usa en su ruta Windows | 1 (texto; la sonda ya lo mide) |
| Tras una compactación, lo que queda de un plan Native va con SDD | 4, 5 (`n4`, `n4c`) |
| Cada task del plan queda en un commit | 2, 5 (`s1`) |
| Un RED sin commitear no tumba los commits del hilo | 2, 5 (`s2`) |
| Validación en uso de la 0055 («en `delegate` no para por el método») | 5 (`h1`) |
