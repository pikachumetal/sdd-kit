# Capacidad — control-profiles

## Propósito

Cuánto para el agente a esperar al dev: perfiles de control, gates, desvío, aprobación, validación diferida y política de merge. La tabla que aplican las skills vive en `skills/sdd-propose/references/control-profiles.md`.

## Requisitos

### El perfil de control decide dónde para el agente

- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una feature
- THEN para en estos puntos y en ningún otro: `pair` en el arranque, la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en el arranque, la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND el arranque para solo con la pregunta del carril de patch, lite y config, o con la de partir una feature grande; en full y spike sin partir, `sdd-propose` anuncia y sigue
- AND en `pair` se confirman siempre las acciones hacia fuera (push, PR, publicar); en `delegate` y `unattended` también, salvo el push de la rama de integración tras el merge del cierre cuando `merge.push` es `true`; en los tres, el merge a `main` y el tag los decide una persona

### La primera pregunta confirma carril, modo y perfil

- GIVEN un cambio que arranca con usuario presente
- WHEN `sdd-propose` termina de clasificar
- THEN en full y spike no pregunta: anuncia carril, perfil vigente y de qué nivel sale, avisa de cada clave de `sdd-kit.local.json` que ignora, y sigue
- AND en patch, lite y config pregunta, sola, el carril con su 🦆, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta feature
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, el anuncio o la pregunta toman esa fila como enunciado
- AND en `pair` y `delegate`, el anuncio de full y spike dice las frases con las que el dev-lead aprueba la spec por delegación («apruebo la spec por delegación, nos vemos en la validación»), con la sesión en el modelo más capaz y más de una task prevista su variante «…y paras antes de la Task 1 para que baje la sesión a gama media», y cambia el perfil para esta feature («perfil pair para esta feature»); la pregunta de lite las lleva como opciones
- AND si el dev-lead dice o elige la variante, el agente escribe el plan, junta la apertura en su commit y para antes de la Task 1, sea cual sea el método

### La spec aprobada por delegación en la primera pregunta no para

- GIVEN el usuario eligió la opción que aprueba la spec por delegación en la pregunta de `sdd-propose`, o escribió la frase «apruebo la spec por delegación»
- WHEN la spec está escrita y repasada
- THEN el agente la aprueba sin parar, registra la frase literal y la fecha en «Decisiones tomadas con el dev-lead» y en «Aprobaciones», decide él la review de spec y la registra, y sigue
- AND el resto de paradas del perfil vigente sigue igual: la validación final no se quita nunca

### La primera pregunta propone partir una feature grande

- GIVEN una feature cuyo enunciado, leído con el código que toca, prevé más de 5 tasks internas en el plan, o 4 o 5 que tocan capacidades o superficies distintas (BD, UI, API) o alguna con migración
- WHEN `sdd-propose` termina de clasificar
- THEN pregunta si partirla en features con fila propia en el roadmap, con la partición y el motivo, como opción recomendada junto a seguir entera, aunque el carril sea full
- AND en `pair` y `delegate`, la misma llamada ofrece aprobar la spec por delegación y, con la sesión en el modelo más capaz, su variante de parar antes de la Task 1 para bajar la sesión a gama media
- AND con 3 tasks o menos no lo propone; con 4 o 5 de la misma superficie y sin migración, tampoco, y dice el recuento
- AND el usuario decide; si sigue entera, no se vuelve a proponer en esa feature

### Una respuesta cuenta como aprobación solo si aprueba

- GIVEN un gate de aprobación (spec, plan en `pair`, enmienda)
- WHEN el usuario responde
- THEN cuenta como aprobación un «sí» o un «apruebo» a la pregunta del gate, o elegir una opción cuyo texto diga que aprueba
- AND elegir un alcance o responder a otra pregunta no aprueba: el agente pregunta la aprobación en una línea

### Un cambio a la spec aprobada es un desvío

- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- AND en `pair` y `delegate`, si la corrección cambia el delta —un requisito, un GIVEN, un WHEN o un THEN, también el que pide la revisión final—, antes de parar despacha un revisor de spec en `sonnet` con los siete puntos de `sdd-spec-review`, y su ✋ trae sus hallazgos; también después de la re-revisión única, porque lee la spec y no un commit de código
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x), o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, el «Toca:» o la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente
- AND en `pair` y `delegate`, un AND o un THEN de una ronda de REFACTOR o de fix que solo aplica, literal, una línea de «Decisiones tomadas con el dev-lead» de la spec no para: se escribe en su sitio con su línea de `## Enmiendas` marcada `sin aprobar`, se commitea con la ronda y se nombra en ✋; un valor, un caso o un texto que esa línea no dice para como desvío
- AND un punto del Scope marcado «si el RED lo exhibe», con RED limpio 3 de 3, sale con un `Ruling:` y sin parar; con menos sujetos, no sale
- AND un punto del Scope sin esa marca, con RED limpio, es un desvío: para con la medida en la pregunta, y ni lo saca ni escribe su guía

### Salir del plan es un ruling visible

- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso; si no queda ninguna, de la revisión final de rama; y si la revisión final ya volvió, del cierre de la revisión de [`verification`](verification.md): la única re-revisión o, si ya salió, `sin revisar` en ✋
- AND un commit del hilo que cambia menos de 20 líneas (añadidas más borradas, `git diff --numstat`; en un merge, las de `git show --remerge-diff`) y en el que todo lo que cambia es documentación o comentarios —ficheros bajo `.docs/`, `*.md` de cualquier ruta y líneas de comentario del código— no despacha revisor: el hilo lee el diff y lo anota en «✋ Me salí del plan en…» como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND un `.md` que un agente o un programa lee como instrucciones o como plantilla, un comentario que una herramienta interpreta (`eslint-disable`) y cualquier otra línea, también un diccionario del corrector, despachan revisor
- AND la pasada de fix de la propia revisión final entra en esa re-revisión, con los dos métodos
- AND la presentación de la validación abre con el 🦆 y el bloque «✋ Me salí del plan en…», separado del resto de decisiones

### El tercer fix descubierto abre un checkpoint de alcance

- GIVEN una feature en ejecución con dos fixes descubiertos ya registrados (en «Fixes adicionales» de `tasks.md` o como ruling de fix)
- WHEN aparece un tercer defecto fuera del plan, y después cada tercero (6.º, 9.º…)
- THEN antes de arreglarlo o diferirlo, en `pair` y `delegate` el agente para y pregunta con tres opciones: seguir en esta feature, diferir a otra feature (fila en el roadmap) o partir la feature
- AND en `unattended` lo difiere a una fila nueva del roadmap, lo registra como enmienda sin aprobar y sigue

### Una decisión que cambia la salida observable se pregunta

- GIVEN una decisión de ejecución que la spec no fija y que cambia lo que ve o recibe quien usa el producto: la respuesta de una API o de una CLI, el texto o el flujo de una UI, los ficheros generados o los nombres públicos
- WHEN el agente o un subagente la tiene que tomar
- THEN en `pair` y `delegate` el agente para, la pregunta con sus opciones antes de despachar y no la registra como ruling; la respuesta entra en `## Enmiendas`
- AND en `unattended` elige la opción que deja la salida como la describe la spec o, si la spec calla, como está hoy, y la registra como enmienda sin aprobar

### La fila de la feature se compara con la base antes de cada despacho

- GIVEN una feature en ejecución con su fila en el roadmap
- WHEN el agente va a despachar la siguiente task del plan
- THEN compara la fila en la base de la rama (`git merge-base`) con la fila en la rama de integración
- AND si cambió, lo trata como posible desvío: en `pair` y `delegate` presenta el cambio y para; en `unattended` sigue con la spec aprobada y registra la fila nueva como enmienda sin aprobar

### Los ficheros de la task se cruzan con la base antes de cada despacho

- GIVEN una feature en ejecución y la siguiente task del plan con ficheros en «Crear» o «Modificar»
- WHEN el agente va a despacharla, antes de escribir sus tests RED
- THEN cruza `git diff --name-only $(git merge-base HEAD <integración>) <integración>` (y `origin/<integración>` tras `git fetch` si hay remoto) con esos ficheros
- AND si alguno coincide, compara `git diff -U0` de la base con las líneas que la task va a tocar
- AND si la task solo toca la línea de `libres` de `README.md` y la base cambia «Soporte», registra un ruling con los dos tramos y sigue, sin parar
- AND si la base cambia esa misma línea y la spec declara ese solape con fichero y región, registra un ruling con los dos tramos y sigue
- AND si la base cambia esa misma línea sin que la spec lo declare, o el plan no deja saber qué líneas toca la task, es freno de alcance: en `pair` y `delegate` nombra los ficheros, los commits y los tramos («la base cambia las líneas 11-11; la task toca la 11») y para; en `unattended` sigue y lo registra como enmienda sin aprobar

### La validación puede diferirse con condiciones

- GIVEN una feature o un patch verificados por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una feature o un patch en `unattended`; en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <feature, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅; en un patch, la línea va en `patch.md` §4, debajo de la tabla, y la fila de la tabla de patches empieza por `🧪 validación diferida a <disparador> — `
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) no hay diferido: la feature o el patch siguen esperando la validación
- AND con la frase y sin disparador, o con uno vago («diferida», «se prueba en uso»), el agente no vuelve a preguntar: concreta el uso más próximo, con quien difiere como dueño (`disparador: la primera exportación del informe mensual, a cargo del dev-lead`), y lo dice en el mensaje de cierre para que lo corrija
- AND la pregunta de validación ofrece diferir con un disparador concreto con dueño que elige el agente («Diferir: lo pruebo en <uso más próximo>, a cargo de <quien valida>»); elegir esa opción, aunque sea sin texto, es la frase literal y el disparador, y el agente no vuelve a preguntar
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** (en un patch, en `patch.md` §4) y pasa la fila a ✅ (en un patch, quita el prefijo 🧪)
- AND si la fila ya salió en el corte de una release (el dev-lead dice «probé la 0022, va bien» y `### v1.3.0 — 2026-10-05` tiene `validaciones pendientes: 0022, 0025`), el agente añade la misma adenda y quita el id de esa línea (`validaciones pendientes: 0025`); si queda vacía, borra la línea

### Con `validation.mode: field`, la validación es en campo

- GIVEN un proyecto con `"validation":{"mode":"field"}` en `.docs/sdd/sdd-kit.json` y la feature 0030 con el cierre de su revisión final terminado, su smoke por THEN y la suite en verde, en cualquier perfil
- WHEN el agente llega a la validación (el paso de validación de `sdd-archive`), o cierra el patch 0031 con `sdd-archive`
- THEN no pregunta qué ha probado el usuario ni ofrece diferir, y sigue con el cierre sin parar
- AND el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación en campo: <fecha> · <verificación del agente>`, con la evidencia que ejecutó (p. ej. `suite 412/412 en 96 s · smoke 5/5 THEN con ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia`)
- AND con un `sin revisar` o un «no verificado» sin resolver, esa línea no dice «limpia»: dice cuántos quedan (`…, re-revisión limpia, 1 sin revisar`)
- AND la fila de la 0030 en el roadmap queda ✅, y la del patch 0031 en «Patches» no lleva el prefijo 🧪 ni tiene fila en la tabla de la release abierta
- AND sin la clave, o con `"mode":"manual"`, la validación es la de hoy: para en `pair` y `delegate` y se difiere al smoke de la release en `unattended`

### En `unattended`, lo que falta aparca la feature

- GIVEN una feature en `unattended`
- WHEN una pregunta de la entrevista no tiene respuesta en los documentos del proyecto
- THEN la feature queda `⏸️ aparcada: <pregunta>` en el roadmap y el agente sigue con la siguiente feature de la release
- AND al terminar la release entrega un solo informe: features cerradas, decisiones, enmiendas sin aprobar y features aparcadas

### El cierre acaba con una línea de terminado

- GIVEN un cierre de feature o de patch con `sdd-archive` que ha recorrido su checklist
- WHEN el agente escribe su último mensaje
- THEN el mensaje nombra, si los hay, el disparador que concretó el agente, las decisiones tomadas sin el dev-lead que registra el walkthrough (o el `patch.md`), cada instrucción que el dev-lead dio antes del cierre y cómo quedó, lo pendiente y lo que falta de su familia; y ofrece el ticket del kit si toca
- AND su última línea es la de terminado: si la rama está fusionada en `merge.into` y no quedan cambios sin commitear del propio cambio, dice rama, destino, hash, estado del push (hecho, no hecho y por qué) y que se puede borrar el worktree, con su ruta; si no, dice «No terminado», qué falta y que el worktree no se borra todavía
- AND el ticket del kit no cuenta para esa línea: con la 0081 fusionada y empujada y su ticket todavía por escribir, la línea es `**Terminado.**` y no «No terminado. Falta el ticket»
- AND con el merge o el push denegados o fallidos, sus bloques de evidencia van antes, y la línea de terminado sigue siendo la última: «No terminado» si falta el merge; con el merge hecho y el push fallido, dice «push no hecho» y el motivo
- AND solo se ofrece borrar un worktree enlazado: si la rama está en el checkout principal del repo, la línea acaba en el push, sin cláusula de borrado
- AND si el dev-lead acepta el ticket después de esa línea, el ticket va adonde lo mandan las instrucciones del proyecto (`CLAUDE.md`, `AGENTS.md`); sin ellas, se commitea en la rama y se fusiona con `sdd merge`, y el mensaje que lo escribe acaba otra vez con la línea de terminado, con el hash del nuevo merge; el ticket nunca la vuelve «No terminado»

### El método de ejecución lo elige el handoff del plan

- GIVEN una feature en modo full con la spec aprobada, `execution` ausente o `auto` en `sdd-kit.json` y sin `native` ni `subagent` en `sdd-kit.local.json`, o `execution: auto` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN en `delegate` y `unattended` no para: toma el método que recomienda el handoff y lo escribe en la cabecera del plan como `Ejecución: <native | subagent>, porque <motivo>`, y el motivo pesa por su nombre la dependencia entre las interfaces de las tasks, cuántas son, el coste de un error que llegue a la rama y si el plan cabe en un contexto, sin umbral numérico (`Ejecución: native, porque 3 tasks encadenadas por la interfaz de Ledger, un error lo caza el test de su task y el plan cabe en un contexto`)
- AND en `pair` la parada del plan es una sola pregunta que aprueba el plan y elige el método, con la recomendación del handoff como primera opción; no hay una parada aparte para el método
- AND ninguna task del plan lleva un campo `Ejecución` propio: el método es del plan entero, salvo el cambio a SDD tras una compactación

### Un método fijado en `sdd-kit.json` no se pregunta

- GIVEN una feature en modo full con la spec aprobada, `execution: native` o `execution: subagent` en `sdd-kit.json` y sin `execution` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.json` y no pregunta el método en ningún perfil
- AND el valor fijado manda aunque el handoff recomiende el otro método
- AND en `pair` la parada del plan solo pide aprobarlo

### Tras una compactación, lo que queda de un plan Native va con SDD

- GIVEN un plan con `Ejecución: native` (recomendado por el handoff o fijado en `sdd-kit.json`), una sesión retomada tras una compactación y dos o más tasks sin su línea `complete` en el ledger
- WHEN el hilo retoma la ejecución
- THEN invoca `sdd-implement-subagent` con `Skill` y sigue con SDD sobre el mismo ledger, y lo registra como `Task <N>: Ruling: compactación — sigo con SDD — quedan <k> tasks`, sin parar en `delegate` ni en `unattended`
- AND con una sola task pendiente sigue en Native y lo registra como `Task <N>: Ruling: compactación — sigo con Native — queda 1 task`; sin compactación, sigue en Native sin línea

### El perfil se hereda de la feature, de la persona, de la release o del proyecto

- GIVEN un perfil en el `profile:` de la spec, `control.profile` en `.docs/sdd/sdd-kit.local.json`, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap (en `ROADMAP.md`, entre `## Now` y su tabla) o `control.profile` en `sdd-kit.json`
- WHEN el agente determina el perfil vigente
- THEN manda la feature sobre la persona, la persona sobre la release y la release sobre el proyecto; una spec sin `profile:` hereda
- AND el anuncio o la pregunta del carril de `sdd-propose` nombran el perfil vigente y de qué nivel sale
- AND el agente solo escribe un `profile`, un `control.*`, un `merge` o un `validation.mode` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`; en `sdd-kit.local.json`, que no se commitea, basta la respuesta del usuario a `sdd-config`)

### Un método fijado en `sdd-kit.local.json` manda sobre el del proyecto

- GIVEN una feature en modo full con la spec aprobada y `execution: native` o `execution: subagent` en `.docs/sdd/sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.local.json` y no pregunta el método en ningún perfil, aunque `sdd-kit.json` diga otro valor
- AND un método que el dev-lead nombra para la feature manda sobre los dos ficheros
- AND un `execution: auto` en `sdd-kit.local.json` también cuenta: el método lo recomienda el handoff aunque `sdd-kit.json` fije `native` o `subagent`

### La spec dice quién valida

- GIVEN una spec o un `patch.md` con la línea `Validación: agente — solo fija Node 22 en package.json y .nvmrc` y un proyecto con `validation.mode` `manual`
- WHEN el agente cierra
- THEN no presenta guion ni espera validación, y el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación por el agente: <fecha> · <evidencia>`, con el smoke y la suite que ejecutó
- AND la fila del roadmap queda ✅
- AND sin la línea, o con `Validación: dev-lead`, valida el dev-lead
- AND con la spec aprobada por delegación o en `unattended`, `agente` solo vale si la frase del dev-lead lo nombra; en un patch, solo con su frase literal en la petición o en la pregunta del carril
- AND si al implementar aparece algo visible para el usuario, la línea vuelve a `dev-lead` como desvío
- AND con `validation.mode: field`, el registro es `Validación en campo:`

### La parada sobre una copia abre con el commit del kit que la cambió

- GIVEN un freno de alcance en `delegate` sobre un bloque de `skills/sdd-x/references/foo-prompt.md`, que `upstream.json` clasifica como copia, con la marca `<!-- kit: a1b2c3d · sustituye: «S» -->`, y `a1b2c3d` el commit `feat(skills): el encargo sale del recuadro sangrado del original (feature 0042)`
- WHEN el agente para
- THEN el ✋ de la parada abre con la línea `Copia: a1b2c3d feat(skills): el encargo sale del recuadro sangrado del original (feature 0042)`: `Copia:` y la salida literal de `git log -1 --format='%h %s' a1b2c3d`
- AND con un desvío sobre una copia, igual
- AND con la marca `<!-- kit: 0042 · sustituye: «S» -->`, que lleva la tarea y no el commit, la línea es `Copia:` y la salida de `git log -S 'S' --reverse --format='%h %s' -- skills/sdd-x/references/foo-prompt.md`, su primera línea; si no da ninguna, `Copia: no encuentro el commit del kit que lo cambió`

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge` con `merge.push` opcional, y `execution`); las preferencias de cada persona, en `.docs/sdd/sdd-kit.local.json` (`control.profile`, `execution`, `validation.startEnvironment`), fuera de git; el perfil de la feature, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap (en `ROADMAP.md`, entre `## Now` y su tabla); los ficheros que prevé tocar una feature abierta, en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x); el método de un plan, en la línea `Ejecución:` de su cabecera.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como `ids.mode`; valores de perfil `pair`, `delegate`, `unattended`; valores de `execution`: `auto`, `native`, `subagent`; estados del roadmap, conjunto cerrado: `⏳` · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`.
- **Límites**: `control.maxParallelAgents` 3 por defecto; su conducta la aplica `sdd-parallel-agents` (requisito «Dos revisores de spec se despachan con `sdd-parallel-agents`» de `feature-flow`). `control.silence` 8 y 20 minutos por defecto: 20 (`longCommandMinutes`) si la llamada que espera el subagente es un comando de shell o si se vigila la salida de una verificación lenta, y 8 (`betweenStepsMinutes`) en cualquier otra espera; un subagente colgado se relanza una sola vez (requisitos de `feature-flow`). Umbral para proponer partir una feature: más de 5 tasks internas previstas, o 4 o 5 que tocan capacidades o superficies distintas o llevan migración; con 3 o menos, nunca. Checkpoint de alcance: en el 3.º fix descubierto de una feature y en cada tercero después. `sdd merge`: 3 intentos como máximo entre la verificación y la publicación cuando la rama destino cambia, al fusionar o al empujar; el push de un hotfix, uno.
- **Avisos**: la línea de terminado, última del mensaje final de cada cierre (rama, destino, hash, estado del push y ruta del worktree que se puede borrar, o «No terminado» y qué falta); el bloque de un push fallido (comando literal y error); `Push relanzado por HTTPS: Permission denied (publickey) por SSH`, tras el relanzamiento que publica; el aviso de cada clave de `sdd-kit.local.json` que el agente ignora, en el anuncio o en la pregunta del carril de `sdd-propose`; y, en la parada sobre una copia, la primera línea de su ✋: `Copia: <sha7> <asunto del commit>` (la salida de `git log -1 --format='%h %s'`) o `Copia: no encuentro el commit del kit que lo cambió`.
- **Regla ante conflicto**: el perfil sigue feature → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la feature → persona → proyecto, sin nivel de release, y un valor fijado manda sobre la recomendación del handoff; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el clasificador del harness, un hook o el remoto rechazan no se reintenta: lo desbloquea una persona. Un push cuya clave SSH falla (`Permission denied (publickey)`) con sesión en `gh` se relanza una vez por HTTPS con el token de `gh`, solo en el entorno de esa orden; si vuelve a fallar, cuenta como rechazado. Un conflicto de merge en el que los dos lados cambian lo mismo lo resuelve una persona: `sdd merge` solo resuelve, en este orden, el `estimation-log.md` (regenerado), los registros por id, los trozos que solo añaden y lo que Mergiraf resuelva con código 0. La excepción es Mergiraf, solo fuera de `.docs/` y de `*.md`: une cambios compatibles de los dos lados en la misma construcción (`{ a, b }` + `{ a, c }` → `{ a, b, c }`), y la verificación que corre sobre el resultado decide (dev-lead, 2026-10-19).
