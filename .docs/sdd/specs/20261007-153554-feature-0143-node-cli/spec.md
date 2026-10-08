---
id: 20261007-153554-feature-0143-node-cli
feature: 0143
proposal: 0131
title: CLI sdd en Node
mode: full
profile: delegate
status: approved
created: 2026-10-07
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-07
---

# Spec — CLI `sdd` en Node

## Capacidades

- Nuevas: `cli` — la CLI del kit: cómo se invoca, qué verbos y opciones tiene, su salida y sus códigos de salida, y cómo la nombran las skills.
- Modificadas: `feature-flow` — las tasks Native se abren y cierran con la CLI desde cualquier shell, y los rulings y los minors diferidos se cosechan del ledger.
- Modificadas: `release-flow` — la reserva se publica con la CLI.
- Además, el barrido de literales de la decisión 13 en 10 capacidades, sin delta.

## Decisiones que he tomado yo — valida estas

Review de spec hecha: dos revisores — señales: capacidad nueva (`cli`), contrato público (los verbos que leen las skills y el JSON del hook), MODIFIED/REMOVED (tres requisitos de `feature-flow` y uno de `release-flow`), tres capacidades, dependencia nueva (Node, moon, pnpm, proto), área no explorada (los scripts no se leyeron enteros) · tamaño: miles de líneas en ~60 ficheros
- Dominio: si los REMOVED de Native pierden un caso de campo, si el barrido sin MODIFIED esconde un cambio de regla y la regla ante conflicto de `roadmap publish` (señal: MODIFIED/REMOVED + contrato)
- Técnica: hook en forma exec y sin Node, cerrojo compartido de `publish` y `merge`, paridad comprobable, versión de Node antes de cargar módulos (señal: contrato + dependencia)
- Mínimo razonable: un revisor con las dos lentes — deja que una lente tape a la otra en una spec tan ancha

1. **Node ≥ 22.18.0 para usar la CLI; el repo en Node 26**: `.prototools` fija `node = "26.10.0"`, `pnpm = "12.9.1"` y `moon = "2.6.0"`. — La 22.18.0 es la primera 22 que ejecuta TypeScript sin flags (probado en local: la 22.17.1 da error de sintaxis en `const n: string`, la 22.18.0 y la 24.20.0 lo ejecutan sin avisos), y la 22 es la LTS más antigua con soporte (hasta 2027-04): un proyecto con la 22 o la 24 no se queda sin kit. Como el repo prueba en la 26, la tarea `cli:test-min` ejecuta la suite de la CLI con Node 22.18.0 (`proto run node 22.18.0`) en la suite completa, no en el pre-commit. `bin/sdd.js` es JS plano: comprueba `process.versions.node` y solo después carga `src/main.ts` con `import()` dinámico, porque con una versión vieja un `.ts` no llega ni a ejecutarse y `engines` solo lo mira pnpm.
2. **Estructura, en TypeScript sin build**: `pnpm-workspace.yaml` en la raíz con un paquete, `cli/` (`@sdd-kit/cli`, privado, `bin/sdd.js`, `src/**/*.ts`). Node ejecuta los `.ts` directamente (type stripping): no hay `dist/` ni paso de compilación, y el plugin lleva el mismo fichero que se edita. Solo sintaxis que se borra (`erasableSyntaxOnly` en `tsconfig.json`: sin `enum`, `namespace` ni propiedades de parámetro) e imports con la extensión `.ts`. `dependencies`, ninguna; `devDependencies`, solo `typescript` (para `tsc --noEmit`) y `vitest`, que no viajan al proyecto consumidor porque el plugin no ejecuta `pnpm install`. Cada worktree ejecuta `pnpm install` una vez antes de los tests. El `package.json` raíz es privado y solo fija `packageManager`. Rebato una vez: hoy el workspace tiene un solo paquete; el segundo sería `tests/headless/` (ya es JS) si la 0152 lo porta. Lo monto igual porque lo pediste.
3. **moon para las tareas del repo; tests con Vitest**: proyectos `cli` (`typecheck` con `tsc --noEmit`, y `test`, `test-slow` y `test-min` con `vitest run`; los tests que crean repos git o lanzan procesos van en `*.slow.test.ts`, como hoy la etiqueta `Slow` de Pester) y `kit` (raíz: `test-fast` y `test` con los Pester que quedan, y `roadmap`, que valida `.docs/sdd/roadmap.md`). El pre-commit pasa a `moon run cli:typecheck cli:test kit:test-fast kit:roadmap`; sin `moon` en el `PATH` bloquea con `Commit bloqueado: falta moon; instálalo con «proto install» en la raíz del repo`. La CLI no importa nada de moon, pnpm ni proto: un proyecto consumidor solo necesita Node.
4. **Verbos**, en inglés, sustantivo + verbo salvo dos acciones que ya son un sustantivo (`merge`, `workspace`):

   | Hoy | Verbo |
   | --- | --- |
   | `Get-CapabilityIndex.ps1` | `sdd capability index` |
   | `Test-Capabilities.ps1` | `sdd capability check` |
   | `Merge-CapabilityDelta.ps1` | `sdd capability merge` |
   | `Test-Roadmap.ps1` | `sdd roadmap check` |
   | — (0049) | `sdd roadmap publish` |
   | `Get-NextSddId.ps1` | `sdd id next` |
   | `Invoke-SddMerge.ps1` | `sdd merge` |
   | `Build-EstimationLog.ps1` | `sdd estimation log` |
   | `Measure-SessionTokens.ps1` | `sdd session tokens` |
   | `Watch-SubagentSilence.ps1` | `sdd watch subagent` / `sdd watch command` |
   | `hooks/session-start` | `sdd hook session-start` |
   | `task-start` / `task-done` (superpowers) | `sdd task start` / `sdd task done` |
   | `task-brief` / `review-package` / `sdd-workspace` (superpowers) | `sdd task brief` / `sdd review package` / `sdd workspace` |
   | — (0054) | `sdd ledger rulings` |

   `SddLock.ps1`, `CapabilitySections.ps1` y `TranscriptPaths.ps1` son módulos internos, no verbos.
5. **Opciones** en inglés kebab-case, con los mismos topes:

   | Hoy | Opción |
   | --- | --- |
   | `-ProjectRoot` | `--project-root` (por defecto, el directorio actual) |
   | `-Path` | `--path` |
   | `-Artifact` | `--artifact` |
   | `-Reserve` · `-Count` (1–99) | `--reserve` · `--count` (1–99) |
   | `-LockTimeoutMinutes` | `--lock-timeout` (minutos; 2 en `id next`, 30 en `merge` y `roadmap publish`) |
   | `-Branch` · `-Push` · `-VerifyCommand` | `--branch` · `--push` · `--verify` |
   | `-Root` · `-OutFile` | `--root` · `--out` |
   | `-ProjectsRoot` (lista) | `--projects-root`, repetible |
   | `-Description` · `-Worktree` · `-Once` | `--description` · `--worktree` · `--once` |
   | `PLAN_FILE TASK_NUMBER BASE -- CMD…` (bash) | los mismos posicionales: `sdd task done <plan> <n> <base> -- <comando…>` |

6. **Salida y códigos**: texto por defecto, con los mismos mensajes en castellano que los scripts (los de los bash de superpowers, en inglés, se quedan como están); `--json` en `capability index`, `capability check`, `roadmap check`, `id next`, `session tokens` y `ledger rulings`. Códigos: 0 bien, 1 fallo del dominio, 2 uso incorrecto (verbo, opción o valor fuera de tope). `sdd task done` sale con el código del comando que ejecuta, y con 127 si el comando no existe.
7. **Comportamiento nuevo aceptado** frente a «los mismos resultados que hoy»: `--json`, el código 2 de uso (hoy un `-Count 0` o un parámetro mal escrito salen con 1), la comprobación de versión de Node y las opciones en kebab-case. Nada más cambia fuera de 0049, 0054 y la decisión 10.
8. **Invocación desde las skills**: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo>`, escrito solo en los `SKILL.md`: Claude Code sustituye `${CLAUDE_PLUGIN_ROOT}` en el contenido de un `SKILL.md`, no en los `references/` ni en las plantillas (docs de skills, «Available Variables»). Un `references/` o una plantilla nombran el verbo (`sdd task start`) y el `SKILL.md` que los enlaza da la ruta. Descartado el `bin/` del plugin en el `PATH`: la documentación solo lo promete para la herramienta Bash y no dice nada de Windows ni de la herramienta PowerShell.
9. **Se retira el canal `npx skills add`**: instala solo `skills/`, sin `cli/`, y en él `${CLAUDE_PLUGIN_ROOT}` no existe, así que ningún verbo funcionaría. La propuesta 0131 ya lo decidió («Distribución solo como plugin»); esta feature lo hace efectivo en el README y en «Distribución» de `tech-stack.md`.
10. **Hook**: `hooks.json` en forma exec (`"command": "node"`, `"args": ["${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js", "hook", "session-start"]`), sin `"shell": "bash"`. Con Node anterior a la 22.18.0, el hook no sale con 2: inyecta `using-sdd` igual y añade a `systemMessage` `sdd-kit necesita Node 22.18 o posterior; tienes <versión>`, porque perder el enrutado es peor que un aviso. Sin Node, Claude Code enseña el error del hook: Node pasa a dependencia obligatoria en el README. Que Claude Code sustituya la variable en `args` se comprueba en el smoke con `--plugin-dir`, antes de borrar el bash.
11. **Los bash de superpowers se portan con su formato**: mismo workspace (`.superpowers/sdd/<slug>/`, marcador `plan-path`), mismo ledger y misma línea `Task <N>: complete (…)`, para que convivan con `executing-plans` y `subagent-driven-development` hasta que la 0147 los copie. Sus tests (`test-executing-plans-scripts.sh` y `test-sdd-workspace.sh` de superpowers 6.4.2) se portan a Vitest, y los requisitos vivos del paquete del revisor final se conservan tal cual (solo cambia el literal del comando). El kit (paso 6 de `sdd-start-feature`, `commit-milestones.md`, `encargo-revision.md`, `overrides-superpowers.md`, `plan-template.md`) pasa a pedir los verbos. Su aviso MIT va a `THIRD_PARTY_NOTICES.md`.
12. **`sdd task done` registra la task aunque el comando no imprima nada** (la línea dice `→ (sin salida)`), e imprime las rutas en la forma del sistema. Retira las trampas que hoy explica la skill: `bash` de WSL, `cygpath -w` y el `sh -c '… && echo ok'`.
13. **Barrido de capacidades sin `MODIFIED`**: unos 65 requisitos de 10 capacidades citan un `.ps1` o un bash en su WHEN. Se sustituye el literal del comando y de sus opciones por el verbo y la opción de las tablas 4 y 5, directamente en `capabilities/`, sin un bloque `MODIFIED` por requisito: la regla no cambia, y 65 bloques copiados harían la spec ilegible. Solo van al delta los requisitos cuya regla cambia.
14. **Paridad antes de borrar**: cada script se porta con sus tests (los mismos casos Pester pasados a Vitest, con las fixtures movidas a `cli/test/fixtures/`). En el commit que porta un script, el `.ps1` todavía existe: un test de paridad ejecuta los dos sobre las fixtures y sobre los documentos reales de este repo y compara la salida y el código. Las únicas diferencias aceptadas son las de la decisión 7 y el nombre del comando en un mensaje; cada una se anota en el walkthrough, sección «Paridad». El commit siguiente borra el `.ps1` y el test de paridad. La salida del hook bash se guarda antes como fixture literal (`cli/test/fixtures/hook/`) y el verbo se compara con ella.
15. **0054, parte de código**: `sdd ledger rulings <plan>` lista las líneas `Ruling:` y las `minor (deferred)` del ledger, y el paso 1 de `sdd-end-feature` lo ejecuta antes de que el workspace se borre. El anuncio del workspace y la sección «Recuperación» son texto: van a la 0147.
16. **0049**: `sdd roadmap publish` commitea en la rama de integración solo los ficheros que se le pasan (bajo `.docs/sdd/`), con el cerrojo de `sdd merge` (`sdd-merge.lock` en el directorio común de git, el mismo fichero y la misma espera; `merge` no cambia). La rama sale de `merge.into` en `sdd-kit.json`, la misma clave que lee `sdd merge`, o de `--into`. El paso 6 de `sdd-roadmap` lo usa en vez de hacerlo a mano.
17. **Test skill ↔ CLI**: escenario en el delta de `cli`.
18. **Migraciones viejas**: `v1.0.0.md`, `v2.0.0.md` y `v2.3.0.md` se ejecutan con el kit actual, así que pasan a los verbos. La nota de migración de la 3.0.0 (Node obligatorio) es de la 0144.
19. **`claude plugin eval`**: se evalúa en una task tipo spike: los escenarios de la batería de `using-sdd` pasados a `evals/` con graders deterministas (`tool_used`, `regex`), n = 2 en Sonnet, frente a `battery.sh` con los mismos escenarios. Sale un `research.md` en esta carpeta con veredicto, coste y recomendación. Sustituir el arnés, si se recomienda, es de la 0152.
20. **ADR 0011 «CLI en Node»**: recoge el cambio de criterio respecto a `architecture.md` («se descarta portar scripts o tests a Python o Node», 2026-09-25): el motivo de entonces era la velocidad de la suite; el de ahora, un solo lenguaje para los scripts, el hook y los bash heredados, sin pwsh en los proyectos (principio 4). Se reescriben `architecture.md` y «Contenido y build» de `tech-stack.md`.
21. **Art. X**: el código portado se reescribe con el Art. X entero (funciones ≤ 20 líneas, ≤ 3 parámetros), no se transcribe. En la constitution, «El bloque de ayuda de `Get-Help`» pasa a «la ayuda de `--help`», y «sin alias de PowerShell» se queda mientras quede Pester.
22. **Una pieza entra, otra sale**: salen los 12 `.ps1`, sus ~330 tests Pester, el hook bash, la dependencia de pwsh en los proyectos consumidores, el canal `npx skills add`, y del paso 6 de `sdd-start-feature` las frases de Git Bash/WSL, `cygpath` y salida vacía.
23. **Previsión de coste del Art. I**: humo (1 escenario, n = 1, Sonnet) de cada skill editada —`sdd-start-feature`, `sdd-end-feature`, `sdd-end-patch`, `sdd-start-patch`, `sdd-roadmap`, `sdd-consult`, `sdd-end-release`, `sdd-init-greenfield`, `sdd-init-brownfield`, `sdd-templates`—: 10 sujetos, ~45 min, ~8 $. El escenario de cada una es el paso que ejecuta el verbo, sobre un molde mínimo, con el plugin cargado por `--plugin-dir`, y pasa si el stream muestra la llamada a `sdd.js` con la ruta sustituida y salida 0; en `sdd-start-feature`, el paso 6 Native con `sdd task start` y `sdd task done`, que también exige leer `commit-milestones.md`. Evaluación de `claude plugin eval`: ~4 $. Smoke del hook con `--plugin-dir`: ~0,03 $. Total previsto ~12 $; si se supera, paro y decides.

### Hallazgos de la review

- **Aceptado** — (técnica 1, Crítico) paridad sin forma comprobable → decisión 14: test de paridad en el commit que porta, lista cerrada de diferencias y sección «Paridad» del walkthrough. Va al plan, no a la capacidad: no es comportamiento que dure.
- **Aceptado** — (técnica 2, Crítico) cerrojo de `publish` mal definido → decisión 16 y escenario: `sdd-merge.lock`, espera de 30 min, mensaje y código al agotarla; `merge` no cambia.
- **Aceptado** — (dominio 1, Crítico) `publish` podía pisar filas reservadas por otra sesión → regla ante conflicto en el escenario: si la rama de integración cambió el fichero desde la base de la sesión, aborta con 1 sin escribir.
- **Aceptado** — (técnica 3) versión de Node antes de cargar módulos → decisión 1 (`import()` dinámico) y escenario con test.
- **Aceptado** — (técnica 4) hook con Node viejo o sin Node, y sustitución en `args` → decisión 10 y escenarios del hook.
- **Aceptado** — (técnica 5) JSON del hook sin referencia tras borrar el bash → fixture literal (decisión 14).
- **Aceptado** — (técnica 6) ruta desde `references/` y canal `npx` → decisiones 8 y 9 (se retira `npx skills add`) y humo de `sdd-start-feature` con `commit-milestones.md`.
- **Aceptado** — (técnica 7 y dominio 7) test skill ↔ CLI sin escenario y corto de literales → escenario en `cli` con extracción, literales prohibidos y exclusiones.
- **Aceptado** — (técnica 8 y dominio 6) opciones sin mapa → tabla de la decisión 5.
- **Aceptado** — (técnica 9 y dominio 9) forma de `task done` y su código → decisiones 5 y 6, y AND con comando inexistente.
- **Aceptado** — (técnica 10) pre-commit sin moon → decisión 3.
- **Aceptado** — (dominio 2) rama de `publish` a fuego → `merge.into` o `--into`; sin ninguna, sale con 2.
- **Aceptado** — (dominio 3) el REMOVED perdía «ruta vacía antes de escribir en el ledger» → AND en «Las tasks Native se abren y cierran desde cualquier shell».
- **Aceptado** — (dominio 4) los minors diferidos no son `Ruling:` → el verbo lista los dos, y `MODIFIED` de «Los minors diferidos llegan al walkthrough».
- **Aceptado** — (dominio 5) comportamiento nuevo sin declarar → decisión 7 y el «No entra».
- **Aceptado** — (dominio 8) Art. X habla de PowerShell y un port literal lo incumple → decisión 21.
- **Aceptado** — (dominio 10) versión del ejemplo del hook, verbos sin el patrón y requisito de publicación de `sdd-roadmap` sin declarar → ejemplo con 3.0.0, excepción nombrada en la decisión 4, y `MODIFIED` de «La reserva se publica antes de arrancar» en `release-flow` en vez de un ADDED en `feature-ids`.

### Decisiones tomadas con el dev-lead

- Feature entera, sin partir, con los bash de superpowers dentro — respuesta «Seguir entera» a la propuesta de partir (2026-10-07).
- Gate de la spec presente — «Enséñame la spec» (2026-10-07).
- Herramientas del repo — «hay que poner proto, moon, node, pnpm y woirkspaces» (2026-10-07).
- Review de spec con dos revisores — «Dos revisores en paralelo» (2026-10-07).
- Node 26 en el repo y mínimo 22 para usar la CLI — «te iba a decir que node 26 si puede ser, la ultima version» y la respuesta «Repo 26, mínimo 22» (2026-10-07).
- `node:test`, descartados Vitest y Bun — «vale, sigue con 1, node y node:test» (2026-10-07).
- TypeScript sin build y Vitest, en lugar de JS plano y `node:test` — «la verdad preferiria typescript pero una cosa ... realmente los test... no necesitamos que viajen al cliente... no veo cual seria el problema de usar vitest» y «nada nada paro de preguntar sigue» (2026-10-07).

## Intent

El código ejecutable del kit está en tres lenguajes: 12 scripts PowerShell (que obligan a tener pwsh en cada proyecto), el hook en bash y los bash de superpowers que el kit usa en Native, con dos tickets de campo por lanzarlos desde PowerShell (WSL, salida vacía). La 3.0.0 quiere lo mecánico en una CLI (principio 4) y la 0147 necesita esos bash como código propio. Se quiere una sola CLI `sdd` en Node, sin dependencias, con los mismos resultados que hoy salvo lo que lista la decisión 7.

## Scope

- Entra: `cli/` con los verbos de la decisión 4 en TypeScript y sus tests Vitest; `tsconfig.json`; el hook en Node; `.prototools`, `package.json`, `pnpm-workspace.yaml`, `.moon/` y los `moon.yml`; el pre-commit; las llamadas en `skills/` (`SKILL.md`, `references/`, `templates/`, migraciones viejas); lo que implementa los requisitos de Native que cambian: paso 6 de `sdd-start-feature`, `commit-milestones.md`, `encargo-revision.md`, `overrides-superpowers.md` y `plan-template.md`, y sus tests de frase (`NativeAdapt`, `ClosingVerification`, `SuperpowersCompat`, `DispatchBrief`, `FinalReviewPackage`); el paso 1 de `sdd-end-feature` (`ledger rulings`) y el paso 6 de `sdd-roadmap` (`roadmap publish`); el barrido de `capabilities/`; `README.md` (Node obligatorio, fuera `npx skills add`), `THIRD_PARTY_NOTICES.md`, `architecture.md`, `tech-stack.md`, el Art. X de la constitution, ADR 0011; borrar los `.ps1`, el hook bash y los Pester de scripts; la evaluación de `claude plugin eval`.
- No entra: los Pester de frases y anatomía de skills (poda en la 0152); `tests/headless/` (bash del lanzador de sujetos); los hooks de este repo (`.claude/hooks/Test-KitSessionSource.ps1`); copiar las skills de superpowers (0147); la migración v3.0.0 (0144); comportamiento nuevo fuera de 0049, 0054 y las decisiones 7, 10 y 12.

## Approach

Esqueleto primero (`sdd.js`, comprobación de versión, despacho de verbos con `parseArgs`, `--json`, códigos), luego un script por task en orden de dependencia (parser de capacidades → índice, validador, fusión; roadmap; cerrojo → ids, merge, publish; transcripts → tokens, vigía; estimation-log; hook; bash de superpowers), cada uno con sus tests portados y su paridad antes de borrar el viejo. Después, el cambio de las skills y las capacidades con el test skill ↔ CLI, el humo, y al final la evaluación de `claude plugin eval`.

## Delta de comportamiento

### Capacidad: `cli`

**ADDED — La CLI se ejecuta con Node y sin dependencias**
- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

**ADDED — Node demasiado viejo se dice antes de ejecutar nada**
- GIVEN Node 20.11.0
- WHEN se ejecuta `node sdd.js capability index --path .docs/sdd`
- THEN escribe en stderr `sdd necesita Node 22.18 o posterior; tienes 20.11.0` y sale con 2, sin un `SyntaxError` de ningún módulo de la CLI
- AND un test lo comprueba llamando a la comprobación de `sdd.js` con la versión `20.11.0` simulada

**ADDED — Un verbo, una opción o un valor fuera de tope salen con 2**
- GIVEN la CLI
- WHEN se ejecuta `node sdd.js capability lista`, `node sdd.js capability index --ruta x` o `node sdd.js id next --reserve --count 0`
- THEN escribe en stderr qué no reconoce o qué tope incumple y el uso del sustantivo (`sdd capability index|check|merge …`), y sale con 2

**ADDED — Los verbos de datos dan JSON con `--json`**
- GIVEN `.docs/sdd/capabilities/` con `bookings.md` (propósito «Reservar, consultar y cancelar salas por franja horaria.») y `rooms.md`, sin propósito
- WHEN se ejecuta `node sdd.js capability index --path .docs/sdd --json`
- THEN escribe `[{"name":"bookings","purpose":"Reservar, consultar y cancelar salas por franja horaria."},{"name":"rooms","purpose":null}]` y sale con 0
- AND sin `--json` escribe las mismas dos líneas de texto que hoy (`` - `bookings` — … `` y `` - `rooms` — (sin propósito) ``)

**ADDED — El hook de sesión es un verbo de la CLI**
- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` en `2.2.0` y el kit cargado en `3.0.0`, con migraciones hasta la `2.3.0`
- WHEN Claude Code arranca la sesión y ejecuta `hooks/hooks.json`
- THEN escribe el JSON de la fixture `cli/test/fixtures/hook/pending-migration.json`, que es la salida del hook bash con esa entrada: `additionalContext` con `using-sdd` y el `systemMessage` de las migraciones pendientes
- AND en una sesión headless con el plugin por `--plugin-dir`, el `hook_response` del stream trae ese `additionalContext`
- AND sin `.docs/sdd/` no escribe nada y sale con 0
- AND con Node 20.11.0 escribe el mismo JSON con `sdd-kit necesita Node 22.18 o posterior; tienes 20.11.0` añadido a `systemMessage`, y sale con 0

**ADDED — Las skills solo nombran verbos que existen**
- GIVEN `skills/**/*.md` y `.docs/sdd/capabilities/*.md`
- WHEN se ejecuta el test de `cli/test/docs-claims.test.ts`
- THEN cada `sdd <sustantivo> <verbo>` (o `sdd merge`, `sdd workspace`) que aparece, con o sin `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js"` delante, es un verbo de la CLI, y cada `--opción` que le sigue en la misma línea es una opción de ese verbo; los huecos `<…>` no se analizan
- AND falla si esos ficheros nombran un `.ps1` del kit, `hooks/session-start`, `task-start`, `task-done`, `task-brief`, `review-package` o `sdd-workspace` sin `sdd` delante, `cygpath` o `PLAN_FILE`
- AND no mira `.docs/sdd/specs/`, `.docs/sdd/decisions/`, `.docs/sdd/field-reports/`, `changelog.md` ni `tests/*.md`: son eventos y no se reescriben

### Capacidad: `feature-flow`

**ADDED — Los rulings del ledger se cosechan antes de borrar el workspace**
- GIVEN el ledger de un plan con `Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24`, `Final: minor (deferred) nombre de variable poco claro en parse()` y `Final: Ruling: no se renombra Foo — fuera de alcance`
- WHEN el cierre ejecuta `node sdd.js ledger rulings <plan.md>`
- THEN escribe esas tres líneas en el orden del ledger y sale con 0
- AND sin ledger escribe `Sin rulings` y sale con 0

**MODIFIED — Los minors diferidos llegan al walkthrough** (antes: «los "Rulings I made" y los "Deferred minors" del mensaje final de `executing-plans`»)
- GIVEN una feature Native con líneas `Final: minor (deferred)` en el ledger
- WHEN se escribe el walkthrough
- THEN «Decisiones tomadas sin el dev-lead» lleva las líneas `Ruling:` y `minor (deferred)` que da `sdd ledger rulings`, ejecutado antes de que el workspace se borre

**MODIFIED — Una task Native se registra en el ledger de `executing-plans`** (antes: «la abre con `task-start` y la cierra con `task-done`»)
- GIVEN un plan con `Ejecución: native`
- WHEN el hilo ejecuta cada task
- THEN la abre con `sdd task start` y la cierra con `sdd task done` y el comando de su «Verificación», y el ledger del workspace tiene su línea `Task <N>: complete`

**ADDED — Las tasks Native se abren y cierran desde cualquier shell**
- GIVEN un plan con `Ejecución: native` en Windows, con PowerShell como shell principal, y una «Verificación» que no imprime nada si pasa
- WHEN el hilo abre y cierra cada task con `sdd task start` y `sdd task done <plan> <n> <base> -- pwsh -NoProfile -Command "Invoke-Pester -Path tests/Foo.Tests.ps1 -CI"` desde la herramienta PowerShell
- THEN `sdd task start` imprime la ruta del workspace en forma Windows (`D:\…`), y la línea `Task <N>: complete (…, tests: <comando> → (sin salida))` queda en el ledger a la primera
- AND si `sdd task start` falla o no imprime ruta, sale con un código distinto de 0 y el hilo no escribe en el ledger
- AND con un test en rojo, `sdd task done` no escribe `Task <N>: complete` y sale con el código del comando; con un comando que no existe, sale con 127 y tampoco lo escribe

**REMOVED — Los scripts de Native se lanzan con la herramienta Bash y con salida**
- motivo: lo sustituye «Las tasks Native se abren y cierran desde cualquier shell»: Node no depende de Git Bash, `sdd task done` registra aunque el comando no imprima nada, y el caso de la ruta vacía pasa a ese requisito.

**REMOVED — En Windows, el workspace de ejecución se usa en su ruta Windows**
- motivo: `sdd task start`, `sdd task brief` y `sdd workspace` ya imprimen la ruta del sistema; no hay ruta POSIX que traducir.

### Capacidad: `release-flow`

**MODIFIED — La reserva se publica antes de arrancar** (antes: el agente commitea a mano «en el worktree donde está sacada, o en uno temporal»)
- GIVEN un scope replanificado que el usuario ha decidido, `"merge": { "into": "develop" }` en `sdd-kit.json`, `develop` sacada en el worktree `D:\code\salas` sin cambios en `roadmap.md`, y una sesión en otro worktree con dos filas nuevas reservadas en su `roadmap.md`
- WHEN el agente ejecuta `node sdd.js roadmap publish --message "docs(roadmap): reservar 0150 y 0151" .docs/sdd/roadmap.md`
- THEN `develop` tiene un commit con ese mensaje que solo toca `roadmap.md`, con el contenido del worktree de la sesión, hecho en `D:\code\salas`, y sale con 0
- AND lo hace antes de arrancar ninguna de las features nuevas, y el `proposal.md` de la propuesta, si la hay, va en el mismo commit
- AND si `develop` no está sacada en ningún worktree, el commit se hace en un worktree temporal de nombre corto junto a los demás, que se retira al acabar
- AND si otro proceso tiene `sdd-merge.lock`, escribe `Esperando el cerrojo de merge: lo tiene <rama> (<worktree>, PID <pid>) desde <hora>.`, espera y después publica; si a los 30 min no se libera, escribe `cerrojo: no se libera; lo tiene …`, sale con 1 y `develop` no cambia
- AND si `develop` cambió `roadmap.md` desde la base de la sesión (`git merge-base`), escribe `develop cambió .docs/sdd/roadmap.md desde tu base: integra develop antes de publicar`, sale con 1 y `develop` no cambia
- AND si `D:\code\salas` tiene cambios sin commitear en `roadmap.md`, escribe `destino con cambios: .docs/sdd/roadmap.md en D:\code\salas`, sale con 1 y `develop` no cambia
- AND sin `merge.into` en `sdd-kit.json` ni `--into`, o con una ruta fuera de `.docs/sdd/`, sale con 2 sin escribir

## Enmiendas

- 2026-10-08 — El THEN de «La CLI se ejecuta con Node y sin dependencias» enumera los verbos en vez de remitir a «la tabla de la decisión 4»: una capacidad no puede citar la spec y la fusión lo rechaza. Misma regla, solo redacción — ruling del agente, no cambia el comportamiento
- 2026-10-07 — TypeScript sin build (type stripping de Node, mínimo 22.18.0) y Vitest como `devDependency`, en lugar de JS plano y `node:test`: cambian las decisiones 1, 2, 3, 11 y 14, el Scope y los THEN de versión y de dependencias de `cli` — el dev-lead prefiere TypeScript, Node lo ejecuta sin compilar desde la 22.18.0, y los tests no viajan al proyecto — aprobada: «la verdad preferiria typescript pero una cosa ... no veo cual seria el problema de usar vitest» · «nada nada paro de preguntar sigue»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-07 | aprobada: «vale, JS plano y node:test, apruebo la spec» |
