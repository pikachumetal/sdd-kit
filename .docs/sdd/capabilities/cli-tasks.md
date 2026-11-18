# Capacidad — cli-tasks

## Propósito

Los verbos de las tasks, el workspace y el cerrojo de suites: `sdd task`, `sdd workspace`, `-C` y `sdd lock run`.

## Requisitos

### `sdd task done` no registra una task sin commits

- GIVEN un plan y `HEAD` en el mismo commit que la `BASE` de la task, por ejemplo porque el pre-commit rechazó su commit
- WHEN se ejecuta `node sdd.js task done <plan> <n> <base> -- <comando>`
- THEN escribe en stderr `Task <n> NOT recorded: sin commits en el rango: ¿falló el pre-commit?`, sale con 1, no ejecuta el comando y no escribe en el ledger

### `sdd lock run` corre un comando con el cerrojo de las suites del clon

- GIVEN el worktree de `feature/0210` con `sdd lock run -- pnpm exec vitest run slow.test` en marcha desde las 19:30:00 del 2026-10-25
- WHEN otro worktree del mismo clon lanza `sdd lock run -- pnpm exec vitest run test/kit/headless`
- THEN el segundo escribe «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene feature/0210 (D:\code\sdd-kit-0210, PID 4120) desde 2026-10-25 19:30:00.» y no arranca su comando hasta que acaba el primero
- AND `sdd lock run` sale con el código del comando

### `sdd task start` abre una spec lite como brief

- GIVEN una `spec.md` con `mode: lite` en el frontmatter y sin ningún encabezado `Task <n>`
- WHEN se ejecuta `node sdd.js task start <spec.md> 1`
- THEN escribe la spec entera en `task-1-brief.md` del workspace, imprime `brief: <ruta>` y `base: <sha de HEAD>`, y sale con 0
- AND con un plan sin `mode: lite` y sin `Task 1`, sale con 1 y `task 1 not found in <plan> (no heading matching 'Task 1')`, como hoy

### El vigía no da por terminado un subagente reanudado

- GIVEN el transcript de un subagente cuya última respuesta acaba en `end_turn` y, después, un mensaje `user` de una reanudación con `SendMessage`
- WHEN se ejecuta `sdd watch subagent` sobre él
- THEN no escribe `TERMINADO:`: el veredicto es `EN MARCHA:` o `SILENCIO:` según los minutos sin escribir, como un subagente que trabaja
- AND sin mensaje `user` tras el `end_turn`, escribe `TERMINADO: <etiqueta> devolvió su resultado`, como hoy

### Un `sdd lock run` dentro de otro no vuelve a pedir el cerrojo

- GIVEN `sdd lock run -- moon run kit:test-headless cli:test-min` en marcha en `feature/0228`, con el cerrojo de suites cogido por su PID 7100
- WHEN `kit:test-headless`, hijo de ese proceso, lanza `sdd lock run -- pnpm --dir cli exec vitest run test/kit/headless`
- THEN el comando arranca sin esperar ni escribir «Esperando el cerrojo», y el cerrojo sigue siendo del PID 7100 hasta que acaba el `moon run` entero
- AND un `sdd lock run` con `SDD_SUITE_LOCK_OWNER=7100` heredado cuando el cerrojo lo tiene otro PID, o cuando no lo tiene nadie, lo pide como cualquier otro

### La espera del cerrojo de suites va por orden de llegada y dice el puesto

- GIVEN `feature/0210` con el cerrojo de suites desde las 17:05:12 del 2026-10-27, y `feature/0211` esperándolo desde las 17:06:00
- WHEN `feature/0212` lanza `sdd lock run` a las 17:07:00
- THEN escribe «Esperando el cerrojo de suites: vas 2.º en la cola; lo tiene feature/0210 (D:\code\sdd-kit-0210, PID 4120) desde 2026-10-27 17:05:12; delante de ti, feature/0211 (D:\code\sdd-kit-0211, PID 5332).»
- AND al soltarlo la 0210 a las 17:31:40, lo coge la 0211 aunque la 0212 sondee antes, y la 0212 escribe «Esperando el cerrojo de suites: vas 1.º en la cola; lo tiene feature/0211 (D:\code\sdd-kit-0211, PID 5332) desde 2026-10-27 17:31:40.»
- AND una espera cuyo proceso muere sale de la cola, y quien iba detrás sube de puesto

### `task start` y `task brief` exigen `tasks.md` con más de una task

- GIVEN un plan, fuera de lite, con más de una task y sin `tasks.md` en su carpeta
- WHEN se ejecuta `sdd task start` o `sdd task brief` sobre él
- THEN sale con código 1 y el mensaje `plan with <n> tasks and no tasks.md: write <ruta> before the first task (status and commit per task)`, sin escribir el brief

### `-C` sitúa los verbos del workspace en otro working tree

- GIVEN el repo de una feature con `plan.md` commiteado y un worktree de revisión `review-0300-abc1234` creado con `git worktree add --detach` junto a él
- WHEN desde el worktree de revisión se ejecuta `sdd workspace -C <worktree de la feature> plan.md`
- THEN imprime `<worktree de la feature>\.temp\sdd\plan` (en Windows; `/` en Linux y macOS), sale con 0 y el worktree de revisión no tiene `.temp/sdd/`
- AND `sdd task brief -C <worktree de la feature> plan.md 1` y `sdd review package -C <worktree de la feature> plan.md <base> <head>` escriben en ese mismo workspace, y la ruta del plan se resuelve desde `<worktree de la feature>`
- AND `--directory` vale lo mismo que `-C`, y `sdd workspace --help`, `sdd task brief --help` y `sdd review package --help` lo enseñan como `[--directory <valor>]`
- AND con un `-C` que no existe escribe `directorio de -C no válido: <dir>` y el uso, y sale con 2 sin escribir nada
- AND `sdd task start -C <dir> plan.md 1` y `sdd task done -C <dir> …` salen con 2 y `opción desconocida: «-C»`

### Los verbos de tasks paran fuera de un repo o sin commits

- GIVEN un directorio fuera de cualquier repo git con `plan.md`
- WHEN se ejecuta `sdd review package plan.md HEAD~1 HEAD`, `sdd task done plan.md 1 HEAD -- node -v` o `sdd task start plan.md 1`
- THEN escribe en stderr `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas, con al menos un commit (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y un primer commit, y vuelve a lanzarlo.`, en la línea siguiente `git dijo: ` con la primera línea del stderr de git, y el uso; sale con 2 sin escribir nada
- AND `sdd workspace plan.md` y `sdd task brief plan.md 1` escriben `Los verbos de tasks se ejecutan dentro del working tree de git en el que trabajas (directorio actual: <dir>). Si es un proyecto nuevo, haz git init y vuelve a lanzarlo.`, la línea `git dijo: ` y el uso, y salen con 2 sin escribir nada
- AND `sdd task brief plan.md 1 brief.md`, con OUTFILE, escribe el brief sin pedir repo
- AND en un repo recién creado sin commits y con `plan.md` sin commitear, `sdd task start plan.md 1`, `sdd task done plan.md 1 HEAD -- node -v` y `sdd review package plan.md HEAD HEAD` dan el mensaje con «al menos un commit», salen con 2, y `task start` no escribe el brief
- AND en ese repo sin commits, `sdd workspace plan.md` y `sdd task brief plan.md 1` funcionan como en uno con commits

### El id de una task admite letras y puntos

- GIVEN un plan con `## Task 6`, `## Task 6b`, `## Task A1`, `## Task Overview`, `## Task 2` y `## Task 2.1`, en ese orden, y `tasks.md` junto a él
- WHEN se ejecuta `sdd task brief plan.md 6b`
- THEN el brief tiene solo la sección de `## Task 6b`, hasta el siguiente encabezado de task, y sale con 0
- AND el brief de `6` no tiene `## Task 6b`, el de `2` no tiene `## Task 2.1`, y el de `A1` tiene `## Task Overview` y lo que le sigue, porque un encabezado sin dígito en el id no corta una task
- AND en otro plan con `### Task 7`, `#### Task 7a`, `### Task 8`, `### Task 1` y `#### Task 12`, en ese orden, el brief de `7` incluye `#### Task 7a` y el de `1` no incluye `#### Task 12`
- AND `sdd task start`, `sdd task brief` y `sdd task done` aceptan los mismos ids, y un id sin dígito (`Overview`), con otros caracteres (`6*`) o con un punto al borde (`6.`) sale con 2 y el uso

### Un bloque de código sin cerrar no alarga el brief

- GIVEN un plan con `tasks.md` junto a él, cuya `## Task 1` abre en la línea 7 un bloque con tres comillas invertidas que no se cierra, con `## Task 2` después
- WHEN se ejecuta `sdd task brief plan.md 1`
- THEN escribe `el bloque de código abierto en la línea 7 de plan.md no se cierra y oculta los encabezados de task que le siguen: ciérralo en el plan y vuelve a lanzarlo`, sale con 1 y no escribe el brief
- AND `sdd task brief plan.md 2` escribe esa misma línea antes de `task 2 not found in plan.md (no heading matching 'Task 2')` y sale con 1
- AND en un plan con `## Task 1` y `## Task 2`, con bloques cerrados, cuya última línea es otra con solo tres comillas invertidas dentro de la `## Task 2`, `sdd task brief plan.md 2` escribe el brief, avisa en stderr con `el bloque de código abierto en la línea <n> de plan.md no se cierra; no oculta ningún encabezado de task, así que el brief está completo` y sale con 0
- AND en ese mismo plan, `sdd task brief plan.md 1` escribe el brief sin aviso y sale con 0, porque el bloque se abre después de la task pedida

### Un plan sin encabezados `Task` dice por qué no encuentra la task

- GIVEN un plan sin `mode: lite`, con `## Tarea 1: Login` y `## Tarea 2: Logout` y sin ningún encabezado `Task`
- WHEN se ejecuta `sdd task brief plan.md 1`
- THEN escribe en stderr `no hay encabezados de task: se escriben con la palabra inglesa «Task» («### Task 1: …») aunque el plan esté en otro idioma. Encabezados con forma de task:`, debajo `  ## Tarea 1: Login` y `  ## Tarea 2: Logout`, y después `task 1 not found in plan.md (no heading matching 'Task 1')`; sale con 1
- AND con más de cinco encabezados así lista solo los cinco primeros
- AND una `spec.md` con `mode: lite` y `## Fase 1` se abre entera como brief, sin la lista, como hoy

### El workspace no pisa su `.gitignore`

- GIVEN un repo con `.temp/sdd/.gitignore` que dice `*` y `!*/progress.md`
- WHEN se ejecuta `sdd workspace plan.md`
- THEN el fichero conserva sus dos líneas
- AND sin `.temp/sdd/.gitignore`, lo crea con `*`

### `sdd task done` no lanza un Vitest con lentos sin `--test-timeout`

- GIVEN un plan con commits en el rango de la task
- WHEN se ejecuta `node sdd.js task done <plan> <n> <base> -- npx vitest run <filtros>` sin `--test-timeout`, y algún filtro está en la ruta de un `*.slow.test.ts` (o no hay filtros)
- THEN escribe en stderr `Task <n> NOT recorded: vitest corre <ficheros> sin --test-timeout: añade --test-timeout 120000`, sale con 1 y no ejecuta el comando
- AND con `--test-timeout <ms>`, o sin ningún lento entre los filtros, lo lanza como hasta ahora

### Un cerrojo cuyo PID reutilizó otro programa se rompe

- GIVEN el cerrojo de suites de `feature/0210` (D:\code\sdd-kit-0210, PID 37368) desde 2026-11-12 00:10:00, y el PID 37368 vivo en la misma máquina, pero arrancado a las 08:46 por otro programa
- WHEN otro worktree del mismo clon lanza `sdd lock run` y lleva más de 3 s esperando
- THEN escribe «Cerrojo huérfano: lo tenía feature/0210 (D:\code\sdd-kit-0210, PID 37368) desde 2026-11-12 00:10:00.», borra el cerrojo y lo coge
- AND con el PID arrancado antes de coger el cerrojo, espera como con cualquier dueño vivo
- AND sin poder leer la hora de arranque del PID (sin PowerShell en Windows, sin `ps` fuera de él, sin permiso o sin respuesta en 5 s), espera como con cualquier dueño vivo
