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
- GIVEN un plan cuyas Restricciones globales tienen un bloque «De código», con el artículo de calidad de la constitution, y un bloque «De proceso», o una task en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task, un re-revisor o el revisor final
- THEN el encargo lleva el bloque «De código» literal como primera sección
- AND el bloque «De proceso» (política de modelos, modo de ejecución, atribución de commits) no aparece en el encargo de ningún revisor
- AND en modo lite el bloque es el artículo de calidad de código de la constitution, copiado literal; la política de modelos la aplica quien despacha

### El trabajo se valida con el usuario antes de cerrar
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, cómo probarlo y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
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
- THEN los tests que codifican los escenarios de la task existen antes del primer encargo, escritos por el hilo, uno por THEN, en RED, sin commitear
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica; los commitea con su implementación con `git add` de rutas explícitas y nunca con `--no-verify`
- AND el hilo guarda una copia fuera del repo antes del despacho y, al volver el implementador, la compara con el test commiteado; un cambio que no sea de formato va al revisor de la task

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

### El implementador no esquiva lo que le frena
- GIVEN un implementador despachado con el encargo del kit
- WHEN un gate o un checker le avisa, un test que no es suyo falla, o necesita ver el código sin su cambio
- THEN no edita la configuración del gate ni disfraza el código para que el aviso desaparezca: para y lo reporta con el mensaje literal
- AND antes de relanzar un test rojo captura su nombre y su mensaje, y no le atribuye causa sin evidencia
- AND no usa `git stash`: aparta trabajo con un commit WIP o lee la versión de la base con `git show`

### Cada task del plan viaja sola
- GIVEN un plan cuyas tasks usan firmas, formatos o valores que fija otra task o una sección del plan
- WHEN se extrae una task para su encargo
- THEN el texto de la task lleva `Interfaces: Consume / Produce` con los nombres y firmas exactos, y los valores que necesita copiados, sin remitir a otras secciones

### Un umbral superado en una unidad es Minor
- GIVEN un diff correcto con una función de 21 líneas y un bloque «De código» que fija funciones de 20 líneas como máximo
- WHEN un revisor de task o el revisor final lo revisa
- THEN reporta la función como Minor y, si no hay otro hallazgo, aprueba
- AND una función de 22 líneas o más sigue siendo Important

### El formato que exige el linter no rompe el contrato de los tests RED
- GIVEN un implementador que solo añadió en un test RED la línea en blanco que exigía el linter, sin tocar aserciones, nombres ni datos, y lo declara en su informe
- WHEN el revisor de task revisa el diff
- THEN no lo reporta como Critical ni como Important

### El revisor final revisa el paquete sin ejecutar la suite
- GIVEN el despacho del revisor final con el paquete de review de la rama
- WHEN revisa
- THEN lee el paquete y no ejecuta la suite, el build ni el lint del proyecto
- AND si cree que hace falta una verificación pesada, la recomienda en su informe

### La spec se repasa antes del gate
- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND lo que cambió aparece en «Decisiones que he tomado yo»

### Cada task del plan verifica solo sus superficies
- GIVEN una spec aprobada cuyo cambio toca BD, backend y frontend, y un proyecto con una suite de BD distinta de la de frontend
- WHEN se escribe el plan
- THEN cada task declara sus superficies (BD · backend · frontend · tooling · docs) y una verificación con los comandos de esas superficies y ninguno más
- AND la suite de BD solo aparece en las tasks cuyas superficies incluyen BD (migraciones, persistencia o dialecto)

### El gate de cierre se ejecuta una vez
- GIVEN una constitution que pide el gate completo en verde al cerrar cada task
- WHEN se escribe el plan y se despacha una task de solo frontend
- THEN el gate completo aparece una sola vez, en la validación final, y lo ejecuta el hilo principal
- AND no aparece en «De código» ni en la verificación de esa task, y el encargo de su implementador le dice que ejecute su verificación y no la suite completa

### Una task que cambia la UI se mira en un navegador
- GIVEN una task con superficie frontend que cambia lo que se ve
- WHEN se escribe el plan y, después, cuando esa task termina su revisión
- THEN la task lleva una verificación visual con la pantalla o ruta, los estados y los temas que se miran y qué se mira en ellos (alineación, separación a bordes, contraste)
- AND no se da por terminada en `tasks.md` hasta que el hilo principal la ha visto en un navegador real; sin navegador disponible queda como «no probado», nunca sustituida por la suite

### Una verificación de más de 10 minutos la lanza el hilo principal en segundo plano
- GIVEN una task cuya verificación incluye un comando que tarda más de 10 minutos
- WHEN se escribe el plan y se despacha la task
- THEN la task declara ese comando y su duración como verificación lenta, el encargo del implementador le dice que no lo ejecute, y el hilo principal lo lanza en segundo plano mientras corre la revisión
- AND la task siguiente solo se despacha durante esa ejecución si no comparte ficheros con ella y su encargo prohíbe los comandos que compiten por los mismos binarios; si la verificación lenta falla, abre la ronda de fix de su task

### El effort declarado viaja en el tipo de agente
- GIVEN un plan cuya task declara en `Modelo` «Sonnet, effort medium» con el kit instalado como plugin de Claude Code
- WHEN el hilo despacha su implementador
- THEN la llamada a `Agent` lleva `subagent_type: sdd-kit:effort-medium` y `model: sonnet`
- AND cada petición a la API del subagente lleva `effort: medium`

### Sin effort en el harness, el plan lo dice
- GIVEN un harness que no expone el effort al despachar (kit instalado sin sus agentes, u otro harness)
- WHEN se escribe el campo `Modelo` de una task
- THEN dice «effort: no disponible en este harness, hereda el de la sesión» en vez de un nivel de effort

### El revisor de spec se despacha con su effort
- GIVEN una spec con review de uno o dos revisores
- WHEN el hilo despacha cada revisor
- THEN el despacho lleva `subagent_type: sdd-kit:effort-medium` y `model: sonnet`

**Reglas de la capacidad**
- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad.
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case. El contenido de los documentos sigue en castellano.

### En Windows, el workspace de ejecución se usa en su ruta Windows
- GIVEN Windows y la ruta que imprimen `sdd-workspace`, `task-brief` o `task-start` de superpowers en forma POSIX (empieza por `/`, por ejemplo `/tmp/claude/…` o `/d/code/…`)
- WHEN el agente va a escribir o leer por primera vez en ese workspace (el ledger, un brief, un informe)
- THEN usa la ruta que da `cygpath -w`, y el `Write` no pide un permiso que un sujeto sin usuario no puede conceder

### Cada cambio de paso lleva un aviso en llano
- GIVEN una task en curso con `sdd-start-task`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

### Una decisión del dev-lead que sale de la revisión final se pregunta sola
- GIVEN la revisión final de rama con un hallazgo cuya resolución es del dev-lead
- WHEN el agente llega al paso 7
- THEN pregunta esa decisión sola, en su propio turno, y presenta la validación después de la respuesta
- AND no la resuelve por defecto ni la mete en el mensaje de la validación

### Una task Native se registra en el ledger de `executing-plans`
- GIVEN un plan con `Ejecución: native`
- WHEN el hilo ejecuta cada task
- THEN la abre con `task-start` y la cierra con `task-done` y el comando de su «Verificación», y el ledger del workspace tiene su línea `Task <N>: complete`

### La base se comprueba antes de cada task Native
- GIVEN un plan con `Ejecución: native` y dos o más tasks
- WHEN el hilo va a empezar cada task
- THEN antes compara la fila de la task y los ficheros de la task con la base, como antes de despachar un implementador

### Los RED de una task Native se apartan y se comparan
- GIVEN una task de un plan con `Ejecución: native`
- WHEN el hilo la empieza
- THEN escribe los tests de sus THEN antes del código y guarda una copia fuera del repo
- AND antes del commit de la task compara la copia con el test con `git diff --no-index`, y un cambio que no sea de formato es un ruling del ledger

### El revisor final de Native va con el techo del kit
- GIVEN un plan con `Ejecución: native` con todas sus tasks completas en el ledger
- WHEN el hilo despacha el revisor final de rama
- THEN el despacho lleva `subagent_type: sdd-kit:effort-high` y `model: opus`
- AND el encargo lleva la cabecera de `encargo-revision.md` y su sección «Cómo revisar»

### Sin el tipo de effort, se dice antes del primer despacho
- GIVEN una sesión cuyos tipos de agente no incluyen el `sdd-kit:effort-<nivel>` que toca
- WHEN el hilo va a hacer el primer despacho de la task (implementador en SDD, revisor final en Native)
- THEN antes de despachar dice que el tipo falta, despacha con el `model` y la frase de respaldo «effort: no disponible en este harness, hereda el de la sesión», y lo registra como ruling

### El cierre no repite la revisión final de Native
- GIVEN una task Native cuya línea `Revisión final:` de `tasks.md` registra la revisión final de rama
- WHEN se ejecuta el paso 9 de `sdd-end-task`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué modelo
- AND solo sin esa línea (ni, sin `tasks.md`, el informe del revisor de esta sesión) lanza `requesting-code-review`

### Los minors diferidos llegan al walkthrough
- GIVEN una task Native con líneas `Final: minor (deferred)` en el ledger
- WHEN se escribe el walkthrough
- THEN «Decisiones tomadas sin el dev-lead» lleva los «Rulings I made» y los «Deferred minors» del mensaje final de `executing-plans`

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
- 2026-09-22 — 20260922-084550-task-0005-dispatch-brief — MODIFIED El artículo de calidad de código viaja a implementadores y revisores
- 2026-09-22 — 20260922-084550-task-0005-dispatch-brief — ADDED El implementador no esquiva lo que le frena
- 2026-09-22 — 20260922-084550-task-0005-dispatch-brief — ADDED Cada task del plan viaja sola
- 2026-09-23 — 20260922-211605-task-0021-proportional-review — MODIFIED El artículo de calidad de código viaja a implementadores y revisores
- 2026-09-23 — 20260922-211605-task-0021-proportional-review — ADDED Un umbral superado en una unidad es Minor
- 2026-09-23 — 20260922-211605-task-0021-proportional-review — ADDED El formato que exige el linter no rompe el contrato de los tests RED
- 2026-09-23 — 20260922-211605-task-0021-proportional-review — ADDED El revisor final revisa el paquete sin ejecutar la suite
- 2026-09-23 — 20260922-211605-task-0021-proportional-review — ADDED La spec se repasa antes del gate
- 2026-09-23 — 20260923-102746-task-0006-task-verification — ADDED Cada task del plan verifica solo sus superficies
- 2026-09-23 — 20260923-102746-task-0006-task-verification — ADDED El gate de cierre se ejecuta una vez
- 2026-09-23 — 20260923-102746-task-0006-task-verification — ADDED Una task que cambia la UI se mira en un navegador
- 2026-09-23 — 20260923-102746-task-0006-task-verification — ADDED Una verificación de más de 10 minutos la lanza el hilo principal en segundo plano
- 2026-09-23 — 20260923-191212-task-0044-commit-per-milestone — MODIFIED Los tests de la spec preceden al implementador
- 2026-09-24 — 20260923-213417-task-0031-dispatch-effort — ADDED El effort declarado viaja en el tipo de agente
- 2026-09-24 — 20260923-213417-task-0031-dispatch-effort — ADDED Sin effort en el harness, el plan lo dice
- 2026-09-24 — 20260923-213417-task-0031-dispatch-effort — ADDED El revisor de spec se despacha con su effort
- 2026-09-24 — 20260923-220402-task-0026-superpowers-641 — ADDED En Windows, el workspace de ejecución se usa en su ruta Windows
- 2026-09-24 — 20260923-214917-task-0053-fewer-stops — ADDED Cada cambio de paso lleva un aviso en llano · Una decisión del dev-lead que sale de la revisión final se pregunta sola · MODIFIED El trabajo se valida con el usuario antes de cerrar («sí» sin detalle)
- 2026-09-24 — 20260924-105352-task-0057-native-adapt — ADDED Una task Native se registra en el ledger de `executing-plans` · La base se comprueba antes de cada task Native · Los RED de una task Native se apartan y se comparan · El revisor final de Native va con el techo del kit · Sin el tipo de effort, se dice antes del primer despacho · El cierre no repite la revisión final de Native (enmienda: `tasks.md`) · Los minors diferidos llegan al walkthrough · MODIFIED En Windows, el workspace de ejecución se usa en su ruta Windows
