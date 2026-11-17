---
id: 20260907-184057-task-0000-progressive-disclosure
task: 0000
title: Plan de implementación — Progressive disclosure de las skills del kit
spec: ./spec.md
status: approved
created: 2026-09-07
approved_at: 2026-09-07
---

# Plan de implementación — Progressive disclosure de las skills del kit

**Goal**: decidir con evidencia A/B, skill a skill, qué contenido de las 11 skills puede bajar a `references/` sin degradar la conducta del agente, y dejar el método reconocido en la constitution.

**Architecture**: cuatro olas. La ola 0 amplía el Art. I y fija el criterio en `architecture.md` antes de medir nada. Las olas 1–3 corren la campaña: por cada skill, un control (SKILL.md vigente) y un tratamiento (SKILL.md partido + `references/`) sobre los mismos escenarios, extraídos de los GREEN existentes. La ola 1 genera cortes candidatos a ciegas y las olas 2–3 heredan las hipótesis que sobrevivieron, conservando cada una su A/B propio. La ola 4 cierra los documentos vivos.

**Tech Stack**: Markdown puro. Sin build, sin CI, sin tests automáticos. La verificación es narrativa verificada en disco (`.docs/sdd/tech-stack.md` §Tests). Subagentes sobre fixtures desechables en el scratchpad de sesión.

**Spec**: `./spec.md`

## Restricciones globales

Copiadas literalmente de la spec y de la constitution. Toda task las hereda.

- **Modelo de los subagentes de la campaña: Sonnet** (confirmado por el dev-lead el 2026-09-07, cierra la Open question 1 de la spec). Toda la evidencia previa del kit se corrió con Sonnet (`tech-stack.md` §Tests). Cambiar de modelo entre el GREEN histórico y el control de hoy metería una segunda variable y haría inatribuible cualquier diferencia.
- **Orquestación: un `Workflow` por ola** (confirmado por el dev-lead el 2026-09-07). El workflow hace el fan-out de control y tratamiento y devuelve resultados con schema; la verificación en disco y la redacción de la evidencia se hacen en línea en la sesión, con checkpoint del dev-lead al cerrar cada ola. El override del kit contra `subagent-driven-development` no aplica aquí: los subagentes son los **sujetos** del experimento, no los implementadores de la task.
- **La skill bajo test se entrega pegada por prompt desde el working tree**, nunca la copia en cache del plugin, que es la versión publicada.
- **Las skills de `superpowers` NO se pegan**: las resuelve el harness (6.3.0 instalado, validado el 2026-09-07).
- **Prompt neutro**: no telegrafiar la conducta correcta. La conducta se infiere del log de acciones y se verifica en disco, no del autoinforme del agente.
- **Criterio de aceptación de un corte**: el tratamiento reproduce la conducta del control en **todos** los escenarios de esa skill. Un solo escenario degradado ⇒ corte rehecho o descartado, con motivo escrito.
- **Molde de fixture sin `.git`**: el `git init` y las ramas se crean en la copia por run.
- **Una copia de fixture por run.** Operaciones git de subagentes con `cd` explícito (su cwd de PowerShell no persiste).
- Art. I — ninguna edición de skill sin su ciclo de test documentado en `tests/`.
- Art. III — texto humano en castellano; nombres de fichero en inglés kebab-case. No se traduce.
- Art. VI — commits con tipo/scope en inglés, cuerpo en castellano, nunca title-only.
- Art. VIII — `skills/sdd-templates/templates/` no se toca.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? Sí en una dimensión, y está descartado en la spec §3: fijar el criterio de corte por adelantado y no medir cuesta ~15 runs en vez de ~50. Se rechaza porque decide por hipótesis lo que el hallazgo sobre superpowers ya puso en duda.
- [ ] **YAGNI gate**: no se crea ningún `references/` "por coherencia". Un fichero auxiliar existe solo si su corte sobrevivió al A/B.
- [ ] **Brownfield gate**: las 11 skills están en producción local. Retrocompatible por construcción: el nombre y la `description` de cada skill no cambian, así que ninguna invocación existente se rompe.
- [ ] **Constitution check**: el plan respeta Art. I (con la enmienda de la Task 1, aprobada en el gate de la spec), II, III, IV, VI, VII y VIII.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/tasks.md` — registro vivo (status + commit hash por task), porque el plan tiene 5 tasks.
- `tests/<skill>-ab.md` × 11 — evidencia por skill: cortes probados, aceptados, descartados y por qué.
- `skills/<skill>/references/<tema>.md` — **solo donde el A/B acepte el corte**. Cuántos y cuáles no se puede saber antes de medir; ese es el objeto de la task. Cero ficheros es un desenlace válido.

**Modificar**:

- `.docs/sdd/constitution.md` — Art. I: añadir el A/B de no-regresión como test de recortes.
- `.docs/sdd/architecture.md` — §"Anatomía de una skill del kit": criterio (a)+(b); §"Anatomía de la evidencia": `<skill>-ab.md`.
- `.docs/sdd/roadmap.md` — ítem T2 reescrito sin la premisa de `TodoWrite`.
- `.docs/sdd/tech-stack.md` — §Tests: el método A/B y sus aprendizajes.
- `skills/<skill>/SKILL.md` — solo las que pierdan un bloque aceptado por el A/B.

**NO se tocan**:

- `skills/sdd-templates/templates/*` — Art. VIII.
- Las 8 líneas "(crea un todo por paso)" — verificado que ya son lenguaje de acción agnóstico de harness (spec §1, verificación 1).
- `.claude-plugin/plugin.json` — el bump de versión pertenece al cierre de la release v0.6.0, no a esta task.
- La `description` del frontmatter de cualquier skill — es lo único que se carga en toda sesión; tocarla cambia el enrutado y es otro experimento.

### 1.2 Modelo de datos

No aplica.

### 1.3 Migraciones

No aplica.

### 1.4 Contratos

El "contrato" que esta task podría romper es la conducta que cada `SKILL.md` produce. El A/B es precisamente su test de contrato.

---

## 2. Tasks

Verificación: el proyecto no tiene tests automáticos (`tech-stack.md`), así que cada task cierra con evidencia narrativa verificada en disco.

### Task 1 — Ola 0: enmienda del Art. I y criterio en `architecture.md`

**Ficheros**: modificar `.docs/sdd/constitution.md`, `.docs/sdd/architecture.md`; crear `tasks.md`.

Va primero porque gobierna cómo se testea todo lo demás. Sin subagentes.

- [ ] **Step 1: Enmendar el Art. I.** En `.docs/sdd/constitution.md`, tras la frase "Aplica también a recortes, traducciones y «pequeños ajustes»", añadir:

  > Para un **recorte o reestructuración de una skill existente**, el baseline vacío no es el test: una versión recortada puede batir a un baseline sin skill y ser peor que la versión vigente. El test válido es el **A/B de no-regresión** — control (la versión vigente) contra tratamiento (la versión recortada), mismos escenarios, y el corte se publica solo si el tratamiento reproduce la conducta del control en todos ellos. La evidencia vive en `tests/<skill>-ab.md`. El RED contra baseline vacío sigue siendo el test de la guidance nueva.

- [ ] **Step 2: Fijar el criterio en `architecture.md`.** En §"Anatomía de una skill del kit", añadir un punto 6:

  > 6. **Ficheros auxiliares (`references/`)**: un bloque baja a `references/<tema>.md` solo si **(a)** aplica a un subconjunto de invocaciones, no a todas, y **(b)** se necesita después de decidir, no para decidir. Cumplirlas lo hace *candidato*; quien decide es el A/B. Se referencia con enlace relativo en el punto exacto del flujo, nunca con `@` (fuerza la carga y quema contexto). El harness inyecta `Base directory for this skill` al invocar y **no** carga los auxiliares por su cuenta.

- [ ] **Step 3: Anatomía de la evidencia.** En §"Anatomía de la evidencia (tests/)", añadir:

  > - `<skill>-ab.md`: campaña de no-regresión de un recorte. Registra los cortes probados, los aceptados y **los descartados con su motivo** — el descarte es el dato caro: evita que la siguiente campaña repita el experimento.

- [ ] **Step 4: Crear `tasks.md`** con las 5 tasks de este plan, estado `pendiente` y columna de commit hash.
- [ ] **Step 5: Verificación** — releer los tres bloques insertados: ningún artículo se contradice con el resto de la constitution, y el criterio (a)+(b) de `architecture.md` coincide literalmente con el de la spec §4.1.
- [ ] **Step 6: Commit** — `docs(sdd): el Art. I reconoce el A/B de no-regresión para recortes de skills`.

### Task 2 — Ola 1: A/B de `sdd-start-task`

**Ficheros**: crear `tests/sdd-start-task-ab.md`; modificar `skills/sdd-start-task/SKILL.md` y crear sus `references/` solo si algún corte sobrevive.

Escenarios ya escritos, tomados de sus GREEN — no se inventan:

| Id | Origen | Qué mide |
| --- | --- | --- |
| A | `tests/sdd-start-task-green.md` §Escenario A | Gate de la spec bajo presión ("ve al grano, el cliente lo espera hoy"): ¿crea solo `spec.md` y para?; naming con `0000`; no toca roadmap |
| B | `tests/sdd-start-task-green.md` §Escenario B | Bug determinista (ticket 217): ¿enruta al carril patch con carpeta `patch-`?; causa raíz antes del fix; no marca ✅ sin smoke |
| L | `tests/sdd-start-task-lite-green.md` §F2 | Modo lite: ¿cita las condiciones del predicado y espera confirmación, en vez de autoconcederse el atajo? |
| E5 | `tests/sdd-start-task-vias-green.md` | Spike ("pruébalo rápido"): ¿enruta a `sdd-consult` sin crear rama ni `spec.md`? |

- [ ] **Step 1: Construir el tratamiento.** Partir `skills/sdd-start-task/SKILL.md` en una copia de trabajo del scratchpad, moviendo a `references/` los bloques que cumplen (a)+(b):
  - `references/modo-lite.md` — la sección "Modo lite — predicado observable, activación del usuario" completa.
  - `references/nombrado.md` — "Nombrado de carpetas de spec" + "Módulos por predicado observable".
  - `references/overrides-superpowers.md` — la tabla "Overrides sobre superpowers" + "Cuándo NO aplicar SDD".
  En el `SKILL.md` quedan los gates ⛔, el enrutado, el checklist de 7 pasos, las red flags y la tabla de racionalizaciones, cada uno con su enlace relativo en el punto de uso (p. ej. en el paso 2: `cambio acotado que cumple el predicado → **modo lite** (condiciones en [modo-lite.md](references/modo-lite.md))`).
- [ ] **Step 2: Correr el control.** 4 subagentes Sonnet en paralelo, uno por escenario, con el `SKILL.md` vigente pegado por prompt y el prompt original palabra por palabra. Copia fresca de fixture por run.
- [ ] **Step 3: Correr el tratamiento.** Otros 4 subagentes, mismos escenarios y prompts, con el `SKILL.md` partido + sus `references/` pegados como ficheros disponibles (sin instrucción de leerlos).
- [ ] **Step 4: Verificar en disco.** Por cada run: qué ficheros se crearon, si hubo rama, si la carpeta lleva el prefijo correcto, si paró en el gate. El autoinforme no cuenta como evidencia.
- [ ] **Step 5: Bisecar si degrada.** Si el tratamiento falla algún escenario, repetirlo con los cortes aplicados de uno en uno para atribuir la degradación al corte concreto antes de descartarlo.
- [ ] **Step 6: Aplicar el veredicto.** Publicar en `skills/sdd-start-task/` solo los cortes aceptados. Si ninguno sobrevive, el `SKILL.md` queda intacto y eso es el resultado.
- [ ] **Step 7: Escribir `tests/sdd-start-task-ab.md`** — tabla control vs tratamiento por escenario, cortes aceptados, cortes descartados con motivo, y las hipótesis que heredan las olas 2 y 3.
- [ ] **Step 8: Checkpoint contigo** — presentar el veredicto y la respuesta a la Open question 2 de la spec (si la ola 1 sale vacía, ¿seguimos con las olas 2 y 3 o cerramos?).
- [ ] **Step 9: Commit** — `test(skills): A/B de no-regresión de sdd-start-task` (+ `refactor(skills):` aparte si hay cortes publicados).

### Task 3 — Ola 2: A/B de las cuatro skills medianas

**Ficheros**: crear `tests/sdd-end-release-ab.md`, `tests/sdd-consult-ab.md`, `tests/sdd-start-release-ab.md`, `tests/sdd-end-task-ab.md`; modificar sus `SKILL.md` y crear `references/` según veredicto.

Escenarios desde los GREEN existentes: `sdd-end-release-green.md`, `sdd-consult-green.md` + `sdd-consult-spike-green.md`, `sdd-start-release-green.md`, `sdd-end-task-green.md`.

- [ ] **Step 1: Derivar candidatos de la ola 1.** Aplicar a cada skill los tipos de bloque que sobrevivieron en la Task 2, y solo esos. Los tipos que degradaron no se vuelven a probar: ya tienen veredicto.
- [ ] **Step 2: Construir los 4 tratamientos.** Candidatos de partida: en `sdd-end-release`, el detalle de los pasos 2, 3, 5 y 6 del checklist; en `sdd-consult`, el detalle de los tres modos; en `sdd-start-release`, el detalle del triage; en `sdd-end-task`, el detalle por artefacto del cierre. Cada uno sujeto al Step 1.
- [ ] **Step 3: Correr control y tratamiento** de las 4 skills en paralelo, mismos escenarios y prompts que sus GREEN.
- [ ] **Step 4: Verificar en disco** run a run, igual que en la Task 2.
- [ ] **Step 5: Bisecar** donde degrade.
- [ ] **Step 6: Aplicar veredictos** y escribir los 4 ficheros `-ab.md`.
- [ ] **Step 7: Checkpoint contigo** con el resumen de las 4.
- [ ] **Step 8: Commit** — un commit por skill con corte publicado, más uno de evidencia.

### Task 4 — Ola 3: A/B de las seis skills pequeñas

**Ficheros**: crear `tests/sdd-start-patch-ab.md`, `tests/sdd-init-greenfield-ab.md`, `tests/sdd-init-brownfield-ab.md`, `tests/add-to-changelog-ab.md`, `tests/sdd-end-patch-ab.md`, `tests/sdd-templates-ab.md`.

Resultado esperado: no cortar. La ola deja evidencia de que 355–638 palabras ya están dimensionadas.

- [ ] **Step 1: Redactar escenarios para `sdd-templates`.** Es el hueco preexistente: no tiene `tests/sdd-templates-green.md` propio (su evidencia es `templates-single-source-green.md`). Escenario mínimo: pedir la creación de un artefacto SDD y verificar que se calca del skill y que no aparece ninguna carpeta `templates/` fuera de `skills/sdd-templates/`. El hueco se documenta como tal.
- [ ] **Step 2: Un escenario por skill** (dos si su GREEN documenta dos fallos distintos), control + tratamiento.
- [ ] **Step 3: Correr** los runs en paralelo. Control fresco solo si el tratamiento se desvía de lo que documenta su GREEN.
- [ ] **Step 4: Verificar en disco** y escribir los 6 ficheros `-ab.md`, incluidos los "sin cortes: la skill se queda como está".
- [ ] **Step 5: Commit** — `test(skills): A/B de las seis skills cortas del kit`.

### Task 5 — Cierre documental

**Ficheros**: modificar `.docs/sdd/roadmap.md`, `.docs/sdd/tech-stack.md`.

- [ ] **Step 1: Reescribir el ítem T2 del roadmap.** Quitar "(TodoWrite retirado en Claude Code v2.1.233)" y el pendiente asociado; sustituir por el resultado real de la campaña y la verificación: superpowers 6.3.0 conserva la instrucción como lenguaje de acción (Phase E; `docs/porting-to-a-new-harness.md:469`) y usa `references/` para contenido condicional, no para adelgazar. Retirar de la tabla de deuda técnica la fila de las 1503 palabras y sustituirla por el veredicto medido.
- [ ] **Step 2: Ampliar `tech-stack.md` §Tests** con el método A/B: control pegado por prompt desde el working tree, tratamiento con auxiliares no forzados, criterio de aceptación en todos los escenarios, bisección antes de descartar, y lo que la campaña haya enseñado sobre ruido entre runs.
- [ ] **Step 3: Verificación** — `grep -rn "TodoWrite" .docs/` no devuelve ninguna afirmación viva sobre arreglar las 8 skills.
- [ ] **Step 4: Commit** — `docs(sdd): T2 reescrita con el resultado de la campaña A/B`.

El cierre de la task (walkthrough, changelog, roadmap ✅, tiempo real) va por `sdd-end-task`, no por este plan.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7 h
- Estimación de implementación: **3,5 h** (rango 2,5–5)
- Base de la estimación: 5 tasks; ~50 runs de subagente que corren en paralelo (minutos, no horas) y **11 ficheros de evidencia a redactar, que son el grueso real** (~10 min cada uno según el método de `estimation.md`, 2026-09-07). Ediciones de docs de una a tres líneas. El estimation-log da ratio mediano 0,25–0,38 en tasks de docs con campaña, sesgo que esta estimación ya intenta corregir estimando en minutos por artefacto en vez de en horas de trabajo secuencial. La incertidumbre alta está en las bisecciones: si la ola 1 degrada en varios cortes, cada bisección añade una ronda.
- Confianza: media

---

## 3. Validación final

- [ ] No hay build que ejecutar (Markdown puro): en su lugar, las 11 skills conservan frontmatter válido y ningún enlace relativo a `references/` queda roto.
- [ ] Los 6 criterios de éxito de la spec §2 verificados uno a uno.
- [ ] Cada corte publicado tiene su evidencia; cada corte descartado, su motivo.
- [ ] Cierre por `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- Criterio 1 (11 ficheros `tests/<skill>-ab.md`) → Tasks 2, 3, 4. ✓
- Criterio 2 (ningún corte publicado sin reproducir la conducta del control) → Restricciones globales + Step de veredicto de las Tasks 2, 3, 4. ✓
- Criterio 3 (Art. I reconoce el A/B) → Task 1, Step 1. ✓
- Criterio 4 (`architecture.md`: criterio y anatomía de la evidencia) → Task 1, Steps 2 y 3. ✓
- Criterio 5 (T2 del roadmap reescrito) → Task 5, Step 1. ✓
- Criterio 6 (`tech-stack.md` con el método A/B) → Task 5, Step 2. ✓
- Spec §4.5 edge case "degradación parcial" → Tasks 2/3/4, Step de bisección + criterio global. ✓
- Spec §4.5 edge case "control degradado respecto a su GREEN" → Task 4, Step 3 (y Restricciones globales: control fresco en olas 1 y 2). ✓
- Spec §4.5 edge case "el subagente invoca la copia en cache" → Restricciones globales (entrega por prompt; se anota si ocurre). ✓
- Spec §4.5 edge case "`sdd-templates` sin GREEN propio" → Task 4, Step 1. ✓
- Spec §10 Open question 1 (modelo y coste) → Restricciones globales, pendiente de confirmación antes del primer subagente. ✓
- Spec §10 Open question 2 (ola 1 vacía) → Task 2, Step 8 (checkpoint). ✓
- Spec §2 NO objetivos (traducción, plantillas, las 8 líneas, bump) → §1.1 "NO se tocan". ✓
