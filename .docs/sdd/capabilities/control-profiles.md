# Capacidad — control-profiles

## Propósito

Cuánto para el agente a esperar al dev: perfiles de control, gates, desvío, aprobación, validación diferida y política de merge. La tabla que aplican las skills vive en `skills/sdd-start-task/references/control-profiles.md`.

## Requisitos

### El perfil de control decide dónde para el agente
- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una task
- THEN para en estos puntos y en ningún otro: `pair` en la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND en `pair` se confirman siempre las acciones hacia fuera (push, PR, publicar); en `delegate` y `unattended` también, salvo el push de la rama de integración tras el merge del cierre cuando `merge.push` es `true`; en los tres, el merge a `main` y el tag los decide una persona

### La primera pregunta confirma carril, modo y perfil
- GIVEN una task que arranca con usuario presente
- WHEN el agente termina de leer el contexto
- THEN su primera pregunta, sola en su turno, confirma carril y modo, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta task
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, la pregunta propone esa fila como enunciado
- AND en `pair` y `delegate`, una de sus opciones aprueba la spec por delegación con la frase «apruebo la spec por delegación, nos vemos en la validación»

### La spec aprobada por delegación en la primera pregunta no para
- GIVEN el usuario eligió en la primera pregunta la opción que aprueba la spec por delegación
- WHEN la spec está escrita y repasada
- THEN el agente la aprueba sin parar, registra la frase literal y la fecha en «Decisiones tomadas con el dev-lead» y en «Aprobaciones», decide él la review de spec y la registra, y sigue
- AND el resto de paradas del perfil vigente sigue igual: la validación final no se quita nunca

### La primera pregunta propone partir una task grande
- GIVEN una task cuyo enunciado, leído con el código que toca, prevé más de 3 tasks internas en el plan
- WHEN el agente formula la primera pregunta de la entrevista
- THEN propone partirla en tasks con fila propia en el roadmap, con la partición y el motivo, como opción recomendada junto a seguir entera
- AND el usuario decide; si sigue entera, no se vuelve a proponer en esa task

### Una respuesta cuenta como aprobación solo si aprueba
- GIVEN un gate de aprobación (spec, plan en `pair`, enmienda)
- WHEN el usuario responde
- THEN cuenta como aprobación un «sí» o un «apruebo» a la pregunta del gate, o elegir una opción cuyo texto diga que aprueba
- AND elegir un alcance o responder a otra pregunta no aprueba: el agente pregunta la aprobación en una línea

### Un cambio a la spec aprobada es un desvío
- GIVEN una spec aprobada y una ejecución en curso
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope o un «No entra»
- THEN en `pair` y `delegate` el agente para, propone el cambio como entrada de `## Enmiendas` en la spec y espera la aprobación
- AND en `unattended` elige la opción más conservadora, la registra como enmienda sin aprobar y, si no hay opción que no bloquee, aparca la task (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las tasks abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en «Ficheros que toca», o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, la fila de la task añade esos ficheros

### Salir del plan es un ruling visible
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso o, si no queda ninguna, de la revisión final de rama
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

### El tercer fix descubierto abre un checkpoint de alcance
- GIVEN una task en ejecución con dos fixes descubiertos ya registrados (en «Fixes adicionales» de `tasks.md` o como ruling de fix)
- WHEN aparece un tercer defecto fuera del plan, y después cada tercero (6.º, 9.º…)
- THEN antes de arreglarlo o diferirlo, en `pair` y `delegate` el agente para y pregunta con tres opciones: seguir en esta task, diferir a otra task (fila en el roadmap) o partir la task
- AND en `unattended` lo difiere a una fila nueva del roadmap, lo registra como enmienda sin aprobar y sigue

### Una decisión que cambia la salida observable se pregunta
- GIVEN una decisión de ejecución que la spec no fija y que cambia lo que ve o recibe quien usa el producto: la respuesta de una API o de una CLI, el texto o el flujo de una UI, los ficheros generados o los nombres públicos
- WHEN el agente o un subagente la tiene que tomar
- THEN en `pair` y `delegate` el agente para, la pregunta con sus opciones antes de despachar y no la registra como ruling; la respuesta entra en `## Enmiendas`
- AND en `unattended` elige la opción que deja la salida como la describe la spec o, si la spec calla, como está hoy, y la registra como enmienda sin aprobar

### La fila de la task se compara con la base antes de cada despacho
- GIVEN una task en ejecución con su fila en el roadmap
- WHEN el agente va a despachar la siguiente task del plan
- THEN compara la fila en la base de la rama (`git merge-base`) con la fila en la rama de integración
- AND si cambió, lo trata como posible desvío: en `pair` y `delegate` presenta el cambio y para; en `unattended` sigue con la spec aprobada y registra la fila nueva como enmienda sin aprobar

### Los ficheros de la task se cruzan con la base antes de cada despacho
- GIVEN una task en ejecución y la siguiente task del plan con ficheros en «Crear» o «Modificar»
- WHEN el agente va a despacharla, antes de escribir sus tests RED
- THEN cruza `git diff --name-only $(git merge-base HEAD <integración>) <integración>` (y `origin/<integración>` tras `git fetch` si hay remoto) con esos ficheros
- AND si alguno coincide, lo trata como freno de alcance: en `pair` y `delegate` nombra los ficheros y los commits que los tocan y para; en `unattended` sigue y lo registra como enmienda sin aprobar

### La validación puede diferirse con condiciones
- GIVEN una task o un patch verificados por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una task o un patch en `unattended`
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅; en un patch, la línea va en `patch.md` §4, debajo de la tabla, y la fila de la tabla de patches empieza por `🧪 validación diferida a <disparador> — `
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) no hay diferido: la task o el patch siguen esperando la validación
- AND con la frase y sin disparador, o con uno vago («diferida», «se prueba en uso»), el agente no vuelve a preguntar: concreta el uso más próximo, con quien difiere como dueño (`disparador: la primera exportación del informe mensual, a cargo del dev-lead`), y lo dice en el mensaje de cierre para que lo corrija
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** (en un patch, en `patch.md` §4) y pasa la fila a ✅ (en un patch, quita el prefijo 🧪)

### En `unattended`, lo que falta aparca la task
- GIVEN una task en `unattended`
- WHEN una pregunta de la entrevista no tiene respuesta en los documentos del proyecto
- THEN la task queda `⏸️ aparcada: <pregunta>` en el roadmap y el agente sigue con la siguiente task de la release
- AND al terminar la release entrega un solo informe: tasks cerradas, decisiones, enmiendas sin aprobar y tasks aparcadas

### El merge a develop sigue la política declarada
- GIVEN una task o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso de rama del cierre (paso 10 de `sdd-end-task`, paso 6 de `sdd-end-patch`)
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta
- AND el bloque autoriza el merge, no la validación: en `pair` y `delegate`, el paso 0 de `sdd-end-patch` para con el smoke y la pregunta de validación antes de tocar nada

### Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás
- GIVEN un repo en el que `git worktree list` no muestra la rama destino sacada en ningún worktree
- WHEN el cierre fusiona
- THEN crea un worktree temporal de la rama destino en la carpeta que contiene el worktree de la feature, con nombre `merge-<id>`, fusiona allí y lo retira con `git worktree remove` antes de terminar
- AND el worktree de la feature sigue en su rama, el temporal no se crea en el scratchpad, en `%TEMP%` ni con `mktemp`, y ningún commit usa `--no-verify`

### Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona
- GIVEN la rama destino sacada en un worktree con cambios sin commitear
- WHEN el cierre va a fusionar
- THEN no fusiona ahí: dice qué ficheros tienen cambios y para
- AND no hace `stash`, `reset` ni commit de lo ajeno

### Un merge que el entorno deniega se informa con su evidencia
- GIVEN una política que autoriza el merge y un entorno que lo deniega (clasificador del harness o hook)
- WHEN el cierre termina
- THEN el informe final cita en un bloque el comando denegado, literal; cita el texto de la denegación y el hash de la rama destino, que sigue sin tocar; y dice que el resto del cierre está hecho
- AND no reintenta el merge con otra herramienta ni con otra forma del comando

### El push de la rama de integración sigue `merge.push`
- GIVEN un cierre de task o de patch que acaba de fusionar en `merge.into` según la política, con la suite en verde sobre el resultado, `merge.push: true` en `sdd-kit.json` y un upstream en `merge.into`
- WHEN el perfil vigente es `delegate` o `unattended`
- THEN el agente hace push de `merge.into` a su upstream sin preguntar, y no empuja ninguna otra rama ni tags

### Sin autorización, el push no lo hace el agente solo
- GIVEN un cierre de task o de patch que acaba de fusionar en `merge.into`
- WHEN el perfil vigente es `pair`, `merge.push` está ausente o es `false`, o `merge.into` no tiene upstream
- THEN el agente no hace push sin confirmación: en `pair` presenta el push junto con el merge y espera; en los demás casos no lo hace
- AND el mensaje final dice que el push no se hizo y por qué

### Un push que no sale se informa y no se fuerza
- GIVEN `merge.push: true` y un push que falla: el remoto lo rechaza, faltan credenciales o el entorno lo deniega
- WHEN el cierre termina
- THEN el mensaje final cita en un bloque el comando literal, cita el error y dice que el merge queda en local con el hash de `merge.into`
- AND el agente no reintenta con `--force`, `pull`, `rebase` ni otra herramienta

### El cierre acaba con una línea de terminado
- GIVEN un cierre de task (`sdd-end-task`) o de patch (`sdd-end-patch`) que ha recorrido su checklist
- WHEN el agente escribe su último mensaje
- THEN el mensaje nombra, si los hay, el disparador que concretó el agente, las decisiones tomadas sin el dev-lead que registra el walkthrough (o el `patch.md`), cada instrucción que el dev-lead dio antes del cierre y cómo quedó, y lo pendiente; y ofrece el ticket del kit si toca
- AND su última línea es la de terminado: si la rama está fusionada en `merge.into` y el worktree no tiene cambios sin commitear, dice rama, destino, hash, estado del push (hecho, no hecho y por qué) y que se puede borrar el worktree, con su ruta; si no, dice «No terminado», qué falta y que el worktree no se borra todavía
- AND con el merge o el push denegados o fallidos, sus bloques de evidencia van antes, y la línea de terminado sigue siendo la última: «No terminado» si falta el merge; con el merge hecho y el push fallido, dice «push no hecho» y el motivo
- AND solo se ofrece borrar un worktree enlazado: si la rama está en el checkout principal del repo, la línea acaba en el push, sin cláusula de borrado
- AND si después el agente escribe el ticket del kit en ese worktree, repite la línea de terminado con el ticket como pendiente hasta que se commitee y se fusione

### Un conflicto en el estimation-log se regenera con el script
- GIVEN un merge del cierre con conflicto en `estimation-log.md`
- WHEN el agente resuelve los conflictos
- THEN regenera `estimation-log.md` con `Build-EstimationLog.ps1` de `sdd-templates/scripts/`, y no lo edita a mano

### El merge del cierre espera su turno
- GIVEN dos cierres del mismo repo que fusionan en `merge.into` a la vez, desde worktrees distintos
- WHEN los dos ejecutan `Invoke-SddMerge.ps1`
- THEN el segundo espera y dice quién tiene el cerrojo (rama y worktree); fusiona cuando el primero lo suelta, sobre la rama destino que dejó el primero
- AND si el cerrojo no se libera en `-LockTimeoutMinutes`, el script falla nombrando al dueño y no toca nada; un cerrojo de un proceso que ya no existe en la misma máquina se toma, y el script lo dice

### El merge del cierre parte de la rama destino publicada
- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND si el único conflicto es `estimation-log.md`, lo regenera con `Build-EstimationLog.ps1`; con cualquier otro conflicto, falla con la lista de ficheros

### El push del cierre publica la rama destino
- GIVEN un merge del cierre cuyo push ha confirmado una persona o autoriza `merge.push` (perfil `delegate` o `unattended`)
- WHEN el script empuja
- THEN empuja la rama destino por su nombre (`git push <remoto> <destino>`), nunca `HEAD:<destino>`, y al terminar la rama local y la remota apuntan al mismo commit
- AND sin la confirmación ni `merge.push`, el script fusiona en local y no empuja

### Un merge del cierre que falla deja la rama destino como estaba
- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de las últimas 20 líneas de la salida del hook, no un conflicto

### La verificación del merge es el gate de merge, no la suite completa
- GIVEN un proyecto cuyo `tech-stack.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `Invoke-SddMerge.ps1`
- THEN `-VerifyCommand` es el conjunto rápido, que corre sobre el resultado del merge y antes del push; con una sola suite, es esa
- AND la suite completa ya corrió antes del script, en la validación final, y el mensaje final da su resultado
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `-VerifyCommand` se omite; la suite completa no se omite nunca

### Un conflicto solo en los registros se resuelve con un merge de sincronización
- GIVEN un cierre de task o de patch cuyo `Invoke-SddMerge.ps1` falla con `merge: conflicto en` y una lista formada solo por `changelog.md`, `roadmap.md` o `estimation-log.md` de `.docs/sdd/`
- WHEN el agente sigue la receta del merge
- THEN en el worktree de la feature hace `git merge --no-edit <merge.into>`, en `changelog.md` y `roadmap.md` deja cada línea con el cambio del lado que la tocó, sin duplicar ninguna, regenera `estimation-log.md` con `Build-EstimationLog.ps1`, commitea el merge y relanza el script una vez, sin parar a preguntar
- AND la rama destino acaba con las entradas de las dos tasks en cada registro y el log regenerado

### Un conflicto que no se puede conservar entero es de una persona
- GIVEN un cierre cuyo script falla con `merge:` y en la lista hay un fichero que no es uno de los tres registros, o los dos lados tocaron la misma línea de `changelog.md` o `roadmap.md`, o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: aborta el merge de sincronización si lo empezó (`git merge --abort`), cita el mensaje del script y los ficheros, y el cierre queda «No terminado», como hoy

### El método de ejecución lo elige el handoff del plan
- GIVEN una task en modo full con la spec aprobada, superpowers ≥ 6.4.1, `execution` ausente o `auto` en `sdd-kit.json` y sin `native` ni `subagent` en `sdd-kit.local.json`, o `execution: auto` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN en `delegate` y `unattended` no para: toma el método que recomienda el handoff de `writing-plans` y lo escribe en la cabecera del plan como `Ejecución: <native | subagent>, porque <motivo sacado del plan>`
- AND en `pair` la parada del plan es una sola pregunta que aprueba el plan y elige el método, con la recomendación del handoff como primera opción; no hay una parada aparte para el método
- AND ninguna task del plan lleva un campo `Ejecución` propio: el método es del plan entero, salvo el cambio a SDD tras una compactación

### Un método fijado en `sdd-kit.json` no se pregunta
- GIVEN una task en modo full con la spec aprobada, `execution: native` o `execution: subagent` en `sdd-kit.json` y sin `execution` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.json` y no pregunta el método en ningún perfil
- AND el valor fijado manda aunque el handoff recomiende el otro método
- AND en `pair` la parada del plan solo pide aprobarlo

### Tras una compactación, lo que queda de un plan Native va con SDD
- GIVEN un plan con `Ejecución: native` (recomendado por el handoff o fijado en `sdd-kit.json`), una sesión retomada tras una compactación y dos o más tasks sin su línea `complete` en el ledger
- WHEN el hilo retoma la ejecución
- THEN sigue con `subagent-driven-development` sobre el mismo ledger y lo registra como ruling, sin parar en `delegate` ni en `unattended`
- AND con una sola task pendiente, o sin compactación, sigue en Native

### El perfil se hereda de la task, de la persona, de la release o del proyecto
- GIVEN un perfil en el `profile:` de la spec, `control.profile` en `.docs/sdd/sdd-kit.local.json`, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap o `control.profile` en `sdd-kit.json`
- WHEN el agente determina el perfil vigente
- THEN manda la task sobre la persona, la persona sobre la release y la release sobre el proyecto; una spec sin `profile:` hereda
- AND la primera pregunta de `sdd-start-task` nombra el perfil vigente y de qué nivel sale
- AND el agente solo escribe un `profile`, un `control.*` o un `merge` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`; en `sdd-kit.local.json`, que no se commitea, basta la respuesta del usuario a `sdd-config`)

### Un método fijado en `sdd-kit.local.json` manda sobre el del proyecto
- GIVEN una task en modo full con la spec aprobada y `execution: native` o `execution: subagent` en `.docs/sdd/sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.local.json` y no pregunta el método en ningún perfil, aunque `sdd-kit.json` diga otro valor
- AND un método que el dev-lead nombra para la task manda sobre los dos ficheros
- AND un `execution: auto` en `sdd-kit.local.json` también cuenta: el método lo recomienda el handoff aunque `sdd-kit.json` fije `native` o `subagent`

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge` con `merge.push` opcional, y `execution`); las preferencias de cada persona, en `.docs/sdd/sdd-kit.local.json` (`control.profile`, `execution`, `validation.startEnvironment`), fuera de git; el perfil de la task, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap; el método de un plan, en la línea `Ejecución:` de su cabecera.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como `ids.mode`; valores de perfil `pair`, `delegate`, `unattended`; valores de `execution`: `auto`, `native`, `subagent`; estados del roadmap, conjunto cerrado: `⏳` · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`.
- **Límites**: `control.maxParallelAgents` 3 y `control.silence` 8 y 20 minutos por defecto; su conducta la define la task 0005. Umbral para proponer partir una task: más de 3 tasks internas previstas. Checkpoint de alcance: en el 3.º fix descubierto de una task y en cada tercero después.
- **Avisos**: la línea de terminado, última del mensaje final de cada cierre (rama, destino, hash, estado del push y ruta del worktree que se puede borrar, o «No terminado» y qué falta); y el bloque de un push fallido (comando literal y error).
- **Regla ante conflicto**: el perfil sigue task → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la task → persona → proyecto, sin nivel de release, y un valor fijado manda sobre la recomendación del handoff; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el entorno o el remoto deniegan no se reintenta: lo desbloquea una persona.
