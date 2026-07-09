# Changelog — sdd-kit

Formato: [Keep a Changelog 1.1.0](https://keepachangelog.com/). Changelog técnico del kit. Backward-looking: el `roadmap.md` es forward-looking.

## [Unreleased]

## [0.1.0] — 2026-07-09

### Added

- **sdd-start-task / sdd-end-task** — ciclo de task con gates de aprobación y Definition of Done, validadas con TDD de writing-skills. → [ref](../../tests/)
- **sdd-start-hotfix / sdd-end-hotfix** — carril ligero con causa raíz obligatoria y merge reservado al usuario. → [ref](../../tests/)
- **add-to-changelog** — contrato de formato de entrada (una línea + link de trazabilidad). → [ref](../../tests/)
- **sdd-init-greenfield / sdd-init-brownfield** — arranque de proyecto por entrevista con gate / onboarding de codebase documentando el estado real. → [ref](../../tests/)
- **sdd-templates** — las 7 plantillas canónicas (base marketplace + injertos del legacy).
- Manifests de plugin (`.claude-plugin/`) con distribución dual (plugin de Claude Code + npx skills add).
- Documentos de flujo del equipo en `.docs/flux/` (greenfield, brownfield, annex — en catalán).
