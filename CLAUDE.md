# sdd-kit — Guía para Claude

Este repo es el kit SDD del equipo (plugin de Claude Code). La documentación de anclaje vive en `.docs/sdd/` — léela antes de trabajar en cualquier tarea. Los documentos de flujo del equipo (en catalán) están en `.docs/flux/`.

## Reglas críticas

1. **Ley de hierro de skills**: ninguna skill nueva ni edición de una existente (incluidos recortes y traducciones) sin ciclo RED→GREEN con subagentes, documentado en `tests/`. Detalle en `.docs/sdd/constitution.md`.
2. **Dogfooding**: los cambios no triviales del kit pasan por su propio flujo — artefactos en `.docs/sdd/specs/` con el naming estándar.
3. Texto humano en castellano; nombres de skill en inglés kebab-case. Commits bilingües (tipo/scope inglés, cuerpo castellano).
4. Cada release: bump de `version` en `.claude-plugin/plugin.json` + entrada en `.docs/sdd/changelog.md`.
5. Las plantillas canónicas viven en `skills/sdd-templates/templates/` — única fuente; `.docs/sdd/templates/` solo apunta ahí.
