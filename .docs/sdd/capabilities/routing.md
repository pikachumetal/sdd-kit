# Capacidad — routing

## Propósito

Cómo entra una petición en lenguaje natural por el carril que le toca del kit, en un proyecto con `.docs/sdd/` y superpowers: qué skill se invoca primero. Las salidas finas las decide después el paso 2 de `sdd-start-feature`.

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

- GIVEN una petición de patch (una fila de deuda, un ticket) cuyo fallo la investigación del paso 1 no reproduce sobre la base actual
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
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, citando el predicado: solo plantillas o estilos; en las plantillas, sin bindings, directivas de control, eventos, textos ni claves de i18n; sin TypeScript ni otro código, API, datos ni capacidades
- AND no se crea `spec.md`

### Un cambio con lógica o textos no entra por el patch aunque sea pequeño

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Oculta Borrar si el pedido está facturado y pásalo a la derecha», o «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha»
- THEN el trabajo entra por `sdd-kit:sdd-start-feature`, no por `sdd-start-patch`
- AND el agente nombra la condición del predicado que falla: el `@if` en la plantilla o el texto visible
- AND si la condición cae ya dentro de un patch visual, el agente para y lo pasa a feature

### Un patch visual se verifica con una captura y se registra como `Changed`

- GIVEN un patch abierto para un ajuste solo de presentación
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-end-patch`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `superpowers:systematic-debugging`
- AND §4 lleva la ruta de una captura en navegador real por cada pantalla tocada, guardada fuera de git, y la validación del paso 0 de `sdd-end-patch` enseña esas rutas al usuario
- AND la entrada del changelog va en `Changed`, no en `Fixed`
- AND un bug determinista sigue con la causa raíz de `systematic-debugging` y cierra en `Fixed`
