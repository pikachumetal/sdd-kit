---
id: 20261026-173032-feature-0184-cli-roadmap-task-watch-root
feature: 0184
title: CLI — columnas de las tablas del roadmap, task start con spec lite, vigía de un subagente reanudado y un solo nombre para la raíz del proyecto
mode: full
profile: delegate
status: approved
created: 2026-10-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-26
---

# Spec — CLI: columnas del roadmap, task start lite, vigía reanudado y raíz del proyecto

🦆 Seis fallos pequeños de la CLI que hoy le cuestan al agente una llamada fallida o un aviso que no llega. Con esto, una fila del roadmap con una celda de más (`. || ✅ |`) para el pre-commit con «línea 67: la fila tiene 4 celdas y la cabecera 3»; una fila de deuda «**Actuar → 0184**» sin saldar avisa en cuanto la 0184 está ✅; `sdd task start` abre una spec lite como brief; el vigía de un subagente reanudado con `SendMessage` ya no da `TERMINADO:` a los 3 s; `--project-root` vale en todos los verbos que sitúan el proyecto; y un merge que para el hook dice qué test falló (`[-] se llama sdd-archive`) antes de la cola de 20 líneas.

## Capacidades

- Modificadas: `roadmap` — «Las cabeceras de tabla y los estados son los de la plantilla» (filas con distinto número de celdas que su cabecera) y nuevo requisito del aviso de filas que apuntan a una tarea ✅
- Modificadas: `control-profiles` — «Un merge del cierre que falla deja la rama destino como estaba» (los tests fallidos antes de la cola)
- Modificadas: `cli` — tres requisitos nuevos: `task start` con spec lite, el vigía de un subagente reanudado y `--project-root` en todos los verbos

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (roadmap, control-profiles), tres capacidades, contrato público (opciones y salida de la CLI que nombran las skills) · tamaño: ~250 líneas en ~14 ficheros de cli/
- Técnica: que `--project-root` en los verbos de `--path` resuelva `<raíz>/.docs/sdd` sin romper los `--path` que nombran las skills (señal: contrato público)
- Mínimo razonable: ninguna — deja sin segunda lectura los literales nuevos de aviso; los fija cada test
```

1. **Cinco tasks, no seis**: los dos arreglos de `sdd roadmap check` (celdas y filas que apuntan a una tarea ✅) van en una task, porque tocan el mismo módulo (`cli/src/roadmap/`). Cinco tasks en la misma superficie (la CLI), sin migración: no se parte.
2. **Celdas**: cada fila de una tabla con cabecera se compara con su cabecera; el problema es `línea <n>: la fila tiene <X> celdas y la cabecera <Y>`. Vale para `roadmap.md`, `ROADMAP.md` y `debt.md`, que pasan por `tableBlockProblems`. Un `\|` escapado no parte la celda (como hoy); un `|` sin escapar dentro de un código sí, y por eso sale. Si el `roadmap.md` de este repo tiene filas rotas, la task las arregla en su commit.
3. **Filas que apuntan a una tarea cerrada**, solo en el roadmap 2.x (`roadmap.md`): en 3.0.0 el cierre ya saca la deuda de «Lista» (`records.md` 3.0.0) y `ROADMAP.md` no tiene filas «Absorbida». Avisa (no falla) de:
   - una fila ⏳ de «Próximo» o de una release cuya «Ítem» lleva `**Absorbida por … → <ids>**` (o `**Absorbida por la <id>**`, sin flecha) y no empieza por el prefijo de saldada;
   - una fila de «Deuda técnica» cuyo «Destino» empieza por `**Actuar → <ids>**` y cuya «Ítem» no empieza por el prefijo de cierre;
   - cuando **todas** las `<ids>` son filas ✅ de «Próximo» o de una release. Una 🧪 no cuenta como cerrada.
   - Literal: `aviso: línea <n>: apunta a <ids>, ya ✅: sáldala`, con las ids separadas por `, `.
4. **`task start` con spec lite**: si el fichero lleva `mode: lite` en el frontmatter, el brief es la spec entera, sea cual sea `TASK_NUMBER`; imprime `brief:` y `base:` como hoy y sale con 0. `task brief` hereda lo mismo (comparten código). Sin `mode: lite`, igual que hoy.
5. **Vigía**: `isFinished` solo da por terminado un transcript cuya última respuesta del agente acaba en `end_turn` **y** sin un evento `user` posterior. Los `tool_result` son eventos `user`, pero van tras un `tool_use`, nunca tras un `end_turn`. Queda una carrera: si el vigía lee el transcript antes de que se escriba el mensaje de la reanudación, sigue diciendo `TERMINADO:`; el kit lanza el vigía tras el `SendMessage`, y ese mensaje ya está escrito. La fila «El vigía da `TERMINADO` a un subagente que cierra el turno esperando…» ya está **Descartada** (2026-10-16): no se toca.
6. **Raíz del proyecto**: `--project-root` es el nombre único y vale en todo verbo que sitúa el proyecto; los nombres de hoy se quedan, porque las skills los nombran y quitarlos sería una release mayor:
   - `roadmap check`, `capability index|check|merge`, `decision check|index`: `--project-root <raíz>` equivale a `--path <raíz>/.docs/sdd`; con las dos, sale con 2: `--path y --project-root no van juntas`.
   - `estimation log`, `init`, `upgrade` (`--root`) y `session tokens` (`--path`, el worktree): `--project-root` es alias; con las dos, el mismo error.
   - `merge`, `id next|claim`, `roadmap publish` ya la tienen. A un `--path` o `--root` desconocido en un verbo con `--project-root`, el error dice `opción desconocida: «--path»; la raíz del proyecto va en --project-root`.
   - `watch command --path` es un fichero de log, no la raíz: no cambia.
   - Las skills no se editan: siguen nombrando `--path .docs/sdd`, que funciona.
7. **Merge en rojo**: con el hook en rojo (`verificación: el hook rechazó el merge.`) y con `--verify` en rojo (`verificación: código de salida <n>`), antes de la cola de 20 líneas va `tests fallidos:` y, una por línea y en orden, hasta 20 líneas de la salida que casan con un test fallido: el `[-] ` de Pester o el `FAIL ` / `× ` de Vitest, también con el prefijo de moon (`cli:test | `). Sin ninguna, el mensaje es el de hoy.
8. **El Pester de `(?m)…$`** no se escribe (decisión del dev-lead, abajo). Tampoco su equivalente en Vitest: hoy no existe `cli/test/kit/` y la 0225 es la que porta esos tests; la fila de deuda queda **parcial**, con lo pendiente para la 0225: «el test de anatomía que rechaza `$` tras `(?m)` sin `\r?`, al portar los Pester a `cli/test/kit/`».
9. **Una pieza entra, otra sale**: no se retira nada, porque son arreglos de la CLI que no añaden pasos ni texto a las skills; salen del roadmap las seis filas de deuda que salda (una, parcial).
10. **Sin pruebas de skills (Art. I)**: no se edita ninguna skill.
11. **Delta probado**: `sdd capability merge` sobre una copia de `capabilities/` en el scratchpad → 2 sustituidos, 4 añadidos y la regla «Avisos» de `cli` sustituida, sin rechazos.
12. **Sin secciones de diseño**: con perfil `delegate` y la regla 3 del `CLAUDE.md` del repo («Decides tú lo de método, sin preguntas intermedias»), el diseño va entero en esta spec y se aprueba en su gate.

- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar los ejes de la revisión final

### Decisiones tomadas con el dev-lead

- Los seis arreglos de `cli/`, cada uno con su test en `cli/test/` — «Las cuatro» (2026-10-15, al agrupar la deuda sin fila)
- El test de `(?m)…$` no va en Pester, que se retira (propuesta 0225): si sigue haciendo falta, va a Vitest en `cli/test/kit/` — prompt de arranque, 2026-10-26
- En paralelo con la 0221, la 0222, la 0226 y la 0227; al fusionar, `sdd merge --push` — prompt de arranque, 2026-10-26

## Intent

Seis fallos de la CLI que el campo ya reprodujo: el pre-commit da `Roadmap válido` con filas partidas o fundidas (una fila de deuda entera quedó dentro de otra); un cierre deja ⏳ las filas que apuntan a lo que cierra; `task start` rechaza la spec de una lite; el vigía de una ronda de fix reanudada sale a los 3–4 s (2 de 2 en la 0150); el agente generaliza `--path` o `--project-root` del último verbo que usó y falla; y un merge parado por el hook no dice qué test (~30 min y dos merges abortados en la 0149). El éxito: cada caso reproducido en la fila de deuda da la salida nueva en un test de `cli/test/`, y ningún `--path` que nombran las skills deja de funcionar.

## Scope

- Entra: `cli/src/roadmap/` (celdas por fila y aviso de filas que apuntan a una tarea ✅), `cli/src/tasks/brief.ts` (spec lite), `cli/src/watch/events.ts` (`isFinished`), `cli/src/cli/args.ts` y los `verbs.ts` de `roadmap`, `capabilities`, `decisions`, `estimation`, `init`, `upgrade` y `session` (`--project-root`), `cli/src/merge/attempt.ts` y `verify.ts` (tests fallidos), sus tests en `cli/test/`, las filas rotas que el check nuevo saque en `roadmap.md`, y las seis filas de deuda saldadas al cerrar.
- No entra: editar skills; quitar `--path` o `--root`; el aviso de filas que apuntan a una tarea cerrada en `ROADMAP.md`/`debt.md`; el test de `(?m)…$` (va con la 0225); la carrera del vigía antes de que se escriba el mensaje de la reanudación.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «seguido de las últimas 20 líneas de la salida del hook» | `capabilities/control-profiles.md:231` | delta, `MODIFIED` (los tests fallidos van antes de la cola) |
| «las últimas 20 líneas» del bloque de parada del cierre | `capabilities/archive.md:41` | se queda: la cola sigue saliendo; las líneas de tests fallidos van antes, en el mismo mensaje que el cierre cita |
| «una fila suelta, una fila vacía o una cabecera descuadrada con su separador» | `capabilities/roadmap.md:81` | delta, `MODIFIED` (se añade la fila descuadrada con su cabecera) |

- Filas que implementa: 0184 → solo `roadmap.md`: su fila (✅ al cerrar), las seis filas de deuda con «Actuar → 0184» (prefijo de saldada al cerrar; la del `(?m)`, parcial) y las filas 0198 y 0152, que la nombran en «tras» y no cambian; nada en `skills/` ni en `capabilities/`: comprobado con `Select-String -Pattern '0184'` sobre `skills/**/*.md`, `.docs/sdd/capabilities/*.md` y `.docs/sdd/*.md`.

## Approach

Seis arreglos en el código existente de cada verbo, cada uno con su test en el fichero de tests de su módulo. Las opciones nuevas se declaran en el `options` de cada verbo y se resuelven en un helper de `cli/src/cli/args.ts`, para que la regla «`--project-root` o el nombre de hoy, nunca los dos» viva en un sitio.

## Dónde se prueba

- Celdas por fila: `cli/test/roadmap/check.test.ts` (y `debt.test.ts`), como los tests de cabecera actuales, con un caso de `||` y otro de un `|` sin escapar en un código; y `node cli/bin/sdd.js roadmap check --path .docs/sdd` sobre el roadmap del repo.
- Filas que apuntan a una tarea ✅: `cli/test/roadmap/check.test.ts`, como los avisos de prefijo de cierre.
- `task start` lite: `cli/test/tasks/`, como los tests de `task start` de hoy (verbo por proceso o por función, según el que ya exista).
- Vigía reanudado: `cli/test/watch/watch.test.ts`, `subagentVerdict` sobre un transcript con `end_turn` y un `user` posterior.
- `--project-root`: un test por familia de verbo (de `--path`, de `--root`, `session tokens`) y el del error con la pista, en `cli/test/` junto a los de uso de cada verbo.
- Tests fallidos del merge: `cli/test/merge/attempt.test.ts` y `verify.test.ts`, con una salida de Pester y otra de Vitest con prefijo de moon.

## Términos y ADR

- Términos resueltos: raíz del proyecto — la carpeta que contiene `.docs/sdd/` (`--project-root`); `--path` sigue siendo la carpeta `.docs/sdd` en los verbos de documentos.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `roadmap`

**MODIFIED — Las cabeceras de tabla y los estados son los de la plantilla** (antes: "una fila suelta, una fila vacía o una cabecera descuadrada con su separador")

- GIVEN una sección de release cuya tabla empieza por `| id | Task | Tamaño | Estado |`, una fila de «Próximo» con el estado `pendiente` y otra con `❌ descartado`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: línea <n>: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»`, y para cada una de las dos filas `roadmap.md: línea <n>: estado «<texto>» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …`, y sale con 1
- AND una fila suelta, una fila vacía o una cabecera descuadrada con su separador dan los mensajes que hoy da `tests/RoadmapStructure.Tests.ps1`, con el prefijo `roadmap.md: `
- AND una fila de «Próximo» que acaba en `. || ✅ |` da `roadmap.md: línea <n>: la fila tiene 4 celdas y la cabecera 3`, y una de «Deuda técnica» con un `|` sin escapar dentro de un código da `roadmap.md: línea <n>: la fila tiene 4 celdas y la cabecera 3`; un `\|` escapado no cuenta; lo mismo en las tablas de `ROADMAP.md` y de `debt.md`
- AND los tests fijan el número de línea exacto de cada fixture

**ADDED — El roadmap 2.x avisa de una fila que apunta a una tarea ya cerrada**

- GIVEN un roadmap 2.x con la fila `0149` ✅ en «Próximo», la fila `0047` ⏳ en la línea 12 con «**Absorbida por la propuesta 0131 → 0149**», la fila `0048` ⏳ con «**Absorbida por la propuesta 0131 → 0149 y 0150**» y la `0150` ⏳, y en «Deuda técnica» una fila de la línea 30 con «Destino» `**Actuar → 0149**, patch de la CLI` sin prefijo de cierre en su «Ítem»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 12: apunta a 0149, ya ✅: sáldala` y `roadmap.md: aviso: línea 30: apunta a 0149, ya ✅: sáldala`, y ningún aviso de la fila `0048`, porque la `0150` no está ✅
- AND una fila «Absorbida» o de deuda cuya «Ítem» ya empieza por `**[Feature <id>, <fecha>: saldada — …]**` no avisa, ni una cuyo destino está 🧪
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0

### Capacidad: `control-profiles`

**MODIFIED — Un merge del cierre que falla deja la rama destino como estaba** (antes: "seguido de las últimas 20 líneas de la salida del hook")

- GIVEN un merge del cierre que falla: conflicto que no es el del log, verificación en rojo, push rechazado o error de git
- WHEN el script termina
- THEN la rama destino local vuelve al commit que tenía antes de fusionar la feature; no se empuja nada; el worktree temporal se ha retirado y el cerrojo está libre
- AND el script sale con error y nombra el paso que falló y el motivo
- AND si un hook rechaza el merge y no hay ficheros en conflicto, el motivo es `verificación: el hook rechazó el merge.` seguido de los tests fallidos y de las últimas 20 líneas de la salida del hook, no un conflicto
- AND con el hook o `--verify` en rojo, si la salida tiene líneas de un test fallido —`[-] se llama sdd-archive` de Pester, ` FAIL  test/a.test.ts > grupo > nombre` o `× nombre` de Vitest, también tras un prefijo de moon como `cli:test | `—, antes de la cola va `tests fallidos:` y esas líneas, en orden y hasta 20; sin ninguna, el mensaje no cambia
- AND si `git merge` falla sin conflictos y sin llegar a preparar el merge (un fichero sin seguimiento que sobrescribiría, una opción que su versión no admite), el motivo es `<paso>: git merge falló sin conflictos.` seguido de las últimas 20 líneas de su salida, no un rechazo del hook
- AND si la verificación falla porque un fichero lo tiene abierto otro proceso, el motivo es `bloqueado: '<fichero>' lo tiene abierto <proceso>` (el que nombre la salida del gate, u «otro proceso») y la ruta del log, no `verificación:`
- AND si `--verify` sale en rojo, el mismo comando corre sobre el commit de antes del merge y el error acaba con `base: en rojo: el mismo comando también falla sin la rama (salida en <log>); mira la deuda del proyecto antes de investigar` o con `base: en verde: el rojo lo trae la rama`; tras un `bloqueado:` o un rechazo del hook no corre

### Capacidad: `cli`

**ADDED — `sdd task start` abre una spec lite como brief**

- GIVEN una `spec.md` con `mode: lite` en el frontmatter y sin ningún encabezado `Task <n>`
- WHEN se ejecuta `node sdd.js task start <spec.md> 1`
- THEN escribe la spec entera en `task-1-brief.md` del workspace, imprime `brief: <ruta>` y `base: <sha de HEAD>`, y sale con 0
- AND con un plan sin `mode: lite` y sin `Task 1`, sale con 1 y `task 1 not found in <plan> (no heading matching 'Task 1')`, como hoy

**ADDED — El vigía no da por terminado un subagente reanudado**

- GIVEN el transcript de un subagente cuya última respuesta acaba en `end_turn` y, después, un mensaje `user` de una reanudación con `SendMessage`
- WHEN se ejecuta `sdd watch subagent` sobre él
- THEN no escribe `TERMINADO:`: el veredicto es `EN MARCHA:` o `SILENCIO:` según los minutos sin escribir, como un subagente que trabaja
- AND sin mensaje `user` tras el `end_turn`, escribe `TERMINADO: <etiqueta> devolvió su resultado`, como hoy

**ADDED — `--project-root` vale en todo verbo que sitúa el proyecto**

- GIVEN un proyecto en `D:\code\reservas` con `.docs/sdd/`
- WHEN se ejecuta `node sdd.js roadmap check --project-root D:\code\reservas`, `capability index --project-root …`, `decision check --project-root …`, `estimation log --project-root …`, `upgrade --project-root …` o `session tokens --project-root …`
- THEN cada uno hace lo mismo que con `--path D:\code\reservas\.docs\sdd` (en `roadmap`, `capability` y `decision`), con `--root D:\code\reservas` (en `estimation`, `init` y `upgrade`) o con `--path D:\code\reservas` (en `session tokens`)
- AND con `--project-root` y el nombre de hoy a la vez, escribe `--path y --project-root no van juntas` (o `--root y --project-root no van juntas`) y el uso, y sale con 2
- AND `node sdd.js merge --path .` escribe `opción desconocida: «--path»; la raíz del proyecto va en --project-root` y el uso, y sale con 2; lo mismo con `--root` en `merge`, `id next`, `id claim` y `roadmap publish`

**Reglas de la capacidad**

- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`; `el proyecto ya está al día con el kit <versión>`; `sin sdd-kit.json: se aplican todas`; `init en curso: sigue con sdd-init`; `--mark <versión>: el kit no trae esa migración`; `--mark <versión>: el proyecto ya está en <versión>`; `panel: http://127.0.0.1:<puerto>/`; `<ruta>: no es una lista de pasos {id, title}`; `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook`; `sdd-kit: no borro los temporales de Claude Code: <base> no es una ruta absoluta`; `sdd-kit: no borro los temporales de Claude Code: no sale el nombre de la carpeta del proyecto de <ruta>`; `--<opción> y --project-root no van juntas`; `opción desconocida: «--<opción>»; la raíz del proyecto va en --project-root`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-26 | aprobada (opción «Apruebo») |
