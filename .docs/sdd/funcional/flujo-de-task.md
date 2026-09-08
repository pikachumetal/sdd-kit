# Capacidad — flujo-de-task

Verdad viva del comportamiento observable del carril task del kit: lo que un dev y un agente pueden esperar al arrancar, especificar y cerrar una task. Cada requisito tiene un título estable: las specs lo citan literal en `MODIFIED (antes: …)`. Una capacidad es un sustantivo del dominio; esta la declaró la spec de la task `spec-ligera-funcional` en sus «Decisiones a validar» (decisión 6).

## Requisitos

### La spec presenta primero las decisiones tomadas sin el usuario
- GIVEN una task en modo full o lite
- WHEN el agente presenta la spec en el gate
- THEN el primer bloque que el dev-lead lee es "Decisiones que he tomado yo — valida estas", con una línea por decisión, y el resto de la spec cabe en una pantalla

### El delta declara el comportamiento por capacidad
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED (antes: …)` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND si la capacidad no existe en `funcional/`, su creación aparece en "Decisiones a validar"

### Lo técnico no vive en la spec
- GIVEN un contenido cuya implementación puede cambiar sin cambiar el comportamiento observable (modelo de datos, endpoints, riesgos técnicos, rollout)
- WHEN se redacta la spec
- THEN ese contenido va a `plan.md`, no a `spec.md`

### El cierre fusiona el delta en la verdad viva
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `funcional/<capacidad>.md`, cada `MODIFIED` sustituye el requisito anterior, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

### Brownfield no vuelca `funcional/`
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`
- WHEN se generan los documentos de anclaje
- THEN `funcional/` no se crea ni se rellena: aparece con la primera task que toque una capacidad

### Los documentos de anclaje nombran `funcional/`
- GIVEN cualquier skill o plantilla que hoy cite `funcional.md`
- WHEN se lee el contexto SDD
- THEN la referencia es a la carpeta `funcional/` y a sus capacidades

### La consulta lee la capacidad, no las specs
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-consult`
- WHEN existe `funcional/<capacidad>.md`
- THEN la respuesta se ancla en ese fichero, no en la reconstrucción a partir de specs históricas

## Historial

- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED La spec presenta primero las decisiones tomadas sin el usuario
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED El delta declara el comportamiento por capacidad
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED Lo técnico no vive en la spec
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED El cierre fusiona el delta en la verdad viva
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED Brownfield no vuelca `funcional/`
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — MODIFIED Los documentos de anclaje nombran `funcional/`
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED La consulta lee la capacidad, no las specs
