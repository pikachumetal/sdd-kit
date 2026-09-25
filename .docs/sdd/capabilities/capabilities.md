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
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

### El cierre de un patch fusiona su delta
- GIVEN un proyecto con `.docs/sdd/capabilities/bookings.md`, cuyo requisito «Consultar salas libres» dice que `salas libres 10-12` lista las salas sin reserva en esa franja
- WHEN se cierra con `sdd-end-patch` el patch 0014, cuyo fix hace que `salas libres 10-12` deje fuera las salas en mantenimiento y las liste aparte con `(en mantenimiento)`
- THEN `patch.md` lleva la sección «Delta de capacidad» con `MODIFIED — Consultar salas libres` y el bloque entero del requisito con el cambio
- AND `bookings.md` sustituye ese requisito y añade a «Historial» `- <fecha de cierre> — <carpeta del patch 0014> — MODIFIED Consultar salas libres`
- AND el cambio de `bookings.md` va en el commit de cierre del patch, y el fix con su `patch.md` queda en un solo commit
- AND si ninguna capacidad describe la pieza que cambió, no se crea ninguna y el mensaje final lo dice

### Un patch que devuelve el comportamiento a la capacidad no lleva delta
- GIVEN `bookings.md` con la regla «Límites: una reserva dura como máximo 2 h»
- WHEN se cierra el patch 0013, cuyo fix hace que `salas reservar Norte 10-13` se rechace, como ya decía la capacidad
- THEN `bookings.md` no cambia y `patch.md` no lleva sección de delta ni línea de «sin delta»; si la traía vacía de la plantilla, se borra

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
- AND cada capacidad lleva en «Historial» la línea `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`
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

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/capabilities/`, un fichero por capacidad; el listado de la carpeta es el índice.
- **Idioma de los nombres**: slug en inglés kebab-case; el contenido, en el idioma que fija la constitution del proyecto.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: entre una capacidad y un documento de anclaje, manda la capacidad.
