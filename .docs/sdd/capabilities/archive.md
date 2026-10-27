# Capacidad — archive

## Propósito

el cierre de una feature o de un patch con `sdd-archive`: lo que comprueba antes de escribir, la base integrada y la suite, los registros, las ADR, «qué sigue» y el merge.

## Requisitos

### El cierre de una feature y el de un patch van por la misma skill

- GIVEN la rama `feature/0081-booking-reminders` con su `spec.md` aprobada y todas sus tasks hechas, y la rama `patch/0082-slot-overlap` con su `patch.md` y el fix commiteado
- WHEN se cierra cada una
- THEN las dos se cierran con `sdd-archive`
- AND el cierre de la 0081 escribe `walkthrough.md`, actualiza `tasks.md` y hace la revisión de skills
- AND el cierre de la 0082 no escribe `walkthrough.md`, no toca `tasks.md` ni hace la revisión de skills: completa `patch.md` y su fila del roadmap

### El cierre comprueba el árbol, el destino y las otras ramas antes de escribir

- GIVEN la rama `feature/0081-booking-reminders` con `notes.md` sin seguimiento en su worktree y la rama `feature/0083-room-photos` con worktree en `../0083-room-photos`
- WHEN empieza el cierre de la 0081
- THEN antes de escribir ningún registro pregunta «Hay cambios sin commitear: `notes.md`. ¿Los commiteo en la rama, los descarto o paro?» y no descarta nada sin la respuesta
- AND ejecuta `sdd merge --check`; con `destino sacado:`, para con su salida antes de escribir
- AND avisa en una línea, sin parar: «Abiertas a la vez: `feature/0083-room-photos` (`../0083-room-photos`). La que fusione segunda integra la base y repite sus gates.»

### Un rojo ajeno se busca en la deuda antes de investigarlo

- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN la salida de cada pasada de la suite ya está entera en un fichero del scratchpad de la sesión, guardada antes de filtrarla
- AND corre el mismo comando en un worktree temporal desanclado de `origin/develop`, y lo retira al acabar; no fusiona hasta que acaba ese contraste
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` (o en «Deuda técnica» del roadmap 2.x) con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- AND si sin la rama pasa, lo repite en la rama: si vuelve a fallar, el rojo es de la rama: vuelve a ella, arregla y repite la suite
- AND si en la rama también pasa, «No se repite»: abre una fila de intermitentes en la deuda, donde abriría la del rojo que también falla sin la rama, con el test, su línea de error copiada entera de la salida guardada, sin «…», y las dos pasadas en verde, y sigue con el cierre en cualquier perfil
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

### Un hotfix se cierra en la rama estable solo con la frase del dev-lead

- GIVEN el repo del kit, con `skills/sdd-upgrade/references/migrations/`, la rama `hotfix/0200-fix-login` salida de `main`, y el dev-lead que dijo «fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo»
- WHEN se cierra
- THEN ejecuta `sdd merge --check --into main` en las comprobaciones previas, y antes de fusionar pregunta «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?»
- AND con la respuesta «sí, la clave `auth.sameSite`», escribe el paso en `migrations/v3.0.1.md` antes de etiquetar
- AND hace `git fetch` y ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo" --push`
- AND si la frase no pide publicar, va sin `--push`, aunque `merge.push` sea `true`; sin ninguna frase del dev-lead, no fusiona en `main`
- AND en un proyecto sin esa carpeta de migraciones, el paso que pide el patch va al mensaje final como pendiente del dev-lead
- AND con `vuelta: conflicto en <ficheros>`, el cierre queda «No terminado»: una persona porta el arreglo a `develop` y relanza el hotfix

### Al cerrar una pieza de una familia, el cierre dice qué falta

- GIVEN un roadmap con la 0200 `⏳` («partida en 0200, 0201 y 0202»), la 0201 con `parent: 0200` en su spec y en su fila, que se cierra, y la 0202 «Fotos de las salas», `⏳`, con `parent: 0200` y «Tras: 0201»
- WHEN el cierre de la 0201 escribe su mensaje final
- THEN antes de la oferta del ticket dice «Para acabar la 0200 falta: 0202 — Fotos de las salas. Recomiendo 0202, la primera del roadmap sin dependencias abiertas.» y da su prompt de arranque con la forma de `launch-prompt-template.md`
- AND si la 0202 fuera «Tras: 0203», con la 0203 abierta, dice «Ninguna se puede arrancar todavía: 0202 espera a 0203.»
- AND si la 0202 ya está cerrada y la 0200 sigue `⏳`, dice «La 0200 ya no tiene piezas abiertas: su fila se puede cerrar.» y no marca la fila de la 0200
- AND con solo `proposal: 0131` en la spec que se cierra, la familia son las filas abiertas con `proposal: 0131`, y la línea dice «Para acabar la propuesta 0131 falta: …»
- AND una pieza sin `parent:` ni `proposal:` no lleva esa línea

### El cierre escribe las ADR candidatas y las comprueba

- GIVEN `decisions/` con la ADR más alta `0015-final-review-in-three-axes.md`, y la spec de la 0081 con «ADR candidatas: Los recordatorios salen de una cola — alternativa descartada: un cron por reserva»
- WHEN el cierre llega a los docs vivos
- THEN escribe `decisions/0016-reminders-from-a-queue.md` desde `adr-template.md` y apunta en el walkthrough `ADR: Los recordatorios salen de una cola → decisions/0016-reminders-from-a-queue.md`
- AND ejecuta `sdd decision check --path .docs/sdd`, que sale con 0; si sale con 1, por esa ADR o por otra, el cierre para y lo corrige antes del commit de cierre
- AND con «ADR candidatas: ninguna», o en un patch, ejecuta el check igual

### Un workaround que el cierre escribe en el stack lleva su fila de deuda

- GIVEN el walkthrough de la 0081 con el aprendizaje «la suite del backend corre en serie para esquivar la carrera del logger estático»
- WHEN el cierre lo vuelca a `tech-stack.md`
- THEN abre en la deuda una fila con ese workaround y el enlace a la línea de `tech-stack.md`

### El kit no invoca `finishing-a-development-branch`

- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch`
- THEN ninguno aparece salvo en el `NOTICE` y el anexo de procedencia de `sdd-archive`, y en las migraciones de versiones pasadas

### Un aprendizaje sin destino no se redirige en silencio

- GIVEN un cierre de feature cuyo walkthrough tiene un aprendizaje estructural y un proyecto sin `architecture.md`
- WHEN `sdd-archive` vuelca los aprendizajes a los docs vivos
- THEN crea `architecture.md` calcando `architecture-template.md` de `sdd-templates`, vuelca ahí el aprendizaje y lo dice en el informe final («`architecture.md` no existía: creado desde la plantilla»)
- AND no escribe el aprendizaje estructural en `tech-stack.md` ni en otro documento en su lugar
- AND lo mismo con cualquier otro destino que falte (`constitution.md`, `tech-stack.md`): se crea calcando su plantilla y se dice en el informe; si un destino no tiene plantilla, no se inventa: se dice y se añade una fila en la deuda

### Una carpeta `-task-` se cierra como legado

- GIVEN la rama `feature/0064-task-to-feature-rename` con su carpeta `20260925-163055-task-0064-task-to-feature-rename/`, cuyo `spec.md` lleva `task: 0064`
- WHEN `sdd-archive` cierra la feature
- THEN escribe `walkthrough.md` en esa misma carpeta, sin renombrarla
- AND el estimation-log regenerado tiene una fila con id `0064` y carpeta `20260925-163055-task-0064-task-to-feature-rename`

### El walkthrough dice de dónde sale cada THEN y cuánto tarda la suite

- GIVEN una feature cerrada con `sdd-archive`
- WHEN se escribe «4. Verificación» del walkthrough
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración, su configuración (la del gate, o lo que se añadió) y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND con E2E, «4.1 Builds» lleva el comando de «Entorno de la suite» con su comprobación, levantado en esa sesión, y la duración de la suite E2E frente a «Presupuesto E2E»
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite E2E pasó de su presupuesto, o, sin presupuesto, la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

### La suite E2E del cierre corre sobre un entorno que levanta la sesión

- GIVEN un proyecto cuyo `operations.md` declara `Entorno de la suite: node scripts/env-up.mjs · curl -f http://localhost:4585/health` y el gate de cierre `node --test test/ && node e2e/run.mjs`
- AND en el puerto 4585 ya escucha un servidor que arrancó otra pasada con el código de `develop`
- WHEN el cierre pasa la suite
- THEN antes de la primera pasada ejecuta `node scripts/env-up.mjs` y comprueba `/health`
- AND la pasa con `node --test test/ && node e2e/run.mjs` literal, sin `E2E_TRACE` ni otra variable que el gate no declare
- AND ante un `ERR_CONNECTION_REFUSED` vuelve a levantar el entorno, lo comprueba y repite la pasada antes de abrir el código o contrastar con la base

### La suite E2E del cierre se mide contra su presupuesto

- GIVEN `Presupuesto E2E: 0,5 min` en `operations.md` y una suite E2E que tarda 48 s, también sin la rama
- WHEN el cierre escribe el walkthrough
- THEN el 4.1 dice `E2E: 48 s de 0,5 min`
- AND la deuda del proyecto gana una fila con la duración y el presupuesto
- AND con `Presupuesto E2E: pendiente` el 4.1 da la duración medida y solo abre deuda si la suite pasa de 10 minutos

### Una tanda E2E se estima y se acota antes de lanzarla

- GIVEN una rama que reescribe `e2e/cancel.e2e.mjs` con tres tests nuevos y dos que no cambian, deja `e2e/free.e2e.mjs` sin tocar, y un runner con un worker
- WHEN el dev-lead pide «pasa tres veces las specs E2E que toca la rama»
- THEN antes de lanzarla da la estimación y el alcance: los tres tests nuevos ×3 y los dos que no cambian ×1, 11 ejecuciones, con su duración
- AND no repite `free.e2e.mjs`
- AND el 4.1 del walkthrough repite la línea `Tanda:` con esa estimación
- AND con la tanda en marcha no edita `src/` ni `e2e/`

### El guion de la validación empieza por el reporte y lo ha corrido el agente

- GIVEN el patch 0008 listo para validar en `validation.mode` `manual` o sin la clave, con el reporte de su §1: «miro qué hay libre: `node src/app.js libres 10:00-12:00` me da «Sur»; como el miércoles no tengo nada, pruebo `node src/app.js cancelar mie 10:00` y me dice «cancelada mie 10:00»», y una app que no guarda reservas entre procesos
- WHEN el agente compone el guion de pruebas
- THEN sus dos primeros pasos son los del reporte, literales y en su orden: «1. `node src/app.js libres 10:00-12:00` → «Sur» · 2. `node src/app.js cancelar mie 10:00` → «no hay reserva mie 10:00»»
- AND cada resultado esperado da el literal que sale, no «funciona» ni «se cancela con normalidad»
- AND antes de presentarlo, el agente corre cada paso del guion tal como lo hará la persona, con el usuario del agente de «Acceso a la aplicación» si `operations.md` lo declara, y deja los datos como estaban tras un paso que escribe o dice de qué estado parte la persona
- AND un paso que añadió y no funciona al correrlo («reserva el miércoles y cancélalo», que la app no guarda) no entra en el guion
- AND un THEN que no puede observar (una pantalla sin detector declarado) va en el guion con `no ensayado: <motivo>` y la comprobación que sí hizo
- AND en una feature sin reporte, los pasos salen de la línea «Se prueba en la aplicación» de cada task, y sin ella, de los THEN de la spec

### Mientras la persona prueba, el agente no lanza nada contra el entorno

- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, con una suite E2E de ~50 s cuyo `env-up` reinicia el servidor
- WHEN el dev-lead pide «dame ya el guion y, mientras lo pruebo, pasa en segundo plano tres veces las specs E2E que toca la rama»
- THEN desde el mensaje que presenta el guion hasta la respuesta de la persona, no deja en marcha ni lanza ninguna tanda, suite, `env-up`, `env-down`, sonda ni escritura en datos
- AND la tanda corre antes de presentar el guion, esperando su resultado, o queda para después de la validación, y el mensaje dice cuál y por qué
- AND siguen en marcha el entorno que levantó antes de presentar, comprobado antes, y el servidor de `sdd validation serve`; reinyectar o leer el panel de validación no cuenta como lanzar algo contra el entorno

### La persona valida con un panel en su navegador

- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, una sesión con Claude in Chrome y un navegador conectado, y un guion de 3 pasos
- WHEN el agente presenta la validación
- THEN abre la app, inyecta `validation-panel.js` y monta la validación `0010` con los 3 pasos (cada uno «acción → resultado esperado»), llama a `read_network_requests` y a `read_console_messages` con `clear: true`, y dice que la captura será la del momento de leer y que la red no trae hora
- AND al recibir «listo», o el aviso de que el panel ha desaparecido, lo reinyecta desde `localStorage` y monta `0010` otra vez, con las marcas que tenía, antes de leerlo
- AND con 3 de 3 en OK y «listo», el walkthrough registra `Validado: <fecha> · panel: 3/3 OK · «listo»` y el agente borra las claves `sdd-validation-` del panel
- AND con el paso 2 en KO y el comentario «sale cancelada», sigue por «No funciona» con ese comentario, la consola y la red leídas y una captura, y borra las claves `sdd-validation-` del panel, para que la vuelta tras el arreglo empiece de cero
- AND con el paso 3 sin marcar, pregunta por él; si la persona dice que lo probará más tarde, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md) a ese paso
- AND una validación posterior en el mismo origen con otro id (`0011`) empieza sin las marcas de la `0010`
- AND si la inyección falla (una CSP que bloquea `eval`), pasa a «Sin Claude in Chrome, el panel lo sirve la CLI» y dice por qué
- AND con `validation.mode: field` no abre el navegador, no lanza `sdd validation serve` ni arranca el entorno para validar

### Sin Claude in Chrome, el panel lo sirve la CLI

- GIVEN la 0010 lista para validar en `validation.mode` `manual` o sin la clave, y una sesión sin las herramientas de Claude in Chrome, o sin navegador conectado
- WHEN el agente presenta la validación
- THEN ofrece `sdd validation serve --steps <pasos> --out .temp/validation/0010.json`, da su URL `http://127.0.0.1:<puerto>/` y dice que esa página no ve la app: sin consola, red ni captura del KO, que la persona cuenta en el comentario
- AND si `.temp/` no está en el `.gitignore` del proyecto, lo dice y propone añadirlo antes de lanzarlo
- AND el mensaje de la validación lleva, antes del guion, una sola línea `Panel:`: `Panel: Chrome sobre <url de la app>` o `Panel: plan B en http://127.0.0.1:<puerto>/`; «sin panel» no es una opción, y solo si `sdd validation serve` falla la línea es `Panel: no arrancó: <su error>`
- AND al recibir «listo» lee las marcas de `.temp/validation/0010.json`, para el servidor por su PID y aplica las mismas reglas de `Validado`, KO y paso sin marcar que con el panel en Chrome

### El cierre integra la base tras su commit y repite solo lo que afecta lo que trae la base

- GIVEN la 0081 con la suite en verde en `a1b2c3d`, en la validación, un gate de cierre `moon run app:test api:test --affected --base develop`, y `origin/develop` que avanzó con el merge de la 0080, que solo cambia `src/api/rooms.js` (input de `api:test`, no de `app:test`)
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `sdd merge --sync --project-root <worktree>`, que integra `origin/develop` en la rama como último commit, y corre `moon run app:test api:test --affected --base a1b2c3d` sobre el resultado: corre `api:test` y no `app:test`
- AND el mensaje final lleva `` Gate: `moon run app:test api:test --affected --base a1b2c3d` → api:test: corrió 212/212 · app:test: saltada (la base no toca sus inputs: `moon task app:test`) ``, y el 4.1 del walkthrough, la línea `Gate:` de la validación
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre nada y el merge lleva `--verified-at a1b2c3d`
- AND con un gate sin filtro de base (`node --test`), corre el gate entero (E2E incluidos si el proyecto los declara) si la base trae cambios fuera de `.docs/` que no sean `*.md`
- AND con conflicto en `roadmap.md`, `changelog.md` o un add/add de dos requisitos al final de una capacidad, `--sync` lo resuelve y el cierre sigue; con `base: conflicto en src/slots.js`, el cierre queda «No terminado» para una persona

### Con otra rama abierta o la base por delante, la suite corre una sola vez, tras el merge de sincronización

- GIVEN `validation.mode: field`, la 0081 implementada, `git worktree list` que muestra `feature/0083-room-photos`, y `git rev-list --count HEAD..origin/develop` que da 2 tras `git fetch`
- WHEN la validación y el cierre de la 0081
- THEN el smoke por THEN corre y la suite no corre antes del commit de cierre
- AND tras el commit de cierre y `sdd merge --sync`, el gate de cierre corre una sola vez, tal como lo declara el proyecto, sobre el merge de sincronización
- AND `Validación en campo:` dice que la suite corrió sobre el merge de sincronización, y el merge final lleva `--verified-at` con su sha, que da también el mensaje final
- AND sin otra rama abierta y con la base al día (`git rev-list --count` da 0), la suite corre en la validación como hasta ahora
- AND con `validation.mode: manual`, el guion se presenta igual, y la suite corre tras el merge de sincronización, antes del merge

## Reglas de la capacidad

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; la de la validación del dev en `skills/sdd-archive/references/dev-validation.md`, con su panel en `validation-panel.js`, que guarda las marcas en el `localStorage` del navegador (`sdd-validation-<id>`) o, en el plan B, en `.temp/validation/<id>.json` del worktree; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md` (3.0.0) o en «Deuda técnica» de `roadmap.md` (2.x)
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; marcas de carril de la skill `Feature only:`, `Patch only:`, `Hotfix only:`; el panel, `sddValidationPanel`, con los estados `pending`, `ok` y `ko`; las líneas de registro, en castellano (`Validado:`, `no ensayado:`)
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.920 y total 8.000 (`cli/test/kit/word-budget.test.ts`); el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; tras el merge de sincronización se repite solo lo que afecta lo que trae la base: con un gate filtrado, el gate con su base en el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; el informe de rojo lleva las últimas 20 líneas; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `Validado: <fecha> · panel: <n>/<n> OK · «listo»` · `no ensayado: <motivo>` · que la captura es la del momento de leer y la red no trae hora (panel en Chrome) · que la página del plan B no ve la app: sin consola, red ni captura del KO · `Panel: Chrome sobre <url de la app>` · `Panel: plan B en http://127.0.0.1:<puerto>/` · `Panel: no arrancó: <su error>`
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre; el panel en Chrome va antes que el plan B, que solo sale sin Claude in Chrome, sin navegador conectado o con la inyección fallida; si lo que la persona dice en el chat contradice una marca del panel, manda lo que dice, y el agente lo registra con su frase
