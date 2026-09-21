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
- AND un `MODIFIED` copia el bloque entero del requisito con los cambios; `(antes: …)` es opcional y señala la cláusula que cambia
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto); `sdd-end-task` sustituye o añade cada entrada por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

### El cierre fusiona el delta en la verdad viva
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `capabilities/<capability>.md`, cada `MODIFIED` sustituye entero el requisito con ese título, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

### Brownfield no vuelca `capabilities/`
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera task que toque una capacidad

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

## Historial

- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED El nombre de una capacidad nueva es un sustantivo inglés en kebab-case
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED El comportamiento observable vive solo en `capabilities/`
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED El delta declara el comportamiento por capacidad (desde `task-flow`, con el `MODIFIED` de bloque entero)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED El cierre fusiona el delta en la verdad viva (desde `task-flow`, con la sustitución entera)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED Brownfield no vuelca `capabilities/` (desde `task-flow`)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED Los documentos de anclaje nombran `capabilities/` (desde `task-flow`)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — ADDED La consulta lee la capacidad, no las specs (desde `task-flow`)
