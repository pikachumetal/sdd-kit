# Capacidad — roadmap

## Propósito

Cómo marcan el roadmap los cierres de task y de patch en «Deuda técnica» y «Backlog», y cómo se cuenta lo que sigue abierto. Los estados de las filas de task viven en `control-profiles`.

## Requisitos

### Cerrar una fila de deuda o de backlog deja un prefijo contable
- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap que una task o un patch salda entera o en parte
- WHEN se cierra con `sdd-end-task` o con `sdd-end-patch`
- THEN la celda «Ítem» empieza por `**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`

### Cada task de una release declara los ficheros que toca
- GIVEN un `sdd-roadmap` que escribe la sección «Release N» del roadmap
- WHEN añade la fila de una task
- THEN la tabla sigue la cabecera de `roadmap-template.md`, `| id | Task | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» nombra los ficheros o módulos previstos
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra esa columna

### Una re-medición que contradice una fila la reescribe
- GIVEN una fila de «Deuda técnica» o de «Backlog» que un patch re-mide, al abrirse o en su cierre, sin saldarla
- WHEN el resultado contradice lo que la fila afirma (su evidencia, su recuento, su propuesta)
- THEN las celdas que lo afirman se reescriben con la medición nueva, su fecha y su evidencia
- AND la fila ya no afirma el estado contradicho: añadir la re-medición y dejar el texto viejo no cuenta

## Reglas de la capacidad

- **Dónde viven los datos**: el formato de cierre, en el bloque de ayuda de «Deuda técnica» de `roadmap-template.md` de `sdd-templates`; los cierres lo citan. La cabecera de la tabla de release, en el bloque de ayuda de la sección «Release N» de la misma plantilla.
- **Idioma de los nombres**: estados `saldada` y `parcial`, en castellano, como el resto del roadmap.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: una fila lleva un solo prefijo; un cierre posterior lo sustituye.
