---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: patch
id: 20261011-200012-patch-0172-brainstorming-pieces
task: 0172
mode:
date: 2026-10-11
---

# Ticket para el kit — patch 0172: tres piezas de `brainstorming` que la 0168 quitó sin motivo

## Contexto

- Carril y modo: patch de petición cerrada (la solución la fijó el dev-lead, pieza a pieza, en un grilling), perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-start-patch`, `sdd-end-patch`, `sdd-roadmap` (publicar la idea B18), `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet (7 sujetos headless)
- Coste en reloj: 0,4 h desde que se abrió, más ~25 min de grilling antes; estimado 0,75 h
- Coste en tokens: no medido por separado (la sesión es la de la feature 0165); sujetos ~2,50 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El texto recuperado no se cumplía hasta escribirlo donde el agente decide

- **Qué pasó**: con la frase de la fuente añadida a la regla del boceto («A flow… is shown too»), 0 de 3 sujetos dibujaron el flujo: lo pusieron en una lista. Con «A decision about a flow… shows it before asking», 2 de 2. Con el éxito medible solo en `spec-writing.md`, 0 de 1 lo escribió en Intent: el sujeto leyó la referencia, pero rellenó Intent con la ayuda de la plantilla. Con la ayuda de Intent de `spec-template.md` ampliada, 2 de 2.
- **Dónde en el kit**: `skills/sdd-grilling/SKILL.md` («Shape of a question», el boceto); `skills/sdd-templates/templates/spec-template.md` (ayuda de Intent); `skills/sdd-propose/references/spec-writing.md`.
- **Por qué el kit no lo evitó**: `architecture.md` ya dice que una regla que solo vive en una referencia no se lee y que un traspaso va al principio del paso. No dice que lo que debe acabar en un artefacto vaya en la ayuda de la sección de su plantilla, que es lo que el agente tiene delante al escribir, ni que una regla diga *cuándo* se dispara.
- **Coste**: dos rondas de REFACTOR y 5 sujetos más (~1,90 $), ~15 min (`patch.md` §4; `green-r0/out/`).
- **Propuesta**: una línea en `architecture.md`, «Anatomía de una skill»: «Lo que tiene que acabar en una sección de un artefacto va en la ayuda de esa sección de su plantilla; la referencia explica el porqué».
- **Verificada**: sí — `ag-a` (0/1, solo en la referencia) frente a `ag-1` y `ag-2` (2/2, con la ayuda de la plantilla); `fl-a`, `fl-b` y `fl-c` (0/3) frente a `fl-1` y `fl-2` (2/2).
- **Criterio de aceptación**: GIVEN una regla nueva sobre el contenido de una sección de la spec escrita solo en `spec-writing.md`, WHEN un sujeto escribe la spec con «empieza ya», THEN la sección no la recoge; con la línea en la ayuda de la plantilla, la recoge.

### 2. La 0168 estrechó una decisión del dev-lead y quitó tres piezas «sin fallo que la pida», y ninguna revisión lo vio

- **Qué pasó**: en la 0168, el dev-lead respondió «creo que artifacts cubre, 1» para sustituir el visual companion entero, pero la regla escrita solo cubría pantallas: los flujos y los diagramas se perdieron. El anexo también descartaba los anti-goals y «Show, don't tell» de flujos «sin fallo que la pida», y «think wide privately» con un motivo que no se sostenía (enseñar opciones no es filtrarlas). La revisión de la spec y la final de la 0168 no lo marcaron. Salió al revisar la 0168 contra la ADR 0013.
- **Dónde en el kit**: `skills/sdd-start-feature/references/review-spec.md` (puntos del revisor) y el encargo del revisor final; el anexo de la spec de un fork.
- **Por qué el kit no lo evitó**: ningún punto del revisor compara una decisión del dev-lead («Decisiones tomadas con el dev-lead») con el alcance de la regla que la implementa. Y hasta la ADR 0013, «sin fallo que la pida» era un motivo válido para no copiar.
- **Coste**: el patch entero (~1 h con el grilling) y la alarma del dev-lead («me está preocupando porque es justo lo que te pedí»).
- **Propuesta**: (a) en el encargo del revisor de la spec y del final, un punto: «cada decisión del dev-lead tiene una regla que la cubre entera; una regla más estrecha que la decisión es Important»; (b) la ADR 0013 ya cubre los descartes sin motivo; la 0152 revisa el resto de la tabla de la 0168.
- **Verificada**: sí — contrastado con la decisión 7 y «Decisiones tomadas con el dev-lead» de la spec de la 0168, y con el texto de `sdd-grilling` en `develop` antes del patch.
- **Criterio de aceptación**: GIVEN una spec cuyo dev-lead decide «X cubre A, B y C» y cuyo diff solo implementa A, WHEN pasa la revisión final, THEN un hallazgo Important nombra B y C.

## Lo que hice por iniciativa propia

- **Un grilling pieza a pieza, con la frase literal de la fuente delante**, antes de abrir el patch: el dev-lead vio que una pieza era más de la entrevista que de la spec (los anti-goals), y de ahí salió la idea B19 (`sdd-grilling` con un núcleo común y un auxiliar por contexto).
- **Buscar en la web cómo lo resuelven otros** (spec-kit, Shape Up, los design docs de Google) en mitad del grilling cambió la solución: los anti-goals se registran como éxito medible en Intent, como hace spec-kit, y no como lista suelta.

## Funcionó, no tocar

- El carril patch de petición cerrada con soluciones elegidas entre opciones escritas: sin spec ni plan, y con el grilling como forma de fijar la solución.
- El respaldo en texto del boceto en `claude -p`: los sujetos dibujaron Mermaid cuando no había Artifact ni skill de diagramas.

## Menores

- `fl-2` dibujó el diagrama sin decir por qué iba en texto — `skills/sdd-grilling/SKILL.md`, regla del boceto.
- Una tanda de sujetos se lanzó con `&` desde un comando normal y hubo que vigilarla con un bucle en segundo plano — `tech-stack.md`, sujetos headless (ya pide lanzarlos en segundo plano con el harness).
