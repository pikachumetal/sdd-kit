# Capacidad — migration-v3

## Propósito

Las migraciones a la 3.0.0 y a la 3.0.1: documentos, roadmap, deuda, skills retiradas, campos de testing, enlaces y `specs/` a `changes/`.

## Requisitos

### La migración a v3.0.0 lleva los documentos de producto y de operaciones a su sitio

- GIVEN un proyecto en 2.3.4 con `.docs/sdd/mission.md` («Por qué existe», «Usuarios y roles», «Qué es y qué no es», «Dominio» con «**Franja**: una hora reservable»), `tech-stack.md` («Tecnologías» con Node 22 y Vitest, que ya fija `package.json`; «Comandos»; «Testing»; «Decisiones abiertas» con «¿avisos por correo?») y `environments.md`, todo commiteado, y el dev-lead presente
- WHEN pide «actualízame al kit»
- THEN el agente presenta una tabla con cada sección, su destino y el texto resultante de lo que se reescribe, y no mueve nada antes de su «sí»
- AND tras el «sí» hay un `PRODUCT.md` en la raíz con `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology` con «**Franja**:», y un `.docs/sdd/steering/operations.md` con `## Comandos`, `## Testing` y `## Entornos`
- AND «¿avisos por correo?» es una fila de Later en `ROADMAP.md` con un id de la reserva `sdd id next --reserve --count N` de la migración (en `tracker`, `0000`), «Tecnologías» no está en ningún documento, y no quedan `mission.md`, `tech-stack.md` ni `environments.md` en `.docs/sdd/`
- AND el informe y el cuerpo del commit dicen `git show <sha>:.docs/sdd/mission.md`, y lo mismo para los otros dos

### La migración a v3.0.0 mueve los documentos de estado a `steering/` y el changelog a la raíz

- GIVEN el mismo proyecto con `.docs/sdd/constitution.md` (que enlaza `decisions/0001-…`), `architecture.md`, `estimation.md`, `estimation-log.md` y `changelog.md`, un `CLAUDE.md` y un `README.md` que enlazan `.docs/sdd/constitution.md`, y una ADR que enlaza `../mission.md`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN los cuatro primeros están en `.docs/sdd/steering/` con su contenido intacto salvo el enlace, que pasa a `../decisions/0001-…`; `estimation-log.md` lo ha regenerado `sdd estimation log`, y `changelog.md` es `CHANGELOG.md` en la raíz
- AND los enlaces de `CLAUDE.md` y `README.md` apuntan a `.docs/sdd/steering/constitution.md`, la ADR no cambia y el informe la lista con su enlace roto
- AND `specs/`, `capabilities/`, `decisions/` y `releases/` siguen donde estaban

### La migración a v3.0.0 lleva el roadmap a Now, Next y Later

- GIVEN un `roadmap.md` 2.x sin release en preparación, con la 0021 y la 0022 en «Próximo» (la 0022 con «tras 0021» y «`proposal: 0019`»), B3 en «Backlog», el patch 0023 posterior a la última release cerrada y el 0017 anterior, y la release cerrada con `validaciones pendientes: 0016`, con la etiqueta git de la última release cerrada, que no contiene el `patch.md` del 0023, en un proyecto en modo `sequence`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla, con el Tamaño `M` para la 0021 y la 0022
- THEN `ROADMAP.md` tiene en Now la 0021 y la 0022 con su brief plegado (la 0022 con «Tras» 0021 y `**Requisitos:**` hacia la propuesta 0019), Tamaño `M`, y el patch 0023 con `✅` y `**Carril:** patch`; en Later, el ítem de la B3 con el id `0024`, de la reserva de la migración, y ningún `B<n>`
- AND no aparecen ni el 0017 ni la 0016, y la tabla y el informe nombran la 0016 como validación pendiente que sigue en su walkthrough
- AND la tabla deja el Tamaño como «lo decide el dev-lead» antes de su respuesta, sin proponer uno
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`, y no queda `.docs/sdd/roadmap.md`

### La migración a v3.0.0 lleva la deuda a `debt.md` sin inventar celdas

- GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente`, una saldada cuyo artefacto de cierre no contiene la etiqueta de la última release cerrada, una `**Actuar** → 0030 · causa: prueba o molde · arreglo: mover regla`, y una `**Esperar 2.º ticket** · causa: fusión de registros — falta reproducirlo`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN `.docs/sdd/steering/debt.md` tiene la primera en «Lista» con destino 0022 y el ticket como evidencia, y la saldada en «Lista» con su prefijo `**[… saldada …]**` intacto
- AND la de `sin fila` y la de `versión siguiente` están en «Por triar», la de `**Esperar**` en «En espera», y la `**Descartada**` no está en `debt.md`: sigue en el `roadmap.md` 2.x que guarda git
- AND cada «Fecha» es la del commit que añadió su fila al roadmap, y la tabla dice de dónde salió
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`
- AND la de la 0030 tiene «Causa» `prueba o molde` y «Arreglo» `mover regla`, y la de `fusión de registros` tiene esa «Causa» y «Falta» `reproducirlo`, sin las marcas
- AND las que no traen causa o arreglo los llevan propuestos en la tabla, marcados como propuesta, leyendo su «Ítem»; si el dev-lead rechaza la causa de una, esa fila va a «Por triar»
- AND el «Remedio temporal» sale de `· remedio:`; sin él, es `—` en una fila de un caso, y la tabla lo pregunta en una con dos o más enlaces

### Sin el dev-lead, la migración a v3.0.0 no mueve nada

- GIVEN el mismo proyecto y la petición «actualízame al kit, el dev-lead no está»
- WHEN el agente llega a los pasos de la v3.0.0
- THEN ningún documento cambia de sitio ni de forma, y el informe lista cada tabla de destinos como pendiente, con cómo reanudarla
- AND no hay commit de la migración ni cambia el marcador

### La migración a v3.0.0 cambia los nombres de las skills retiradas

- GIVEN un proyecto en 2.3.4 cuyo `CLAUDE.md` dice «Cierra cada feature con `sdd-end-feature`.», con `.claude/commands/pregunta.md` que dice «Usa `/sdd-consult` para responder.», con una carpeta de `specs/` cuyo `walkthrough.md` cita `sdd-end-feature` y con `capabilities/cierre.md` cuyo escenario dice «`sdd-end-patch` pasa a `sdd-archive`»
- WHEN se aplica la v3.0.0
- THEN `CLAUDE.md` dice «Cierra cada feature con `sdd-archive`.» y `pregunta.md` dice «Usa `/sdd-explore` para responder.», sin gate
- AND `sdd-end-patch` pasa a `sdd-archive`, y `sdd-init-greenfield` y `sdd-init-brownfield` a `sdd-init`, en `CLAUDE.md`, `AGENTS.md`, `.docs/sdd/*.md`, `.docs/sdd/steering/*.md`, `.claude/skills/` y `.claude/commands/`
- AND lo que encuentra en `.docs/sdd/capabilities/*.md` va a una tabla con gate, y `cierre.md` sigue diciendo «`sdd-end-patch` pasa a `sdd-archive`» si el dev-lead lo mantiene
- AND el `walkthrough.md` de `specs/` sigue citando `sdd-end-feature`, y tampoco cambian `CHANGELOG.md`, `decisions/`, `releases/` ni `kit-feedback/`
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la «Verification», con `git grep --untracked -nE 'sdd-(end-feature|end-patch|consult|init-greenfield|init-brownfield)'` sobre esas rutas (las carpetas con `:(glob)`, y sin `changelog.md`, `client-changelog.md` ni `roadmap.md` de `.docs/sdd/`), solo devuelve las líneas de su tabla con gate que el dev-lead mantiene, también sin `AGENTS.md` ni `.claude/`

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
- AND después el agente presenta una tabla con cada regla de `CLAUDE.md`, `AGENTS.md`, `PRODUCT.md` y `steering/` que repite o contradice el kit instalado, con su fichero y línea, la ruta del kit que la cubre y su propuesta; la regla de los ids sale con la ruta de `skills/sdd-propose/references/nombrado.md`
- AND solo cambia lo que el dev-lead aprueba, en un commit `chore(sdd): reglas del proyecto que ya cubre el kit`
- AND una regla sin una ruta del kit que la cubra no sale en la tabla; sin ninguna, el paso se salta y lo dice
- AND sin el dev-lead, la tabla va al informe como pendiente, con cómo reanudarla, y ni la constitution ni el marcador dependen de ella

### La migración a v3.0.0 enseña lo que un gate deja pendiente o regenera

- GIVEN un proyecto cuyo `tech-stack.md` tiene en «Decisiones abiertas» «¿avisos por correo?», con el paso 2 aprobado y el paso 3 rechazado
- WHEN acaba la migración
- THEN el informe nombra «¿avisos por correo?» junto al paso 3 pendiente, con `git show <sha>:.docs/sdd/tech-stack.md`
- AND la `estimation-log.md` regenerada se enseña antes del gate del paso 1, generada en una carpeta temporal con `sdd estimation log --out`, y la del proyecto solo se regenera tras el «sí»

### La migración a v3.0.0 propone los campos E2E en un proyecto con E2E

- GIVEN un proyecto 2.x en 2.3.4 con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`) y `e2e/booking.spec.ts`
- WHEN el dev-lead pide «Actualízame al kit» y aprueba la tabla de operaciones
- THEN `.docs/sdd/steering/operations.md` lleva en `## Testing` los campos E2E de `operations-template.md`, con `Retries: 0 en local; 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito` y `Presupuesto E2E: pendiente`
- AND lleva también «Entorno de la suite» y «Datos», con su valor o `pendiente`
- AND los flujos core son los que el dev-lead nombra entre los candidatos de `e2e/`, y en un proyecto sin E2E la sección `## Testing` pasa tal cual salvo «Temporales»

### La migración a v3.0.0 ignora `.temp/` y propone los temporales de las suites

- GIVEN un proyecto 2.x en 2.3.4 cuyo `.gitignore` no tiene `.temp/`, con `playwright.config.ts` sin `outputDir`
- WHEN el dev-lead pide «Actualízame al kit» y aprueba la tabla de operaciones
- THEN `.gitignore` gana la línea `.temp/` una sola vez, sin tocar las demás
- AND `## Testing` de `.docs/sdd/steering/operations.md` lleva «Temporales» con `e2e` · `test-results/` · propuesta `outputDir: '.temp/playwright'`, sin editar la config de la suite
- AND en un proyecto sin E2E cuyo `package.json` tiene `test` (`vitest run`) sin carpeta de salida en su config, «Temporales» dice `unit` · `no declarado`, sin propuesta
- AND con `.temp/` ya en `.gitignore`, el paso lo dice y no duplica la línea
- AND con el «no» del dev-lead a la propuesta, «Temporales» apunta solo el sitio actual de cada suite
- AND sin el dev-lead, ni `.gitignore` ni «Temporales» cambian, y el informe los deja como pendientes con cómo reanudarlos

### La migración a v3.0.0 avisa de un gate que encadena comandos

- GIVEN un proyecto 2.x cuyo §Testing declara `- **Gate de merge**: pnpm lint && pnpm test`
- WHEN acaba la migración a v3.0.0
- THEN el informe dice `Gate que encadena comandos: «pnpm lint && pnpm test» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json`
- AND la línea del gate no cambia, el paso no tiene gate y no frena el marcador
- AND con `||`, `;`, `|`, `>` o `<` fuera de comillas, igual; con `$`, `%…%` o `~`, el informe dice `Gate con variables: «<línea>» — sdd merge --verify no las expande; ponlas en la tarea de moon o en el script`
- AND sin «Gate de merge» se lee «Gate de cierre»; «Lo afectado» no se lee; sin ningún gate que avisar, el paso se salta y lo dice
- AND con un «Gate de cierre» `moon run :test :lint`, el informe dice también `Gate con lint: «moon run :test :lint» — el lint va en «Lint», al editar y en el pre-commit; sácalo del gate`, sin tocar la línea; una tarea de typecheck o de build no avisa

### La migración a v3.0.0 propone el nivel de cada suite, «Sin filtro», «Lint» y «CI de la base»

- GIVEN un proyecto en 2.3.4 cuyo `tech-stack.md` §Testing declara las suites `backend` · `dotnet test` · ~13 min y `e2e` · `npx playwright test` · ~3 min, un `.husky/pre-commit` que corre `lint-staged`, un `azure-pipelines.yml`, y el dev-lead presente
- WHEN la migración llega a su paso 2
- THEN la tabla propone `## Testing` con cada suite y su nivel (`backend` · `dotnet test` · ~13 min · `pendiente`, porque no se ve si arranca el host; `e2e` · `npx playwright test` · ~3 min · E2E), «Sin filtro» con los `*.csproj`, `Directory.Build.props`, `package.json` y lockfiles que existan, «Lint» `lint-staged`, al editar y en el pre-commit, y «CI de la base» `azure-pipelines.yml` · `sin orden de lectura`
- AND no escribe nada antes del «sí»

### La migración respeta un documento marcado y propone la marca

- GIVEN `capabilities/funcional.md`, sin `## Propósito`, cuya primera línea tras el título es `> **No es una capacidad.** Documento funcional anterior al troceo.`
- WHEN se aplica el paso 7 de `v2.0.0.md`
- THEN `funcional.md` no cambia y el informe no lo lista entre las capacidades a las que se ha escrito el propósito
- AND con `capabilities/legacy.md` sin marca, sin `## Requisitos` y sin escenarios, la verificación de `v3.0.0.md` lista su fallo como pendiente del dev-lead y propone la línea `> **No es una capacidad.**` tras el título, sin escribirla ni frenar el marcador

### La migración a v3.0.0 sustituye los nombres de las skills de arranque retiradas

- GIVEN un proyecto cuyo `CLAUDE.md` dice «arranca el trabajo con `sdd-start-feature`» y cuyo `.claude/commands/fix.md` cita `/sdd-start-patch`
- WHEN se aplica el paso 5 de la v3.0.0
- THEN `CLAUDE.md` dice «arranca el trabajo con `sdd-propose`» y el comando cita `/sdd-propose`, sin gate
- AND la verificación del paso no devuelve ninguno de los dos nombres

### La migración a v3.0.0 deja el hook del proyecto

- GIVEN un proyecto que migra a v3.0.0 sin `.claude/hooks/sdd-kit-loaded.mjs`
- WHEN corre la migración
- THEN el fichero queda escrito y su entrada en `hooks.UserPromptSubmit` de `.claude/settings.json`, una sola vez, sin gate y sin tocar las demás entradas
- AND si la entrada ya estaba, no la duplica, y la línea `**Writes**:` de la migración los nombra

### La migración a v3.0.0 ofrece el test de títulos E2E

- GIVEN un proyecto 2.x con `playwright.config.ts` y `e2e/booking.spec.ts`, sin «Flujos core»
- WHEN aplica el paso 2 de `migrations/v3.0.0.md`
- THEN la tabla ofrece el test de títulos, con «Títulos heredados» salidos de `playwright test --list`
- AND con el «sí», `operations.md` lleva el bloque, el test queda en una suite que el cierre corre entera y sale en verde
- AND en un proyecto sin E2E la tabla no lo nombra

### La migración a v3.0.0 propone quitar la activación de superpowers

- GIVEN un proyecto que migra a v3.0.0 con `enabledPlugins["superpowers@superpowers-marketplace"]` y `extraKnownMarketplaces["superpowers-marketplace"]` en `.claude/settings.json`
- WHEN llega al paso 10, con el marcador ya en `3.0.0`
- THEN pregunta «El kit ya no usa superpowers. ¿Quito su activación de `.claude/settings.json`? Si el proyecto usa sus skills fuera del kit, di que no y se queda como está.» y espera, sin haber escrito nada
- AND con un «sí», quita las dos claves y hace el commit `chore(sdd): quitar la activación de superpowers`
- AND con un «no», o sin respuesta, `.claude/settings.json` no cambia y el informe dice «Superpowers sigue declarado en `.claude/settings.json`. Para quitarlo más tarde, borra `enabledPlugins["superpowers@superpowers-marketplace"]` y, si ningún otro plugin activado sale de ese marketplace, `extraKnownMarketplaces["superpowers-marketplace"]`.»
- AND con `enabledPlugins["elements-of-style@superpowers-marketplace"]` = `true`, el «sí» quita solo `superpowers@superpowers-marketplace`, conserva el marketplace y dice que lo usa ese plugin
- AND con esa misma clave en `false`, el marketplace se quita: un plugin desactivado no lo usa
- AND no desinstala nada ni toca `~/.claude/settings.json`
- AND sin ninguna de las dos claves, o con solo el marketplace y otro plugin en `true`, el paso se salta y lo dice

### La v3.0.0 enseña antes las mediciones fechadas

- GIVEN un `tech-stack.md` 2.x con la línea «Una validación escrita de antemano no valida (task 0012): 2 de 2 sujetos de `sdd-end-patch` pararon en el paso 0 a preguntar.»
- WHEN se aplica la v3.0.0
- THEN la línea va a la tabla con gate del paso 5, con la propuesta de mantenerla
- AND con el dev-lead de acuerdo, `steering/operations.md` la conserva con `sdd-end-patch`

### Los enlaces relativos de lo que la v3.0.0 mueve siguen apuntando a su sitio

- GIVEN un `roadmap.md` 2.x cuya fila enlaza `[walkthrough](specs/x/walkthrough.md)`, un `changelog.md` que enlaza `[ref](specs/x/walkthrough.md)` y un `mission.md` que cita `[no es enlace](decisions/0001.md)` dentro de código
- WHEN se aplica la v3.0.0 y el dev-lead aprueba las tablas
- THEN `ROADMAP.md` y `CHANGELOG.md`, en la raíz, enlazan `.docs/sdd/specs/x/walkthrough.md`
- AND el texto dentro de código de `PRODUCT.md` no cambia

### La v3.0.0 decide lo publicado por la etiqueta de la última release

- GIVEN «Releases cerradas» hasta la 2.3.0, `changelog.md` hasta la 2.3.4 con su etiqueta `v2.3.4`, el patch 0130 cuyo `patch.md` entró en un commit que la etiqueta `v2.3.4` contiene, el patch 0164 cuyo `patch.md` entró en `develop` en un commit que ninguna etiqueta contiene, y la 0128, cuya fila entró antes de la 2.3.0 y cuyo `walkthrough.md` ninguna etiqueta contiene
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN el 0130 no está en `ROADMAP.md`, y el 0164 y la 0128 están en Now con `✅`

### La v3.0.0 reconoce la release en preparación por el prefijo de sus filas

- GIVEN «Próximo» sin `## Release <N>`, con la 0040 «**Release 3.0.0**. …» en `✅`, la 0041 «**Release 3.0.0** (dev-lead, …).» en `⏳`, la 0042 sin prefijo en `✅` que ninguna etiqueta contiene, la 0043 sin prefijo en `⏳`, y en «Patches» otra fila 0040
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN Now se titula `## Now — 3.0.0 · en preparación` y tiene la 0040 una sola vez, la 0041 y la 0042; Next tiene la 0043

### La v3.0.0 conserva los ids del Backlog

- GIVEN un «Backlog» con la 0050 y con una fila sin id, y una fila sin id en «Próximo» con estado `🔄 en curso`, en un proyecto en modo `sequence`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN Later tiene la 0050 con su id, y la fila sin id del Backlog con uno de la reserva
- AND la tabla pregunta qué estado lleva en Later la fila `🔄`, que Later no admite

### La migración a la 3.0.1 junta `specs/` en `changes/`

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0`, el árbol limpio y estas piezas:
  - la carpeta `.docs/sdd/specs/20261001-100000-feature-0079-b/`, con `walkthrough.md` y con `red/out/notas.md`, que enlaza `../../../../specs/20261001-100000-feature-0079-b/spec.md`;
  - la carpeta `.docs/sdd/changes/20261110-090000-feature-0160-c/`;
  - un `ROADMAP.md` que enlaza `[walkthrough](.docs/sdd/specs/20261001-100000-feature-0079-b/walkthrough.md)`;
  - un `.docs/sdd/steering/debt.md` que enlaza `[walkthrough](../specs/20261001-100000-feature-0079-b/walkthrough.md)`;
  - un `docs/guia.md` que enlaza `../specs/api.md`.
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN `.docs/sdd/specs/` no existe y `.docs/sdd/changes/` tiene las dos carpetas
- AND un commit `chore(sdd): mover specs/ a changes/` solo lleva renombrados, y `git log --follow` de `walkthrough.md` llega a su commit de `specs/`
- AND `ROADMAP.md` enlaza `.docs/sdd/changes/20261001-100000-feature-0079-b/walkthrough.md` y `debt.md`, `../changes/20261001-100000-feature-0079-b/walkthrough.md`
- AND `red/out/notas.md`, copia de evidencia, conserva su texto, también el enlace a `specs/`
- AND `docs/guia.md` no cambia: está fuera de `.docs/sdd/`
- AND no hay gate: el «actualízame al kit» basta
- AND el informe lista cada fichero que no es `.md` y nombra `.docs/sdd/specs/`, sin tocarlo
- AND `sdd-kit.json` queda en `3.0.1`, escrito con `sdd upgrade --mark 3.0.1`, en un commit `chore(sdd): migrar al kit v3.0.1`

### La migración a la 3.0.1 no mueve nada con una carpeta repetida

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0`, el árbol limpio y `20261001-100000-feature-0079-b/` en `.docs/sdd/specs/` y en `.docs/sdd/changes/`
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN ninguna carpeta se mueve, `git status --short` sale vacío y `sdd-kit.json` sigue en `3.0.0`
- AND el informe dice «No se mueve nada; ya existen en changes/: 20261001-100000-feature-0079-b» y que, tras renombrar una de las dos, se vuelve a pedir «actualízame al kit»

### La migración a la 3.0.1 para con el árbol sucio

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0`, carpetas en `.docs/sdd/specs/` y `ROADMAP.md` modificado sin commitear
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN no se mueve ni se reescribe nada, `sdd-kit.json` sigue en `3.0.0` y el informe nombra `ROADMAP.md`
- AND con el árbol limpio pero `.docs/sdd/specs/20261001-100000-feature-0079-b/notas.log` ignorado por `.gitignore`, tampoco se mueve nada y el informe nombra `notas.log`

### Sin `specs/`, la migración a la 3.0.1 solo avanza el marcador

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.0` y sin `.docs/sdd/specs/`
- WHEN el usuario pide «actualízame al kit» con el kit 3.0.1 cargado
- THEN `sdd-kit.json` queda en `3.0.1` en un commit `chore(sdd): migrar al kit v3.0.1`, y ningún otro fichero cambia
