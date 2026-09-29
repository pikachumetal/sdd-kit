# Capacidad — feature-flow

## Propósito

El carril feature del kit: lo que un dev y un agente pueden esperar al arrancar, especificar y cerrar una feature.

## Requisitos

### La spec presenta primero las decisiones tomadas sin el usuario
- GIVEN una feature en modo full o lite
- WHEN el agente presenta la spec en el gate
- THEN el primer bloque que el dev-lead lee es "Decisiones que he tomado yo — valida estas", con una línea por decisión, y el resto de la spec cabe en una pantalla

### Lo técnico no vive en la spec
- GIVEN un contenido cuya implementación puede cambiar sin cambiar el comportamiento observable (modelo de datos, endpoints, riesgos técnicos, rollout)
- WHEN se redacta la spec
- THEN ese contenido va a `plan.md`, no a `spec.md`

### La spec propone su propio nivel de review por complejidad
- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND si el Scope cambia menos de ~50 líneas (texto y código), el nivel baja de dos revisores a uno con los siete puntos, nunca a ninguno: con contrato público + datos y dos líneas en `db/002-site.sql` y `src/api.js`, un revisor
- AND si el nivel sería dos revisores, la spec va aprobada por delegación (la opción «apruebo la spec por delegación» de la primera pregunta) y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo; con un nivel de «ninguna» no despacha ninguno
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
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
- GIVEN un plan cuyas Restricciones globales tienen un bloque «De código», con el artículo de calidad de la constitution, y un bloque «De proceso», o una feature en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task, un re-revisor o el revisor final
- THEN el encargo lleva el bloque «De código» literal como primera sección
- AND el bloque «De proceso» (política de modelos, modo de ejecución, atribución de commits) no aparece en el encargo de ningún revisor
- AND en modo lite el bloque es el artículo de calidad de código de la constitution, copiado literal; la política de modelos la aplica quien despacha

### El trabajo se valida con el usuario antes de cerrar
- GIVEN una feature con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-feature` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección

### El walkthrough crece por adendas
- GIVEN una feature cerrada con walkthrough
- WHEN algo cambia después del cierre (validación tardía, integración con otra feature)
- THEN se añade una entrada fechada en `## 6. Adendas` y el cuerpo no se reescribe

### La review de dominio pregunta por el complemento de visibilidad
- GIVEN una spec que introduce un rol, un estado o una condición de acceso
- WHEN la lente dominio la revisa
- THEN pide que la spec diga qué no ve y qué no puede hacer ese rol o estado, y la spec lo declara o lo rechaza con motivo

### El walkthrough registra la review de spec
- GIVEN una feature cerrada
- WHEN se escribe el bloque de tiempo del walkthrough
- THEN lleva la línea «Review de spec: no | 1 revisor (lente) | 2 revisores · hallazgos N, aceptados M»

### Los tests de la spec preceden al implementador
- GIVEN una task cuya implementación se despacha a un subagente
- WHEN el hilo principal prepara el despacho
- THEN los tests que codifican los escenarios de la task existen antes del primer encargo, escritos por el hilo, uno por THEN, en RED, sin commitear
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica; los commitea con su implementación con `git add` de rutas explícitas y nunca con `--no-verify`
- AND el hilo guarda una copia fuera del repo antes del despacho y, al volver el implementador, la compara con el test commiteado; un cambio que no sea de formato va al revisor de la task

### Un aprendizaje sin destino no se redirige en silencio
- GIVEN un cierre de feature cuyo walkthrough tiene un aprendizaje estructural y un proyecto sin `architecture.md`
- WHEN `sdd-end-feature` vuelca los aprendizajes a los docs vivos
- THEN crea `architecture.md` calcando `architecture-template.md` de `sdd-templates`, vuelca ahí el aprendizaje y lo dice en el informe final («`architecture.md` no existía: creado desde la plantilla»)
- AND no escribe el aprendizaje estructural en `tech-stack.md` ni en otro documento en su lugar
- AND lo mismo con cualquier otro destino que falte (`constitution.md`, `tech-stack.md`): se crea calcando su plantilla y se dice en el informe; si un destino no tiene plantilla, no se inventa: se dice y se añade una fila en la tabla de deuda técnica del roadmap

### Un documento de anclaje que falta se calca de su plantilla
- GIVEN un proyecto al que le falta un documento de anclaje con plantilla en `sdd-templates`
- WHEN una feature, un cierre o una consulta lo tiene que crear
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
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
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
- THEN la task lleva una verificación visual con la pantalla o ruta, los estados, los temas, el criterio en frases medibles y la pantalla de referencia (la de `§Frontend` si la task no nombra otra), escritos en el plan antes de tocar el código
- AND el hilo principal la abre en un navegador real con Playwright —el MCP si está en la sesión, un script del paquete `playwright` si no—, sobre el entorno que el usuario tenga levantado si lo hay, sin build dedicado ni suite de specs nueva
- AND pasa el detector que declara `§Frontend` de `tech-stack.md` en sus dos viewports, y saca una captura por estado y tema, que mira con la rúbrica de composición (jerarquía, ritmo de espaciado, densidad, alineación) contra la referencia, con 3 rondas de arreglo de composición como máximo, y guarda fuera de git sin borrarla hasta la validación, antes de darla por terminada en `tasks.md`
- AND con la tarjeta de resumen de la Task 2 con borde y 0 px de padding, y un criterio que no nombra el padding, el detector da `cramped-padding` y la task no se da por terminada hasta que el hallazgo se arregla o se justifica por escrito; «ya estaba antes» no justifica un hallazgo del elemento que la task toca, y «falso positivo» o «es intencional» no valen sin citar la frase del criterio o el rasgo de la referencia que lo exige
- AND mide en estilos computados solo lo que el criterio fija con un valor numérico
- AND si la task cambia comportamiento, recorre el flujo real con sus estados de carga, error y deshabilitado, con la consola y la red sin errores, con el usuario de pruebas de `§Frontend`, nunca contra producción y sin borrar ni modificar datos que no creó la verificación
- AND si el detector declarado no ejecuta, o no hay navegador con el que ejecutar Playwright, o no hay forma de levantar la aplicación, lo dice con el error concreto y la task queda «no probado» en lo visual, nunca «verificado» ni sustituida por la suite; «el MCP de Playwright no está en la sesión» y «faltan dependencias» no son ninguno de los tres

### La verificación visual se enseña con medidas y capturas
- GIVEN la feature 0012 con el selector de estado, cuya «Verificación visual» declara `/` y `/?theme=dark`, el criterio «el selector filtra la lista por estado» y contraste del texto ≥ 4,5:1
- WHEN el agente para tras la task en `pair`, o presenta la validación del paso 7 en `delegate`
- THEN antes del guion de pruebas enseña el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado («390x844 · `cramped-padding` en `select` · arreglado: padding-right 12 px») y la ruta de cada captura
- AND cada medida en estilos computados, solo porque el criterio fija un valor, con su valor y el esperado («texto del selector, oscuro · contraste · 7,9:1 · ≥ 4,5:1»)
- AND sin detector declarado, el aviso literal «composición no medida: `tech-stack.md` no declara detector en §Frontend»
- AND si la composición sigue mal tras la tercera ronda, lo dice ahí, para que decida el dev-lead
- AND una task que quedó «no probado» lo dice en ese sitio, con su motivo

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

### En Windows, el workspace de ejecución se usa en su ruta Windows
- GIVEN Windows y la ruta que imprimen `sdd-workspace`, `task-brief` o `task-start` de superpowers en forma POSIX (empieza por `/`, por ejemplo `/tmp/claude/…` o `/d/code/…`)
- WHEN el agente va a escribir o leer por primera vez en ese workspace (el ledger, un brief, un informe)
- THEN usa la ruta que da `cygpath -w`, y el `Write` no pide un permiso que un sujeto sin usuario no puede conceder

### Cada cambio de paso lleva un aviso en llano
- GIVEN una feature en curso con `sdd-start-feature`
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
- WHEN el hilo va a hacer el primer despacho de la feature (implementador en SDD, revisor final en Native)
- THEN antes de despachar dice que el tipo falta, despacha con el `model` y la frase de respaldo «effort: no disponible en este harness, hereda el de la sesión», y lo registra como ruling

### El cierre no repite la revisión final de Native
- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión final de rama `sobre a1b2c3d`, y después de ese commit solo hay commits de los que se revisan en el hilo
- WHEN se entra en `sdd-end-feature`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué modelo
- AND si después de `a1b2c3d` hay un commit del hilo `e4f5a6b` que cambia `src/slots.js`, antes de escribir el walkthrough despacha la re-revisión del tramo `a1b2c3d..HEAD` con el encargo del revisor final (`sdd-kit:effort-high` + `opus`) y apunta `Re-revisión: a1b2c3d..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND el commit con el que compara `HEAD` es el último revisado: el segundo sha de la `Re-revisión:` más reciente; si no hay, el de `Pasada de fix:`; si no hay, el `sobre` de `Revisión final:`
- AND solo sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe del revisor de esta sesión) lanza `requesting-code-review`

### Los minors diferidos llegan al walkthrough
- GIVEN una feature Native con líneas `Final: minor (deferred)` en el ledger
- WHEN se escribe el walkthrough
- THEN «Decisiones tomadas sin el dev-lead» lleva los «Rulings I made» y los «Deferred minors» del mensaje final de `executing-plans`

### Cada task de producto acaba en algo que se prueba en la aplicación
- GIVEN un plan para las salas favoritas, que tocan la migración `favorite_rooms`, la API y la estrella de la pantalla de salas
- WHEN se parte en tasks
- THEN la task «Marcar Sur como favorita» atraviesa migración, API y estrella, y su línea «Se prueba en la aplicación» dice «Ana pulsa la estrella de Sur y la ve llena tras recargar». No sale una task «BD y API» seguida de otra «web».
- AND una task que no deja nada probable (una migración de datos previa, un refactor) lleva en esa línea «no, porque <motivo>»
- AND el plan no fija un tamaño en horas por task

### En `pair`, cada task cerrada para con su guion de pruebas
- GIVEN perfil `pair` y la Task 1 de 2 de la feature 0012 («Validar al reservar») con su revisión limpia y su commit
- WHEN el hilo cierra la Task 1
- THEN para antes de la Task 2 y presenta el guion de la Task 1, con la forma del guion de la validación: por ejemplo, «1. `salas reservar Norte 1012` → «Franja no válida: usa HH-HH, p. ej. 10-12»; 2. `salas reservar Norte 10-12` → `{"room":"Norte","slot":"10-12"}`»
- AND en `delegate` y `unattended` sigue con la Task 2 sin parar ni presentar guion

### El gate del plan en `pair` ofrece parar para bajar la sesión a gama media
- GIVEN una feature en `pair`, una sesión con Opus 5.5 y un plan con `Ejecución: native, porque…`
- WHEN el agente presenta el gate del plan
- THEN entre las opciones está «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con su motivo: Native va bien en gama media (Sonnet, effort medium) y bajar solo el effort de Opus no es gama media
- AND si el usuario la elige, el agente junta la apertura en su commit y termina el turno antes de la Task 1 diciendo el cambio (`/model`, Sonnet con effort medium)

### El gate de la spec en `delegate` ofrece parar tras el plan para bajar la sesión a gama media
- GIVEN una feature en `delegate`, una sesión con Opus 5.5 y la spec lista para el gate
- WHEN el agente presenta la spec
- THEN entre las opciones está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy

### Con Native, el plan registra el modelo recomendado para la sesión
- GIVEN un plan cuyo método es Native
- WHEN el agente escribe su línea `Ejecución`
- THEN la línea lleva, literal, «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.»

### La carpeta de una feature nueva lleva `-feature-`
- GIVEN un proyecto en modo `sequence` con la fila 0081 «Avisos de reserva» pendiente en el roadmap
- WHEN `sdd-start-feature` crea la carpeta de la spec el 2026-10-01 a las 09:15:00 UTC
- THEN la carpeta es `.docs/sdd/specs/20261001-091500-feature-0081-booking-reminders/`
- AND el frontmatter de `spec.md` lleva `id: 20261001-091500-feature-0081-booking-reminders` y `feature: 0081`

### Una carpeta `-task-` se cierra como legado
- GIVEN la rama `feature/0064-task-to-feature-rename` con su carpeta `20260925-163055-task-0064-task-to-feature-rename/`, cuyo `spec.md` lleva `task: 0064`
- WHEN `sdd-end-feature` cierra la feature
- THEN escribe `walkthrough.md` en esa misma carpeta, sin renombrarla
- AND el estimation-log regenerado tiene una fila con id `0064` y carpeta `20260925-163055-task-0064-task-to-feature-rename`

### Las tasks del plan conservan su nombre
- GIVEN una feature en modo full con su plan escrito
- WHEN el dev abre `plan.md` y el registro vivo
- THEN las unidades del plan se llaman «Task 1», «Task 2»… y el registro es `tasks.md`, con cabecera `| # | Task | Status | Commit | Notas |`
- AND la palabra «feature» nombra solo la unidad del kit: la spec, la rama y la carpeta

### El agente para lo que arrancó por su PID o su puerto
- GIVEN la feature 0012 con su web levantada por el agente con `PORT=4656 node server.mjs` para la verificación visual o para el smoke, y otros procesos `node` en la máquina (el MCP de Playwright, el servidor del dev-lead)
- WHEN el agente termina de usarla
- THEN la para por el PID que guardó al arrancarla o por el proceso que escucha en el puerto 4656
- AND ninguna tool call la para por el nombre del ejecutable (`taskkill /IM node.exe`, `pkill node`, `killall node`, `Stop-Process -Name node`) ni por un patrón de su línea de comandos (`pkill -f server.mjs`, filtrar `CommandLine`)
- AND antes de arrancar comprueba que el puerto 4656 está libre (si no, no es suyo: usa otro), y tras parar, que quedó libre; si sigue escuchando, para el que escucha, porque el PID guardado era el de un lanzador

### El guion de pruebas empieza con el entorno parado, salvo que la persona lo quiera arrancado
- GIVEN la validación del paso 7 de la feature 0012, con la web levantada por el agente en el puerto 4656
- WHEN el agente presenta el guion de pruebas sin `validation.startEnvironment` en `.docs/sdd/sdd-kit.local.json`, o con `false`
- THEN antes de presentarlo ha parado lo que arrancó, y el guion empieza por cómo arrancarla
- AND con `validation.startEnvironment: true`, la deja arrancada, y el guion dice en qué puerto está y cómo pararla

### Una task Native no se da por completa sin su commit
- GIVEN la Task 1 de un plan Native, cuya «Verificación» (`node --test tests/slot-format.test.js`) pasa, y un pre-commit que corre la suite y rechaza el commit porque `tests/import.test.js` falla
- WHEN el agente cierra la task
- THEN no ejecuta `task-done` ni escribe la línea `Task 1: complete` mientras `HEAD` siga en la base de la task
- AND lee el mensaje del hook y arregla la causa antes de volver a commitear

### Un THEN que solo se observa con la base al día declara cómo se valida
- GIVEN la fila 0012 «`npm run check:changed` … si la rama no cambia ninguno, escribe «Nada que comprobar» y sale con 0», cuyo THEN negativo no se puede observar desde `feature/0012`, porque la rama siempre cambia `scripts/check-changed.mjs`
- WHEN el agente escribe la spec
- THEN bajo ese escenario escribe `Se valida en: worktree con la base al día` (o `validación post-merge con fecha`)
- AND en el paso 7 prepara ese entorno y lo da en el guion, en vez de pedir al usuario que se lo monte

### El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite
- GIVEN una feature cerrada con `sdd-end-feature`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado y su duración
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

### Un commit del hilo posterior a la revisión final se revisa antes de la validación
- GIVEN `tasks.md` con `Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d` y, después, un commit del hilo `e4f5a6b` que cambia 3 líneas de `hooks/hooks.json`
- WHEN el hilo va a presentar la validación del paso 7
- THEN antes despacha un revisor con el encargo del revisor final (`sdd-kit:effort-high` + `opus`) sobre el tramo `a1b2c3d..HEAD`, y no presenta la validación hasta que vuelve sin Critical ni Important abiertos
- AND apunta en `tasks.md` `Re-revisión: a1b2c3d..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND si el commit llega con la validación ya presentada (un fix que sale de una pregunta del dev-lead), la re-revisión va antes de invocar `sdd-end-feature`, y el mensaje dice qué cambió y su veredicto
- AND si el tramo solo tiene commits de solo docs de menos de 20 líneas (`.docs/sdd/roadmap.md`, 2 líneas), no despacha revisor: lo anota como `revisado en el hilo`
- AND la pasada de fix de la propia revisión final no abre la re-revisión. Ejemplo: la revisión final vuelve con `Needs fixes (0 Critical, 1 Important, 0 Minor)` sobre `a1b2c3d` y la pasada queda en `c7d8e9f`, con su test RED→GREEN. El hilo apunta `Pasada de fix: c7d8e9f, 1 hallazgo RED→GREEN`, no despacha revisor y lo dice al presentar
- AND un commit del hilo posterior a la pasada, en `src/`, sí abre la re-revisión, sobre el tramo `c7d8e9f..HEAD`

### Un hallazgo de ejecución se reproduce antes de arreglarse
- GIVEN un revisor que marca como Important «`GetFullPath` lanza con una ruta inválida y el script no sale con 0»: un hallazgo Critical o Important que afirma algo de ejecución (una excepción, un código de salida, un valor en un entorno o una plataforma concretos)
- WHEN el hilo abre la ronda de fix
- THEN en SDD el encargo del implementador pide como primer paso un test que reproduzca la premisa y falle (RED), y el fix solo con ese RED; si no sale RED en un intento, el implementador vuelve con `NEEDS_CONTEXT`, el test y su salida, sin arreglar
- AND en Native el hilo hace lo mismo, y si no sale RED en un intento no arregla: decide con esa evidencia
- AND no reproducirlo no descarta el hallazgo: el hilo decide arreglar sin RED, rechazarlo o diferirlo, y lo registra como ruling con la salida del intento
- AND un hallazgo que se ve leyendo el diff (un nombre, la estructura, una duplicación) no lleva este paso

### El paquete del revisor final sale del merge-base actual y sin evidencia
- GIVEN una feature lite, sin `plan.md`, que tras su primer commit integró `develop` con un merge que trae los commits de otra feature (`skills/otra/SKILL.md`), y con `.docs/sdd/specs/<carpeta>/red/out.jsonl` en su rama
- WHEN el hilo prepara el paquete del revisor final
- THEN la sección de diff del paquete no contiene `skills/otra/SKILL.md` ni ningún fichero bajo `red/` o `green/`
- AND la sección de commits lista solo los de la feature y el merge
- AND el paquete se genera a la primera, con `spec.md` como `PLAN_FILE`

### El paquete del revisor final deja fuera los borrados y la carpeta de la feature
- GIVEN una rama que borra `docs/legacy-visual-spec.md` (500 líneas) y cinco fixtures, y trae `spec.md` y `plan.md` en su carpeta de `.docs/sdd/specs/`
- WHEN el hilo prepara el paquete del revisor final
- THEN el paquete no contiene el cuerpo de los ficheros borrados ni ningún fichero de la carpeta de la feature
- AND lista los borrados por nombre en su sección «Ficheros borrados»
- AND el revisor lo lee en tramos de 400 líneas con `offset` y `limit`, y ningún `Read` devuelve `exceeds maximum allowed tokens (25000)`

### El plan escribe al revisor final con el techo del kit
- GIVEN una spec aprobada en `delegate` y un plan Native de una sola task pequeña
- WHEN el agente escribe `plan.md`
- THEN el revisor final aparece como `sdd-kit:effort-high` + `opus`, o no aparece

### Todo subagente y toda verificación lenta llevan su vigía de silencio
- GIVEN un proyecto con `"control": { "silence": { "betweenStepsMinutes": 8, "longCommandMinutes": 20 } }` en `sdd-kit.json`, y un plan Native con la implementación terminada
- WHEN el hilo despacha el revisor final de rama
- THEN en el mismo turno lanza en segundo plano `Watch-SubagentSilence.ps1` sobre el transcript de ese revisor, y la orden no lleva ni 8 ni 20: los umbrales los lee el script
- AND lo mismo al despachar un implementador, un revisor de task, un fix wave o una re-revisión en SDD, un revisor de spec o la re-revisión del cierre
- AND al lanzar la verificación lenta `Invoke-Pester tests/` en segundo plano, lanza el vigía sobre el fichero de salida de ese comando

### El umbral del silencio depende de la herramienta que espera
- GIVEN `betweenStepsMinutes: 8` y `longCommandMinutes: 20`, y el transcript de un revisor final cuyo último evento es un `tool_use` de `Read` sin `tool_result`, escrito hace 8 min 30 s
- WHEN el vigía lo mira
- THEN termina con el aviso de silencio
- AND si el último evento es un `tool_use` de `PowerShell` con `Invoke-Pester` sin `tool_result`, escrito hace 15 min, no avisa; a los 20 min 30 s, sí
- AND con `betweenStepsMinutes: 5` en `sdd-kit.json`, el caso del `Read` avisa a los 5 min 30 s
- AND sin el bloque `control.silence` en `sdd-kit.json`, aplica 8 y 20

### El aviso de silencio dice qué hacía el subagente y cuánto gastó
- GIVEN el transcript del ticket: arranque a las 13:25:35Z, último evento a las 13:26:12Z, un `tool_use` de `Read` de `review-final-0f264440.diff` con `offset 500` y `limit 420`, sin `tool_result` ni `PreToolUse`, sin `PermissionRequest`
- WHEN el vigía avisa
- THEN el aviso da la hora del último evento (13:26:12Z), la herramienta y sus parámetros recortados (`Read`, `review-final-0f264440.diff`, `offset 500`, `limit 420`), «sin `PreToolUse`», «sin petición de permiso» y los tokens gastados desde el arranque

### Un subagente colgado se para, se relanza una vez y se cuenta sin que nadie pregunte
- GIVEN el perfil `delegate`, un revisor final despachado y el aviso de silencio del escenario anterior
- WHEN el aviso llega al hilo
- THEN el hilo para ese revisor y lo relanza una vez con el mismo encargo y un vigía nuevo
- AND en su siguiente mensaje le dice al usuario, sin que pregunte, qué se colgó, con el diagnóstico, y que lo ha relanzado
- AND registra el ruling `Cuelgue: revisor final, Read sin respuesta, 8 min, relanzado` en `tasks.md` (en Native, también en el ledger)
- AND si lo colgado es un implementador de SDD que dejó cambios sin commitear, el encargo del relanzado lista esos ficheros

### Un permiso pendiente o un segundo cuelgue no se relanzan
- GIVEN un aviso de silencio cuyo diagnóstico dice que hay un `PermissionRequest` pendiente
- WHEN el aviso llega al hilo
- THEN el hilo para el subagente, no lo relanza, le dice al usuario qué permiso esperaba y registra `Cuelgue: <tipo>, <herramienta> sin respuesta, <minutos> min, no relanzado: permiso`
- AND en `unattended`, la feature queda además `⏸️ aparcada: permiso pendiente de <herramienta>` al instante, como pide el tope de reintentos de la 0022 para un fallo de permisos
- AND GIVEN el revisor relanzado, que se vuelve a colgar · WHEN llega su aviso · THEN en `pair` y `delegate` el hilo lo para y pregunta al usuario cómo seguir, sin volver a relanzarlo; en `unattended`, la feature queda `⏸️ aparcada: cuelgue repetido del revisor final` y el agente sigue con la siguiente de la release

### Un subagente que termina no da falso aviso
- GIVEN un revisor final que devuelve su resultado a los 5 min del despacho, con `betweenStepsMinutes: 8`
- WHEN pasan 13 min desde el despacho
- THEN no ha llegado ningún aviso de silencio y su vigía ya no corre

### Sin transcript, el vigía lo dice
- GIVEN una sesión en la que no existe `subagents/agent-*.jsonl` para el subagente despachado
- WHEN pasan 2 min desde que se lanzó el vigía
- THEN el vigía termina con «sin transcript», y el hilo le dice al usuario que en esta sesión el vigía de silencio no funciona

### Una feature lite que cambia la UI se verifica en el navegador
- GIVEN una feature lite aprobada que añade el badge «Urgente» con un `@if` y una línea de CSS, ya implementada, y el usuario con la aplicación levantada en el puerto 4700
- WHEN el agente la verifica antes de presentar la validación
- THEN la spec lite lleva en su Approach el criterio en frases medibles y la pantalla de referencia
- AND la verifica sobre el entorno del puerto 4700, sin arrancar otro, sin build dedicado y sin escribir una suite de specs nueva
- AND pasa el detector en los dos viewports y saca una captura por estado (pedido urgente y pedido sin urgencia), y la presentación las enseña
- AND no presenta la validación con un hallazgo del detector abierto sin justificar, con los mismos contraejemplos que una task full, y si el detector declarado no ejecuta, lo visual queda «no probado» con el error
- AND no mide estilos computados, porque la spec no fija ningún valor numérico

### El agente entra en la aplicación solo como declara el proyecto
- GIVEN una aplicación que pide login y un `§Frontend` que declara la página `/dev/impersonate`, el usuario de pruebas `demo@example.test` y la sesión en `.auth/state.json`, ignorada por git
- WHEN el agente verifica una pantalla detrás del login más de una vez
- THEN el runner y el detector entran por la URL de entrada `/dev/impersonate?user=demo@example.test&next={path}` con el `{path}` de cada pantalla, sin gastar accesos
- AND si la entrada declarada gasta algo con límite (un enlace mágico, un código), el runner entra una vez, guarda la sesión y la reutiliza en las ejecuciones siguientes; si la aplicación lo devuelve al login, la rehace una vez
- AND si la ruta de la sesión no está ignorada por git, no guarda la sesión ahí y lo dice
- AND si `§Frontend` no dice cómo entrar y la aplicación entra con enlace mágico, no pide ningún enlace ni intenta el login: lo visual queda «no probado: falta el acceso en §Frontend», y la presentación propone el acceso con la recomendación de una página de desarrollo y `storageState`, sin parada nueva en ningún perfil

### Una spec que cambia lo que se ve propone `§Frontend` si falta
- GIVEN un proyecto ya inicializado con interfaz cuyo `tech-stack.md` no tiene `§Frontend`, y una fila que pide una pantalla nueva
- WHEN el agente escribe la spec
- THEN «Decisiones que he tomado yo» lleva la propuesta de `§Frontend` con sus campos rellenos, recomendando impeccable y Playwright, y el acceso que se ve en el código
- AND al aprobar la spec, `tech-stack.md` gana esa `§Frontend`, sin parada nueva
- AND si el dev-lead no quiere detector, queda `Detector: ninguno`, la verificación sigue con capturas y rúbrica y el aviso «composición no medida», y la propuesta no se repite en las features siguientes

## Reglas de la capacidad

- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad. Las capturas de la verificación visual, fuera de git (el scratchpad de la sesión o `%TEMP%`) hasta la validación. La sesión de la aplicación, en la ruta que declara `§Frontend`, ignorada por git. Con qué se verifica el frontend, en `§Frontend` de `tech-stack.md`.
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case. El contenido de los documentos sigue en castellano.
- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución.
- **Avisos**: cada cambio de paso dice en llano qué se hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará si lanza subagentes o sujetos. Sin detector declarado, la presentación lleva «composición no medida: `tech-stack.md` no declara detector en §Frontend».
- **Regla ante conflicto**: `§Frontend` gana sobre los valores por defecto de la verificación (viewports), y la pantalla de referencia que nombra la task gana sobre la de `§Frontend`.
