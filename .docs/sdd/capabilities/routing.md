# Capacidad — routing

## Propósito

Cómo entra una petición en lenguaje natural por el carril que le toca del kit, en un proyecto con `.docs/sdd/` y superpowers: qué skill se invoca primero. Las salidas finas las decide después el paso 2 de `sdd-propose`.

## Requisitos

### Una petición de trabajo entra por el kit, no por brainstorming

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`
- AND `superpowers:brainstorming` se invoca después, desde el paso de la spec de `sdd-propose`, nunca antes

### Un bug pequeño y determinista entra por el carril patch

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como patch y, con la confirmación, sigue con `sdd-start-patch`
- AND `patch.md` lleva `solution: causa raíz`, la causa con su evidencia en §2, la entrada del changelog en `Fixed` y el commit del fix con el tipo `fix`

### El router solo existe donde hay SDD

- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-propose`, `sdd-explore`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-init-greenfield` y `sdd-init-brownfield`

### Una preferencia de cómo trabajar entra por `sdd-config`

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «No me gusta que me pares tanto, quiero trabajar con menos preguntas.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-config`
- AND el agente no guarda la preferencia en su memoria

### Los items asignados del gestor entran por `sdd-roadmap`

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Me han asignado en Azure el 412 (exportar reservas a .ics) y el 415 (máximo 2 reservas por persona).»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`, no `sdd-kit:sdd-propose`

### Algo grande entra por `sdd-roadmap`

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario pide varias funcionalidades a la vez: «El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Ponte con ello.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`

### Una petición vaga se pregunta antes de elegir puerta

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Hay que mejorar las reservas, que se quejan los usuarios.»
- THEN el agente no invoca `sdd-propose` ni `sdd-roadmap` antes de preguntar
- AND hace una sola pregunta sobre qué es y cuánto abarca, con su recomendación primero
- AND no crea rama ni carpeta

### Un patch cuyo fallo no se reproduce no se abre

- GIVEN una petición de patch (una fila de deuda, un ticket) cuyo fallo la investigación del paso 1 no reproduce sobre la base actual, o una petición cerrada que da por existente algo que no existe
- WHEN el agente termina la investigación
- THEN para: no crea rama ni carpeta, no escribe `patch.md` ni fix, y no reserva id
- AND si viene de una fila del roadmap, la deja re-medida según «Una re-medición que contradice una fila la reescribe» de [`roadmap`](roadmap.md), y lo dice al usuario

### En un patch manda el síntoma medido, no el predicho

- GIVEN una petición de patch cuyo ticket o fila predice un síntoma A, y una investigación del paso 1 que mide otro fallo B
- WHEN el agente fija el alcance del fix
- THEN el patch sigue con B: la sección de síntoma de `patch.md` recoge B como síntoma medido y dice en qué difiere de A, y el fix cubre B
- AND si no mide ningún fallo, no es este caso: se aplica «Un patch cuyo fallo no se reproduce no se abre»

### Una petición de planificar entra por `sdd-roadmap`

- GIVEN un proyecto con `.docs/sdd/` y el hook de sesión activo
- WHEN el usuario trae algo para el roadmap sin nombrar ninguna skill: «organízalo para el equipo», «apunta en el roadmap», items del gestor, notas de una reunión, «reordena», «prepara la release 1.3»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`
- AND con «prepara la release 1.3», no `sdd-end-release`; con «organízalo para el equipo», no `sdd-propose`

### El cierre de una feature entra por `sdd-end-feature`

- GIVEN un proyecto con `.docs/sdd/`, en la rama `feature/0081-booking-reminders` con su `plan.md` y su `tasks.md` con todas las tasks hechas
- WHEN el usuario escribe «hemos acabado, cierra la tarea»
- THEN la primera skill que se invoca es `sdd-kit:sdd-end-feature`

### Un ajuste solo de presentación entra por el carril patch

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo, con las páginas `pedido-detalle.html` y `albaran-detalle.html` y sus estilos
- WHEN el usuario escribe «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación», por el hook o con `/sdd-propose`
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch citando el predicado: solo plantillas o estilos; en las plantillas, sin añadir bindings, directivas de control, eventos, textos ni claves de i18n; sin TypeScript ni otro código, API, datos ni capacidades, salvo lo que retira una retirada
- AND no se crea `spec.md`

### Un patch visual se verifica con una captura y se registra como `Changed`

- GIVEN un patch abierto para un ajuste solo de presentación o una retirada
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-end-patch`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `superpowers:systematic-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación del paso 0 de `sdd-end-patch` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `tech-stack.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`; en una retirada, en `Removed`
- AND en una retirada, §4 lleva además la búsqueda de cada símbolo retirado, sin otros usos
- AND un bug determinista sigue con la causa raíz de `systematic-debugging` y cierra en `Fixed`

### Un cambio con la solución fijada entra por el carril patch

- GIVEN el proyecto `ventas`, con `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `app.js` e `index.html`
- WHEN el usuario escribe, por el hook o con `/sdd-propose`, «Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas.»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch, no como feature
- AND `patch.md` lleva `solution: ticket` y en §2 la frase del ticket literal, sin causa raíz ni `superpowers:systematic-debugging`
- AND el changelog lleva la entrada en `Changed` o `Added`, nunca en `Fixed`, y el commit no es de tipo `fix`
- AND si `index.html` no existe, para sin abrir rama, carpeta ni id, y lo dice

### Un cambio cuya solución tendría que fijar el agente no entra por el patch

- GIVEN el mismo proyecto
- WHEN el usuario escribe «/sdd-propose patch: es pequeño: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €» o «Métele un patch rápido: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €»
- THEN `sdd-propose` lo clasifica como feature, no como patch, aunque la petición diga patch, y lo pregunta con feature recomendada
- AND el agente nombra lo que tendría que decidir él: el texto del aviso, dónde sale y si 1.000 € entra en el umbral
- AND con «Oculta Borrar si el pedido está facturado y pásalo a la derecha» también es feature: de dónde sale «facturado» lo tendría que decidir el agente
- AND si dentro de un patch hace falta decidir algo que el usuario ve y que nadie fijó, el agente para y lo sube a feature

### El patch registra quién fijó la solución y quién decidió cada cosa

- GIVEN un patch abierto con `sdd-start-patch`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` hace que el agente pare el patch y lo suba a feature por el paso de la spec de `sdd-propose`, y se lo diga al usuario
- AND el mensaje final de `sdd-end-patch` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

### Un patch muy grande para y pregunta

- GIVEN un patch con la solución fijada por el dev-lead cuyo diff, sin tests ni docs, pasa de 10 ficheros o de 300 líneas (`git diff --numstat`)
- WHEN el agente va a hacer el commit del fix
- THEN para y pregunta al dev-lead si sigue como patch o pasa a feature, con los dos recuentos
- AND con 6 ficheros y 60 líneas no para

### Una retirada de presentación entra por el carril patch

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Quita Borrar de las dos fichas y pon Guardar y Cancelar en una columna a la derecha»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch, no como feature
- AND §3 de `patch.md` lista lo retirado (el botón Borrar de las dos fichas y lo que solo él usaba) y una línea con lo que el usuario deja de poder hacer: borrar la ficha desde ella
- AND el delta de `order-sheets` cambia «La ficha ofrece guardar, cancelar y borrar», y el changelog lleva la entrada en `Removed`
- AND con «Quita Borrar y añade Archivar en su sitio» es feature: una retirada no añade nada

### Un texto fijado literal entra por el patch

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha, en las dos fichas»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch de petición cerrada: `patch.md` lleva `solution: dev-lead` y la entrada del changelog va en `Changed`

### Una petición de explicar en llano entra por `sdd-rubber-duck`

- GIVEN un proyecto con `.docs/sdd/` y el kit instalado
- WHEN el dev-lead escribe «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la primera skill que se invoca es `sdd-kit:sdd-rubber-duck`
- AND «Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo.» y «¿Cómo funciona la exportación?» entran por `sdd-kit:sdd-explore`

### Un cambio sin comportamiento entra por el carril config

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`»
- WHEN el usuario escribe «sube `node` a 22.18 en los `engines` de `package.json`», o «corrige el typo "recervas" del README»
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como config y pregunta con `AskUserQuestion` antes de tocar nada
- AND con la confirmación hace el cambio, corre el «Build» si `operations.md` lo declara y `node --test`, y commitea en la rama en la que está con el comando y su resultado en el cuerpo del commit, sin spec, plan, carpeta, id, fila, changelog ni estimación
- AND si el gate falla, no commitea y lo dice
- AND en la rama estable del git-flow de la constitution (`main`) no commitea: en `pair` y `delegate` para y pregunta; en `unattended` lo deja sin commitear y lo cuenta en el informe final
- AND «corrige "Cancelacion" en el mensaje de `cancelar`» no es config: un texto que ve el usuario del producto, dado literal, es patch

### Full y spike anuncian y siguen; patch, lite y config preguntan

- GIVEN el molde `reservas` en `delegate`
- WHEN el usuario pide «que el responsable de sala pueda anular reservas de otros», que es feature full
- THEN `sdd-propose` anuncia el carril, el perfil y de qué nivel sale, y la frase para aprobar la spec por delegación, y sigue con la entrevista en el mismo mensaje, sin pregunta de confirmación
- AND con «si cancelo una reserva que no existe me dice "cancelada" igual», que es patch, pregunta con `AskUserQuestion` antes de abrir rama, carpeta o id, con el 🦆 de lo que hará y, si existe `estimation.md`, la estimación en horas
- AND con un cambio que cumple el predicado de lite, la pregunta ofrece lite citando sus condiciones una por una
- AND si la feature prevé más de 5 tasks, la pregunta de partir sustituye al anuncio y lleva la opción de aprobar la spec por delegación
- AND en `unattended` no pregunta: patch y config siguen, lite va en full y spike va como full

### El carril que trae la petición se respeta si concuerda

- GIVEN el molde `reservas`
- WHEN el usuario escribe «patch: si cancelo una reserva que no existe me dice "cancelada" igual» y la investigación confirma un fallo determinista
- THEN `sdd-propose` no pregunta el carril y sigue con el patch
- AND con «patch: avisa cuando una sala pase de 10 reservas en un día», que deja sin fijar el texto y el sitio del aviso, pregunta, con feature como opción recomendada y lo que tendría que decidir él
- AND con «feature: corrige el typo del README», sigue como feature, y puede ofrecer config en una pregunta, nunca bajarlo solo

### El carril solo sube

- GIVEN un cambio que va por config, patch o lite
- WHEN al hacerlo aparece algo que su predicado excluye (un cambio de comportamiento en config, una decisión sobre lo que el usuario ve en un patch, una condición de lite que cae)
- THEN para, lo dice y sube: config a patch o feature, patch a feature, lite a full
- AND nunca baja de carril a mitad de un cambio

### Una investigación con evidencia entra por el carril spike

- GIVEN el molde `reservas`
- WHEN el usuario escribe «¿aguanta `libres` con 1.000 reservas? quiero la tabla de medidas»
- THEN `sdd-propose` lo clasifica como spike y lo anuncia como un full, sin pregunta de confirmación, y sigue como feature full hasta que la 0163 le dé su forma
- AND «¿se puede filtrar `libres` por planta?», sin pedir evidencia, entra por `sdd-explore`

### Una pregunta entra por explore

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pregunta cómo funciona algo, o si algo es posible
- THEN la primera skill que se invoca es `sdd-kit:sdd-explore`

### El trabajo que sale de explore pasa por el roadmap

- GIVEN el molde `salas`, sin fila en el roadmap para filtrar por planta, en `ids.mode: sequence`
- WHEN el usuario escribe «¿Se podría filtrar `libres` por planta? Si se puede, lo quiero.»
- THEN `sdd-explore` responde si se puede y dónde tocaría, y después invoca `sdd-roadmap` con lo hablado: qué, por qué, las decisiones tomadas con su literal y el carril que ve
- AND explore no crea rama, carpeta ni fila, no reserva id ni invoca `sdd-propose`
- AND en la misma conversación, con «y si cancelo una reserva que no existe me dice "cancelada" igual: ¿por qué pasa? Si es un fallo, lo quiero arreglado», tras ver la causa también invoca `sdd-roadmap`, con carril patch

### Un config que sale de explore da su prompt directo

- GIVEN el molde `salas`, con `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «Estoy pensando en subir `node` a 22.18 en los `engines` de `package.json`. ¿Rompe algo? Si no, dame el prompt para hacerlo en otro worktree.»
- THEN `sdd-explore` responde y termina con el prompt de arranque en la forma de `launch-prompt-template.md`: el título «Subir el mínimo de Node a 22.18», sin id; `Base: develop`; la rama `feature/<slug>` sola en su bloque; `Carril: config`; y en otro bloque el prompt, que arranca con `sdd-propose` y su carril, con «Nada que saldar», `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe fila en el roadmap ni reserva id
- AND «¿Podemos subir `node` a 22.18? Si se puede, lo quiero.», sin pedir el prompt, es una petición de cambio: entra por `sdd-propose` como config (0160)
- AND termina con «si prefieres hacerlo en esta sesión, di "arráncalo"», y con «arráncalo» invoca `sdd-propose`

### Un config en una rama de feature se fusiona al terminar

- GIVEN el molde `reservas` en `delegate`, con `merge.into: develop` y `merge.push: false`, en la rama `feature/bump-node-22-18` que abrió un prompt de arranque
- WHEN el usuario escribe «Arranca este cambio con sdd-propose, carril config: sube el mínimo de node a 22.18 en los engines de package.json.»
- THEN tras el commit con su línea `Gate:`, `sdd-propose` fusiona la rama en `develop` con `sdd merge`, según las filas «Merge a develop» y «Push» de la tabla de gates (en `delegate`, con `--push` si `merge.push` es `true`)
- AND en una rama con más commits que el del config (una feature a medias), o en la de integración, no fusiona y lo dice

## Reglas de la capacidad

- **Dónde viven los datos**: no aplica.
- **Idioma de los nombres**: los carriles se llaman `config`, `patch`, `lite`, `feature` y `spike`, en inglés, igual en castellano.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: entre el carril que trae la petición y el que ve la investigación, manda el pedido si concuerda o si es más pesado; si el investigado es más pesado, se pregunta con él recomendado. El carril solo sube.
