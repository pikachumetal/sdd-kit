# Roadmap — <proyecto>

> Índice vivo del proyecto: qué viene, qué se debe y qué se cerró. Lo escribe `sdd-roadmap` (filas nuevas, orden, descartes, la sección de release) y lo leen las skills del kit: `sdd-roadmap` (Backlog y deuda técnica), `sdd-end-task` (marca la fila de la task), `sdd-end-patch` (tabla de Patches) y `sdd-end-release` (colapsa la sección de una release a resumen y enlaces). **Las secciones y las cabeceras de tabla van literales**: una columna renombrada rompe a la skill que la lee. Estados de fila: ⏳ pendiente · 🔄 en curso · ✅ hecho y validado · 🧪 validación diferida a <disparador> · ⏸️ aparcada: <motivo>. Con ids de secuencia (`ids.mode: sequence`), el id de una task planificada se reserva aquí. Una fila que depende de otra lo dice en su celda «Ítem» con «tras NNNN», sin columna aparte: así lo ve quien la arranca. Una fila que sale de una propuesta lleva «`proposal: <id>`» en la misma celda. Borra los bloques de ayuda (`>`) al redactar.

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| <id> | <qué> | ⏳ |

> **Sección `## Release <N>`**: la añade aquí debajo `sdd-roadmap` al preparar una release, con una fila por task y su id reservado; `sdd-end-release` la colapsa al cerrar. Cabecera literal de su tabla:
>
> | id | Task | Origen | Ficheros que toca | Estado |
> | --- | --- | --- | --- | --- |
>
> «Ficheros que toca» nombra los ficheros o módulos que la task prevé tocar. La lee el freno de alcance de una enmienda para ver qué otras tasks abiertas comparten un fichero; sin la columna, el solape no se puede comprobar.

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| <id> | <qué> | <quién o qué lo pidió> |

## Deuda técnica

> Solo ingeniería. Las peticiones de producto van al Backlog, nunca aquí.
>
> **Formato de cierre** (esta tabla y el Backlog): cuando una task o un patch salda una fila, la celda «Ítem» empieza por un prefijo y el texto con que se abrió la fila sigue detrás, sin reescribir. Un cierre posterior sustituye el prefijo; nunca lleva dos.
> - Saldada entera: `**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`
> - Saldada en parte: `**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**`
>
> `<enlace>` es un enlace Markdown, no una ruta suelta: `[walkthrough](specs/<carpeta>/walkthrough.md)` para una task, `[patch](specs/<carpeta>/patch.md)` para un patch. Las filas saldadas se cuentan con `grep -E '\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '`; las demás siguen abiertas.

| Ítem | Impacto | Destino |
| --- | --- | --- |
| <qué falta o está mal, con la evidencia> | <alto · medio · bajo, y por qué> | <task, patch o cuándo> |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

> Las releases ya colapsadas por `sdd-end-release`, más reciente arriba: una subsección `### vX.Y.Z — <fecha>` por release, con su resumen y enlaces. Nace vacía.
