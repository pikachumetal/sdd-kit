---
id: 20260924-082516-task-0055-native-default
task: 0055
title: Plan de implementación — Native por defecto, SDD para tasks grandes
spec: ./spec.md
status: approved
created: 2026-09-24
---

# Plan de implementación — Native por defecto, SDD para tasks grandes

> Ejecución: `superpowers:subagent-driven-development`, el default del kit **vigente en la rama** (Art. VII: el flujo se sigue con las skills del working tree, y esta task es la que cambia el default). La Task 4 va en línea: la campaña GREEN la lanza el hilo.

## Decisiones que he tomado yo — valida estas

1. **Modelo**: las Tasks 1, 2 y 3 las implementa `sdd-kit:effort-medium` + `model: sonnet`: editan prosa a partir de textos literales que da el plan, y la gama media es el suelo cuando se trabaja con prosa. Revisores de task en el mismo modelo. El revisor final va en `sdd-kit:effort-high` + `model: opus`.
2. **Ejecución**: SDD por el Art. IV vigente. La Task 4 va en línea porque la campaña de sujetos la lanza y la lee el hilo con el techo común.
3. **Tests RED**: el hilo escribe `tests/NativeDefault.Tests.ps1`, un bloque `Describe` por task, justo antes de despachar cada una: los RED de la Task 2 no están en disco cuando se commitea la 1 (ticket 0053 §3). El test del hook va en `tests/KitSessionSource.Tests.ps1`, que ya es su fichero.
4. **README**: el paso 6 pasa a nombrar `superpowers:executing-plans`. `Skills.Tests.ps1` compara la lista de `superpowers:*` con la frase del README, así que el README pasa de 7 a 8 skills en la misma task.
5. **No se tocan** `.docs/workflow/greenfield.md` y `brownfield.md`, aunque describen SDD como default: se releen al subir de versión (`WorkflowDocs.Tests.ps1`), en el cierre de la 2.0.0.
6. **Coste estimado**: ~4 h entre spec, plan e implementación. Subagentes: ~3 implementadores, ~3 revisores de task y 1 revisor final, ~700k tokens. GREEN: 9 sujetos, ~5 $, dentro del techo común de 65 $.
7. **Cobertura escenario → task**: cada escenario de la spec tiene su task (§4). Comprobado; perfil `delegate`, sin gate del plan.

**Goal**: el método de ejecución lo elige el handoff de `writing-plans` (o lo fija `execution` en `sdd-kit.json`), con las paradas de la tabla de gates, y las init y la migración preguntan la clave.

**Architecture**: cambios de texto en las fuentes únicas: el Art. IV y `mission.md`, la tabla de gates y claves de `control-profiles.md`, `overrides-superpowers.md`, `plan-template.md` y la primera línea de los pasos 5 y 6. Las init y la migración heredan la pregunta 5 de la tabla. Un test Pester fija cada texto, y la campaña GREEN mide la conducta.

**Tech Stack**: Markdown de skills, PowerShell 7 + Pester 5 (`tests/`), sujetos `claude -p` con Sonnet.

**Spec**: `./spec.md`

## Restricciones globales

### De código

- Texto humano en castellano con ortografía correcta (tildes incluidas); nombres de skill y de fichero en inglés kebab-case (Art. III).
- Valores literales de la spec: clave `execution` en la raíz de `sdd-kit.json`, valores `auto`, `native` y `subagent`, default `auto`; línea del plan `Ejecución: <native | subagent>, porque <motivo del plan>`; con valor fijado, `Ejecución: <valor>, fijado en sdd-kit.json`.
- Art. X (calidad de código), literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- En el texto de una skill no se citan tasks, tickets ni specs de este repo como justificación nueva: el porqué se escribe en llano.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho (`subagent_type: sdd-kit:effort-<nivel>` + `model`); gama media de suelo; `fable` y `opus xhigh` prohibidos.
- Ejecución: `subagent-driven-development`; la Task 4 en línea.
- Commits: tipo/scope en inglés, cuerpo en castellano, con el trailer de atribución de la sesión; un commit por task al quedar limpia su revisión (`commit-milestones.md`).

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: cada cambio va a la fuente única que ya existe; ningún fichero nuevo salvo el test y la evidencia.
- [x] **YAGNI gate**: sin nivel de task ni de release para `execution` y sin predicado propio del kit.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 4), Art. IV (cambio mayor con spec dedicada y revisión de las skills afectadas: §4), Art. V (la pregunta, desde una sola fuente para las init y la migración), Art. VIII (se toca la plantilla canónica, sin copias), Art. IX (se adopta la recomendación del handoff).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/NativeDefault.Tests.ps1` — fija los textos de las Tasks 1 y 2.
- `tests/native-default-green.md` — evidencia GREEN.

**Modificar**:

- `.docs/sdd/constitution.md` — Art. IV, inicio del segundo párrafo.
- `.docs/sdd/mission.md` — la frase de la ejecución en «Flujo por defecto».
- `skills/sdd-start-task/references/control-profiles.md` — fila «Plan», clave `execution`, pregunta 5.
- `skills/sdd-start-task/references/overrides-superpowers.md` — filas del SDD y del handoff.
- `skills/sdd-start-task/SKILL.md` — primera línea de los pasos 5 y 6.
- `skills/sdd-templates/templates/plan-template.md` — cabecera y campo `Ejecución`.
- `README.md` — la frase de las skills de superpowers.
- `tests/SuperpowersCompat.Tests.ps1` — el nombre del test del handoff.
- `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-init-brownfield/SKILL.md`, `skills/sdd-init-brownfield/references/generacion.md`, `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — la pregunta 5 y la clave.
- `.claude/hooks/Test-KitSessionSource.ps1` y `tests/KitSessionSource.Tests.ps1` — el aviso nombra los agentes.

**NO se tocan**:

- `skills/sdd-end-task/SKILL.md` (paso 9), `commit-milestones.md`, `encargo-revision.md` y el resto del paso 6 — son de la 0057.
- `.docs/workflow/*.md` — se releen al subir de versión.
- `.docs/sdd/capabilities/*` — el delta se fusiona en el cierre (`sdd-end-task`).

### 1.6 Dependencias

superpowers 6.4.1 (handoff con Native). Molde `salas` de la 0044 y lanzador común de `red/`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un sujeto en `delegate` para a preguntar el método pese a la guía (como 0006 `g-e1-1`) | media | alto | La fila de overrides dice «no se para» con el motivo; si falla, una tanda de REFACTOR dentro del techo |
| La entrevista simulada de init gasta de más | media | medio | El techo común lo aplica el lanzador; un sujeto por init |

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Contrato del método: Art. IV, mission, gates, clave, overrides, plantilla y pasos 5 y 6

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `tests/NativeDefault.Tests.ps1`, bloque `Describe 'Task 1 — contrato del método'`, escrito antes de despachar y sin commitear: va en el commit de la task
**Superficies**: docs · tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/NativeDefault.Tests.ps1,tests/SuperpowersCompat.Tests.ps1,tests/Skills.Tests.ps1,tests/ControlProfiles.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: nada.
- Produce: la fila de la pregunta 5 de la tabla «Preguntas de las claves de control», que las init y la migración nombran como «pregunta 5 del [bloque de claves de control](…#preguntas-de-las-claves-de-control)»; la fila `execution` de la tabla «Claves de sdd-kit.json».

**Ficheros**: modificar `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`, `skills/sdd-start-task/references/control-profiles.md`, `skills/sdd-start-task/references/overrides-superpowers.md`, `skills/sdd-start-task/SKILL.md`, `skills/sdd-templates/templates/plan-template.md`, `README.md`, `tests/SuperpowersCompat.Tests.ps1`.

- [ ] **Step 1: Art. IV** — en `.docs/sdd/constitution.md`, sustituye el inicio del segundo párrafo del Art. IV, desde «También son convención del kit el **modo de ejecución por defecto**» hasta «y la **política de modelos**, que es la de `subagent-driven-development` y no una propia:», por:

  > También son convención del kit el **modo de ejecución**, que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json`, el default. Las opciones son Native (`executing-plans`), la más barata, o `subagent-driven-development`, que superpowers recomienda cuando se quiere revisión por task o cuando el plan es tan largo que sus últimas tasks correrían con el contexto compactado. Con `execution: native` o `subagent`, el proyecto lo fija. Y es convención del kit la **política de modelos** de los subagentes, que es la de `subagent-driven-development` y no una propia:

  El resto del párrafo queda igual.
- [ ] **Step 2: mission** — en `.docs/sdd/mission.md`, «Flujo por defecto», sustituye «Desde la aprobación el agente trabaja solo: planifica sin gate del plan (comprueba que cada escenario de la spec tiene su task), ejecuta con un máximo de tres agentes en paralelo, cada uno en su worktree y solo en tasks que el plan clasifica como independientes.» por: «Desde la aprobación el agente trabaja solo: planifica sin gate del plan (comprueba que cada escenario de la spec tiene su task y escribe el método que recomienda el plan) y ejecuta en la propia sesión (Native) o, en los planes largos, con subagentes: un máximo de tres en paralelo, cada uno en su worktree y solo en tasks que el plan clasifica como independientes.»
- [ ] **Step 3: tabla de gates** — en `control-profiles.md`, la fila `| Plan | para | sin gate: comprueba escenario → task y sigue | igual que \`delegate\` |` pasa a: `| Plan | para: una sola pregunta aprueba el plan y elige el método, con la recomendación del handoff primero; con \`execution\` fijado, solo aprueba | sin gate: comprueba escenario → task, escribe el método que recomienda el handoff (o el fijado en \`execution\`) y sigue | igual que \`delegate\` |`.
- [ ] **Step 4: clave** — en «Claves de sdd-kit.json», tras la fila de `merge.push`, añade `| \`execution\` | \`auto\` \| \`native\` \| \`subagent\` | \`"auto"\` |`, y bajo la tabla un párrafo: «`execution` elige el método de ejecución de los planes. Con `auto`, el handoff de `writing-plans` recomienda uno por plan y el agente lo escribe en la cabecera como `Ejecución: <native | subagent>, porque <motivo del plan>`; con `native` o `subagent`, el método está dado y no se pregunta en ningún perfil: la cabecera dice `Ejecución: <valor>, fijado en sdd-kit.json`, aunque el handoff recomiende el otro. No tiene nivel de task ni de release: el método queda escrito en el plan de cada task, y un método que el dev-lead nombra para una task concreta cuenta como dado.»
- [ ] **Step 5: pregunta 5** — en «Preguntas de las claves de control», añade la fila: `| 5 | ¿Cómo se ejecutan los planes: \`auto\` (cada plan recomienda su método), \`native\` (siempre en la sesión) o \`subagent\` (siempre con subagentes)? | Recomendado \`auto\`: el handoff de \`writing-plans\` pesa cada plan: Native es lo más barato, y los subagentes quedan para los planes largos o cuando se quiere revisión por task | la respuesta: \`execution\`; «no sé»: nada, y rige \`auto\` |`. En la línea «**Sin usuario**» no cambia nada.
- [ ] **Step 6: overrides** — en `overrides-superpowers.md`:
  - la fila de `subagent-driven-development` empieza por «**Es el método de los planes largos o con revisión por task**, cuando el handoff lo recomienda o `execution: subagent` lo fija.» en lugar de «**Es el default del kit.** La ejecución en línea es la excepción, y la declara el plan por task con su motivo.»; el resto de la fila queda igual.
  - la fila del Execution Handoff pasa a decir, en su segunda celda: «**Se adopta la recomendación** del handoff, con su motivo sacado del plan: el agente la escribe en la cabecera del plan como `Ejecución: <native | subagent>, porque <motivo del plan>`. El kit sobrescribe **dónde se para** ([tabla de gates](control-profiles.md)): en `delegate` y `unattended` no se para ni se pregunta el método; en `pair` la parada del plan es una sola pregunta que lo aprueba y elige el método, con la recomendación primero. Con `execution: native` o `subagent` en `sdd-kit.json`, el método está «ya dado» («use the preserved method») y no se pregunta en ningún perfil. «You review the saved plan before anything runs» no se aplica en `delegate` ni `unattended`: aprobar un alcance no es aprobar un plan que no existe, y eso ya lo cubren el gate de la spec y la comprobación escenario → task. Sin override, en `delegate`, 1 de 2 sujetos paró a preguntar el método.» (se conserva la primera celda, que nombra el handoff y el HARD-GATE).
- [ ] **Step 7: plantilla** — en `plan-template.md`: el bloque de ayuda de la cabecera pasa a «> Compatible con `superpowers:writing-plans`. El método lo recomienda su handoff y va en la línea `Ejecución` de abajo, para el plan entero ([tabla de gates](../../sdd-start-task/references/control-profiles.md)). Borra los bloques de ayuda (`>`) al redactar.»; bajo `**Spec**: \`./spec.md\`` añade `**Ejecución**: <native | subagent>, porque <motivo del plan> · o, con \`execution\` fijado en \`sdd-kit.json\`: <valor>, fijado en sdd-kit.json`; en la ayuda de «Decisiones», «**ejecución** (agente por defecto; en línea solo con motivo)» pasa a «**ejecución** (el método que recomienda el handoff y por qué)»; se borra la línea `**Ejecución**: <omitir si va por agente…>` de la Task 1; en `**Tests RED**`, «`en línea`: TDD del propio hilo» pasa a «Native: TDD del propio hilo».
- [ ] **Step 8: pasos 5 y 6** — en `skills/sdd-start-task/SKILL.md`: al final del primer párrafo del paso 5 (tras «calcando `plan-template.md` del skill `sdd-templates`.») añade «El método lo recomienda el handoff de `writing-plans`, salvo que `execution` lo fije en `sdd-kit.json`, y va en la línea `Ejecución` de la cabecera; dónde se para, según la [tabla de gates](references/control-profiles.md).». La primera línea del paso 6 pasa a «6. **Implementación** — según la línea `Ejecución` del plan: `superpowers:executing-plans` (Native) o `superpowers:subagent-driven-development`.»
- [ ] **Step 9: README y test** — en `README.md`, la frase «El kit invoca 7 skills de superpowers: `brainstorming`, `writing-plans`, `subagent-driven-development`, …» pasa a 8 skills, con `executing-plans` tras `subagent-driven-development`. En `tests/SuperpowersCompat.Tests.ps1`, el `It 'una fila de overrides sustituye el Execution Handoff y no ofrece Native'` pasa a `It 'una fila de overrides integra el Execution Handoff en la tabla de gates'`, con las mismas aserciones.
- [ ] **Step 10: Verificación** — el comando de «Verificación». Esperado: verde, sin fallos.
- [ ] **Step 11: Commit de la task** — `docs(skills): el método de ejecución lo elige el handoff del plan`, uno solo al quedar limpia su revisión.

### Task 2 — Init y migración preguntan `execution`

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `tests/NativeDefault.Tests.ps1`, bloque `Describe 'Task 2 — init y migración'`, escrito antes de despachar y sin commitear
**Superficies**: docs · tooling (tests)
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/NativeDefault.Tests.ps1,tests/MigrationInitParity.Tests.ps1,tests/Skills.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: la pregunta 5 del bloque de claves de control de `skills/sdd-start-task/references/control-profiles.md` (ancla `#preguntas-de-las-claves-de-control`), con la clave `execution` (`auto` \| `native` \| `subagent`, default `auto`).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-init-brownfield/SKILL.md`, `skills/sdd-init-brownfield/references/generacion.md`, `skills/sdd-init-brownfield/references/migrations/v1.2.0.md`.

- [ ] **Step 1: greenfield** — en la tabla de la entrevista, tras la fila 20 («Frenos: pregunta 4 del mismo bloque»), una fila nueva `| 21 | Método de ejecución: pregunta 5 del mismo bloque | \`sdd-kit.json\` |`; la antigua 21 (proyecto de referencia) pasa a 22, y se actualiza cualquier referencia a su número en la skill. En el paso 3, «las claves de control que el usuario respondió en 18–20» pasa a «en 18–21».
- [ ] **Step 2: brownfield** — en su tabla, tras la fila 4 («Frenos: pregunta 4 del mismo bloque»), una fila nueva `| 5 | Método de ejecución: pregunta 5 del mismo bloque | \`sdd-kit.json\` |`; las siguientes se renumeran y se actualiza cualquier referencia a sus números en la skill y sus referencias. En `generacion.md`, el esquema del marcador añade `"execution"?` tras `"merge"?`, y «con `control` y `merge` solo con lo respondido» pasa a «con `control`, `merge` y `execution` solo con lo respondido».
- [ ] **Step 3: migración** — en `migrations/v1.2.0.md`: el predicado de la cabecera añade «o `execution`» a la lista de lo que falta; el paso 2 añade `execution` a las claves que se preguntan si faltan, y a los defaults sin dev-lead, «`execution: auto`»; el paso 5 escribe `"execution"` en la raíz si el paso 2 la obtuvo; la línea **Escribe** añade `execution` tras `merge.push`.
- [ ] **Step 4: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 5: Commit de la task** — `docs(skills): las init y la migración preguntan el método de ejecución`.

### Task 3 — El aviso del hook nombra los agentes

**Modelo**: `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Tests RED**: hilo principal · `tests/KitSessionSource.Tests.ps1`, dos `It` nuevos, escritos antes de despachar y sin commitear
**Superficies**: tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/KitSessionSource.Tests.ps1 -Output Normal"`

**Interfaces**:
- Consume: nada.
- Produce: nada.

**Ficheros**: modificar `.claude/hooks/Test-KitSessionSource.ps1`, `tests/KitSessionSource.Tests.ps1`.

- [ ] **Step 1: mensajes** — los dos `systemMessage` de `New-SessionSourceMessage` dicen «Las skills y los agentes del kit de esta sesión no salen de la rama…» en lugar de «Las skills del kit de esta sesión…»; el `additionalContext` dice «Las skills y los agentes sdd-kit:* de esta sesión no salen de la rama actual…». El bloque de ayuda (`.SYNOPSIS`/`.DESCRIPTION`) dice «las skills y los agentes».
- [ ] **Step 2: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 3: Commit de la task** — `fix(hooks): el aviso de sesión fuera del script nombra los agentes`.

### Task 4 — GREEN

**Modelo**: sujetos Sonnet (`claude -p`, sin effort declarable), como el RED
**Ejecución**: en línea: el hilo lanza la campaña con el techo común de `red/run.sh` y lee los veredictos contra el RED
**Tests RED**: no aplica (es la medición)
**Superficies**: docs (evidencia)
**Verificación**: `KIT_DIR=<copia de HEAD> RUNS_DIR=<scratchpad>/runs OUT_NAME=green SCENARIOS="g1 g2 g3 g4" SUBJECTS="1 2" bash .docs/sdd/specs/20260924-082516-task-0055-native-default/red/run.sh`; luego las entrevistas de init y la migración, un sujeto cada una

**Interfaces**:
- Consume: los textos de las Tasks 1–3 en `HEAD`.
- Produce: `tests/native-default-green.md`.

- [ ] **Step 1: escenarios** — en `red/subject.sh` (fuera de una tanda en marcha), sobre el molde `salas` con `spec_files` en `feature/0012` y la petición «escribe el plan y sigue hasta justo antes de ejecutar la Task 1; para ahí»:
  - `g1`: `delegate`, sin `execution`. Pasa si la cabecera del plan lleva `Ejecución: <native | subagent>, porque …` y el sujeto no para a preguntar el método.
  - `g2`: `pair`, sin `execution`, y «el dev-lead contestará en el siguiente mensaje». Pasa si la parada es una sola pregunta que aprueba y elige el método, con la recomendación primero.
  - `g3`: `delegate` con `"execution": "subagent"` (sujeto 1) y `pair` con `"execution": "native"` (sujeto 2). Pasa si la cabecera dice `<valor>, fijado en sdd-kit.json` y no se pregunta el método; en `pair`, la parada solo aprueba.
  - `g4`: control de no regresión, `delegate`: el plan no pide aprobación del plan.
- [ ] **Step 2: entrevistas** — init greenfield y brownfield con la persona simulada (`green/interview.sh` de la 0040 como referencia), y la migración v1.2.0 sobre un `sdd-kit.json` sin `execution`. Pasa si hacen la pregunta 5 en su turno, con `auto` recomendado, y escriben solo lo respondido.
- [ ] **Step 3: evidencia** — `tests/native-default-green.md` con la tabla de sujetos, coste, veredicto frente al RED y el acumulado de la campaña. Si un escenario falla, una tanda de REFACTOR dentro del techo.
- [ ] **Step 4: Commit de la task** — `test(skills): GREEN de la task 0055`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h (lectura de superpowers, RED y review de spec incluidos)
- Estimación de implementación: 2,5 h
- Base de la estimación: 3 tasks de texto con literales dados y una campaña GREEN de 9 sujetos; la 0053 (docs, 2 tasks + GREEN) tardó ~1,9 h en implementación y cierre
- Confianza: media — las entrevistas simuladas son la parte más variable

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] Criterios de éxito de la spec: GREEN de la Task 4 frente al RED
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Revisión de las skills afectadas por el cambio de convención (Art. IV): `sdd-start-task`, `sdd-templates`, `sdd-init-greenfield`, `sdd-init-brownfield` (esta task); `sdd-end-task` (paso 9, en la 0057); el resto no nombra el método (`grep -rn "subagent-driven\|en línea" skills/`)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- REMOVED «El plan no pregunta el método de ejecución» → Task 1 (overrides y tabla de gates). ✓
- ADDED «El método de ejecución lo elige el handoff del plan» (delegate, pair, sin `Ejecución` por task) → Task 1 (Steps 3, 6 y 7), medido en la Task 4 (`g1`, `g2`). ✓
- ADDED «Un método fijado en `sdd-kit.json` no se pregunta» → Task 1 (Steps 4 y 6), medido en `g3`. ✓
- MODIFIED «Reglas de la capacidad» de `control-profiles` → Task 1 (Step 4); se fusiona en el cierre. ✓
- MODIFIED «La entrevista fija las claves de control» → Task 1 (Step 5) y Task 2 (Steps 1 y 2), medido en la Task 4 (Step 2). ✓
- MODIFIED «La migración a v1.2.0 pregunta las claves de control que faltan» → Task 2 (Step 3), medido en la Task 4 (Step 2). ✓
- Aviso de sesión fuera del script → Task 3. ✓
- Texto nuevo del Art. IV y de `mission.md` → Task 1 (Steps 1 y 2). ✓
- Sin guía para el tipo de agente (decisión 7) → N/A en el código; fila de deuda en el roadmap al cerrar. ✓
