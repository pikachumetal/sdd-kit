# Capacidad — roadmap

Verdad viva de cómo se marca el roadmap de un proyecto: qué escriben los cierres de task y de patch en las tablas de «Deuda técnica» y «Backlog», y cómo se cuenta lo que sigue abierto. Esta capacidad la declaró la spec de la task 0018 en sus «Decisiones que he tomado yo» (decisión 7); los estados de las filas de task viven en [`control-profiles`](control-profiles.md).

## Requisitos

### Cerrar una fila de deuda o de backlog deja un prefijo contable
- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap que una task o un patch salda entera o en parte
- WHEN se cierra con `sdd-end-task` o con `sdd-end-patch`
- THEN la celda «Ítem» empieza por `**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`

### Cada task de una release declara los ficheros que toca
- GIVEN un `sdd-start-release` que escribe la sección «Release N» del roadmap
- WHEN añade la fila de una task
- THEN la tabla sigue la cabecera de `roadmap-template.md`, `| id | Task | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» nombra los ficheros o módulos previstos
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra esa columna

**Reglas de la capacidad**
- **Dónde viven los datos**: el formato de cierre, en el bloque de ayuda de «Deuda técnica» de `roadmap-template.md` de `sdd-templates`; los cierres lo citan. La cabecera de la tabla de release, en el bloque de ayuda de la sección «Release N» de la misma plantilla.
- **Idioma de los nombres**: estados `saldada` y `parcial`, en castellano, como el resto del roadmap.
- **Regla ante conflicto**: una fila lleva un solo prefijo; un cierre posterior lo sustituye.

## Historial

- 2026-09-22 — 20260922-153902-task-0018-roadmap-closing — ADDED Cerrar una fila de deuda o de backlog deja un prefijo contable
- 2026-09-23 — 20260922-211157-task-0019-init-files — ADDED Cada task de una release declara los ficheros que toca
