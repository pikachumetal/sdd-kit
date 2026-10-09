# Capacidad — routing

## Propósito

Cómo entra una petición en lenguaje natural por el carril que le toca del kit, en un proyecto con `.docs/sdd/` y superpowers: qué skill se invoca primero. Las salidas finas las decide después el paso 2 de `sdd-propose`.

## Requisitos

### Una petición de trabajo entra por el kit, no por brainstorming

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-feature`
- AND `superpowers:brainstorming` se invoca después, desde el paso 4 de `sdd-start-feature`, nunca antes

### Un bug pequeño y determinista entra por el carril patch

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-patch`
- AND `patch.md` lleva `solution: causa raíz`, la causa con su evidencia en §2, la entrada del changelog en `Fixed` y el commit del fix con el tipo `fix`

### Una pregunta entra por consult

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pregunta cómo funciona algo, o si algo es posible
- THEN la primera skill que se invoca es `sdd-kit:sdd-consult`

### Una edición trivial no lleva ceremonia

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una edición sin comportamiento (un typo, un renombrado, un formato)
- THEN no se invoca ninguna skill del kit ni `superpowers:brainstorming`, y el cambio se hace directo

### El router solo existe donde hay SDD

- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-start-feature`, `sdd-start-patch`, `sdd-consult`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-init-greenfield` y `sdd-init-brownfield`

### Una preferencia de cómo trabajar entra por `sdd-config`

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «No me gusta que me pares tanto, quiero trabajar con menos preguntas.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-config`
- AND el agente no guarda la preferencia en su memoria

### Los items asignados del gestor entran por `sdd-roadmap`

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Me han asignado en Azure el 412 (exportar reservas a .ics) y el 415 (máximo 2 reservas por persona).»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`, no `sdd-kit:sdd-start-feature`

### Algo grande entra por `sdd-roadmap`

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario pide varias funcionalidades a la vez: «El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Ponte con ello.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`

### Una petición vaga se pregunta antes de elegir puerta

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Hay que mejorar las reservas, que se quejan los usuarios.»
- THEN el agente no invoca `sdd-start-feature`, `sdd-start-patch` ni `sdd-roadmap` antes de preguntar
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
- AND con «prepara la release 1.3», no `sdd-end-release`; con «organízalo para el equipo», no `sdd-start-feature`

### El cierre de una feature entra por `sdd-end-feature`

- GIVEN un proyecto con `.docs/sdd/`, en la rama `feature/0081-booking-reminders` con su `plan.md` y su `tasks.md` con todas las tasks hechas
- WHEN el usuario escribe «hemos acabado, cierra la tarea»
- THEN la primera skill que se invoca es `sdd-kit:sdd-end-feature`

### Un ajuste solo de presentación entra por el carril patch

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo, con las páginas `pedido-detalle.html` y `albaran-detalle.html` y sus estilos
- WHEN el usuario escribe «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación», por el hook o con `/sdd-start-feature`
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, citando el predicado: solo plantillas o estilos; en las plantillas, sin añadir bindings, directivas de control, eventos, textos ni claves de i18n; sin TypeScript ni otro código, API, datos ni capacidades, salvo lo que retira una retirada
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
- WHEN el usuario escribe, por el hook o con `/sdd-start-patch`, «Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas.»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, no `sdd-start-feature`
- AND `patch.md` lleva `solution: ticket` y en §2 la frase del ticket literal, sin causa raíz ni `superpowers:systematic-debugging`
- AND el changelog lleva la entrada en `Changed` o `Added`, nunca en `Fixed`, y el commit no es de tipo `fix`
- AND si `index.html` no existe, para sin abrir rama, carpeta ni id, y lo dice

### Un cambio cuya solución tendría que fijar el agente no entra por el patch

- GIVEN el mismo proyecto
- WHEN el usuario escribe «/sdd-start-patch Es pequeño: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €» o «Métele un patch rápido: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €»
- THEN el trabajo entra por `sdd-kit:sdd-start-feature`, no por `sdd-start-patch`, aunque la petición diga patch
- AND el agente nombra lo que tendría que decidir él: el texto del aviso, dónde sale y si 1.000 € entra en el umbral
- AND con «Oculta Borrar si el pedido está facturado y pásalo a la derecha» también es feature: de dónde sale «facturado» lo tendría que decidir el agente
- AND si dentro de un patch hace falta decidir algo que el usuario ve y que nadie fijó, el agente para y lo pasa a feature

### El patch registra quién fijó la solución y quién decidió cada cosa

- GIVEN un patch abierto con `sdd-start-patch`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` para el patch y lo pasa a `sdd-start-feature`, dicho al usuario
- AND el mensaje final de `sdd-end-patch` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

### Un patch muy grande para y pregunta

- GIVEN un patch con la solución fijada por el dev-lead cuyo diff, sin tests ni docs, pasa de 10 ficheros o de 300 líneas (`git diff --numstat`)
- WHEN el agente va a hacer el commit del fix
- THEN para y pregunta al dev-lead si sigue como patch o pasa a feature, con los dos recuentos
- AND con 6 ficheros y 60 líneas no para

### Una retirada de presentación entra por el carril patch

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Quita Borrar de las dos fichas y pon Guardar y Cancelar en una columna a la derecha»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, no `sdd-start-feature`
- AND §3 de `patch.md` lista lo retirado (el botón Borrar de las dos fichas y lo que solo él usaba) y una línea con lo que el usuario deja de poder hacer: borrar la ficha desde ella
- AND el delta de `order-sheets` cambia «La ficha ofrece guardar, cancelar y borrar», y el changelog lleva la entrada en `Removed`
- AND con «Quita Borrar y añade Archivar en su sitio» es feature: una retirada no añade nada

### Un texto fijado literal entra por el patch

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha, en las dos fichas»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, como petición cerrada: `patch.md` lleva `solution: dev-lead` y la entrada del changelog va en `Changed`

### Una petición de explicar en llano entra por `sdd-rubber-duck`

- GIVEN un proyecto con `.docs/sdd/` y el kit instalado
- WHEN el dev-lead escribe «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la primera skill que se invoca es `sdd-kit:sdd-rubber-duck`
- AND «Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo.» sigue entrando por `sdd-kit:sdd-consult`
