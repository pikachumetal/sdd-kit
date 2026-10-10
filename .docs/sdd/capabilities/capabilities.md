# Capacidad — capabilities

## Propósito

Cómo nace, qué contiene y cómo se fusiona una capacidad en los proyectos que usan el kit, y cómo se valida y se lista (`sdd capability check`, `sdd capability index`).

## Requisitos

### El nombre de una capacidad nueva es un sustantivo inglés en kebab-case

- GIVEN una spec que declara una capacidad nueva
- WHEN se le da nombre
- THEN el slug es un sustantivo del dominio en inglés y kebab-case (`notifications`, no `avisos`), aunque el contenido del fichero vaya en castellano
- AND el nombre se presenta en el gate y lo aprueba el dev-lead

### El comportamiento observable vive solo en `capabilities/`

- GIVEN una feature que escribe en `tech-stack.md`, `architecture.md` o `environments.md`, en su plan o en el cierre
- WHEN el texto es un valor de comportamiento (tiempo, límite, cuota, aviso, respuesta, estado)
- THEN el valor vive en `capabilities/<capability>.md`, y el documento de anclaje dice dónde está la pieza técnica y enlaza la capacidad, sin copiar el valor

### El delta declara el comportamiento por capacidad

- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un THEN o un AND no cita las decisiones de la spec por número (`- THEN se rechaza, por la decisión 10`): la capacidad no tiene esas decisiones, y `sdd capability merge` lo rechaza
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una feature que añade C, la entrada dice A, B y C, porque `sdd-end-feature` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

### El cierre fusiona el delta en la verdad viva

- GIVEN una feature cerrándose vía `sdd-end-feature` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN el agente ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`, que añade cada `ADDED` a `capabilities/<capability>.md`, sustituye entero con cada `MODIFIED` el requisito con ese título, quita cada `REMOVED` y sustituye o añade por su nombre cada entrada de «Reglas de la capacidad»; el walkthrough referencia los escenarios del delta como casos del smoke
- AND si el script falla, el agente corrige lo que dice su mensaje (el delta de la spec, o la línea «Nuevas» del bloque) y lo vuelve a ejecutar; no fusiona a mano
- AND el borrador del delta fusionado que el paso 7 de `sdd-start-feature` escribe mientras trabaja el revisor final sale del mismo script
- AND la capacidad no gana ninguna línea de historial
- AND tras fusionar y antes del commit de cierre, `sdd capability check --path .docs/sdd --artifact <spec.md>` pasa; si falla en lo fusionado o en el bloque, se corrige eso, no el validador
- AND un fallo en una capacidad que el delta no toca (`rooms.md` con un requisito sin THEN, mientras la 0020 fusiona en `bookings`) no bloquea el cierre: `rooms.md` no se edita y el informe final lo lista como pendiente del dev-lead
- AND `sdd-end-feature` no crea ningún fichero de capacidad que la spec no haya declarado

### El cierre de un patch fusiona su delta

- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-end-patch` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` abre con `## Capacidades` y `- Modificadas: \`bookings\` — cambia «Consultar salas libres»`, y lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `sdd capability merge --path .docs/sdd --artifact <patch.md>` sustituye ese requisito en `bookings.md`, sin línea de historial
- AND `sdd capability check --path .docs/sdd --artifact <patch.md>` pasa antes del commit de cierre, salvo en una capacidad que el delta no toca: esa no se edita y el mensaje final la lista como pendiente del dev-lead
- AND el cambio de `bookings.md` va en el commit de cierre del patch, y el fix con su `patch.md` queda en un solo commit
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna, el bloque dice `Ninguna, porque ninguna capacidad describe <pieza>` y el mensaje final lo dice

### Un patch que devuelve el comportamiento a la capacidad no lleva delta

- GIVEN `bookings.md` con la regla «Límites: una reserva dura como máximo 2 h»
- WHEN se cierra el patch 0013, cuyo fix hace que `salas reservar Norte 10-13` se rechace, como ya decía la capacidad
- THEN `bookings.md` no cambia, y `patch.md` lleva en su bloque `## Capacidades` la línea `Ninguna, porque el fix devuelve \`reservar\` a lo que ya dice \`bookings\`` y ninguna sección de delta; si la traía vacía de la plantilla, se borra

### Brownfield no vuelca `capabilities/`

- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`, aunque el usuario pida generar las capacidades desde el código
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera feature que toque una capacidad
- AND si el usuario lo pidió, el agente explica que en brownfield las capacidades crecen feature a feature

### Ninguna init crea `capabilities/` vacía

- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield` sin petición de volcado
- WHEN crea la estructura de `.docs/sdd/`
- THEN no existe `capabilities/` ni `specs/` al terminar, ni ningún `.gitkeep` en `.docs/sdd/`
- AND `capabilities/` aparece con la primera feature que declara una capacidad, y `specs/` con la primera feature o patch

### El volcado inicial es una excepción de greenfield

- GIVEN un `sdd-init-greenfield` sobre un proyecto con código, en el que el usuario pide generar las capacidades desde el código
- WHEN el agente atiende la petición
- THEN antes de escribir ningún fichero propone la partición (slugs en inglés kebab-case, sustantivos del dominio) y espera la aprobación
- AND presenta cada capacidad para su aprobación, como los documentos de anclaje
- AND ninguna capacidad lleva sección de historial
- AND si no puede leer el código entero en la sesión, lo dice y no vuelca
- AND el agente no propone el volcado si el usuario no lo pide

### Los documentos de anclaje nombran `capabilities/`

- GIVEN cualquier skill o plantilla que cite la carpeta de capacidades
- WHEN se lee el contexto SDD
- THEN la referencia es a la carpeta `capabilities/` y a sus capacidades

### La spec y el patch declaran sus capacidades al principio

- GIVEN un proyecto con `capabilities/bookings.md` y la fila 0021 «Cancelar una reserva: `salas cancelar <sala> <franja>` libera la franja»
- WHEN se escribe la spec de la 0021
- THEN la spec abre, tras el título, con `## Capacidades` y la línea `- Modificadas: \`bookings\` — añade «Cancelar una reserva»`, escrita tras ejecutar `sdd capability index` y con el nombre exacto que da el índice (`bookings`, no `reservations` ni `booking`)
- AND cada capacidad del bloque tiene su subsección `### Capacidad: \`<nombre>\`` en el delta, y ninguna subsección del delta falta en el bloque
- AND una capacidad que no existe en `capabilities/` va como `- Nuevas: \`<nombre>\` — <qué cubre>`, y su creación aparece también en «Decisiones que he tomado yo»
- AND un cambio sin comportamiento observable lleva `Ninguna, porque <motivo>` (refactor, herramientas, docs) y no lleva delta
- AND `patch.md` abre con el mismo bloque; un patch no lleva «Nuevas»

### Una capacidad no guarda historial

- GIVEN `capabilities/bookings.md` después de fusionar el patch 0014 y la task 0020
- WHEN se abre el fichero
- THEN tiene `## Requisitos` y, si aplica, `## Reglas de la capacidad`, y ninguna sección `## Historial`
- AND quién cambió cada requisito se lee en git (`git log -p -- .docs/sdd/capabilities/bookings.md`) y en la spec o el `patch.md` que lo declara en su bloque «Capacidades»

### El validador de capacidades

- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Propósito`, `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante una línea suelta bajo un requisito —ni `- …`, ni `>`, ni sangrada, ni en blanco—, como la segunda línea de un «(antes: …)» partido, escribe `bookings.md: línea suelta en «Reservar una franja» (línea 14): «guardada»)»`
- AND ante una línea `- Se valida en:` en la capacidad escribe `bookings.md: resto de delta «Se valida en:» en la línea 15`
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND sin `## Propósito` escribe `bookings.md: falta la sección «Propósito»`; con la sección vacía, o solo con la ayuda `>` y el hueco `<…>` de la plantilla, `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; con un propósito de 412 caracteres, medidos sobre el propósito en una sola línea como lo escribe el índice, `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; y con `## Propósito` detrás de otra sección, `bookings.md: «Propósito» debe ser la primera sección`
- AND con `--artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND con `--artifact`, un `**ADDED — Cancelar una reserva**` del delta de `bookings` sin fusionar falla con `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`, y un `**MODIFIED — Reservar una franja**` cuyas líneas `- GIVEN`, `- WHEN`, `- THEN` y `- AND` no son, en orden, las de ese requisito en la capacidad, con `spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md`; el título cuenta entero aunque el encabezado, con su `(antes: «…»)`, ocupe varias líneas
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `--artifact`, escribe `Sin capacidades que validar` y sale con 0

### Cada capacidad declara su propósito

- GIVEN `capability-template.md` calcada para la capacidad `bookings` de un proyecto de reservas de salas
- WHEN se escribe `capabilities/bookings.md`
- THEN tras el título va `## Propósito` con una o dos frases, de 300 caracteres como máximo, que dicen qué cubre: «Reservar, consultar y cancelar salas por franja horaria.»
- AND `## Propósito` es la primera sección, antes de `## Requisitos`, y no queda ningún párrafo libre entre el título y ella
- AND el propósito no cuenta quién ni cuándo creó la capacidad: eso lo dicen git y el bloque «Capacidades» de cada spec o `patch.md`

### El índice de capacidades se genera al vuelo

- GIVEN `.docs/sdd/capabilities/` con `bookings.md`, cuyo propósito es «Reservar, consultar y cancelar salas por franja horaria.», y `rooms.md`, sin `## Propósito`
- WHEN se ejecuta `sdd capability index --path .docs/sdd`
- THEN escribe, en orden de nombre, `` - `bookings` — Reservar, consultar y cancelar salas por franja horaria. `` y `` - `rooms` — (sin propósito) ``, y sale con 0
- AND un propósito escrito en varias líneas sale en una sola, y las líneas de ayuda `>` no salen
- AND un propósito de más de 300 caracteres sale entero: el índice no valida
- AND sin carpeta `capabilities/`, o con la carpeta vacía, escribe `Sin capacidades` y sale con 0
- AND el índice no se guarda en ningún fichero
- AND `sdd-propose`, `sdd-roadmap` y `sdd-explore` lo ejecutan en su paso de contexto, antes de decidir qué capacidades leer o tocar, y abren solo las que eligen con él

### La fusión del delta es un script

- GIVEN `capabilities/bookings.md` con los requisitos «Consultar salas libres» y «Reservar una franja», y la regla «**Avisos**: aviso si la reserva pisa un festivo»
- AND una spec cuyo delta de `bookings` trae `**ADDED — Cancelar una reserva**` con la línea `- Se valida en: worktree con la base al día`, `**MODIFIED — Reservar una franja** (antes: «la reserva queda⏎guardada»)` con el encabezado en dos líneas, `**REMOVED — Consultar salas libres**` y la regla `**Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`
- THEN `bookings.md` tiene «Reservar una franja» con las líneas de escenario del delta, «Cancelar una reserva» al final de `## Requisitos` sin la línea «Se valida en:», y ya no tiene «Consultar salas libres»
- AND su entrada «Avisos» dice «aviso si la reserva pisa un festivo o dura más de 4 h», y las otras cuatro reglas no cambian
- AND ninguna línea del «(antes: …)» ni ninguna línea de ayuda `>` del delta llega a la capacidad
- AND el fichero queda con una línea en blanco tras cada título y entre bloques, sin líneas en blanco dobles
- AND el script escribe una línea por cambio (`bookings.md: añadido «Cancelar una reserva»`, `bookings.md: sustituido «Reservar una franja»`, `bookings.md: quitado «Consultar salas libres»`, `bookings.md: regla «Avisos» sustituida`) y sale con 0
- AND justo después, `sdd capability check --path .docs/sdd --artifact <spec.md>` escribe `Capacidades válidas: 1` y sale con 0

### La fusión del delta falla sin escribir nada

- GIVEN la spec del requisito anterior con un `**MODIFIED — Anular una reserva**` más, que no está en `bookings.md`
- WHEN se ejecuta `sdd capability merge`
- THEN escribe `spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco por el ADDED y el REMOVED que sí podía aplicar
- AND con un `- THEN se rechaza, por la decisión 10` en «Cancelar una reserva», escribe `spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar`, sale con 1 y no escribe
- AND la misma frase entre comillas invertidas (`` `por la decisión 10` ``), como ejemplo, no cuenta como cita
- AND un `ADDED` que ya está en la capacidad con las mismas líneas no se duplica ni falla; con otras líneas falla con `spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED`
- AND un `REMOVED` cuyo título ya no está escribe `bookings.md: «Consultar salas libres» ya no estaba` y no falla
- AND una capacidad del delta sin fichero se crea solo si el bloque «Capacidades» de una spec la declara con `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento`: `# Capacidad — rooms`, `## Propósito` con «Salas, su aforo y su mantenimiento», y sus requisitos; sin esa línea, o desde un `patch.md`, falla con `spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`
- AND un `MODIFIED` con menos líneas `- THEN` y `- AND` que el requisito vivo falla con `spec.md: «Reservar una franja» del MODIFIED perdería «- AND <texto>» de capabilities/bookings.md: cópiala en el delta o retírala con «- REMOVED AND <texto>»`, una línea por cada una del vivo que no copió, y no escribe; con la retirada `- REMOVED AND <texto literal>` en el bloque, la quita y no la copia a la capacidad, y una retirada que no casa con ninguna línea del vivo no cuenta

### Un documento marcado «No es una capacidad.» no se valida

- GIVEN `capabilities/funcional.md`, un documento funcional heredado o un puntero, cuya primera línea no vacía tras el título empieza por `> **No es una capacidad.**`
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN no informa errores de ese fichero, sí de las capacidades reales, y la línea de éxito lo cuenta fuera y lo nombra: `Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md`
- AND si el fichero marcado tiene líneas de escenario, falla con `funcional.md: marcado «No es una capacidad.» y con escenarios: quita la marca o los escenarios`

### Explore lee la capacidad, no las specs

- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-explore`
- WHEN existe `capabilities/`
- THEN explore ejecuta `sdd capability index`, elige por su propósito la capacidad que cubre X y ancla la respuesta en ese fichero, no en la reconstrucción a partir de specs históricas

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/capabilities/`, un fichero por capacidad; el índice lo genera `sdd capability index` al vuelo y no se guarda en ningún fichero.
- **Idioma de los nombres**: slug en inglés kebab-case; el contenido, en el idioma que fija la constitution del proyecto.
- **Límites**: el propósito de una capacidad, una o dos frases de 300 caracteres como máximo.
- **Avisos**: `sdd capability check` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`, seguida de `· omitidas por «No es una capacidad.»: <ficheros>` si omitió alguno. `sdd capability merge` escribe una línea por cambio, `<fichero>: añadido|sustituido|quitado «<requisito>»` o `<fichero>: regla «<nombre>» sustituida|añadida`, y sale con 0; con fallos, una línea por fallo, sale con 1 y no escribe ningún fichero. `sdd capability index` marca con `(sin propósito)` la capacidad que no lo tiene, y sale con 0.
- **Regla ante conflicto**: entre una capacidad y un documento de anclaje, manda la capacidad.
