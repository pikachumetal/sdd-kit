---
id: 20260925-163055-task-0064-task-to-feature-rename
task: 0064
title: Renombrado task → feature
mode: full
profile: delegate
status: approved
created: 2026-09-25
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Renombrado task → feature

## Capacidades

- Modificadas: `routing` — las puertas de entrada pasan a `sdd-start-feature` y `sdd-end-feature`
- Modificadas: `task-flow` — la carpeta de una feature nueva lleva `-feature-`; las `-task-` quedan como legado; las tasks del plan conservan su nombre
- Modificadas: `task-ids` — el escaneo de ids cuenta las carpetas `-feature-` además de las `-task-`
- Modificadas: `estimation` — el log lee `feature:` y `task:`, y su columna de id pasa a `Id`
- Modificadas: `kit-feedback` — el ticket de una feature se nombra `-feature-`
- Modificadas: `migration` — la migración a v2.0.0 sustituye los nombres de las dos skills en los docs vivos del proyecto

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (nombres de skill que teclean los devs, patrón de carpeta que leen dos scripts, campo `feature:` del frontmatter), MODIFIED (dos requisitos de `routing`, uno de `kit-feedback`), seis capacidades, migración (paso nuevo en `v2.0.0.md`)
- Dominio: si el barrido literal de la decisión 9 cambia en silencio algún GIVEN/WHEN/THEN de `control-profiles` o `commit-history`, donde «task» a veces es la unidad y a veces la task del plan (señal: MODIFIED + seis capacidades)
- Técnica: si la lectura doble `task|feature` cubre los dos lectores del patrón (`Get-NextSddId`, `Build-EstimationLog`) y si el paso de migración deja intacto el histórico que exige la decisión 8 (señal: contrato público + migración)
- Mínimo razonable: solo técnica — deja sin mirar las menciones en las que «task» es ambigua, que es donde un renombrado mecánico mete un error sin que falle ningún test
```

1. **Nombres de skill**: `sdd-start-task` → `sdd-start-feature` y `sdd-end-task` → `sdd-end-feature`, con `git mv` de sus carpetas. **Sin alias ni skill puente**: una skill de más compite en el enrutado, y el aviso lo da la migración (decisión 8) y el changelog de la 2.0.0.
2. **Qué se renombra y qué no**: la unidad del kit pasa a «feature» (en castellano, «la feature»). Las tasks internas del plan son de superpowers y conservan su nombre: «Task N», `tasks.md`, `tasks-template.md`, `task-start`/`task-done`, «revisión de task», «encargo de la task». Cada mención se clasifica a mano; no hay sustitución ciega.
3. **Disparadores en castellano**: las `description` de las skills renombradas conservan «tarea» y «cierra la tarea» como frases de disparo, porque es lo que escribe un dev, y añaden «feature». La campaña (decisión 14) lo mide.
4. **Carpetas**: las nuevas se llaman `<yyyyMMdd-HHmmss>-feature-<id>-<slug>`. Las `-task-` existentes, aquí y en los proyectos, **no se renombran**: quedan como legado, igual que las `hotfix-` de la v0.4.0. Los scripts leen `feature`, `task`, `patch`, `proposal` y `hotfix`, como hasta ahora con el legado.
5. **Frontmatter**: `spec-template`, `plan-template` y `walkthrough-template` pasan a `feature: <id>` e `id: <ts>-feature-<id>-<slug>`. `patch-template` y `kit-feedback-template` conservan `task:`, porque los patches no cambian y el ticket sirve para los dos carriles. `Build-EstimationLog` lee `feature:` y, si no está, `task:`.
6. **Columna del estimation-log**: `Task` → `Id`, porque la columna lleva también los ids de patch. La cabecera `| id | Task |` de `roadmap-template.md` pasa a `| id | Feature |`. La de `tasks-template.md` se queda, porque son tasks del plan.
7. **Rama**: sin cambios. Ya es `feature/<id>-<slug>`, y ahora coincide con el nombre de la unidad.
8. **Migración**: un paso nuevo en `v2.0.0.md`, calcado del paso de la v0.4.0 (hotfix → patch). Sustituye `sdd-start-task`/`sdd-end-task` en `CLAUDE.md`, `AGENTS.md` si existe, los docs de primer nivel de `.docs/sdd/` salvo `changelog.md`, `client-changelog.md` y `roadmap.md`, y `capabilities/`. Va sin gate y el informe lista los ficheros. **No toca** `specs/`, `changelog.md`, `roadmap.md`, `releases/` ni `kit-feedback/`, que son histórico, ni renombra carpetas. Las init no ganan pregunta: un proyecto nuevo nace con las plantillas nuevas.
9. **Capacidades de este repo**: los slugs `task-flow` y `task-ids` **se mantienen**. El delta no sabe renombrar un fichero, y las specs cerradas los enlazan; renombrarlos queda como fila de deuda. El delta lleva solo los requisitos cuyo comportamiento cambia. El resto de menciones en `capabilities/`, en las 11 capacidades que las tienen (todas salvo `configuration`, `onboarding` y `migration`), se reescribe al fusionar: los dos nombres de skill y «task» como unidad, en prosa y en títulos de requisito, sin cambiar ningún comportamiento. Es una excepción a la forma del delta y se declara aquí para que el cierre la aplique. Esas capacidades no van en el bloque «Capacidades», porque `Test-Capabilities.ps1 -Artifact` exige que el bloque y el delta nombren las mismas. **No es una sustitución literal**: cada mención se clasifica como en la decisión 2. Estos requisitos usan «task» en los dos sentidos en la misma frase y se reescriben uno a uno:
   - de `control-profiles`: «La fila de la task se compara con la base antes de cada despacho», «Los ficheros de la task se cruzan con la base antes de cada despacho» y «La primera pregunta propone partir una task grande»;
   - de `commit-history`: «La apertura de una task queda en un commit» y «El cierre de una task queda en un commit».

   El walkthrough lista cada título renombrado y el texto final de esos cinco requisitos.
10. **Docs vivos de este repo** que se reescriben: `CLAUDE.md`, `README.md`, `hooks/router.md`, `constitution.md` (el patrón del Art. IV pasa a `(feature|patch|proposal)` con `task` como legado), `mission.md`, `architecture.md`, las secciones no cronológicas de `tech-stack.md` y `.docs/workflow/greenfield.md` y `brownfield.md`. **Histórico intacto**: `specs/`, `field-reports/`, `tests/*-red.md`/`*-green.md`/`*-ab.md`, las entradas cerradas del changelog, el roadmap (salvo la fila 0064 al cerrar), «Aprendizajes por task» de `tech-stack.md` y las migraciones anteriores a la v2.0.0.
11. **Guarda de no regresión**: un test Pester nuevo falla si queda `sdd-start-task` o `sdd-end-task` en el repo fuera de esta lista blanca: `.docs/sdd/specs/`, `field-reports/`, `releases/`, `changelog.md`, `roadmap.md`, `tech-stack.md` (por sus aprendizajes cronológicos), `estimation-log.md`, los `.md` de `tests/` a cualquier profundidad (`tests/fixtures/` incluida, porque versiona texto real de artefactos), `migrations/` y el propio test. Así, lo que se escape del barrido lo caza la suite y no un dev el lunes.
12. **La fila del roadmap nombraba `Invoke-SddMerge` como lector del patrón**: no lo lee (no contiene «task» ni el patrón de carpeta), así que la lectura doble va solo en los otros dos scripts.
13. **La carpeta de esta spec** lleva `-task-`: se creó con el kit vigente antes del renombrado. Los scripts la leen como legado, y es la primera prueba real de la decisión 4.
14. **Campaña (Art. I: renombrar una skill es editarla)**. Se reproduce el enrutado de entrada tras el renombrado, un sujeto Sonnet por escenario, con los moldes y peticiones de `tests/auto-routing-green.md`:
    - `h1` y `h4`, más las cotidianas `p1`, `p2`, `p3` y `p6`, deben entrar por `sdd-start-feature`.
    - Controles: `p4` debe ir a `sdd-consult` y `p5` a `sdd-start-patch`.
    - `e1` es nuevo: «hemos acabado, cierra la tarea» en una rama con el plan hecho debe entrar por `sdd-end-feature`.
    - La migración lleva `m1`, con RED (sin el paso, deja menciones viejas) y GREEN (con el paso, no queda ninguna).

    **Previsión**: 11 sujetos, ~2,5 $, ~45 min. **Techo**: 15 sujetos y 4 $; si se supera, paro. Pasos que cambian y cómo se miden:
    - `sdd-start-feature/SKILL.md` y `sdd-end-feature/SKILL.md` (su `description` y los pasos que nombran la otra skill): con `h1`, `h4`, `p1`–`p3`, `p6` y `e1`. Los sujetos cargan la skill renombrada y recorren sus pasos 1–2.
    - `hooks/router.md`: con esos mismos escenarios, porque el hook lo inyecta en todos.
    - El patrón de `sdd-start-feature/references/nombrado.md`: **sin sujeto**, porque es un literal que el agente copia; lo cubre un test estático.
    - El paso nuevo de `migrations/v2.0.0.md`: con `m1`, en RED y GREEN.
    - **Sin sujeto**, en el resto de skills y `references/`. Allí solo cambia el nombre de la otra skill o la palabra que nombra la unidad, sin añadir ni quitar conducta. La conducta que nombran, enrutar a otra skill, ya la miden `p4`, `p5` y `e1`, y un nombre viejo lo caza el test guarda (decisión 11). Son:
      - `sdd-start-patch`, `sdd-end-patch`, `sdd-consult`, `sdd-roadmap`, `sdd-config`, `sdd-feedback` y `add-to-changelog`;
      - `sdd-end-release` y su `notas-y-roadmap.md`;
      - `sdd-init-greenfield` y su `estructura.md`; `sdd-init-brownfield` y su `generacion.md`;
      - `sdd-templates/SKILL.md`;
      - de `sdd-start-feature/references/`: `commit-milestones.md`, `control-profiles.md`, `encargo-revision.md`, `modo-lite.md`, `overrides-superpowers.md` y `review-spec.md`;
      - de `sdd-end-feature/references/`: `aprendizajes-skills.md`, `estimation.md` y `merge-recipe.md`.
    - Las plantillas de `sdd-templates/templates/`: **sin sujeto**. El campo `feature:` y la cabecera `Id` los prueban los tests Pester de los scripts contra la plantilla calcada, como fija `architecture.md`.

    **Criterio**: igual que `auto-routing-green.md` en los 8 escenarios que repite, `e1` en `sdd-end-feature` y `m1` limpio.

### Hallazgos de la review

Dos revisores Sonnet, effort medium (`sdd-kit:effort-medium`): dominio con los puntos 1, 3, 5, 5 bis y 7; técnica con los puntos 2, 4 y 6.

- **Aceptado** — (dominio, Crítico) el barrido de `capabilities/` alcanzaba `control-profiles` y `commit-history` sin declararlo → la decisión 9 nombra las 11 capacidades afectadas y el Scope lo lista. No van en el bloque «Capacidades» porque `Test-Capabilities.ps1 -Artifact` exige que coincida con el delta.
- **Aceptado en parte** — (dominio y técnica, Crítico) el «Contrato de lectura del roadmap» de `task-ids` no incluía `feature-<id>-` → el delta de `task-ids` lleva ese contrato en «Reglas de la capacidad». El requisito «Una task no planificada obtiene su id…» no cambia de texto (el patrón vive en el contrato), así que el escenario nuevo sigue como `ADDED`.
- **Aceptado** — (dominio y técnica, Importante) la lista de columnas de «El estimation-log se genera desde los artefactos de cierre» decía «task» → pasa a `MODIFIED` con «id».
- **Aceptado** — (dominio, Crítico ×2 e Importante) cinco requisitos de `control-profiles` y `commit-history` usan «task» en los dos sentidos → la decisión 9 los nombra, los reescribe uno a uno y descarta la sustitución literal.
- **Aceptado** — (dominio, Importante) faltaba el caso de un mismo id en una carpeta `-task-` y en otra `-feature-` → `AND` en `task-ids` que remite al aviso de id duplicado.
- **Aceptado** — (técnica, Crítico) la verificación de la migración no miraba `AGENTS.md` → entra en el `Select-String`.
- **Aceptado** — (técnica, Importante) la decisión 14 agrupaba el resto del vocabulario sin listarlo → lista cada skill, `references/` y plantilla, con su escenario o el motivo de no medirlo.
- **Aceptado** — (técnica, Importante) la lista blanca `tests/*.md` no dejaba claro si incluía `tests/fixtures/` → la decisión 11 dice «a cualquier profundidad».
- **Aceptado** — (técnica, Menor) el escenario de `task-ids` no decía nada de ramas y worktrees → el GIVEN lo precisa y remite al requisito que no cambia.

### Decisiones tomadas con el dev-lead

- Review de spec con dos revisores — «Dos revisores (Recomendada)»
- Aprobación de la spec en el gate — «Apruebo (Recomendada)»

- Paradas: la spec se enseña y se aprueba de forma explícita; perfil `delegate` — «Me enseñas la spec (Recomendada)»
- Una sola task, sin partir, aunque el plan prevé 4 tasks internas — «Entera, una task (Recomendada)»

## Intent

Hoy «task» nombra dos cosas: la unidad de trabajo del kit (`sdd-start-task`, carpetas `-task-`) y las tasks internas del plan, que pone superpowers y no se pueden renombrar. El despliegue de SDD a toda la empresa exige un vocabulario simple que nadie tenga que reaprender. La unidad del kit pasa a llamarse **feature**, como en spec-kit, y «task» queda solo para las tasks del plan. La 0074 (`using-sdd`) necesita estos nombres definitivos antes del corte de la 2.0.0.

## Scope

- Entra:
  - Renombrar las dos skills y su vocabulario en todas las skills, `references/`, plantillas, `hooks/router.md` y README.
  - Lectura doble `task|feature` en `Get-NextSddId.ps1` y `Build-EstimationLog.ps1`, con sus tests.
  - El campo `feature:` del frontmatter y la columna `Id`.
  - El paso de migración en `v2.0.0.md`.
  - Los docs vivos del repo de la decisión 10.
  - La reescritura de vocabulario en las 11 capacidades de la decisión 9, al fusionar.
  - Los tests Pester que nombran las skills y el test guarda de la decisión 11.
  - La campaña de la decisión 14 y la entrada en `[Unreleased]` del changelog.
- No entra:
  - Renombrar carpetas `-task-` existentes, aquí o en los proyectos.
  - Tocar los patches.
  - Renombrar los slugs `task-flow`/`task-ids`, que queda como deuda.
  - Tocar evidencia histórica (`tests/*.md`, `specs/`, `field-reports/`).
  - La skill `using-sdd` y la retirada de `hooks/router.md` (0074).
  - Renombrar `migrations/v1.2.0.md`, el bump de versión y el README de salida, que son del corte de la release.

## Approach

Renombrado mecánico en dos capas. Los **lectores** (scripts) aceptan los dos nombres antes de que nada escriba el nuevo, con TDD sobre fixtures con carpetas `-task-` y `-feature-` mezcladas. Los **escritores** (skills y plantillas) pasan a escribir solo `feature`. Cada mención de «task» se clasifica: unidad del kit → feature; task del plan → se queda. El test guarda impide que un nombre viejo sobreviva fuera del histórico. La migración repite la forma de la v0.4.0, que ya hizo este mismo renombrado con hotfix → patch.

## Delta de comportamiento

### Capacidad: `routing`

**MODIFIED — Una petición de trabajo entra por el kit, no por brainstorming** (antes: «la primera skill que se invoca es `sdd-kit:sdd-start-task`»)

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-feature`
- AND `superpowers:brainstorming` se invoca después, desde el paso 4 de `sdd-start-feature`, nunca antes

**MODIFIED — El router solo existe donde hay SDD** (antes: «el router, que nombra `sdd-start-task`»)

- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el router, que nombra `sdd-start-feature`, `sdd-start-patch` y `sdd-consult`

**ADDED — El cierre de una feature entra por `sdd-end-feature`**

- GIVEN un proyecto con `.docs/sdd/`, en la rama `feature/0081-booking-reminders` con su `plan.md` y su `tasks.md` con todas las tasks hechas
- WHEN el usuario escribe «hemos acabado, cierra la tarea»
- THEN la primera skill que se invoca es `sdd-kit:sdd-end-feature`

### Capacidad: `task-flow`

**ADDED — La carpeta de una feature nueva lleva `-feature-`**

- GIVEN un proyecto en modo `sequence` con la fila 0081 «Avisos de reserva» pendiente en el roadmap
- WHEN `sdd-start-feature` crea la carpeta de la spec el 2026-10-01 a las 09:15:00 UTC
- THEN la carpeta es `.docs/sdd/specs/20261001-091500-feature-0081-booking-reminders/`
- AND el frontmatter de `spec.md` lleva `id: 20261001-091500-feature-0081-booking-reminders` y `feature: 0081`

**ADDED — Una carpeta `-task-` se cierra como legado**

- GIVEN la rama `feature/0064-task-to-feature-rename` con su carpeta `20260925-163055-task-0064-task-to-feature-rename/`, cuyo `spec.md` lleva `task: 0064`
- WHEN `sdd-end-feature` cierra la feature
- THEN escribe `walkthrough.md` en esa misma carpeta, sin renombrarla
- AND el estimation-log regenerado tiene una fila con id `0064` y carpeta `20260925-163055-task-0064-task-to-feature-rename`

**ADDED — Las tasks del plan conservan su nombre**

- GIVEN una feature en modo full con su plan escrito
- WHEN el dev abre `plan.md` y el registro vivo
- THEN las unidades del plan se llaman «Task 1», «Task 2»… y el registro es `tasks.md`, con cabecera `| # | Task | Status | Commit | Notas |`
- AND la palabra «feature» nombra solo la unidad del kit: la spec, la rama y la carpeta

### Capacidad: `task-ids`

**ADDED — El escaneo cuenta las carpetas `-feature-` y las `-task-`**

- GIVEN un proyecto en modo `sequence` con `specs/20260920-100000-task-0063-a/`, `specs/20261001-091500-feature-0079-b/` y `specs/20261002-100000-patch-0080-c/`, sin ninguna fila del roadmap, rama, worktree ni contador con un id mayor (el resto de fuentes lo cubre «Una task no planificada obtiene su id con un script determinista», que no cambia)
- WHEN se ejecuta `Get-NextSddId.ps1 -ProjectRoot <raíz>` sin `-Reserve`
- THEN propone `0081`
- AND si solo existiera `…-feature-0079-b/`, propondría `0080`
- AND si `specs/` tiene a la vez `…-task-0063-a/` y `…-feature-0063-b/`, es un id duplicado: se aplica «El script avisa de un id duplicado y no devuelve ninguno», sin distinguir carril

**Reglas de la capacidad**

- **Contrato de lectura del roadmap**: el script reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en los nombres de artefacto (`feature-<id>-`, `task-<id>-`, `patch-<id>-`, `proposal-<id>-`) y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.

### Capacidad: `estimation`

**MODIFIED — El estimation-log se genera desde los artefactos de cierre** (antes: «una fila por artefacto (fecha, task, tipo, …)»)

- GIVEN un proyecto con `.docs/sdd/estimation.md` y al menos un `walkthrough.md` o `patch.md` con bloque de tiempo
- WHEN se ejecuta `Build-EstimationLog.ps1 -Root <proyecto>`
- THEN `<docs>/estimation-log.md` se regenera entero con una fila por artefacto (fecha, id, tipo, estimado, real, ratio, tokens del hilo, tokens de subagentes, sujetos ($), sesión ($), carpeta), ordenado por carpeta
- AND la fecha de la fila es la de cierre: la primera línea `created: AAAA-MM-DD` o `date: AAAA-MM-DD` del artefacto; sin ella, o con el placeholder de la plantilla, la fecha de la carpeta, que es la de apertura
- AND `Sesión ($)` es la cifra de `Coste de la sesión`; «sin precio» y «no medido» aparecen tal cual, y sin la línea la celda es `—`
- AND el fichero lleva cabecera "AUTO-GENERADO — no editar a mano"

**ADDED — El log lee las features y las tasks heredadas**

- GIVEN `specs/20260920-100000-task-0063-a/walkthrough.md` con `task: 0063` y `specs/20261001-091500-feature-0079-b/walkthrough.md` con `feature: 0079`, los dos con su bloque de tiempo
- WHEN se ejecuta `Build-EstimationLog.ps1 -Root <proyecto>`
- THEN `estimation-log.md` tiene dos filas, con ids `0063` y `0079`
- AND la cabecera de la tabla es `| Fecha | Id | Tipo | Est (h) | Real (h) | Ratio | Hilo (tokens) | Subagentes (tokens) | Sujetos ($) | Sesión ($) | Carpeta |`

### Capacidad: `kit-feedback`

**MODIFIED — El ticket de mejora del kit vive en `.docs/sdd/kit-feedback/`** (antes: «`<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md`»)

- GIVEN un proyecto con `.docs/sdd/`
- WHEN `sdd-feedback` genera un ticket
- THEN lo escribe en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>.md`, con el timestamp en UTC y el id del modo declarado en `sdd-kit.json`, calcado de `kit-feedback-template.md` del skill `sdd-templates`
- AND si la carpeta no existe la crea y avisa una sola vez de que puede ignorarse en git; no edita `.gitignore`

### Capacidad: `migration`

**ADDED — La migración a v2.0.0 cambia los nombres de las skills de feature**

- GIVEN un proyecto en el kit v1.2.0 cuyo `CLAUDE.md` dice «arranca el trabajo con `sdd-start-task`», cuyo `.docs/sdd/constitution.md` cita `sdd-end-task`, y con `specs/20260910-080000-task-0012-login/spec.md`, que también cita `sdd-end-task`
- WHEN se migra al kit v2.0.0
- THEN `CLAUDE.md` dice «arranca el trabajo con `sdd-start-feature`» y `constitution.md` cita `sdd-end-feature`, sin gate
- AND `specs/20260910-080000-task-0012-login/spec.md` sigue citando `sdd-end-task`, y la carpeta no se renombra
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la verificación de la migración, con `Select-String -Path CLAUDE.md, AGENTS.md, .docs/sdd/*.md, .docs/sdd/capabilities/*.md -Exclude changelog.md, client-changelog.md, roadmap.md -Pattern 'sdd-(start|end)-task' -ErrorAction SilentlyContinue` (sin `AGENTS.md`, esa ruta no cuenta), no devuelve nada

## Enmiendas

## Aprobaciones

- 2026-09-25 — dev-lead (Àngel Delgado): «Apruebo (Recomendada)», tras la review de dos lentes con sus hallazgos incorporados.
