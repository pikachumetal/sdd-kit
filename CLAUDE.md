# sdd-kit — Guía para Claude

Arranca las sesiones de este repo con `./Start-KitSession.ps1` (acepta argumentos extra, p. ej. `--model sonnet`): carga las skills del working tree y deshabilita el plugin publicado, que el `.claude/settings.json` del repo activa.

Repo del kit SDD del equipo (plugin de Claude Code). Antes de trabajar en cualquier tarea, lee los documentos de anclaje que apliquen — este fichero solo es el índice.

## Dónde está cada cosa

- `.docs/sdd/mission.md` — por qué existe el kit, usuarios, y el glosario del equipo (documentos de anclaje, carriles, predicados, walkthrough).
- `.docs/sdd/constitution.md` — los 10 artículos no negociables: ley de hierro de skills, la forma sigue al fallo, idioma, convenciones que el kit fija a los proyectos, versionado y migraciones, commits, dogfooding, fuente única de plantillas, relación con superpowers, calidad de código.
- `.docs/sdd/tech-stack.md` — distribución dual (plugin de Claude Code + `npx skills add`), dependencia de superpowers, cómo se testean las skills.
- `.docs/sdd/architecture.md` — estructura del repo, anatomía de una skill y de su evidencia de test.
- `.docs/sdd/roadmap.md` — próximo, backlog, deuda técnica inventariada y decisiones pendientes.
- `.docs/sdd/changelog.md` — historial de releases (Keep a Changelog, SemVer).
- `.docs/sdd/estimation.md` y `.docs/sdd/estimation-log.md` — método de estimación y registro estimado-vs-real.
- `.docs/sdd/field-reports/` — tickets de campo escritos por agentes que usaron el kit en proyectos reales, copiados literales. Desde la task 0002 nacen en `.docs/sdd/kit-feedback/` del proyecto vía `sdd-feedback`; los anteriores, en scratchpads efímeros. Son la evidencia de origen de las filas de deuda del roadmap; no se editan. **En este repo, el ticket de una task del kit va directo a `field-reports/`**, sin pasar por `kit-feedback/`.
- `.docs/sdd/specs/` — artefactos SDD de las tareas del propio kit (spec, plan, walkthrough por carpeta).
- `.docs/workflow/` — documentación temprana del flujo en castellano: [greenfield](.docs/workflow/greenfield.md), [brownfield](.docs/workflow/brownfield.md) y el [anexo de evidencia](.docs/workflow/evidence-and-references.md). Es **de este repo**, no algo que el kit fije a los proyectos: ninguna skill la nombra. Los dos primeros describen el kit y se releen al subir de versión; lo vigila `tests/WorkflowDocs.Tests.ps1`, que compara su marcador «Última revisión: kit vX.Y.Z» con `plugin.json`.
- `skills/<nombre>/SKILL.md` — las 12 skills del kit. `skills/sdd-templates/templates/` es la **fuente única** de las plantillas.
- `tests/` — evidencia RED/GREEN de cada skill (baseline sin skill → verificación con skill).
- `.claude-plugin/` — manifests del plugin (versión) y del marketplace.

## Reglas críticas (detalle y justificación en la constitution)

1. **Ley de hierro de skills** (Art. I): ninguna skill nueva ni edición de una existente — incluidos recortes y traducciones — sin ciclo RED→GREEN documentado en `tests/`.
2. **Dogfooding** (Art. VII): los cambios no triviales del kit se arrancan con `sdd-start-task`; artefactos en `.docs/sdd/specs/` con el naming estándar. Fixes pequeños deterministas → carril patch. El flujo se sigue con las skills del **working tree** (`skills/`), no con las de la caché del plugin instalado: si difieren, mandan las del working tree. Por eso la sesión se arranca con `./Start-KitSession.ps1` (comprobado en sesión interactiva en el patch 0027: el `Base directory` de la skill apunta al worktree; sin script, a la caché). Si la sesión no salió del script, antes de ejecutar un paso de una skill cargada por el harness contrasta su texto con `skills/<nombre>/SKILL.md` de la rama — cinco reportes de skills cargadas desde la caché (tickets 0003, 0004, 0013, 0005 y patch 0024).
3. Texto humano en castellano con ortografía correcta; nombres de skill en inglés kebab-case; commits bilingües (tipo/scope inglés, cuerpo castellano).
4. Cada release: bump de `version` en `.claude-plugin/plugin.json` + entrada en `.docs/sdd/changelog.md`.
5. **Sin memoria automática**: este repo lleva `autoMemoryEnabled: false`. Lo que aprendas se escribe en los docs (`tech-stack.md`, `roadmap.md`, `constitution.md`), nunca en la memoria del agente: la memoria se queda en un PC, los docs van al repositorio.
6. **Cuando el dev-lead delega** («me dejo recomendar», «decide tú», «vas solo»): aplica el perfil `delegate` de `skills/sdd-start-task/references/control-profiles.md`. Decides tú lo de método, sin preguntas intermedias, y se lo cuentas al final en llano. Paras solo en cuatro casos: la **aprobación de la spec**, un **desvío** de la spec aprobada (los frenos de alcance incluidos), la **validación final** y una decisión que es suya de verdad (nivel, alcance, dinero), explicando antes los términos que das por sabidos. La parada de la spec desaparece solo si el dev-lead la nombra en la petición («no me enseñes la spec», «nos vemos en el end-task»): entonces la apruebas por delegación y la spec registra su frase literal y la fecha. Delegar sin nombrarla no la quita, y la validación final no se quita nunca. *Por qué*: en la 0.6.0 se perdió con la ceremonia y lo dijo dos veces (con menos preguntas cerró T3, T4 y T5 en un día); y en la 0025 la versión anterior de esta regla («sin checkpoints intermedios») hizo saltarse la spec.
7. Las plantillas NO se duplican (Art. VIII): se calcan siempre del skill `sdd-templates`; ningún proyecto (ni este repo) lleva carpeta `templates/`.
