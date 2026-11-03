### sdd-roadmap

- **P1 · misma regla en dos sitios · otra skill** — leer el índice de capacidades antes de abrir una; las dos frases nacen de dos RED distintos (`capabilities-index-red`, r y s) y ya difieren en la redacción. Candidato S38.
  - A: `skills/sdd-roadmap/SKILL.md:50` · `14f69886` · «Read `ids.mode` too and, if you are going to write rules or name capabilities, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` and read the ones that, by their purpose, are touched: a file's name doesn't say where a rule lives (`tests/capabilities-index-red.md`, r).»
  - B: `skills/sdd-propose/SKILL.md:42` · `0490c649` · «Before opening any capability, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` and read only those that, by their purpose, the change will touch: the file name doesn't say where a rule lives (`tests/capabilities-index-red.md`, s).»
- **P2 · misma regla en dos sitios · otra sección** — qué es una fila cerrada o en vuelo, definido dos veces con distinto orden y forma. Candidato S49.
  - A: `skills/sdd-roadmap/SKILL.md:37` · `b7a77d14` · «If the row is closed (✅, 🧪) or in flight (🔄 or an open `feature/<id>-*` branch), say so instead of giving the prompt (`tests/sdd-explore-0161-red.md`, m1).»
  - B: `skills/sdd-roadmap/SKILL.md:96` · `14f69886` · «You re-split **only what is pending**: a closed feature (✅ or 🧪) or one in flight (branch `feature/<id>` open or 🔄) is not touched, and what the change asks of it goes to a new row «tras» it.»
- **P3 · misma regla en dos sitios · otra skill** — `sdd roadmap check` antes de commitear y qué hacer con un fallo en una línea que no tocaste, en dos skills (`sdd-end-release:30` solo comparte el comando, sin la regla del fallo ajeno). Candidatos S10 y S112.
  - A: `skills/sdd-roadmap/SKILL.md:54` · `14f69886` · «A failure on a line you didn't touch you don't fix: list it in your message as inherited form, pending the «Roadmap en la forma de la plantilla» step of the migration to v2.3.0 (`tests/release-close-roadmap-red.md`, P3).»
  - B: `skills/sdd-archive/references/records.md:7` · `3bc6cd16` · «A failure in a line the close wrote you fix in the roadmap, never in the validator.»
- **P4 · misma regla en dos sitios · otra skill** — `release.hasRecipient`: preguntar una vez y no escribirlo sin respuesta, en las dos skills que lo leen. Candidato S92.
  - A: `skills/sdd-roadmap/SKILL.md:103` · `14f69886` · «You never write it without an explicit answer.»
  - B: `skills/sdd-end-release/SKILL.md:26` · `686ba9fb` · «Never write or change it without an explicit answer or request from the user.»

### sdd-explore

- **P5 · misma regla en dos sitios · otra skill** — el prompt de lanzamiento calcado de `launch-prompt-template.md`, descrito en `sdd-explore` (config) y `sdd-roadmap` (fila), además de en la plantilla. Candidatos S7, S58, S135 y S136.
  - A: `skills/sdd-explore/SKILL.md:26` · `aeb28d7f` · «**Config** (dependencies, CI, settings, a typo outside visible text: no row) → give its launch prompt yourself, traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md): no id, branch `feature/<slug>`, `Carril: config`, and end with «si prefieres hacerlo en esta sesión, di "arráncalo"», in the user's language.»
  - B: `skills/sdd-roadmap/SKILL.md:56` · `14f69886` · «**Close** — say which row goes first and give its launch prompt, traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md), also with «apunta, no lo arranques»: the prompt starts nothing.»

### sdd-end-release

- **P6 · misma regla en dos sitios · skill** — la línea `smoke:` de las notas, en el paso y en su referencia. Candidato S45.
  - A: `skills/sdd-end-release/SKILL.md:28` · `fce3725a` · «Then `[Unreleased]` becomes `## [X.Y.Z] - YYYY-MM-DD` with a new empty `## [Unreleased]` above, and under the version heading goes `smoke: <date> · <N> hallazgos (<what ran>; <M> corregidos en la release)`, or `smoke: pendiente`, per [release-notes.md](references/release-notes.md).»
  - B: `skills/sdd-end-release/references/release-notes.md:11` · `fce3725a` · «The line is `smoke: <date> · <N> hallazgos (<what ran>; <M> corregidos en la release)`, or `smoke: pendiente` if none ran: the number is never made up.»

### sdd-feedback

- **P7 · misma regla en dos sitios · otra skill** — privacidad del ticket (sin nombres de cliente ni del dominio), en la skill y en el bloque de ayuda de su plantilla. Candidato S97.
  - A: `skills/sdd-feedback/SKILL.md:23` · `d68550cc` · «**Privacy**: never client, project, product or people names, nor code or business rules.»
  - B: `skills/sdd-templates/templates/kit-feedback-template.md:13` · `9c387da1` · «nunca el dominio del proyecto — sin nombres de cliente, proyecto, producto ni personas, sin»

### sdd-init

- **P8 · misma regla en dos sitios · skill** — qué es calcar una plantilla, en el paso 4 y en `structure.md`. Candidato S118.
  - A: `skills/sdd-init/SKILL.md:59` · `2d738fbd` · «Each document is **traced** from its template of `sdd-templates` ([references/structure.md](references/structure.md)): the form is the template's, the content is the interview's or the confirmed code's.»
  - B: `skills/sdd-init/references/structure.md:29` · `2d738fbd` · «**Tracing** is following the template's sections and table headers with the interview's content; never copying the equivalent document from the kit's `.docs/` or another project's, which drags in other people's notes and decisions.»
- **P9 · misma regla en dos sitios · otra skill** — la lista de manifests que delatan código o cambian el build, en dos listas que ya no coinciden. Candidato S33.
  - A: `skills/sdd-init/SKILL.md:31` · `2d738fbd` · «**With code**: the root has `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json` or `Gemfile`, or, outside `node_modules/`, `.git/` and `.docs/`, a `.ts`, `.js`, `.cs`, `.java`, `.py`, `.go`, `.rs`, `.php`, `.rb`, `.kt` or `.swift` file.»
  - B: `skills/sdd-verify/SKILL.md:58` · `97ee8641` · «If the branch —or, after `sdd merge --sync`, what the base brought— touches a file of «Sin filtro» (without the field: `package.json`, `*.csproj`, `*.sln`, `pom.xml`, `build.gradle*`, `pyproject.toml`, `go.mod`, `Cargo.toml`, `composer.json`, `Gemfile`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lock`, `packages.lock.json`, `poetry.lock`, `uv.lock`, `go.sum`, `Cargo.lock`, `composer.lock`, `Gemfile.lock`, `.moon/**`, `tsconfig*.json`, `Directory.Build.*`, `Directory.Packages.props`, `global.json`, `.prototools`, `vitest.config.*`, `jest.config.*`, `playwright.config.*`, at any depth), the gate runs without `--affected` and every task carries `(sin filtro: cambia el build)`.»

### sdd-templates

- **P10 · misma regla en dos sitios · skill** — cómo se cuenta el esfuerzo real, en tres plantillas y con dos formas distintas (la línea de `sdd session tokens` en el patch, «<Zh> — reloj de la sesión…» en el walkthrough). Candidatos S98 y S102.
  - A: `skills/sdd-templates/templates/patch-template.md:79` · `12880661` · «Esfuerzo real: <la línea de `sdd session tokens --path <worktree> --branch <rama> --artifact <carpeta>`, pegada tal cual: cuenta desde el arranque de la sesión que abrió el trabajo, con la investigación previa, y sin las esperas al dev-lead | fuera de Claude Code, `<Yh>, aproximado con las marcas de los commits`>»
  - B: `skills/sdd-templates/templates/walkthrough-template.md:26` · `7f363919` · «Esfuerzo real: <Zh> — reloj de la sesión <h> desde <inicio>, sin <min> min de espera al dev-lead (<n> esperas)[, sin <h> h sin actividad (<n> huecos)] *(tal cual de `sdd session tokens`: desde el arranque de la sesión que lo abrió, investigación previa incluida, sin las esperas al dev-lead.»
  - C: `skills/sdd-templates/templates/estimation-template.md:8` · `4583776a` · «El `walkthrough.md` registra el tiempo real.»
- **P11 · misma regla en dos sitios · skill** — cuándo vale `Validación: agente`, en la spec y en el patch con condiciones distintas (el patch exige la frase literal del dev-lead; la spec, solo con delegación). Candidato S32.
  - A: `skills/sdd-templates/templates/patch-template.md:26` · `5abd84b8` · «`agente` solo si un humano no observaría nada que el agente no haya medido ya, y con la frase literal del dev-lead en la petición o en la pregunta del carril; sin ella, o en duda, `dev-lead`.»
  - B: `skills/sdd-templates/templates/spec-template.md:25` · `3d486fab` · «`agente` solo si un humano no observaría nada que el agente no haya medido ya (configuración, tests, documentos, estrés, un entorno muy complicado); lo que usa una persona, y en duda, `dev-lead`.»
- **P12 · misma regla en dos sitios · otra skill** — una capacidad es un sustantivo del dominio, nunca un ticket, y su slug en inglés kebab-case: en dos plantillas y en el paso 4 de `sdd-propose`. Candidato S24.
  - A: `skills/sdd-templates/templates/capability-template.md:4` · `9963d5bf` · «Una capacidad es un sustantivo del dominio, nunca un ticket ni una feature.»
  - B: `skills/sdd-templates/templates/spec-template.md:101` · `8e591124` · «Una capacidad es un sustantivo del dominio, nunca un ticket.»
  - C: `skills/sdd-propose/SKILL.md:60` · `66a8fe4c` · «If the delta creates a new capability in `capabilities/`, declare it in the decisions with its name in English kebab-case: the slug is a file name, even if the content is in Spanish.»
- **P13 · misma regla en dos sitios · otra skill** — los campos de `§Frontend` (Detector, Acceso) definidos en la referencia de `sdd-implement` y otra vez en la plantilla de operations, con distinta redacción. Candidatos S15 y S17.
  - A: `skills/sdd-implement/references/frontend-verification.md:16` · `7461d95d` · «**Detector**: el comando, con los huecos `{url}` y `{viewport}`, y qué salida cuenta como fallo (p.»
  - B: `skills/sdd-templates/templates/operations-template.md:40` · `4523e140` · «**Detector**: <comando con `{url}` y `{viewport}` y qué salida es fallo, p.»
- **P14 · misma regla en dos sitios · otra skill** — la línea `Gate:` (una entrada por tarea, corrida o saltada): regla en `sdd-verify` y repetida con su forma en dos plantillas y dos pasos. Candidatos S12, S61, S66, S124 y S142.
  - A: `skills/sdd-verify/SKILL.md:53` · `161195a3` · «**The `Gate:` line.** A gate that filters (`--affected --base <ref>`, a cache) exits 0 even when it skips tasks, so wherever you record a gate —a config commit, the walkthrough's 4.1, `patch.md` §4, the baseline report— the line names every task: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué>) ``, with `<N>/<M>` its tests in green over its total; a gate without tasks (`node --test`) is one entry: `` Gate: `<comando>` → <N>/<M> ``.»
  - B: `skills/sdd-templates/templates/walkthrough-template.md:53` · `161195a3` · «Gate: `<suite unitaria, si «Suites» la declara>` · `<comando>` → <suite>: corrió <N>/<M> · <tarea>: corrió <N>/<M> (sin filtro: cambia el build, si la rama toca «Sin filtro») · <tarea>: saltada (<porqué de la herramienta>) · <duración> · configuración: <la del gate | lo que se añadió> · sobre <sha | el commit de cierre, si el cierre junta ese sha> *(sin «Presupuesto E2E» o con `pendiente`, si pasa de 10 min, apúntalo en 4.3 como deuda del proyecto, con la duración)*»
  - C: `skills/sdd-propose/SKILL.md:74` · `5e981f9d` · «Gate green → one commit on the current branch, whose body carries the `Gate:` line of `sdd-verify`, one entry per task of the gate: `` Gate: `<comando>` → <tarea>: corrió <N>/<M> · <tarea>: saltada (<porqué de la herramienta>) ``; a task whose definition you edited runs without the filter first (`tests/affected-gate-red.md`, k6).»
  - D: `skills/sdd-archive/SKILL.md:53` · `161195a3` · «Record each run with the `Gate:` line of `sdd-verify`, one entry per task, `<tarea>: saltada (<porqué>)` too (`tests/affected-gate-red.md`, g5).»
- **P15 · misma regla en dos sitios · otra skill** — qué es un desvío (requisito, THEN, Scope, «No entra», «Dónde se prueba»), en tres sitios. Candidato S50.
  - A: `skills/sdd-propose/references/control-profiles.md:68` · `b60c6c8b` · «Un desvío cambia la spec aprobada: un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba».»
  - B: `skills/sdd-templates/templates/spec-template.md:162` · `e7c502c9` · «Un cambio a la spec aprobada durante la ejecución: un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba».»
  - C: `skills/sdd-implement/SKILL.md:305` · `b60c6c8b` · «**Deviation**: a change to the approved spec (a requirement, a THEN, the Scope, a «No entra» or «Dónde se prueba») — the update action.»
- **P16 · misma regla en dos sitios · otra skill** — un documento técnico dice dónde está la pieza y enlaza la capacidad, sin copiar el valor: en la plantilla del plan y en los aprendizajes de `sdd-archive` (y en la regla de reparto de `spec-template.md`). Candidato S79.
  - A: `skills/sdd-templates/templates/plan-template.md:75` · `9a2089a3` · «Si una task documenta `tech-stack.md`, `architecture.md` o `environments.md`, dice dónde está la pieza técnica y enlaza la capacidad, sin copiar el valor.»
  - B: `skills/sdd-archive/references/aprendizajes-skills.md:5` · `7d0b66cd` · «Un documento de anclaje dice dónde está la pieza técnica y enlaza la capacidad; nunca copia un valor de comportamiento (tiempo, límite, cuota, aviso), que vive solo en `capabilities/`, aunque el plan pida documentarlo.»
- **P17 · misma regla en dos sitios · otra skill** — el método de ejecución y sus cuatro factores sin umbral, en cinco sitios. Candidatos S4, S100, S127 y S75.
  - A: `skills/sdd-templates/templates/plan-template.md:30` · `ad0aadfe` · «**Ejecución**: <native | subagent>, porque <motivo del plan> (el motivo pesa la dependencia entre las interfaces de las tasks, cuántas son, el coste de un error que llegue a la rama y si el plan cabe en un contexto, sin umbral: «native, porque 3 tasks encadenadas por la interfaz de Ledger, un error lo caza el test de su task y el plan cabe en un contexto») · o, con `execution` fijado en `sdd-kit.json` o `sdd-kit.local.json`: <valor>, fijado en <sdd-kit.json | sdd-kit.local.json>, el fichero que lo fija · con native, añade: Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger.»
  - B: `skills/sdd-propose/references/plan-writing.md:33` · `89cc7e5d` · «The reason weighs four factors by name, with no numeric threshold: how much the tasks depend on each other's interfaces, how many there are, what an error reaching the branch costs, and whether the plan fits one context.»
  - C: `skills/sdd-implement/SKILL.md:26` · `e7ddf254` · «With `execution: auto` its reason weighs four factors by name, with no numeric threshold: how much the tasks depend on each other's interfaces, how many there are, what an error reaching the branch costs, and whether the plan fits one context.»
  - D: `skills/sdd-propose/references/control-profiles.md:231` · `89cc7e5d` · «`execution` elige el método de ejecución de los planes.»
- **P18 · misma regla en dos sitios · otra skill** — modelo y effort declarados en cada despacho, porque omitidos se heredan: en cinco sitios, uno por skill que despacha. Candidatos S70, S80 y S144.
  - A: `skills/sdd-templates/templates/plan-template.md:142` · `7263e433` · «**Modelo**: <modelo **y** effort, los dos explícitos, con el despacho literal: `subagent_type: sdd-kit:effort-<low|medium|high>` + `model: <sonnet|opus>` — `Agent` no tiene parámetro de effort y, sin tipo, el subagente hereda el de la sesión.»
  - B: `skills/sdd-implement/SKILL.md:196` · `e7ddf254` · «Declare model and effort on every dispatch: an omitted model inherits your session's —often the most capable and most expensive—, which silently defeats this paragraph, and an omitted effort inherits the session's too.»
  - C: `skills/sdd-parallel-agents/SKILL.md:84` · `1d1fd15c` · «**Model and effort on every dispatch**: the `model` and the agent type `sdd-kit:effort-<level>` the calling skill names; omitted, both inherit the session's.»
  - D: `skills/sdd-verify/SKILL.md:200` · `649f1a99` · «Specify model and effort on every dispatch; an omitted model inherits the session's.»
- **P19 · misma regla en dos sitios · otra skill** — las líneas de validación del walkthrough (en campo, diferida), en el contrato de perfiles y en la plantilla. Candidatos S13 y S83.
  - A: `skills/sdd-propose/references/control-profiles.md:127` · `9963d5bf` · «Walkthrough: `Validación diferida: <fecha> · «<frase literal>» · disparador: <feature, release o uso con dueño>`»
  - B: `skills/sdd-templates/templates/walkthrough-template.md:65` · `95736c06` · «Validado por el dev-lead: <fecha> · <qué probó> **o** Validación diferida: <fecha> · «<frase literal>» ·»
- **P20 · misma regla en dos sitios · otra skill** — el delta de un patch (sin capacidades nuevas), en el cierre y en la plantilla. Candidato S60.
  - A: `skills/sdd-archive/references/records.md:29` · `f5d52697` · «If the fix only brings it back to what the capability says, there's no delta: «Capacidades» says `Ninguna, porque el fix devuelve <comando> a lo que ya dice <nombre>`, and an empty delta section of the template goes.»
  - B: `skills/sdd-templates/templates/patch-template.md:30` · `2ddf4383` · «Sin delta, una sola línea: «Ninguna, porque el fix devuelve `<comando>` a lo que ya dice `<nombre>`» o «Ninguna, porque ninguna capacidad describe `<pieza>`».»

### sdd-config

- **P21 · excepción pegada · unidad** — `97ec9c02` (cierre de la 0178) añadió «unless asked» a «A key with a value isn't asked again» de `900f5af1`. Candidato E17, descartado como predicado en la primera pasada y reclasificado al rastrearlo.
  - A: `skills/sdd-config/SKILL.md:16` · `97ec9c02` · «A key with a value isn't asked again unless asked.»
  - B: `skills/sdd-config/SKILL.md:16` · `97ec9c02` · «A key with a value isn't asked again unless asked.»
