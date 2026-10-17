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

### El cierre integra la base tras su commit y repite la suite solo si la base trae código

- GIVEN la 0081 con la suite completa en verde en `a1b2c3d`, en la validación, y `origin/develop` que avanzó desde que se abrió la rama con el merge de la 0080, que cambia `src/rooms.js`
- WHEN el cierre ha hecho su commit de cierre
- THEN hace `git fetch` y `git merge --no-edit origin/develop` en la rama, que queda como último commit, y corre la suite completa (E2E incluidos si el proyecto los declara) sobre el resultado, porque la 0080 cambia `src/`
- AND el merge final lleva `--verified-at <sha del merge de sincronización>`
- AND si la 0080 solo hubiera cambiado `.docs/sdd/roadmap.md`, no corre la suite y el merge lleva `--verified-at a1b2c3d`
- AND con conflicto solo en `roadmap.md` y `changelog.md`, deja cada línea con el cambio del lado que la tocó, regenera `estimation-log.md` con `sdd estimation log` y sigue; con conflicto en `src/slots.js`, hace `git merge --abort` y el cierre queda «No terminado» para una persona

### Un rojo ajeno se busca en la deuda antes de investigarlo

- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN corre el mismo comando en un worktree temporal desanclado de `origin/develop`, y lo retira al acabar
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` (o en «Deuda técnica» del roadmap 2.x) con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- AND si sin la rama pasa, el rojo es de la rama: vuelve a ella, arregla y repite la suite
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

### Un hotfix se cierra en la rama estable solo con la frase del dev-lead

- GIVEN el repo del kit, con `skills/sdd-init/references/migrations/`, la rama `hotfix/0200-fix-login` salida de `main`, y el dev-lead que dijo «fusiona el hotfix del login en main, etiquétalo v3.0.1 y publícalo»
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
- THEN «4.1 Builds» lleva la suite completa con su comando, su resultado, su duración y el sha de la validación; si se repitió tras el merge de sincronización, el mensaje final da su resultado y su sha
- AND «4.2 Smoke / tests» tiene una fila por THEN con su evidencia (`suite` · `ejecución real` · `no probado`)
- AND si la suite pasó de 10 minutos, «4.3 Residuales» lo apunta como deuda del proyecto con su duración

## Reglas de la capacidad

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md` (3.0.0) o en «Deuda técnica» de `roadmap.md` (2.x)
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; marcas de carril de la skill `Feature only:`, `Patch only:`, `Hotfix only:`
- **Límites**: tope de palabras de `sdd-archive`, `SKILL.md` 3.850 y total 6.300 (`tests/WordBudget.Tests.ps1`); la suite completa una vez por árbol (en la validación, y otra tras el merge de sincronización solo si la base trae cambios fuera de `.docs/` que no sean `*.md`); el informe de rojo lleva las últimas 20 líneas; una suite de más de 10 minutos va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` dentro del `NOTICE` y el anexo de procedencia de `sdd-archive` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas.» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md`
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que no sea solo de los tres registros lo resuelve una persona; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre
