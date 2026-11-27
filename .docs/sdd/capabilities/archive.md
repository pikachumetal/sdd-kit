# Capacidad — archive

## Propósito

el cierre de una feature o de un patch con `sdd-archive`: lo que comprueba antes de escribir, la base integrada y la suite, los registros, las ADR, «qué sigue» y el merge.

## Requisitos

### El cierre de una feature y el de un patch van por la misma skill

- GIVEN la rama `feature/0081-booking-reminders` con su `spec.md` aprobada y todas sus tasks hechas, y la rama `patch/0082-slot-overlap` con su `patch.md` y el fix commiteado
- WHEN se cierra cada una
- THEN las dos se cierran con `sdd-archive`
- AND el cierre de la 0081 escribe `walkthrough.md`, actualiza `tasks.md` y pasa por `sdd-retro`
- AND el cierre de la 0082 no escribe `walkthrough.md`, no toca `tasks.md` ni pasa por `sdd-retro`: completa `patch.md` y su fila del roadmap

### El cierre comprueba el árbol, el destino y las otras ramas antes de escribir

- GIVEN la rama `feature/0081-booking-reminders` con `notes.md` sin seguimiento en su worktree y la rama `feature/0083-room-photos` con worktree en `../0083-room-photos`
- WHEN empieza el cierre de la 0081
- THEN antes de escribir ningún registro pregunta «Hay cambios sin commitear: `notes.md`. ¿Los commiteo en la rama, los descarto o paro?» y no descarta nada sin la respuesta
- AND con solo los borradores que deja `sdd-implement` sin commitear —`walkthrough.md` de la carpeta de la 0081 y los ficheros de `capabilities/` que nombra «Capacidades» de su spec—, no pregunta: el cierre parte de ellos y los completa sin reescribirlos
- AND un `capabilities/rooms.md` modificado que la spec de la 0081 no nombra sí pregunta, como `notes.md`
- AND ejecuta `sdd merge --check`; con `destino sacado:`, para con su salida antes de escribir
- AND avisa en una línea, sin parar: «Abiertas a la vez: `feature/0083-room-photos` (`../0083-room-photos`). La que fusione segunda integra la base y repite sus gates.»

### Un rojo ajeno se busca en la deuda antes de investigarlo

- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN la salida de cada pasada de la suite ya está entera en un fichero del scratchpad de la sesión, guardada antes de filtrarla
- AND crea un worktree temporal desanclado de `origin/develop`, prepara su entorno como el Step 2 de `sdd-worktrees` (dependencias y, con `## Entornos` en `steering/operations.md`, `env:setup`) y lo retira al acabar; no fusiona hasta que acaba el contraste
- AND corre primero el fichero que falla, `tests/e2e/export.spec.ts`, con el runner del proyecto, en la rama y en ese worktree a la vez, sin limpiar estado ni cachés
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- AND si pasa sin la rama y falla en la rama, el rojo es de la rama: devuelve el trabajo a `sdd-implement`, cuyo arreglo es una task con un test que falla primero y vuelve al gate como dice «Tras un rojo, el gate repite los tests que fallaron y lo afectado por el arreglo»
- AND si en la rama también pasa, «No se repite»: abre una fila de intermitentes en la deuda, donde abriría la del rojo que también falla sin la rama, con el test, su línea de error copiada entera de la salida guardada, sin «…», y las dos pasadas en verde, y sigue con el cierre en cualquier perfil
- AND si el fichero pasa en los dos y su línea de error no es un tiempo agotado ni un recurso de la máquina (puerto ocupado, fichero bloqueado, disco lleno, objetos temporales de git), antes de «No se repite» corre la tarea roja entera en los dos, con las mismas salidas
- AND GIVEN un gate `moon run cli:test --affected --base develop` con 1 rojo en `test/x.slow.test.ts` y un worktree de la base recién creado, THEN corre `test/x.slow.test.ts` sin la rama y en la rama antes que la tarea, con las dependencias instaladas, y llega a un veredicto sin esperar el cerrojo de otra rama; si tiene que correr la tarea, la nombra sin `--affected`
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
- THEN antes de la oferta del ticket dice «Para acabar la 0200 falta: 0202 — Fotos de las salas. Recomiendo 0202, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la 0202».» y no escribe el prompt de arranque
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
- WHEN el cierre lo vuelca a `steering/operations.md`
- THEN abre en la deuda una fila con ese workaround y el enlace a la línea de `steering/operations.md`

### El kit no invoca `finishing-a-development-branch`

- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch`
- THEN ninguno aparece salvo en la línea «Inspired by `finishing-a-development-branch` of superpowers (MIT).» de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas
- AND `skills/sdd-archive/` no tiene `NOTICE`: es propia, y `upstream.json` la lleva en `own` y en una entrada `concept`

### Un aprendizaje sin destino no se redirige en silencio

- GIVEN un cierre de feature cuyo walkthrough tiene un aprendizaje estructural y un proyecto sin `architecture.md`
- WHEN `sdd-archive` vuelca los aprendizajes a los docs vivos
- THEN crea `architecture.md` calcando `architecture-template.md` de `sdd-templates`, vuelca ahí el aprendizaje y lo dice en el informe final («`architecture.md` no existía: creado desde la plantilla»)
- AND no escribe el aprendizaje estructural en `steering/operations.md` ni en otro documento en su lugar
- AND lo mismo con cualquier otro destino que falte (`constitution.md`, `operations.md`): se crea calcando su plantilla y se dice en el informe; si un destino no tiene plantilla, no se inventa: se dice y se añade una fila en la deuda

### Una carpeta `-task-` se cierra como legado

- GIVEN la rama `feature/0064-task-to-feature-rename` con su carpeta `20260925-163055-task-0064-task-to-feature-rename/`, cuyo `spec.md` lleva `task: 0064`
- WHEN `sdd-archive` cierra la feature
- THEN escribe `walkthrough.md` en esa misma carpeta, sin renombrarla
- AND el estimation-log regenerado tiene una fila con id `0064` y carpeta `20260925-163055-task-0064-task-to-feature-rename`

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
- AND sigue en marcha el entorno que levantó antes de presentar, comprobado antes

### Un conflicto de la base solo en docs que junta dos añadidos lo resuelve el agente

- GIVEN `sdd merge --sync`, en una llamada propia cuya salida se lee antes de cualquier gate o push, que da `base: conflicto en .docs/sdd/roadmap.md.`, donde la rama pone el prefijo `**[Feature 0235, 2026-10-28: parcial — …]**` a una fila de deuda cuyo «Destino» la base cambió de `**Esperar 2.º ticket**` a `**Actuar → 0236**`
- WHEN el cierre lee el conflicto, en cualquier perfil
- THEN deja la fila con el prefijo de la rama y el «Destino» de la base, commitea el merge de sincronización con el hook, repite el gate y sigue el cierre
- AND el cuerpo del commit y el mensaje final llevan `Conflicto de la base resuelto por el agente: .docs/sdd/roadmap.md — el prefijo de cierre de la rama y el «Destino» de la base en la fila «…»`
- AND lo mismo con una frase que la base añade al final de una línea de `.docs/sdd/steering/operations.md` que la rama reescribe, si no dice lo contrario que la línea de la rama: queda la línea de la rama más la frase de la base
- AND lo mismo fuera de `.docs/`, en cualquier `*.md`: dos adiciones en la línea `**Escribe**` de una migración quedan juntas, y dos filas contiguas de una tabla que toca cada lado quedan con el cambio de cada uno
- AND si los dos lados reescriben la misma frase de forma distinta, si en un trozo ponen dos «Destino» distintos (`**Actuar → 0240**` y `**Descartada**`), si la frase de la base dice lo contrario que la línea de la rama, si el conflicto incluye un fichero que no es Markdown (`src/slots.js`), o ante la duda, no resuelve nada: el cierre queda «No terminado» para una persona

### Antes del merge, el cierre lee la CI de la base y no fusiona sobre un rojo

- GIVEN un proyecto cuyo §Testing declara «CI de la base» con la orden que lee su último resultado, y esa orden da `conclusion` `failure` y `headSha` `3c4d5e6` en `develop`
- WHEN el cierre de una feature o de un patch llega al merge
- THEN no ejecuta `sdd merge`, dice `CI de develop en rojo en 3c4d5e6`, busca el rojo en la deuda y, sin fila que lo nombre, abre una con ese sha; el cierre queda «No terminado»
- AND si la orden da `success`, una `conclusion` vacía (run en curso) o `cancelled`, fusiona como siempre
- AND si la orden no responde (sin `gh`, sin sesión, error de red), dice `CI de develop sin respuesta: <primera línea del error>; sigo sin leerla` y fusiona
- AND con «CI de la base» `ninguna` o `sin orden de lectura`, no lee nada ni avisa
- AND un hotfix no la lee

### Con `ROADMAP.md`, el cierre no escribe el changelog

- GIVEN un proyecto con `ROADMAP.md` y `CHANGELOG.md` en la raíz, y el patch 0021 sin fila en Now
- WHEN `sdd-archive` cierra el patch
- THEN `CHANGELOG.md` no cambia
- AND Now gana la fila 0021 con su brief y `✅`, y `sdd roadmap check` escribe `Roadmap válido`

### Un aprendizaje cuyo destino no cabe tiene salida

- GIVEN el cierre de una feature con un aprendizaje de 40 palabras («la suite lenta necesita `--maxWorkers 8`…») para `steering/operations.md`, que mide 900 palabras en la rama y en `origin/develop`; el tope es 950 en la rama y 920 en `origin/develop`, porque otra feature bajó el tope a 920 sin tocar el contenido después de abrirse la rama; y un pre-commit que lo comprueba
- WHEN se vuelca el aprendizaje
- THEN antes de escribirlo, tras `git fetch`, mide el documento como lo dejará el merge de sincronización (el de `origin/develop` con los cambios de la rama) más el aprendizaje, 940 palabras, contra el tope de `origin/develop`, 920, y no contra el de la rama
- AND como no cabe, sale de ese documento la pieza más vieja que ya vive en otro sitio, y el aprendizaje entra
- AND una regla de una skill con batería (`tests/batteries/<skill>/`) va a la procedencia de esa batería
- AND si no hay pieza que salga, pregunta; en `unattended`, va a «Por triar» de la deuda
- AND el tope no sube, y ni el commit del cierre ni el del merge de sincronización se saltan el hook
- AND §5 del walkthrough dice dónde fue el aprendizaje

### El cierre arranca con la validación registrada y no edita código

- GIVEN la 0010 con las tasks acabadas y la revisión final limpia, y sin ninguna línea de validación en el borrador del walkthrough
- WHEN se invoca `sdd-archive`
- THEN no valida: no presenta el guion, no corre el gate de la validación y dice «falta la validación de la 0010»; devuelve el trabajo a `sdd-validate` sin escribir nada
- AND con `Validado: 2026-11-24 · «probé reservar y cancelar y funciona»` en el borrador, sigue por los pre-checks, los registros, el commit de cierre, el merge de sincronización y el merge
- AND con `Validación en campo:` o `Validación por el agente:` registrada, sigue igual, sin presentar guion
- AND ningún paso del cierre arregla código: un rojo del gate tras el merge de sincronización que no viene de la base devuelve el trabajo a `sdd-implement`, y su arreglo es una task con su test
- AND borrar los tests de feature de «Camino crítico» y juntar el commit de cierre siguen en el cierre
- AND un hotfix o un spike sin línea de validación vuelven a `sdd-validate` igual que una feature

### Un rojo tras el commit de cierre devuelve el trabajo a `sdd-implement` y el cierre reentra

- GIVEN la 0081 con `Validado:` en su walkthrough, el commit de cierre hecho y, tras `sdd merge --sync`, un rojo del gate en `tests/slots.test.ts` que no viene de la base
- WHEN `sdd-archive` lo contrasta y es de la rama
- THEN no arregla: devuelve el trabajo a `sdd-implement`, cuyo arreglo es una task con su test que corre solo lo que toca el arreglo
- AND la validación ya dada sigue valiendo y el cambio se registra como dice «Lo cambiado tras la validación se separa de lo validado», sin pedir otra
- AND `sdd-archive` reentra: rehace el commit de cierre con el arreglo dentro, repite `sdd merge --sync` y el gate de las tareas que cruzan la rama y la base, y el merge lleva el `--verified-at` del nuevo gate

## Reglas de la capacidad

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; cuándo corre la suite del cierre y qué corre tras el merge de sincronización, en `skills/sdd-archive/references/closing-suite.md`; la comprobación de la revisión final, en `skills/sdd-archive/references/final-review-check.md`; qué corre, envía y registra cada modo de validación, en `skills/sdd-validate/references/validation-modes.md`; adónde va cada aprendizaje, en `skills/sdd-archive/references/learnings.md`; la de la validación del dev en `skills/sdd-validate/references/dev-validation.md`; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md`; la lista del camino crítico del proyecto en `.docs/sdd/steering/critical-path.md`, y su check y su alcance en «Camino crítico» y «Tests de feature» de `operations.md` §Testing
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; marcas de carril de la skill `Feature only:`, `Patch only:`, `Hotfix only:`; las líneas de registro, en castellano (`Validado:`, `no ensayado:`)
- **Límites**: tope de palabras de `sdd-archive`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez por árbol, al acabar las tasks; con «Camino crítico», «Tests de feature» corre una vez por cierre, antes del borrado, y el árbol de la suite del cierre es el ya borrado; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez, también si la base trae un fichero de «Sin filtro»: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; el informe de rojo lleva las últimas 20 líneas; el aviso de `ya-en-base:` nombra hasta diez tests; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `no ensayado: <motivo>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>` · «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.» · «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.» · «`Camino crítico` declarado sin `critical-path.md`: no borro nada.» · «Falta la validación de la `<id>`: el trabajo vuelve a `sdd-validate`.»
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona, salvo el que cae solo en Markdown y en el que los dos lados solo añaden o tocan filas distintas sin cambiar lo del otro, que lo resuelve el agente, repite el gate y lo nombra; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre; con «Camino crítico», `critical-path.md` manda sobre «Flujos core», solo la escribe una persona, y un test con fila propuesta sin respuesta no se borra, salvo en `unattended`, donde se borra y su propuesta va a la deuda
