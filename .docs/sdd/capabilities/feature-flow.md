# Capacidad — feature-flow

## Propósito

El carril feature del kit: lo que un dev y un agente pueden esperar al arrancar, especificar y cerrar una feature.

## Requisitos

### La spec presenta primero las decisiones tomadas sin el usuario

- GIVEN una feature en modo full o lite, con una entrevista que fijó el filtro por sala y en la que nadie habló de cuántas filas enseña la exportación
- WHEN el agente presenta la spec en el gate
- THEN lo primero que lee el dev-lead es un párrafo que empieza por 🦆, escrito por `sdd-rubber-duck` en modo corto, y después «✋ Decisiones que he tomado yo — valida estas», con una línea por decisión
- AND en la `spec.md`, el 🦆 va bajo el título, antes de «Capacidades», y el ✋ va justo después de «Capacidades»
- AND si la spec fija un tope de 50 filas, ese tope está en ✋, porque no salió de la entrevista ni del roadmap
- AND la spec lleva la sección «Términos y ADR»: los términos que la entrevista resolvió y las ADR candidatas (difícil de deshacer, sorprende sin contexto y hubo una alternativa real), o «ninguno» y «ninguna»

### Lo técnico no vive en la spec

- GIVEN un contenido cuya implementación puede cambiar sin cambiar el comportamiento observable (modelo de datos, endpoints, riesgos técnicos, rollout)
- WHEN se redacta la spec
- THEN ese contenido va a `plan.md`, no a `spec.md`

### La spec propone su propio nivel de review por complejidad

- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec, la opción mínima con lo que deja sin cubrir y el modelo del revisor de dominio
- AND si el Scope cambia menos de ~50 líneas (texto y código), el nivel baja de dos revisores a uno con los siete puntos, nunca a ninguno: con contrato público + datos y dos líneas en `db/002-site.sql` y `src/api.js`, un revisor
- AND si el nivel sería dos revisores, la spec va aprobada por delegación (la opción o la frase «apruebo la spec por delegación») y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo; con un nivel de «ninguna» no despacha ninguno
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

### El plan lleva su Review Focus y viaja al revisor final

- GIVEN la spec de la 0012 aprobada (filtro de reservas por `status`, que no dice qué pasa con `status=Foo`) y un plan escrito con `plan-template.md`
- WHEN el agente termina el plan
- THEN el plan tiene una sección `## Review Focus` entre «Restricciones globales» y «Phase -1», con una línea por entrada o fallo que ningún test de las tasks ejercita, con su comportamiento esperado y su task (p. ej. «`status=Foo` → 400 con los estados válidos · Task 1, `Rejects_unknown_status`»), o «ninguna: comprobado»
- AND «Decisiones que he tomado yo» lleva una línea que la resume («Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección»)
- AND el self-review §4 lleva una fila por línea del Review Focus con su task y su test
- AND al despachar la revisión final, el encargo del eje Spec lleva la sección `## Review Focus` del plan, copiada literal

### El artículo de calidad de código viaja a implementadores y revisores

- GIVEN un plan cuyas Restricciones globales tienen un bloque «De código», con el artículo de calidad de la constitution, y un bloque «De proceso», o una feature en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task, un re-revisor o un eje de la revisión final
- THEN el encargo lleva el bloque «De código» literal como primera sección
- AND el bloque «De proceso» (política de modelos, modo de ejecución, atribución de commits) no aparece en el encargo de ningún revisor
- AND en modo lite el bloque es el artículo de calidad de código de la constitution, copiado literal; la política de modelos la aplica quien despacha

### El trabajo se valida con el usuario antes de cerrar

- GIVEN una feature con la implementación terminada y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-archive` presenta, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, compuestos y ensayados como dice «El guion de la validación empieza por el reporte y lo ha corrido el agente» de [`archive`](archive.md). Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

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
- THEN los tests que codifican los escenarios de la task existen antes del primer encargo, escritos por el hilo, uno por THEN y uno por cada línea del Review Focus del plan que nombra esa task, en RED, sin commitear
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica; los commitea con su implementación con `git add` de rutas explícitas y nunca con `--no-verify`
- AND el hilo guarda una copia fuera del repo antes del despacho y, al volver el implementador, la compara con el test commiteado; un cambio que no sea de formato va al revisor de la task

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
- AND ninguna task pide leer otra task ni el plan entero: un implementador con el contexto vacío la hace con su texto, los ficheros que nombra y las Restricciones globales

### Un umbral superado en una unidad es Minor

- GIVEN un diff correcto con una función de 21 líneas y un bloque «De código» que fija funciones de 20 líneas como máximo
- WHEN un revisor de task o el revisor final lo revisa
- THEN reporta la función como Minor y, si no hay otro hallazgo, aprueba
- AND una función de 22 líneas o más sigue siendo Important

### El formato que exige el linter no rompe el contrato de los tests RED

- GIVEN un implementador que solo añadió en un test RED la línea en blanco que exigía el linter, sin tocar aserciones, nombres ni datos, y lo declara en su informe
- WHEN el revisor de task revisa el diff
- THEN no lo reporta como Critical ni como Important

### La spec se repasa antes del gate

- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»
- AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca su nombre en `capabilities/`, en los documentos del proyecto y, en un kit de skills, en `skills/`, y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con `grep -rn 0009 capabilities/ skills/`», y no se borra con los bloques de ayuda
- AND antes del gate ejecuta `sdd capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, corrige en la spec lo que rechace y escribe la línea del resultado en «Decisiones que he tomado yo»; la `capabilities/` del repo no cambia

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
- AND el cierre de `sdd-archive` solo lo repite tras su merge de sincronización, y solo si la base trajo cambios fuera de `.docs/` que no sean `*.md`

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

- GIVEN una spec de permisos por rol del gestor de cobros, con review de uno o dos revisores
- WHEN el agente pregunta la review
- THEN las opciones llevan el modelo del revisor de dominio, y la recomendada es Opus porque la spec toca roles; para «renombrar una columna del listado», la recomendada es Sonnet
- AND con un solo revisor de siete puntos, su modelo se elige igual, porque incluye la lente de dominio
- AND si la petición o el prompt de arranque dicen «revisor de dominio en Opus», no lo pregunta y lo aplica
- AND sin esa pregunta (spec aprobada por delegación, `unattended`), el revisor de dominio va en Sonnet
- AND cada despacho lleva `subagent_type: sdd-kit:effort-medium` y el modelo elegido; el revisor técnico, siempre `model: sonnet`

### Cada cambio de paso lleva un aviso en llano

- GIVEN una feature en curso con `sdd-propose` o `sdd-start-feature`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

### Una decisión del dev-lead que sale de la revisión final se pregunta sola

- GIVEN la revisión final de rama con un hallazgo cuya resolución es del dev-lead
- WHEN el agente llega al paso 7
- THEN pregunta esa decisión sola, en su propio turno, y presenta la validación después de la respuesta
- AND no la resuelve por defecto ni la mete en el mensaje de la validación

### La base se comprueba antes de cada task Native

- GIVEN un plan con `Ejecución: native` y dos o más tasks
- WHEN el hilo va a empezar cada task
- THEN antes compara la fila de la task y los ficheros de la task con la base, como antes de despachar un implementador

### Los RED de una task Native se apartan y se comparan

- GIVEN una task de un plan con `Ejecución: native`
- WHEN el hilo la empieza
- THEN escribe los tests de sus THEN antes del código y guarda una copia fuera del repo
- AND antes del commit de la task compara la copia con el test con `git diff --no-index`, y un cambio que no sea de formato es un ruling del ledger

### Sin el tipo de effort, se dice antes del primer despacho

- GIVEN una sesión cuyos tipos de agente no incluyen el `sdd-kit:effort-<nivel>` que toca
- WHEN el hilo va a hacer el primer despacho de la feature (implementador en SDD, revisor final en Native)
- THEN antes de despachar dice que el tipo falta, despacha con el `model` y la frase de respaldo «effort: no disponible en este harness, hereda el de la sesión», y lo registra como ruling

### Los minors diferidos llegan al walkthrough

- GIVEN una feature Native con líneas `Final: minor (deferred)` en el ledger
- WHEN se escribe el walkthrough
- THEN «Decisiones tomadas sin el dev-lead» lleva las líneas `Ruling:` y `minor (deferred)` que da `sdd ledger rulings`, ejecutado antes de que el workspace se borre

### Cada task de producto acaba en algo que se prueba en la aplicación

- GIVEN un plan para las salas favoritas, que tocan la migración `favorite_rooms`, la API y la estrella de la pantalla de salas
- WHEN se parte en tasks
- THEN la task «Marcar Sur como favorita» atraviesa migración, API y estrella, y su línea «Se prueba en la aplicación» dice «Ana pulsa la estrella de Sur y la ve llena tras recargar». No sale una task «BD y API» seguida de otra «web».
- AND una task que no deja nada que se pueda probar (una migración de datos previa, un refactor) lleva en esa línea «no, porque <motivo>»
- AND cada task lleva `**Tras**:` con la task de la que depende, o `—`: «Quitar Sur de favoritas» lleva `Tras: Task 1`
- AND el plan dice que las tasks se ejecutan en orden, sin paralelo
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
- THEN entre las opciones de `AskUserQuestion` está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy

### Con Native, el plan registra el modelo recomendado para la sesión

- GIVEN un plan cuyo método es Native
- WHEN el agente escribe su línea `Ejecución`
- THEN la línea lleva, literal, «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.»

### La carpeta de una feature nueva lleva `-feature-`

- GIVEN un proyecto en modo `sequence` con la fila 0081 «Avisos de reserva» pendiente en el roadmap
- WHEN `sdd-propose` crea la carpeta de la spec el 2026-10-01 a las 09:15:00 UTC
- THEN la carpeta es `.docs/sdd/specs/20261001-091500-feature-0081-booking-reminders/`
- AND el frontmatter de `spec.md` lleva `id: 20261001-091500-feature-0081-booking-reminders` y `feature: 0081`

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
- AND con `validation.startEnvironment: true` y el entorno sin levantar (el gate de cierre `node --test test/` no lo arranca), lo levanta antes del guion con `env:setup` de `## Entornos` de `operations.md` si la sección existe, o si no con «Arrancar» (`node scripts/env-up.mjs`), comprueba que responde, y el guion abre con su puerto y cómo pararlo (`node scripts/env-down.mjs`)
- AND sin «Arrancar» ni `## Entornos` en `operations.md`, el guion dice que no hay comando de arranque declarado y empieza por cómo arrancarla

### Una task Native no se da por completa sin su commit

- GIVEN la Task 1 de un plan Native, cuya «Verificación» (`node --test tests/slot-format.test.js`) pasa, y un pre-commit que corre la suite y rechaza el commit porque `tests/import.test.js` falla
- WHEN el agente cierra la task
- THEN no ejecuta `sdd task done` ni escribe la línea `Task 1: complete` mientras `HEAD` siga en la base de la task
- AND lee el mensaje del hook y arregla la causa antes de volver a commitear

### Un THEN que solo se observa con la base al día declara cómo se valida

- GIVEN la fila 0012 «`npm run check:changed` … si la rama no cambia ninguno, escribe «Nada que comprobar» y sale con 0», cuyo THEN negativo no se puede observar desde `feature/0012`, porque la rama siempre cambia `scripts/check-changed.mjs`
- WHEN el agente escribe la spec
- THEN bajo ese escenario escribe `Se valida en: worktree con la base al día` (o `validación post-merge con fecha`)
- AND en el paso 7 prepara ese entorno y lo da en el guion, en vez de pedir al usuario que se lo monte

### Un hallazgo de ejecución se reproduce antes de arreglarse

- GIVEN un revisor que marca como Important «`GetFullPath` lanza con una ruta inválida y el script no sale con 0»: un hallazgo Critical o Important que afirma algo de ejecución (una excepción, un código de salida, un valor en un entorno o una plataforma concretos)
- WHEN el hilo abre la ronda de fix
- THEN en SDD el encargo del implementador pide como primer paso un test que reproduzca la premisa y falle (RED), y el fix solo con ese RED; si no sale RED en un intento, el implementador vuelve con `NEEDS_CONTEXT`, el test y su salida, sin arreglar
- AND en Native el hilo hace lo mismo, y si no sale RED en un intento no arregla: decide con esa evidencia
- AND no reproducirlo no descarta el hallazgo: el hilo decide arreglar sin RED, rechazarlo o diferirlo, y lo registra como ruling con la salida del intento
- AND un hallazgo que se ve leyendo el diff (un nombre, la estructura, una duplicación) no lleva este paso

### Todo subagente y toda verificación lenta llevan su vigía de silencio

- GIVEN un proyecto con `"control": { "silence": { "betweenStepsMinutes": 8, "longCommandMinutes": 20 } }` en `sdd-kit.json`, y un plan Native con la implementación terminada
- WHEN el hilo despacha el revisor final de rama
- THEN en el mismo turno lanza en segundo plano `sdd watch subagent` sobre el transcript de ese revisor, y la orden no lleva ni 8 ni 20: los umbrales los lee el script
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

### Lo cambiado tras la validación se separa de lo validado

- GIVEN una feature validada con «probé borrar un fichero y funciona» y, después, a petición del dev-lead, un commit `c7d8e9f` que cambia el texto del error «No se pudo borrar» por «El fichero ya no existe»
- WHEN se cierra
- THEN si la re-revisión de la revisión final aún no salió, el commit entra en ella antes del walkthrough; si ya salió, no se despacha otra y el walkthrough lleva en ✋ `sin revisar: c7d8e9f — el texto del error de borrar`, como dice «Una re-revisión nunca abre otra» de [`verification`](verification.md)
- AND la verificación del walkthrough y el mensaje final dicen que el dev-lead probó la versión anterior y qué verificó el agente del cambio (`c7d8e9f`), separado de la línea de validación
- AND el hilo no para a pedir otra validación

### Una migración solo de datos no descarta el modo lite

- GIVEN una feature que quita un botón de una pantalla y cuya única migración da de baja sus dos textos con un procedimiento idempotente y reversible
- WHEN `sdd-propose` cita el predicado de lite en la pregunta del carril
- THEN lo ofrece como lite y nombra la migración
- AND con una migración que añade una columna no lo ofrece: cambia el schema

### El diseño de una feature pregunta con `sdd-grilling`

- GIVEN el paso de spec de `sdd-propose`, con el diseño de una feature que cambia lo que ve el usuario
- WHEN el agente necesita una decisión del usuario
- THEN la pregunta sigue `sdd-grilling` ([`interviewing`](interviewing.md)): una por turno, en texto con el formato fijo, con escena concreta si es de producto
- AND la spec se escribe siguiendo `references/spec-writing.md` de `sdd-propose`, y el plan, `references/plan-writing.md`, sin invocar `superpowers:brainstorming` ni `superpowers:writing-plans`

### Los rulings del ledger se cosechan antes de borrar el workspace

- GIVEN el ledger de un plan con `Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24`, `Final: minor (deferred) nombre de variable poco claro en parse()` y `Final: Ruling: no se renombra Foo — fuera de alcance`
- WHEN el cierre ejecuta `node sdd.js ledger rulings <plan.md>`
- THEN escribe esas tres líneas en el orden del ledger y sale con 0
- AND sin ledger escribe `Sin rulings` y sale con 0

### Las tasks Native se abren y cierran desde cualquier shell

- GIVEN un plan con `Ejecución: native` en Windows, con PowerShell como shell principal, y una «Verificación» que no imprime nada si pasa
- WHEN el hilo abre y cierra cada task con `sdd task start` y `sdd task done <plan> <n> <base> -- pwsh -NoProfile -Command "Invoke-Pester -Path tests/Foo.Tests.ps1 -CI"` desde la herramienta PowerShell
- THEN `sdd task start` imprime la ruta del workspace en forma Windows (`D:\…`), y la línea `Task <N>: complete (…, tests: <comando> → (sin salida))` queda en el ledger a la primera
- AND si `sdd task start` falla o no imprime ruta, sale con un código distinto de 0 y el hilo no escribe en el ledger
- AND con un test en rojo, `sdd task done` no escribe `Task <N>: complete` y sale con el código del comando; con un comando que no existe, sale con 127 y tampoco lo escribe

### La spec dice dónde se prueba cada comportamiento

- GIVEN una feature que añade cancelar una reserva por el endpoint y por la pantalla, en un proyecto cuyos tests de reservas van contra el endpoint
- WHEN el agente escribe la spec
- THEN la sección «Dónde se prueba» dice «cancelar reserva: por el endpoint, como los tests de reservas actuales; la pantalla, con una captura»

### La pregunta del gate de la spec lleva opciones fijas

- GIVEN una feature en `pair` o `delegate`, con la spec lista para el gate
- WHEN el agente presenta la spec
- THEN la pregunta del gate es una llamada a `AskUserQuestion` con, al menos, «Apruebo (Recomendada)» y «Cambios»
- AND no es una pregunta en prosa al final del mensaje

### El gate de cierre del plan sale de `operations.md`

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`» y sin script `test` en `package.json`
- WHEN `sdd-propose` escribe el plan
- THEN la línea del gate de cierre de §3 dice `node --test`, literal
- AND sin `operations.md`, toma el de `tech-stack.md` §Testing; sin ninguno, el de la constitution; y si no hay ninguno, escribe `no declarado` y lo apunta en las decisiones del plan, sin inventar un comando como `npm test`

### `sdd-propose` entrega el cambio a la skill que lo sigue

- GIVEN la feature 0010 en `delegate`, con la spec aprobada y el plan escrito por `sdd-propose`
- WHEN `sdd-propose` termina el plan
- THEN invoca `sdd-start-feature`, que sigue desde la implementación leyendo `mode` y `profile` del frontmatter de `spec.md`, la línea `Ejecución` del plan y la rama
- AND en lite, la invoca con la spec aprobada; en patch, invoca `sdd-start-patch` con la clase del patch y la estimación de la pregunta
- AND si se invoca `sdd-start-feature` sin una `spec.md` aprobada en la rama, manda a `sdd-propose`

### La implementación la lleva `sdd-implement`

- GIVEN la feature 0042 en modo full, con la spec aprobada y el plan con `Ejecución: native, porque 2 tasks encadenadas por la interfaz de Ledger, …`
- WHEN `sdd-start-feature` llega al paso 6
- THEN invoca `sdd-implement`, que ejecuta las dos tasks en Native y, con la revisión final de vuelta y su pasada de fix hecha, sigue en el paso 7 de `sdd-start-feature`
- AND ningún fichero de `skills/` invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`
- AND en modo lite, sin plan, el método es el de `execution` si está fijado y Native con `auto`, con `spec.md` en el lugar del plan

### Una task Native se registra en el ledger de `sdd-implement`

- GIVEN un plan con `Ejecución: native`
- WHEN el hilo ejecuta cada task
- THEN la abre con `sdd task start` y la cierra con `sdd task done` y el comando de su «Verificación», y el ledger del workspace tiene su línea `Task <N>: complete`

### El encargo del implementador lleva el decálogo de calidad

- GIVEN un plan con el bloque «De código» en sus Restricciones globales
- WHEN se despacha el implementador de una task, o el hilo prepara la ejecución en Native
- THEN el encargo lleva, tras «Restricciones de código», la sección `## Quality decalogue` con las diez reglas y la frase de que, si una choca con las Restricciones de código, mandan las Restricciones
- AND en Native el hilo la lee una vez, al preparar la ejecución
- AND el encargo del revisor de task y el del re-revisor no la llevan

### El workspace del plan se anuncia

- GIVEN un plan sin workspace en `.temp/sdd/`
- WHEN `sdd-implement` lo crea
- THEN dice al dev-lead `Workspace del plan: .temp/sdd/plan/ — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`
- AND con un ledger del mismo plan con `Task 1: complete …`, la línea acaba en `· retomo en la Task 2`

### Tras una caída o un corte por cuota, la ejecución sigue desde el ledger

- GIVEN un plan SDD con `Task 1: complete (commits a1b2c3d..d4e5f6a, review clean)` en el ledger, `task-2-report.md` con `Status: DONE` y su commit `b7c8d9e`, y la notificación de fallo del implementador de la Task 2 por cuota agotada
- WHEN el hilo retoma
- THEN no relanza la Task 1 ni la Task 2: despacha la revisión de la Task 2 sobre `d4e5f6a..b7c8d9e` y deja `Task 2: Ruling: recuperación tras corte por cuota — informe completo, sigue a revisión`
- AND si la Task 2 no tuviera informe, la relanza una vez con el mismo brief y el mismo modelo, y el encargo nombra los ficheros que `git status` da cambiados

### El walkthrough dice si la ejecución compactó

- GIVEN una feature en Native de 4 tasks cuya sesión compactó en la Task 2 con dos tasks pendientes
- WHEN el hilo retoma
- THEN escribe en el ledger `Task 2: Ruling: compactación — sigo con SDD — quedan 2 tasks`
- AND el walkthrough lleva en «Lo que se hizo» `Compactación: sí, en la Task 2 → SDD desde la Task 3`, y en una feature que no compactó, `Compactación: no`

### Un E2E rojo por tiempo se ajusta sin tocar sus aserciones

- GIVEN un RED de E2E que espera 500 ms a un guardado que tarda 2 s, con el código de la task ya correcto
- WHEN el implementador lo ve fallar por tiempo
- THEN cambia la espera por la señal de guardado, sin cambiar aserciones ni datos, y lo lista en su informe bajo `Ajustes de espera`

### Una feature grande devuelve el diseño por secciones antes de la spec

- GIVEN la feature 0012 en `delegate`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike (también mientras el spike corra como full), escribe la spec sin secciones y la presenta en el gate
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones: lo que habría preguntado va a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND las secciones son turnos de la entrevista dentro de la parada de la spec, no una parada nueva del perfil: valen en `pair` y en `delegate`
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás

### Pedir empezar ya no se lleva la spec

- GIVEN una feature en el paso de spec de `sdd-propose`
- WHEN el agente pregunta al usuario
- THEN no le ofrece saltarse las preguntas
- AND si el usuario pide empezar ya, el agente escribe `spec.md` con lo que hay, con los huecos en «✋ Decisiones que he tomado yo», y la spec pasa por su gate

### Quien implementa ve fallar los RED antes de implementar

- GIVEN un plan con `Ejecución: subagent` y la Task 1 con el RED `test/informe.test.js` escrito por el hilo y sin commitear
- WHEN el implementador recibe su encargo
- THEN ejecuta `test/informe.test.js` antes de editar ningún fichero de `src/`
- AND su informe lleva en «TDD Evidence» el comando, la salida en rojo de antes de implementar y por qué se esperaba ese fallo

### Un fallo se investiga con `sdd-debugging`

- GIVEN un patch de un fallo determinista («`libres 10:00-12:00` devuelve Norte aunque Norte tiene una reserva activa en esa franja»), o un paso del plan cuyo `Expected:` no coincide porque el código falla
- WHEN el agente lo investiga
- THEN invoca `sdd-debugging` y escribe la causa raíz con su evidencia en el código antes de proponer el arreglo
- AND antes del arreglo hay un test en rojo que reproduce el fallo, escrito con `sdd-tdd`
- AND en un patch, §2 de `patch.md` lleva la causa raíz con su evidencia antes de editar el código: la fase 4 de `sdd-debugging` empieza con ella escrita
- AND ningún fichero de `skills/` invoca `superpowers:test-driven-development` ni `superpowers:systematic-debugging`

### El worktree de la implementación lo prepara `sdd-worktrees`

- GIVEN la 0010 con la spec y el plan aprobados, abierta en un worktree que creó Orca en la rama `feature/0010-cancel`, y un proyecto con `.docs/sdd/environments.md` y `.docs/sdd/operations.md` §Testing `Gate de cierre: node --test`
- WHEN `sdd-implement` hace su preparación
- THEN invoca `sdd-worktrees`, que detecta que ya está en un worktree enlazado, lo dice con su rama, y no crea otro
- AND ejecuta `env:setup` después de instalar las dependencias, y los encargos de implementador dicen dónde está `.sdd-env.json`
- AND la baseline ejecuta `node --test`, el gate de cierre del proyecto; sin gate declarado en `operations.md`, `tech-stack.md` ni la constitution, lo dice y pregunta qué ejecutar
- AND si la baseline falla, corre el mismo comando en un worktree temporal desanclado de la rama de integración; si también falla allí, busca las primeras líneas de error en la deuda del proyecto y cita la fila o abre una en «Por triar»; después informa de los fallos con ese veredicto y pregunta si sigue o investiga
- AND ningún fichero de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`

### Dos revisores de spec se despachan con `sdd-parallel-agents`

- GIVEN la spec de permisos por rol del gestor de cobros, con 4 señales, review de dos revisores aceptada y `control.maxParallelAgents: 3`
- WHEN el agente despacha la review
- THEN invoca `sdd-parallel-agents` y despacha los dos revisores en la misma respuesta, cada uno con su lente
- AND cada despacho lleva `model` y `subagent_type: sdd-kit:effort-medium`, como dice «El revisor de spec se despacha con su effort»
- AND nunca hay a la vez más agentes que `control.maxParallelAgents` (3 si falta); con más, se despachan por tandas
- AND dos tasks independientes del plan no se despachan con `sdd-parallel-agents`: las ejecuta `sdd-implement` una detrás de otra

### El revisor de la spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera

- GIVEN una spec con «artifacts cubre el visual companion entero» en «Decisiones tomadas con el dev-lead», y un delta cuyo único requisito sobre el companion habla de pantallas
- WHEN la revisa el revisor de la spec (la lente de dominio, o el revisor único)
- THEN devuelve, como Importante o Crítico, «Delta · la decisión del dev-lead sobre el visual companion queda cubierta solo para pantallas · ampliar el requisito a flujos y diagramas»

### La spec mide el margen de palabras de lo que edita

- GIVEN un proyecto con topes de palabras (`tests/WordBudget.Tests.ps1` con `'sdd-propose' = @{ SkillMd = 5000; Total = 6325 }`) y una spec que edita `sdd-propose`, medido en 4.908 y 6.324
- WHEN el agente escribe la spec
- THEN la sección «Topes de palabras» lleva una fila por skill o documento con tope que la spec edita, con lo medido, el tope, el margen y el tope propuesto: `sdd-propose · 4.908 / 5.000 y 6.324 / 6.325 · 92 y 1 · 5.200 / 6.700`
- AND el tope propuesto es lo medido más lo previsto más un 2 % (mínimo 20 palabras) para la pasada de fix, y el gate lo aprueba como decisión del dev-lead
- AND el de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen
- AND si durante la feature se recorta texto para caber, el recorte es una edición de skill: si quita una instrucción, lleva su RED
- AND sin topes en el proyecto, la sección no se escribe

### La política de modelos de la spec vale como confirmación de paralelizar

- GIVEN una feature en `delegate`, con la spec aprobada y la línea `Política de modelos: revisores de la spec ninguno · ejes de la revisión final Spec opus+high, Código sonnet+high · en paralelo hasta control.maxParallelAgents`, y unas instrucciones del usuario que piden confirmar antes de paralelizar
- WHEN el hilo va a despachar los ejes de la revisión final con `sdd-parallel-agents`
- THEN los despacha en la misma respuesta sin preguntar, porque la aprobación de la spec fue esa confirmación
- AND un modelo o un despacho que la línea no nombra se confirma como piden las instrucciones
- AND en `delegate` la spec sin esa línea no pasa el repaso de coherencia

### El self-review del plan asigna cada cláusula de un THEN a lo que la observa

- GIVEN una spec con «THEN el agente ha preguntado el umbral · AND la sección lleva la respuesta», y una task cuyo test solo mide lo escrito
- WHEN el agente escribe §4 del plan
- THEN §4 lleva una línea por cláusula, cada una con su task y el test o la fila de medición que la observa: `THEN ha preguntado → Task 2, escenario n1 (turno 1)` y `AND la sección lleva la respuesta → Task 2, n1 (spec-new.md)`
- AND una cláusula que nada observa dice `sin observar: <motivo>`, y el plan lo avisa en sus decisiones antes de ejecutar
- AND si la spec trae la tabla «regla retirada → dónde vive ahora», §4 lleva una línea por fila con su task y el test que busca la regla en su destino

### La verificación de una task dice su línea de resumen

- GIVEN una task con superficie tooling en un proyecto con `node --test`, cuya salida acaba en `ℹ duration_ms 52.1` y no en el resumen
- WHEN el agente escribe su «Verificación»
- THEN es un comando que sale con un código distinto de 0 si algo falla, sin códigos de color, y la línea dice, literal, la línea de resumen que imprime (`ℹ fail 0` con `node --test`, `Tests  12 passed (12)` con Vitest)
- AND sin tests automáticos, dice el smoke manual con su resultado esperado

### La fila de «Aprobaciones» dice quién y cómo aprobó

- GIVEN una spec calcada de `spec-template.md` y aprobada por Ana con la opción «Apruebo (Recomendada)» de `AskUserQuestion` el 2026-10-18
- WHEN el agente registra la aprobación
- THEN la tabla «Aprobaciones» tiene las columnas `Nombre | Fecha | Estado`, sin «Rol», y la fila dice `Ana | 2026-10-18 | aprobada (opción «Apruebo»)`
- AND si Ana escribe «sí, adelante», el Estado es `aprobada: «sí, adelante»`
- AND el frontmatter `approvers` lleva `name` y `approved_at`, sin `role`

### Un E2E espera solo a lo que el usuario ve

- GIVEN una task que escribe el E2E de «copiar A1 con Ctrl+C, clic derecho en B1, «Pegar», B1 muestra 4321», en una app que guarda la copia en el servidor y monta el editor de celda unos cientos de ms después de Enter
- WHEN el implementador escribe el test
- THEN entre Ctrl+C y el clic derecho no hay ninguna espera al API ni a un estado interno
- AND tras Enter espera a que el editor tenga el foco antes de teclear «4321»
- AND no usa `waitForTimeout` ni cambia retries o timeouts
- AND una espera a un estado interno entre dos acciones lleva su motivo en un comentario, y «sin esperarlo, la app no tendría el dato» no cuenta como motivo

### Un E2E inestable no se tapa con retries ni timeouts

- GIVEN un E2E que falla 1 de cada 5 pasadas con `Timeout 5000ms exceeded` en un `toHaveText`, y la petición de dejar la suite en verde
- WHEN el agente lo arregla
- THEN repite solo ese test con `--repeat-each`, dice qué causa encontró (carrera del test, carrera de la app, entorno o datos compartidos) y la arregla
- AND si no la arregla, lo marca con `test.fixme()` y el enlace a su issue
- AND no sube `retries` ni ningún timeout, ni en el test ni en `playwright.config.ts`

## Reglas de la capacidad

- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad. Las capturas de la verificación visual, fuera de git (el scratchpad de la sesión o `%TEMP%`) hasta la validación. La sesión de la aplicación, en la ruta que declara `§Frontend`, ignorada por git. Con qué se verifica el frontend, en `§Frontend` de `tech-stack.md`.
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case. El contenido de los documentos sigue en castellano.
- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución; el diseño por secciones, desde 4 tasks previstas, con secciones de unas frases a ~250 palabras; el tope de palabras propuesto en una spec es lo medido más lo previsto más un 2 %, con un mínimo de 20 palabras.
- **Avisos**: cada cambio de paso dice en llano qué se hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará si lanza subagentes o sujetos. Sin detector declarado, la presentación lleva «composición no medida: `tech-stack.md` no declara detector en §Frontend».
- **Regla ante conflicto**: `§Frontend` gana sobre los valores por defecto de la verificación (viewports), y la pantalla de referencia que nombra la task gana sobre la de `§Frontend`. El gate de cierre del plan se toma de `operations.md` §Testing; sin él, de `tech-stack.md` §Testing; sin ninguno, de la constitution.
