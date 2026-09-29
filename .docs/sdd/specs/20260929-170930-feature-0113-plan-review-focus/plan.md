---
id: 20260929-170930-feature-0113-plan-review-focus
feature: 0113
title: Plan de implementación — El plan lleva su Review Focus y el revisor final lo recibe
spec: ./spec.md
status: approved
created: 2026-09-29
---

# Plan de implementación — El plan lleva su Review Focus y el revisor final lo recibe

## Decisiones que he tomado yo — valida estas

1. **Modelo y effort**: las dos tasks las hace la sesión (Native). Son ediciones de texto de guía, con sus tests Pester, sin despacho de implementadores. El revisor final va con `sdd-kit:effort-high` + `opus`, el techo del kit.
2. **Ejecución**: native. Son dos tasks cortas sobre las mismas frases de la guía, y la segunda depende del texto de la primera; un subagente por task costaría más que el cambio.
3. **Tests estáticos en un fichero nuevo, `tests/PlanReviewFocus.Tests.ps1`**, con el idioma de `TestableTasks.Tests.ps1` (`Get-KitFile` y `Assert-Literal`). Ningún fichero existente es «el de la plantilla»: la leen seis.
4. **La sección `## Review Focus` del encargo del revisor final queda a expensas del RED r** (decisión 6 de la spec). Si el RED la demuestra, entra en la Task 1; si no, la Task 1 solo añade el test de no regresión sobre la frase de `executing-plans`, y el hueco queda anotado en la evidencia.
5. **Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado**; ver la sección.
6. **Coste estimado**: ~1,5 h de implementación, más la campaña de la spec (≤ 14 sujetos, ≤ 16 $).

**Goal**: la plantilla del plan tiene `## Review Focus` con su ayuda, sus tests entran en el contrato RED del hilo y el revisor final la recibe.

**Architecture**: son cambios de texto en la plantilla, en el paso 6 de `sdd-start-feature` y en `encargo-revision.md`, fijados con tests Pester de literales. La conducta la miden los sujetos headless de la campaña, en RED y en GREEN.

**Tech Stack**: Markdown de skills y plantillas; Pester 6 (`tests/*.Tests.ps1`); sujetos con `tests/headless/run.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque son dos tasks cortas y encadenadas sobre las mismas frases de la guía. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Nombre literal de la sección: `## Review Focus`, en inglés, como lo buscan `writing-plans` y `executing-plans`.
- Sitio: entre «Restricciones globales» y «Phase -1» de `plan-template.md`.
- Texto humano en castellano con ortografía correcta (Art. III).
- Art. X, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos: la del Art. IV; el revisor final con `sdd-kit:effort-high` + `opus`; `fable` y `opus xhigh` prohibidos por defecto.
- Commits bilingües (Art. VI), con la historia de apertura, una por task y cierre (`commit-milestones.md`).
- Campaña: techo de 14 sujetos y 16 $ para RED y GREEN juntos (spec, decisión 9).

## Review Focus

1. Un plan de una sola task o de solo documentación, donde ninguna entrada queda sin test → la sección dice «ninguna: comprobado» y no se borra con los bloques de ayuda · Task 1, `plan-template keeps an empty Review Focus instead of deleting it`
2. Una línea del Review Focus que ninguna task puede probar (visual, de entorno) → nombra la verificación que la cubre en lugar del test, sin quedar fuera del contrato · Task 1, `plan-template names the verification when a line has no test`
3. Native, donde no hay despacho y el hilo escribe el test y el código → el test de la línea se escribe antes del código, como los de los THEN · control e del GREEN, con Opus (Task 2 cancelada por el RED)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: se adopta la sección de superpowers; el kit solo añade dónde van sus tests.
- [x] **YAGNI gate**: la sección del encargo solo entra si el RED la demuestra.
- [x] **Constitution check**: Art. I (RED/GREEN), Art. VIII (una plantilla), Art. IX (citar, no copiar).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/PlanReviewFocus.Tests.ps1` — literales de la plantilla, del paso 6 y del encargo.
- `tests/plan-review-focus-red.md` y `tests/plan-review-focus-green.md` — evidencia de la campaña.

**Modificar**:

- `skills/sdd-templates/templates/plan-template.md` — sección `## Review Focus`, línea en la ayuda de «Decisiones», ayuda de «Tests RED» y fila del self-review §4.
- `skills/sdd-start-feature/references/encargo-revision.md` — la frase de «Encargo del implementador» sobre quién escribe los tests y, si el RED r falla, `## Review Focus` en «Revisor final».
- `skills/sdd-start-feature/SKILL.md` — paso 6 (SDD y Native) y la racionalización «El implementador ya hace TDD…».

**NO se tocan**:

- `SKILL.md:53` y `walkthrough-template.md:57` — son el smoke de la validación (una fila por THEN), no los tests RED.
- El modelo del revisor final en «Revisor final» — es de la 0108.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El Review Focus alarga cada plan y los sujetos copian cuerpos | Baja | Medio | Control del GREEN p: el plan no copia cuerpos (patch 0082) |
| La 0108 cierra antes y choca en «Revisor final» | Media | Bajo | Frases distintas; quien cierre después integra |

### 1.8 Rollout

Directo: la plantilla la calcan los proyectos en su próximo plan. Sin migración.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La plantilla del plan lleva el Review Focus y el revisor final lo recibe

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/PlanReviewFocus.Tests.ps1` (Describe «Plantilla» y «Encargo»); Native: TDD del propio hilo
**Superficies**: docs, tooling
**Verificación**: `Invoke-Pester tests/PlanReviewFocus.Tests.ps1`
**Se prueba en la aplicación**: no, porque es guía del kit sin aplicación: lo prueba el escenario p del GREEN, un sujeto que escribe un plan con la plantilla.

**Interfaces**:
- Consume: nada.
- Produce: la sección `## Review Focus` de `plan-template.md`, cuyas líneas tienen la forma `<entrada o condición> → <comportamiento esperado> · Task <n>, <nombre del test>`, o «ninguna: comprobado». La Task 2 la nombra en el paso 6.

**Ficheros**: modificar `skills/sdd-templates/templates/plan-template.md` y `skills/sdd-start-feature/references/encargo-revision.md`; crear `tests/PlanReviewFocus.Tests.ps1`.

- [ ] **Step 1: Tests RED** en `tests/PlanReviewFocus.Tests.ps1`:
  - `plan-template has Review Focus between global constraints and Phase -1`: el índice de `"`n## Review Focus"` es mayor que el de `## Restricciones globales` y menor que el de `## Phase -1`.
  - `plan-template help cites writing-plans and names the owning task`: `Assert-Literal` sobre la sección con `superpowers:writing-plans`, `Task <n>` y `ninguna: comprobado`.
  - `plan-template keeps an empty Review Focus instead of deleting it`: la sección dice que no se borra con los bloques de ayuda (literal `no se borra`).
  - `plan-template names the verification when a line has no test`: literal `«Verificación visual»` dentro de la sección.
  - `plan-template decisions summarize the Review Focus`: la ayuda de «Decisiones que he tomado yo» contiene `Review Focus: <n> entradas`.
  - `plan-template Tests RED include the Review Focus lines`: la ayuda bajo «Tests RED» contiene `y uno por línea del Review Focus`.
  - `plan-template self-review lists each Review Focus line`: §4 contiene `<línea del Review Focus> → Task <n>, test <nombre>. ✓`.
  - `implementer brief says tests come from THEN and Review Focus`: `encargo-revision.md` contiene `desde los THEN de la spec y las líneas del Review Focus del plan`.
  - Solo si el RED r falla: `final reviewer brief carries the Review Focus verbatim`: la sección «Revisor final» contiene `## Review Focus` y `copia literal`. Si el RED r pasa: `final reviewer brief relies on executing-plans for the Review Focus`, que comprueba en la caché de superpowers 6.4.2 (`executing-plans/SKILL.md`) el literal `the plan's Review Focus section`; se omite (`-Skip`) si la caché no está.
- [ ] **Step 2: Build** — no hay build: `Invoke-Pester` compila el fichero. Esperado: los tests nuevos fallan por el literal.
- [ ] **Step 3: Implementación** — edita `plan-template.md`: la sección entre el bloque «De proceso» y el `---` de «Phase -1», con una ayuda de ≤ 6 líneas y un ejemplo del dominio de la plantilla (`status=Foo` → 400); la línea en la ayuda de «Decisiones»; la frase de «Tests RED»; la fila del §4. En `encargo-revision.md`, la frase del implementador y, si toca, la sección del revisor final tras «Cómo revisar».
- [ ] **Step 4: Verificación** — `Invoke-Pester tests/PlanReviewFocus.Tests.ps1`: verde. También `Invoke-Pester tests/TestableTasks.Tests.ps1, tests/TaskVerification.Tests.ps1, tests/SuperpowersCompat.Tests.ps1, tests/DispatchBrief.Tests.ps1`, que leen la plantilla: verde.
- [ ] **Step 5: Commit de la task** — `feat(templates): sección Review Focus en el plan`.

### Task 2 — El hilo escribe los tests del Review Focus como un RED más

> **Cancelada por el RED** (2026-09-29): el baseline e escribe el test de la línea 2 de 2; ruling en el ledger y en `tests/plan-review-focus-red.md`.

**Modelo**: la sesión (Native)
**Tests RED**: hilo principal · `tests/PlanReviewFocus.Tests.ps1` (Describe «sdd-start-feature»); Native: TDD del propio hilo
**Superficies**: docs, tooling
**Verificación**: `Invoke-Pester tests/PlanReviewFocus.Tests.ps1`
**Se prueba en la aplicación**: no, porque es guía del kit: lo prueba el escenario e del GREEN.

**Interfaces**:
- Consume: la forma de la línea del Review Focus de la Task 1 (`… · Task <n>, <nombre del test>`).
- Produce: nada.

**Ficheros**: modificar `skills/sdd-start-feature/SKILL.md` y `tests/PlanReviewFocus.Tests.ps1`.

- [ ] **Step 1: Tests RED** en `tests/PlanReviewFocus.Tests.ps1`, con el paso 6 extraído como en `TestableTasks.Tests.ps1` (`Get-SkillStep 6`):
  - `step 6 writes one test per THEN and per Review Focus line`: literal `uno por THEN y uno por línea del Review Focus que nombra la task`.
  - `step 6 names Review Focus tests in Native too`: literal `los tests de sus THEN y de sus líneas del Review Focus antes del código`.
  - `rationalization says tests come from THEN and Review Focus`: la fila «El implementador ya hace TDD…» contiene `de los THEN de la spec y del Review Focus del plan`.
- [ ] **Step 2: Build** — ninguno. Esperado: los tres fallan por el literal.
- [ ] **Step 3: Implementación** — las tres frases de `SKILL.md`, sin tocar el resto del paso.
- [ ] **Step 4: Verificación** — `Invoke-Pester tests/PlanReviewFocus.Tests.ps1, tests/TestableTasks.Tests.ps1, tests/NativeAdapt.Tests.ps1, tests/Skills.Tests.ps1`: verde.
- [ ] **Step 5: Commit de la task** — `feat(sdd-start-feature): el hilo escribe los tests del Review Focus`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1 h
- Estimación de implementación: 1,5 h, más la campaña (~2,5 h de reloj)
- Base de la estimación: 2 tasks de texto con literales; campañas parecidas: patch 0082 (2,5 h, 10 sujetos)
- Confianza: media (el REFACTOR depende del GREEN)

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: la suite Pester completa sin `Slow`.
- [ ] GREEN de la campaña (p, e, r con 2 sujetos cada uno) contra el RED, con sus controles; evidencia en `tests/plan-review-focus-green.md`.
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review).
- [ ] Cierre con `sdd-end-feature`.

---

## 4. Self-review (cobertura spec → tasks)

- ADDED «El plan lleva su Review Focus y viaja al revisor final»: sección, sitio, línea en «Decisiones» y fila del §4 → Task 1. ✓
- ADDED, el AND del encargo del revisor final → Task 1, condicionado al RED r (decisión 6). ✓
- MODIFIED «Los tests de la spec preceden al implementador» → Task 2 (paso 6) y Task 1 (ayuda de «Tests RED» y frase del encargo del implementador). ✓
- Decisión 10 (tests estáticos) → Tasks 1 y 2, `tests/PlanReviewFocus.Tests.ps1`. ✓
- Review Focus 1 → Task 1, `plan-template keeps an empty Review Focus instead of deleting it`. ✓
- Review Focus 2 → Task 1, `plan-template names the verification when a line has no test`. ✓
- Review Focus 3 → control e del GREEN (Task 2 cancelada por el RED). ✓
- Scope «No entra» (lite, 0108, resto de la 0054) → ninguna task los toca. ✓
