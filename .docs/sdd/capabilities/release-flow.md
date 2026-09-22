# Capacidad — release-flow

Verdad viva del comportamiento observable del carril release del kit: cuándo es opcional, cómo se cierra una publicación y cómo se adapta a si la release tiene destinatario. La declaró la spec de la task 0004 en sus «Decisiones a validar» (decisión 14). Recoge solo lo que esa task tocó o verificó: el resto del carril (acta, retro, triage, colapso con apertura) sigue descrito en las skills `sdd-start-release` y `sdd-end-release` hasta que una task lo traiga aquí.

## Requisitos

### El carril release es opcional
- GIVEN un proyecto que trabaja solo con task y patch, sin sección de release abierta en el roadmap
- WHEN se cierran tasks y patches
- THEN sus entradas van a `[Unreleased]` y ninguna skill de task o patch pide abrir una release
- AND el id de una task sin fila reservada sigue lo que declara [`task-ids.md`](task-ids.md) («Una task no planificada obtiene su id con un script determinista»)

### Se puede cerrar una release que no se abrió
- GIVEN un roadmap sin sección de la release y un `[Unreleased]` con entradas
- WHEN el usuario lanza `sdd-end-release` para publicar
- THEN el scope que se congela es el contenido de `[Unreleased]`, el agente propone la versión y espera a que el usuario la confirme
- AND el paso del roadmap añade la entrada a «Releases cerradas» sin colapsar ninguna sección

### El proyecto declara si sus releases tienen destinatario
- GIVEN un `.docs/sdd/sdd-kit.json` sin `release.hasRecipient`
- WHEN se ejecuta `sdd-start-release` o `sdd-end-release`
- THEN el agente pregunta una sola vez si la release se entrega a alguien distinto de quien la hace, y escribe la respuesta en `release.hasRecipient` sin tocar los demás campos
- AND con el campo ya presente no se pregunta
- AND el agente no escribe ni cambia el campo sin una respuesta o petición explícita del usuario

### El valor vigente del campo es el que se aplica
- GIVEN un proyecto que cambia `release.hasRecipient` de `true` a `false`, o al revés, aunque sea con una release abierta
- WHEN se ejecuta `sdd-start-release` o `sdd-end-release`
- THEN la skill aplica el valor que tiene el campo en ese momento, sin migración y sin reescribir releases pasadas

### Sin destinatario no se pregunta si la release está comprometida
- GIVEN `release.hasRecipient: false`
- WHEN `sdd-start-release` llega al estado de la release
- THEN el estado es «en preparación» y no se pregunta
- AND con `true`, la pregunta usa las definiciones: comprometida = scope prometido al destinatario, normalmente con fecha; en preparación = cualquier otro caso

### Merge y tag sin segunda ronda cuando la decisión ya está tomada
- GIVEN un cierre con `sdd-end-release` en el que se cumplen las tres condiciones: (a) un mensaje del usuario en esta conversación ordena el cierre; (b) el usuario ha escrito o aceptado la versión exacta respondiendo a la propuesta del paso 1; (c) `sdd-kit.json` tiene `release.hasRecipient: false`, escrito por respuesta o petición explícita del usuario, y no se ha movido ningún item del scope desde la orden de cierre
- WHEN se llega al paso de versión y tag
- THEN el agente presenta el resumen de cierre citando literal la orden de cierre y la respuesta de versión, y ejecuta el merge y el tag en el mismo turno, sin pedir otra confirmación

### Sin una de las tres condiciones, el gate de merge y tag se mantiene
- GIVEN un cierre con `sdd-end-release` en el que falta cualquiera de las tres condiciones (la skill la disparó el agente sin orden del usuario, la versión la ha supuesto el agente o solo venía en el encargo, `hasRecipient` es `true`, el agente escribió `false` sin respuesta del usuario, o se movió scope)
- WHEN se llega al paso de versión y tag
- THEN el agente prepara el merge y el tag, los presenta y espera la confirmación explícita

### Sin destinatario no hay release notes ni email
- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escriben `release-notes.md` ni el borrador de email, el paso «Comunicar» no aplica y la entrada del roadmap enlaza al changelog (y al acta si existe)

### La carpeta de la release existe solo si tiene contenido
- GIVEN `release.hasRecipient: false` y un cierre sin acta (no hubo demo ni retro)
- WHEN termina `sdd-end-release`
- THEN no se exige que exista `.docs/sdd/releases/vX.Y.Z/` ni se crea vacía
- AND con destinatario o con acta, la carpeta sigue siendo obligatoria

### El bump usa el tooling del proyecto
- GIVEN un `tech-stack.md` que declara el comando que cambia la versión (p. ej. un script de Node)
- WHEN se llega al bump
- THEN se ejecuta ese comando con la versión confirmada y no se editan los ficheros a mano

### Sin fichero de versión, la versión vive en el tag y en el changelog
- GIVEN un proyecto sin fichero de versión ni comando declarado
- WHEN se llega al bump
- THEN no se crea ningún fichero para la versión: la registran el tag anotado y la cabecera del changelog sellado

### La versión se propone desde el changelog
- GIVEN un `[Unreleased]` con entradas
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la propuesta sale de lo que contiene `[Unreleased]` (en pre-1.0, según `versionado.md`) y va con su motivo
- AND la versión sigue esperando la confirmación explícita del usuario

### En modo tracker, el cierre lista los tickets
- GIVEN `ids.mode: tracker`
- WHEN se presenta el resumen de cierre
- THEN incluye los ids de ticket de las entradas de `[Unreleased]` que entran en la versión

### El acta solo se escribe si hay fuente
- GIVEN `release.hasRecipient: false` y un cierre sin transcripción ni notas aportadas por el usuario y sin fichero de fuente en `.docs/sdd/releases/vX.Y.Z/`
- WHEN `sdd-end-release` llega al acta
- THEN omite el paso sin preguntar si hubo demo o reunión

### La línea de smoke se cuenta igual en todas las releases
- GIVEN el cierre de una release
- WHEN se escribe la línea de smoke en el roadmap
- THEN tiene la forma `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, donde N cuenta solo defectos del comportamiento entregado detectados por el smoke sobre la rama integrada
- AND si no se ejecutó smoke, la línea es `smoke: pendiente`

### El smoke de la release valida las tasks diferidas a él
- GIVEN una release con tasks `🧪 validación diferida a <esta release>`
- WHEN el dev-lead valida el smoke de la release en `sdd-end-release`, diciendo qué probó
- THEN cada una de esas tasks gana una adenda fechada en su walkthrough con lo que el dev-lead probó que le toca, y su fila pasa a ✅
- AND una task que el dev-lead no menciona sigue como `🧪 validación diferida a <disparador nuevo>` (la siguiente release, salvo que el dev-lead diga otro), y el cierre la lista

### Replanificar parte del estado real de la release
- GIVEN una release en curso en el roadmap, con la rama de integración por delante del worktree del agente o con ramas `feature/*` abiertas
- WHEN el usuario pide meter trabajo en la release, partir, mover o crear tasks
- THEN antes de proponer nada el agente lee el roadmap de la rama de integración y el de cada rama `feature/*` abierta, no solo el de su worktree
- AND no amplía una task que esté cerrada (✅ o 🧪) en la rama de integración: el trabajo nuevo va a una task nueva

### Una task en marcha no se toca al replanificar
- GIVEN una task en marcha (con rama `feature/<id>` abierta o 🔄 en el roadmap)
- WHEN la replanificación trae trabajo de su tema
- THEN ni su fila ni su spec cambian: el trabajo va a una task nueva con fila propia que declara que va tras ella

### Los ids nuevos no chocan con reservas de otras ramas
- GIVEN `ids.mode: sequence` y una rama `feature/*` que reservó en su roadmap un id que la rama de integración aún no tiene
- WHEN la replanificación crea tasks
- THEN cada id nuevo es mayor que el que da `Get-NextSddId.ps1` y que cualquier id de los roadmaps leídos

### La reserva se publica antes de arrancar
- GIVEN un scope replanificado que el usuario ha decidido
- WHEN el agente escribe las filas en el roadmap
- THEN las publica en la rama de integración con un commit que solo toca `roadmap.md`, en el worktree donde está sacada (o en uno temporal, en la carpeta de los demás worktrees y con nombre corto, si no está en ninguno)
- AND lo hace antes de arrancar ninguna de las tasks nuevas

## Reglas de la capacidad

- **Dónde viven los datos**: si la release tiene destinatario vive en `.docs/sdd/sdd-kit.json` (`release.hasRecipient`, booleano), junto a `version` e `ids`. El nombre del destinatario no se guarda en la configuración.
- **Idioma de los nombres**: la clave va en inglés camelCase, como `ids.mode`.
- **Límites**: no aplica.
- **Avisos**: una sola pregunta cuando falta el campo, la hace la primera skill del carril que lo necesita. No hay ninguna otra.
- **Regla ante conflicto**: manda el valor vigente del campo al ejecutarse cada skill. Solo lo escribe o lo cambia el usuario, directamente o respondiendo al agente. Si falta el campo o hay duda sobre quién lo escribió, se aplica el gate completo.

## Historial

- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED El carril release es opcional
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED Se puede cerrar una release que no se abrió
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED El proyecto declara si sus releases tienen destinatario
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED El valor vigente del campo es el que se aplica
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED Sin destinatario no se pregunta si la release está comprometida
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED Merge y tag sin segunda ronda cuando la decisión ya está tomada
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED Sin una de las tres condiciones, el gate de merge y tag se mantiene
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED Sin destinatario no hay release notes ni email
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED La carpeta de la release existe solo si tiene contenido
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED El bump usa el tooling del proyecto (sin el caso «ficheros de versión sin comando», que ningún escenario midió)
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED Sin fichero de versión, la versión vive en el tag y en el changelog
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED La versión se propone desde el changelog (sin la tabla de major, minor y patch, que ningún escenario midió)
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED En modo tracker, el cierre lista los tickets
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED El acta solo se escribe si hay fuente (acotado a `hasRecipient: false`: con cliente, preguntar por la demo es pertinente)
- 2026-09-21 — 20260921-074701-task-0004-release-without-client — ADDED La línea de smoke se cuenta igual en todas las releases
- 2026-09-22 — 20260921-162234-task-0008-control-profiles — ADDED El smoke de la release valida las tasks diferidas a él (con la forma de la 🧪 no validada de la segunda enmienda)
- 2026-09-22 — 20260922-154013-task-0029-release-replan — ADDED Replanificar parte del estado real de la release
- 2026-09-22 — 20260922-154013-task-0029-release-replan — ADDED Una task en marcha no se toca al replanificar
- 2026-09-22 — 20260922-154013-task-0029-release-replan — ADDED Los ids nuevos no chocan con reservas de otras ramas
- 2026-09-22 — 20260922-154013-task-0029-release-replan — ADDED La reserva se publica antes de arrancar (la salida del worktree temporal, sin GREEN: deuda del roadmap)
