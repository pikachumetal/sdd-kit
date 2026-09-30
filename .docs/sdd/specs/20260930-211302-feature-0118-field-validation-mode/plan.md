---
id: 20260930-211302-feature-0118-field-validation-mode
feature: 0118
title: Plan de implementación — Validación en campo como modo del proyecto
spec: ./spec.md
status: approved
created: 2026-09-30
---

# Plan de implementación — Validación en campo como modo del proyecto

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native.** Las tasks de skills son del hilo por fuerza: RED, guía escrita a partir de lo que mide y GREEN. Un implementador no escribe la guía sin haber leído las salidas del RED.
2. **Modelo.** La sesión (Opus 5.5) implementa: el dev-lead aprobó la spec por delegación sin la parada para bajar a Sonnet. Sujetos headless con Sonnet (`MODEL=sonnet`). Revisor final con `sdd-kit:effort-high` + `opus`.
3. **El RED de los cuatro escenarios va junto, en la Task 1**, antes de editar ninguna skill y contra un `git worktree add --detach` de `develop` en el scratchpad. Los cuatro son independientes y en paralelo tardan lo que uno. Cada task después lee su parte del RED.
4. **Un `subject.sh`** en `red/subject.sh`, sobre el molde `salas` de la 0123, con `f1`, `f2`, `p1`, `d1` y los controles `f2m` y `p1m` (los mismos sin la clave). El GREEN usa el mismo script con `KIT_DIR` en este worktree.
5. **Test estático** `tests/FieldValidation.Tests.ps1` (Pester, sin `Slow`): fija que cada paso nombra `validation.mode` y la línea `Validación en campo:`. Es el RED por fallo de cada task; la conducta la mide la campaña.
6. **La Task 4 no lleva campaña**: `sdd-kit.json`, `CLAUDE.md` y el roadmap del repo no son texto de una skill.
7. **Coste**: ~2,5 h de implementación. Campaña: 7 sujetos en el RED y 9 en el GREEN, más 4 de reserva; ~10 $, techo 14 $ (spec, decisión 10). Revisor final ~150k tokens.

**Goal**: que un proyecto con `validation.mode: field` cierre features y patches sin la parada de validación, registrando la verificación del agente como «Validación en campo» y el roadmap en ✅, y que este repo lo active.

**Architecture**: la regla vive en `control-profiles.md` (fila de la tabla de gates y sección «Validación en campo»); los tres pasos que paran en la validación la nombran con su condición. El registro añade una tercera forma a las plantillas. Todo es prosa de skill medida con sujetos headless, más la configuración de este repo.

**Tech Stack**: Markdown (skills), PowerShell 7 y Pester ≥ 5 (test estático), `tests/headless/` (sujetos Sonnet).

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks son campaña y prosa que escribe el hilo a partir de lo que mide · Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Sin comentarios que repitan el código. Un comentario existe solo si sin él la línea no se entiende; se conserva el porqué no deducible. El bloque de ayuda de `Get-Help` no es un comentario.
- Sin comentarios que citen documentos: nunca la constitution, una spec, una task, un requisito ni `capabilities/`.
- Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, ayuda, skills) en castellano con tildes.
- El revisor marca el incumplimiento como Important, salvo un umbral numérico superado en una unidad, que es Minor.
- Literales: la clave es `validation.mode`, con `manual` (default, también sin clave) y `field`, solo en `.docs/sdd/sdd-kit.json`. La línea es `Validación en campo: <fecha> · <verificación del agente>`. En campo el roadmap marca ✅, sin 🧪.
- `Test-Roadmap.ps1`, `roadmap-template.md`, `sdd-end-release`, `sdd-roadmap`, `sdd-config` y `migrations/` no se tocan.

### De proceso

- Política de modelos: la del Art. IV. Revisor final con `sdd-kit:effort-high` + `opus`; sujetos headless con Sonnet.
- Campaña: `SUBJECT_CAP=20`, `COST_CAP=14` en cada llamada a `tests/headless/run.sh`, con `SPEC_DIR` en esta carpeta y `SUPERPOWERS_DIR` si el kit lo pide.
- Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN (Art. I), tras mirar de dónde sacó cada sujeto la conducta.
- Commits: tipo y scope en inglés, título y cuerpo en castellano, con el trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Un commit por task. Nunca `--no-verify`; la suite completa, desde la herramienta PowerShell.

## Review Focus

- `validation.mode` con un valor fuera de `manual` y `field` (`"campo"`, `true`) → se trata como `manual` y el agente avisa · Task 1, la sección «Validación en campo» lo dice; lectura en la revisión
- `field` y una decisión de producto que deja la revisión final → se pregunta sola, en su turno, y después se cierra en campo sin guion · Task 1, paso 7; lectura
- `field` y una verificación visual «no probado» → la línea de campo lo dice tal cual; no se da por verificado · Task 1, la línea lleva la evidencia con sus tres valores; lectura
- `field` y el usuario que, aun así, dice qué probó → se registra `Validado` con su frase: la validación humana, cuando existe, manda · Task 1, sección «Validación en campo»
- `validation.mode` en `sdd-kit.local.json` → se ignora con aviso (requisito vigente) · Task 1, fila de «Claves de sdd-kit.json» con «solo en `sdd-kit.json`»

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una clave y una tercera forma de registro; sin script nuevo.
- [x] **YAGNI gate**: sin pregunta en `sdd-config` ni migración (0127); sin cambio en el corte de release.
- [x] **Brownfield gate**: sin clave, todo sigue como hoy.
- [x] **Constitution check**: Art. I (RED/GREEN), Art. II (predicado observable: la clave), Art. IV (no cambia el nivel de verificación), Art. VIII (plantillas en `sdd-templates`).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `red/subject.sh` de esta carpeta — molde `salas` y los escenarios.
- `tests/field-validation-red.md`, `tests/field-validation-green.md` — evidencia, una sección por escenario.
- `tests/FieldValidation.Tests.ps1` — test estático.

**Modificar**:

- `skills/sdd-start-feature/references/control-profiles.md` — tabla de gates, «Validación diferida» (último párrafo), sección «Validación en campo», «Claves de sdd-kit.json».
- `skills/sdd-start-feature/SKILL.md` — paso 7 y red flag.
- `skills/sdd-end-feature/SKILL.md` — pasos 0, 1 y 8.
- `skills/sdd-end-patch/SKILL.md` — paso 0 y red flag.
- `skills/sdd-templates/templates/walkthrough-template.md`, `patch-template.md`.
- `.docs/sdd/sdd-kit.json`, `CLAUDE.md`, `.docs/sdd/roadmap.md`, walkthroughs de la 0115 y la 0123, `patch.md` del 0126.

**NO se tocan**: los de la última línea de «De código».

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| En el RED el sujeto ve la clave desconocida y ya no pregunta | media | escenario limpio | Art. I: no se escribe guía para esa conducta; control en el GREEN |
| `f1` se para antes del paso 7 (revisión final) | media | sujeto sin medir | molde con `tasks.md` y su línea `Revisión final:` sobre `HEAD`; `MAX_TURNS=60` |
| Los controles `f2m`/`p1m` dejan de preguntar en el GREEN | baja | regresión | la guía condiciona todo a la clave; si cae, ronda de ajuste con la reserva |

### 1.8 Rollout

Directo, en la 2.3.0. Este repo activa `field` en la Task 4.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — La regla de la validación en campo y el paso 7 de `sdd-start-feature`

**Modelo**: la sesión (Native); sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · `tests/FieldValidation.Tests.ps1`, Describe `la validación en campo en control-profiles y en el paso 7`, y los escenarios `f1`, `f2`, `p1`, `d1` contra `develop`.
**Superficies**: docs (skills, plantillas), tooling (tests).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FieldValidation.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque el kit no es una aplicación: se prueba con los sujetos `f1` y `d1` del GREEN.

**Interfaces**:
- Produce: `red/subject.sh` con todos los escenarios; la sección `## Validación en campo` de `control-profiles.md` (ancla `#validación-en-campo`), que las tasks 2 y 3 enlazan; la línea de las plantillas.

- [ ] **Step 1: Test estático en RED** — Describe `la validación en campo en control-profiles y en el paso 7`:
  - `It 'la tabla de gates nombra el modo de campo'` → fila `| Validación` de `control-profiles.md` `Should -Match 'validation\.mode: field'`
  - `It 'control-profiles tiene la sección de campo con su línea'` → `Should -Match '## Validación en campo'` y `Should -Match 'Validación en campo: <fecha>'`
  - `It 'la clave está en la tabla de claves'` → `Should -Match '\| `validation\.mode` \|'`
  - `It 'la validación tardía quita el id de la línea de la release'` → sección «Validación diferida» `Should -Match 'validaciones pendientes:'`
  - `It 'el paso 7 nombra el modo de campo'` → paso 7 de `sdd-start-feature/SKILL.md` `Should -Match 'validation\.mode: field'`
  - `It 'las plantillas admiten la línea de campo'` → `walkthrough-template.md` y `patch-template.md` `Should -Match 'Validación en campo:'`
  Ejecutar la «Verificación»: fallan los seis.
- [ ] **Step 2: Molde y RED** — `red/subject.sh` sobre el molde `salas` de la 0123 (`sdd-kit.json` con `"validation":{"mode":"field"}` salvo en `d1`, `f2m` y `p1m`), escenarios:
  - `f1` (`sdd-start-feature`): rama `feature/0030-floor-search` con spec lite aprobada, fix y tests commiteados, `tasks.md` con `Revisión final: sdd-kit:effort-high + opus, limpia, sobre <HEAD>`; roadmap con la 0030 `🔄 en curso` en `## Release 1.3`. Petición: «Sigue con la feature 0030 donde la dejaste: la implementación está terminada y la revisión final limpia. Estaré fuera un rato: déjame al final un informe.»
  - `f2` (`sdd-end-feature`): el mismo molde. Petición: «Cierra la feature 0030. La revisión final ya está hecha y limpia sobre el último commit. No hagas merge ni push. Estaré fuera un rato: déjame al final un informe.»
  - `p1` (`sdd-end-patch`): el patch 0031 de la 0123, con `## Release 1.3` abierta. Petición: «Cierra el patch 0031. No hagas merge ni push. Estaré fuera un rato: déjame al final un informe.»
  - `d1` (`sdd-end-feature`, sin la clave): `### v1.3.0 — 2026-10-05` con `validaciones pendientes: 0022, 0025` y sin fila de la 0022. Petición: «Probé la 0022: puse el 12 de octubre como festivo de Lugo y no deja reservar. Va bien. Apúntalo donde toque. Estaré fuera un rato.»
  - Dos sujetos en `f1`, `f2`, `p1` y uno en `d1`, en paralelo. En `tests/field-validation-red.md`, por escenario: si pregunta o para en la validación, qué línea escribe (walkthrough o `patch.md` §4), qué estado deja en el roadmap, y en `d1` qué hace con la línea `validaciones pendientes:`; con citas.
- [ ] **Step 3: Guía** — solo para lo que el RED exhibe. `control-profiles.md`: la fila «Validación» añade que con `validation.mode: field`, en los tres perfiles, no para y se registra en campo; sección `## Validación en campo` (condición, la línea con su evidencia, ✅ sin 🧪 ni fila en la tabla de la release, la decisión de producto se sigue preguntando, un valor desconocido es `manual` con aviso, y si el usuario dice qué probó se registra `Validado`); fila `validation.mode` en «Claves de sdd-kit.json» (`manual` \| `field`, solo en `sdd-kit.json`, default `"manual"`); último párrafo de «Validación diferida» con la fila ya cortada. Paso 7 de `sdd-start-feature` y su red flag: con `field` no presenta guion ni pregunta, registra y sigue a `sdd-end-feature`. Plantillas: la tercera forma. Una red flag o racionalización por fallo, con la frase citada del RED.
- [ ] **Step 4: Verificación y GREEN** — la «Verificación» en verde; `f1` con dos sujetos y `d1` con uno contra este worktree. En `-green.md`, veredicto por fallo del RED y filas de control.
- [ ] **Step 5: Commit de la task** — `feat(sdd-start-feature): validación en campo como modo del proyecto`.

### Task 2 — El cierre de feature en campo

**Modelo**: la sesión (Native); sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · `tests/FieldValidation.Tests.ps1`, Describe `el cierre de feature en campo`, y el RED de `f2` de la Task 1.
**Superficies**: docs (skills), tooling (tests).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FieldValidation.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque el kit no es una aplicación: se prueba con los sujetos `f2` y `f2m` del GREEN.

**Interfaces**:
- Consume: `#validación-en-campo` de `control-profiles.md` y la línea de la plantilla (Task 1); `red/subject.sh`.

- [ ] **Step 1: Test estático en RED** — Describe `el cierre de feature en campo`:
  - `It 'el paso 0 acepta la validación en campo'` → paso 0 de `sdd-end-feature/SKILL.md` `Should -Match 'validation\.mode: field'`
  - `It 'el walkthrough registra la línea de campo'` → paso 1 `Should -Match 'Validación en campo:'`
  - `It 'el roadmap marca ✅ en campo'` → paso 8 `Should -Match 'validación en campo'`
  Ejecutar la «Verificación»: fallan los tres.
- [ ] **Step 2: Guía** — solo para lo que el RED de `f2` exhibe. Paso 0: con `field` la validación en campo cuenta como validación y el checklist arranca sin preguntar. Paso 1: la línea `Validación en campo:` con la evidencia. Paso 8: ✅, sin 🧪.
- [ ] **Step 3: Verificación y GREEN** — «Verificación» en verde; `f2` con dos sujetos y el control `f2m` con uno.
- [ ] **Step 4: Commit de la task** — `feat(sdd-end-feature): cerrar en campo con validation.mode: field`.

### Task 3 — El cierre de patch en campo

**Modelo**: la sesión (Native); sujetos `MODEL=sonnet`.
**Tests RED**: hilo principal · `tests/FieldValidation.Tests.ps1`, Describe `el cierre de patch en campo`, y el RED de `p1` de la Task 1.
**Superficies**: docs (skills), tooling (tests).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FieldValidation.Tests.ps1 -Output Detailed"`
**Se prueba en la aplicación**: no, porque el kit no es una aplicación: se prueba con los sujetos `p1` y `p1m` del GREEN.

**Interfaces**:
- Consume: `#validación-en-campo` (Task 1); `red/subject.sh`.

- [ ] **Step 1: Test estático en RED** — Describe `el cierre de patch en campo`:
  - `It 'el paso 0 del patch nombra el modo de campo'` → paso 0 de `sdd-end-patch/SKILL.md` `Should -Match 'validation\.mode: field'` y `Should -Match 'Validación en campo:'`
  - `It 'la red flag admite la línea de campo'` → `Should -Match 'Validación en campo:'` en la red flag de §4
  Ejecutar la «Verificación»: fallan.
- [ ] **Step 2: Guía** — solo para lo que el RED de `p1` exhibe. Paso 0: con `field` no para ni pregunta; la línea en `patch.md` §4; la fila de «Patches» sin 🧪 y sin fila en la release. Red flag con las tres líneas.
- [ ] **Step 3: Verificación y GREEN** — «Verificación» en verde; `p1` con dos sujetos y el control `p1m` con uno.
- [ ] **Step 4: Commit de la task** — `feat(sdd-end-patch): cerrar en campo con validation.mode: field`.

### Task 4 — Este repo valida en campo

**Modelo**: la sesión (Native).
**Tests RED**: no aplica: configuración y documentos del repo, sin conducta de skill.
**Superficies**: docs.
**Verificación**: `pwsh -NoProfile -Command "(Get-Content .docs/sdd/sdd-kit.json -Raw | ConvertFrom-Json).validation.mode; & (Get-ChildItem -Recurse -Filter Test-Roadmap.ps1 skills)[0].FullName -Path .docs/sdd"` → `field` y `Roadmap válido`.
**Se prueba en la aplicación**: no, porque es configuración: se comprueba con la «Verificación» y leyendo la regla 6.

- [ ] **Step 1**: `.docs/sdd/sdd-kit.json` gana `"validation":{"mode":"field"}`.
- [ ] **Step 2**: regla 6 de `CLAUDE.md`: la validación final de este repo es en campo (`validation.mode: field`); en `delegate` se para en la spec, en los desvíos y en las decisiones del dev-lead; la parada de la spec y su delegación, como hoy; el porqué, con la frase del dev-lead del 2026-09-29.
- [ ] **Step 3**: roadmap: la 0115, la 0123 y el patch 0126 a ✅ (el patch, sin el prefijo 🧪); la fila de deuda «Validar una diferida después del corte…» cerrada con el formato de `roadmap-template.md`; adenda fechada `Validación en campo` en los walkthroughs de la 0115 y la 0123 y en `patch.md` §4 del 0126.
- [ ] **Step 4**: «Verificación» en verde. Commit `chore(sdd): validar este repo en campo`, con la frase del dev-lead en el cuerpo.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1h
- Estimación de implementación: 2,5h
- Base de la estimación: la 0123 (tres tasks de prosa con campaña, 20 sujetos); aquí cuatro tasks, una sin campaña, y el RED junto
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` desde la herramienta PowerShell, y `Test-Roadmap.ps1 -Path .docs/sdd`
- [ ] Cada THEN de la spec con su evidencia (`suite`, `ejecución real` —un sujeto del GREEN— o `no probado`)
- [ ] Esta feature para en su validación (spec, decisión 8)
- [ ] Cierre con `sdd-end-feature`

---

## 4. Self-review (cobertura spec → tasks)

- control-profiles · ADDED «Con `validation.mode: field`, la validación es en campo» → Task 1 (regla, `f1`), Task 2 (`f2`), Task 3 (`p1`); el último AND (sin clave, como hoy) → controles `f2m` y `p1m`. ✓
- control-profiles · MODIFIED «La validación puede diferirse con condiciones» → Task 1, `d1`. ✓
- feature-flow · MODIFIED «El trabajo se valida con el usuario antes de cerrar» → Task 1 (paso 7, `f1`) y Task 2 (paso 0, `f2`). ✓
- Decisión 7 (este repo) → Task 4. ✓
- Review Focus → Task 1, sección «Validación en campo». ✓
