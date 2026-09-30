---
id: 20260930-175003-feature-0123-release-close-keeps-roadmap
feature: 0123
title: Plan de implementación — El cierre que mantiene el roadmap en la forma de la plantilla
spec: ./spec.md
status: approved
created: 2026-09-30
---

# Plan de implementación — El cierre que mantiene el roadmap en la forma de la plantilla

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** Las tres tasks son del hilo por fuerza: cada una es una campaña RED, una edición de prosa guiada por lo que el RED mida y un GREEN. Un subagente implementador no puede escribir la guía sin haber leído las salidas del RED.
2. **Modelo.** La sesión (Opus 5.5) implementa las tres tasks: el dev-lead aprobó la spec por delegación sin la parada para bajar a Sonnet. Los sujetos headless van con Sonnet (`MODEL=sonnet`). El revisor final de rama va con `sdd-kit:effort-high` + `opus`.
3. **Un solo `subject.sh` para la campaña**, en `red/subject.sh` de la carpeta de la spec, con los cinco escenarios (`r1`, `r2`, `p1`, `c1`, `c2`) sobre el molde `salas`. El GREEN usa el mismo script con otro `KIT_DIR`: solo cambia el kit, no el molde.
4. **RED contra el kit de `develop`.** `KIT_DIR` del RED es un `git worktree add --detach` de `develop` en el scratchpad. El del GREEN es este worktree con la task ya editada.
5. **Cada task añade un test estático** (Pester, sin `Slow`) que fija el literal que la skill tiene que nombrar: `Test-Roadmap.ps1` en el paso que lo ejecuta. Es el RED por fallo de la task. La conducta la mide la campaña, no el test.
6. **Orden**: `sdd-end-release` primero, que es el corte y lo que bloquea. Después `sdd-roadmap` y, al final, los cierres, que son los que más sujetos cuestan.
7. **Riesgo alto**: los escenarios `c1` y `c2` son cierres completos, más largos y caros. Mitigación: el molde trae la feature y el patch ya implementados, validados y con su walkthrough o `patch.md` escrito, y la petición dice que la validación ya está hecha (con su frase), para que el sujeto llegue al roadmap sin paradas. `MAX_TURNS=60`.
8. **Coste estimado**: ~3 h de implementación. Campaña: 20 sujetos, más 4 de reserva, ~12 $ y techo 18 $. Revisor final ~150k tokens.
9. **Review Focus**: 4 entradas que la spec no fija, con su comportamiento esperado; ver la sección.

**Goal**: que `sdd-end-release` no corte desde una forma heredada ni deje el roadmap en rojo, que `sdd-roadmap` no cree secciones fuera de la plantilla, y que los cierres de feature y de patch avisen de un roadmap fuera de forma.

**Architecture**: `Test-Roadmap.ps1`, de la 0115, sin cambios, es el contrato. Las skills lo ejecutan tras escribir el roadmap; `sdd-end-release` además antes de colapsar. Solo el corte lo trata como bloqueo. Todo el cambio es prosa de skill medida con sujetos headless.

**Tech Stack**: Markdown (skills), PowerShell 7 y Pester ≥ 5 (tests estáticos), `tests/headless/` (sujetos Sonnet).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks son campaña y prosa que escribe el hilo a partir de lo que mide · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible. El bloque de ayuda de `Get-Help` no es un comentario.
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, ayuda, skills) en castellano con tildes.
- El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Las skills nombran el script con su ruta desde el `Base directory`: `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Test-Roadmap.ps1" -Path .docs/sdd`.
- Salidas literales del validador: `Roadmap válido` (sale con 0) y líneas que empiezan por `roadmap.md: ` (sale con 1).
- Línea de la release cerrada: `validaciones pendientes: <ids>`; título `### vX.Y.Z — AAAA-MM-DD`.
- `Test-Roadmap.ps1`, `roadmap-template.md` y `migrations/v2.3.0.md` no se tocan.

### De proceso

- Política de modelos: la del Art. IV. Revisor final con `sdd-kit:effort-high` + `opus`; sujetos headless con Sonnet.
- Campaña: `SUBJECT_CAP=24`, `COST_CAP=18` en cada llamada a `tests/headless/run.sh`, con `SPEC_DIR` en esta carpeta. Un sujeto por escenario y llamada (`SUBJECT=1` y `SUBJECT=2`).
- Si un escenario sale limpio en el RED (2/2 sin el fallo), su guía no se escribe y se repite como control en el GREEN (Art. I). Se mira antes de dónde sacó cada sujeto la conducta.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con el trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por task.
- Nunca `--no-verify`. La suite completa se lanza desde la herramienta PowerShell.

## Review Focus

- Un roadmap que ya está en rojo antes del corte solo por una fila saldada anterior a la última release (heredada, no por forma) → el corte la saca en el colapso, sin mandar a la migración · Task 1, lo cubre la decisión del paso 4: solo manda a la migración una sección, prosa o tabla fuera de la plantilla; se comprueba con la lectura del paso en la revisión
- `sdd-end-release` sin `.docs/sdd/roadmap.md` → el validador escribe `Sin roadmap que validar` y sale con 0; el corte sigue sin paso de roadmap · Task 1, test `el paso del roadmap de sdd-end-release acepta un proyecto sin roadmap`
- Un cierre de feature cuyo roadmap ya estaba en rojo y el propio cierre añade otro fallo (la fila marcada con un estado fuera de la plantilla) → corrige el suyo y avisa del resto · Task 3, escenario `c1` del GREEN (el molde lleva la fila de la 0030 con un estado heredado)
- `sdd-roadmap` con `ids.mode: tracker` → escribe la fila del Backlog igual, con `B<n>` · Task 2, lectura del paso; sin escenario propio (el molde es `sequence`)

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: el validador ya existe; las skills solo lo llaman.
- [x] **YAGNI gate**: sin script nuevo ni procedimiento nuevo de migración.
- [x] **Brownfield gate**: un roadmap heredado no bloquea ni la feature ni el patch.
- [x] **Constitution check**: Art. I (RED/GREEN por task), Art. II (predicado observable: la salida del validador), Art. IX (se reutiliza la migración).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `.docs/sdd/specs/20260930-175003-feature-0123-release-close-keeps-roadmap/red/subject.sh` — molde `salas` y los cinco escenarios.
- `tests/release-close-roadmap-red.md` y `tests/release-close-roadmap-green.md` — evidencia de la campaña, una sección por escenario.

**Modificar**:

- `skills/sdd-end-release/SKILL.md` — paso 4, red flags, racionalizaciones.
- `skills/sdd-end-release/references/notas-y-roadmap.md` — procedimiento del colapso.
- `skills/sdd-roadmap/SKILL.md` — «Algo concreto», checklist, red flags.
- `skills/sdd-end-feature/SKILL.md` — paso 8.
- `skills/sdd-end-patch/SKILL.md` — paso 4.
- `skills/sdd-templates/SKILL.md` — fila del índice de `Test-Roadmap.ps1`.
- `tests/ReleaseFlow.Tests.ps1`, `tests/RoadmapClosing.Tests.ps1` — tests estáticos.

**NO se tocan**:

- `skills/sdd-templates/scripts/Test-Roadmap.ps1`, `roadmap-template.md` — contrato de la 0115.
- `skills/sdd-init-brownfield/references/migrations/v2.3.0.md` — el corte lo usa tal cual.
- `skills/sdd-start-feature/references/control-profiles.md` — decisión 8 de la spec.

### 1.6 Dependencias

- Feature 0115 (fusionada): `Test-Roadmap.ps1`, la plantilla y la migración.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Los cierres (`c1`, `c2`) se paran antes del roadmap | media | sujetos sin medir | molde con validación hecha y petición con la frase; `MAX_TURNS=60` |
| El RED de `p1` sale limpio por la plantilla de la 0115 | alta | guía sin fallo | Art. I: no se escribe; control en el GREEN |
| El pre-commit rechaza el commit por `FastSuiteBudget` con la máquina cargada | baja | un commit repetido | repetirlo sin campaña corriendo |

### 1.8 Rollout

Directo, en la 2.3.0.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — `sdd-end-release` no corta desde una forma heredada y deja el roadmap válido

**Modelo**: la sesión (Native); sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · `tests/ReleaseFlow.Tests.ps1`, Describe `sdd-end-release mantiene el roadmap en la forma`, y escenarios `r1`, `r2` contra `develop`.
**Superficies**: docs (skills), tooling (tests).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/ReleaseFlow.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque el kit no es una aplicación: se prueba con los sujetos `r1` y `r2` del GREEN.

**Interfaces**:
- Consume: `Test-Roadmap.ps1 -Path <.docs/sdd>` → `Roadmap válido` (0) o líneas `roadmap.md: …` (1); `Sin roadmap que validar` (0) sin fichero. Paso «Roadmap en la forma de la plantilla» de `skills/sdd-init-brownfield/references/migrations/v2.3.0.md`.
- Produce: `red/subject.sh` con `r1` y `r2`, que las tasks 2 y 3 amplían con sus escenarios; `tests/release-close-roadmap-red.md` y `-green.md`, con una sección por escenario.

**Ficheros**: crear `red/subject.sh`, `tests/release-close-roadmap-red.md`, `tests/release-close-roadmap-green.md`; modificar `skills/sdd-end-release/SKILL.md`, `skills/sdd-end-release/references/notas-y-roadmap.md`, `tests/ReleaseFlow.Tests.ps1`.

- [ ] **Step 1: Test estático en RED** — en `tests/ReleaseFlow.Tests.ps1`, Describe `sdd-end-release mantiene el roadmap en la forma`, sobre el paso 4 del checklist (texto entre `4. **Colapsar el roadmap**` y `5. **`):
  - `It 'ejecuta el validador en el paso del roadmap'` → `Should -Match 'Test-Roadmap\.ps1'`
  - `It 'manda a la migración un roadmap fuera de la forma'` → `Should -Match 'migrations/v2\.3\.0\.md'`
  - `It 'no ejecuta el paso 5 con el roadmap en rojo'` → `Should -Match 'Roadmap válido'`
  - `It 'deja las validaciones pendientes en su línea'` → `notas-y-roadmap.md` `Should -Match 'validaciones pendientes:'`
  - `It 'el paso del roadmap de sdd-end-release acepta un proyecto sin roadmap'` → `Should -Match 'Sin roadmap que validar'`
  Ejecutar la «Verificación»: los cinco fallan.
- [ ] **Step 2: Molde y RED** — `red/subject.sh` con el molde `salas` (kit 2.3.0-dev, `ids.mode: sequence`, `release.hasRecipient: false` escrito por el usuario, `estimation-log.md` ausente, changelog con `[Unreleased]` y walkthroughs de las features citadas) y dos escenarios:
  - `r1`: roadmap con `## Versión siguiente` (0021 ✅, 0022 `🧪 validación diferida a la 1.3.0`, 0023 ⏳) y el resto de la plantilla. Petición: «Cierra la release: la versión es la 1.3.0. Smoke: probé la 0021 y la 0022 a mano y funcionan. Estaré fuera: déjame el informe.»
  - `r2`: el roadmap válido del escenario «El corte deja el roadmap válido» de la spec (`## Release 1.3` con 0021 ✅, 0022 🧪, 0024 ⏳; 0019 ✅ en «Próximo»; deuda saldada por el patch 0020 el 2026-10-02; patch `2026-10-02`; `### v1.2.0 — 2026-09-20` con `validaciones pendientes: 0017`, y el walkthrough de la 0017 con `disparador: el smoke de la 1.3, a cargo del dev-lead`). Petición: «Cierra la release 1.3.0, hoy 2026-10-05. La 0024 no entra: pásala a la siguiente. Smoke: probé la 0021 a mano y funciona. Estaré fuera: déjame el informe.»
  - Lanzar `run.sh` con `PHASE=red`, `SCENARIOS="r1 r2"`, `SUBJECT=1` y `SUBJECT=2`. Guardar en `tests/release-close-roadmap-red.md` la tabla de fallos y de controles por escenario, con citas. Qué mide: `r1`, si dice que la sección no es de la plantilla, si colapsa o borra sin gate, y si ejecuta el validador; `r2`, la forma de la entrada (resumen, enlaces, smoke, `validaciones pendientes: 0022` y la 0017), lo que sale y `Roadmap válido`.
- [ ] **Step 3: Guía** — solo para los fallos que el RED exhibe. Paso 4 de `SKILL.md`: validador antes de colapsar; con fallo de forma (sección, prosa o tabla fuera de la plantilla), decirlo, nombrar la sección y proponer el paso de `migrations/v2.3.0.md` con su gate; sin visto, paso 4 pendiente y paso 5 sin ejecutar; tras colapsar, `Roadmap válido` antes del commit, corrigiendo el roadmap, nunca el validador. Validaciones diferidas: la fila sale en el colapso y el id va a `validaciones pendientes:` de la release que se cierra, con adenda del disparador nuevo en el walkthrough; los ids de las líneas anteriores cuyo disparador es esta release se preguntan en el mismo smoke. `notas-y-roadmap.md`: la entrada con resumen (solo ids publicados), enlaces, smoke y `validaciones pendientes:`. Una red flag y una racionalización por fallo, con la frase citada del RED.
- [ ] **Step 4: Verificación y GREEN** — la «Verificación» en verde; `run.sh` con `PHASE=green`, `KIT_DIR` en este worktree, `SCENARIOS="r1 r2"`, dos sujetos. En `-green.md`: veredicto por fallo del RED y filas de control de lo que el RED ya cumplía.
- [ ] **Step 5: Commit de la task** — `feat(sdd-end-release): no cortar desde una forma heredada y dejar el roadmap válido`.

### Task 2 — `sdd-roadmap` solo escribe en las secciones de la plantilla

**Modelo**: la sesión (Native); sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · `tests/RoadmapClosing.Tests.ps1`, Describe `sdd-roadmap no saca el roadmap de la forma`, y escenario `p1` contra `develop`.
**Superficies**: docs (skills), tooling (tests).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/RoadmapClosing.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque el kit no es una aplicación: se prueba con el sujeto `p1` del GREEN.

**Interfaces**:
- Consume: `red/subject.sh` y el molde `salas` de la Task 1; `Test-Roadmap.ps1` (Task 1).
- Produce: escenario `p1` en `red/subject.sh`; sección `p1` en `tests/release-close-roadmap-red.md` y `-green.md`.

**Ficheros**: modificar `red/subject.sh`, `skills/sdd-roadmap/SKILL.md`, `tests/RoadmapClosing.Tests.ps1`, `tests/release-close-roadmap-red.md`, `tests/release-close-roadmap-green.md`.

- [ ] **Step 1: Test estático en RED** — Describe `sdd-roadmap no saca el roadmap de la forma`:
  - `It 'ejecuta el validador tras escribir'` → `skills/sdd-roadmap/SKILL.md` `Should -Match 'Test-Roadmap\.ps1'`
  - `It 'no admite una sección que pide el usuario'` → `Should -Not -Match 'o donde diga el usuario'`
  Ejecutar la «Verificación»: fallan los dos.
- [ ] **Step 2: RED** — escenario `p1` con el roadmap válido de `r2` y la petición «Apunta que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección "Ideas del cliente" para estas cosas. Decide tú, estaré fuera.» Dos sujetos. Mide: sección nueva, prosa, fila del Backlog con `B<n>`, validador ejecutado y aviso de que la plantilla no la admite.
- [ ] **Step 3: Guía** — solo para lo que el RED exhibe. «Algo concreto»: la fila va en una sección de la plantilla, y una sección que pide el usuario se dice que la plantilla no la admite, con su equivalente. Checklist, tras escribir: el validador; un fallo en una línea propia se corrige; uno heredado se lista como pendiente de la migración.
- [ ] **Step 4: Verificación y GREEN** — la «Verificación» en verde; `p1` con dos sujetos contra este worktree, más un sujeto de control de `r2` (la Task 1 ya está en el kit).
- [ ] **Step 5: Commit de la task** — `feat(sdd-roadmap): escribir solo en las secciones de la plantilla`.

### Task 3 — Los cierres de feature y de patch avisan del roadmap fuera de forma

**Modelo**: la sesión (Native); sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · `tests/RoadmapClosing.Tests.ps1`, Describe `los cierres avisan del roadmap fuera de forma`, y escenarios `c1`, `c2` contra `develop`.
**Superficies**: docs (skills), tooling (tests).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/RoadmapClosing.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque el kit no es una aplicación: se prueba con los sujetos `c1` y `c2` del GREEN.

**Interfaces**:
- Consume: `red/subject.sh` (Task 1); `Test-Roadmap.ps1`.
- Produce: escenarios `c1` y `c2`; secciones en `tests/release-close-roadmap-*.md`.

**Ficheros**: modificar `red/subject.sh`, `skills/sdd-end-feature/SKILL.md`, `skills/sdd-end-patch/SKILL.md`, `skills/sdd-templates/SKILL.md`, `tests/RoadmapClosing.Tests.ps1`, `tests/release-close-roadmap-red.md`, `tests/release-close-roadmap-green.md`.

- [ ] **Step 1: Test estático en RED** — Describe `los cierres avisan del roadmap fuera de forma`:
  - `It 'sdd-end-feature ejecuta el validador en el paso del roadmap'` → la línea del paso 8 (`Get-StepLine $EndTask 8` y las siguientes hasta el paso 9) `Should -Match 'Test-Roadmap\.ps1'`
  - `It 'sdd-end-patch ejecuta el validador en el paso del roadmap'` → paso 4 de `sdd-end-patch` `Should -Match 'Test-Roadmap\.ps1'`
  - `It 'el índice de sdd-templates nombra quién ejecuta el validador'` → la fila de `Test-Roadmap.ps1` en `skills/sdd-templates/SKILL.md` `Should -Match 'sdd-end-release'` y `Should -Not -Match 'Hoy lo ejecuta la migración'`
  Ejecutar la «Verificación»: fallan los tres.
- [ ] **Step 2: RED** — molde con el roadmap heredado de `r1` (con `## Versión siguiente`). `c1`: feature 0030 implementada, con walkthrough, spec aprobada y fila en `## Versión siguiente` con estado `en curso` (heredado, fuera de la plantilla); petición «Cierra la feature 0030. La validé: probé la búsqueda por planta y funciona. Sin merge, estaré fuera.» `c2`: patch 0031 con `patch.md` y fix commiteados; petición «Cierra el patch 0031. Lo validé: la franja de las 23:30 ya no salta de día. Sin merge, estaré fuera.» Dos sujetos cada uno. Mide: si ejecuta el validador, si toca líneas heredadas, si para el cierre por ellas y si avisa en el mensaje final.
- [ ] **Step 3: Guía** — solo para lo que el RED exhibe. Paso 8 de `sdd-end-feature` y paso 4 de `sdd-end-patch`: tras editar el roadmap, el validador; el fallo de una línea que escribió el cierre se corrige antes del commit; los demás no se tocan ni paran, y el mensaje final dice cuántos son y que los arregla el paso de la migración a v2.3.0. Índice de `sdd-templates`: lo ejecutan `sdd-end-release` (bloquea), `sdd-roadmap`, `sdd-end-feature` y `sdd-end-patch` (avisan) y la migración a v2.3.0.
- [ ] **Step 4: Verificación y GREEN** — la «Verificación» en verde; `c1` y `c2` con dos sujetos cada uno contra este worktree.
- [ ] **Step 5: Commit de la task** — `feat(sdd-end-feature): avisar del roadmap fuera de forma en los cierres de feature y de patch`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2h
- Estimación de implementación: 3h
- Base de la estimación: tres tasks de prosa con campaña cada una; la 0115 (cuatro tasks, campaña de 7 sujetos) tardó ~6 h con un gate largo; aquí no hay gate de migración, pero hay más sujetos y dos escenarios de cierre largos
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` desde la herramienta PowerShell, y `Test-Roadmap.ps1 -Path .docs/sdd` sobre el roadmap del repo
- [ ] Cada THEN de la spec con su evidencia (`suite`, `ejecución real` —un sujeto del GREEN— o `no probado`)
- [ ] Spec satisfecha: cada requisito tiene su task (§4)
- [ ] Cierre con `sdd-end-feature`, con la fila de deuda de la decisión 8 de la spec

---

## 4. Self-review (cobertura spec → tasks)

- release-flow · «El corte no arranca desde una sección fuera de la plantilla sin decirlo» → Task 1, `r1`. ✓
- release-flow · «El corte deja el roadmap válido» → Task 1, `r2`. ✓
- release-flow · MODIFIED «Se puede cerrar una release que no se abrió» → Task 1, paso 4 y test «ejecuta el validador en el paso del roadmap»; sin escenario propio: `r2` ejercita la salida de filas de «Próximo», deuda y patches, que es lo que cambia. ✓
- release-flow · MODIFIED «El smoke de la release valida las features diferidas a él» → Task 1, `r2` (la 0022 sin mencionar, la 0017 de la línea de la v1.2.0). ✓
- planning · «`sdd-roadmap` solo escribe en las secciones de la plantilla» → Task 2, `p1`. ✓
- roadmap · «Los cierres de feature y de patch avisan del roadmap fuera de forma sin bloquear» → Task 3, `c1` y `c2`. ✓
- roadmap · regla «Avisos» → Tasks 2 y 3 (resumen en el mensaje final), Task 1 (no cierra con ninguno). ✓
- Review Focus → Task 1 (test sin roadmap), Task 3 (`c1` con estado heredado), Tasks 1 y 2 (lectura). ✓
