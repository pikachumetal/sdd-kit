# Capacidad — release-flow

## Propósito

El carril release del kit: cuándo es opcional, cómo se cierra una publicación y cómo se adapta a si la release tiene destinatario. Preparar la release vive en `planning`.

## Requisitos

### El carril release es opcional

- GIVEN un proyecto que trabaja solo con feature y patch, sin sección de release abierta en el roadmap
- WHEN se cierran features y patches
- THEN sus entradas van a `[Unreleased]` y ninguna skill de feature o patch pide abrir una release
- AND el id de una feature sin fila reservada sigue lo que declara [`feature-ids.md`](feature-ids.md) («Una feature no planificada obtiene su id con un script determinista»)

### Se puede cerrar una release que no se abrió

- GIVEN un roadmap válido sin sección de la release y un `[Unreleased]` con entradas
- WHEN el usuario lanza `sdd-end-release` para publicar
- THEN el scope que se congela es el contenido de `[Unreleased]`, el agente propone la versión y espera a que el usuario la confirme
- AND el paso del roadmap añade la entrada a «Releases cerradas» y saca las filas que el corte publica —las de «Próximo» de lo que entra en la versión, las filas saldadas y los patches con fecha no posterior al corte— sin colapsar ninguna sección `## Release <N>`, y `sdd roadmap check` escribe `Roadmap válido`

### El proyecto declara si sus releases tienen destinatario

- GIVEN un `.docs/sdd/sdd-kit.json` sin `release.hasRecipient`
- WHEN se ejecuta `sdd-roadmap` para preparar una release, o `sdd-end-release`
- THEN el agente pregunta una sola vez si la release se entrega a alguien distinto de quien la hace, y escribe la respuesta en `release.hasRecipient` sin tocar los demás campos
- AND con el campo ya presente no se pregunta
- AND el agente no escribe ni cambia el campo sin una respuesta o petición explícita del usuario

### El valor vigente del campo es el que se aplica

- GIVEN un proyecto que cambia `release.hasRecipient` de `true` a `false`, o al revés, aunque sea con una release abierta
- WHEN se ejecuta `sdd-roadmap` para preparar una release, o `sdd-end-release`
- THEN la skill aplica el valor que tiene el campo en ese momento, sin migración y sin reescribir releases pasadas

### Sin destinatario no se pregunta si la release está comprometida

- GIVEN `release.hasRecipient: false`
- WHEN `sdd-roadmap` llega al estado de la release que prepara
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

### El tag vuelve a la rama de integración

- GIVEN un proyecto cuyo git-flow tiene rama de integración (`develop`) y un cierre de release que ya fusionó en el branch estable
- WHEN se ejecutan el merge y el tag
- THEN el tag anotado `vX.Y.Z` va sobre el merge commit del branch estable y se empuja
- AND después se fusiona el branch estable de vuelta en la rama de integración, para que el tag quede en su historia
- AND sin rama de integración no hay merge de vuelta

### Sin destinatario no hay release notes ni email

- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escriben `release-notes.md` ni el borrador de email, el paso de release notes y comunicación no aplica y la entrada del roadmap enlaza al changelog (y a la retro si existe)

### La carpeta de la release existe solo si tiene contenido

- GIVEN `release.hasRecipient: false` y un cierre sin retro
- WHEN termina `sdd-end-release`
- THEN no se exige que exista `.docs/sdd/releases/vX.Y.Z/` ni se crea vacía
- AND con destinatario o con retro, la carpeta sigue siendo obligatoria

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

### La línea de smoke se cuenta igual en todas las releases

- GIVEN el cierre de una release
- WHEN se escribe la línea de smoke en el roadmap
- THEN tiene la forma `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, donde N cuenta solo defectos del comportamiento entregado detectados por el smoke sobre la rama integrada
- AND si no se ejecutó smoke, la línea es `smoke: pendiente`

### El smoke de la release valida las features diferidas a él

- GIVEN una release con la 0022 en `🧪 validación diferida a la 1.3` en su tabla, y la 0017 en la línea `validaciones pendientes: 0017` de `### v1.2.0 — 2026-09-20`, con su walkthrough diciendo `disparador: el smoke de la 1.3, a cargo del dev-lead`
- WHEN el dev-lead valida el smoke de la 1.3 en `sdd-end-release`, diciendo qué probó
- THEN el agente pregunta por la 0022 y por la 0017 en el mismo smoke; cada feature que el dev-lead menciona gana una adenda fechada en su walkthrough (en un patch, en `patch.md` §4) con lo que el dev-lead probó que le toca, y sale de las validaciones pendientes: la fila, en el colapso; el id, de la línea de la v1.2.0, que desaparece si queda vacía
- AND una feature que el dev-lead no menciona gana en su walkthrough una adenda fechada con el disparador nuevo (la siguiente release, salvo que el dev-lead diga otro), su id pasa a la línea `validaciones pendientes:` de la v1.3.0, y el resumen de cierre la lista

### El corte no arranca desde una sección fuera de la plantilla sin decirlo

- GIVEN un roadmap con el trabajo de la release en `## Versión siguiente` (la 0021 ✅, la 0022 `🧪 validación diferida a la 1.3.0` y la 0023 ⏳), sobre el que `sdd roadmap check` escribe `roadmap.md: línea 9: sección «Versión siguiente» fuera de la plantilla`
- WHEN el usuario ordena «cierra la release» y `sdd-end-release` llega al paso del roadmap
- THEN antes de colapsar ejecuta `sdd roadmap check`, dice que «Versión siguiente» no es una sección `## Release <N>` y que el roadmap no tiene la forma de la plantilla, y propone llevarlo a la forma con el paso «Roadmap en la forma de la plantilla» de `migrations/v2.3.0.md`, con su gate
- AND no borra ni mueve nada del roadmap sin el visto del dev-lead a ese gate; sin él, el resumen de cierre da el paso del roadmap como pendiente y el merge y el tag del paso 5 no se ejecutan
- AND con un roadmap que pasa el validador, el corte desde `## Release 1.3` o desde «Próximo» no da este aviso

### El corte deja el roadmap válido

- GIVEN un roadmap válido con `## Release 1.3` (la 0021 ✅, la 0022 `🧪 validación diferida a la 1.3` y la 0024 ⏳, que el usuario mueve a la siguiente), una fila `0019` ✅ en «Próximo» que entra en esta release, una fila de deuda que empieza por `**[Patch 0020, 2026-10-02: saldada — …]**`, un patch `2026-10-02` en «Patches», `### v1.2.0 — 2026-09-20` como última release cerrada, el corte de la 1.3.0 el 2026-10-05, y el dev-lead que valida el smoke sin mencionar la 0022
- WHEN `sdd-end-release` colapsa el roadmap
- THEN «Releases cerradas» empieza por `### v1.3.0 — 2026-10-05`, con un resumen que nombra la 0019, la 0021, la 0022 y el patch 0020, el enlace al changelog, la línea de smoke y `validaciones pendientes: 0022`
- AND sale la sección `## Release 1.3`, la 0024 queda como fila ⏳ en «Próximo», y salen la fila 0019 de «Próximo», la fila de deuda saldada y la fila del patch
- AND antes del commit del cierre `sdd roadmap check` escribe `Roadmap válido`; con otra salida, el agente corrige el roadmap, nunca el validador, y el paso 5 espera a que lo escriba

### Replanificar parte del estado real de la release

- GIVEN una release en curso en el roadmap, con la rama de integración por delante del worktree del agente o con ramas `feature/*` abiertas
- WHEN el usuario pide meter trabajo en la release, partir, mover o crear features
- THEN antes de proponer nada el agente lee el roadmap de la rama de integración y el de cada rama `feature/*` abierta, no solo el de su worktree
- AND no amplía una feature que esté cerrada (✅ o 🧪) en la rama de integración: el trabajo nuevo va a una feature nueva

### Una feature en marcha no se toca al replanificar

- GIVEN una feature en marcha (con rama `feature/<id>` abierta o 🔄 en el roadmap)
- WHEN la replanificación trae trabajo de su tema
- THEN ni su fila ni su spec cambian: el trabajo va a una feature nueva con fila propia que declara que va tras ella

### Los ids nuevos no chocan con reservas de otras ramas

- GIVEN `ids.mode: sequence` y una rama `feature/*` que reservó en su roadmap un id que la rama de integración aún no tiene
- WHEN la replanificación crea features
- THEN cada id nuevo es mayor que el que da `sdd id next` y que cualquier id de los roadmaps leídos

### La reserva se publica antes de arrancar

- GIVEN un scope replanificado que el usuario ha decidido, `"merge": { "into": "develop" }` en `sdd-kit.json`, `develop` sacada en el worktree `D:\code\salas` sin cambios en `roadmap.md`, y una sesión en otro worktree con dos filas nuevas reservadas en su `roadmap.md`
- WHEN el agente ejecuta `node sdd.js roadmap publish --message "docs(roadmap): reservar 0150 y 0151" .docs/sdd/roadmap.md`
- THEN `develop` tiene un commit con ese mensaje que solo toca `roadmap.md`, con el contenido del worktree de la sesión, hecho en `D:\code\salas`, y sale con 0
- AND lo hace antes de arrancar ninguna de las features nuevas, y el `proposal.md` de la propuesta, si la hay, va en el mismo commit
- AND si `develop` no está sacada en ningún worktree, el commit se hace en un worktree temporal de nombre corto junto a los demás, que se retira al acabar
- AND si otro proceso tiene `sdd-merge.lock`, escribe `Esperando el cerrojo de merge: lo tiene <rama> (<worktree>, PID <pid>) desde <hora>.`, espera y después publica; si a los 30 min no se libera, escribe `cerrojo: no se libera; lo tiene …`, sale con 1 y `develop` no cambia
- AND si `develop` cambió `roadmap.md` desde la base de la sesión (`git merge-base`), escribe `develop cambió .docs/sdd/roadmap.md desde tu base: integra develop antes de publicar`, sale con 1 y `develop` no cambia
- AND si `D:\code\salas` tiene cambios sin commitear en `roadmap.md`, escribe `destino con cambios: .docs/sdd/roadmap.md en D:\code\salas`, sale con 1 y `develop` no cambia
- AND sin `merge.into` en `sdd-kit.json` ni `--into`, o con una ruta fuera de `.docs/sdd/`, sale con 2 sin escribir

### El cierre no procesa el feedback de una reunión

- GIVEN un cierre en el que el usuario aporta la transcripción o las notas de una demo o reunión
- WHEN se ejecuta `sdd-end-release`
- THEN no escribe acta ni triaje (`feedback.md`) y dice que ese feedback es entrada de `sdd-roadmap`
- AND el cierre sigue con sus cinco pasos, sin esperar a que se procese

### La retro es opcional

- GIVEN un proyecto con `.docs/sdd/estimation-log.md`
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la misma propuesta ofrece la retro en una línea, sin pregunta aparte
- AND solo se escribe si el usuario la pide, en `.docs/sdd/releases/vX.Y.Z/retro.md`, y no retiene los demás pasos: si el roadmap ya está colapsado, se añade su enlace a la entrada de la release
- AND sin `estimation-log.md` no se ofrece

## Reglas de la capacidad

- **Dónde viven los datos**: si la release tiene destinatario vive en `.docs/sdd/sdd-kit.json` (`release.hasRecipient`, booleano), junto a `version` e `ids`. El nombre del destinatario no se guarda en la configuración.
- **Idioma de los nombres**: la clave va en inglés camelCase, como `ids.mode`.
- **Límites**: no aplica.
- **Avisos**: una sola pregunta cuando falta el campo, la hace la primera skill del carril que lo necesita. No hay ninguna otra.
- **Regla ante conflicto**: manda el valor vigente del campo al ejecutarse cada skill. Solo lo escribe o lo cambia el usuario, directamente o respondiendo al agente. Si falta el campo o hay duda sobre quién lo escribió, se aplica el gate completo.
