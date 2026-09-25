# Capacidad — migration

## Propósito

La migración de un proyecto consumidor entre versiones del kit: cómo declara la versión que tiene, qué escribe cada release y qué hace «actualízame al kit». El procedimiento vive en `skills/sdd-init-brownfield/references/migrations/README.md`.

## Requisitos

### El proyecto declara la versión del kit que tiene
- GIVEN un proyecto inicializado con `sdd-init-greenfield` o `sdd-init-brownfield`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version`, `channel`, `updated` e `ids`

### Cada release con cambio estructural lleva su migración
- GIVEN una release del kit que cambia la estructura de `.docs/sdd/` o retira algo del proyecto
- WHEN se cierra la release
- THEN existe `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md` con pasos verificables por predicado

### Un proyecto ya inicializado se migra, no se re-inicializa
- GIVEN un proyecto con `.docs/sdd/` y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-init-brownfield`
- THEN lee `sdd-kit.json` (o asume anterior a v0.2.0 si no existe), aplica en orden las migraciones posteriores a esa versión hasta la mayor disponible, con gate por fichero, y escribe el marcador al final
- AND no regenera los documentos de anclaje ni vuelca `capabilities/`

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

### La migración a v1.2.0 pregunta el modo de ids
- GIVEN un proyecto que migra a v1.2.0 y cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el paso es un **gate**: invoca `sdd-config`, que presenta los dos modos con la pregunta de su catálogo, y escribe la respuesta
- AND si el dev-lead no está, el paso queda pendiente explícito y el proyecto sigue funcionando en `tracker`

### La migración a v1.2.0 pregunta las claves de control que faltan
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo, `merge.push` con el bloque `merge` completo, las claves de frenos (`control.maxParallelAgents`, `control.silence.*`) o `execution`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el agente invoca `sdd-config`, que hace una por turno las preguntas de su catálogo que corresponden a lo que falta, las mismas que en la init y con la misma recomendación, y escribe solo lo que se responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults (`execution: auto` incluido), con el paso 10 del cierre preguntando el merge y sin push, y el informe dice cómo reanudarlo

### La migración a v1.2.0 deja la configuración que deja la init
- GIVEN un proyecto que migra a v1.2.0 sin `"autoMemoryEnabled": false` en `.claude/settings.json` o sin `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` en `.gitignore`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el proyecto queda con la clave y las tres líneas, igual que tras una init, sin duplicar líneas ni tocar las demás claves
- AND si la clave estaba a `true`, el agente pregunta antes de cambiarla; si el usuario dice que no, se queda en `true` y el informe lo anota
- AND si ya estaban, el paso se salta y lo dice

### La memoria ya guardada se vuelca a los docs antes de borrarse
- GIVEN un proyecto que migra a v1.2.0 y cuya carpeta de memoria de Claude Code tiene entradas
- WHEN se aplica el paso de la memoria
- THEN el agente presenta cada entrada con el documento de anclaje al que iría, o «ya está en `<doc>`», y espera el «sí»
- AND tras el «sí» vuelca las que faltan y borra solo las entradas volcadas o ya presentes
- AND sin dev-lead no borra nada y el informe deja el paso pendiente explícito, con cómo reanudarlo

### Lo que escribe una migración lo reciben también las init
- GIVEN una migración de `skills/sdd-init-brownfield/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Escribe**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init-greenfield` o en `sdd-init-brownfield`, contando su `SKILL.md`, sus `references/` y los documentos que estos enlazan, `sdd-config` incluido
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en una init o en una migración, o si una de ellas no nombra `sdd-config`

### La migración a v2.0.0 quita el historial de las capacidades
- GIVEN un proyecto en el kit v1.2.0 con `capabilities/bookings.md` terminado en `## Historial` con dos líneas
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` pierde la sección `## Historial` entera, con su ayuda y sus líneas, y nada más, sin gate
- AND la verificación de la migración ejecuta `Test-Capabilities.ps1 -Path .docs/sdd`; si falla por otra cosa que el historial (un bloque de reglas del delta pegado, un requisito sin escenario), el informe lo lista como pendiente del dev-lead, sin tocarlo
- AND `tests/MigrationInitParity.Tests.ps1` sigue en verde con `v2.0.0.md` en la carpeta
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

### La migración a v2.0.0 añade el propósito a las capacidades
- GIVEN un proyecto en el kit v1.2.0 con `capabilities/bookings.md`, que abre con el párrafo «Verdad viva de las reservas de salas por franja. La declaró la spec de la task 0003.» y no tiene `## Propósito`
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` lleva tras el título `## Propósito` con una o dos frases de 300 caracteres como máximo sacadas de ese párrafo sin la procedencia («Reservas de salas por franja.»), y el párrafo desaparece
- AND si la capacidad no tiene párrafo bajo el título, el propósito sale de los títulos de sus requisitos
- AND va sin gate, y el informe lista las capacidades a las que se ha escrito el propósito, para que el dev-lead lo revise en el diff
- AND la verificación de la migración ejecuta `Test-Capabilities.ps1 -Path .docs/sdd`, y no queda ningún fallo del propósito
- AND la línea `**Escribe**:` de `v2.0.0.md` no gana tokens: el paso va en su frase «Además…», como el del historial, y `tests/MigrationInitParity.Tests.ps1` sigue en verde
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

### La migración a v2.0.0 cambia los nombres de las skills de feature
- GIVEN un proyecto en el kit v1.2.0 cuyo `CLAUDE.md` dice «arranca el trabajo con `sdd-start-task`», cuyo `.docs/sdd/constitution.md` cita `sdd-end-task`, y con `specs/20260910-080000-task-0012-login/spec.md`, que también cita `sdd-end-task`
- WHEN se migra al kit v2.0.0
- THEN `CLAUDE.md` dice «arranca el trabajo con `sdd-start-feature`» y `constitution.md` cita `sdd-end-feature`, sin gate
- AND `specs/20260910-080000-task-0012-login/spec.md` sigue citando `sdd-end-task`, y la carpeta no se renombra
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la verificación de la migración, con `Select-String -Path CLAUDE.md, AGENTS.md, .docs/sdd/*.md, .docs/sdd/capabilities/*.md -Exclude changelog.md, client-changelog.md, roadmap.md -Pattern 'sdd-(start|end)-task' -ErrorAction SilentlyContinue` (sin `AGENTS.md`, esa ruta no cuenta), no devuelve nada

## Reglas de la capacidad

- **Dónde viven los datos**: las migraciones viven en `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto; lo que escribe cada migración, en su línea `**Escribe**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`.
- **Idioma de los nombres**: los nombres que una migración crea o renombra en el proyecto van en inglés kebab-case.
- **Límites**: no aplica.
- **Avisos**: un paso con gate que el dev-lead no responde queda como pendiente explícito en el informe, con cómo reanudarlo; no se ejecuta ni se deja preparado.
- **Regla ante conflicto**: no aplica.
