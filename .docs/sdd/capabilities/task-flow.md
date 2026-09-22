# Capacidad — task-flow

Verdad viva del comportamiento observable del carril task del kit: lo que un dev y un agente pueden esperar al arrancar, especificar y cerrar una task. Cada requisito tiene un título estable: las specs lo citan literal en `MODIFIED — <título>`. Una capacidad es un sustantivo del dominio; esta la declaró la spec de la task `spec-ligera-funcional` en sus «Decisiones a validar» (decisión 6).

## Requisitos

### La spec presenta primero las decisiones tomadas sin el usuario
- GIVEN una task en modo full o lite
- WHEN el agente presenta la spec en el gate
- THEN el primer bloque que el dev-lead lee es "Decisiones que he tomado yo — valida estas", con una línea por decisión, y el resto de la spec cabe en una pantalla

### Lo técnico no vive en la spec
- GIVEN un contenido cuya implementación puede cambiar sin cambiar el comportamiento observable (modelo de datos, endpoints, riesgos técnicos, rollout)
- WHEN se redacta la spec
- THEN ese contenido va a `plan.md`, no a `spec.md`

### La spec propone su propio nivel de review por complejidad
- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra; en modo lite no se propone

### La review adversarial tensa la spec antes del gate
- GIVEN un nivel de review activado por el usuario o, en `unattended`, decidido y registrado por el agente
- WHEN el agente despacha el revisor con la spec, la constitution, la mission y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación
- AND con dos revisores cada lente recibe puntos disjuntos y el encargo le prohíbe reportar lo que pertenece al punto de la otra
- AND con un revisor la lente única recibe todos los puntos

### La review mira los ejemplos de la spec contra la constitution
- GIVEN una spec cuyos ejemplos, valores o fixtures citan datos concretos
- WHEN la lente dominio la revisa
- THEN marca el ejemplo que contradiga la constitution del proyecto y el que identifique un cliente, proyecto o persona reales donde un ejemplo neutro serviría igual

### El plan presenta primero las decisiones tomadas sin el usuario
- GIVEN un plan en modo full
- WHEN el agente lo termina
- THEN el primer bloque es «Decisiones que he tomado yo — valida estas», con modelo y effort por task, ejecución, decisiones técnicas fuera de la spec, riesgos altos y coste estimado
- AND en `pair` lo presenta en el gate; en `delegate` y `unattended` no hay gate: el agente comprueba que cada escenario de la spec tiene su task, lo anota en el plan y sigue
- AND el resto del plan es para el ejecutor

### El artículo de calidad de código viaja a implementadores y revisores
- GIVEN un plan con Restricciones globales que copian el artículo de calidad de código de la constitution
- WHEN se despacha un implementador, un revisor de task o el revisor final
- THEN el encargo lleva ese bloque literal como primera sección

### El trabajo se valida con el usuario antes de cerrar
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, cómo probarlo y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND si el usuario no responde, la task queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección

### El walkthrough crece por adendas
- GIVEN una task cerrada con walkthrough
- WHEN algo cambia después del cierre (validación tardía, integración con otra task)
- THEN se añade una entrada fechada en `## 6. Adendas` y el cuerpo no se reescribe

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

### Un aprendizaje sin destino no se redirige en silencio
- GIVEN un cierre de task cuyo walkthrough tiene un aprendizaje estructural y un proyecto sin `architecture.md`
- WHEN `sdd-end-task` vuelca los aprendizajes a los docs vivos
- THEN crea `architecture.md` calcando `architecture-template.md` de `sdd-templates`, vuelca ahí el aprendizaje y lo dice en el informe final («`architecture.md` no existía: creado desde la plantilla»)
- AND no escribe el aprendizaje estructural en `tech-stack.md` ni en otro documento en su lugar
- AND lo mismo con cualquier otro destino que falte (`constitution.md`, `tech-stack.md`): se crea calcando su plantilla y se dice en el informe; si un destino no tiene plantilla, no se inventa: se dice y se añade una fila en la tabla de deuda técnica del roadmap

### Un documento de anclaje que falta se calca de su plantilla
- GIVEN un proyecto al que le falta un documento de anclaje con plantilla en `sdd-templates`
- WHEN una task, un cierre o una consulta lo tiene que crear
- THEN el documento sigue las secciones de su plantilla, sin secciones inventadas ni omitidas (las vacías llevan su marcador)

**Reglas de la capacidad**
- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad.
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case. El contenido de los documentos sigue en castellano.

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
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED Los documentos de anclaje nombran `capabilities/`
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED Brownfield no vuelca `capabilities/`
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED El cierre fusiona el delta en la verdad viva
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED El delta declara el comportamiento por capacidad
- 2026-09-09 — 20260909-210515-task-0000-english-file-names — MODIFIED La consulta lee la capacidad, no las specs
- 2026-09-21 — 20260920-220930-task-0011-spec-review-lenses — MODIFIED La spec propone su propio nivel de review por complejidad
- 2026-09-21 — 20260920-220930-task-0011-spec-review-lenses — MODIFIED La review adversarial tensa la spec antes del gate
- 2026-09-21 — 20260920-220930-task-0011-spec-review-lenses — ADDED La review mira los ejemplos de la spec contra la constitution
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — REMOVED El delta declara el comportamiento por capacidad (se mueve a `capabilities`)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — REMOVED El cierre fusiona el delta en la verdad viva (se mueve a `capabilities`)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — REMOVED Brownfield no vuelca `capabilities/` (se mueve a `capabilities`)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — REMOVED Los documentos de anclaje nombran `capabilities/` (se mueve a `capabilities`)
- 2026-09-21 — 20260921-081125-task-0003-cap-lifecycle — REMOVED La consulta lee la capacidad, no las specs (se mueve a `capabilities`)
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — MODIFIED La spec propone su propio nivel de review por complejidad
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — MODIFIED La review adversarial tensa la spec antes del gate
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — MODIFIED El plan presenta primero las decisiones tomadas sin el usuario
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — MODIFIED El trabajo se valida con el usuario antes de cerrar
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — ADDED El walkthrough crece por adendas
- 2026-09-22 — 20260922-083703-task-0013-postponed-anchor — ADDED Un aprendizaje sin destino no se redirige en silencio
- 2026-09-22 — 20260922-083703-task-0013-postponed-anchor — ADDED Un documento de anclaje que falta se calca de su plantilla
