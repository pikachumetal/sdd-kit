# Capacidad — release-flow

## Propósito

El carril release del kit: cuándo es opcional, cómo se cierra una publicación y cómo se adapta a si la release tiene destinatario. Preparar la release vive en `planning`.

## Requisitos

### El carril release es opcional

- GIVEN un proyecto que trabaja solo con feature y patch, sin sección de release abierta en el roadmap
- WHEN se cierran features y patches
- THEN sus filas quedan en Now hasta el corte (en 2.x, sus entradas van a `[Unreleased]`) y ninguna skill de feature o patch pide abrir una release
- AND el id de una feature sin fila reservada sigue lo que declara [`feature-ids.md`](feature-ids.md) («Una feature no planificada obtiene su id con un script determinista»)

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

### La carpeta de la release existe solo si tiene contenido

- GIVEN `release.hasRecipient: false`, un proyecto sin filas triadas en `.docs/sdd/steering/debt.md`, o sin ese fichero, y un cierre sin retro pedida
- WHEN termina `sdd-end-release`
- THEN no se exige que exista `.docs/sdd/releases/vX.Y.Z/` ni se crea vacía
- AND con destinatario, con filas triadas en `debt.md` o con retro pedida, la carpeta sigue siendo obligatoria
- AND con `release.hasRecipient: false` y una fila en «Lista» de `debt.md`, existe `.docs/sdd/releases/vX.Y.Z/retro.md`

### El bump usa el tooling del proyecto

- GIVEN un `tech-stack.md` que declara el comando que cambia la versión (p. ej. un script de Node)
- WHEN se llega al bump
- THEN se ejecuta ese comando con la versión confirmada y no se editan los ficheros a mano

### Sin fichero de versión, la versión vive en el tag y en el changelog

- GIVEN un proyecto sin fichero de versión ni comando declarado
- WHEN se llega al bump
- THEN no se crea ningún fichero para la versión: la registran el tag anotado y la cabecera del changelog sellado

### La versión se propone desde el changelog

- GIVEN filas ✅ o 🧪 en Now, o un `[Unreleased]` con entradas
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la propuesta sale de esas filas y de esas entradas (en pre-1.0, según `versionado.md`) y va con su motivo
- AND la versión sigue esperando la confirmación explícita del usuario

### En modo tracker, el cierre lista los tickets

- GIVEN `ids.mode: tracker`
- WHEN se presenta el resumen de cierre
- THEN incluye los ids de ticket de las filas de Now que entran en la versión

### La línea de smoke se cuenta igual en todas las releases

- GIVEN el cierre de una release
- WHEN se escribe la línea de smoke bajo la cabecera de la versión en `CHANGELOG.md`
- THEN tiene la forma `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, donde N cuenta solo defectos del comportamiento entregado detectados por el smoke sobre la rama integrada
- AND si no se ejecutó smoke, la línea es `smoke: pendiente`

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
- AND si `develop` cambió el fichero publicado desde la base de la sesión (`git merge-base`), escribe `develop cambió <ruta publicada> desde tu base: integra develop antes de publicar` (`.docs/sdd/roadmap.md` en este caso), sale con 1 y `develop` no cambia
- AND si `D:\code\salas` tiene cambios sin commitear en el fichero publicado, escribe `destino con cambios: <ruta publicada> en D:\code\salas`, sale con 1 y `develop` no cambia
- AND en un proyecto con la estructura 3.0.0, `node sdd.js roadmap publish --message "…" ROADMAP.md` publica igual el `ROADMAP.md` de la raíz del proyecto, y también se aceptan `CHANGELOG.md` y `PRODUCT.md` de esa raíz
- AND sin `merge.into` en `sdd-kit.json` ni `--into`, o con una ruta que no está bajo `.docs/sdd/` ni es `ROADMAP.md`, `CHANGELOG.md` o `PRODUCT.md` de la raíz del proyecto (`docs/ROADMAP.md`, `README.md` o `src/app.ts`), sale con 2 sin escribir

### El cierre no procesa el feedback de una reunión

- GIVEN un cierre en el que el usuario aporta la transcripción o las notas de una demo o reunión
- WHEN se ejecuta `sdd-end-release`
- THEN no escribe acta ni triaje (`feedback.md`) y dice que ese feedback es entrada de `sdd-roadmap`
- AND el cierre sigue con sus cinco pasos, sin esperar a que se procese

### El corte exige la suite completa en verde sobre su sha, o el último verde de la CI en ese sha

- GIVEN la release 3.1.0 que se corta sobre `9f8e7d6`, el `HEAD` de `develop` al arrancar el corte, y la CI de la base con su último verde en `1a2b3c4`
- WHEN `sdd-end-release` pasa su gate de entrada
- THEN corre todas las suites de §Testing, sin `--affected`, antes de sellar el changelog
- AND si la CI dio `success` en `9f8e7d6`, no corre nada
- AND si la CI dio `failure` en `9f8e7d6`, o la suite completa sale en rojo, no corta: lo arregla un patch, y el corte vuelve a empezar
- AND sin «CI de la base», o con `ninguna`, corre siempre la suite completa

### El corte saca lo hecho de Now al changelog

- GIVEN un `ROADMAP.md` con Now `## Now — 1.4.0 · en preparación`, la 0012 ✅, el patch 0013 ✅, la 0014 `🧪 validación diferida a el smoke de la 1.4` y la 0015 ⏳, un `CHANGELOG.md` con `## [Unreleased]` vacío, y un dev-lead que confirma la 1.4.0 y dice que probó exportar, sin mencionar la 0014
- WHEN `sdd-end-release` corta el 2026-10-31
- THEN `CHANGELOG.md` tiene `## [1.4.0] - 2026-10-31` con una línea de la 0012 en `### Added`, una de la 0013 en `### Fixed` y una de la 0014, y un `## [Unreleased]` vacío encima
- AND en Now quedan la 0015 ⏳ y la 0014 con `🧪 validación diferida a <disparador nuevo>`; la 0012 y la 0013 salen, y el título es `## Now`
- AND la categoría sale del artefacto de la fila: en un patch, la que da su clase
- AND `sdd roadmap check` escribe `Roadmap válido` antes de proponer merge y tag

### Una fila validada en un corte posterior sale sin otra entrada

- GIVEN la 0014 🧪 en Now, con su línea en `## [1.4.0]`, o un id que `[Unreleased]` ya nombra
- WHEN el corte de la 1.5.0 la publica, o el dev-lead dice que la probó
- THEN esa fila sale de Now y `CHANGELOG.md` no gana una segunda línea de ese id
- AND una fila 🧪 validada gana su adenda fechada en el walkthrough

### Sin changelog, el mensaje del tag nombra lo publicado

- GIVEN un proyecto sin `CHANGELOG.md`, con la 0012 ✅ en Now y la 0016 de Next con «Tras» `0012`
- WHEN se corta la 1.4.0
- THEN la 0012 sale de Now, el mensaje del tag anotado la nombra y el «Tras» de la 0016 pasa a `—`
- AND no se crea `CHANGELOG.md` y no caduca ninguna fila de `debt.md`

### El corte caduca la deuda en espera

- GIVEN un `CHANGELOG.md` con `## [1.3.0] - 2026-08-01` y `## [1.2.0] - 2026-06-01`; en «En espera», filas del 2026-05-01, 2026-07-01 y 2026-08-15
- WHEN el corte sella la 1.4.0
- THEN las dos primeras de «En espera» salen de `debt.md`, con `caducada` en el cuerpo del commit del corte, y la del 2026-08-15 se queda: solo tiene una release después
- AND `debt.md` no gana una sección «Descartadas»
- AND un `## [1.3.1]` no cuenta, y el resumen de cierre nombra lo caducado
- AND el agente no pregunta

### El corte saca de «Lista» lo saldado

- GIVEN en «Lista» de `debt.md` una fila con prefijo `**[Feature 0009, 2026-07-20: saldada — …]**` y otra sin prefijo
- WHEN se corta la 1.4.0
- THEN la primera sale y la segunda se queda

### El primer corte rescata las validaciones pendientes de la migración

- GIVEN un commit que borró `.docs/sdd/roadmap.md` tras la `1.3.0`, cuyo contenido anterior dice `validaciones pendientes: 0007`, y el walkthrough de la 0007 con disparador en la 1.4
- WHEN se corta la 1.4.0 y el dev-lead valida el smoke sin mencionar la 0007
- THEN el corte la nombra en la petición de smoke, su walkthrough gana una adenda fechada con el disparador nuevo y Now gana una fila `🧪 validación diferida a <disparador nuevo>`
- AND mencionada por el dev-lead, gana la adenda con lo que probó y no gana fila
- AND en el corte siguiente, sin ese commit posterior a la última versión sellada, no se busca

### Solo se corta en la forma 3.0.0

- GIVEN un proyecto con `.docs/sdd/roadmap.md` y sin `ROADMAP.md`
- WHEN el usuario ordena «cierra la release»
- THEN el agente no sella ni toca el roadmap, dice que el corte pide la forma 3.0.0 y ofrece `sdd-upgrade`

### Sin changelog de cliente ni email

- GIVEN `release.hasRecipient: true`, un `.docs/sdd/client-changelog.md` de antes y el usuario que dice «el cliente espera sus novedades hoy»
- WHEN se corta la 1.4.0
- THEN existe `.docs/sdd/releases/v1.4.0/release-notes.md`, destilada del changelog sellado
- AND no se escribe ningún borrador de email y `client-changelog.md` no cambia

### Sin destinatario no hay release notes

- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escribe `release-notes.md` y el paso no aplica

### La estimación y los action items de la retro son opcionales

- GIVEN un proyecto con `.docs/sdd/estimation-log.md`
- WHEN `sdd-end-release` propone la versión en el paso 1
- THEN la misma propuesta ofrece la estimación y los action items de la retro en una línea, sin pregunta aparte
- AND solo se escriben si el usuario los pide, en `.docs/sdd/releases/vX.Y.Z/retro.md`, y no retienen los demás pasos
- AND sin `estimation-log.md` no se ofrecen
- AND el repaso por causa de esa retro no se ofrece: corre sin preguntar ([`project-retro`](project-retro.md))
- AND pedidos sin `debt.md`, `retro.md` lleva solo esa parte

## Reglas de la capacidad

- **Dónde viven los datos**: si la release tiene destinatario vive en `.docs/sdd/sdd-kit.json` (`release.hasRecipient`, booleano), junto a `version` e `ids`. El nombre del destinatario no se guarda en la configuración.
- **Idioma de los nombres**: la clave va en inglés camelCase, como `ids.mode`.
- **Límites**: no aplica.
- **Avisos**: una sola pregunta cuando falta el campo, la hace la primera skill del carril que lo necesita. No hay ninguna otra.
- **Regla ante conflicto**: manda el valor vigente del campo al ejecutarse cada skill. Solo lo escribe o lo cambia el usuario, directamente o respondiendo al agente. Si falta el campo o hay duda sobre quién lo escribió, se aplica el gate completo.
