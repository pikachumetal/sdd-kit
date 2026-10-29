# Capacidad — onboarding

## Propósito

La inicialización de un proyecto con el kit (`sdd-init`): qué puede esperar un dev de la entrevista y de los documentos de anclaje que produce.

## Requisitos

### La entrevista fija las cinco reglas de producto

- GIVEN una init, con código o sin código, en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) —con código, deducidas del código como propuesta a confirmar— y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe o no se deduce, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada
- AND el bloque de proceso ha decidido además el modo de ids del proyecto, que se escribe en `sdd-kit.json`
- AND sin código la entrevista incluye qué queda fuera de alcance y qué términos del dominio se fijan, y `## Capabilities and Constraints` y `## Terminology` de `PRODUCT.md` llevan la respuesta, o «pendiente» o el marcador de la plantilla si el dev-lead no sabe: con el dev-lead diciendo «no sé» a las dos, ninguna de las dos secciones lista un término ni una exclusión que él no dijo

### La entrevista hace una sola pregunta por turno

- GIVEN una init en su entrevista
- WHEN el agente pregunta al usuario o le presenta un documento
- THEN pregunta con `sdd-grilling` ([`interviewing`](interviewing.md)): cada turno termina con una única pregunta de la lista de la entrevista, o con un único documento para aprobar
- AND convención de ramas, worktrees y entorno del worktree son preguntas distintas, en turnos distintos

### La pregunta de ramas recomienda git-flow

- GIVEN una init que llega a la convención de ramas
- WHEN el agente la pregunta
- THEN sin código, o con código sin convención que se vea, la opción recomendada es git-flow: `main` estable, `develop` de integración y `feature/<id>` desde `develop`
- AND con código en un repo con `main` y ramas `feat/*` que salen de `main`, la recomendada es esa convención, y git-flow va como alternativa
- AND el usuario puede elegir otra, y se registra la que elija

### Lo que fijan las instrucciones del usuario no se pregunta

- GIVEN unas instrucciones del usuario (`CLAUDE.md` global o del proyecto) que ya fijan un punto de la entrevista, p. ej. el formato de commit o el idioma del código
- WHEN la entrevista llega a ese punto
- THEN el agente no lo pregunta: la constitution lo referencia

### Git sobre un repo existente

- GIVEN una init sobre un repo que ya existe y cuyas ramas o remoto no siguen la convención acordada
- WHEN la init llega al paso de git
- THEN el agente presenta el plan completo (renombrados, ramas nuevas, rama por defecto del remoto, borrados) y espera la confirmación antes de ejecutar nada
- AND las operaciones sobre el remoto las ejecuta el usuario, con los comandos que le da el agente

### La init calca cada documento de su plantilla

- GIVEN un `sdd-init` que crea `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` o, en `.docs/sdd/steering/`, `constitution.md`, `operations.md`, `architecture.md`, `debt.md` o `estimation.md`
- WHEN escribe cada documento
- THEN su estructura es la de la plantilla correspondiente de `sdd-templates`, y el contenido sale de la entrevista (sin código) o del código confirmado (con código)
- AND ningún documento copia texto, secciones ni notas del `.docs/` del kit ni de otro proyecto
- AND las tablas que leen otras skills (Now, Next y Later de `ROADMAP.md`; las de `debt.md`; `## [Unreleased]` del changelog) tienen las columnas y cabeceras literales de la plantilla
- AND la init no crea `mission.md`, `tech-stack.md`, `environments.md` ni `.docs/sdd/roadmap.md`

### La entrevista fija las claves de control

- GIVEN una init con el usuario presente
- WHEN la entrevista llega a las claves del kit
- THEN el agente invoca `sdd-config`, que hace en turnos distintos las preguntas de su catálogo, cada una con su opción recomendada y su motivo: modo de ids, perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos), método de ejecución (`auto`), quién valida (`manual`; `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar), qué se hace con los Minor de la revisión final (`defer`) y la tabla de precios («sí», con la tabla leída de la página oficial de precios de Anthropic)
- AND `sdd init --config` guarda solo lo que el usuario responde y `--finish` lo sube a `sdd-kit.json`: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND la pregunta de push recomienda «sí» solo si la convención de ramas es git-flow; con otra convención se hace sin opción recomendada
- AND la init no pregunta las preferencias personales: el resumen de cierre dice que se fijan con `sdd-config`

### La init deja la memoria automática desactivada y los temporales ignorados

- GIVEN un `sdd-init` sobre un proyecto cuyo `.claude/settings.json` es `{"permissions": {"allow": ["Bash(npm test)"]}}`
- WHEN ejecuta `sdd init --root <raíz> --finish`
- THEN `.claude/settings.json` conserva `permissions` y gana `"autoMemoryEnabled": false`, `extraKnownMarketplaces.sdd-kit` con la fuente `github` `pikachumetal/sdd-kit` y `extraKnownMarketplaces.superpowers-marketplace` con la fuente `github` `obra/superpowers-marketplace`, los dos con `"autoUpdate": true`, y `enabledPlugins` con `"sdd-kit@sdd-kit": true` y `"superpowers@superpowers-marketplace": true`
- AND `.gitignore` contiene las líneas `.playwright-mcp/`, `.superpowers/`, `.docs/sdd/sdd-kit.local.json` y `.temp/` una sola vez cada una, y cada ruta de `--ignore`
- AND con `"autoMemoryEnabled": true` previo, la salida dice `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia` y el agente pregunta; con su «sí», repite `--finish` con `--memory-off` y la clave queda en `false`; con su «no», se queda en `true` y el resumen de cierre lo anota
- AND si `claude plugin marketplace list` no muestra `superpowers-marketplace`, el agente ejecuta `claude plugin marketplace add obra/superpowers-marketplace`

### El log de estimación lo genera el script del kit

- GIVEN un `sdd-init`
- WHEN crea `.docs/sdd/steering/estimation-log.md`
- THEN lo genera `sdd estimation log` ejecutado desde el kit: la primera línea empieza por `<!-- AUTO-GENERADO por sdd estimation log (sdd-kit)` y la tabla no tiene filas
- AND el proyecto no contiene ninguna copia del script

### La constitution nombra el proyecto de referencia

- GIVEN una init en su entrevista
- WHEN el agente pregunta si el proyecto replica los patrones de otro
- THEN la constitution lleva en «Convenciones» la entrada «Proyecto de referencia» con la ruta o el repositorio que el usuario dé, o «no aplica» si responde que no

### La init sobre un template completa solo lo marcado

- GIVEN un proyecto instanciado desde un template con código de arranque (`package.json`, un login), que trae `tech-stack.md`, `architecture.md` y `environments.md` completos, `mission.md`, `roadmap.md` y secciones de `constitution.md` con `<!-- sdd-template: pending -->`, y un `sdd-kit.json` con `"version": "1.1.0"`
- WHEN el usuario lanza `sdd-init`, directamente o desde la skill puente del template
- THEN la init va en modo sin código: el código del template no se inventaría ni se propone como estado del proyecto
- AND la entrevista no pregunta stack, convención de ramas ni worktrees, y `tech-stack.md`, `architecture.md` y `environments.md` quedan sin cambios
- AND `sdd-kit.json` conserva `"version": "1.1.0"` y gana `ids` y las claves que el usuario respondió, y el resumen de cierre dice que el proyecto se pone al día con la migración
- AND con un template de la forma 3.0.0 (`PRODUCT.md`, `ROADMAP.md` y `steering/`), completa los marcados en esos documentos igual
- AND el contrato con el template es el texto `sdd-template: pending`: su posición y su número los decide el template

### El funcional aportado se guarda literal

- GIVEN un `sdd-init` en el que el usuario aporta un funcional (un documento, o texto pegado en el chat)
- WHEN la init escribe los documentos
- THEN el funcional está en `.docs/sdd/sources/` sin editar: con su nombre original si es un fichero, o como `<yyyyMMdd>-functional-brief.md` si llegó pegado
- AND `PRODUCT.md` lo enlaza, y cada fila del `ROADMAP.md` que sale de él cita su sección (`sources/<fichero> §<n>`)
- AND ninguna capacidad nace de él

### La entrevista pregunta cómo se verifica el frontend

- GIVEN una init de un proyecto con interfaz web: sin código con un stack Angular + .NET, o con código cuyo inventario encuentra un framework de UI
- WHEN la entrevista llega al frontend
- THEN pregunta con qué se verifica (detector, runner E2E y cómo entra el agente en la aplicación), recomendando impeccable y Playwright
- AND `operations.md` sale con `## Frontend` calcada de `operations-template.md` y rellena con la respuesta, y si declara una ruta de sesión, `sdd init --finish --ignore <ruta>` la deja en `.gitignore` una sola vez
- AND en un proyecto sin interfaz no se pregunta y `operations.md` no lleva `## Frontend`

### `sdd-templates` ofrece las plantillas de los documentos de la 3.0.0

- GIVEN el skill `sdd-templates`
- WHEN se lista su índice de plantillas de documentos
- THEN tiene `PRODUCT-template.md` → `PRODUCT.md` en la raíz, `constitution-template.md` → `.docs/sdd/steering/constitution.md`, `operations-template.md` → `.docs/sdd/steering/operations.md`, `architecture-template.md` → `.docs/sdd/steering/architecture.md`, `estimation-template.md` → `.docs/sdd/steering/estimation.md`, `now-next-later-template.md` → `ROADMAP.md` en la raíz, `debt-template.md` → `.docs/sdd/steering/debt.md`, `changelog-template.md` → `CHANGELOG.md` en la raíz y `adr-template.md` → `.docs/sdd/decisions/`
- AND `client-changelog-template.md` y `roadmap-template.md` siguen, marcadas «2.x» con la feature que las retira (0177 la de cliente; 0157 la del roadmap), y `mission-template.md`, `tech-stack-template.md` y `environments-template.md` ya no existen

### `PRODUCT.md` comparte la forma de impeccable

- GIVEN `PRODUCT-template.md`
- WHEN se lee
- THEN tiene, en este orden, `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology`, y no lleva el marcador `impeccable:product-schema`
- AND `## Terminology` muestra el formato del glosario con un ejemplo inventado: `**<Término>**:` con una definición de una o dos frases, y debajo `_Evitar_:` con los sinónimos que no se usan

### `operations.md` dice cómo se ejecuta y se verifica el proyecto

- GIVEN `operations-template.md`
- WHEN se lee
- THEN tiene `## Comandos`, `## Testing`, `## Frontend` y `## Entornos`, y no tiene tabla de versiones ni «Decisiones abiertas»
- AND `## Testing` pide cada suite con su comando, su duración y su nivel (`unitario`, `integración`, `E2E` o `pendiente`), el comando de lo afectado, el gate de cierre —una orden, la integración y los E2E por lo afectado, con `--include-relations` en moon, o la suite entera si el proyecto no filtra— y el de merge, «Sin filtro» (los globs del build, la configuración, las dependencias y los helpers comunes de los tests), «Lint» (formato y estilo, al editar y en el pre-commit, nunca en el gate), «CI de la base» (el pipeline y la orden que lee su último resultado, `sin orden de lectura` o `ninguna`), cómo entra el agente en la aplicación, si los tests usan el motor de producción y dónde deja cada suite sus temporales
- AND `## Frontend` tiene los campos URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo
- AND `## Testing`, solo si el proyecto tiene E2E, pide los flujos core con su test, el presupuesto de la suite E2E, los retries, los timeouts, el entorno de la suite y cómo crea y borra cada test sus datos; y cómo entra el agente nombra el usuario del agente, distinto del de la persona que valida

### Una sola init para proyecto nuevo y con código

- GIVEN un repo con `package.json` y `src/app.ts`, y otro con solo un `README.md`
- WHEN el usuario pide «quiero trabajar con SDD en este proyecto»
- THEN en los dos se invoca `sdd-init`, y antes de la primera pregunta dice el modo en una línea: «con código» en el primero, «sin código» en el segundo
- AND con código, lo que el código muestra (stack, módulos, comandos, deuda) se presenta como propuesta para confirmar y no se pregunta en abierto; sin código, se pregunta
- AND si el usuario corrige el modo, sigue con el que dice

### Cada documento se escribe solo tras su aprobación

- GIVEN una init en la generación de documentos
- WHEN el agente presenta un documento
- THEN el borrador va en el chat y el fichero no se escribe hasta el «sí»; tras escribirlo, `sdd init --approved <ruta>` lo registra
- AND sin usuario, la init espera: su último mensaje es la primera pregunta o el primer documento por aprobar, y no ha escrito ningún documento

### `CLAUDE.md` pasa por el gate

- GIVEN una init con todos los demás documentos aprobados y un `CLAUDE.md` previo con «Usa `npm run dev` en el puerto 3000» y «Las fechas van en UTC»
- WHEN llega a `CLAUDE.md`
- THEN presenta el `CLAUDE.md` nuevo con el diff contra el previo y espera el «sí» antes de escribirlo
- AND «npm run dev en el puerto 3000», verificado en `package.json`, ha ido a `operations.md`; «las fechas van en UTC», sin verificar en el código, sale en la lista de discrepancias

### Una init interrumpida se retoma por su registro

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` = `{"init": {"approved": ["PRODUCT.md", ".docs/sdd/steering/constitution.md"], "config": {"ids": {"mode": "sequence"}}}}`, esos dos ficheros, un `CHANGELOG.md` previo, y la petición «sigue con la init»
- WHEN arranca `sdd-init`
- THEN dice que `PRODUCT.md` y la constitution están aprobados, no los vuelve a presentar y sigue por `operations.md`
- AND no aplica migraciones, no vuelve a preguntar el modo de ids, y trata `CHANGELOG.md` como fichero previo que se cosecha y pasa por su gate
- AND con todos los documentos en `init.approved`, sigue por el paso de git y `sdd init --finish`

### Un fichero de la raíz que ya existe no decide nada

- GIVEN un repo con un `PRODUCT.md` escrito por impeccable y sin `.docs/sdd/`
- WHEN el usuario pide «quiero trabajar con SDD en este proyecto»
- THEN es una init nueva, no una init en curso
- AND el `PRODUCT.md` se cosecha y su versión nueva se presenta con el diff antes del «sí»

### La entrevista fija cómo se prueba el proyecto

- GIVEN una init con código cuyo `package.json` tiene los scripts `test` (`vitest run`) y `e2e` (`playwright test`), y un CI que ejecuta `npm test`
- WHEN genera `operations.md`
- THEN `## Testing` propone las suites `` `unit` · `npm test` · pendiente · pendiente `` y `` `e2e` · `npm run e2e` · pendiente · E2E ``, el gate de cierre y el de merge con esos comandos, y cada duración como `pendiente`
- AND el nivel de `unit` queda `pendiente` porque ni su config ni su código dicen qué arranca, y el dev-lead lo dice; `e2e` es E2E porque corre con Playwright
- AND propone «Sin filtro» con los manifiestos, lockfiles y configs que existen (`package.json`, `package-lock.json`, `vitest.config.ts`, `playwright.config.ts`) y las carpetas de helpers comunes de los tests que encuentre; «Lint» con el lint o el formato del pre-commit o de los scripts (`npm run lint`), o `ninguno`; y «CI de la base» con el pipeline encontrado (`.github/workflows/ci.yml`) y `gh run list --workflow ci.yml --branch develop -L 1 --json conclusion,headSha`, o `ninguna`
- AND con un `playwright.config.ts` sin `outputDir`, «Temporales» propone `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`, sin editar la config ni añadir filas al roadmap; una suite cuyo sitio no fijan ni su config ni el valor por defecto de su runner sale como `no declarado`, sin propuesta
- AND sin código, pregunta «¿Cómo se prueba?» con la recomendación que sale del stack; con «no sé», cada campo sin respuesta queda `no declarado`

### El marcador sale del kit y se escribe al final

- GIVEN una init con el kit cargado cuyo `.claude-plugin/plugin.json` dice `3.0.0`
- WHEN termina
- THEN `sdd init --finish` escribe `.docs/sdd/sdd-kit.json` después del paso de git, con `version` `3.0.0`, `channel` `plugin`, `updated` del día y las respuestas de `sdd-config`, y sin la clave `init`
- AND la init no pregunta el canal

### Un template sin marcador se corrige en la línea del modo

- GIVEN un repo recién instanciado de otro template, con `package.json` y un login, sin `sdd-template: pending` ni `.docs/sdd/`
- WHEN arranca `sdd-init`
- THEN la línea del modo dice «con código» y añade «si es un template recién instanciado, dímelo y sigo sin código»
- AND con «es un template», sigue en modo sin código: pregunta lo de una init sin código y no inventaría el código

### La init propone los campos E2E desde el código

- GIVEN una init con código de un repo con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`) y `e2e/` con `0012-sum-row.spec.ts`, `0015-export-pdf.spec.ts` y `0018-invoice-status.spec.ts`
- WHEN la entrevista llega a cómo se prueba
- THEN propone como candidatos a flujo core los de esos tres ficheros, y pregunta cuáles lo son
- AND `operations.md` sale con `Retries: 0 en local; 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito` y `Presupuesto E2E: pendiente`
- AND en un proyecto sin E2E no pregunta nada de esto y §Testing no lleva esos campos

## Reglas de la capacidad

- **Dónde viven los datos**: el funcional aportado, en `.docs/sdd/sources/`, literal y sin editar. El progreso de una init en curso, en la clave `init` de `.docs/sdd/sdd-kit.json` (`approved` y `config`), que `sdd init --finish` quita. El bloque de `.claude/settings.json` que escribe la init, en una constante de `cli/src/init/`, que el README reproduce. Los temporales del proyecto, en `.temp/` de la raíz, que la init ignora en `.gitignore`.
- **Idioma de los nombres**: no aplica.
- **Límites**: un repo es «con código» si su raíz tiene `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json` o `Gemfile`, o, fuera de `node_modules/`, `.git/` y `.docs/`, un fichero `.ts`, `.js`, `.cs`, `.java`, `.py`, `.go`, `.rs`, `.php`, `.rb`, `.kt` o `.swift`; si no, «sin código».
- **Avisos**: la init dice su modo en una línea antes de la primera pregunta, y con «con código» ofrece corregirlo si es un template; con `autoMemoryEnabled: true` pregunta antes de cambiarlo, y un «no» lo anota el resumen de cierre; tras un template 2.x, el resumen de cierre dice que el proyecto se pone al día con la migración.
- **Regla ante conflicto**: lo aprobado es lo que lista `init.approved`, no lo que hay en disco; un fichero previo de la raíz se cosecha y pasa por su gate; en `.claude/settings.json`, una hoja que ya existe con otro valor manda sobre la de la init.
