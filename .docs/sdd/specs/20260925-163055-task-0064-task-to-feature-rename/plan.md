---
id: 20260925-163055-task-0064-task-to-feature-rename
task: 0064
title: Plan de implementación — Renombrado task → feature
spec: ./spec.md
status: approved
created: 2026-09-25
---

# Plan de implementación — Renombrado task → feature

## Decisiones que he tomado yo — valida estas

1. **Ejecución Native** en esta sesión (Opus 5.5, el modelo de la sesión) — las 4 tasks tocan los mismos ficheros en serie y el trabajo es sobre todo clasificar menciones con el contexto de la spec ya cargado; un subagente por task recargaría ese contexto cuatro veces. El dev-lead aprobó la spec sin la opción de bajar la sesión a gama media.
2. **Revisor final de rama**: `sdd-kit:effort-high` + `model: opus`, el techo por defecto del Art. IV para Native.
3. **Sujetos de la campaña**: Sonnet, con el lanzador de referencia `tests/headless/run.sh` y los moldes de la task 0014 (`.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red/molde*`), con `SUBJECT_CAP=15` y `COST_CAP=4`, los de la spec.
4. **Orden lectores → escritores**: la Task 1 hace que los scripts lean `feature` antes de que nada lo escriba; así ningún commit intermedio deja una carpeta `-feature-` que un script no reconozca.
5. **El RED de `m1` va dentro de la Task 3, antes de escribir el paso de migración** — Art. I: el baseline se mide sin la guía. Corre sobre una copia del kit en `HEAD` de ese momento (`git archive`), que aún no tiene el paso.
6. **El test guarda va en la Task 3**, la última que toca texto vivo: antes de ella fallaría por los docs que aún no se han reescrito.
7. **Tipo de las fixtures nuevas**: carpetas propias (`tests/fixtures/task-ids/feature-lane`, `feature-only`, `mixed-duplicate`; `tests/fixtures/estimation-log/features`) y no filas nuevas en `proyecto`, cuyos tests de mediana y de «10 o más ratios» dependen del número exacto de artefactos.
8. **Coste estimado**: ~4 h de implementación; sujetos ~2,5 $ (techo 4 $); revisor final ~150k tokens Opus, ~1–2 $.

**Goal**: la unidad del kit se llama feature en nombres de skill, carpetas, frontmatter, plantillas y docs vivos, con el legado `-task-` leído y sin tocar.

**Architecture**: dos capas. Los lectores (`Get-NextSddId.ps1`, `Build-EstimationLog.ps1`) aceptan `feature` y `task`; los escritores (skills, `references/`, plantillas, hook, README, migración) escriben solo `feature`. Un test Pester guarda que ningún nombre viejo sobreviva fuera del histórico.

**Tech Stack**: Markdown de skills y plantillas; PowerShell 7 y Pester 5 para scripts y tests; sujetos headless Sonnet con `tests/headless/run.sh`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tasks comparten ficheros y se hacen en serie, y la sesión ya tiene cargado el contexto de la spec. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Art. X de la constitution, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.
- Nombres nuevos, exactos: `sdd-start-feature`, `sdd-end-feature`; carpeta `<yyyyMMdd-HHmmss>-feature-<id>-<slug>`; frontmatter `feature: <id>`; columna del estimation-log `Id`; cabecera de `roadmap-template.md` `| id | Feature |`.
- Se quedan como están: «Task N», `tasks.md`, `tasks-template.md` y su cabecera `| # | Task | Status | Commit | Notas |`, `task-start`/`task-done`, «revisión de task»; `task:` en `patch-template.md` y `kit-feedback-template.md`; los slugs `task-flow` y `task-ids`; la rama `feature/<id>-<slug>`.
- Cada mención de «task» se clasifica: unidad del kit → feature; task del plan → se queda. Nunca sustitución ciega con `sed` o `-replace` sobre un fichero entero.
- Histórico intacto: `.docs/sdd/specs/`, `field-reports/`, `releases/`, `changelog.md` (salvo `[Unreleased]` en el cierre), `roadmap.md`, `estimation-log.md`, «Aprendizajes por task» de `tech-stack.md`, los `.md` de `tests/` a cualquier profundidad y `migrations/` anteriores a `v2.0.0.md`.
- Las `description` de las skills renombradas conservan «tarea» y «cierra la tarea» como frases de disparo.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en todo despacho; revisor final `sdd-kit:effort-high` + `opus`; sujetos Sonnet; `fable` y `opus xhigh` prohibidos.
- Native con el ledger de `executing-plans`; RED escritos por el hilo antes del código y copiados fuera del repo (scratchpad) para compararlos al cerrar cada task.
- Tests nuevos que creen repos o lancen procesos llevan `-Tag 'Slow'`.
- Commits bilingües (tipo/scope inglés, cuerpo castellano), uno por task al quedar limpia, con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sin alias, sin renombrar carpetas ni slugs; lectura doble con una alternancia más en dos regex.
- [x] **YAGNI gate**: ninguna abstracción nueva; el test guarda es un solo `It`.
- [x] **Brownfield gate**: retrocompatible por lectura del legado `-task-` y `task:`.
- [x] **Constitution check**: Art. I (campaña de la decisión 14), Art. IV (cambio de convención con spec dedicada), Art. V (migración), Art. VIII (plantillas solo en `sdd-templates`), Art. X (restricciones de código).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/fixtures/task-ids/feature-lane/`, `feature-only/`, `mixed-duplicate/` — proyectos `sequence` con carpetas `-feature-`.
- `tests/fixtures/estimation-log/features/` — un walkthrough `task: 0063` en carpeta `-task-` y otro `feature: 0079` en carpeta `-feature-`.
- `tests/FeatureRename.Tests.ps1` — nombres nuevos presentes y guarda de nombres viejos.
- Evidencia de la campaña: `tests/feature-rename-red.md` (m1) y `tests/feature-rename-green.md` (enrutado y m1), con sus salidas en `red/` y `green/` de la carpeta de la spec.

**Modificar**:

- `skills/sdd-templates/scripts/Get-NextSddId.ps1` — `$script:SpecFolderIdPattern` con `feature`.
- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` — `Get-TaskId` → lee `feature:` y `task:`, carpeta `feature`; cabecera `Id`.
- `skills/sdd-start-task/` → `skills/sdd-start-feature/`, `skills/sdd-end-task/` → `skills/sdd-end-feature/` (`git mv`), con su `name` y `description`.
- Las skills, `references/` y plantillas de la lista de la decisión 14 de la spec.
- `hooks/router.md`, `README.md`, `CLAUDE.md`, `.docs/sdd/constitution.md`, `mission.md`, `architecture.md`, `tech-stack.md` (secciones no cronológicas), `.docs/workflow/greenfield.md`, `brownfield.md`.
- `skills/sdd-init-brownfield/references/migrations/v2.0.0.md` — paso nuevo.
- Los tests Pester que nombran las skills (28 ficheros, lista en la Task 2).

**NO se tocan**:

- `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, `Test-Capabilities.ps1` — no leen el patrón de carpeta.
- `.docs/sdd/capabilities/` — se reescriben en el cierre, al fusionar el delta (decisión 9 de la spec).
- `.docs/sdd/roadmap.md`, `changelog.md`, `estimation-log.md` — los toca el cierre.
- `skills/sdd-init-brownfield/references/migrations/v1.2.0.md` — su renombrado es del corte de la release.

### 1.6 Dependencias

Ninguna nueva. La campaña usa `claude` headless, ya instalado.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Renombrar una «task» del plan por error | media | un texto que confunde las dos unidades | clasificación manual; revisión final con foco en ello; los cinco requisitos ambiguos de la spec como referencia |
| Tests Pester que comprueban frases literales de las skills se rompen en cadena | alta | Task 2 larga | se actualizan en la misma task, fichero a fichero, con la suite rápida como verificación |
| Tras el renombrado, «cierra la tarea» deja de llegar a `sdd-end-feature` | baja | el cierre se salta | `e1` en la campaña; la `description` conserva «cierra la tarea» |
| El harness sirve la skill vieja desde la caché | media | seguir pasos con el nombre viejo | CLAUDE.md regla 2: contrastar con `skills/<nombre>/SKILL.md` de la rama |

### 1.8 Rollout

Directo, en la 2.0.0. Los proyectos lo reciben con la migración a v2.0.0.

### 1.9 Excepciones a la constitution

Ninguna. La forma del delta de `capabilities/` lleva la excepción declarada en la decisión 9 de la spec, aprobada con ella.

---

## 2. Tasks

### Task 1 — Lectores y plantillas con `feature`

**Modelo**: sesión (Native, Opus 5.5, effort de la sesión).
**Tests RED**: hilo principal · `tests/Get-NextSddId.Tests.ps1`, `tests/Build-EstimationLog.Tests.ps1`, `tests/FeatureRename.Tests.ps1` (Context «plantillas»), escritos antes del código y copiados al scratchpad.
**Superficies**: tooling · docs (plantillas).
**Verificación**: `Invoke-Pester -Path tests/Get-NextSddId.Tests.ps1, tests/Build-EstimationLog.Tests.ps1, tests/FeatureRename.Tests.ps1, tests/AnchorTemplates.Tests.ps1 -Output Detailed`
**Se prueba en la aplicación**: `Get-NextSddId.ps1 -ProjectRoot tests/fixtures/task-ids/feature-lane` devuelve `0081`; `Build-EstimationLog.ps1 -Root tests/fixtures/estimation-log/features -OutFile <tmp>` da dos filas con ids `0063` y `0079` bajo la cabecera `| Fecha | Id | …`.

**Interfaces**:
- Consume: nada.
- Produce: el patrón `-(?:feature|task|patch|proposal)-(\d{4})[a-z]*-` en `Get-NextSddId.ps1`; en `Build-EstimationLog.ps1`, id desde `^feature:` o `^task:` y carpeta `^\d{8}-\d{6}-(?:feature|task|patch|hotfix)-([^-]+)-`; cabecera `| Fecha | Id | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Sesión ($) | Carpeta |`; plantillas con `feature: <id>`.

**Ficheros**: crear las fixtures de §1.1; modificar los dos scripts, sus tests, `spec-template.md`, `plan-template.md`, `walkthrough-template.md` (frontmatter `id: <yyyyMMdd-HHmmss>-feature-<id>-<slug>` y `feature: <id>`), `roadmap-template.md` (`| id | Feature |`), `kit-feedback-template.md` (nombre `(feature|patch)` si lo dice), `skills/sdd-start-task/references/nombrado.md` (patrón `(feature|patch|proposal)` y la frase de que `-task-` es legado que se lee y no se escribe).

- [ ] **Step 1: Fixtures** — `feature-lane`: `sdd-kit.json` `{"version":"2.0.0","channel":"plugin","updated":"2026-09-25","ids":{"mode":"sequence"}}`, `roadmap.md` sin ids, `specs/20260920-100000-task-0063-a/spec.md`, `specs/20261001-091500-feature-0079-b/spec.md`, `specs/20261002-100000-patch-0080-c/patch.md`. `feature-only`: solo `…-feature-0079-b/`. `mixed-duplicate`: `…-task-0063-a/` y `…-feature-0063-b/`. `estimation-log/features/.docs/sdd/`: `estimation.md` vacío, `specs/20260920-100000-task-0063-a/walkthrough.md` con `task: 0063` y `specs/20261001-091500-feature-0079-b/walkthrough.md` con `feature: 0079`, los dos con el bloque del fixture `0001-plain` (Tipo docs, 4h, 2h).
- [ ] **Step 2: Tests RED** en `Get-NextSddId.Tests.ps1`, Context `carril feature`:

```powershell
  Context 'carril feature' {
    It 'cuenta las carpetas feature junto a las task y los patches' {
      (Invoke-NextId (Join-Path $script:Fixtures 'feature-lane')).Id | Should -Be '0081'
    }

    It 'cuenta una carpeta feature sin ninguna task' {
      (Invoke-NextId (Join-Path $script:Fixtures 'feature-only')).Id | Should -Be '0080'
    }

    It 'avisa del mismo id en una carpeta task y otra feature' {
      $result = Invoke-NextId (Join-Path $script:Fixtures 'mixed-duplicate')
      $result.Id | Should -BeNullOrEmpty
      $result.Error | Should -Match '0063'
      $result.ExitCode | Should -Be 1
    }
  }
```

  En `Build-EstimationLog.Tests.ps1`, un `Describe 'Carpetas feature y task heredadas'`:

```powershell
Describe 'Carpetas feature y task heredadas' {
  BeforeAll { $script:Mixed = Invoke-Build (Join-Path $script:Fixtures 'features') }

  It 'lee el id de una task heredada' {
    Get-Row $script:Mixed.Text '20260920-100000-task-0063-a' | Should -Match '^\| 2026-09-20 \| 0063 \|'
  }

  It 'lee el id del campo feature' {
    Get-Row $script:Mixed.Text '20261001-091500-feature-0079-b' | Should -Match '^\| 2026-10-01 \| 0079 \|'
  }

  It 'titula Id la columna del id' {
    $script:Mixed.Text | Should -Match '(?m)^\| Fecha \| Id \| Tipo \| Est \(h\) \| Real \(h\) \| Ratio \| Hilo \(tokens\) \| Subagentes \(tokens\) \| Sujetos \(\$\) \| Sesión \(\$\) \| Carpeta \|$'
  }
}
```

  Y un test que lee el id de la carpeta `feature` sin frontmatter (walkthrough sin `feature:` en `…-feature-0081-c/`, fila con `0081`). En `tests/FeatureRename.Tests.ps1`, Context `plantillas`: `spec-template.md`, `plan-template.md` y `walkthrough-template.md` tienen `(?m)^feature: <id>` y `-feature-<id>-<slug>`, y no `(?m)^task:`; `patch-template.md` conserva `(?m)^task:`; `tasks-template.md` conserva `| # | Task | Status |`; `roadmap-template.md` tiene `| id | Feature |`; `nombrado.md` tiene `(feature|patch|proposal)`.
- [ ] **Step 3: RED** — la verificación falla por los tests nuevos y solo por ellos. Copia de los tres ficheros de test al scratchpad.
- [ ] **Step 4: Implementación** — las dos regex y `Get-TaskId` (renombrada `Get-ArtifactId`: `^(?:feature|task):\s*(\S+)`), la cabecera, y las plantillas y `nombrado.md` de «Ficheros».
- [ ] **Step 5: Verificación** — el comando de «Verificación». Esperado: verde. Los tests existentes de `task-ids` y `estimation-log` siguen verdes sin tocarlos, salvo los que comprueban la cabecera `Task`, que pasan a `Id`.
- [ ] **Step 6: Commit de la task** — `feat(sdd-templates): leer carpetas feature y escribir feature en plantillas`, con los RED comparados.

### Task 2 — Renombrar las skills y su vocabulario

**Modelo**: sesión (Native, Opus 5.5, effort de la sesión).
**Tests RED**: hilo principal · `tests/FeatureRename.Tests.ps1` (Context «skills»), antes del `git mv`.
**Superficies**: docs (skills, `references/`, plantillas, hook, README) · tooling (tests).
**Verificación**: `Invoke-Pester -Path tests -ExcludeTagFilter Slow -Output Minimal` más `Invoke-Pester -Path tests/Hook.Tests.ps1, tests/Manifests.Tests.ps1 -Output Detailed`
**Se prueba en la aplicación**: con `./Start-KitSession.ps1`, `/sdd-kit:sdd-start-feature` carga la skill del worktree y `/sdd-kit:sdd-start-task` ya no existe.

**Interfaces**:
- Consume: los nombres y el patrón de la Task 1.
- Produce: `skills/sdd-start-feature/SKILL.md` (`name: sdd-start-feature`), `skills/sdd-end-feature/SKILL.md` (`name: sdd-end-feature`), `hooks/router.md` con `sdd-kit:sdd-start-feature`.

**Ficheros**: `git mv skills/sdd-start-task skills/sdd-start-feature` y `git mv skills/sdd-end-task skills/sdd-end-feature`; el vocabulario de todas las skills y `references/` de la decisión 14 de la spec, las plantillas que nombran las skills (`architecture-`, `capability-`, `estimation-`, `plan-`, `roadmap-`, `spec-template.md`), `hooks/router.md`, `README.md`; los tests Pester: `AgentDefinitions`, `AnchorTemplates`, `CapabilityRules`, `CommitMilestones`, `ControlProfiles`, `DispatchBrief`, `FewerStops`, `FileOverlap`, `Hook`, `KitFeedback`, `LocalConfig`, `NativeAdapt`, `NativeDefault`, `PlanEntry`, `ProportionalReview`, `ReleaseFlow`, `RoadmapClosing`, `ScopeBrake`, `SddConfig`, `SessionModel`, `SessionTokensClose`, `Skills`, `SuperpowersCompat`, `SyncMerge`, `TaskIds`, `TaskVerification`, `TestableTasks`, `VisualCheck` (`.Tests.ps1`).

- [ ] **Step 1: Tests RED** en `tests/FeatureRename.Tests.ps1`, Context `skills`: existen `skills/sdd-start-feature/SKILL.md` y `skills/sdd-end-feature/SKILL.md` con `name:` igual a su carpeta; no existen `skills/sdd-start-task/` ni `skills/sdd-end-task/`; la `description` de `sdd-end-feature` contiene «cierra la tarea»; la de `sdd-start-feature` contiene «tarea» o «feature»; `hooks/router.md` contiene `sdd-kit:sdd-start-feature` y no `sdd-start-task`; ninguna `SKILL.md` ni fichero de `references/` bajo `skills/` (salvo `migrations/`) contiene `sdd-(start|end)-task`.
- [ ] **Step 2: RED** — fallan esos tests. Copia al scratchpad.
- [ ] **Step 3: `git mv`** de las dos carpetas; `name` en su frontmatter.
- [ ] **Step 4: Vocabulario** — fichero a fichero de la lista, clasificando cada mención: unidad del kit → feature; task del plan → se queda. Las `description` conservan «tarea» y «cierra la tarea». Enlaces relativos `../sdd-start-task/…` → `../sdd-start-feature/…`.
- [ ] **Step 5: Tests Pester existentes** — rutas `skills/sdd-start-task` → `skills/sdd-start-feature` y literales de frase que cambiaron con el vocabulario; ningún test pierde su aserción, solo cambia el literal.
- [ ] **Step 6: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 7: Commit de la task** — `refactor(skills): renombrar sdd-start-task y sdd-end-task a feature`.

### Task 3 — Migración, docs vivos y guarda

**Modelo**: sesión (Native, Opus 5.5, effort de la sesión); sujeto de `m1` RED: Sonnet headless.
**Tests RED**: hilo principal · `tests/MigrationInitParity.Tests.ps1` (paso nuevo) y `tests/FeatureRename.Tests.ps1` (Context «guarda»).
**Superficies**: docs · tooling (tests).
**Verificación**: `Invoke-Pester -Path tests/FeatureRename.Tests.ps1, tests/MigrationInitParity.Tests.ps1, tests/WorkflowDocs.Tests.ps1, tests/Skills.Tests.ps1 -Output Detailed`
**Se prueba en la aplicación**: no, porque es documentación y migración: la comprobación es `m1` GREEN en la Task 4 y el test guarda.

**Interfaces**:
- Consume: los nombres de la Task 2.
- Produce: paso 3 de `v2.0.0.md` («Nombres de las skills de feature») y el marcador pasa a paso 4; su verificación con el `Select-String` de la spec.

**Ficheros**: `skills/sdd-init-brownfield/references/migrations/v2.0.0.md`, `tests/MigrationInitParity.Tests.ps1`, `tests/FeatureRename.Tests.ps1`, `CLAUDE.md`, `.docs/sdd/constitution.md`, `mission.md`, `architecture.md`, `tech-stack.md`, `.docs/workflow/greenfield.md`, `brownfield.md`; evidencia `tests/feature-rename-red.md` y `red/` de la spec.

- [ ] **Step 1: m1 RED** — copia del kit en `HEAD` con `git archive` al scratchpad; molde de proyecto en v1.2.0 con `CLAUDE.md` («arranca el trabajo con `sdd-start-task`»), `.docs/sdd/constitution.md` citando `sdd-end-task`, `.docs/sdd/capabilities/` con una capacidad válida, y `specs/20260910-080000-task-0012-login/spec.md` citando `sdd-end-task`. Petición: «actualízame al kit». Un sujeto Sonnet con `tests/headless/run.sh` (`PHASE=red`, `SUBJECT_CAP=15`, `COST_CAP=4`). Se anota en `tests/feature-rename-red.md` qué menciones quedan.
- [ ] **Step 2: Tests RED** — `MigrationInitParity`: `v2.0.0.md` tiene un paso que nombra `sdd-start-feature` y `sdd-end-feature`, excluye `specs/`, `changelog.md`, `client-changelog.md`, `roadmap.md`, y su «Verificación» lleva el `Select-String` con `AGENTS.md`. `FeatureRename`, Context `guarda`: `git ls-files` del repo, filtrado por la lista blanca, sin ninguna línea con `sdd-(start|end)-task`:

```powershell
  Context 'guarda' {
    It 'no queda ningún nombre viejo fuera del histórico' {
      $allowed = '^(\.docs/sdd/(specs|field-reports|releases|capabilities)/|\.docs/sdd/(changelog|roadmap|tech-stack|estimation-log)\.md$|tests/.*\.md$|skills/sdd-init-brownfield/references/migrations/|tests/FeatureRename\.Tests\.ps1$)'
      $files = git -C $script:RepoRoot ls-files | Where-Object { $_ -notmatch $allowed }
      $hits = $files | Where-Object { Select-String -LiteralPath (Join-Path $script:RepoRoot $_) -Pattern 'sdd-(start|end)-task' -Quiet }
      $hits | Should -BeNullOrEmpty
    }
  }
```

  `capabilities` va en la lista blanca solo hasta el cierre: se reescriben al fusionar el delta (decisión 9 de la spec), y el cierre la quita (§3).
- [ ] **Step 3: RED** — fallan. Copia al scratchpad.
- [ ] **Step 4: Paso de migración** — en `v2.0.0.md`, calcado de `v0.4.0.md` paso 2: sustituir en `CLAUDE.md`, `AGENTS.md` si existe, `.docs/sdd/*.md` salvo `changelog.md`, `client-changelog.md` y `roadmap.md`, y `.docs/sdd/capabilities/*.md`; sin gate; el informe lista los ficheros; sin menciones, se salta y lo dice; no toca `specs/`, `releases/`, `kit-feedback/` ni renombra carpetas. La línea `**Escribe**:` gana la frase en su «Además…». El párrafo de «Aplica a» lo menciona.
- [ ] **Step 5: Docs vivos** — clasificando cada mención: `CLAUDE.md`, `constitution.md` (Art. IV: `(feature|patch|proposal)`, con `task` como legado que se lee), `mission.md` (glosario: carril feature), `architecture.md` (árbol de `skills/`), `tech-stack.md` salvo «Aprendizajes por task (cronológicos)», `.docs/workflow/greenfield.md` y `brownfield.md`.
- [ ] **Step 6: Verificación** — el comando de «Verificación». Esperado: verde.
- [ ] **Step 7: Commit de la task** — `docs(sdd): migración y docs vivos con feature, y guarda de nombres viejos`.

### Task 4 — Campaña de enrutado y de migración

**Modelo**: sujetos Sonnet headless; análisis en la sesión.
**Tests RED**: no aplica: es la medición GREEN de la decisión 14 de la spec.
**Superficies**: docs (evidencia).
**Verificación**: `Invoke-Pester -Path tests/SubjectOutputPrivacy.Tests.ps1 -Output Detailed` sobre las salidas versionadas.
**Se prueba en la aplicación**: no, porque es evidencia: la comprobación es la tabla de resultados contra el criterio.

**Interfaces**:
- Consume: el kit de `HEAD` tras la Task 3.
- Produce: `tests/feature-rename-green.md`.

**Ficheros**: `tests/feature-rename-green.md`, `tests/feature-rename-red.md` (enlace), `green/` de la spec (subject.sh, moldes, salidas).

- [ ] **Step 1: Kit y moldes** — `git archive HEAD` al scratchpad; moldes `molde` y `molde-code` de la 0014; molde `e1` = `molde` en la rama `feature/0081-booking-reminders` con `plan.md` y `tasks.md` con todas las tasks `done`; molde `m1` = el de la Task 3.
- [ ] **Step 2: Lanzar** — `SCENARIOS="h1 h4 p1 p2 p3 p6 p4 p5 e1 m1"`, `PHASE=green`, `SUBJECT_CAP=15`, `COST_CAP=4`, un sujeto por escenario, en segundo plano.
- [ ] **Step 3: Leer** — primera skill invocada por sujeto (`first-skills.py` de la 0014); `m1`: `Select-String` de la spec sin resultados, `specs/…-task-0012-login/spec.md` sin tocar.
- [ ] **Step 4: Evidencia** — tabla contra el criterio de la spec (8 escenarios iguales a `auto-routing-green.md`, `e1` en `sdd-end-feature`, `m1` limpio), coste y sujetos; si algo falla, REFACTOR dentro del techo o parada al dev-lead.
- [ ] **Step 5: Verificación y commit** — `test(sdd-start-feature): GREEN del enrutado tras el renombrado a feature`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 4h
- Base de la estimación: 4 tasks; la Task 2 es la mitad (≈50 ficheros de skills y 28 de tests, clasificación manual); referencia: la 0062 renombró `sdd-plan` → `sdd-roadmap` en menos ficheros
- Confianza: media

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `Invoke-Pester -Path tests -Output Minimal` (suite entera, `Slow` incluidos) y `claude plugin validate --strict .`
- [ ] Criterios de la spec: cada THEN del delta con su test o su escenario de campaña
- [ ] Revisión final de rama: `sdd-kit:effort-high` + `opus`, con el bloque «De código» y foco en la clasificación task/feature
- [ ] Cierre con `sdd-end-feature` (la skill ya renombrada), que fusiona el delta y reescribe el vocabulario de las 11 capacidades; después quita `capabilities` de la lista blanca de `tests/FeatureRename.Tests.ps1` y el test guarda sigue verde

---

## 4. Self-review (cobertura spec → tasks)

- `routing` MODIFIED «Una petición de trabajo entra por el kit…» → Task 2 (router, description) + Task 4 (h1, h4, p1–p3, p6). ✓
- `routing` MODIFIED «El router solo existe donde hay SDD» → Task 2 (`Hook.Tests.ps1`, `FeatureRename` Context skills). ✓
- `routing` ADDED «El cierre de una feature entra por `sdd-end-feature`» → Task 2 (description) + Task 4 (e1). ✓
- `task-flow` ADDED «La carpeta de una feature nueva lleva `-feature-`» → Task 1 (`nombrado.md`, `spec-template.md`, test estático). ✓
- `task-flow` ADDED «Una carpeta `-task-` se cierra como legado» → Task 1 (Build-EstimationLog con `task:`) + el cierre de esta misma feature (decisión 13 de la spec). ✓
- `task-flow` ADDED «Las tasks del plan conservan su nombre» → Task 1 (`tasks-template.md` en `FeatureRename`) + Task 2 (clasificación). ✓
- `task-ids` ADDED y contrato de lectura → Task 1 (`feature-lane`, `feature-only`, `mixed-duplicate`). ✓
- `estimation` MODIFIED y ADDED → Task 1 (`features`, cabecera `Id`). ✓
- `kit-feedback` MODIFIED → Task 1 (`kit-feedback-template.md`) + Task 2 (`sdd-feedback/SKILL.md`, `KitFeedback.Tests.ps1`). ✓
- `migration` ADDED → Task 3 (paso y `MigrationInitParity`) + Task 3 m1 RED + Task 4 m1 GREEN. ✓
- Decisión 10 (docs vivos) → Task 2 (README, router) + Task 3 (resto). ✓
- Decisión 11 (guarda) → Task 3. ✓
- Decisión 9 (vocabulario de capacidades) → cierre. ✓
- Changelog `[Unreleased]` → cierre (`add-to-changelog`). ✓
