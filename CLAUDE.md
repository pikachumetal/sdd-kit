# sdd-kit — Guía para Claude

Repo del kit SDD del equipo (plugin de Claude Code). Antes de trabajar en cualquier tarea, lee los documentos de anclaje que apliquen — este fichero solo es el índice.

## Dónde está cada cosa

- `.docs/sdd/mission.md` — por qué existe el kit, usuarios, y el glosario del equipo (documentos de anclaje, carriles, predicados, walkthrough).
- `.docs/sdd/constitution.md` — los 10 artículos no negociables: ley de hierro de skills, la forma sigue al fallo, idioma, convenciones que el kit fija a los proyectos, versionado y migraciones, commits, dogfooding, fuente única de plantillas, relación con superpowers, calidad de código.
- `.docs/sdd/tech-stack.md` — distribución dual (plugin de Claude Code + `npx skills add`), dependencia de superpowers, cómo se testean las skills.
- `.docs/sdd/architecture.md` — estructura del repo, anatomía de una skill y de su evidencia de test.
- `.docs/sdd/roadmap.md` — próximo, backlog, deuda técnica inventariada y decisiones pendientes.
- `.docs/sdd/changelog.md` — historial de releases (Keep a Changelog, SemVer).
- `.docs/sdd/estimation.md` y `.docs/sdd/estimation-log.md` — método de estimación y registro estimado-vs-real.
- `.docs/sdd/field-reports/` — tickets de campo escritos por agentes que usaron el kit en proyectos reales, copiados literales (nacen en scratchpads efímeros). Son la evidencia de origen de las filas de deuda del roadmap; no se editan.
- `.docs/sdd/specs/` — artefactos SDD de las tareas del propio kit (spec, plan, walkthrough por carpeta).
- `.docs/flux/` — los documentos de flujo del equipo, en catalán: greenfield, brownfield y anexo de evidencia.
- `skills/<nombre>/SKILL.md` — las 11 skills del kit. `skills/sdd-templates/templates/` es la **fuente única** de las plantillas.
- `tests/` — evidencia RED/GREEN de cada skill (baseline sin skill → verificación con skill).
- `.claude-plugin/` — manifests del plugin (versión) y del marketplace.

## Reglas críticas (detalle y justificación en la constitution)

1. **Ley de hierro de skills** (Art. I): ninguna skill nueva ni edición de una existente — incluidos recortes y traducciones — sin ciclo RED→GREEN documentado en `tests/`.
2. **Dogfooding** (Art. VII): los cambios no triviales del kit se arrancan con `sdd-start-task`; artefactos en `.docs/sdd/specs/` con el naming estándar. Fixes pequeños deterministas → carril patch.
3. Texto humano en castellano con ortografía correcta; nombres de skill en inglés kebab-case; commits bilingües (tipo/scope inglés, cuerpo castellano).
4. Cada release: bump de `version` en `.claude-plugin/plugin.json` + entrada en `.docs/sdd/changelog.md`.
5. Las plantillas NO se duplican (Art. VIII): se calcan siempre del skill `sdd-templates`; ningún proyecto (ni este repo) lleva carpeta `templates/`.
