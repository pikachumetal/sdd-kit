# Capacidad — implementation

## Propósito

La ejecución de un plan aprobado: Native y SDD, las tasks, sus RED, el ledger, el workspace, la compactación, el effort de cada despacho y el worktree de la implementación.

## Requisitos

### El artículo de calidad de código viaja a implementadores y revisores

- GIVEN un plan cuyas Restricciones globales tienen un bloque «De código», con el artículo de calidad de la constitution, y un bloque «De proceso», o una feature en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task, un re-revisor o un eje de la revisión final
- THEN el encargo lleva el bloque «De código» literal como primera sección
- AND el bloque «De proceso» (política de modelos, modo de ejecución, atribución de commits) no aparece en el encargo de ningún revisor
- AND en modo lite el bloque es el artículo de calidad de código de la constitution, copiado literal; la política de modelos la aplica quien despacha

### Los tests de la spec preceden al implementador

- GIVEN una task cuya implementación se despacha a un subagente
- WHEN el hilo principal prepara el despacho
- THEN los tests que codifican los escenarios de la task existen antes del primer encargo, escritos por el hilo, uno por THEN y uno por cada línea del Review Focus del plan que nombra esa task, en RED, sin commitear
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica; los commitea con su implementación con `git add` de rutas explícitas y nunca con `--no-verify`
- AND el hilo guarda una copia fuera del repo antes del despacho y, al volver el implementador, la compara con el test commiteado; un cambio que no sea de formato va al revisor de la task

### El implementador no esquiva lo que le frena

- GIVEN un implementador despachado con el encargo del kit
- WHEN un gate o un checker le avisa, un test que no es suyo falla, o necesita ver el código sin su cambio
- THEN no edita la configuración del gate ni disfraza el código para que el aviso desaparezca: para y lo reporta con el mensaje literal
- AND antes de relanzar un test rojo captura su nombre y su mensaje, y no le atribuye causa sin evidencia
- AND no usa `git stash`: aparta trabajo con un commit WIP o lee la versión de la base con `git show`

### Cada task del plan viaja sola

- GIVEN un plan cuyas tasks usan firmas, formatos o valores que fija otra task o una sección del plan
- WHEN se extrae una task para su encargo
- THEN el texto de la task lleva `Interfaces: Consume / Produce` con los nombres y firmas exactos, y los valores que necesita copiados, sin remitir a otras secciones
- AND ninguna task pide leer otra task ni el plan entero: un implementador con el contexto vacío la hace con su texto, los ficheros que nombra y las Restricciones globales

### Un umbral superado en una unidad es Minor

- GIVEN un diff correcto con una función de 21 líneas y un bloque «De código» que fija funciones de 20 líneas como máximo
- WHEN un revisor de task o el revisor final lo revisa
- THEN reporta la función como Minor y, si no hay otro hallazgo, aprueba
- AND una función de 22 líneas o más sigue siendo Important

### El formato que exige el linter no rompe el contrato de los tests RED

- GIVEN un implementador que solo añadió en un test RED la línea en blanco que exigía el linter, sin tocar aserciones, nombres ni datos, y lo declara en su informe
- WHEN el revisor de task revisa el diff
- THEN no lo reporta como Critical ni como Important

### Cada task del plan verifica solo sus superficies

- GIVEN una spec aprobada cuyo cambio toca BD, backend y frontend, y un proyecto con una suite de BD distinta de la de frontend
- WHEN se escribe el plan
- THEN cada task declara sus superficies (BD · backend · frontend · tooling · docs) y una verificación con los comandos de esas superficies y ninguno más
- AND la suite de BD solo aparece en las tasks cuyas superficies incluyen BD (migraciones, persistencia o dialecto)
- AND con «Suites» `unit` · `dotnet test Api.UnitTests` · ~20 s · unitario y `api` · `dotnet test Api.IntegrationTests` · ~1 min · integración, una task que cambia `Domain/Pricing.cs` sin escribir tests de integración verifica con `unit`, y `api` lo corre el gate de cierre si `--affected` lo marca; una task que escribe `Api.IntegrationTests/PeopleTests.cs` corre también ese fichero

### El gate de cierre se ejecuta una vez

- GIVEN una constitution que pide el gate completo en verde al cerrar cada task
- WHEN se escribe el plan y se despacha una task de solo frontend
- THEN el gate de cierre aparece una sola vez, al acabar las tasks, en `sdd-validate`, y lo ejecuta el hilo principal
- AND no aparece en «De código» ni en la verificación de esa task, y el encargo de su implementador le dice que ejecute su verificación y no la suite completa
- AND corre el que declara `operations.md` §Testing, filtrado por lo afectado si el proyecto lo declara, y entero solo si la rama toca un fichero de «Sin filtro»
- AND tras su merge de sincronización, el cierre de `sdd-archive` repite solo lo que afecta lo que trajo la base: las tareas que cruzan la rama y la base

### El effort declarado viaja en el tipo de agente

- GIVEN un plan cuya task declara en `Modelo` «Sonnet, effort medium» con el kit instalado como plugin de Claude Code
- WHEN el hilo despacha su implementador
- THEN la llamada a `Agent` lleva `subagent_type: sdd-kit:effort-medium` y `model: sonnet`
- AND cada petición a la API del subagente lleva `effort: medium`

### Sin effort en el harness, el plan lo dice

- GIVEN un harness que no expone el effort al despachar (kit instalado sin sus agentes, u otro harness)
- WHEN se escribe el campo `Modelo` de una task
- THEN dice «effort: no disponible en este harness, hereda el de la sesión» en vez de un nivel de effort

### La base se comprueba antes de cada task Native

- GIVEN un plan con `Ejecución: native` y dos o más tasks
- WHEN el hilo va a empezar cada task
- THEN antes compara la fila de la task y los ficheros de la task con la base, como antes de despachar un implementador

### Los RED de una task Native se apartan y se comparan

- GIVEN una task de un plan con `Ejecución: native`
- WHEN el hilo la empieza
- THEN escribe los tests de sus THEN antes del código y guarda una copia fuera del repo
- AND antes del commit de la task compara la copia con el test con `git diff --no-index`, y un cambio que no sea de formato es un ruling del ledger

### Sin el tipo de effort, se dice antes del primer despacho

- GIVEN una sesión cuyos tipos de agente no incluyen el `sdd-kit:effort-<nivel>` que toca
- WHEN el hilo va a hacer el primer despacho de la feature (implementador en SDD, revisor final en Native)
- THEN antes de despachar dice que el tipo falta, despacha con el `model` y la frase de respaldo «effort: no disponible en este harness, hereda el de la sesión», y lo registra como ruling

### Cada task de producto acaba en algo que se prueba en la aplicación

- GIVEN un plan para las salas favoritas, que tocan la migración `favorite_rooms`, la API y la estrella de la pantalla de salas
- WHEN se parte en tasks
- THEN la task «Marcar Sur como favorita» atraviesa migración, API y estrella, y su línea «Se prueba en la aplicación» dice «Ana pulsa la estrella de Sur y la ve llena tras recargar». No sale una task «BD y API» seguida de otra «web».
- AND una task que no deja nada que se pueda probar (una migración de datos previa, un refactor) lleva en esa línea «no, porque <motivo>»
- AND cada task lleva `**Tras**:` con la task de la que depende, o `—`: «Quitar Sur de favoritas» lleva `Tras: Task 1`
- AND el plan dice que las tasks se ejecutan en orden, sin paralelo
- AND el plan no fija un tamaño en horas por task

### En `pair`, cada task cerrada para con su guion de pruebas

- GIVEN perfil `pair` y la Task 1 de 2 de la feature 0012 («Validar al reservar») con su revisión limpia y su commit
- WHEN el hilo cierra la Task 1
- THEN para antes de la Task 2 y presenta el guion de la Task 1, con la forma del guion de la validación: por ejemplo, «1. `salas reservar Norte 1012` → «Franja no válida: usa HH-HH, p. ej. 10-12»; 2. `salas reservar Norte 10-12` → `{"room":"Norte","slot":"10-12"}`»
- AND en `delegate` y `unattended` sigue con la Task 2 sin parar ni presentar guion

### Las tasks del plan conservan su nombre

- GIVEN una feature en modo full con su plan escrito
- WHEN el dev abre `plan.md` y el registro vivo
- THEN las unidades del plan se llaman «Task 1», «Task 2»… y el registro es `tasks.md`, con cabecera `| # | Task | Status | Commit | Notas |`
- AND la palabra «feature» nombra solo la unidad del kit: la spec, la rama y la carpeta

### El agente para lo que arrancó por su PID o su puerto

- GIVEN la feature 0012 con su web levantada por el agente con `PORT=4656 node server.mjs` para la verificación visual o para el smoke, y otros procesos `node` en la máquina (el MCP de Playwright, el servidor del dev-lead)
- WHEN el agente termina de usarla
- THEN la para por el PID que guardó al arrancarla o por el proceso que escucha en el puerto 4656
- AND ninguna tool call la para por el nombre del ejecutable (`taskkill /IM node.exe`, `pkill node`, `killall node`, `Stop-Process -Name node`) ni por un patrón de su línea de comandos (`pkill -f server.mjs`, filtrar `CommandLine`)
- AND antes de arrancar comprueba que el puerto 4656 está libre (si no, no es suyo: usa otro), y tras parar, que quedó libre; si sigue escuchando, para el que escucha, porque el PID guardado era el de un lanzador

### Una task Native no se da por completa sin su commit

- GIVEN la Task 1 de un plan Native, cuya «Verificación» (`node --test tests/slot-format.test.js`) pasa, y un pre-commit que corre la suite y rechaza el commit porque `tests/import.test.js` falla
- WHEN el agente cierra la task
- THEN no ejecuta `sdd task done` ni escribe la línea `Task 1: complete` mientras `HEAD` siga en la base de la task
- AND lee el mensaje del hook y arregla la causa antes de volver a commitear

### Un hallazgo de ejecución se reproduce antes de arreglarse

- GIVEN un revisor que marca como Important «`GetFullPath` lanza con una ruta inválida y el script no sale con 0»: un hallazgo Critical o Important que afirma algo de ejecución (una excepción, un código de salida, un valor en un entorno o una plataforma concretos)
- WHEN el hilo abre la ronda de fix
- THEN en SDD el encargo del implementador pide como primer paso un test que reproduzca la premisa y falle (RED), y el fix solo con ese RED; si no sale RED en un intento, el implementador vuelve con `NEEDS_CONTEXT`, el test y su salida, sin arreglar
- AND en Native el hilo hace lo mismo, y si no sale RED en un intento no arregla: decide con esa evidencia
- AND no reproducirlo no descarta el hallazgo: el hilo decide arreglar sin RED, rechazarlo o diferirlo, y lo registra como ruling con la salida del intento
- AND un hallazgo que se ve leyendo el diff (un nombre, la estructura, una duplicación) no lleva este paso

### Los rulings del ledger se cosechan antes de borrar el workspace

- GIVEN el ledger de un plan con `Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24`, `Final: minor (deferred) nombre de variable poco claro en parse()` y `Final: Ruling: no se renombra Foo — fuera de alcance`
- WHEN el cierre ejecuta `node sdd.js ledger rulings <plan.md>`
- THEN escribe esas tres líneas en el orden del ledger y sale con 0
- AND sin ledger escribe `Sin rulings` y sale con 0
- AND una fila de tabla del ledger (la del pre-flight) que contiene `Ruling:` no sale: solo cuentan las líneas que no empiezan por `|`

### Las tasks Native se abren y cierran desde cualquier shell

- GIVEN un plan con `Ejecución: native` en Windows, con PowerShell como shell principal, y una «Verificación» que no imprime nada si pasa
- WHEN el hilo abre y cierra cada task con `sdd task start` y `sdd task done <plan> <n> <base> -- pwsh -NoProfile -Command "Invoke-Pester -Path tests/Foo.Tests.ps1 -CI"` desde la herramienta PowerShell
- THEN `sdd task start` imprime la ruta del workspace en forma Windows (`D:\…`), y la línea `Task <N>: complete (…, tests: <comando> → (sin salida))` queda en el ledger a la primera
- AND si `sdd task start` falla o no imprime ruta, sale con un código distinto de 0 y el hilo no escribe en el ledger
- AND con un test en rojo, `sdd task done` no escribe `Task <N>: complete` y sale con el código del comando; con un comando que no existe, sale con 127 y tampoco lo escribe
- AND con una salida de vitest, que acaba en `Duration …`, la línea del ledger lleva la de `Tests N passed`; sin línea `Tests …`, la última línea no vacía de la salida

### La implementación la lleva `sdd-implement`

- GIVEN la feature 0042 en modo full, con la spec aprobada y el plan con `Ejecución: native, porque 2 tasks encadenadas por la interfaz de Ledger, …`
- WHEN `sdd-propose` entrega la feature
- THEN invoca `sdd-implement`, que invoca `sdd-implement-native` con `Skill`; esta ejecuta las dos tasks en Native y, con la última hecha, invoca `sdd-validate`, que corre el gate, recorre el guion, hace la revisión final y presenta la validación, y con la validación registrada invoca `sdd-archive`, que abre comprobando esa validación
- AND con `Ejecución: subagent`, `sdd-implement` invoca `sdd-implement-subagent`
- AND ningún texto que carga el agente (`skills/` sin las marcas `<!-- kit: … -->`) invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`
- AND en modo lite, sin plan, el método es el de `execution` si está fijado y Native con `auto`, con `spec.md` en el lugar del plan

### Una task Native se registra en el ledger de `sdd-implement`

- GIVEN un plan con `Ejecución: native`
- WHEN el hilo ejecuta cada task
- THEN la abre con `sdd task start` y la cierra con `sdd task done` y el comando de su «Verificación», y el ledger del workspace tiene su línea `Task <N>: complete`

### El encargo del implementador lleva el decálogo de calidad

- GIVEN un plan con el bloque «De código» en sus Restricciones globales
- WHEN se despacha el implementador de una task, o el hilo prepara la ejecución en Native
- THEN el encargo lleva, tras `## Code constraints`, la sección `## Quality decalogue` con las diez reglas y la frase de que, si una choca con las Code constraints, mandan las constraints
- AND en Native el hilo la lee una vez, al preparar la ejecución
- AND el encargo del revisor de task y el del re-revisor no la llevan

### El workspace del plan se anuncia

- GIVEN un plan con `## Task 1` y `## Task 2`
- WHEN `sdd-implement-native` o `sdd-implement-subagent` corre `sdd workspace <plan>`, al empezar o al retomar
- THEN el comando escribe en stderr `Workspace del plan: <ruta absoluta del workspace> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`
- AND con `Task 1: complete …` en el ledger del plan, la línea acaba en `· retomo en la Task 2`; sin ninguna task completa, o con las dos, no lleva sufijo

### Tras una caída o un corte por cuota, la ejecución sigue desde el ledger

- GIVEN un plan SDD con `Task 1: complete (commits a1b2c3d..d4e5f6a, review clean)` en el ledger, `task-2-report.md` con `Status: DONE` y su commit `b7c8d9e`, y la notificación de fallo del implementador de la Task 2 por cuota agotada
- WHEN el hilo retoma
- THEN no relanza la Task 1 ni la Task 2: despacha la revisión de la Task 2 sobre `d4e5f6a..b7c8d9e` y deja `Task 2: Ruling: recuperación tras corte por cuota — informe completo, sigue a revisión`
- AND si la Task 2 no tuviera informe, la relanza una vez con el mismo brief y el mismo modelo, y el encargo nombra los ficheros que `git status` da cambiados

### El walkthrough dice si la ejecución compactó

- GIVEN una feature en Native de 4 tasks cuya sesión compactó en la Task 2 con dos tasks pendientes
- WHEN el hilo retoma
- THEN escribe en el ledger `Task 2: Ruling: compactación — sigo con SDD — quedan 2 tasks`
- AND el walkthrough lleva en su §2 «Tiempo y coste» `Compactación: sí, en la Task 2 → SDD desde la Task 3`, y en una feature que no compactó, `Compactación: no`

### Quien implementa ve fallar los RED antes de implementar

- GIVEN un plan con `Ejecución: subagent` y la Task 1 con el RED `test/informe.test.js` escrito por el hilo y sin commitear
- WHEN el implementador recibe su encargo
- THEN ejecuta `test/informe.test.js` antes de editar ningún fichero de `src/`
- AND su informe lleva en «TDD Evidence» el comando, la salida en rojo de antes de implementar y por qué se esperaba ese fallo

### Un fallo se investiga con `sdd-debugging`

- GIVEN un patch de un fallo determinista («`libres 10:00-12:00` devuelve Norte aunque Norte tiene una reserva activa en esa franja»), o un paso del plan cuyo `Expected:` no coincide porque el código falla
- WHEN el agente lo investiga
- THEN invoca `sdd-debugging` y escribe la causa raíz con su evidencia en el código antes de proponer el arreglo
- AND antes del arreglo hay un test en rojo que reproduce el fallo, escrito con `sdd-tdd`
- AND en un patch, §2 de `patch.md` lleva la causa raíz con su evidencia antes de editar el código: la fase 4 de `sdd-debugging` empieza con ella escrita
- AND ningún fichero de `skills/` invoca `superpowers:test-driven-development` ni `superpowers:systematic-debugging`

### El worktree de la implementación lo prepara `sdd-worktrees`

- GIVEN la 0010 con la spec y el plan aprobados, abierta en un worktree que creó Orca en la rama `feature/0010-cancel`, y un proyecto con `## Entornos` y §Testing `Gate de cierre: node --test` en `steering/operations.md`
- WHEN la copia del método (`sdd-implement-native` o `sdd-implement-subagent`) hace su preparación
- THEN invoca `sdd-worktrees`, que detecta que ya está en un worktree enlazado, lo dice con su rama, y no crea otro
- AND ejecuta `env:setup` después de instalar las dependencias, y los encargos de implementador dicen dónde está `.sdd-env.json`
- AND la baseline ejecuta `node --test`, el gate de cierre del proyecto; sin gate declarado en `steering/operations.md` ni en la constitution, lo dice y pregunta qué ejecutar
- AND con un gate filtrado (`moon run app:test api:test --affected --base develop`), la baseline corre sin el filtro solo las tareas cuyos inputs incluyen ficheros del Scope de la spec (`moon run api:test` si el Scope solo toca `src/api/`), y su informe es la línea `Gate:` con `app:test: saltada (fuera del Scope de la spec)`; nunca da la baseline por buena con un filtro que no corrió ninguna tarea; si ninguna tarea lee ficheros del Scope (un cambio solo en `.docs/`), las nombra todas saltadas fuera del Scope, lo dice y da la baseline por lista
- AND si la baseline falla, corre el mismo comando en un worktree temporal desanclado de la rama de integración; si también falla allí, busca las primeras líneas de error en la deuda del proyecto y cita la fila o abre una en «Por triar»; después informa de los fallos con ese veredicto y pregunta si sigue o investiga
- AND ningún fichero de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`

### La verificación de una task dice su línea de resumen

- GIVEN una task con superficie tooling en un proyecto con `node --test`, cuya salida acaba en `ℹ duration_ms 52.1` y no en el resumen
- WHEN el agente escribe su «Verificación»
- THEN es un comando que sale con un código distinto de 0 si algo falla, sin códigos de color, y la línea dice, literal, la línea de resumen que imprime (`ℹ fail 0` con `node --test`, `Tests  12 passed (12)` con Vitest)
- AND sin tests automáticos, dice el smoke manual con su resultado esperado

### La línea base corre en un worktree desanclado en el commit de apertura

- GIVEN la 0010 con el commit de apertura `a1b2c3d` en `feature/0010-cancel` y la línea base de `sdd-worktrees` en segundo plano
- WHEN la sesión escribe los RED de la Task 1 en su árbol mientras la línea base corre
- THEN la línea base corre en `git worktree add --detach <padre de los worktrees>/baseline-0010 HEAD`, con las dependencias (y `env:setup`, si hay `## Entornos` en `steering/operations.md`) instaladas allí, y su resultado es el de `a1b2c3d`: no cambia con los ficheros que la sesión escribe
- AND al acabar, verde o rojo, quita ese worktree (`env:clean` antes, si hubo `env:setup`); la sesión sigue en el suyo
- AND si sale roja, corre el mismo comando en un worktree desanclado de la rama de integración, como «El worktree de la implementación lo prepara `sdd-worktrees`»

### `tasks.md` nace antes de la primera task

- GIVEN un plan con dos tasks y la apertura commiteada sin `tasks.md`
- WHEN el agente va a empezar la Task 1, en Native o en SDD
- THEN escribe `tasks.md` antes del primer `sdd task start` o del primer despacho
- AND va en el commit de la apertura o, si ya está hecho, en el de la Task 1
- AND con una sola task no lo escribe por esta regla
- AND con más de una task y sin `tasks.md` junto al plan, `sdd task start` y `sdd task brief` fallan con un error que nombra el fichero, sin escribir el brief

### Un patch sigue en `sdd-implement`, con verificación y sin revisión final

- GIVEN el patch 0031, confirmado en `sdd-propose`: si cancelo Norte el martes, que no tengo reservado, me quita la del lunes
- WHEN `sdd-propose` lo entrega
- THEN invoca `sdd-implement`, que lee lo primero `references/patch-flow.md` y sigue su flujo: causa raíz, `patch.md`, fix mínimo y commit; ni el Setup ni los bucles de tasks aplican
- AND antes de decir que está arreglado, §4 de `patch.md` lleva el comando del test y su salida leída en esta sesión, como dice la «Gate Function» de `sdd-verify`
- AND antes del commit del fix, un revisor en Sonnet lee `patch.md` y el diff —la causa raíz, el arreglo y su test— y §4 responde cada hallazgo: arreglado, o rechazado con su motivo
- AND no se despacha ningún eje de la revisión final; tras el commit del fix invoca `sdd-validate`, que corre el gate, recorre el guion y presenta la validación, como en una feature, y solo con la validación registrada sigue en `sdd-archive`; una vuelta tras un fallo del dev-lead pasa por ese mismo revisor Sonnet de §4 antes de volver a presentar

### Ninguna skill intermedia entre propose e implement

- GIVEN la feature 0010 con la spec aprobada y el plan escrito
- WHEN el hilo pasa de `sdd-propose` a implementar y, al acabar, a cerrar
- THEN las únicas skills de flujo que invoca son `sdd-implement`, la copia de su método (`sdd-implement-native` o `sdd-implement-subagent`), `sdd-verify` y `sdd-archive`
- AND mientras trabaja el revisor final, `sdd-implement` escribe sin commitear el borrador de `walkthrough.md` y el delta fusionado, sin adelantar el roadmap, y `sdd-archive` los completa

### Quien depura busca el fallo en la deuda antes de investigar

- GIVEN el molde `remedy`: `npm run informe` falla con `ENOENT` sobre `.cache/informes/ocupacion.csv`, y en «Lista» de `debt.md` hay una fila de problema «El listado de ocupación no sale tras limpiar el repo», con «Remedio temporal» `recrea la carpeta de la caché`
- WHEN se invoca `sdd-debugging` para ese fallo
- THEN compara el fallo con las filas de la deuda por significado, no solo por las palabras del error, y dice que esa fila lo cubre, con su remedio
- AND aplicar el remedio no se da por causa raíz: la fila sigue abierta y el arreglo sigue pendiente
- AND sin una fila que lo nombre, sigue la Fase 1 sin cambios

### Tras compactar, las skills de la implementación vuelven enteras

- GIVEN el kit construido en `dist/`
- WHEN corre `moon run kit:skill-size`
- THEN `dist/skills/sdd-implement/SKILL.md`, `dist/skills/sdd-implement-native/SKILL.md` y `dist/skills/sdd-implement-subagent/SKILL.md` ocupan menos de 20.000 bytes cada una, por debajo del corte con que Claude Code vuelve a adjuntar cada skill tras compactar
- AND la fase de ninguna de las tres pasa de 100.000 caracteres
