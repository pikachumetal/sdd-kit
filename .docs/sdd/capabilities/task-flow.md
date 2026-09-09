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
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto); `sdd-end-task` sustituye o añade cada entrada por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

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

### La spec propone su propio nivel de review por complejidad
- GIVEN una spec en modo full recién redactada
- WHEN el agente la presenta en el gate
- THEN la primera línea de «Decisiones a validar» dice el nivel propuesto (sin review · un revisor con su lente · dos revisores) y las señales contadas que lo justifican
- AND el usuario activa o rechaza; en modo lite no se propone

### La review adversarial tensa la spec antes del gate
- GIVEN un nivel de review activado por el usuario
- WHEN el agente despacha el revisor con la spec, la constitution, la mission y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación

### El plan presenta primero las decisiones tomadas sin el usuario
- GIVEN un plan en modo full
- WHEN el agente lo presenta en el gate
- THEN el primer bloque es «Decisiones que he tomado yo — valida estas» con modelo y effort por task, ejecución, decisiones técnicas fuera de la spec, riesgos altos y coste estimado
- AND el resto del plan es para el ejecutor

### El artículo de calidad de código viaja a implementadores y revisores
- GIVEN un plan con Restricciones globales que copian el artículo de calidad de código de la constitution
- WHEN se despacha un implementador, un revisor de task o el revisor final
- THEN el encargo lleva ese bloque literal como primera sección

### El trabajo se valida con el usuario antes de cerrar
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta qué hay, cómo probarlo y el smoke que ejecutó, y espera la validación explícita del usuario (que diga qué probó y que funciona; «cierra la tarea» no lo es)
- AND si el usuario no responde, la task queda en espera con el smoke documentado; `sdd-end-task` no arranca sin esa validación y el walkthrough la registra separada de lo verificado por el agente

### La review de dominio pregunta por el complemento de visibilidad
- GIVEN una spec que introduce un rol, un estado o una condición de acceso
- WHEN la lente dominio la revisa
- THEN pide que la spec diga qué no ve y qué no puede hacer ese rol o estado, y la spec lo declara o lo rechaza con motivo

### El walkthrough registra la review de spec
- GIVEN una task cerrada
- WHEN se escribe el bloque de tiempo del walkthrough
- THEN lleva la línea «Review de spec: no | 1 revisor (lente) | 2 revisores · hallazgos N, aceptados M»

### Los tests de la spec preceden al implementador
- GIVEN una task cuya implementación se despacha a un subagente
- WHEN el hilo principal prepara el despacho
- THEN los tests que codifican los escenarios de la task existen y están commiteados antes del primer encargo, uno por THEN, en RED
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica

## Historial

- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED La spec presenta primero las decisiones tomadas sin el usuario
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED El delta declara el comportamiento por capacidad
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED Lo técnico no vive en la spec
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED El cierre fusiona el delta en la verdad viva
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED Brownfield no vuelca `funcional/`
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — MODIFIED Los documentos de anclaje nombran `funcional/`
- 2026-09-08 — 20260908-150513-task-0000-spec-ligera-funcional — ADDED La consulta lee la capacidad, no las specs
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED La spec propone su propio nivel de review por complejidad
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED La review adversarial tensa la spec antes del gate
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED El plan presenta primero las decisiones tomadas sin el usuario
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED El artículo de calidad de código viaja a implementadores y revisores
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED El trabajo se valida con el usuario antes de cerrar
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED La review de dominio pregunta por el complemento de visibilidad
- 2026-09-09 — 20260909-131802-task-0000-gates-y-reviews — ADDED El walkthrough registra la review de spec
- 2026-09-09 — 20260909-173929-task-0000-tests-red-hilo — ADDED Los tests de la spec preceden al implementador
- 2026-09-09 — 20260909-180422-task-0000-reglas-de-capacidad — MODIFIED El delta declara el comportamiento por capacidad
