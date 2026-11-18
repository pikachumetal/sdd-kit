# Capacidad — spec-review

## Propósito

La review adversarial de la spec antes del gate: cuántos revisores, con qué modelo y effort, qué mira cada lente y cómo queda registrada.

## Requisitos

### La spec propone su propio nivel de review por complejidad

- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN la review lleva dos revisores, dominio y técnica, y el agente no pregunta si se hace: el bloque de la review abre el ✋ con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND si el Scope cambia menos de ~50 líneas (texto y código) y el delta no toca un contrato público ni lleva un `MODIFIED`, el nivel baja a un revisor con los siete puntos, nunca a ninguno: con dos líneas en `docs/guia.md` y un `ADDED`, un revisor; con dos líneas en `db/002-site.sql` y `src/api.js` que cambian un contrato público, dos
- AND si el nivel es dos revisores, la spec va aprobada por delegación (la opción o la frase «apruebo la spec por delegación») y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo
- AND si el nivel es dos revisores, la spec no va delegada y las instrucciones del usuario piden confirmar antes de paralelizar, el agente pregunta una sola vez, antes de despacharlos, con los dos revisores, el modelo de cada uno y su coste
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra, nunca con menos revisores de los que da la rúbrica; en modo lite, un revisor con los siete puntos en Sonnet
- AND un spike no lleva review, y un cambio de config, tampoco, porque no tiene spec
- AND si la petición o el prompt de arranque piden «sin review» u otro nivel, el agente lo aplica y escribe la frase literal en «Decisiones tomadas con el dev-lead»

### La review adversarial tensa la spec antes del gate

- GIVEN un nivel de review decidido por la rúbrica
- WHEN el agente despacha el revisor con la spec, la constitution, `PRODUCT.md` y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación
- AND con dos revisores cada lente recibe puntos disjuntos y el encargo le prohíbe reportar lo que pertenece al punto de la otra
- AND con un revisor la lente única recibe todos los puntos
- AND si se aceptó un Crítico o se reescribió la decisión central —la que fija el enfoque elegido, en el mensaje de los enfoques o en el ✋, o, sin enfoques, la que el Intent pone como condición de éxito—, un revisor nuevo con los siete puntos, en Sonnet, relee la spec corregida una sola vez, en full y en lite, y sus hallazgos se incorporan igual; después, el gate
- AND sin un Crítico aceptado ni la decisión central reescrita, no hay segunda ronda; y un Crítico de la segunda ronda va al gate aceptado o rechazado con motivo, sin tercera ronda

### La review mira los ejemplos de la spec contra la constitution

- GIVEN una spec cuyos ejemplos, valores o fixtures citan datos concretos
- WHEN la lente dominio la revisa
- THEN marca el ejemplo que contradiga la constitution del proyecto y el que identifique un cliente, proyecto o persona reales donde un ejemplo neutro serviría igual

### La review de dominio pregunta por el complemento de visibilidad

- GIVEN una spec que introduce un rol, un estado o una condición de acceso
- WHEN la lente dominio la revisa
- THEN pide que la spec diga qué no ve y qué no puede hacer ese rol o estado, y la spec lo declara o lo rechaza con motivo

### El walkthrough registra la review de spec

- GIVEN una feature cerrada
- WHEN se escribe el bloque de tiempo del walkthrough
- THEN lleva la línea «Review de spec: no | 1 revisor (lente) | 2 revisores · hallazgos N, aceptados M»

### El revisor de spec se despacha con su effort

- GIVEN una spec de permisos por rol del gestor de cobros, con review de uno o dos revisores
- WHEN el agente despacha la review
- THEN el revisor de dominio va en Opus porque la spec toca roles; para «renombrar una columna del listado», en Sonnet; sin preguntarlo
- AND con un solo revisor de siete puntos en full, su modelo se elige igual, porque incluye la lente de dominio; en lite y en el revisor del patch, Sonnet, aunque la spec o el patch toquen roles
- AND si la petición o el prompt de arranque dicen «revisor de dominio en Opus», lo aplica
- AND cada despacho lleva `subagent_type: sdd-kit:effort-medium` y el modelo elegido; el revisor técnico, siempre `model: sonnet`

### Dos revisores de spec se despachan con `sdd-parallel-agents`

- GIVEN la spec de permisos por rol del gestor de cobros, con dos revisores por la rúbrica y `control.maxParallelAgents: 3`
- WHEN el agente despacha la review
- THEN invoca `sdd-parallel-agents` y despacha los dos revisores en la misma respuesta, cada uno con su lente
- AND cada despacho lleva `model` y `subagent_type: sdd-kit:effort-medium`, como dice «El revisor de spec se despacha con su effort»
- AND nunca hay a la vez más agentes que `control.maxParallelAgents` (3 si falta); con más, se despachan por tandas
- AND dos tasks independientes del plan no se despachan con `sdd-parallel-agents`: las ejecuta `sdd-implement` una detrás de otra

### El revisor de la spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera

- GIVEN una spec con «artifacts cubre el visual companion entero» en «Decisiones tomadas con el dev-lead», y un delta cuyo único requisito sobre el companion habla de pantallas
- WHEN la revisa el revisor de la spec (la lente de dominio, o el revisor único)
- THEN devuelve, como Importante o Crítico, «Delta · la decisión del dev-lead sobre el visual companion queda cubierta solo para pantallas · ampliar el requisito a flujos y diagramas»

### El revisor de la spec señala una prueba que pasa sin la conducta

- GIVEN una spec que edita `skills/aviso-cierre/SKILL.md` para que el aviso nombre la fila 0011, y prueba su THEN con la fila de rúbrica `` `text: /pendiente/` ``
- WHEN la revisa el revisor de la spec
- THEN devuelve un hallazgo que dice que la fila pasa con un aviso que dice «pendiente» sin nombrar la 0011
