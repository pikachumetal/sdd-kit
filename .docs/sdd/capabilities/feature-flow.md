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

### El trabajo se valida con el usuario antes de cerrar

- GIVEN una feature con las tasks acabadas, el gate en verde, el guion recorrido por el agente y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave, y una spec sin `Validación: agente`
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-archive` presenta el mensaje de `validation-template.md`, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el smoke que ejecutó y el guion de pruebas, el último, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, compuestos y ensayados como dice «El guion de la validación empieza por el reporte y lo ha corrido el agente» de [`archive`](archive.md). Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó el gate de cierre
- AND «validado» o un «sí» sin detalle a la pregunta de validación es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN, el gate y el guion recorrido por el agente se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

### El walkthrough crece por adendas

- GIVEN una feature cerrada con walkthrough
- WHEN algo cambia después del cierre (validación tardía, integración con otra feature)
- THEN se añade una entrada fechada en `## 6. Adendas` y el cuerpo no se reescribe

### Un documento de anclaje que falta se calca de su plantilla

- GIVEN un proyecto al que le falta un documento de anclaje con plantilla en `sdd-templates`
- WHEN una feature, un cierre o una consulta lo tiene que crear
- THEN el documento sigue las secciones de su plantilla, sin secciones inventadas ni omitidas (las vacías llevan su marcador)

### La spec se repasa antes del gate

- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina `spec.md` y entra en `sdd-spec-approval`, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»
- AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca en todo el repo con `git grep`, salvo las carpetas de evidencia, cada forma del literal —la cadena y su valor suelto—, y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con `"base": "."` pasado a `"./out"` en `config.json`, el `toBe('.')` de `test/config.test.js` sale en esa sección, aunque no esté en `capabilities/`, en los documentos ni en `skills/`
- AND con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- AND cada caso real que la spec cita (un `fichero:línea`, un sha) se pasa por el THEN que lo debe atrapar: con un THEN que solo rechaza importes negativos y un caso citado, `src/invoice.js:42`, que es un importe cero, el agente cambia el THEN o lo señala antes del gate
- AND cada recuento de una comprobación que la spec fija se pasa por lo que da correrla, sobre el texto de hoy o sobre una copia con el cambio hecho, y si no se puede correr antes del gate va al ✋ como `sin medir`: con «lint da exactamente una línea» y un lint que, corrido sobre la copia con el texto movido, da tres, el agente corrige el recuento o lo señala antes del gate
- AND al retirar algo con pasos numerados busca también esos pasos: con una skill retirada cuyo «paso 3» citan dos requisitos sin nombrarla, los dos salen en esa sección con su destino
- AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con `git grep -n 0009`», y no se borra con los bloques de ayuda
- AND antes del gate ejecuta `sdd capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, corrige en la spec lo que rechace y escribe la línea del resultado en «Decisiones que he tomado yo»; la `capabilities/` del repo no cambia

### Cada cambio de paso lleva un aviso en llano

- GIVEN una feature en curso con `sdd-propose`, `sdd-spec-writing`, `sdd-spec-approval`, `sdd-spec-review`, `sdd-plan-writing` o `sdd-implement`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

### Una decisión del dev-lead que sale de la revisión final se pregunta sola

- GIVEN la revisión final de rama con un hallazgo cuya resolución es del dev-lead
- WHEN el agente llega a la validación de `sdd-validate`
- THEN pregunta esa decisión sola, en su propio turno, y presenta la validación después de la respuesta
- AND no la resuelve por defecto ni la mete en el mensaje de la validación

### Los minors diferidos llegan al walkthrough

- GIVEN una feature Native con líneas `Final: minor (deferred)` en el ledger
- WHEN se escribe el walkthrough
- THEN «Decisiones tomadas sin el dev-lead» lleva las líneas `Ruling:` y `minor (deferred)` que da `sdd ledger rulings`, ejecutado antes de que el workspace se borre

### El gate del plan en `pair` ofrece parar para bajar la sesión a gama media

- GIVEN una feature en `pair`, una sesión con Opus 5.5 y un plan de dos o más tasks con `Ejecución: native, porque…`
- WHEN el agente presenta el gate del plan
- THEN entre las opciones está «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media (quedan 3 tasks)», con las tasks del plan, que no es la recomendada, con su motivo: Native va bien en gama media (Sonnet, effort medium) y bajar solo el effort de Opus no es gama media
- AND si el usuario la elige, el agente junta la apertura en su commit y termina el turno antes de la Task 1 diciendo el cambio (`/model`, Sonnet con effort medium)
- AND con un plan de una sola task no la ofrece

### El gate de la spec en `delegate` ofrece parar tras el plan para bajar la sesión a gama media

- GIVEN una feature en `delegate`, una sesión con Opus 5.5 y la spec lista para el gate, con dos o más tasks previstas
- WHEN el agente presenta la spec
- THEN entre las opciones numeradas está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media (prevé 3 tasks)», con las tasks previstas, que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy
- AND con una sola task prevista no la ofrece

### Con Native, el plan registra el modelo recomendado para la sesión

- GIVEN un plan cuyo método es Native
- WHEN el agente escribe su línea `Ejecución`
- THEN la línea lleva, literal, «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.»

### La carpeta de una feature nueva lleva `-feature-`

- GIVEN un proyecto en modo `sequence` con la fila 0081 «Avisos de reserva» pendiente en el roadmap
- WHEN `sdd-propose` crea la carpeta de la spec el 2026-10-01 a las 09:15:00 UTC
- THEN la carpeta es `.docs/sdd/changes/20261001-091500-feature-0081-booking-reminders/`
- AND el frontmatter de `spec.md` lleva `id: 20261001-091500-feature-0081-booking-reminders` y `feature: 0081`

### El guion de pruebas empieza con el entorno parado, salvo que la persona lo quiera arrancado

- GIVEN la validación de `sdd-validate` de la feature 0012, con la web levantada por el agente en el puerto 4656
- WHEN el agente presenta el guion de pruebas sin `validation.startEnvironment` en `.docs/sdd/sdd-kit.local.json`, o con `false`
- THEN antes de presentarlo ha parado lo que arrancó, y el guion empieza por cómo arrancarla
- AND con `validation.startEnvironment: true`, la deja arrancada, y el guion dice en qué puerto está y cómo pararla
- AND con `validation.startEnvironment: true` y el entorno sin levantar (el gate de cierre `node --test test/` no lo arranca), lo levanta antes del guion con `env:setup` de `## Entornos` de `operations.md` si la sección existe, o si no con «Arrancar» (`node scripts/env-up.mjs`), comprueba que responde, y el guion abre con su puerto y cómo pararlo (`node scripts/env-down.mjs`)
- AND sin «Arrancar» ni `## Entornos` en `operations.md`, el guion dice que no hay comando de arranque declarado y empieza por cómo arrancarla

### Un THEN que solo se observa con la base al día declara cómo se valida

- GIVEN la fila 0012 «`npm run check:changed` … si la rama no cambia ninguno, escribe «Nada que comprobar» y sale con 0», cuyo THEN negativo no se puede observar desde `feature/0012`, porque la rama siempre cambia `scripts/check-changed.mjs`
- WHEN el agente escribe la spec
- THEN bajo ese escenario escribe `Se valida en: worktree con la base al día` (o `validación post-merge con fecha`)
- AND en la validación de `sdd-validate` prepara ese entorno y lo da en el guion, en vez de pedir al usuario que se lo monte

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

- GIVEN `sdd-spec-writing`, con el diseño de una feature que cambia lo que ve el usuario
- WHEN el agente necesita una decisión del usuario
- THEN la pregunta sigue `sdd-grilling` ([`interviewing`](interviewing.md)): una por turno, en texto con el formato fijo, con escena concreta si es de producto
- AND la spec se escribe en la skill `sdd-spec-writing`, se repasa y se aprueba en `sdd-spec-approval`, su review va en `sdd-spec-review` y el plan en `sdd-plan-writing`, cada una invocada con `Skill` por la anterior, sin invocar `superpowers:brainstorming` ni `superpowers:writing-plans`
- AND `sdd-spec-review` devuelve los hallazgos y no aprueba ni edita la spec: los incorpora `sdd-spec-approval`

### La spec dice dónde se prueba cada comportamiento

- GIVEN una feature que añade cancelar una reserva por el endpoint y por la pantalla, en un proyecto cuyos tests de reservas van contra el endpoint
- WHEN el agente escribe la spec
- THEN la sección «Dónde se prueba» dice «cancelar reserva: por el endpoint, como los tests de reservas actuales; la pantalla, con una captura»
- AND si el proyecto ya tiene `ReservationServiceTests`, unitario, y la regla de cancelar la ve ese nivel, la línea nombra `ReservationServiceTests`, no el endpoint
- AND con «Camino crítico: `moon run root:critical-path` · cubre `backend:test`, `frontend:e2e`» en `operations.md`, cada test de esas suites que nombra la línea dice «de feature, se borra al cerrar» o «fila propuesta: <criterio>», y cada fila propuesta está también en el ✋

### La pregunta del gate de la spec lleva opciones fijas

- GIVEN una feature en `pair` o `delegate`, con la spec lista para el gate
- WHEN el agente presenta la spec
- THEN la pregunta del gate va en prosa al final del mensaje, con las opciones numeradas y, al menos, «Apruebo (Recomendada)», la primera, y «Cambios»
- AND el turno acaba ahí: no llama a `AskUserQuestion`, cuyo diálogo tapa el mensaje, ni implementa

### El gate de cierre del plan sale de `operations.md`

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`» y sin script `test` en `package.json`
- WHEN `sdd-plan-writing` escribe el plan
- THEN la línea del gate de cierre de §3 dice `node --test`, literal
- AND sin `steering/operations.md`, toma el de la constitution; y si no hay ninguno, escribe `no declarado` y lo apunta en las decisiones del plan, sin inventar un comando como `npm test`

### `sdd-propose` entrega el cambio a la skill que lo sigue

- GIVEN la feature 0010 en `delegate`, con la spec aprobada y el plan escrito por `sdd-plan-writing`
- WHEN `sdd-plan-writing` termina el plan
- THEN invoca `sdd-implement`, que sigue desde la implementación leyendo `mode` y `profile` del frontmatter de `spec.md`, la línea `Ejecución` del plan y la rama
- AND en lite, `sdd-spec-approval` la invoca con la spec aprobada; en patch, `sdd-propose` invoca `sdd-implement` con la clase del patch y la estimación de la pregunta; en feature, lite y spike, `sdd-propose` invoca `sdd-spec-writing` tras el anuncio o la pregunta del carril
- AND si se invoca `sdd-implement` sin una `spec.md` aprobada en la rama, manda a `sdd-propose`

### Una feature grande devuelve el diseño por secciones antes de la spec

- GIVEN la feature 0012 en `pair`, con 5 tasks previstas en el recuento de `sdd-propose` y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes dice los enfoques en un mensaje propio —dos o tres maneras de construirlo, con lo que cuesta cada una y la que recomienda— y, elegido uno, presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND lo que el agente rellenó sin que el usuario lo dijera va en la sección como su propuesta, con su motivo
- AND el recuento es el de la feature que se especifica, hecho al entrar en `sdd-spec-writing`: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike, escribe la spec sin secciones y la presenta en el gate
- AND en `delegate` no hay mensaje de los enfoques: los enfoques, con su coste y el porqué del elegido, van al Approach de la spec, y «✋ Decisiones que he tomado yo» nombra el elegido y los descartados («Enfoque: A, frente a B y C (ver Approach)») y lleva las secciones; la parada de la spec los aprueba, sin un turno por enfoque ni por sección; con el montón del dev-lead vacío, el mensaje de los montones nombra el enfoque elegido en una línea con el diseño corto, y esa es la única confirmación antes de `spec.md`
- AND en `pair`, con el montón del dev-lead vacío, el mensaje de los montones es el mensaje de los enfoques: los lleva enteros y pregunta cuál; no hay un mensaje de enfoques aparte
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones ni mensaje de enfoques: los enfoques van al Approach de la spec y lo que habría preguntado, a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás

### Pedir empezar ya no se lleva la spec

- GIVEN una feature en `sdd-spec-writing`
- WHEN el agente pregunta al usuario
- THEN no le ofrece saltarse las preguntas
- AND si el usuario pide empezar ya, el agente escribe `spec.md` con lo que hay, con los huecos en «✋ Decisiones que he tomado yo», y la spec pasa por su gate

### La spec mide el margen de palabras de lo que edita

- GIVEN un proyecto con topes de palabras (`cli/test/kit/word-budget.test.ts` con `'sdd-propose': { skillMd: 5000, total: 6325 }`) y una spec que edita `sdd-propose`, medido en 4.908 y 6.324
- WHEN el agente escribe la spec
- THEN la sección «Topes de palabras» lleva una fila por skill o documento con tope que la spec edita, con lo medido, el tope, el margen y el tope propuesto: `sdd-propose · 4.908 / 5.000 y 6.324 / 6.325 · 92 y 1 · 5.200 / 6.700`
- AND el tope propuesto es lo medido más lo previsto más un 2 % (mínimo 20 palabras) para la pasada de fix, y el gate lo aprueba como decisión del dev-lead
- AND lo previsto lleva el comando que contó lo que entra y sale, con el conteo del test, y su cifra: +40 (`echo "<texto que entra>" | wc -w` → 40); o `sin medir`, y entonces la fila va también al ✋ y su tope propuesto es «sin cambio» hasta la medida
- AND el de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más margen
- AND si durante la feature se recorta texto para caber, el recorte es una edición de skill: si quita una instrucción, lleva su RED
- AND sin topes en el proyecto, la sección no se escribe

### La política de modelos de la spec vale como confirmación de paralelizar

- GIVEN una feature en `delegate`, con la spec aprobada y la línea `Política de modelos: revisores de la spec dominio opus + técnica sonnet · ejes de la revisión final Spec opus+high, Código sonnet+high · en paralelo hasta control.maxParallelAgents`, y unas instrucciones del usuario que piden confirmar antes de paralelizar
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

### La fila de «Aprobaciones» dice quién y cómo aprobó

- GIVEN una spec calcada de `spec-template.md` y aprobada por Ana con la opción «Apruebo (Recomendada)» de la pregunta del gate el 2026-10-18
- WHEN el agente registra la aprobación
- THEN la tabla «Aprobaciones» tiene las columnas `Nombre | Fecha | Estado`, sin «Rol», y la fila dice `Ana | 2026-10-18 | aprobada (opción «Apruebo»)`
- AND si Ana escribe «sí, adelante», el Estado es `aprobada: «sí, adelante»`
- AND el frontmatter `approvers` lleva `name` y `approved_at`, sin `role`

### La spec que edita una skill con sujetos prevé su coste

- GIVEN un repo con `tests/batteries/aviso-cierre/`, `steering/operations.md` con «un sujeto de `aviso-cierre` cuesta ~0,70 $» y con la previsión de una tanda en `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs <battery.md>`, y una spec que edita `skills/aviso-cierre/SKILL.md`
- WHEN el agente escribe la spec
- THEN «Previsión de coste» lleva las filas RED, GREEN, una tanda de REFACTOR, controles y medición tras la revisión final, cada una con sus sujetos y sus dólares
- AND cada fila cita la línea `suma: <n> sujetos · coste previsto: <x> $` del comando de previsión para sus escenarios y su n, y el total es la suma de las filas
- AND con un `steering/operations.md` que no nombra comando de previsión, cada cifra cita su batería y el precio por sujeto de `steering/operations.md`
- AND una spec que no edita una skill probada con sujetos no lleva la sección

### El guion arranca por el entorno y acaba en texto

- GIVEN la 0010, con servidor en `node scripts/env-up.mjs` y parada en `node scripts/env-down.mjs`, lista para validar en `validation.mode` `manual`
- WHEN el agente presenta la validación
- THEN el guion es lo último del mensaje y empieza por la rama, el worktree y el entorno, con un bloque de código sin lenguaje por terminal y cada comando en su línea, sin puntuación al final
- AND sigue con pasos de uno en uno, con sus datos y su resultado esperado, y acaba con cómo parar el entorno y «dime "validado" o qué paso falla», en texto
- AND con `validation.startEnvironment: true`, el guion dice que el entorno está arrancado, con su puerto, en vez de dar los comandos de arranque

### El Scope marca lo condicionado al RED

- GIVEN una spec que edita una skill, con el frente «la nota sin fecha» que viene de un ticket y aún no se ha medido
- WHEN el agente escribe el Scope antes de medirlo
- THEN el frente va en una línea `Entra, si el RED lo exhibe:`, separada de los `Entra:`

### La spec guarda sus enfoques en el Approach

- GIVEN la feature 0013 de `reservas`, en `delegate`, con la entrevista hecha
- WHEN el agente escribe `spec.md`
- THEN su `## Approach` lleva dos o tres enfoques, cada uno con lo que cuesta, y una línea `Elegido: <enfoque> — <porqué>`; con una sola vía sensata, esa y por qué no encajan las otras
- AND en `pair`, los del mensaje de enfoques y el que eligió el dev-lead, con su frase; en `unattended` o tras «empieza ya», los del agente

### La entrevista pregunta solo lo que falta y es del dev-lead

- GIVEN el molde `reservas` en `delegate` y la petición «Arranca este cambio con sdd-propose: avisa cuando una sala esté muy ocupada. Perfil delegate. Escribe la spec y preséntamela.», sin cuándo cuenta una sala como muy ocupada en la petición, en el roadmap ni en el proyecto
- WHEN el agente entra en `sdd-spec-writing`
- THEN termina el turno con una pregunta y sin `spec.md`, y no da por decidido cuándo cuenta una sala como muy ocupada, ni en el texto ni en una spec: preguntar antes el porqué vale
- AND con la petición «Arranca este cambio con sdd-propose, carril feature: un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`, de lunes a domingo y por hora dentro del día; sin reservas responde `sin reservas <sala>`; lo quiere el responsable de sala para revisar su agenda cada mañana. Perfil delegate. Escribe la spec y preséntamela.», termina el turno sin `spec.md`, con los tres montones, el enfoque elegido en una línea y el diseño corto, pidiendo que lo confirme, y sin preguntar nada que la petición ya dice (el formato de línea, el orden de las líneas, el texto sin reservas, para quién es)
- AND con el prompt de arranque «Arranca este cambio con sdd-propose: exportar las reservas de una sala a CSV, porque el responsable las cuadra los lunes en su hoja de cálculo. Abierto: separador de columnas (propuesta: `;`); nombre del fichero de test (propuesta: `test/export.test.js`). Perfil delegate.», antes de escribir `spec.md` en ese turno pregunta solo el separador, citando `;` como propuesta del prompt, y el nombre del fichero de test queda en el montón del dev-lead con su propuesta, para un turno posterior
- AND con el prompt de arranque de `iq5` (petición literal en `tests/batteries/sdd-propose/battery.md`: la forma de `launch-prompt-template.md`, «Decisiones ya tomadas» con dónde sale el aviso y qué se cuenta, y «Está hecho cuando reservar avisa al pasar del umbral», sin el umbral), termina el turno con una pregunta y sin `spec.md`, y no da el umbral por decidido ni en el texto ni en una spec: preguntar antes el porqué vale
- AND con la petición del primer GIVEN, «Escribe la spec y el plan» en vez de «Escribe la spec y preséntamela», más «Apruebo la spec por delegación, nos vemos en la validación», no pregunta ni enseña el mensaje de los montones: escribe `spec.md` con el umbral en «✋ Decisiones que he tomado yo» marcado «pendiente» e invoca `sdd-spec-writing`, `sdd-spec-approval` y `sdd-plan-writing` en ese orden

### La spec se escribe en `sdd-spec-writing`, con los tres montones a la vista

- GIVEN el molde `reservas` en `delegate` y el prompt de arranque de `ss1` (petición literal en `tests/batteries/sdd-propose/battery.md`: la forma de `launch-prompt-template.md`, «Abierto» con dos puntos con su propuesta, un enfoque técnico que obliga a un efecto visible no pedido y una lista de ficheros en «Antes de diseñar, lee»)
- WHEN el agente pasa la clasificación
- THEN invoca `sdd-spec-writing` con `Skill` y, antes de escribir `spec.md`, enseña en un solo mensaje los tres montones —contestado, menor, del dev-lead—, con una línea de porqué por cada punto que no va al del dev-lead
- AND el porqué de cada punto de «contestado» o «menor» cita la línea del prompt, el fichero o la regla de la que sale; «es técnico» o «lo decide el proyecto» sin decir dónde no es porqué
- AND los dos puntos de «Abierto» están en el montón del dev-lead, cada uno con su propuesta citada como «propuesta del prompt», no como decidida, y la primera pregunta es de ese montón, la que más cambia lo demás ([`interviewing`](interviewing.md)): aquí, el orden que sale de `sort()`
- AND el efecto visible que impone el enfoque técnico está en el montón del dev-lead: «lo impone la técnica» no lo saca
- AND el turno termina con esa pregunta y sin `spec.md`

### El plan se escribe en `sdd-plan-writing`

- GIVEN la spec de la 0010 aprobada en modo full, o la del spike 0031
- WHEN se escribe el plan
- THEN la sesión invoca `sdd-plan-writing` con `Skill` antes de escribir `plan.md`
- AND en lite no se invoca: no hay plan

## Reglas de la capacidad

- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad. Las capturas de la verificación visual, fuera de git (el scratchpad de la sesión o `%TEMP%`) hasta la validación. La sesión de la aplicación, en la ruta que declara `§Frontend`, ignorada por git. Con qué se verifica el frontend, en `§Frontend` de `steering/operations.md`.
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case. El contenido de los documentos sigue en castellano.
- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución; el diseño por secciones, desde 4 tasks previstas, con secciones de unas frases a ~250 palabras; el tope de palabras propuesto en una spec es lo medido más lo previsto más un 2 %, con un mínimo de 20 palabras; la review de spec, dos revisores en full, uno con un Scope de menos de ~50 líneas sin contrato público ni `MODIFIED`, uno en lite y uno en patch; la segunda ronda, una sola vez.
- **Avisos**: cada cambio de paso dice en llano qué se hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará si lanza subagentes o sujetos. Sin detector declarado, la presentación lleva «composición no medida: `operations.md` no declara detector en §Frontend».
- **Regla ante conflicto**: `§Frontend` gana sobre los valores por defecto de la verificación (viewports), y la pantalla de referencia que nombra la task gana sobre la de `§Frontend`. El gate de cierre del plan se toma de `steering/operations.md` §Testing; sin él, de la constitution.
