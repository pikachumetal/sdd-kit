# Changelog — sdd-kit

Formato: [Keep a Changelog 1.1.0](https://keepachangelog.com/). Changelog técnico del kit. Backward-looking: el `roadmap.md` es forward-looking.

## [Unreleased]

### Added

- **sdd-consult** — modo "sondear": un spike ("¿se puede…?", "pruébalo rápido") se prueba con código desechable y termina en una respuesta, sin carpeta, rama ni código conservado; antes la skill vetaba la prueba. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **sdd-start-task** — cuarta salida del enrutado: el spike no es una task y va a `sdd-consult`; antes salía como task con rama y spec. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **plan-template** — bloque "Restricciones globales" con copia literal de las restricciones de la spec y los artículos de la constitution aplicables, alineado con el `Global Constraints` de `writing-plans` 6.3.0. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)
- **README / constitution / roadmap** — versión de superpowers validada (6.3.0, 2026-09-07), revisión de compatibilidad en cada release del kit (Art. V) y sección de referencias de vigilancia (superpowers, OpenSpec, Spec Kit). → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)

### Changed

- **sdd-start-task** — la fila de overrides sobre la clasificación de `brainstorming` queda acotada a `bounded`/`architectural` y remite el spike al enrutado; el override en sí se probó 2/2 con `brainstorming` 6.3.0 real y se mantiene sin cambios. → [ref](specs/20260907-151234-task-0000-alineacion-superpowers/)

## [0.5.0] — 2026-09-02

### Added

- **modo lite del carril task** — variante para cambios acotados: spec corta y sin `plan.md`, habilitada por cinco condiciones observables y activada solo por confirmación del usuario; campo `mode` en el frontmatter de la spec, que lee `sdd-end-task`. Validado con RED→GREEN→REFACTOR. → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **dependencias declaradas en el manifest** — `plugin.json` declara `superpowers` como dependencia cross-marketplace y `marketplace.json` la autoriza; sin restricción de versión, para no depender de los tags de un repo ajeno. → [ref](specs/20260902-160308-task-0000-dependencias-declaradas/)

### Changed

- **sdd-start-task** — el paso 4 pasa a redactarse como invocación inequívoca de `superpowers:brainstorming`: 2/2 agentes del baseline lo leían como descripción de actividad y exploraban el código en su lugar. → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **sdd-start-task** — fila nueva de overrides: la clasificación de `brainstorming` (spike/bounded/architectural) no gobierna los artefactos del kit; su rama `bounded` ("no spec file, no implementation plan document") no aplica. → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **spec-template** — secciones marcadas *(solo full)* y bloque de estimación para el modo lite, que no tiene `plan.md` donde alojarlo. Plantilla única: no se crea `spec-lite-template.md` (Art. VIII). → [ref](specs/20260902-084856-task-0000-modo-lite/)
- **declaración de dependencias en fuente única** — el README pasa a ser la declaración canónica (canal, instalación y obligatoriedad de cada una, más las 6 skills de superpowers que el kit invoca) y `tech-stack` apunta a él en vez de repetir la lista, que ya había divergido. → [ref](specs/20260902-160308-task-0000-dependencias-declaradas/)
- **README** — la línea de estado pasa de "v0.3.0 publicada" a "v0.4.0 cerrada, sin distribuir": ninguna versión está publicada mientras no haya remoto. → [ref](specs/20260902-160308-task-0000-dependencias-declaradas/)

### Fixed

- **sdd-consult** — la rama de estructurar invocaba `superpowers:grilling`, nombre que no resuelve: `grilling` no la distribuye el plugin superpowers, es una skill personal instalada vía `npx skills add`. Rama muerta desde `ea4f0ba`, el commit que creó la skill. → [ref](specs/20260902-153722-patch-0000-grilling-reference/)

## [0.4.0] — 2026-07-22

### Changed

- **sdd-start-hotfix / sdd-end-hotfix → sdd-start-patch / sdd-end-patch** — rename del carril ligero para eliminar el equívoco con `hotfix/*` de git-flow (el carril describe el proceso, no el tipo de rama); plantilla `hotfix-template.md` → `patch-template.md`, artefacto `patch.md`, prefijo de carpeta `patch-`. Histórico preservado. → [ref](specs/20260722-103807-task-0000-carril-rama-worktree/)
- **sdd-start-task** — la fila `using-git-worktrees` del override deja de negar los worktrees: el kit no los gestiona pero respeta el git-flow del proyecto (worktrees incluidos). Verificado con RED→GREEN. → [ref](specs/20260722-103807-task-0000-carril-rama-worktree/)

## [0.3.0] — 2026-07-21

### Added

- **sdd-consult** — carril de consulta: preguntar/entender/planificar/estructurar con el contexto cargado, sin artefactos; grilling para estructurar, handoff anunciado a los carriles de trabajo. Validado con RED→GREEN. → [ref](specs/20260721-114445-task-0000-consult-skill/)

## [0.2.0] — 2026-07-21

### Added

- **sdd-start-release / sdd-end-release** — carril release: apertura con scope decidido por el usuario y cierre con acta+triage, retro con evidencia, release notes de cliente y gate de merge/tag; validadas con ciclo RED→GREEN→REFACTOR. → [ref](specs/20260721-082038-task-0000-release-skills/)
- **feedback-template / release-notes-template** — plantillas del acta de release y de las release notes en la fuente única. → [ref](specs/20260721-082038-task-0000-release-skills/)

### Changed

- **fuente única de plantillas** — los proyectos dejan de llevar `.docs/sdd/templates/`: las skills afectadas calcan del skill `sdd-templates`. → [ref](specs/20260721-082038-task-0000-release-skills/)
- **add-to-changelog** — el corte de versión queda señalado como acción de `sdd-end-release`. → [ref](specs/20260721-082038-task-0000-release-skills/)

## [0.1.0] — 2026-07-09

### Added

- **sdd-start-task / sdd-end-task** — ciclo de task con gates de aprobación y Definition of Done, validadas con TDD de writing-skills. → [ref](../../tests/)
- **sdd-start-hotfix / sdd-end-hotfix** — carril ligero con causa raíz obligatoria y merge reservado al usuario. → [ref](../../tests/)
- **add-to-changelog** — contrato de formato de entrada (una línea + link de trazabilidad). → [ref](../../tests/)
- **sdd-init-greenfield / sdd-init-brownfield** — arranque de proyecto por entrevista con gate / onboarding de codebase documentando el estado real. → [ref](../../tests/)
- **sdd-templates** — las 7 plantillas canónicas (base marketplace + injertos del legacy).
- Manifests de plugin (`.claude-plugin/`) con distribución dual (plugin de Claude Code + npx skills add).
- Documentos de flujo del equipo en `.docs/flux/` (greenfield, brownfield, annex — en catalán).
