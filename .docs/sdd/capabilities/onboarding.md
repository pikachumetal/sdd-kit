# Capacidad — onboarding

Verdad viva del comportamiento observable de la inicialización de un proyecto con el kit (`sdd-init-greenfield`, `sdd-init-brownfield`): lo que un dev puede esperar de la entrevista y de los documentos de anclaje que produce. La declaró la spec de la task `reglas-de-capacidad` en sus «Decisiones a validar» (decisión 9). La actualización de un proyecto ya inicializado vive en `migracion`.

## Requisitos

### La entrevista fija las cinco reglas de producto
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada
- AND el bloque de proceso ha decidido además el modo de ids del proyecto, que se escribe en `sdd-kit.json`

### La entrevista hace una sola pregunta por turno
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta al usuario o le presenta un documento
- THEN cada turno termina con una única pregunta de la lista de la entrevista, o con un único documento para aprobar
- AND convención de ramas, worktrees y entorno del worktree son preguntas distintas, en turnos distintos

### La pregunta de ramas recomienda git-flow
- GIVEN una init greenfield que llega a la convención de ramas
- WHEN el agente la pregunta
- THEN la opción recomendada es git-flow: `main` estable, `develop` de integración y `feature/<id>` desde `develop`
- AND el usuario puede elegir otra, y se registra la que elija

### Lo que fijan las instrucciones del usuario no se pregunta
- GIVEN unas instrucciones del usuario (`CLAUDE.md` global o del proyecto) que ya fijan un punto de la entrevista, p. ej. el formato de commit o el idioma del código
- WHEN la entrevista llega a ese punto
- THEN el agente no lo pregunta: la constitution lo referencia

### Git sobre un repo existente
- GIVEN una init greenfield sobre un repo que ya existe y cuyas ramas o remoto no siguen la convención acordada
- WHEN la init llega al paso de git
- THEN el agente presenta el plan completo (renombrados, ramas nuevas, rama por defecto del remoto, borrados) y espera la confirmación antes de ejecutar nada
- AND las operaciones sobre el remoto las ejecuta el usuario, con los comandos que le da el agente

### La init calca cada documento de su plantilla
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield` que crea `mission.md`, `constitution.md`, `tech-stack.md`, `architecture.md`, `roadmap.md`, `estimation.md` o `changelog.md`
- WHEN escribe cada documento
- THEN su estructura es la de la plantilla correspondiente de `sdd-templates`, y el contenido sale de la entrevista (greenfield) o del código (brownfield)
- AND ningún documento copia texto, secciones ni notas del `.docs/` del kit ni de otro proyecto
- AND las tablas que leen otras skills (patches, deuda técnica, backlog del roadmap; `## [Unreleased]` del changelog) tienen las columnas y cabeceras literales de la plantilla

### La entrevista fija las claves de control
- GIVEN una init greenfield o brownfield con el usuario presente
- WHEN la entrevista llega a las claves de control
- THEN el agente hace, en turnos distintos, las tres preguntas del bloque de `control-profiles.md`, cada una con su opción recomendada y su motivo: perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona) y frenos (3 agentes; 8 y 20 minutos)
- AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar
- AND en brownfield sin usuario, las tres quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults

### La init deja la memoria automática desactivada y los temporales ignorados
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield`
- WHEN crea la estructura del proyecto
- THEN `.claude/settings.json` tiene `"autoMemoryEnabled": false` y conserva las demás claves que ya tuviera
- AND `.gitignore` contiene las líneas `.playwright-mcp/` y `.superpowers/` una sola vez cada una
- AND si `.claude/settings.json` ya tenía `"autoMemoryEnabled": true`, el agente pregunta antes de cambiarlo; si el usuario dice que no, la clave se queda en `true` y el resumen de cierre lo anota

### El log de estimación lo genera el script del kit
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield`
- WHEN crea `estimation-log.md`
- THEN lo genera `Build-EstimationLog.ps1` ejecutado desde `sdd-templates/scripts/` del kit: la primera línea empieza por `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)` y la tabla no tiene filas
- AND el proyecto no contiene ninguna copia del script

### La constitution nombra el proyecto de referencia
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN el agente pregunta si el proyecto replica los patrones de otro, que es la pregunta 21 de greenfield y la 7 de brownfield
- THEN la constitution lleva en «Convenciones» la entrada «Proyecto de referencia» con la ruta o el repositorio que el usuario dé, o «no aplica» si responde que no

### El funcional aportado se guarda literal
- GIVEN un `sdd-init-greenfield` en el que el usuario aporta un funcional (un documento, o texto pegado en el chat)
- WHEN la init crea la estructura
- THEN el funcional está en `.docs/sdd/sources/` sin editar: con su nombre original si es un fichero, o como `<yyyyMMdd>-functional-brief.md` si llegó pegado
- AND `mission.md` lo enlaza, y cada fila de módulo del roadmap que sale de él cita su sección
- AND ninguna capacidad nace de él

## Reglas de la capacidad

- **Dónde viven los datos**: el funcional aportado, en `.docs/sdd/sources/`, literal y sin editar.
- **Idioma de los nombres**: no aplica.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: no aplica.

## Historial

- 2026-09-09 — 20260909-180422-task-0000-reglas-de-capacidad — ADDED La entrevista fija las cinco reglas de producto
- 2026-09-20 — 20260920-202137-task-0001-task-ids — MODIFIED La entrevista fija las cinco reglas de producto
- 2026-09-22 — 20260922-090037-task-0012-init-interview — ADDED La entrevista hace una sola pregunta por turno · ADDED La pregunta de ramas recomienda git-flow · ADDED Lo que fijan las instrucciones del usuario no se pregunta · ADDED Git sobre un repo existente
- 2026-09-22 — 20260922-083703-task-0013-postponed-anchor — ADDED La init calca cada documento de su plantilla
- 2026-09-22 — 20260922-141616-task-0020-init-control-keys — MODIFIED La entrevista hace una sola pregunta por turno
- 2026-09-22 — 20260922-141616-task-0020-init-control-keys — ADDED La entrevista fija las claves de control
- 2026-09-23 — 20260922-211157-task-0019-init-files — ADDED La init deja la memoria automática desactivada y los temporales ignorados · ADDED El log de estimación lo genera el script del kit · ADDED La constitution nombra el proyecto de referencia
- 2026-09-23 — 20260923-105726-task-0033-capabilities-at-birth — ADDED El funcional aportado se guarda literal
