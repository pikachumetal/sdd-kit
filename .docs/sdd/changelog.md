# Changelog — sdd-kit

Formato: [Keep a Changelog 1.1.0](https://keepachangelog.com/). Changelog técnico del kit. Backward-looking: el `roadmap.md` es forward-looking.

## [Unreleased]

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
