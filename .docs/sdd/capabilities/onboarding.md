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
- GIVEN una init greenfield en su entrevista
- WHEN el agente pregunta al usuario
- THEN cada turno termina con una única pregunta de la lista de la entrevista
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

## Historial

- 2026-09-09 — 20260909-180422-task-0000-reglas-de-capacidad — ADDED La entrevista fija las cinco reglas de producto
- 2026-09-20 — 20260920-202137-task-0001-task-ids — MODIFIED La entrevista fija las cinco reglas de producto
- 2026-09-22 — 20260922-090037-task-0012-init-interview — ADDED La entrevista hace una sola pregunta por turno · ADDED La pregunta de ramas recomienda git-flow · ADDED Lo que fijan las instrucciones del usuario no se pregunta · ADDED Git sobre un repo existente
- 2026-09-22 — 20260922-083703-task-0013-postponed-anchor — ADDED La init calca cada documento de su plantilla
