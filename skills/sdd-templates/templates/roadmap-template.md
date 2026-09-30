# Roadmap — <proyecto>

> Índice vivo del proyecto: qué viene, qué se debe y qué se cerró. Lo escribe `sdd-roadmap` (filas nuevas, orden, descartes, la sección de release) y lo leen las skills del kit: `sdd-roadmap` (Backlog y deuda técnica), `sdd-end-feature` (marca la fila de la feature), `sdd-end-patch` (tabla de Patches) y `sdd-end-release` (colapsa la sección de una release a resumen y enlaces). **Las secciones y las cabeceras de tabla van literales**: una columna renombrada rompe a la skill que la lee. Estados de fila: ⏳ pendiente · 🔄 en curso · ✅ hecho y validado · 🧪 validación diferida a <disparador> · ⏸️ aparcada: <motivo>. Con ids de secuencia (`ids.mode: sequence`), el id de una feature planificada se reserva aquí. Una fila que depende de otra lo dice en su celda «Ítem» con «tras NNNN», sin columna aparte: así lo ve quien la arranca. Una fila que sale de una propuesta lleva «`proposal: <id>`» en la misma celda. Borra los bloques de ayuda (`>`) al redactar.
>
> **La forma es cerrada.** El roadmap solo tiene estas secciones, en este orden: «Próximo», `## Release <N>` (cero o más), «Backlog», «Deuda técnica», «Patches» y «Releases cerradas». Fuera de «Releases cerradas» solo lleva tablas: ni párrafos, ni listas, ni secciones propias. Lo comprueba `Test-Roadmap.ps1` de `sdd-templates/scripts/`, que dice la regla incumplida.
>
> **Lo que no va en el roadmap**: una decisión tomada. Una regla o un descarte van al documento de anclaje de su tema (constitution, tech-stack, architecture, mission); el porqué de una feature, a su spec; lo que se decidió para una release, a su resumen en «Releases cerradas»; el comportamiento, a `capabilities/`.

## Próximo

> Lo que se va a hacer y todavía no está en una release: features con su id e hitos. Una fila ✅ sale en el corte de la release siguiente.

| # | Ítem | Estado |
| --- | --- | --- |
| <id> | <qué> | ⏳ |

> **Sección `## Release <N>`**: la añade aquí debajo `sdd-roadmap` al preparar una release, con una fila por feature y su id reservado; `sdd-end-release` la colapsa al cerrar. `<N>` es la versión que dice el usuario (`1.3`, `2.3.0`), nunca una supuesta: sin versión decidida, el trabajo sigue en «Próximo». Admite una sola línea de texto, el estado de la release («en preparación» o «comprometida»). Cabecera literal de su tabla:
>
> | id | Feature | Origen | Ficheros que toca | Estado |
> | --- | --- | --- | --- | --- |
>
> «Ficheros que toca» nombra los ficheros o módulos que la feature prevé tocar. La lee el freno de alcance de una enmienda para ver qué otras features abiertas comparten un fichero; sin la columna, el solape no se puede comprobar. Una feature que ya está en una release cerrada no tiene fila aquí ni en «Próximo».

## Backlog

> Producto que aún no se ha decidido hacer, y las decisiones pendientes, con la numeración propia del Backlog (`B1`, `B2`…), nunca con un id de la secuencia de features.

| # | Ítem | Origen |
| --- | --- | --- |
| <id> | <qué> | <quién o qué lo pidió> |

## Deuda técnica

> Solo ingeniería. Las peticiones de producto van al Backlog, nunca aquí. «Destino» dice qué se hará: una feature o un patch (**Actuar**), **Esperar 2.º ticket** o **Descartada**, con su motivo; nunca una versión ya publicada.
>
> **Formato de cierre** (esta tabla y el Backlog): cuando una feature o un patch salda una fila, la celda «Ítem» empieza por un prefijo y el texto con que se abrió la fila sigue detrás, sin reescribir. Un cierre posterior sustituye el prefijo; nunca lleva dos.
> - Saldada entera: `**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`
> - Saldada en parte: `**[<Feature|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**`
>
> `<enlace>` es un enlace Markdown, no una ruta suelta: `[walkthrough](specs/<carpeta>/walkthrough.md)` para una feature, `[patch](specs/<carpeta>/patch.md)` para un patch. Las filas saldadas se cuentan con `grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '`; las demás siguen abiertas. **Una fila saldada dura hasta el corte de la release siguiente**: ahí sale del roadmap, y su walkthrough o su `patch.md` siguen enlazados desde el changelog. El prefijo `**[Task <id>, …]**` de antes de la 2.0.0 es legado: se lee igual, pero ninguna fila nueva se salda con `Task`.

| Ítem | Impacto | Destino |
| --- | --- | --- |
| <qué falta o está mal, con la evidencia> | <alto · medio · bajo, y por qué> | <feature, patch o cuándo> |

## Patches

> Los patches cerrados desde la última release. Un patch con fecha igual o anterior a la última release cerrada sale en el corte: queda en el changelog sellado, con su `patch.md` enlazado.

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

> Las releases ya colapsadas por `sdd-end-release`, más reciente arriba: una subsección `### vX.Y.Z — <AAAA-MM-DD>` por release, con su resumen, sus enlaces y su línea de smoke. Es la única sección con prosa. Si a la release le quedan validaciones diferidas, lleva además la línea `validaciones pendientes: <ids>`; el disparador y el dueño de cada una siguen en su walkthrough o su `patch.md`. Nace vacía.
