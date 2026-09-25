# Capacidad — capabilities

Verdad viva de cómo nace, qué contiene y cómo se fusiona una capacidad en los proyectos que usan el kit. La declaró la spec de la task 0003 (decisión 2); sus cinco primeros requisitos vivían antes en `task-flow`.

## Requisitos

### El nombre de una capacidad nueva es un sustantivo inglés en kebab-case
- GIVEN una spec que declara una capacidad nueva
- WHEN se le da nombre
- THEN el slug es un sustantivo del dominio en inglés y kebab-case (`notifications`, no `avisos`), aunque el contenido del fichero vaya en castellano
- AND el nombre se presenta en el gate y lo aprueba el dev-lead

### El comportamiento observable vive solo en `capabilities/`
- GIVEN una task que escribe en `tech-stack.md`, `architecture.md` o `environments.md`, en su plan o en el cierre
- WHEN el texto es un valor de comportamiento (tiempo, límite, cuota, aviso, respuesta, estado)
- THEN el valor vive en `capabilities/<capability>.md`, y el documento de anclaje dice dónde está la pieza técnica y enlaza la capacidad, sin copiar el valor

### El delta declara el comportamiento por capacidad
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND un escenario de una regla de negocio lleva datos concretos de entrada y de salida («bolsa FR, IT, PT; oferta en DE → no cubre»), no una frase abstracta («una oferta fuera de la bolsa no cubre»)
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto), cada una con su valor completo: con **Avisos**: A y B vigentes y una task que añade C, la entrada dice A, B y C, porque `sdd-end-task` sustituye o añade cada entrada entera por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

### El cierre fusiona el delta en la verdad viva
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `capabilities/<capability>.md`, cada `MODIFIED` sustituye entero el requisito con ese título, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND la capacidad no gana ninguna línea de historial
- AND tras fusionar y antes del commit de cierre, `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <spec.md>` pasa; si falla en lo fusionado o en el bloque, se corrige eso, no el validador
- AND un fallo en una capacidad que el delta no toca (`rooms.md` con un requisito sin THEN, mientras la 0020 fusiona en `bookings`) no bloquea el cierre: `rooms.md` no se edita y el informe final lo lista como pendiente del dev-lead
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

### El cierre de un patch fusiona su delta
- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-end-patch` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` abre con `## Capacidades` y `- Modificadas: \`bookings\` — cambia «Consultar salas libres»`, y lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `bookings.md` sustituye ese requisito, sin línea de historial
- AND `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <patch.md>` pasa antes del commit de cierre, salvo en una capacidad que el delta no toca: esa no se edita y el mensaje final la lista como pendiente del dev-lead
- AND el cambio de `bookings.md` va en el commit de cierre del patch, y el fix con su `patch.md` queda en un solo commit
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna, el bloque dice `Ninguna, porque ninguna capacidad describe <pieza>` y el mensaje final lo dice

### Un patch que devuelve el comportamiento a la capacidad no lleva delta
- GIVEN `bookings.md` con la regla «Límites: una reserva dura como máximo 2 h»
- WHEN se cierra el patch 0013, cuyo fix hace que `salas reservar Norte 10-13` se rechace, como ya decía la capacidad
- THEN `bookings.md` no cambia, y `patch.md` lleva en su bloque `## Capacidades` la línea `Ninguna, porque el fix devuelve \`reservar\` a lo que ya dice \`bookings\`` y ninguna sección de delta; si la traía vacía de la plantilla, se borra

### Brownfield no vuelca `capabilities/`
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`, aunque el usuario pida generar las capacidades desde el código
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera task que toque una capacidad
- AND si el usuario lo pidió, el agente explica que en brownfield las capacidades crecen task a task

### Ninguna init crea `capabilities/` vacía
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield` sin petición de volcado
- WHEN crea la estructura de `.docs/sdd/`
- THEN no existe `capabilities/` ni `specs/` al terminar, ni ningún `.gitkeep` en `.docs/sdd/`
- AND `capabilities/` aparece con la primera task que declara una capacidad, y `specs/` con la primera task o patch

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

### La consulta lee la capacidad, no las specs
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-consult`
- WHEN existe `capabilities/<capability>.md`
- THEN la respuesta se ancla en ese fichero, no en la reconstrucción a partir de specs históricas

### La spec y el patch declaran sus capacidades al principio
- GIVEN un proyecto con `capabilities/bookings.md` y la fila 0021 «Cancelar una reserva: `salas cancelar <sala> <franja>` libera la franja»
- WHEN se escribe la spec de la 0021
- THEN la spec abre, tras el título, con `## Capacidades` y la línea `- Modificadas: \`bookings\` — añade «Cancelar una reserva»`, escrita tras listar `capabilities/` y con el nombre exacto del fichero (`bookings`, no `reservations` ni `booking`)
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
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Test-Capabilities.ps1 -Path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND con `-Artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `-Artifact`, escribe `Sin capacidades que validar` y sale con 0

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/capabilities/`, un fichero por capacidad; el listado de la carpeta es el índice.
- **Idioma de los nombres**: slug en inglés kebab-case; el contenido, en el idioma que fija la constitution del proyecto.
- **Límites**: no aplica.
- **Avisos**: `Test-Capabilities.ps1` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`.
- **Regla ante conflicto**: entre una capacidad y un documento de anclaje, manda la capacidad.
