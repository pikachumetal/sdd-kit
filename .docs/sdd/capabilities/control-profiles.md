# Capacidad — control-profiles

## Propósito

Cuánto para el agente a esperar al dev: perfiles de control, gates, desvío, aprobación, validación diferida y política de merge. La tabla que aplican las skills vive en `skills/sdd-start-feature/references/control-profiles.md`.

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
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x), o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, el «Toca:» o la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente
- AND en `pair` y `delegate`, un AND o un THEN de una ronda de REFACTOR o de fix que solo aplica, literal, una línea de «Decisiones tomadas con el dev-lead» de la spec no para: se escribe en su sitio con su línea de `## Enmiendas` marcada `sin aprobar`, se commitea con la ronda y se nombra en ✋; un valor, un caso o un texto que esa línea no dice para como desvío

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
- AND si alguno coincide, lo trata como freno de alcance: en `pair` y `delegate` nombra los ficheros y los commits que los tocan y para; en `unattended` sigue y lo registra como enmienda sin aprobar

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
- WHEN el agente llega a la validación (paso 7 de `sdd-start-feature`, o el paso de validación de `sdd-archive`), o cierra el patch 0031 con `sdd-archive`
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

### El merge a develop sigue la política declarada

- GIVEN una feature o un patch validados (o diferidos) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso del merge de `sdd-archive`
- THEN en `delegate` y `unattended` aplica la política sin preguntar: fusiona en `merge.into`, con `--no-ff` si `merge.noFf` es `true`; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta salvo en un hotfix con la frase del dev-lead en `--order`
- AND el bloque autoriza el merge, no la validación: en `pair` y `delegate`, la validación de `sdd-archive` para con el smoke y la pregunta de validación antes de tocar nada

### Sin la rama destino sacada, el merge va en un worktree temporal junto a los demás

- GIVEN un repo en el que `git worktree list` no muestra la rama destino sacada en ningún worktree
- WHEN el cierre fusiona
- THEN crea un worktree temporal de la rama destino en la carpeta que contiene el worktree de la feature, con nombre `merge-<id>`, fusiona allí y lo retira con `git worktree remove` antes de terminar
- AND el worktree de la feature sigue en su rama, el temporal no se crea en el scratchpad, en `%TEMP%` ni con `mktemp`, y ningún commit usa `--no-verify`
- AND un registro de worktree cuya carpeta ya no existe no cuenta como rama destino sacada: el cierre lo poda con `git worktree prune` antes de buscarla y otra vez al retirar el temporal, y no deja ninguno *prunable*

### Con la rama destino sacada y con cambios sin commitear, el cierre no fusiona

- GIVEN la rama destino sacada en un worktree con cambios sin commitear
- WHEN el cierre va a fusionar
- THEN no fusiona ahí y sale con 1 con `destino sacado: el checkout de '<into>' en '<ruta>' tiene cambios sin commitear; el merge se haría encima de ellos, así que no se toca.`, el `git diff --stat HEAD` del checkout, `sin seguimiento: <ficheros>` si los hay, y el bloque `Salidas:` (commit de quien los hizo y relanzar, llevarlos a la feature y dejar el merge para luego)
- AND la salida «Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, deuda, estimation-log).» solo aparece si todos los ficheros sucios son `.docs/sdd/roadmap.md`, `.docs/sdd/changelog.md`, `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/steering/debt.md` o `estimation-log.md`; con `.gitignore` o un `docs/roadmap.md` modificados, las salidas son dos
- AND no hace `stash`, `reset` ni commit de lo ajeno

### Un merge que el entorno deniega se informa con su evidencia

- GIVEN una política que autoriza el merge y un entorno que lo deniega (clasificador del harness o hook)
- WHEN el cierre termina
- THEN el informe final cita en un bloque el comando denegado, literal; cita el texto de la denegación y el hash de la rama destino, que sigue sin tocar; y dice que el resto del cierre está hecho
- AND no reintenta el merge con otra herramienta ni con otra forma del comando

### El push de la rama de integración sigue `merge.push`

- GIVEN un cierre de feature o de patch que acaba de fusionar en `merge.into` según la política, con la suite en verde sobre el resultado, `merge.push: true` en `sdd-kit.json` y un upstream en `merge.into`
- WHEN el perfil vigente es `delegate` o `unattended`
- THEN el agente hace push de `merge.into` a su upstream sin preguntar, y no empuja ninguna otra rama ni tags

### Sin autorización, el push no lo hace el agente solo

- GIVEN un cierre de feature o de patch que acaba de fusionar en `merge.into`
- WHEN el perfil vigente es `pair`, `merge.push` está ausente o es `false`, o `merge.into` no tiene upstream
- THEN el agente no hace push sin confirmación: en `pair` presenta el push junto con el merge y espera; en los demás casos no lo hace
- AND el mensaje final dice que el push no se hizo y por qué

### Un push que no sale se informa y no se fuerza

- GIVEN `merge.push: true` y un push que falla: el remoto lo rechaza, faltan credenciales o el entorno lo deniega
- WHEN el cierre termina
- THEN el mensaje final cita en un bloque el comando literal, cita el error y dice que el merge queda en local con el hash de `merge.into`
- AND el agente no reintenta con `--force`, `pull`, `rebase` ni otra herramienta

### El cierre acaba con una línea de terminado

- GIVEN un cierre de feature o de patch con `sdd-archive` que ha recorrido su checklist
- WHEN el agente escribe su último mensaje
- THEN el mensaje nombra, si los hay, el disparador que concretó el agente, las decisiones tomadas sin el dev-lead que registra el walkthrough (o el `patch.md`), cada instrucción que el dev-lead dio antes del cierre y cómo quedó, lo pendiente y lo que falta de su familia; y ofrece el ticket del kit si toca
- AND su última línea es la de terminado: si la rama está fusionada en `merge.into` y el worktree no tiene cambios sin commitear, dice rama, destino, hash, estado del push (hecho, no hecho y por qué) y que se puede borrar el worktree, con su ruta; si no, dice «No terminado», qué falta y que el worktree no se borra todavía
- AND con el merge o el push denegados o fallidos, sus bloques de evidencia van antes, y la línea de terminado sigue siendo la última: «No terminado» si falta el merge; con el merge hecho y el push fallido, dice «push no hecho» y el motivo
- AND solo se ofrece borrar un worktree enlazado: si la rama está en el checkout principal del repo, la línea acaba en el push, sin cláusula de borrado
- AND si después el agente escribe el ticket del kit en ese worktree, repite la línea de terminado con el ticket como pendiente hasta que se commitee y se fusione

### Un conflicto en el estimation-log se regenera con el script

- GIVEN un merge del cierre con conflicto en `estimation-log.md`
- WHEN el agente resuelve los conflictos
- THEN regenera `estimation-log.md` con `sdd estimation log`, y no lo edita a mano

### El merge del cierre espera su turno

- GIVEN dos cierres del mismo repo que fusionan en `merge.into` a la vez, desde worktrees distintos
- WHEN los dos ejecutan `sdd merge`
- THEN el segundo espera y dice quién tiene el cerrojo (rama y worktree); fusiona cuando el primero lo suelta, sobre la rama destino que dejó el primero
- AND si el cerrojo no se libera en `--lock-timeout`, el script falla nombrando al dueño y no toca nada; un cerrojo de un proceso que ya no existe en la misma máquina se toma, y el script lo dice

### El merge del cierre parte de la rama destino publicada

- GIVEN una rama destino con remoto que avanzó después de abrir la feature
- WHEN el cierre fusiona
- THEN antes de fusionar la feature, integra en la rama destino local los commits del remoto
- AND resuelve sus conflictos como el merge de la feature: regenera `estimation-log.md` con `sdd estimation log`, une los registros por id, une los trozos que solo añaden líneas por los dos lados (primero la rama destino) y prueba Mergiraf si está instalado; con cualquier otro conflicto, falla con `base: conflicto en` y la lista de ficheros

### El merge del cierre une los registros que solo añaden líneas

- GIVEN dos ramas desde la misma rama destino que añaden cada una una fila a `roadmap.md`, una línea a `changelog.md`, una sección al final de otro documento o una palabra a `.cspell/custom-words.txt` en el mismo sitio, y la primera ya se ha fusionado
- WHEN el cierre de la segunda ejecuta `sdd merge`
- THEN el script resuelve el conflicto dentro del cerrojo, en su worktree: deja las líneas de la rama destino y después las de la rama, regenera `estimation-log.md` y fusiona sin intervención
- AND si en algún trozo los dos lados cambian una línea que ya existía y ni la unión por id de los registros ni Mergiraf lo resuelven, o los dos crean el mismo fichero, aborta y falla con `merge: conflicto en` y la lista de ficheros, sin tocar la rama destino

### El push del cierre publica la rama destino

- GIVEN un merge del cierre cuyo push ha confirmado una persona o autoriza `merge.push` (perfil `delegate` o `unattended`)
- WHEN el script empuja
- THEN empuja la rama destino por su nombre (`git push <remoto> <destino>`), nunca `HEAD:<destino>`, y al terminar la rama local y la remota apuntan al mismo commit
- AND sin la confirmación ni `merge.push`, el script fusiona en local y no empuja
- AND si la rama destino no tiene remoto, el script fusiona en local, no empuja y acaba con `push: no hecho: sin remoto`, que el mensaje final del cierre cita

### Un merge del cierre que falla deja la rama destino como estaba

- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de los tests fallidos y de las últimas 20 líneas de la salida del hook, no un conflicto
- AND con el hook o `--verify` en rojo, si la salida tiene líneas de un test fallido —`[-] se llama sdd-archive` de Pester, ` FAIL  test/a.test.ts > grupo > nombre` o `× nombre` de Vitest, también tras un prefijo de moon como `cli:test | `—, antes de la cola va `tests fallidos:` y esas líneas, en orden y hasta 20; sin ninguna, el mensaje no cambia
- AND si `git merge` falla sin conflictos y sin llegar a preparar el merge (un fichero sin seguimiento que sobrescribiría, una opción que su versión no admite), el motivo es `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida, no un rechazo del hook
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- AND si `--verify` sale en rojo, el mismo comando corre sobre el commit de antes del merge y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

### La verificación del merge es el gate de merge, no la suite completa

- GIVEN un proyecto cuyo `tech-stack.md` §Testing separa un conjunto rápido de la suite completa
- WHEN el cierre fusiona con `sdd merge`
- THEN `--verify` es el conjunto rápido, que corre sobre el resultado del merge y antes del push; con una sola suite, es esa
- AND la suite completa ya corrió antes del script: en la validación final y, si la base trajo cambios fuera de `.docs/` que no sean `*.md`, otra vez tras el merge de sincronización del cierre; el mensaje final da su resultado y su sha
- AND si un hook `pre-merge-commit` del repo ya ejecuta el gate, `--verify` se omite; la suite completa no se omite nunca

### Un conflicto solo en los registros se resuelve con un merge de sincronización

- GIVEN un cierre de feature o de patch con su commit de cierre hecho y `origin/develop` por delante
- WHEN el agente sigue la receta del merge
- THEN ejecuta `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama y resuelve los registros, los trozos que solo añaden y, si está instalado, lo que Mergiraf resuelva; con `base: integrada`, sigue con `sdd merge`, sin parar a preguntar
- AND la rama destino acaba con las entradas de las dos features en cada registro y el log regenerado

### Un conflicto que no se puede conservar entero es de una persona

- GIVEN un cierre cuyo `sdd merge --sync` o cuyo `sdd merge` deja conflicto (`base: conflicto en` o `merge: conflicto en`), o el relanzamiento vuelve a fallar
- WHEN el agente sigue la receta del merge
- THEN no resuelve: cita el mensaje del script y los ficheros, y el cierre queda «No terminado», como hoy; el script ya ha abortado el merge
- AND con `vuelta: conflicto en <ficheros>` de un hotfix, el script ya lo ha deshecho todo: una persona porta el arreglo a la rama de integración y relanza el hotfix

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
- THEN sigue con el método SDD de `sdd-implement` sobre el mismo ledger y lo registra como `Task <N>: Ruling: compactación — sigo con SDD — quedan <k> tasks`, sin parar en `delegate` ni en `unattended`
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

### La comprobación del destino no toca nada

- GIVEN un worktree de feature y `develop` sacada en el checkout principal con `roadmap.md` modificado
- WHEN se ejecuta `node sdd.js merge --check --project-root <worktree>`
- THEN sale con 1 con el mismo mensaje de destino sacado que daría el merge, sin coger el cerrojo, sin fetch y sin cambiar ningún ref, índice ni fichero
- AND con el checkout limpio sale con 0 y `destino: listo: 'develop' sacado en '<ruta>', sin cambios`; sin `develop` sacada, con `destino: listo: 'develop' irá en el worktree temporal '<ruta>'`

### La suite no se repite si desde el commit verificado solo cambian docs

- GIVEN una feature cuyo gate de cierre pasó en el commit `a1b2c3d` y una rama destino que desde entonces solo avanzó en `.docs/sdd/roadmap.md`
- WHEN el cierre ejecuta `sdd merge --verify "<gate>" --verified-at a1b2c3d`
- THEN no ejecuta `<gate>` y escribe `verificación: omitida: desde a1b2c3d solo cambian docs`
- AND si desde `a1b2c3d` cambió cualquier fichero fuera de `.docs/` que no sea `*.md`, de la rama o de la base, ejecuta `<gate>` como sin la opción
- AND `--verified-at nada` sale con 2 y `--verified-at: 'nada' no es un commit`, sin coger el cerrojo

### El push del cierre reintenta si la rama destino avanzó

- GIVEN `sdd merge --push` y un remoto en el que otra sesión publica `develop` mientras corre `--verify`
- WHEN el push se rechaza y, tras un fetch, la `develop` remota ya no es antecesora de la local
- THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`, integra la `develop` remota como al empezar, repite `--verify` salvo que desde el último commit verificado solo cambien docs, y vuelve a empujar
- AND tras el tercer push rechazado falla con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato` y la rama destino como estaba
- AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla con `push: no se pudo publicar 'develop' en 'origin'.` y, en las líneas siguientes, lo que escribió `git push` (`remote: rama protegida`), sin reintentar; el push atómico de un hotfix, igual

### Un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración

- GIVEN `merge.into: develop`, la rama `hotfix/0200-fix-login` salida de `main` y ninguna `release/*` abierta
- WHEN se ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main" --push`
- THEN bajo un solo cerrojo fusiona la rama en `main` con `--no-ff` y el commit `merge: hotfix/0200-fix-login en main` con la línea `Orden del dev-lead: «fusiona el hotfix del login en main»`, crea la etiqueta anotada `v3.0.1` en ese commit, fusiona la misma rama en `develop` con `--no-ff`, y publica `main`, `develop` y `v3.0.1` en un solo push atómico
- AND escribe `Fusionado hotfix/0200-fix-login en main: <hash>`, `etiqueta v3.0.1 en <hash>`, `Fusionado hotfix/0200-fix-login en develop: <hash>` y `publicado en origin`
- AND con `release/3.1.0` abierta en `origin` (no antecesora de `main`), la vuelta va a `release/3.1.0` y no a `develop`; con dos abiertas en `origin` tras el fetch de `release/*` que hace el script, falla antes de sincronizar ni fusionar nada con `vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano`; una `release/` solo local no cuenta si hay remoto
- AND una `release/3.2.0` que se borró en `origin` no cuenta como abierta aunque su ref de seguimiento siguiera en local antes del fetch
- AND `--check` decide la vuelta con los refs de seguimiento que ya hay, sin fetch: no crea ni mueve ninguno
- AND una rama `release/3.1.0` con `--into main` vuelve a `develop`
- AND `--into main` sin `--order` sale con 2 con `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; `--tag` sin ese `--into`, con `--tag solo con --into a la rama estable`; `--tag 'v3.0.1 beta'`, con `--tag: 'v3.0.1 beta' no es un nombre de etiqueta válido`, antes del cerrojo; y una etiqueta que ya existe falla sin tocar nada con `--tag: ya existe 'v3.0.1'`, o con `--tag: ya existe 'v3.0.1' en 'origin'` si solo existe en el remoto
- AND si no se pueden consultar las etiquetas del remoto, falla sin tocar nada, también con `--check`, con `--tag: no se pudo consultar las etiquetas de 'origin'`

### A la rama estable solo llegan ramas hotfix y release

- GIVEN la rama `patch/0201-typo`
- WHEN se ejecuta `sdd merge --branch patch/0201-typo --into main --order "llévalo a main"`
- THEN sale con 1 con `--into: a 'main' solo llegan ramas hotfix/ o release/ (git-flow); 'patch/0201-typo' no lo es`, sin coger el cerrojo ni tocar ningún ref

### Un hotfix cuya vuelta falla se deshace entero

- GIVEN un hotfix que se fusiona en `main` y cuya vuelta a `develop` tiene un conflicto en `skills/x/SKILL.md` en el que los dos lados cambian la misma línea
- WHEN el script llega a la vuelta
- THEN deshace la vuelta, el merge en `main` y la etiqueta, no publica nada y falla con `vuelta: conflicto en skills/x/SKILL.md; se deshacen el merge en 'main' y la etiqueta: porta el arreglo a 'develop' a mano`
- AND con la verificación de la vuelta en rojo, deshace lo mismo y da el error de verificación con su línea `base:`
- AND si el push atómico se rechaza porque `main` o `develop` avanzaron en el remoto, deshace lo mismo y falla con `push: 'main' o 'develop' avanzó en 'origin'; relanza el hotfix`
- AND si `main` y la rama de vuelta tienen remotos distintos, falla antes de tocar nada con `push: 'main' y 'develop' tienen remotos distintos ('origin', 'upstream'); fusiona a mano`; y si no se puede consultar la vuelta en el remoto, con `vuelta: no se pudo consultar 'develop' en 'origin'`
- AND si una de las dos no tiene remoto, el mensaje dice `sin remoto` en su lugar: `push: 'main' y 'develop' tienen remotos distintos ('origin', sin remoto); fusiona a mano`

### Los trozos del merge se calculan con histogram y se escriben con zdiff3

- GIVEN cualquier merge que hace `sdd merge`: la base, la rama, la vuelta de un hotfix o `--sync`
- WHEN el script ejecuta `git merge`
- THEN lo ejecuta con `-c merge.conflictStyle=zdiff3` y `-X diff-algorithm=histogram`
- AND un conflicto que llega a una persona lleva las marcas de `zdiff3`, con la base entre `|||||||` y `=======`

### Los registros se unen por id

- GIVEN `develop` y la rama que se fusiona, que en el mismo trozo de `.docs/sdd/roadmap.md` (o de `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` o `.docs/sdd/steering/debt.md`) marcan una la fila `0190` como `✅` y añaden la otra la fila `0201` debajo
- WHEN el cierre ejecuta `sdd merge`
- THEN el trozo queda con la `0190` en `✅` y la `0201`, sin conflicto
- AND si las dos ramas añaden la misma fila `0201` con el mismo texto, queda una sola
- AND si añaden dos filas `0201` con texto distinto, se quedan las dos, la de la rama destino primero, y la salida dice `registros: dos filas distintas con el id '0201' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND una entrada `- **Feature 0185** — …` en `### Added` y otra en `### Changed` son ids distintos
- AND si las dos ramas cambian de forma distinta la misma fila que ya estaba en la base, es conflicto y lo resuelve una persona
- AND si el merge se aborta después por otro fichero en conflicto, la salida no dice `registros: …`
- AND la cabecera de una tabla no es una fila con id, aunque el trozo la separe de su separador: si las dos ramas añaden la misma tabla (`| Id | Tarea | Estado |`) con filas distintas, queda una tabla con la cabecera una vez y las dos filas seguidas, sin aviso

### Mergiraf resuelve lo que queda si está instalado

- GIVEN dos ramas que añaden cada una un método distinto en el mismo sitio de `src/rooms.ts` y `mergiraf` en el `PATH`
- WHEN el merge deja ese fichero en conflicto tras unir los registros y los trozos que solo añaden
- THEN el script ejecuta `mergiraf solve src/rooms.ts`, escribe `mergiraf: resuelto src/rooms.ts`, commitea el merge y corre `--verify` sobre el resultado
- AND si `mergiraf solve` sale con otro código, escribe `mergiraf: no resuelve src/rooms.ts`, aborta el merge y falla como hoy con el fichero en la lista de `conflicto en`
- AND sin `mergiraf` en el `PATH` no escribe nada de Mergiraf y falla como hoy
- AND el script no escribe `git config` ni `.gitattributes`
- AND si resuelve `src/rooms.ts` pero otro fichero queda en conflicto, aborta y no escribe `mergiraf: resuelto src/rooms.ts`
- AND si las dos ramas cambian el mismo import de forma compatible (`import { a, b }` y `import { a, c }`), Mergiraf los une en `import { a, b, c }` y `--verify` decide: en rojo, el merge se deshace como cualquier verificación en rojo
- AND no se lanza sobre ficheros de `.docs/` ni sobre `*.md`: un conflicto ahí que las reglas del kit no resuelven sale en `conflicto en` sin línea de Mergiraf
- AND si resolvió algún fichero, `--verified-at` no omite `--verify`

### El merge de sincronización lo hace `sdd merge --sync`

- GIVEN la rama `feature/0186-x` con su commit de cierre, y `origin/develop` con la 0185 fusionada, que, como la rama, añade un requisito al final de `.docs/sdd/capabilities/routing.md` y una fila al roadmap
- WHEN se ejecuta `sdd merge --sync --project-root <worktree de la 0186>`
- THEN integra `origin/develop` en `feature/0186-x` con la misma resolución que el merge del cierre, sin coger el cerrojo, sin `--verify` y sin push; la capacidad queda con los dos requisitos (primero el de `develop`) y el roadmap con las dos filas, y escribe `base: integrada 'origin/develop' en 'feature/0186-x': <hash>`
- AND si `origin/develop` ya es antecesora de la rama, no hace nada y escribe `base: al día: 'origin/develop' ya está en 'feature/0186-x'`
- AND con un conflicto que no resuelve, aborta el merge, deja la rama como estaba y sale con 1 con `base: conflicto en <ficheros>.`
- AND con cambios sin commitear, o con otro merge a medias, sale con 1 sin tocar nada: `base: 'feature/0186-x' tiene cambios sin commitear; commitéalos antes de integrar la base`
- AND en un HEAD desacoplado sale con 1 sin tocar nada: `base: HEAD desacoplado; --sync integra la base en una rama`
- AND con `--into`, `--tag`, `--order`, `--push`, `--verify`, `--verified-at`, `--check` o `--branch` sale con 2: `--sync no admite <opción>`

### Tras fusionar, las filas repetidas de los registros se limpian

- GIVEN dos ramas que añaden la fila `| 0210 | x | ⏳ |` en sitios distintos de la misma tabla de `.docs/sdd/roadmap.md`, que git fusiona sin conflicto, y la primera ya fusionada en `develop`
- WHEN el cierre de la segunda ejecuta `sdd merge` (o `sdd merge --sync`)
- THEN tras el commit de merge, el script quita la segunda copia en un commit `docs(registros): quita las filas repetidas del merge` con el cuerpo `Filas: 0210.`, antes de verificar y publicar
- AND si las dos filas `0210` tienen texto distinto, se quedan las dos, no hay commit de limpieza, y la salida dice `registros: dos filas distintas con el id '0210' en .docs/sdd/roadmap.md; se quedan las dos, revísalas`
- AND vale igual en `ROADMAP.md`, `CHANGELOG.md`, `.docs/sdd/changelog.md` y `.docs/sdd/steering/debt.md`, dentro de cada sección: `**Feature 0210**` en `### Added` y en `### Changed` no se toca
- AND un id que ya estaba repetido en la rama destino antes del merge no se toca ni se avisa
- AND si el commit de limpieza falla, el merge se deshace, la rama destino queda como estaba y el script sale con 1 con `registros: no se pudo commitear la limpieza de filas repetidas`

### El push nombra los commits de la rama destino que no son del cambio

- GIVEN una `develop` local con `f5b76897 docs(roadmap): triaje` sin publicar en `origin`, y la rama `feature/0150-x` lista para fusionar
- WHEN el cierre ejecuta `sdd merge --push`
- THEN publica `develop` con ese commit y con el merge, y escribe `push: también publica 1 commit de 'develop' que no es de feature/0150-x:` y `- f5b76897 docs(roadmap): triaje`, antes de `publicado en origin`
- AND con dos commits así, `push: también publica 2 commits de 'develop' que no son de feature/0150-x:` y una línea `- <hash> <asunto>` por cada uno
- AND sin commits locales sin publicar, sin `--push` o sin remoto, la línea no sale
- AND los commits que trae de la remota un reintento del push no cuentan
- AND en un hotfix, cada rama publicada (la estable y la de vuelta) que tenga commits así da su línea, con su nombre

## Reglas de la capacidad

- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge` con `merge.push` opcional, y `execution`); las preferencias de cada persona, en `.docs/sdd/sdd-kit.local.json` (`control.profile`, `execution`, `validation.startEnvironment`), fuera de git; el perfil de la feature, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap (en `ROADMAP.md`, entre `## Now` y su tabla); los ficheros que prevé tocar una feature abierta, en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x); el método de un plan, en la línea `Ejecución:` de su cabecera.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como `ids.mode`; valores de perfil `pair`, `delegate`, `unattended`; valores de `execution`: `auto`, `native`, `subagent`; estados del roadmap, conjunto cerrado: `⏳` · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`.
- **Límites**: `control.maxParallelAgents` 3 por defecto; su conducta la aplica `sdd-parallel-agents` (requisito «Dos revisores de spec se despachan con `sdd-parallel-agents`» de `feature-flow`). `control.silence` 8 y 20 minutos por defecto: 20 (`longCommandMinutes`) si la llamada que espera el subagente es un comando de shell o si se vigila la salida de una verificación lenta, y 8 (`betweenStepsMinutes`) en cualquier otra espera; un subagente colgado se relanza una sola vez (requisitos de `feature-flow`). Umbral para proponer partir una feature: más de 5 tasks internas previstas, o 4 o 5 que tocan capacidades o superficies distintas o llevan migración; con 3 o menos, nunca. Checkpoint de alcance: en el 3.º fix descubierto de una feature y en cada tercero después. `sdd merge --push`: 3 intentos de push como máximo cuando la rama destino avanza en el remoto; el push de un hotfix, uno.
- **Avisos**: la línea de terminado, última del mensaje final de cada cierre (rama, destino, hash, estado del push y ruta del worktree que se puede borrar, o «No terminado» y qué falta); el bloque de un push fallido (comando literal y error); y el aviso de cada clave de `sdd-kit.local.json` que el agente ignora, en el anuncio o en la pregunta del carril de `sdd-propose`.
- **Regla ante conflicto**: el perfil sigue feature → persona (`sdd-kit.local.json`) → release → proyecto; `execution` sigue método nombrado para la feature → persona → proyecto, sin nivel de release, y un valor fijado manda sobre la recomendación del handoff; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el entorno o el remoto deniegan no se reintenta: lo desbloquea una persona. Un conflicto de merge en el que los dos lados cambian lo mismo lo resuelve una persona: `sdd merge` solo resuelve, en este orden, el `estimation-log.md` (regenerado), los registros por id, los trozos que solo añaden y lo que Mergiraf resuelva con código 0. La excepción es Mergiraf, solo fuera de `.docs/` y de `*.md`: une cambios compatibles de los dos lados en la misma construcción (`{ a, b }` + `{ a, c }` → `{ a, b, c }`), y la verificación que corre sobre el resultado decide (dev-lead, 2026-10-19).
