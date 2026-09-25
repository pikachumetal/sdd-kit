---
id: 20260924-231636-task-0062-plan-entry
task: 0062
title: Plan de implementación — sdd-plan, una sola puerta de entrada al roadmap, con el carril proposal
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — `sdd-plan`, una sola puerta de entrada al roadmap, con el carril `proposal`

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native**: lo recomienda el handoff. Las seis tasks tocan texto de skills y plantillas que se leen entre sí (la plantilla de la propuesta, la skill que la calca, los tests que las leen), el plan es corto y un error se ve en el GREEN antes del merge. Con `delegate` no hay gate de plan.
2. **Revisor final**: Opus con effort high, el techo del Art. IV para Native. Los tipos `sdd-kit:effort-*` no están en esta sesión: `general-purpose` + `model: opus` y «effort: no disponible en este harness, hereda el de la sesión» (ruling ya registrado en la spec).
3. **Tests RED por task en `tests/PlanEntry.Tests.ps1`** (fichero nuevo, contratos de texto sobre skills y plantillas, como `TaskIds.Tests.ps1`) y en `tests/Get-NextSddId.Tests.ps1` (Task 1). Cada bloque se escribe antes de su task, se copia fuera del repo y entra en el commit de la task: el pre-commit rechaza un test rojo, así que el bloque de una task no se añade hasta que empieza.
4. **`Build-EstimationLog.ps1` no se toca ni se testea aquí** (es de la 0068): en la Task 1 se ejecuta una vez sobre una fixture con una carpeta `-proposal-` para confirmar que la ignora. Si no la ignora, se anota para la 0068 y no se arregla.
5. **La campaña GREEN (Task 6)** reutiliza `red/subject.sh` y `red/run.sh` con `OUT_NAME=green`, sobre una copia del kit sacada con `git archive` del commit de la Task 5. Techo común: 50 sujetos y 25 $; van gastados 22 y 5,92 $.
6. **Coste estimado**: ~4 h de reloj, ~6 $ de sujetos y ~150k tokens del revisor final.

**Goal**: una skill `sdd-plan` que reconoce cinco entradas y el scope de release y deja el roadmap (y la propuesta si toca) sin arrancar nada; retirar `sdd-start-release`; renombrar la rama sin id tras reservar.

**Architecture**: la skill nueva lleva el contrato de salida de la propuesta y del roadmap y la tabla de racionalizaciones del RED y de `sdd-start-release`. La plantilla de la propuesta vive en `sdd-templates` (Art. VIII). El carril `proposal` entra en `nombrado.md` y en el patrón de `Get-NextSddId.ps1`.

**Tech Stack**: Markdown (SKILL.md, plantillas), PowerShell 7 con Pester ≥ 5, sujetos headless `claude -p --model sonnet` con Git Bash.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks comparten texto que se lee entre sí y el plan cabe en una sesión. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger.

## Restricciones globales

### De código

- Art. X, literal: **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario. **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`. Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
- Patrón de carpetas de `Get-NextSddId.ps1`: `-(?:task|patch|proposal)-(\d{4})[a-z]*-`.
- Carpeta de una propuesta: `specs/<yyyyMMdd-HHmmss>-proposal-<id>-<slug>/proposal.md`.
- Dependencia en la fila: «tras NNNN» en la celda «Ítem», sin columna nueva.
- Descarte: `⏸️ aparcada: descartada por <quién>, <fecha>`.
- Renombrado: `git branch -m feature/<id>-<slug>`, solo con la rama sin id y sin commits propios frente a la rama de integración.
- La unidad se sigue llamando «task» (el renombrado a feature es la 0064).
- Todo test que cree repos git o lance procesos lleva `-Tag 'Slow'`; todo `*.Tests.ps1` que ejecute git dot-sourcea `tests/Clear-GitEnv.ps1` (lo exige `GitEnvConvention.Tests.ps1`).

### De proceso

- No se tocan: `constitution.md`, `tech-stack.md` (0058); `sdd-end-release/` y sus `references/`, `release-notes-template.md` (0063); `sdd-end-patch/`, `patch-template.md`, `capabilities/` (0067, el delta se fusiona en el cierre tras integrar develop); `Build-EstimationLog.ps1` y el cierre de `sdd-end-task` (0068); `control-profiles.md` (patch del cruce de ficheros).
- Revisor final: `general-purpose` + `model: opus`, effort no disponible en este harness.
- Sujetos del GREEN: Sonnet, headless, sin `AskUserQuestion`.
- Commits: tipo/scope en inglés, cuerpo en castellano; uno por task al acabarla (Native: tras comparar sus RED); `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una skill, una plantilla, un cambio de patrón. Sin `references/` en `sdd-plan`: todo lo que decide va en su `SKILL.md` (architecture.md, predicado de auxiliares).
- [x] **YAGNI gate**: sin columna de dependencias ni de responsable; sin estado en el reparto; sin guía para lo que el RED sacó limpio.
- [x] **Brownfield gate**: las carpetas y filas existentes no cambian; el patrón nuevo conserva el sufijo heredado.
- [x] **Constitution check**: Art. I (RED hecho, GREEN en la Task 6), Art. III, Art. VIII (plantilla en `sdd-templates`), Art. X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-plan/SKILL.md` — la skill.
- `skills/sdd-templates/templates/proposal-template.md` — plantilla de la propuesta.
- `tests/PlanEntry.Tests.ps1` — contratos de texto de la task.
- `tests/sdd-plan-green.md` — evidencia GREEN.

**Modificar**:

- `skills/sdd-templates/scripts/Get-NextSddId.ps1` — patrón de carpetas.
- `tests/Get-NextSddId.Tests.ps1` — dos casos de `proposal`.
- `skills/sdd-templates/SKILL.md` — índice de plantillas y línea de artefactos de specs.
- `skills/sdd-templates/templates/spec-template.md` — campo `proposal:`.
- `skills/sdd-templates/templates/roadmap-template.md` — «tras NNNN», `sdd-plan` en lugar de `sdd-start-release`.
- `skills/sdd-templates/templates/feedback-template.md` — quién lee el acta.
- `skills/sdd-start-task/references/nombrado.md` — carril `proposal` y renombrado de la rama.
- `skills/sdd-start-patch/SKILL.md` — paso 2, renombrado.
- `skills/sdd-consult/SKILL.md` — handoff.
- `hooks/router.md` — línea de planificar.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — aviso de la retirada.
- `README.md` — tabla de skills y recuento de plantillas.
- `.docs/sdd/architecture.md`, `.docs/sdd/mission.md`, `.docs/workflow/greenfield.md`, `.docs/workflow/brownfield.md` — menciones.
- `tests/TaskIds.Tests.ps1`, `tests/ReleaseFlow.Tests.ps1`, `tests/MigrationInitParity.Tests.ps1`, `tests/WorkflowDocs.Tests.ps1` — leen `sdd-plan`.

**Borrar**: `skills/sdd-start-release/` (con sus dos `references/`).

**NO se tocan**: los de «De proceso»; `tests/sdd-start-release-ab.md` (histórico); `skills/sdd-start-task/SKILL.md` («tras NNNN» recortado por el RED); el paso 1 de `sdd-start-patch` (recortado).

### 1.6 Dependencias

`superpowers:brainstorming` (la técnica de la entrevista), `Get-NextSddId.ps1 -Reserve -Count N`.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| La guía nueva de `sdd-plan` rompe una conducta limpia del RED (p2, p5) | media | medio | controles en el GREEN (Art. I) |
| Conflicto con la 0063 en `.docs/workflow/` | media | bajo | solo se cambian las palabras `sdd-start-release`; se integra develop antes del cierre |
| `Skills.Tests.ps1` exige README e índice al día | alta | bajo | la Task 2 y la 3 los actualizan con su test |

### 1.8 Rollout

Con la release 2.0.0. La migración v1.2.0 avisa de la retirada.

### 1.9 Excepciones a la constitution

Ninguna. El Art. IV (naming) necesita `(task|patch|proposal)`, pero es de la 0058: se propone en el cierre.

---

## 2. Tasks

### Task 1 — `Get-NextSddId.ps1` reconoce el carril `proposal`

**Modelo**: Native, el hilo principal.
**Tests RED**: hilo principal · `tests/Get-NextSddId.Tests.ps1`, dos `It` nuevos en un `Context 'carril proposal'`, antes del código.
**Superficies**: tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/Get-NextSddId.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es un script sin interfaz: la comprobación es el test.

**Interfaces**:
- Consume: nada.
- Produce: `$script:SpecFolderIdPattern = '-(?:task|patch|proposal)-(\d{4})[a-z]*-'`.

**Ficheros**: modificar `skills/sdd-templates/scripts/Get-NextSddId.ps1:38`, `tests/Get-NextSddId.Tests.ps1`.

- [ ] **Step 1: RED** — dos `It` que siguen el patrón del `Context 'histórico con sufijos anteriores a la secuencia'`: (a) con `specs/20260915-090000-proposal-0020-billing/` y un roadmap con la fila 0019, el script propone `0021`; (b) con `specs/20260915-090000-proposal-0020a-billing/`, propone `0021`. Ejecutar: fallan (proponen `0020`).
- [ ] **Step 2: Implementación** — cambiar la línea 38 al patrón de «Produce» y la ayuda (`.SYNOPSIS`: «task/patch/proposal»).
- [ ] **Step 3: Verificación** — el comando de arriba en verde.
- [ ] **Step 4: Comprobación para la 0068** — `Build-EstimationLog.ps1` sobre una fixture de scratchpad con `specs/…-task-0001-x/walkthrough.md` y `specs/…-proposal-0002-y/proposal.md`: la salida no tiene fila 0002. Resultado al ledger.
- [ ] **Step 5: Commit de la task**.

### Task 2 — Plantilla de la propuesta y carril `proposal` en las plantillas

**Modelo**: Native, el hilo principal.
**Tests RED**: hilo principal · `tests/PlanEntry.Tests.ps1`, `Describe 'Carril proposal'`.
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PlanEntry.Tests.ps1,tests/Skills.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque es una base común que usa la Task 3: la comprobación es el test.

**Interfaces**:
- Consume: el patrón de carpeta de la Task 1.
- Produce: `proposal-template.md` con estas secciones literales, en este orden: `## Por qué`, `## Reglas de negocio`, `## Capacidades que toca`, `## Reparto` (tabla `| Orden | Id | Feature | Tras |`), `## Acta`, `## Enmiendas`; frontmatter `id`, `proposal`, `title`, `source: interview | meeting`, `created`. Campo `proposal: <id>` opcional en `spec-template.md`.

**Ficheros**: crear `skills/sdd-templates/templates/proposal-template.md`; modificar `spec-template.md`, `roadmap-template.md`, `feedback-template.md`, `skills/sdd-templates/SKILL.md`, `skills/sdd-start-task/references/nombrado.md`, `README.md` (recuento de plantillas).

- [ ] **Step 1: RED** — tests: la plantilla existe con las seis secciones en orden; su ayuda dice que las reglas llevan un ejemplo con datos, que el reparto no lleva estado y es la lista completa, y que las enmiendas van fechadas y la más reciente arriba sin reescribir las reglas; `spec-template.md` tiene `proposal:`; `nombrado.md` dice `(task|patch|proposal)`; `roadmap-template.md` dice «tras NNNN» y nombra `sdd-plan`, no `sdd-start-release`; `feedback-template.md` no nombra `sdd-start-release`.
- [ ] **Step 2: Implementación** — la plantilla, con el ejemplo en otro dominio que el molde del GREEN (préstamo de libros de una biblioteca, no reservas de salas); los cambios de una línea en las demás; el índice de `sdd-templates` y el recuento del README.
- [ ] **Step 3: Verificación** — el comando de arriba en verde.
- [ ] **Step 4: Commit de la task**.

### Task 3 — Skill `sdd-plan` y entrada por el router

**Modelo**: Native, el hilo principal.
**Tests RED**: hilo principal · `tests/PlanEntry.Tests.ps1`, `Describe 'sdd-plan'`.
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PlanEntry.Tests.ps1,tests/Skills.Tests.ps1,tests/Hook.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no con la suite: la conducta se mide en el GREEN (Task 6).

**Interfaces**:
- Consume: `proposal-template.md` (Task 2), `Get-NextSddId.ps1 -Reserve -Count N` (Task 1).
- Produce: `skills/sdd-plan/SKILL.md` con `name: sdd-plan`.

**Ficheros**: crear `skills/sdd-plan/SKILL.md`; modificar `hooks/router.md`, `README.md` (fila de la tabla de skills).

- [ ] **Step 1: RED** — tests sobre el texto: `description` empieza por «Usar» y nombra «prepara la release», «reunión» y «roadmap»; la skill nombra las cinco entradas; calca `proposal-template.md`; dice que no crea rama, carpeta de task ni spec; dice «tras NNNN», «⏸️ aparcada: descartada por» y `-Reserve -Count`; nombra `release.hasRecipient`; nombra `superpowers:brainstorming` con el override de que no acaba en spec; `hooks/router.md` nombra `sdd-kit:sdd-plan`.
- [ ] **Step 2: Implementación** — `SKILL.md` con: Overview (tres verbos; proponer no es decidir); cómo se reconoce cada entrada (decisión 3 de la spec, con el criterio del verbo); qué deja cada entrada (decisiones 4–11); la sección de release (decisión 13) con el estado real y la publicación de la reserva; red flags y tabla de racionalizaciones con las frases del RED (`tests/sdd-plan-red.md`) y las de `sdd-start-release` que siguen aplicando. Línea del router y fila del README.
- [ ] **Step 3: Verificación** — el comando de arriba en verde.
- [ ] **Step 4: Commit de la task**.

### Task 4 — Retirada de `sdd-start-release`

**Modelo**: Native, el hilo principal.
**Tests RED**: hilo principal · `tests/PlanEntry.Tests.ps1`, `Describe 'Retirada de sdd-start-release'`; y los tests existentes que leen la skill, reapuntados a `sdd-plan`.
**Superficies**: docs, tooling
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Detailed"` (los tests que cambian están repartidos por la suite rápida)
**Se prueba en la aplicación**: no con la suite: p6 del GREEN la mide.

**Interfaces**:
- Consume: `skills/sdd-plan/SKILL.md` (Task 3), que debe contener `hasRecipient`, `sequence`, `-Reserve -Count`, «Ficheros que toca» y «nunca «por definir»».
- Produce: ninguna mención viva a `sdd-start-release` fuera de `tests/*-ab.md`, `tests/*-red.md`, `.docs/sdd/specs/`, `field-reports/`, `releases/`, `changelog.md`, `roadmap.md` y `sdd-end-release/SKILL.md` (pendiente de la 0063).

**Ficheros**: borrar `skills/sdd-start-release/`; modificar `README.md`, `skills/sdd-consult/SKILL.md`, `.docs/sdd/architecture.md`, `.docs/sdd/mission.md`, `.docs/workflow/greenfield.md`, `.docs/workflow/brownfield.md`, `skills/sdd-init-brownfield/references/migrations/v1.2.0.md`, `tests/TaskIds.Tests.ps1`, `tests/ReleaseFlow.Tests.ps1`, `tests/MigrationInitParity.Tests.ps1`, `tests/WorkflowDocs.Tests.ps1`.

- [ ] **Step 1: RED** — test: `skills/sdd-start-release` no existe; un `git grep -l sdd-start-release` sobre `skills hooks README.md .docs/workflow .docs/sdd/architecture.md .docs/sdd/mission.md` devuelve solo `skills/sdd-end-release/SKILL.md`; la v1.2.0 tiene un paso que nombra `sdd-start-release` y `sdd-plan`. Los tests existentes se reapuntan a `skills/sdd-plan/SKILL.md` (fallan hasta el Step 2 si la Task 3 no dejó algún literal).
- [ ] **Step 2: Implementación** — borrar la carpeta; sustituir las menciones (handoff de `sdd-consult`: «planificar, meter en el roadmap o preparar una release → `sdd-plan`»); añadir `sdd-start-release` a la lista de retirados de `WorkflowDocs.Tests.ps1`; paso sin gate en la v1.2.0: «**`sdd-start-release` retirada.** Sin predicado ni cambios en el proyecto: el informe dice que "prepara la release" y replanificar pasan a `sdd-plan`».
- [ ] **Step 3: Verificación** — el comando de arriba en verde.
- [ ] **Step 4: Commit de la task**.

### Task 5 — Renombrar la rama sin id tras reservar

**Modelo**: Native, el hilo principal.
**Tests RED**: hilo principal · `tests/PlanEntry.Tests.ps1`, `Describe 'Rama sin id'`.
**Superficies**: docs
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/PlanEntry.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no con la suite: p8b del GREEN la mide.

**Interfaces**:
- Consume: nada.
- Produce: la regla en `nombrado.md` y la frase en el paso 2 de `sdd-start-patch`.

**Ficheros**: modificar `skills/sdd-start-task/references/nombrado.md`, `skills/sdd-start-patch/SKILL.md`.

- [ ] **Step 1: RED** — tests: `nombrado.md` y el paso 2 de `sdd-start-patch` nombran `git branch -m`, «sin commits propios» y la rama sin id; ninguno de los dos habla de renombrar una rama que ya lleva otro id.
- [ ] **Step 2: Implementación** — en `nombrado.md`, tras la línea de `<id>`: «Si al reservar ya estás en una rama sin id (`feature/fix-sala`) y sin commits propios frente a la rama de integración, renómbrala antes del primer commit con `git branch -m feature/<id>-<slug>` y dilo; con commits propios, no la renombres: avisa y sigue». En el paso 2 de `sdd-start-patch`, una frase que remite a esa regla, citando el RED (p8b, 2/2 commitean en `feature/fix-sala`).
- [ ] **Step 3: Verificación** — el comando de arriba en verde.
- [ ] **Step 4: Commit de la task**.

### Task 6 — GREEN

**Modelo**: Native, el hilo principal; sujetos Sonnet headless.
**Tests RED**: no aplica: es la medición del Art. I.
**Superficies**: docs
**Verificación**: los 22 sujetos leídos contra las medidas de `tests/sdd-plan-red.md`.
**Se prueba en la aplicación**: no; la evidencia es `tests/sdd-plan-green.md`.

**Interfaces**:
- Consume: el kit en el commit de la Task 5.
- Produce: `tests/sdd-plan-green.md` y `green/out/`.

**Ficheros**: crear `tests/sdd-plan-green.md`, `.docs/sdd/specs/20260924-231636-task-0062-plan-entry/green/out/`.

- [ ] **Step 1** — `git archive HEAD skills hooks .claude-plugin agents README.md` a `scratchpad/kit-green`.
- [ ] **Step 2** — dos lotes, `OUT_NAME=green`, `SCENARIOS="p1 p2 p3 p4 p5"` y `"p6 p7 p8 p8b p9 p10"`, `SUBJECT=1` y `2`. p6 ya no necesita `KIT_DIR_P6`.
- [ ] **Step 3** — leer cada sujeto con las medidas del RED; comprobar en el stream que p1–p6 y p10 cargaron `sdd-plan`.
- [ ] **Step 4** — si algo falla: REFACTOR de la skill y una tanda del escenario, dentro del techo (50 sujetos, 25 $). Si se superaría, parar y preguntar.
- [ ] **Step 5** — `tests/sdd-plan-green.md` y commit.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 2,5 h (RED de 22 sujetos, spec con review y plan; con la pausa de la noche fuera)
- Estimación de implementación: 2,5–4 h
- Base de la estimación: seis tasks, cuatro de texto y una de script con test; la campaña GREEN se estima como redacción (~10 min por fichero de evidencia) más la lectura de 22 sujetos (aviso de `estimation.md`); REFACTOR condicionado al GREEN.
- Confianza: media.

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (suite completa, `Slow` incluidos).
- [ ] Revisión final de rama: Opus, `general-purpose`, con el bloque «De código».
- [ ] Criterios de la spec: los escenarios del GREEN.
- [ ] Cierre con `sdd-end-task`.

---

## 4. Self-review (cobertura spec → tasks)

- `planning` · Algo grande → propuesta y filas → Task 2 (plantilla) + Task 3 (skill); GREEN p1. ✓
- `planning` · Algo concreto → Task 3; GREEN p2 (control). ✓
- `planning` · Items del gestor → Task 3; GREEN p3. ✓
- `planning` · Reunión → Task 2 (sección Acta) + Task 3; GREEN p4. ✓
- `planning` · Reordenar → Task 2 (roadmap-template) + Task 3; GREEN p5. ✓
- `planning` · Cambio de definición → Task 2 (Enmiendas) + Task 3; GREEN p10. ✓
- `planning` · Preparar una release → Task 3; GREEN p6. ✓
- `routing` · Entrada por `sdd-plan` → Task 3 (description, router) + Task 4 (sin `sdd-start-release`); GREEN p1–p6. ✓
- `release-flow` · hasRecipient, valor vigente, comprometida, reserva publicada → Task 3; GREEN p6. ✓
- `roadmap` · Ficheros que toca → Task 3 (sección de release); test de la Task 4 (`MigrationInitParity`). ✓
- `task-ids` · Secuencia compartida con propuestas y contrato de lectura → Task 1. ✓
- `task-ids` · Reserva al planificar, modo gestor → Task 3; tests reapuntados en la Task 4. ✓
- `task-ids` · La reserva precede a la rama (rama sin id) → Task 5; GREEN p8b, p8 control. ✓
- Recortados (`tras NNNN` al arrancar, reproducción mínima) → sin task; GREEN p7 y p9 como control. ✓
- Fusión del delta en `capabilities/` → cierre (`sdd-end-task`), tras integrar develop. ✓
