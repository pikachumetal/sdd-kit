# Capacidad — migration

## Propósito

La migración de un proyecto consumidor entre versiones del kit: cómo declara la versión que tiene, qué escribe cada release y qué hace «actualízame al kit». El procedimiento vive en `skills/sdd-upgrade/SKILL.md`.

## Requisitos

### El proyecto declara la versión del kit que tiene

- GIVEN un proyecto inicializado con `sdd-init`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version` (la de `.claude-plugin/plugin.json` del kit que hizo la init), `channel` `plugin`, `updated` e `ids`, y sin la clave `init`

### La sesión avisa cuando carga un kit menor que el del proyecto

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` `1.1.0`
- WHEN arranca la sesión
- THEN el usuario ve un aviso con las dos versiones, `claude plugin update sdd-kit@sdd-kit --scope project` y que hay que reiniciar Claude Code, porque `/reload-plugins` no aplica una actualización de ámbito proyecto
- AND el agente recibe el mismo aviso al principio de su contexto
- AND con la versión cargada igual o mayor, o sin `sdd-kit.json`, no hay aviso

### Cada release lleva su migración

- GIVEN una release del kit, cambie o no la estructura de `.docs/sdd/`
- WHEN se cierra la release
- THEN existe `skills/sdd-upgrade/references/migrations/vX.Y.Z.md` con pasos verificables por predicado, o, si la release no cambia nada del proyecto, con la frase «sin cambios en el proyecto», su «Verificación» y su línea `**Escribe**:`
- AND la suite del kit falla si la `version` de `.claude-plugin/plugin.json` no tiene su fichero en esa carpeta

### Una migración sin cambios solo avanza el marcador

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y el kit 2.1.0, cuyo `v2.1.0.md` dice «sin cambios en el proyecto»
- WHEN el usuario pide «actualízame al kit»
- THEN `sdd-kit.json` queda con `version` `2.1.0` y la fecha del día, escritos con `sdd upgrade --mark 2.1.0`, y ningún otro fichero del proyecto cambia
- AND hay un commit `chore(sdd): migrar al kit v2.1.0`

### La sesión avisa cuando el proyecto tiene migraciones pendientes

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` con `v2.1.0.md` como mayor migración en `skills/sdd-upgrade/references/migrations/`
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «actualízame al kit».»
- AND el agente recibe el mismo aviso al principio de su contexto, seguido de «Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres. Con `control.profile: unattended` en `.docs/sdd/sdd-kit.json`, no ofrezcas ni migres: atiende la petición y anótalo en tu mensaje final.»
- AND con `v0.9.0.md` y `v0.10.0.md` como migraciones del kit y el marcador en `0.9.0`, el aviso dice «hasta la 0.10.0»
- AND con el kit cargado menor que el marcador y migraciones pendientes a la vez, salen los dos avisos, primero el de la versión
- AND con el marcador en `2.1.0`, sin `sdd-kit.json`, con un `sdd-kit.json` en curso (sin `version`) o sin carpeta de migraciones en el kit cargado, no hay aviso de migraciones, y el hook sigue inyectando `using-sdd`

### Un proyecto ya inicializado se migra, no se re-inicializa

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` sin la clave `init`, o con `.docs/sdd/mission.md` y sin `sdd-kit.json`, y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-upgrade`
- THEN ejecuta `sdd upgrade --root <raíz>`, que lista las migraciones posteriores a la `version` de `sdd-kit.json` hasta la mayor del kit cargado, en orden SemVer
- AND sin `sdd-kit.json`, la pregunta de si es un proyecto anterior a la v0.2.0, la recomendada, o una init de la 2.x que se cortó la hace el predicado 4 de `sdd-init`: si la sesión aún no la respondió, `sdd-upgrade` invoca `sdd-init`; con «anterior a la v0.2.0», `sdd-upgrade` las aplica todas, y con «init cortada», sigue la init sin migrar
- AND las aplica en orden, con gate por fichero, y al acabar cada versión ejecuta su «Verificación», escribe el marcador con `sdd upgrade --mark <versión>` y hace su commit
- AND no regenera los documentos de anclaje desde cero ni vuelca `capabilities/`: una migración solo los reestructura con una tabla de destinos y su gate
- AND con la `version` igual a la mayor migración del kit cargado, `sdd upgrade` escribe «el proyecto ya está al día con el kit <versión>» y el agente no toca nada
- AND un `sdd-kit.json` con la clave `init` no se migra: `sdd upgrade` escribe «init en curso: sigue con sdd-init», y la init sigue por `sdd-init` ([`onboarding`](onboarding.md))
- AND pedida a `sdd-init`, la migración la hace `sdd-upgrade`: `sdd-init` no aplica ninguna migración

### El `funcional.md` heredado se conserva como legado

- GIVEN un proyecto con `funcional.md`
- WHEN se aplica la migración a v1.0.0
- THEN el fichero pasa a `capabilities/legacy.md` con una nota de excepción temporal, y ninguna capacidad se crea de golpe

### La copia local del script de estimación se retira

- GIVEN un proyecto con `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/Build-EstimationLog.ps1`
- WHEN se aplica la migración a v1.0.0
- THEN se borra la copia, se regenera `estimation-log.md` con el script del kit y el diff del log se presenta al dev-lead antes de commitear

### Un proyecto que ya migró a v1.0.0 recibe el rename por `v1.1.0.md`

- GIVEN un proyecto cuyo `sdd-kit.json` declara `1.0.0` y que tiene `funcional/` en disco
- WHEN se aplica la migración a v1.1.0
- THEN `funcional/` pasa a `capabilities/`, `legado.md` a `legacy.md` y `changelog-cliente.md` a `client-changelog.md`, con gate por ser rename masivo
- AND si el proyecto no tiene `funcional/`, el paso se salta y se dice — la migración es idempotente
- AND los nombres de capacidad en castellano se presentan al dev-lead con su propuesta en inglés: el sustantivo del dominio es suyo, no del kit

### La migración a v2.0.0 pregunta el modo de ids

- GIVEN un proyecto que migra a v2.0.0 y cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN se aplica `migrations/v2.0.0.md`
- THEN el paso es un **gate**: invoca `sdd-config`, que presenta los dos modos con la pregunta de su catálogo, y escribe la respuesta
- AND si el dev-lead no está, el paso queda pendiente explícito y el proyecto sigue funcionando en `tracker`

### La migración a v2.0.0 pregunta las claves de control que faltan

- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo, `merge.push` con el bloque `merge` completo, las claves de frenos (`control.maxParallelAgents`, `control.silence.*`) o `execution`
- WHEN se aplica `migrations/v2.0.0.md`
- THEN el agente invoca `sdd-config`, que hace una por turno las preguntas de su catálogo que corresponden a lo que falta, las mismas que en la init y con la misma recomendación, y escribe solo lo que se responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults (`execution: auto` incluido), con el paso 10 del cierre preguntando el merge y sin push, y el informe dice cómo reanudarlo

### La migración a v2.0.0 deja la configuración que deja la init

- GIVEN un proyecto que migra a v2.0.0 sin `"autoMemoryEnabled": false` en `.claude/settings.json` o sin `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` en `.gitignore`
- WHEN se aplica `migrations/v2.0.0.md`
- THEN el proyecto queda con la clave y las tres líneas, las que dejaba la init de la 2.x, sin duplicar líneas ni tocar las demás claves
- AND si la clave estaba a `true`, el agente pregunta antes de cambiarla; si el usuario dice que no, se queda en `true` y el informe lo anota
- AND si ya estaban, el paso se salta y lo dice

### La memoria ya guardada se vuelca a los docs antes de borrarse

- GIVEN un proyecto que migra a v2.0.0 y cuya carpeta de memoria de Claude Code tiene entradas
- WHEN se aplica el paso de la memoria
- THEN el agente presenta cada entrada con el documento de anclaje al que iría, o «ya está en `<doc>`», y espera el «sí»
- AND tras el «sí» vuelca las que faltan y borra solo las entradas volcadas o ya presentes
- AND sin dev-lead no borra nada y el informe deja el paso pendiente explícito, con cómo reanudarlo

### Lo que escribe una migración lo reciben también las init

- GIVEN una migración de `skills/sdd-upgrade/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init`, contando su `SKILL.md`, sus `references/`, los documentos que estos enlazan salvo `skills/sdd-upgrade/`, `sdd-config` incluido, y los `.ts` de `cli/src/init/`
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en la init o en una migración, o si una de ellas no nombra `sdd-config`

### La migración a v2.0.0 quita el historial de las capacidades

- GIVEN un proyecto en el kit v1.1.0 con `capabilities/bookings.md` terminado en `## Historial` con dos líneas
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` pierde la sección `## Historial` entera, con su ayuda y sus líneas, y nada más, sin gate
- AND la verificación de la migración ejecuta `sdd capability check --path .docs/sdd`; si falla por otra cosa que el historial (un bloque de reglas del delta pegado, un requisito sin escenario), el informe lo lista como pendiente del dev-lead, sin tocarlo
- AND `tests/MigrationInitParity.Tests.ps1` sigue en verde con `v2.0.0.md` en la carpeta
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

### La migración a v2.0.0 añade el propósito a las capacidades

- GIVEN un proyecto en el kit v1.1.0 con `capabilities/bookings.md`, que abre con el párrafo «Verdad viva de las reservas de salas por franja. La declaró la spec de la task 0003.» y no tiene `## Propósito`
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` lleva tras el título `## Propósito` con una o dos frases de 300 caracteres como máximo sacadas de ese párrafo sin la procedencia («Reservas de salas por franja.»), y el párrafo desaparece
- AND si la capacidad no tiene párrafo bajo el título, el propósito sale de los títulos de sus requisitos
- AND va sin gate, y el informe lista las capacidades a las que se ha escrito el propósito, para que el dev-lead lo revise en el diff
- AND la verificación de la migración ejecuta `sdd capability check --path .docs/sdd`, y no queda ningún fallo del propósito
- AND la línea `**Escribe**:` de `v2.0.0.md` no gana tokens: el paso va en su frase «Además…», como el del historial, y `tests/MigrationInitParity.Tests.ps1` sigue en verde
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

### La migración a v2.0.0 cambia los nombres de las skills de feature

- GIVEN un proyecto en el kit v1.1.0 cuyo `CLAUDE.md` dice «arranca el trabajo con `sdd-start-task`», cuyo `.docs/sdd/constitution.md` cita `sdd-end-task`, y con `specs/20260910-080000-task-0012-login/spec.md`, que también cita `sdd-end-task`
- WHEN se migra al kit v2.0.0
- THEN `CLAUDE.md` dice «arranca el trabajo con `sdd-start-feature`» y `constitution.md` cita `sdd-end-feature`, sin gate
- AND `specs/20260910-080000-task-0012-login/spec.md` sigue citando `sdd-end-task`, y la carpeta no se renombra
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la verificación de la migración, con `git grep --untracked -nE 'sdd-(start|end)-task' -- CLAUDE.md AGENTS.md ':(glob).docs/sdd/*.md' ':(glob).docs/sdd/capabilities/*.md' ':!.docs/sdd/changelog.md' ':!.docs/sdd/client-changelog.md' ':!.docs/sdd/roadmap.md'`, no devuelve nada, también en un proyecto sin `AGENTS.md`

### La migración a v2.0.0 declara el marketplace de superpowers

- GIVEN un proyecto que migra a v2.0.0 sin `extraKnownMarketplaces.superpowers-marketplace` en `.claude/settings.json`
- WHEN se aplica `v2.0.0.md`
- THEN `.claude/settings.json` gana esa entrada con la fuente `github` `obra/superpowers-marketplace`, sin tocar las demás claves ni entradas y sin gate
- AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`
- AND si la entrada ya está y el marketplace aparece en la lista, el paso se salta y lo dice

### La migración a v2.3.0 lleva el roadmap a la forma de la plantilla

- GIVEN un proyecto en 2.2.0 con `roadmap.md` commiteado en `284d195`, que falla `sdd roadmap check` (sección «Versión siguiente», decisiones en prosa, una fila saldada antes de la última release), y el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente presenta una tabla con cada bloque que sale o se mueve y su destino, y espera la aprobación antes de cambiar `roadmap.md`
- AND tras aprobar, `sdd roadmap check` escribe `Roadmap válido` y sale con 0
- AND el informe y el cuerpo del commit de la migración llevan `git show 284d195:.docs/sdd/roadmap.md` como la forma de ver el roadmap anterior
- AND si el dev-lead cambia un destino de la tabla, se aplica el suyo; si la rechaza, `roadmap.md` queda sin tocar y el paso, pendiente
- AND con `roadmap.md` sin commitear, el paso para antes de la tabla y lo dice
- AND `v2.3.0.md` declara en su línea `**Escribe**:` `roadmap.md`, `validation.mode` y el marcador, y `tests/MigrationInitParity.Tests.ps1` sigue en verde

### La migración a v2.3.0 pregunta quién valida

- GIVEN un proyecto en 2.2.0 cuyo roadmap pasa `sdd roadmap check` y cuyo `sdd-kit.json` no tiene `validation.mode`, con el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente invoca `sdd-config`, que hace su pregunta de quién valida con la recomendación de su catálogo, y escribe en `sdd-kit.json` solo lo que responde el dev-lead
- AND con `validation.mode` ya escrito, el paso se salta y el informe lo dice
- AND con el dev-lead ausente no escribe la clave, y nunca `field`: el informe la lista como pendiente, con cómo reanudarla (invocar `sdd-config`), el proyecto sigue en `manual` y el marcador sube a 2.3.0

### Con el dev-lead ausente, la migración del roadmap queda pendiente

- GIVEN el mismo proyecto y una petición que dice que el dev-lead no está
- WHEN el agente llega al paso del roadmap
- THEN deja `roadmap.md` sin tocar y pone la tabla de destinos en el informe como pendiente, con cómo reanudarla
- AND no hay commit de la migración ni cambia el marcador de `sdd-kit.json`, como fija el procedimiento de migraciones para un gate sin resolver
- AND la sesión siguiente sigue avisando de migraciones pendientes hasta la 2.3.0

### Un roadmap que ya tiene la forma no se migra

- GIVEN un proyecto en 2.2.0 cuyo roadmap pasa `sdd roadmap check`
- WHEN se aplica `v2.3.0.md`
- THEN el paso del roadmap se salta, el informe lo dice, `roadmap.md` no cambia y el marcador sube a 2.3.0

### La migración del roadmap no inventa datos

- GIVEN un roadmap con la 0022 y la 0024 pendientes en «Versión siguiente», en una tabla de cinco columnas y sin versión decidida; la 0021 con 🧪 y publicada en la 1.2.0; y la decisión pendiente «si las reservas de más de 4 horas necesitan aprobación de recepción»
- WHEN la migración propone los destinos
- THEN la tabla pregunta si hay una release en preparación y con qué versión: con «sí, la 1.3», la 0022 y la 0024 van a `## Release 1.3` con sus cinco columnas; con «no», van a «Próximo» con «Origen: …» y «Ficheros: …» al final de su celda «Ítem»
- AND el agente no propone un número de versión por su cuenta
- AND la 0021 sale de la sección abierta y su id entra en `validaciones pendientes:` de la v1.2.0
- AND la decisión pendiente es una fila de «Backlog» con el número siguiente del Backlog, sin id de la secuencia de features
- AND una celda que la tabla destino exige y el roadmap anterior no traía lleva `—`

### El agente ofrece la migración antes de atender la petición

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.3.3`, el kit cargado con `v2.3.4.md` como mayor migración, y la primera petición de la sesión «Mete un filtro por sala en el comando libres.»
- WHEN el agente responde
- THEN lo primero que hace es preguntar si aplica las migraciones hasta la 2.3.4, con «sí» y «no» como respuestas
- AND no cambia `sdd-kit.json` ni ningún otro fichero antes de la respuesta
- AND con el «no», atiende la petición por su puerta (`sdd-propose`) y no vuelve a ofrecer la migración en esa sesión
- AND con el «sí», invoca `sdd-upgrade`, que deja `version` en `2.3.4` y su commit, y después atiende «Mete un filtro por sala…» por `sdd-propose`
- AND si la primera petición es «Actualízame al kit.», invoca `sdd-upgrade` sin preguntar antes
- AND con `control.profile: unattended` no pregunta ni migra, atiende la petición y su mensaje final dice que quedan migraciones pendientes hasta la 2.3.4

### Un paso que borra o reestructura pregunta antes aunque su migración no lo marque

- GIVEN un proyecto en `9.9.8`, un kit con `v9.9.9.md` cuyo paso 1, sin marca **gate**, dice «borra `.docs/sdd/legacy.md`», y la petición «actualízame al kit, el dev-lead no está»
- WHEN el agente llega a ese paso
- THEN `.docs/sdd/legacy.md` sigue en disco y el informe lista el paso como pendiente, con su comando
- AND no hay commit de la migración ni cambia el marcador de `sdd-kit.json`
- AND con el dev-lead presente, presenta el borrado y espera su «sí» antes de ejecutarlo
- AND lo mismo vale para un paso sin marca que borra una sección entera o una clave de un JSON, o cambia la ruta de un fichero; un paso que solo sustituye un nombre, o uno que su migración marca «sin gate», se ejecuta sin preguntar

### La migración a v3.0.0 lleva los documentos de producto y de operaciones a su sitio

- GIVEN un proyecto en 2.3.4 con `.docs/sdd/mission.md` («Por qué existe», «Usuarios y roles», «Qué es y qué no es», «Dominio» con «**Franja**: una hora reservable»), `tech-stack.md` («Tecnologías» con Node 22 y Vitest, que ya fija `package.json`; «Comandos»; «Testing»; «Decisiones abiertas» con «¿avisos por correo?») y `environments.md`, todo commiteado, y el dev-lead presente
- WHEN pide «actualízame al kit»
- THEN el agente presenta una tabla con cada sección, su destino y el texto resultante de lo que se reescribe, y no mueve nada antes de su «sí»
- AND tras el «sí» hay un `PRODUCT.md` en la raíz con `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology` con «**Franja**:», y un `.docs/sdd/steering/operations.md` con `## Comandos`, `## Testing` y `## Entornos`
- AND «¿avisos por correo?» es una fila de Later en `ROADMAP.md` con el `B<n>` siguiente al mayor del Backlog, «Tecnologías» no está en ningún documento, y no quedan `mission.md`, `tech-stack.md` ni `environments.md` en `.docs/sdd/`
- AND el informe y el cuerpo del commit dicen `git show <sha>:.docs/sdd/mission.md`, y lo mismo para los otros dos

### La migración a v3.0.0 mueve los documentos de estado a `steering/` y el changelog a la raíz

- GIVEN el mismo proyecto con `.docs/sdd/constitution.md` (que enlaza `decisions/0001-…`), `architecture.md`, `estimation.md`, `estimation-log.md` y `changelog.md`, un `CLAUDE.md` y un `README.md` que enlazan `.docs/sdd/constitution.md`, y una ADR que enlaza `../mission.md`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN los cuatro primeros están en `.docs/sdd/steering/` con su contenido intacto salvo el enlace, que pasa a `../decisions/0001-…`; `estimation-log.md` lo ha regenerado `sdd estimation log`, y `changelog.md` es `CHANGELOG.md` en la raíz
- AND los enlaces de `CLAUDE.md` y `README.md` apuntan a `.docs/sdd/steering/constitution.md`, la ADR no cambia y el informe la lista con su enlace roto
- AND `specs/`, `capabilities/`, `decisions/` y `releases/` siguen donde estaban

### La migración a v3.0.0 lleva el roadmap a Now, Next y Later

- GIVEN un `roadmap.md` 2.x sin release en preparación, con la 0021 y la 0022 en «Próximo» (la 0022 con «tras 0021» y «`proposal: 0019`»), B3 en «Backlog», el patch 0023 posterior a la última release cerrada y el 0017 anterior, y la release cerrada con `validaciones pendientes: 0016`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla, con el Tamaño `M` para la 0021 y la 0022
- THEN `ROADMAP.md` tiene en Now la 0021 y la 0022 con su brief plegado (la 0022 con «Tras» 0021 y `**Requisitos:**` hacia la propuesta 0019), Tamaño `M`, y el patch 0023 con `✅` y `**Carril:** patch`; en Later, la B3
- AND no aparecen ni el 0017 ni la 0016, y la tabla y el informe nombran la 0016 como validación pendiente que sigue en su walkthrough
- AND la tabla deja el Tamaño como «lo decide el dev-lead» antes de su respuesta, sin proponer uno
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`, y no queda `.docs/sdd/roadmap.md`

### La migración a v3.0.0 lleva la deuda a `debt.md` sin inventar celdas

- GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente` y una saldada posterior a la última release cerrada
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN `.docs/sdd/steering/debt.md` tiene la primera en «Lista» con destino 0022 y el ticket como evidencia, y la saldada en «Lista» con su prefijo `**[… saldada …]**` intacto
- AND la de `sin fila` y la de `versión siguiente` están en «Por triar», la de `**Esperar**` en «En espera» y la `**Descartada**` en «Descartadas» con «duplica la 0018» como motivo
- AND cada «Fecha» es la del commit que añadió su fila al roadmap, y la tabla dice de dónde salió
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`

### Sin el dev-lead, la migración a v3.0.0 no mueve nada

- GIVEN el mismo proyecto y la petición «actualízame al kit, el dev-lead no está»
- WHEN el agente llega a los pasos de la v3.0.0
- THEN ningún documento cambia de sitio ni de forma, y el informe lista cada tabla de destinos como pendiente, con cómo reanudarla
- AND no hay commit de la migración ni cambia el marcador

### La migración a v3.0.0 cambia los nombres de las skills retiradas

- GIVEN un proyecto en 2.3.4 cuyo `CLAUDE.md` dice «Cierra cada feature con `sdd-end-feature`.», con `.claude/commands/pregunta.md` que dice «Usa `/sdd-consult` para responder.» y con una carpeta de `specs/` cuyo `walkthrough.md` cita `sdd-end-feature`
- WHEN se aplica la v3.0.0
- THEN `CLAUDE.md` dice «Cierra cada feature con `sdd-archive`.» y `pregunta.md` dice «Usa `/sdd-explore` para responder.», sin gate
- AND `sdd-end-patch` pasa a `sdd-archive`, y `sdd-init-greenfield` y `sdd-init-brownfield` a `sdd-init`, en `CLAUDE.md`, `AGENTS.md`, `.docs/sdd/*.md`, `.docs/sdd/steering/*.md`, `.docs/sdd/capabilities/*.md`, `.claude/skills/` y `.claude/commands/`
- AND el `walkthrough.md` de `specs/` sigue citando `sdd-end-feature`, y tampoco cambian `CHANGELOG.md`, `decisions/`, `releases/` ni `kit-feedback/`
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la «Verificación», con `git grep --untracked -nE 'sdd-(end-feature|end-patch|consult|init-greenfield|init-brownfield)'` sobre esas rutas (las carpetas con `:(glob)`, y sin `changelog.md`, `client-changelog.md` ni `roadmap.md` de `.docs/sdd/`), no devuelve nada, también sin `AGENTS.md` ni `.claude/`

### La migración a v3.0.0 lleva el método nuevo al `estimation.md` del proyecto

- GIVEN un proyecto cuyo `steering/estimation.md` tiene las líneas de la plantilla 2.x «El `walkthrough.md` registra el tiempo real. Si la desviación supera el ±30 %, …» y «Los patches registran solo el tiempo real.»
- WHEN se aplica la v3.0.0
- THEN la primera gana, tras «registra el tiempo real.», «Cuenta desde el arranque de la sesión que abre el trabajo, con la investigación previa; una espera a una respuesta del dev-lead va aparte, con su duración.», y la segunda pasa a ser la línea de patches de `estimation-template.md` con `(post hoc)`, sin gate
- AND las «Notas de calibración» del proyecto no cambian
- AND con un método que no tiene esos literales («Método: horas por task.»), el agente presenta el texto del proyecto y las dos líneas nuevas, y no cambia el fichero sin el «sí»
- AND sin `estimation.md`, el paso se salta y lo dice

### La migración a v3.0.0 corrige las rutas viejas escritas entre backticks

- GIVEN un proyecto cuyo `CLAUDE.md` dice «El roadmap vive en `.docs/sdd/roadmap.md`.» y cuyo `README.md` cita `` `.docs/sdd/constitution.md` ``
- WHEN se aplica la v3.0.0 y el dev-lead aprueba las tablas de los pasos 1 y 3
- THEN `CLAUDE.md` dice «El roadmap vive en `ROADMAP.md`.» y `README.md` cita `` `.docs/sdd/steering/constitution.md` ``
- AND solo cambian las rutas entre backticks de `CLAUDE.md`, `AGENTS.md` y `README.md` cuyo documento se movió en un paso aprobado

### La migración a v3.0.0 cierra con el marcador y después revisa las reglas del proyecto

- GIVEN un proyecto que migra a v3.0.0 con el dev-lead presente, cuya `steering/constitution.md` dice «**Ids**: el id de una feature se elige a mano, el siguiente libre del roadmap.»
- WHEN se aplican y aprueban los pasos de la v3.0.0
- THEN `sdd-kit.json` queda con `version` `3.0.0`, escrito con `sdd upgrade --mark 3.0.0`, y hay un commit `chore(sdd): migrar al kit v3.0.0`
- AND después el agente presenta una tabla con cada regla de `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` y `steering/` que repite o contradice el kit instalado, con su fichero y línea, la ruta del kit que la cubre y su propuesta; la regla de los ids sale con la ruta de `skills/sdd-start-feature/references/nombrado.md`
- AND solo cambia lo que el dev-lead aprueba, en un commit `chore(sdd): reglas del proyecto que ya cubre el kit`
- AND una regla sin una ruta del kit que la cubra no sale en la tabla; sin ninguna, el paso se salta y lo dice
- AND sin el dev-lead, la tabla va al informe como pendiente, con cómo reanudarla, y ni la constitution ni el marcador dependen de ella

### La migración a v3.0.0 enseña lo que un gate deja pendiente o regenera

- GIVEN un proyecto cuyo `tech-stack.md` tiene en «Decisiones abiertas» «¿avisos por correo?», con el paso 2 aprobado y el paso 3 rechazado
- WHEN acaba la migración
- THEN el informe nombra «¿avisos por correo?» junto al paso 3 pendiente, con `git show <sha>:.docs/sdd/tech-stack.md`
- AND la `estimation-log.md` regenerada se enseña antes del gate del paso 1, generada en una carpeta temporal con `sdd estimation log --out`, y la del proyecto solo se regenera tras el «sí»

## Reglas de la capacidad

- **Dónde viven los datos**: las migraciones viven en `skills/sdd-upgrade/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto, que escribe `sdd upgrade --mark`; lo que escribe cada migración, en su línea `**Escribe**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`. El roadmap anterior a la migración a v2.3.0, en el commit que nombran el informe y el commit de la migración. Los `mission.md`, `tech-stack.md`, `environments.md` y `roadmap.md` anteriores a la migración a v3.0.0, en el commit que nombran su informe y su commit (`git show <sha>:<ruta>`); los documentos de estado, en `.docs/sdd/steering/` tras ella.
- **Idioma de los nombres**: los nombres que una migración crea o renombra en el proyecto van en inglés kebab-case, salvo los tres documentos de la raíz que fija el Art. IV en mayúsculas: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md`.
- **Límites**: no aplica.
- **Avisos**: la sesión avisa, al usuario y al agente, cuando el kit cargado es menor que el marcador del proyecto (actualizar el plugin) y cuando el marcador es menor que la mayor migración del kit cargado (migrar el proyecto); en el segundo caso el agente ofrece migrar antes de atender la primera petición y no migra sin el «sí», salvo con `control.profile: unattended`, que ni ofrece ni migra y lo anota en su mensaje final; un paso con gate que el dev-lead no responde queda como pendiente explícito en el informe, con cómo reanudarlo; no se ejecuta ni se deja preparado; un paso sin marca que borra un fichero, una sección entera o una clave, o que cambia la ruta de un fichero, es un gate.
- **Regla ante conflicto**: un paso que su migración marca «sin gate» se ejecuta sin preguntar aunque borre o reestructure; la regla del gate de un paso que borra o reestructura cubre solo los pasos sin marca. Un documento que una migración lleva a la raíz y ya existe allí (`PRODUCT.md` de impeccable, un `CHANGELOG.md`) se funde sección a sección con gate: ninguno pisa al otro.
