# Capacidad — capability-merge

## Propósito

La fusión del delta en `capabilities/` con `sdd capability merge`: qué lee, qué escribe y cuándo falla sin escribir nada.

## Requisitos

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
- AND una capacidad del delta sin fichero se crea solo si el bloque «Capacidades» de una spec la declara con `- Nuevas: \`rooms\` — Salas, su aforo y su mantenimiento`: `# Capacidad — rooms`, `## Propósito` con «Salas, su aforo y su mantenimiento», y sus requisitos; sin esa línea, salvo una capacidad en `- Retiradas:` cuyo delta solo trae `REMOVED`, o desde un `patch.md`, falla con `spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»`
- AND un `MODIFIED` con menos líneas `- THEN` y `- AND` que el requisito vivo falla con `spec.md: «Reservar una franja» del MODIFIED perdería «- AND <texto>» de capabilities/bookings.md: cópiala en el delta o retírala con «- REMOVED AND <texto>»`, una línea por cada una del vivo que no copió, y no escribe; con la retirada `- REMOVED AND <texto literal>` en el bloque, la quita y no la copia a la capacidad, y una retirada que no casa con ninguna línea del vivo no cuenta
- AND un literal de `spec-template.md` en una línea de un `MODIFIED` que ya está, literal, en el requisito vivo no cuenta como hueco; en una línea nueva o cambiada, o en un `ADDED`, falla con `spec.md: «<título estable>» es un hueco de la plantilla: rellénalo o borra lo que no aplique` y no escribe
- AND una línea que no empieza por `- `, `>` ni un espacio, en un `ADDED` o un `MODIFIED`, falla con `spec.md: línea suelta en «Cancelar una reserva»: «<la línea>»`, y un escenario sin `- GIVEN`, `- WHEN` o `- THEN` falla con `spec.md: «Cancelar una reserva» no tiene escenario completo (falta - WHEN)`, las dos con la comprobación de `sdd capability check`, y no escribe

### El cierre busca el literal viejo de un `MODIFIED` en toda la capacidad

- GIVEN `split.md` con el requisito «El umbral de partir» que dice «más de 6 tasks» y la sección «Límites» de sus «Reglas de la capacidad» que repite «más de 6 tasks», y un patch cuyo `MODIFIED — El umbral de partir` (antes: «más de 6 tasks») pasa a «más de 4 tasks»
- WHEN `sdd-archive` cierra el patch, antes de `sdd capability merge`
- THEN busca «más de 6 tasks» en todo `split.md`, y por la aparición de «Límites» añade al delta de `patch.md` la entrada **Límites** de «Reglas de la capacidad» con su valor completo y «más de 4 tasks», sin editar `split.md` a mano
- AND `sdd capability merge` sustituye esa entrada, `patch.md` nombra la corrección y, tras la fusión, `split.md` no dice «más de 6 tasks» en ningún sitio

### La fusión lee las dos formas de marca del delta

- GIVEN `capabilities/bookings.md` con el requisito «Reservar una franja», y dos specs con el mismo bloque de escenario: una con `#### MODIFIED — Reservar una franja (antes: «la reserva queda guardada»)` y otra con `**MODIFIED — Reservar una franja**`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>` con cada una, sobre dos copias de `.docs/sdd`
- THEN las dos escriben `bookings.md: sustituido «Reservar una franja»`, salen con 0 y dejan `bookings.md` con el mismo contenido
- AND con `#### ADDED — Cancelar una reserva` y `#### REMOVED — Consultar salas libres` escribe `bookings.md: añadido «Cancelar una reserva»` y `bookings.md: quitado «Consultar salas libres»`, y con `#### Reglas de la capacidad — bookings` seguido de `- **Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h`, `bookings.md: regla «Avisos» sustituida`
- AND un `#### ADDED — Cancelar una reserva` seguido directamente de `- GIVEN`, sin línea en blanco, se fusiona igual; un `#### ADDED — Cancelar una reserva ##` cerrado añade «Cancelar una reserva»; y un `#### MODIFIED — Reservar una franja (antes: «la reserva queda` con `guardada»)` en la línea siguiente sustituye «Reservar una franja» sin que ninguna línea del «(antes: …)» llegue a la capacidad
- AND un delta calcado de `spec-template.md` o de `patch-template.md`, con los huecos rellenos, no tiene ninguna línea que empiece por `**ADDED`, `**MODIFIED`, `**REMOVED` ni `**Reglas de la capacidad`, cada `#### …` va seguido de una línea en blanco, y se fusiona con código 0
- AND un `#### ADDED - Cancelar una reserva`, con guion en vez de raya, falla con `spec.md: no leo el título de «#### ADDED - Cancelar una reserva»: escríbelo como «#### ADDED — <título>», con raya`, y un `**ADDED - Cancelar una reserva**` con `spec.md: no leo el título de «**ADDED - Cancelar una reserva**»: escríbelo como «#### ADDED — <título>», con raya`; los dos salen con 1 y no escriben

### La fusión deja una línea en blanco alrededor de cada tabla

- GIVEN `capabilities/bookings.md` y una spec con `#### ADDED — Consultar las tarifas` cuyo escenario dice `- THEN responde:`, la tabla `| Sala | Tarifa |`, `| --- | --- |`, `| Norte | 20 € |`, sangrada con dos espacios y pegada a esa línea, sin línea en blanco, y justo debajo `- AND sin sala responde las de todas`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`
- THEN en `bookings.md` hay una línea en blanco justo antes de la fila `| Sala | Tarifa |` y otra justo después de `| Norte | 20 € |`, ninguna dentro de la tabla y ninguna doble
- AND con el mismo escenario y la tabla ya rodeada de líneas en blanco en el delta, `bookings.md` queda igual
- AND `sdd capability check --path .docs/sdd --artifact <spec.md>` escribe `Capacidades válidas: 1` y sale con 0

### Un `REMOVED` que vacía una capacidad exige declararla en «Retiradas»

- GIVEN `bookings.md` con un solo requisito, «Reservar una franja», y una spec con `#### REMOVED — Reservar una franja` en `bookings`, sin `- Retiradas:`
- WHEN se ejecuta `sdd capability merge --path .docs/sdd --artifact <spec.md>`
- THEN escribe `spec.md: «bookings» se quedaría sin requisitos: declárala en una línea «- Retiradas:» del bloque «Capacidades» para borrar el fichero, o deja algún requisito`, sale con 1 y no cambia ningún fichero de `capabilities/`, tampoco los de otras capacidades del delta
- AND con `- Retiradas: \`bookings\` — las reservas pasan a otro sistema` en el bloque, borra `bookings.md`, escribe `bookings.md: quitado «Reservar una franja»` y `bookings.md: borrado, está en «Retiradas»`, y sale con 0
- AND justo después, `sdd capability check --path .docs/sdd --artifact <spec.md>` no falla por `bookings`
- AND con esa línea y `bookings.md` con otro requisito que el delta no quita, escribe `spec.md: «bookings» está en «Retiradas» y le quedan requisitos: «Cancelar una reserva»`, sale con 1 y no escribe
- AND ejecutada otra vez con `bookings.md` ya borrado, escribe `bookings.md: ya estaba borrado` y sale con 0
- AND un `REMOVED` cuyo título ya no está, en una capacidad que ya no tenía requisitos, no la vacía esta fusión: escribe `ya no estaba` y no para
- AND la línea `- Retiradas:` lleva el nombre y el motivo, vale en una spec y en un `patch.md`, y su capacidad lleva su subsección en el delta como las demás; sin motivo, escribe `spec.md: «bookings» está en «Retiradas» sin motivo: escríbelo tras el nombre, con raya`, sale con 1 y no escribe
