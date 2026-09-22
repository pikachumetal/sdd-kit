# Capacidad — onboarding

Verdad viva del comportamiento observable de la inicialización de un proyecto con el kit (`sdd-init-greenfield`, `sdd-init-brownfield`): lo que un dev puede esperar de la entrevista y de los documentos de anclaje que produce. La declaró la spec de la task `reglas-de-capacidad` en sus «Decisiones a validar» (decisión 9). La actualización de un proyecto ya inicializado vive en `migracion`.

## Requisitos

### La entrevista fija las cinco reglas de producto
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada
- AND el bloque de proceso ha decidido además el modo de ids del proyecto, que se escribe en `sdd-kit.json`

### La init calca cada documento de su plantilla
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield` que crea `mission.md`, `constitution.md`, `tech-stack.md`, `architecture.md`, `roadmap.md`, `estimation.md` o `changelog.md`
- WHEN escribe cada documento
- THEN su estructura es la de la plantilla correspondiente de `sdd-templates`, y el contenido sale de la entrevista (greenfield) o del código (brownfield)
- AND ningún documento copia texto, secciones ni notas del `.docs/` del kit ni de otro proyecto
- AND las tablas que leen otras skills (patches, deuda técnica, backlog del roadmap; `## [Unreleased]` del changelog) tienen las columnas y cabeceras literales de la plantilla

## Historial

- 2026-09-09 — 20260909-180422-task-0000-reglas-de-capacidad — ADDED La entrevista fija las cinco reglas de producto
- 2026-09-20 — 20260920-202137-task-0001-task-ids — MODIFIED La entrevista fija las cinco reglas de producto
- 2026-09-22 — 20260922-083703-task-0013-postponed-anchor — ADDED La init calca cada documento de su plantilla
