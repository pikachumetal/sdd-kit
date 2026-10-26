# Capacidad — roadmap

## Propósito

La forma del roadmap —las secciones, tablas y estados de la plantilla, que comprueba `sdd roadmap check`—, cómo marcan los cierres las filas de «Deuda técnica» y «Backlog», y cuándo sale una fila. Los estados de las filas de feature viven en `control-profiles`.

## Requisitos

### Cerrar una fila de deuda o de backlog deja un prefijo contable

- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap 2.x que una feature o un patch salda entera o en parte
- WHEN se cierra con `sdd-archive`
- THEN la celda «Ítem» empieza por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`
- AND la fila saldada dura hasta el corte de la release siguiente: el `grep` cuenta lo saldado desde la última release cerrada
- AND el prefijo `Task` de antes de la 2.0.0 se sigue leyendo igual que `Feature` y ya no se escribe

### Cada feature de una release declara los ficheros que toca

- GIVEN un `sdd-roadmap` que escribe la fila de una feature en Now o Next de `ROADMAP.md`, o en la sección «Release N» de un roadmap 2.x
- WHEN añade la fila
- THEN en `ROADMAP.md` su brief lleva `**Toca:**` con los ficheros o módulos previstos; en el roadmap 2.x la tabla sigue la cabecera de `roadmap-template.md`, `| id | Feature | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» los nombra
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra ese «Toca:» o esa columna

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
- AND con el tag `v1.2.0` en git, una fila saldada del 2026-09-20 que enlaza el artefacto da el fallo solo si el commit que añadió ese fichero es ascendiente del tag; fusionada tras el corte del mismo día, no da fallo. El enlace cuenta igual si es `specs/<carpeta>/…` o `changes/<carpeta>/…`

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
- AND con el tag `v1.2.0` en git, la fila del 2026-09-20 que enlaza su `patch.md` da el fallo solo si el commit que añadió ese fichero es ascendiente del tag: un patch fusionado tras el corte del mismo día da `Roadmap válido`; sin tag o sin enlace, decide la fecha. El enlace cuenta igual con las dos formas de «Una fila saldada antes de la última release está de más»

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
- AND una fila de «Próximo» que acaba en `. || ✅ |` da `roadmap.md: línea <n>: la fila tiene 4 celdas y la cabecera 3`, y una de «Deuda técnica» con un `|` sin escapar dentro de un código da `roadmap.md: línea <n>: la fila tiene 4 celdas y la cabecera 3`; un `\|` escapado no cuenta; lo mismo en las tablas de `ROADMAP.md` y de `debt.md`
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
- WHEN `sdd-archive` marca su fila (o añade la del patch a «Patches»)
- THEN tras editar el roadmap y antes del commit de cierre ejecuta `sdd roadmap check`, y un fallo en una línea que escribió el cierre lo corrige
- AND los fallos de líneas que el cierre no escribió no se tocan ni paran el cierre: el mensaje final dice cuántos son y que los arregla el paso «Roadmap en la forma de la plantilla» de la migración a v2.3.0

### El roadmap vive en `ROADMAP.md`, en la raíz del proyecto

- GIVEN un proyecto `<x>` con `<x>/ROADMAP.md` y sin `<x>/.docs/sdd/roadmap.md`
- WHEN se ejecuta `sdd roadmap check --path <x>/.docs/sdd`
- THEN valida `ROADMAP.md` con las reglas de `now-next-later-template.md` y cada línea de fallo y de aviso empieza por `ROADMAP.md:`
- AND con solo `.docs/sdd/roadmap.md` (un proyecto en la 2.x) lo valida con las reglas de `roadmap-template.md`, con `roadmap.md:`
- AND con los dos, valida `ROADMAP.md`, escribe `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee` y, sin fallos, termina con `Roadmap válido` y sale con 0
- AND si existe `<x>/.docs/sdd/steering/debt.md`, lo valida en la misma ejecución, con sus líneas empezando por `debt.md:`; un fallo de `debt.md` también sale con 1

### `ROADMAP.md` tiene Now, Next y Later, solo con tablas

- GIVEN un `ROADMAP.md` en la raíz con `## Now`, el párrafo «Criterio: primero lo que ven los usuarios» en la línea 9, `## Backlog` en la línea 12 y `## Next` en la línea 18, sin `## Later`
- WHEN se ejecuta `sdd roadmap check --path .docs/sdd`
- THEN escribe `ROADMAP.md: línea 9: prosa en «Now»; el roadmap solo lleva tablas`, `ROADMAP.md: línea 12: sección «Backlog» fuera de la plantilla` y `ROADMAP.md: falta la sección «Later»`, y sale con 1
- AND con `## Next` antes que `## Now` escribe `ROADMAP.md: línea <n>: «Now» va antes que «Next»`
- AND una línea `Perfil de control: delegate` entre `## Now` y su tabla no da fallo; otra línea de texto en ese hueco, o esa misma bajo `## Next`, da el fallo de prosa
- AND `now-next-later-template.md` calcada sin sus bloques de ayuda escribe `Roadmap válido` y sale con 0, y calcada sin tocar solo falla por la prosa de esos bloques

### El título de Now dice la release en preparación

- GIVEN un `ROADMAP.md` cuya línea 5 es `## Now — 2.4.0`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `ROADMAP.md: línea 5: «Now — 2.4.0» no es «## Now» ni «## Now — <versión> · en preparación|comprometida»` y sale con 1
- AND `## Now — 2.4.0 · próxima` y `## Now: 2.4.0` dan el mismo fallo, cada uno con su título
- AND `## Now`, `## Now — 2.4.0 · en preparación` y `## Now — 2.4.0 · comprometida` no dan fallo

### Las filas de `ROADMAP.md` tienen la cabecera, el estado, la Tarea y el tamaño de la plantilla

- GIVEN un `ROADMAP.md` con, en Now, la fila 0012 con estado `hecho` en la línea 8, la 0013 cuya «Tarea» empieza por `Aviso semanal` en la línea 9, la 0014 sin `<details>` en su «Tarea» en la línea 10 y la 0015 con «Tras» `0099` y tamaño `XL` en la línea 11; en Next, la cabecera `| Id | Tarea | Estado |` en la línea 14; y en Later, la fila `B3` en la línea 22, en un proyecto con `ids.mode: sequence`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `ROADMAP.md: línea 8: estado «hecho» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …` y sale con 1
- AND escribe `ROADMAP.md: línea 9: la «Tarea» no empieza por «**<título>**»` y `ROADMAP.md: línea 10: la fila 0014 no lleva brief («<details>»)`
- AND escribe `ROADMAP.md: línea 11: «Tras» nombra 0099, que no está en el roadmap ni en CHANGELOG.md` y `ROADMAP.md: línea 11: tamaño «XL» no admitido: S, M, L`
- AND escribe `ROADMAP.md: línea 14: la cabecera de «Next» debe ser «| Id | Externo | Tarea | Estado | Tras | Tamaño |»` y `ROADMAP.md: línea 22: el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve`
- AND una fila de Later sin brief y sin tamaño no da fallo; una de Now o Next sin tamaño da `tamaño «» no admitido: S, M, L`
- AND en `sequence`, un id `B3`, `—` o `0000` en Now, Next o Later da ese mismo fallo, y una fila de Later con el id `0020` no da fallo
- AND en `tracker` (declarado o por ausencia de `ids`), un id `B3` da `ROADMAP.md: línea <n>: el id «B3» ya no se usa: usa el del ticket o 0000`, y una fila de Later con `0000` no da fallo
- AND una fila de Later con estado `🔄` o `✅` da `ROADMAP.md: línea <n>: estado «🔄» no admitido en «Later»: ⏳, ⏸️ aparcada: …`
- AND «Tras» vacío no da fallo, ni «Tras» `0011` si el changelog nombra `0011` como palabra entera; con solo `0110` en el changelog, «Tras» `0011` da el fallo

### `debt.md` tiene una sección por estado, y «Lista» exige evidencia

- GIVEN un `.docs/sdd/steering/debt.md` con `## Por triar` en la línea 3 y el párrafo «Revisar cada lunes» en la línea 4; `## Lista` en la línea 9, con la fila «`libres --planta 2` lista salas de la planta 1» y «Evidencia» `—` en la línea 12; `## En espera` en la línea 15; y `## Descartadas`, con una fila cuya «Fecha» es `ayer` en la línea 21
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: línea 4: prosa en «Por triar»; debt.md solo lleva tablas`, `debt.md: línea 12: fila de «Lista» sin «Evidencia»`, `debt.md: línea 15: «En espera» va antes que «Lista»` y `debt.md: línea 21: «Fecha» «ayer» no es AAAA-MM-DD`, y sale con 1
- AND el orden de las secciones es «Por triar», «En espera», «Lista» y «Descartadas»
- AND una cabecera que no es la de su sección da `debt.md: línea <n>: la cabecera de «<sección>» debe ser «<cabecera>»`, con `| Ítem | Origen | Fecha |` en «Por triar», `| Ítem | Origen | Impacto | Falta | Fecha |` en «En espera», `| Ítem | Origen | Impacto | Evidencia | Destino |` en «Lista» y `| Ítem | Origen | Motivo | Fecha |` en «Descartadas»
- AND una sección que falta da `debt.md: falta la sección «<sección>»`, y una «Evidencia» vacía da el mismo fallo que `—`
- AND una fila de «Lista» con «Destino» vacío o `—` da `debt.md: línea <n>: fila de «Lista» sin «Destino»`
- AND sin `debt.md` no hay ninguna línea `debt.md:`, y `debt-template.md` calcada sin sus bloques de ayuda escribe `Roadmap válido`

### Una fila en espera caduca tras dos releases sin 2.º caso

- GIVEN un `debt.md` con dos filas en «En espera», una con «Fecha» `2026-07-01` en la línea 8 y otra con `2026-08-01` en la línea 9, una fila de «Descartadas» con `2026-07-01` en la línea 20, y un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05`, `## [1.4.0] - 2026-09-01` y `## [1.3.0] - 2026-07-20`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: aviso: línea 8: en espera desde 2026-07-01, dos releases sin 2.º caso: caduca` y `debt.md: aviso: línea 20: descartada el 2026-07-01, dos releases después: sale en el corte`, tras los fallos si los hay, y por los avisos solos sale con 0
- AND la fila del 2026-08-01 no avisa: después solo hay una release, la 1.4.0, porque la 1.4.1 es un patch y no cuenta
- AND una release es una versión `X.Y.0`; sin changelog ninguna fila avisa, y `## [Unreleased]` no cuenta
- AND sin fallos, la última línea es `Roadmap válido`; las líneas salen en este orden: fallos del roadmap, fallos de `debt.md`, avisos del roadmap y avisos de `debt.md`

### El roadmap 2.x avisa de un cierre fuera de la plantilla

- GIVEN un roadmap 2.x con una fila de «Deuda técnica» con «Destino» `Decidir dev-lead: patch` en la línea 26, y una de «Backlog» que empieza por `**[Feature 0031, 2026-09-25: saldada, salvo el GO — …]**` en la línea 20
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 20: el prefijo de cierre no casa con «**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»` y ninguna línea de la 26
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0; con fallos, los avisos van tras ellos y sale con 1
- AND el prefijo `saldada — ` que no avisa es el mismo que el corte saca: con fecha no posterior a la última release, falla con «sale en el corte»

### Con `ROADMAP.md`, lo hecho queda en Now y la deuda saldada sale de «Lista»

- GIVEN un proyecto con `ROADMAP.md` en la raíz, la fila 0081 en Now con `🔄`, y en «Lista» de `.docs/sdd/steering/debt.md` la fila «El recordatorio sale dos veces» con «Destino» `0081` y la fila «Los recordatorios no respetan la zona horaria» con «Destino» `0081`, que la 0081 salda solo en parte
- WHEN `sdd-archive` cierra la 0081 validada
- THEN la fila 0081 se queda en Now con `✅` (o `🧪 validación diferida a <disparador>`) y no se mueve de sección
- AND «El recordatorio sale dos veces» sale de «Lista»
- AND «Los recordatorios no respetan la zona horaria» se queda en «Lista» con «Ítem» reescrito a lo que falta
- AND `sdd roadmap check` pasa tras el cierre

### En el roadmap 2.x, la fila «Patch:» de Próximo se marca y se queda

- GIVEN un roadmap 2.x con la fila `| 0190 | Patch: **El gate de cierre no corre a la vez…** | ⏳ |` en «Próximo»
- WHEN `sdd-archive` cierra el patch 0190
- THEN esa fila queda con `✅` en «Próximo», y además el patch tiene su fila en «Patches»

### Un id repetido se avisa sin fallar

- GIVEN un `roadmap.md` con la fila `| 0210 | x | ⏳ |` en la línea 12 y otra fila con el id `0210` en la línea 30, en tablas cuya columna de id se llama `#`, `id` o `Id`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe, después de los fallos, `roadmap.md: aviso: línea 30: el id «0210» ya está en la línea 12`, y sin otros fallos sale con 0
- AND las tablas sin esa columna (las de «Patches», que empiezan por la fecha, y la deuda) no se miran
- AND en `ROADMAP.md` de la 3.0.0, un id repetido entre Now, Next o Later se avisa igual, con el prefijo `ROADMAP.md: `
- AND `0000` repetido no se avisa: es el comodín de «sin ticket»

### El roadmap 2.x avisa de una fila que apunta a una tarea ya cerrada

- GIVEN un roadmap 2.x con la fila `0149` ✅ en «Próximo», la fila `0047` ⏳ en la línea 12 con «**Absorbida por la propuesta 0131 → 0149**», la fila `0048` ⏳ con «**Absorbida por la propuesta 0131 → 0149 y 0150**» y la `0150` ⏳, y en «Deuda técnica» una fila de la línea 30 con «Destino» `**Actuar → 0149**, patch de la CLI` sin prefijo de cierre en su «Ítem»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 12: apunta a 0149, ya ✅: sáldala` y `roadmap.md: aviso: línea 30: apunta a 0149, ya ✅: sáldala`, y ningún aviso de la fila `0048`, porque la `0150` no está ✅
- AND una fila «Absorbida» o de deuda cuya «Ítem» ya empieza por `**[Feature <id>, <fecha>: saldada — …]**` no avisa, ni una cuyo destino está 🧪
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0

## Reglas de la capacidad

- **Dónde viven los datos**: el roadmap 3.0.0, en `ROADMAP.md` de la raíz, con la forma de `now-next-later-template.md`; la deuda, en `.docs/sdd/steering/debt.md`, con la de `debt-template.md`; el roadmap 2.x, en `.docs/sdd/roadmap.md`, con la de `roadmap-template.md`, cuyo bloque de ayuda de «Deuda técnica» guarda el formato de cierre que citan los cierres y el de «Release N», la cabecera de su tabla. Qué va en cada sección, en los bloques de ayuda de cada plantilla; lo comprueba `sdd roadmap check`.
- **Idioma de los nombres**: las secciones de `ROADMAP.md`, `Now`, `Next` y `Later`, en inglés, como las nombra la propuesta 0131; sus columnas, las secciones de `debt.md`, los estados `saldada` y `parcial`, la etiqueta `validaciones pendientes:` y los mensajes del validador, en castellano, como el resto del roadmap.
- **Límites**: cada roadmap solo lleva las secciones de su plantilla y solo tablas, salvo «Releases cerradas» en la 2.x; `debt.md`, sus cuatro secciones y solo tablas. Una fila saldada y una fila de «Patches» del roadmap 2.x duran hasta el corte de la release siguiente. Una fila de «En espera» caduca, y una de «Descartadas» sale en el corte, con dos releases (versiones `X.Y.0` del changelog) posteriores a su fecha. Later solo lleva filas `⏳` o `⏸️`. La única línea de texto de `ROADMAP.md` es `Perfil de control: <perfil>`, bajo `## Now`.
- **Avisos**: una línea por fallo del validador, con la regla incumplida. Son avisos, sin fallo: el prefijo de cierre fuera de forma (2.x), la fila de «En espera» que caduca, la descartada que sale en el corte, el roadmap que no se lee cuando están los dos y el id repetido en la columna de id de dos filas. Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.
- **Regla ante conflicto**: el fichero decide las reglas: `ROADMAP.md`, las de la 3.0.0; `.docs/sdd/roadmap.md`, las de la 2.x. Con los dos a la vez, `roadmap check` lee `ROADMAP.md` y avisa del otro; `id next` lee los dos (`feature-ids`). Una fila lleva un solo prefijo de cierre; un cierre posterior lo sustituye. Una feature que está en una release cerrada no tiene fila en una sección abierta: manda la release cerrada.
