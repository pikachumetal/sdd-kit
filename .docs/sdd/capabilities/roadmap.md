# Capacidad — roadmap

## Propósito

La forma del roadmap —las secciones, tablas y estados de la plantilla, que comprueba `sdd roadmap check`—, cómo marcan los cierres las filas de «Deuda técnica» y «Backlog», y cuándo sale una fila. Los estados de las filas de feature viven en `control-profiles`.

## Requisitos

### Cerrar una fila de deuda o de backlog deja un prefijo contable

- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap que una feature o un patch salda entera o en parte
- WHEN se cierra con `sdd-end-feature` o con `sdd-end-patch`
- THEN la celda «Ítem» empieza por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`
- AND la fila saldada dura hasta el corte de la release siguiente: el `grep` cuenta lo saldado desde la última release cerrada
- AND el prefijo `Task` de antes de la 2.0.0 se sigue leyendo igual que `Feature` y ya no se escribe

### Cada feature de una release declara los ficheros que toca

- GIVEN un `sdd-roadmap` que escribe la sección «Release N» del roadmap
- WHEN añade la fila de una feature
- THEN la tabla sigue la cabecera de `roadmap-template.md`, `| id | Feature | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» nombra los ficheros o módulos previstos
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra esa columna

### Una re-medición que contradice una fila la reescribe

- GIVEN una fila de «Deuda técnica» o de «Backlog» que un patch re-mide, al abrirse o en su cierre, sin saldarla
- WHEN el resultado contradice lo que la fila afirma (su evidencia, su recuento, su propuesta)
- THEN las celdas que lo afirman se reescriben con la medición nueva, su fecha y su evidencia
- AND la fila ya no afirma el estado contradicho: añadir la re-medición y dejar el texto viejo no cuenta

### Una fila saldada antes de la última release está de más

- GIVEN una fila de «Deuda técnica» que empieza por `**[Patch 0018, 2026-09-10: saldada — …]**`, una de «Backlog» por `**[Task 0012, 2026-09-20: saldada — …]**`, otra de «Deuda técnica» por `**[Feature 0030, 2026-09-25: saldada — …]**`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `sdd roadmap check --path .docs/sdd`
- THEN escribe `roadmap.md: línea <n>: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y la misma línea para la del 2026-09-20, y sale con 1
- AND la fila del 2026-09-25 no da fallo, ni una fila `parcial` de cualquier fecha
- AND sin ninguna subsección en «Releases cerradas», ninguna fila saldada da fallo
- AND con el tag `v1.2.0` en git, una fila saldada del 2026-09-20 que enlaza el artefacto da el fallo solo si el commit que añadió ese fichero es ascendiente del tag; fusionada tras el corte del mismo día, no da fallo. El enlace cuenta igual si es `specs/<carpeta>/…`, `changes/<carpeta>/…` o, desde `ROADMAP.md`, `.docs/sdd/changes/<carpeta>/…` o `.docs/sdd/specs/<carpeta>/…`

### El título de una release cerrada lleva versión y fecha

- GIVEN un roadmap con `### v1.2.0 - 2026-09-20` (guion corto) en la línea 37, bajo «Releases cerradas»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea 37: «v1.2.0 - 2026-09-20» no es «### v<versión> — <AAAA-MM-DD>»` y sale con 1
- AND `### v1.2.0 — 20 de septiembre` y `### Notas` dan el mismo fallo, cada uno con su título
- AND `### v1.2.0 — 2026-09-20` no da fallo

### Un patch publicado sale de «Patches» en el corte

- GIVEN una fila de «Patches» con fecha `2026-09-20`, otra con `2026-09-22`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y sale con 1
- AND la fila del 2026-09-22 no da fallo
- AND sin ninguna subsección en «Releases cerradas», ninguna fila de «Patches» da fallo
- AND con el tag `v1.2.0` en git, la fila del 2026-09-20 que enlaza su `patch.md` da el fallo solo si el commit que añadió ese fichero es ascendiente del tag: un patch fusionado tras el corte del mismo día da `Roadmap válido`; sin tag o sin enlace, decide la fecha. El enlace cuenta igual con las cuatro formas de «Una fila saldada antes de la última release está de más»

### El roadmap solo lleva las secciones de la plantilla

- GIVEN un roadmap con las secciones «Próximo», «Versión siguiente», «Backlog», «Deuda técnica», «Decisiones tomadas», «Patches» y «Releases cerradas»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: sección «Versión siguiente» fuera de la plantilla` y la misma línea para «Decisiones tomadas», y sale con 1
- AND un roadmap con «Próximo», «Release 2.3.0», «Backlog», «Deuda técnica», «Patches» y «Releases cerradas», en ese orden, escribe `Roadmap válido` y sale con 0; también sin ninguna sección de release, y con «Release 1.3» y «Release 1.4» seguidas
- AND un roadmap sin «Patches» escribe `roadmap.md: falta la sección «Patches»` y sale con 1
- AND con «Backlog» antes que «Próximo» escribe `roadmap.md: línea <n>: «Próximo» va antes que «Backlog»`, y con dos «Release 1.3» escribe `roadmap.md: línea <n>: sección «Release 1.3» repetida`
- AND `## Release próxima` o `## Release` a secas escriben `roadmap.md: línea <n>: «Release próxima» no lleva versión: «## Release <versión>»`

### El roadmap no lleva prosa fuera de las releases cerradas

- GIVEN un roadmap con el párrafo «Criterio de orden (dev-lead, 2026-09-21): primero lo que ven los usuarios» en la línea 13, bajo `## Backlog`, y una cita `> nota` en la línea 30, bajo `## Patches`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea 13: prosa en «Backlog»; fuera de «Releases cerradas» el roadmap solo lleva tablas` y la misma línea para la 30 en «Patches», y sale con 1
- AND el resumen, la línea de smoke y la línea `validaciones pendientes:` bajo `### v1.2.0 — 2026-09-20` no dan fallo
- AND una sola línea «en preparación» entre `## Release 1.3` y su tabla no da fallo; una segunda línea de texto en esa sección, sí

### Las cabeceras de tabla y los estados son los de la plantilla

- GIVEN una sección de release cuya tabla empieza por `| id | Task | Tamaño | Estado |`, una fila de «Próximo» con el estado `pendiente` y otra con `❌ descartado`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»`, y para cada una de las dos filas `roadmap.md: línea <n>: estado «<texto>» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …`, y sale con 1
- AND una fila suelta, una fila vacía o una cabecera descuadrada con su separador dan los mensajes que hoy da `tests/RoadmapStructure.Tests.ps1`, con el prefijo `roadmap.md: `
- AND los tests fijan el número de línea exacto de cada fixture

### Una feature publicada no sigue como fila de una sección abierta

- GIVEN una fila `| 0021 | … | 🧪 validación diferida al primer correo real |` en `## Release 1.3`, una fila `| 0024 | … tras 0021 … | ⏳ |` en la misma sección, y `### v1.2.0 — 2026-09-20` con el resumen «Aviso por correo al liberar una sala (0021) y el patch 0020»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: la 0021 ya está en la v1.2.0: su fila sale de «Release 1.3»` y sale con 1
- AND la fila 0024 no da fallo

### Una release cerrada guarda sus validaciones pendientes en una línea

- GIVEN un roadmap con la 0016 y la 0017 en `🧪 validación diferida`, las dos publicadas en la 1.1.0, ya cerrada
- WHEN la migración a v2.3.0 termina
- THEN la subsección `### v1.1.0 — 2026-09-05` lleva la línea `validaciones pendientes: 0016, 0017`, y el disparador y el dueño de cada una siguen en su walkthrough
- AND una release sin validaciones pendientes no lleva la línea

### Los cierres de feature y de patch avisan del roadmap fuera de forma sin bloquear

- GIVEN un roadmap con la sección heredada `## Versión siguiente`, que `sdd roadmap check` rechaza, y la feature 0030 (o el patch 0031) que se cierra
- WHEN `sdd-end-feature` marca su fila (o `sdd-end-patch` añade la suya a «Patches»)
- THEN tras editar el roadmap y antes del commit de cierre ejecuta `sdd roadmap check`, y un fallo en una línea que escribió el cierre lo corrige
- AND los fallos de líneas que el cierre no escribió no se tocan ni paran el cierre: el mensaje final dice cuántos son y que los arregla el paso «Roadmap en la forma de la plantilla» de la migración a v2.3.0

### El roadmap avisa de un destino o un cierre fuera de la plantilla

- GIVEN una fila de «Deuda técnica» con «Destino» `Decidir dev-lead: patch` en la línea 26, y una de «Backlog» que empieza por `**[Feature 0031, 2026-09-25: saldada, salvo el GO — …]**` en la línea 20
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 26: «Destino» «Decidir dev-lead: patch» no empieza por Actuar, Esperar 2.º ticket o Descartada` y, para la línea 20, `roadmap.md: aviso: línea 20: el prefijo de cierre no casa con «**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»`
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0; con fallos, los avisos van tras ellos y sale con 1
- AND un «Destino» que empieza por `Actuar`, `Esperar 2.º ticket` o `Descartada`, con o sin negrita, no avisa; «Backlog» no tiene «Destino» y solo avisa del prefijo
- AND el prefijo `saldada — ` que no avisa es el mismo que el corte saca: con fecha no posterior a la última release, falla con «sale en el corte»

### El roadmap vive en `ROADMAP.md`, en la raíz del proyecto

- GIVEN un proyecto `<x>` con `<x>/ROADMAP.md` y sin `<x>/.docs/sdd/roadmap.md`
- WHEN se ejecuta `sdd roadmap check --path <x>/.docs/sdd`
- THEN valida `ROADMAP.md` con las mismas reglas que hoy y cada línea de fallo y de aviso empieza por `ROADMAP.md:`
- AND con solo `.docs/sdd/roadmap.md` (un proyecto en la 2.x) lo valida como hoy, con `roadmap.md:`
- AND con los dos, valida `ROADMAP.md`, escribe `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee` y, sin fallos, termina con `Roadmap válido` y sale con 0

## Reglas de la capacidad

- **Dónde viven los datos**: el formato de cierre, en el bloque de ayuda de «Deuda técnica» de `roadmap-template.md` de `sdd-templates`; los cierres lo citan. La cabecera de la tabla de release, en el bloque de ayuda de la sección «Release N» de la misma plantilla. Qué va en cada sección, en los bloques de ayuda de esa plantilla; lo comprueba `sdd roadmap check`.
- **Idioma de los nombres**: estados `saldada` y `parcial`, la etiqueta `validaciones pendientes:` y los mensajes del validador, en castellano, como el resto del roadmap.
- **Límites**: el roadmap solo lleva las secciones de la plantilla y, fuera de «Releases cerradas», solo tablas. Una fila saldada y una fila de «Patches» duran hasta el corte de la release siguiente.
- **Avisos**: una línea por fallo del validador, con la regla incumplida. Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.
- **Regla ante conflicto**: una fila lleva un solo prefijo; un cierre posterior lo sustituye. Una feature que está en una release cerrada no tiene fila en una sección abierta: manda la release cerrada. Con `ROADMAP.md` y `.docs/sdd/roadmap.md` a la vez, `roadmap check` lee `ROADMAP.md` y avisa del otro; `id next` lee los dos (`feature-ids`).
