---
id: 20260908-095857-task-0000-workflow-ejecucion
task: 0000
title: Plan de implementación — Workflow y ejecución
spec: ./spec.md
status: approved
created: 2026-09-08
approved_at: 2026-09-08
---

# Plan de implementación — Workflow y ejecución

**Goal**: llevar al kit el default de ejecución por agente, la política de modelos declarada en el plan, el TDD por predicado y el code-review antes del cierre, escribiendo solo la guidance que el baseline demuestre necesaria.

**Architecture**: RED primero. Una sola campaña mide cuatro cosas sobre la misma fixture —si el baseline delega, si elige y declara modelo, si aplica TDD y code-review sin que nadie los nombre, y si un ejecutor aislado hereda las "Restricciones globales"—; lo que el baseline ya hace bien **no se escribe** (Art. I). Después se escribe la guidance reclamada, y una segunda campaña la valida con dos regímenes a la vez: GREEN para lo nuevo y A/B de no-regresión para las conductas ya validadas de las dos skills editadas.

**Tech Stack**: Markdown puro, sin build ni CI. Subagentes sobre fixtures desechables en el scratchpad. Evidencia narrativa verificada en disco (`.docs/sdd/tech-stack.md` §Tests).

**Spec**: `./spec.md`

## Restricciones globales

Copiadas literalmente de la spec y de la constitution. Toda task las hereda aunque no las repita.

- **Política de modelos**: el más barato que resuelva bien la tarea. `fable` y `opus xhigh` prohibidos por defecto, solo con justificación escrita en la task.
- **Modelo de los subagentes de las campañas: Sonnet**, el mismo de toda la evidencia previa del kit. Cambiar de modelo entre campañas metería una segunda variable.
- **Ejecución por defecto en este plan: en línea.** La task se ejecuta bajo el régimen **vigente** del kit, no bajo el que introduce — invertir el default es su entregable, no su método. Además, las campañas de test no son implementación delegable: los subagentes son sujetos del experimento.
- **La skill bajo test se entrega al subagente haciéndole leer el fichero del working tree** más su `Base directory`, nunca la copia en cache del plugin (aprendizaje de la task `progressive-disclosure`).
- **Las skills de `superpowers` NO se pegan**: las resuelve el harness (6.3.0 instalado).
- **Prompt neutro**: no telegrafiar la conducta correcta. Nada de preguntar "qué leíste". La conducta se infiere del log de acciones y se verifica en disco.
- **Una diferencia con n=1 por brazo no es un veredicto**: bisecar para atribuir y repetir para medir frecuencia antes de concluir.
- **Molde de fixture sin `.git`**: el git se crea en la copia por run. Una copia por run.
- Art. I — ningún cambio de skill sin su ciclo de test documentado en `tests/`.
- Art. III — castellano; nombres de fichero en inglés kebab-case.
- Art. VI — commits con tipo/scope en inglés y cuerpo en castellano.
- Art. VIII — `plan-template.md` se edita en `skills/sdd-templates/templates/`, su única fuente.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? Sí: escribir la guidance directamente sin RED. Se rechaza — el Art. I lo prohíbe, y T1 ya demostró que el baseline puede no exhibir el fallo (dos ítems de guidance no se escribieron).
- [ ] **YAGNI gate**: no se crea catálogo de modelos por tipo de tarea (NO objetivo de la spec). La política fija criterio y dos prohibiciones.
- [ ] **Brownfield gate**: las 11 skills están en uso. Ninguna cambia de nombre ni de `description`, así que ninguna invocación existente se rompe.
- [ ] **Constitution check**: respeta Art. I, II, III, IV (con la ampliación de la §7.3 de la spec, aprobada en el gate), VI, VII y VIII.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/workflow-ejecucion-red.md` — baseline de los cuatro escenarios.
- `tests/workflow-ejecucion-green.md` — mismos escenarios con la guidance escrita.
- `tests/plan-template-herencia-ab.md` — el residual de T1: herencia de "Restricciones globales" por ejecutores que solo ven su task.
- `tests/sdd-start-task-ab.md` y `tests/sdd-end-task-ab.md` — **se amplían**, no se crean: ya existen de T2. La sección nueva documenta la no-regresión tras esta edición.

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md` — campos `Modelo` y `Ejecución` por task; política de modelos en "Restricciones globales"; el ciclo de verificación nombra `superpowers:test-driven-development` bajo predicado.
- `skills/sdd-start-task/SKILL.md` — paso 6: default agente.
- `skills/sdd-start-task/references/overrides-superpowers.md` — la fila de `subagent-driven-development` se invierte.
- `skills/sdd-end-task/SKILL.md` — paso de code-review antes del cierre.
- `.docs/sdd/constitution.md` — Art. IV ampliado.

**NO se tocan**:

- `skills/sdd-consult/`, los carriles patch y release, las skills de init — fuera de alcance por la spec §2.
- Nada relacionado con worktrees — es T4, bloqueada.
- La `description` del frontmatter de ninguna skill — es lo único cargado en toda sesión; tocarla es otro experimento.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos

El contrato que esta task cambia es el `plan-template.md`: los planes que se escriban a partir de ahora llevan campos nuevos. Los planes ya escritos siguen siendo válidos — los campos son aditivos y su ausencia se lee como el default.

---

## 2. Tasks

### Task 1 — Campaña RED: qué hace el baseline sin la política

**Modelo**: Sonnet (subagentes de la campaña); orquestación en la sesión.
**Ejecución**: en línea — la campaña es medición, no implementación delegable.

**Ficheros**: crear `tests/workflow-ejecucion-red.md`; fixture desechable en el scratchpad.

- [ ] **Step 1: Construir la fixture.** Proyecto "Cobra" (gestión de cobros, Node) con `.docs/sdd/` completo, `tech-stack.md` que **declara tests automáticos ejecutables** (`node --test`, con un test real que pasa), una `spec.md` aprobada y un **`plan.md` multi-task de 3 tasks** que incluye bloque "Restricciones globales" con dos restricciones verificables y comprobables en disco: (a) "los importes se guardan en céntimos, como entero" y (b) "ningún fichero nuevo fuera de `src/billing/`". Ninguna task del plan repite esas restricciones. Molde sin `.git`.
- [ ] **Step 2: Definir los cuatro escenarios.**

  | Id | Qué se le pide | Qué mide |
  | --- | --- | --- |
  | R1 | «Implementa el plan que hay en `.docs/sdd/specs/<carpeta>/plan.md`.» | ¿Delega en subagentes o lo hace todo en su sesión? ¿Declara o elige modelo en algún momento? |
  | R2 | Igual que R1, en el proyecto que SÍ tiene tests ejecutables | ¿Escribe el test antes que la implementación sin que nadie nombre TDD? |
  | R3 | «La task 2 ya está implementada, ciérrala.» | ¿Pide code-review antes de cerrar, o cierra directamente? |
  | R4 | Al ejecutor se le entrega **solo el texto de la Task 2**, sin el resto del plan ni las Restricciones globales visibles en su task | ¿Respeta las dos restricciones globales que su task no repite? (residual de T1) |

- [ ] **Step 3: Correr el baseline.** Un subagente Sonnet por escenario, en paralelo, con prompt neutro. En R1–R3 se entrega `sdd-start-task` y `sdd-end-task` **vigentes** (sin la guidance nueva). En R4 se entrega únicamente el fragmento de la Task 2.
- [ ] **Step 4: Verificar en disco.** Por cada run: si se despacharon subagentes (rastro en el log de acciones), si hay tests escritos antes que implementación (orden de commits o de ficheros), si se invocó `requesting-code-review`, y en R4 si los importes quedaron en céntimos y si apareció algún fichero fuera de `src/billing/`.
- [ ] **Step 5: Escribir `tests/workflow-ejecucion-red.md`** con los fallos reproducidos, las racionalizaciones textuales y **los positivos que no requieren guidance**.
- [ ] **Step 6: Checkpoint contigo** — presentar qué guidance reclama el RED y cuál no, y resolver la Open question 2 de la spec (si el baseline acierta, ¿se escribe igual por convención o se recorta el alcance?).
- [ ] **Step 7: Commit** — `test(skills): RED del default de ejecucion, la politica de modelos y la herencia de restricciones`.

### Task 2 — Escribir la guidance reclamada

**Modelo**: ninguno — edición de documentos en la sesión.
**Ejecución**: en línea — son ediciones de una a cinco líneas con decisiones de redacción que se corrigen en el momento.

**Ficheros**: modificar `plan-template.md`, `sdd-start-task/SKILL.md`, `sdd-start-task/references/overrides-superpowers.md`, `sdd-end-task/SKILL.md`, `.docs/sdd/constitution.md`.

Solo se escribe lo que el RED haya reclamado. Lo que el baseline ya hiciera bien **no se escribe** (Art. I), y esa decisión queda anotada en el RED.

- [ ] **Step 1: `plan-template.md` — campos por task.** En la sección "## 2. Tasks", la cabecera de cada task pasa a admitir:

  ```markdown
  ### Task 1 — <nombre>

  **Modelo**: <el más barato que resuelva bien; `fable` y `opus xhigh` exigen justificación aquí mismo>
  **Ejecución**: <omitir si va por agente; `en línea` + motivo si se desvía>

  **Ficheros**: crear/modificar `path/...`
  ```

- [ ] **Step 2: `plan-template.md` — política en Restricciones globales.** Añadir al bloque de ayuda de esa sección: «Incluye la **política de modelos** del proyecto (criterio de asignación y modelos prohibidos por defecto) y el **modo de ejecución** por defecto. Toda task los hereda aunque no los repita.»
- [ ] **Step 3: `plan-template.md` — TDD por predicado.** En el bloque de ayuda de "## 2. Tasks", donde hoy dice «TDD si hay tests automáticos; smoke manual documentado si no los hay», nombrar la skill: «→ `superpowers:test-driven-development`».
- [ ] **Step 4: `sdd-start-task` paso 6.** Sustituir por: «**Implementación** — `superpowers:subagent-driven-development` (default). Una task va **en línea** solo si el plan lo declara con motivo. Si el plan tiene más de una task → `tasks.md` como registro vivo…» conservando el resto de la frase intacta.
- [ ] **Step 5: `overrides-superpowers.md`.** La fila pasa de «`subagent-driven-development` | Se evita: ejecución en línea con checkpoints» a «`subagent-driven-development` | **Es el default del kit.** La ejecución en línea es la excepción y la declara el plan por task, con motivo».
- [ ] **Step 6: `sdd-end-task` — code-review.** Insertar como paso previo al de rama: «**Code-review** — `superpowers:requesting-code-review` antes de dar por cerrada la task, haya tests automáticos o no.»
- [ ] **Step 7: `constitution.md` Art. IV.** Añadir: el modo de ejecución por defecto y la política de modelos son convención del kit; un proyecto consumidor puede desviarse, pero por escrito en su propia constitution.
- [ ] **Step 8: Verificación** — releer los cinco ficheros: ningún gate ⛔ perdido, ninguna tabla de racionalizaciones alterada, y el texto nuevo no contradice ningún artículo.
- [ ] **Step 9: Commit** — `feat(skills): agente por defecto, politica de modelos en el plan y code-review antes del cierre`.

### Task 3 — Campaña GREEN + A/B de no-regresión

**Modelo**: Sonnet (subagentes); orquestación en la sesión.
**Ejecución**: en línea — medición.

**Ficheros**: crear `tests/workflow-ejecucion-green.md` y `tests/plan-template-herencia-ab.md`; ampliar `tests/sdd-start-task-ab.md` y `tests/sdd-end-task-ab.md`.

Dos regímenes sobre la misma fixture, en una sola tanda:

- [ ] **Step 1: GREEN de la guidance nueva.** Los mismos cuatro escenarios del RED, con las skills y la plantilla ya editadas. Copias frescas de fixture. Veredicto contra cada fallo del RED.
- [ ] **Step 2: A/B de no-regresión de `sdd-start-task`.** Control = versión anterior a esta task (commit `426aa45`), tratamiento = versión editada, sobre los cuatro escenarios que su `-ab.md` ya documenta (A feature con presión, B bug determinista, L modo lite, E5 spike). Mide que invertir el paso 6 no toca el gate de la spec ni el enrutado.
- [ ] **Step 3: A/B de no-regresión de `sdd-end-task`.** Control = `426aa45`, tratamiento = versión con el paso de code-review, sobre el escenario de su `-ab.md` (task M4 con prisa, smoke autorreportado). Mide que el paso nuevo no desplaza a ningún otro del Definition of Done.
- [ ] **Step 4: Verificar en disco** los tres bloques, con el mismo rigor de la campaña de T2: nada de autoinforme.
- [ ] **Step 5: Bisecar y repetir** donde algo degrade, antes de concluir.
- [ ] **Step 6: Escribir la evidencia** — GREEN, herencia y las dos ampliaciones de los `-ab.md`.
- [ ] **Step 7: Checkpoint contigo** con el veredicto.
- [ ] **Step 8: Commit** — `test(skills): GREEN de la politica de ejecucion y no-regresion de las dos skills editadas`.

### Task 4 — Cierre documental

**Modelo**: ninguno — edición de documentos en la sesión.
**Ejecución**: en línea.

**Ficheros**: modificar `.docs/sdd/roadmap.md` y, si la campaña deja aprendizaje de método, `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: Marcar T3 en el roadmap** con el resultado real y el enlace al walkthrough. Si el RED recortó alcance, decirlo explícitamente, como se hizo con T1.
- [ ] **Step 2: Retirar de T3 la mención al contrato de worktrees** y anotar que sigue viva en T4, para que no se pierda al cerrar esta task.
- [ ] **Step 3: `tech-stack.md`** — solo si la campaña enseña algo nuevo de método. Si no, no se toca: inflar el documento sin aprendizaje real es ruido.
- [ ] **Step 4: Verificación** — `grep -n "subagent-driven" .docs/ skills/` devuelve un kit coherente: ninguna afirmación viva diciendo que se evita.
- [ ] **Step 5: Commit** — `docs(sdd): T3 cerrada con el resultado de la campana`.

El cierre de la task (walkthrough, changelog, estimation-log, roadmap ✅) va por `sdd-end-task`, no por este plan.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,6 h
- Estimación de implementación: **4 h** (rango 3–6)
- Base de la estimación: 4 tasks; dos campañas de subagentes (~4 runs el RED, ~10 el GREEN+A/B) que corren en paralelo y cuestan minutos; cinco ficheros de evidencia a redactar, que vuelven a ser el grueso real. **Corrección aplicada del cierre anterior**: la task `progressive-disclosure` cerró en 1,57 × su estimación por dos costes invisibles —reconstruir fixtures y las rondas extra de bisección—, así que aquí van presupuestados: la construcción de la fixture "Cobra" es el Step 1 de la Task 1, y el rango alto (6 h) cubre una ronda de bisección con repeticiones.
- Confianza: media

---

## 3. Validación final

- [ ] No hay build (Markdown puro): en su lugar, las skills tocadas conservan frontmatter válido y sus enlaces a `references/` siguen resolviendo.
- [ ] Los 7 criterios de éxito de la spec §2 verificados uno a uno.
- [ ] Ninguna guidance escrita sin fallo en el RED que la respalde (Art. I).
- [ ] Cierre por `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- Criterio 1 (`sdd-start-task` con default agente) → Task 2, Steps 4 y 5. ✓
- Criterio 2 (campos `Modelo` y `Ejecución`) → Task 2, Step 1. ✓
- Criterio 3 (política de modelos en Restricciones globales) → Task 2, Step 2. ✓
- Criterio 4 (TDD por predicado) → Task 2, Step 3; medido en R2. ✓
- Criterio 5 (code-review en `sdd-end-task`) → Task 2, Step 6; medido en R3. ✓
- Criterio 6 (herencia de Restricciones globales, residual T1) → Task 1 escenario R4 y Task 3, Step 1. ✓
- Criterio 7 (sin regresión en las dos skills editadas) → Task 3, Steps 2 y 3. ✓
- Spec §4.5 edge case "desvío sin motivo escrito" → Task 2, Step 1 (el campo exige el motivo en la propia task). ✓
- Spec §4.5 edge case "tests no ejecutables" → Task 1, Step 1 (la fixture declara tests **ejecutables**, y el predicado los exige así). ✓
- Spec §4.5 edge case "el propio kit no tiene tests" → cubierto por el predicado; no necesita task. ✓
- Spec §2 NO objetivos (worktrees, catálogo de modelos, otras skills) → §1.1 "NO se tocan" + Task 4, Step 2. ✓
- Spec §10 Open question 1 (modelo y coste) → Restricciones globales, confirmado antes del primer subagente. ✓
- Spec §10 Open question 2 (qué hacer si el baseline acierta) → Task 1, Step 6 (checkpoint). ✓
