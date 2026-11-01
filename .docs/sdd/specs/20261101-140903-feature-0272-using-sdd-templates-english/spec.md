---
id: 20261101-140903-feature-0272-using-sdd-templates-english
feature: 0272
parent: 0206
proposal: 0131
title: using-sdd y sdd-templates en inglés
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — `using-sdd` y `sdd-templates` en inglés

🦆 Para quien usa el kit no cambia nada: si escribe «Mete un filtro por sala en el comando libres», el agente entra por `sdd-propose` como hoy, y le sigue hablando en castellano. Cambia el texto que lee el agente: las dos últimas skills en castellano pasan a inglés, incluida la `description` que decide cuándo se cargan. Las frases que escribe el usuario, como «no lo pillo», siguen en su idioma, porque son lo que hay que reconocer. Lo probamos lanzando las 24 frases de la batería de `using-sdd` (34 sujetos) y pidiendo una ADR, que debe salir calcada de su plantilla.

Validación: agente — son texto de skill y su batería: un humano no observaría nada que los sujetos no midan, y este repo valida en campo (`validation.mode: field`).

## Capacidades

Ninguna: ningún requisito cambia. `routing` sigue cumpliéndose tal como está, y `using-sdd` sigue nombrando las siete puertas que exige.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 · tamaño: ~100 líneas en 3 ficheros

1. **Una frase nueva en cada skill: `Write everything the user reads in the language of their message`.** Art. III y ADR 0004 obligan a que cada skill en inglés lo diga, y hoy, en castellano, no hacía falta. No es una regla del flujo. En `sdd-templates` añade «a template's text and literals stay as they are», para que el inglés de la skill no traduzca los artefactos: es lo que ya pasa hoy, dicho porque antes lo daba el idioma.
2. **Lo que sigue en castellano, además de las frases del usuario**: lo que lee o escribe otra pieza tal cual. Secciones y etiquetas de plantilla («Reglas de producto», «Capacidades», «Estimación y esfuerzo», «Verificación», *(si el módulo está activo)*, Por triar, En espera, Lista, Descartadas), la clave `rutas`, el hueco `<proyecto>` de las plantillas y las salidas de la CLI (`Roadmap válido`, `(sin propósito)`, `TERMINADO: <comando> salió con <rc>`). Los huecos de los ejemplos de órdenes pasan a inglés (`<raíz>` a `<root>`).
3. **Glosario**: puerta = gate; calcar = trace, como ya dice `sdd-propose`; carril = lane; deriva = drift; las excusas del agente son rationalizations y van en inglés, porque no las escribe el usuario.
4. **La línea base es la batería de la 0206, sin RED nuevo**: 24/24 del mismo día (`enrutado-entera/` de la 0206), medida sobre el texto en castellano actual. Otro RED costaría ~5 $ y repetiría esa medida.
5. **El humo de `sdd-templates` es una ADR, un sujeto, sobre el molde `salas`**: «Escribe la ADR de que las reservas se guardan en un fichero JSON y no en una base de datos.» Pasa si invoca `sdd-kit:sdd-templates` y `sdd decision check` da verde sobre el fichero, porque esa orden comprueba nombre, `status`, `date`, `rutas` y el orden de las secciones. La elijo porque tiene comprobación por máquina. El sujeto va en la carpeta de evidencia, sin batería nueva: `sdd-templates` no tiene y el Scope no la pide.
6. **Las filas en prosa que se leen a mano**: `d1` (una sola pregunta, recomendación primero) y `s1` (nada en memoria), más el idioma de la respuesta en todos los sujetos que respondan al usuario: es el riesgo nuevo que trae el inglés.
7. **`battery.md` se actualiza** en lo que cita literal: la «Regla de duda» y las cuatro racionalizaciones de «Procedencia de las reglas». Los `tests/*-red.md` y `*-green.md` anteriores son evidencia histórica y no se tocan.
- Política de modelos: revisores de la spec, ninguno · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin código ejecutable) · sujetos en Sonnet, en paralelo por tandas hasta `control.maxParallelAgents` (3) — al aprobar la spec apruebas también este paralelismo.
- Resultado de `sdd capability merge` en copia: `Sin delta que fusionar` (sale con 0).

### Decisiones tomadas con el dev-lead

- Solo cambia el idioma; una regla que deba cambiar va a una fila — «Solo cambia el idioma: una regla que deba cambiar va a una fila, no entra aquí.»
- La batería de `using-sdd` enruta igual — «la batería de `using-sdd` tiene que enrutar igual que antes.»
- Presupuesto — «Presupuesto de sujetos de ~13 $, de la fila. Si la previsión lo pasa, para.»
- Fuera las plantillas — «El contenido de skills/sdd-templates/templates/: las plantillas no se traducen aquí.»

## Intent

`using-sdd` y `sdd-templates` son las dos skills que siguen en castellano contra el Art. III. Esta feature las pasa a inglés sin cambiar ninguna regla. La `description` de `using-sdd` y su texto, inyectado por el hook en cada sesión, deciden la primera skill que se invoca, así que el éxito es que enruten igual: ninguna fila de la batería baja de su umbral. Fracasa, aunque el inglés sea correcto, si una frase cae en otra puerta, si el agente pasa a responder en inglés a quien escribe en castellano o si un artefacto sale con la plantilla traducida.

## Scope

- Entra: `skills/using-sdd/SKILL.md` y `skills/sdd-templates/SKILL.md`, con sus `description`; `tests/batteries/using-sdd/battery.md` en lo que cita literal; la batería entera de `using-sdd` y el humo de `sdd-templates`.
- No entra: el contenido de `skills/sdd-templates/templates/`; las filas de la tabla de puertas o las reglas de `using-sdd` (retomar una tarea es la 0116); las frases del usuario, que se quedan en su idioma; `subject.mjs` y los moldes.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `description` de las dos skills | `SKILL.md`:3 de cada una; ningún test ni documento las cita | Tabla de reglas |
| Encabezado `## Puertas` | `using-sdd/SKILL.md`:12; `battery.md`:3 lo describe como «tabla de puertas», en castellano y sin citarlo | `## Gates`; `battery.md`:3 se queda |
| Encabezado `## Regla de duda` | `using-sdd/SKILL.md`:24; `battery.md`:52 | `## Doubt rule`; `battery.md` lo cita (decisión 7) |
| Las cuatro racionalizaciones | `using-sdd/SKILL.md`:30-33; `battery.md`:53-56; `tests/using-sdd-red.md` y similares, históricos | Inglés; `battery.md` las cita (decisión 7); evidencia histórica sin tocar |
| `Reglas al usarlas:` | `sdd-templates/SKILL.md`:68; sin más apariciones | `Rules when using them:` |

- Filas que implementa: 0272 → `.docs/sdd/roadmap.md`:113, que marca el cierre; `field-reports/` y el spec de la 0206 la citan como historia y no cambian. Comprobado con `grep` sobre `skills/`, `cli/`, `hooks/`, `tests/batteries/`, `tests/headless/`, `capabilities/`, `.docs/workflow/` y los documentos de anclaje.

## Approach

Los dos `SKILL.md` se sustituyen por los drafts de la tabla de reglas, línea a línea y con la misma estructura. El dev-lead fija que solo cambie el idioma. `cli/test/kit/skills.test.ts` ya vigila el índice de plantillas y `word-budget.test.ts` los topes: ningún test en `cli/` busca frases de estas skills, así que no se toca ninguno.

## Dónde se prueba

- Enrutado y `description` de `using-sdd`: batería entera con `node tests/headless/battery.mjs run` (`BATTERY=using-sdd`), con `KIT_DIR` en el worktree; ninguna fila por debajo de su umbral. Un rojo no se relanza: se lee y, si pide cambiar algo más que el inglés, para.
- Filas en prosa: lectura de `texts.txt` según la decisión 6.
- Calco de plantilla: el humo de la decisión 5.
- Frases del usuario intactas: comparación por script de todo lo que va entre «» antes y después; solo pueden faltar las cuatro racionalizaciones.
- Órdenes, enlaces y literales de la CLI: `skills.test.ts` y comparación por script de los tramos de código antes y después, salvo los huecos de la decisión 2.
- Topes: `word-budget.test.ts`, dentro del gate de cierre.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: ningún requisito cambia.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/using-sdd/SKILL.md` | 524 / 570 (hoy 512) | 46 | sin cambio |
| `skills/sdd-templates/SKILL.md` | 1590 / 1700 (hoy 1620) | 110 | sin cambio |

Medidos con `wc -w` sobre los drafts, el mismo corte por blancos que el test. La suma de `using-sdd` crece 12 palabras, de las que 11 son la frase del Art. III. El CLAUDE.md pide saldo igual o menor solo a los arreglos que salen de un ticket, y este no lo es.

## Previsión de coste

Precio por sujeto: 0,35 $ de techo por uno de enrutado y 1 $ por uno de un paso, de la spec de la 0206. Lo medido allí fue 0,16 $ y ~0,5 $, lo que daría ~6 $.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0: la línea base es la de la 0206 (decisión 4) | 0 |
| GREEN | 34 (`using-sdd` entera) | 11,9 |
| Humo de `sdd-templates` | 1 | 1 |
| Una tanda de REFACTOR | 0: un rojo para y se lee; un retoque del inglés vuelve a lanzar su tramo con el margen de lo medido | 0 |
| Controles | 0: el GREEN es el control | 0 |
| Medición tras la revisión final | 0: si la revisión cambia una `description` o una fila, se lanza su tramo con el margen de lo medido | 0 |
| Suma | 35 | 12,9 |

Cabe en el presupuesto de ~13 $. Si lo gastado pasa de 13 $, para.

## Tabla de reglas: antes y después

Cada línea de texto que cambia, casada por número de línea con el draft: es el texto que se va a escribir. Lo que no sale aquí no cambia. Reglas añadidas: solo las de la decisión 1, en `using-sdd:10` y `sdd-templates:11`.

| Línea | Antes | Después |
| --- | --- | --- |
| using-sdd:3 | description: Usar al empezar cualquier conversación en un proyecto con .docs/sdd/, antes de responder, preguntar o invocar brainstorming — dice por qué skill del kit SDD entra cada petición. | description: Use at the start of any conversation in a project with .docs/sdd/, before answering, asking or invoking brainstorming — says which SDD kit skill each request enters through. |
| using-sdd:10 | Este proyecto trabaja con el kit SDD (`.docs/sdd/`). Es una instrucción del proyecto y **prevalece** sobre la regla de superpowers de invocar `brainstorming` primero: las puertas de entrada son las skills del kit, que entrevistan con `sdd-grilling` y no invocan `brainstorming` ni `writing-plans`. | This project works with the SDD kit (`.docs/sdd/`). This is a project instruction and **takes precedence** over superpowers' rule of invoking `brainstorming` first: the entry gates are the kit's skills, which interview with `sdd-grilling` and don't invoke `brainstorming` or `writing-plans`. Write everything the user reads in the language of their message. |
| using-sdd:12 | ## Puertas | ## Gates |
| using-sdd:14 | Lo que escribe el usuario · Puerta | What the user writes · Gate |
| using-sdd:16 | Sin `.docs/sdd/`, quiere trabajar con SDD (proyecto nuevo, con código o recién sacado de un template), o una init en curso (`.docs/sdd/sdd-kit.json` con la clave `init`): «sigue con la init» · `sdd-kit:sdd-init` | No `.docs/sdd/` and wants to work with SDD (a new project, one with code or fresh from a template), or an init in progress (`.docs/sdd/sdd-kit.json` with the `init` key): «sigue con la init» · `sdd-kit:sdd-init` |
| using-sdd:17 | Un proyecto ya inicializado quiere ponerse al día con el kit («actualízame al kit», «ponme el proyecto al día»), o acepta la oferta del aviso de migraciones · `sdd-kit:sdd-upgrade` | An initialized project wants to catch up with the kit («actualízame al kit», «ponme el proyecto al día»), or accepts the offer of the migrations notice · `sdd-kit:sdd-upgrade` |
| using-sdd:18 | Una pregunta o una duda: «¿cómo funciona…?», «¿se puede…?», «no lo pillo» · `sdd-kit:sdd-explore` | A question or a doubt: «¿cómo funciona…?», «¿se puede…?», «no lo pillo» · `sdd-kit:sdd-explore` |
| using-sdd:19 | Planificar sin hacerlo todavía: «apunta en el roadmap», «no lo arranques». Algo grande: varias funcionalidades a la vez, o una que el criterio de partir de `sdd-propose` partiría; notas de una reunión; items del gestor (Azure DevOps, Jira), también los que te han asignado para hacerlos; reordenar; preparar la release siguiente; «dame el prompt de la <id>» · `sdd-kit:sdd-roadmap` | Planning without doing it yet: «apunta en el roadmap», «no lo arranques». Something big: several features at once, or one that `sdd-propose`'s splitting criterion would split; notes from a meeting; items from the tracker (Azure DevOps, Jira), including those assigned to you to do; reordering; preparing the next release; «dame el prompt de la <id>» · `sdd-kit:sdd-roadmap` |
| using-sdd:20 | Un cambio, aunque sea pequeño o pidan un patch: una funcionalidad («añade…», «hazme…», «let's build…», «es una tontería, hazlo rápido»), un fallo, un ajuste o una retirada de presentación, un cambio de dependencias, CI o configuración, un typo o un renombrado, una investigación que deja medidas · `sdd-kit:sdd-propose`, antes que `brainstorming` | A change, even a small one or one asked for as a patch: a feature («añade…», «hazme…», «let's build…», «es una tontería, hazlo rápido»), a failure, a presentation adjustment or removal, a dependency, CI or settings change, a typo or rename, an investigation that leaves measurements · `sdd-kit:sdd-propose`, before `brainstorming` |
| using-sdd:21 | Cerrar la entrega de una versión, preparar las notas del cliente · `sdd-kit:sdd-end-release` | Closing the delivery of a version, preparing the client's notes · `sdd-kit:sdd-end-release` |
| using-sdd:22 | Cómo quiere trabajar cada uno: «me paras mucho», «quiero menos preguntas», «déjamelo configurado para mí» · `sdd-kit:sdd-config`, nunca la memoria del agente: la memoria se queda en un PC y el kit no la lee | How each person wants to work: «me paras mucho», «quiero menos preguntas», «déjamelo configurado para mí» · `sdd-kit:sdd-config`, never the agent's memory: memory stays on one PC and the kit doesn't read it |
| using-sdd:24 | ## Regla de duda | ## Doubt rule |
| using-sdd:26 | Si la petición no dice qué es ni cuánto abarca («hay que mejorar las reservas»), no elijas puerta: haz **una sola pregunta** sobre qué es y cuánto abarca, con tu **recomendación primero**, antes de invocar ninguna skill de arranque. Con la respuesta, eliges puerta. | If the request doesn't say what it is or how much it covers («hay que mejorar las reservas»), don't choose a gate: ask **one single question** about what it is and how much it covers, with your **recommendation first**, before invoking any entry skill. With the answer, choose the gate. |
| using-sdd:28 | Racionalización · Realidad | Rationalization · Reality |
| using-sdd:30 | «Quiere que se haga, así que es una feature» · Querer que se haga no dice el tamaño. Sin saber qué es, la puerta es una suposición: pregunta. | "They want it done, so it's a feature" · Wanting it done doesn't say the size. Without knowing what it is, the gate is a guess: ask. |
| using-sdd:31 | «Lo guardo en memoria para próximas sesiones» · La preferencia es del kit: `sdd-config` la escribe en `sdd-kit.local.json`, que leen todas las skills. | "I'll save it to memory for future sessions" · The preference belongs to the kit: `sdd-config` writes it in `sdd-kit.local.json`, which every skill reads. |
| using-sdd:32 | «Es un typo o subir una versión: edición directa» · No hay edición directa: `sdd-propose` lo clasifica, y config corre las pruebas antes del commit. | "It's a typo or a version bump: a direct edit" · There is no direct edit: `sdd-propose` classifies it, and config runs the tests before the commit. |
| using-sdd:33 | «Me los han asignado: los hago uno detrás de otro» · Sin fila en el roadmap no hay enunciado ni id. `sdd-roadmap` los apunta y después arrancan. | "They've been assigned to me: I'll do them one after another" · Without a roadmap row there is no statement or id. `sdd-roadmap` records them and they start afterwards. |
| sdd-templates:3 | description: Usar cuando hay que crear un artefacto SDD (spec, plan, tasks, walkthrough, patch, propuesta, data-model, research, feedback de release, release notes) o un documento del proyecto (PRODUCT, constitution, operations, architecture, roadmap, estimation, changelog, ADR) — la plantilla se calca desde aquí. Las plantillas viven SOLO en el kit; los proyectos NO llevan carpeta templates/. | description: Use when an SDD artifact must be created (spec, plan, tasks, walkthrough, patch, proposal, data-model, research, release feedback, release notes) or a project document (PRODUCT, constitution, operations, architecture, roadmap, estimation, changelog, ADR) — the template is traced from here. Templates live ONLY in the kit; projects do NOT carry a templates/ folder. |
| sdd-templates:11 | Plantillas canónicas del kit SDD. **Viven solo aquí**: los proyectos no llevan carpeta `templates/` — al crear un artefacto se invoca esta skill y se calca la plantilla que toque. Una copia por proyecto sería deriva instantánea (la plantilla evoluciona en el kit y las copias se quedan atrás). | The SDD kit's canonical templates. **They live only here**: projects don't carry a `templates/` folder — to create an artifact, invoke this skill and trace the template that applies. A copy per project would drift instantly (the template evolves in the kit and the copies fall behind). Write everything the user reads in the language of their message; a template's text and literals stay as they are. |
| sdd-templates:13 | Plantilla · Artefacto · Cuándo | Template · Artifact · When |
| sdd-templates:15 | [spec-template.md](templates/spec-template.md) · `spec.md` · Toda feature, en los dos modos. Spec ligera: decisiones a validar · Intent/Scope/Approach · delta por capacidad · aprobaciones | [spec-template.md](templates/spec-template.md) · `spec.md` · Every feature, in both modes. Light spec: decisions to validate · Intent/Scope/Approach · delta per capability · approvals |
| sdd-templates:16 | [plan-template.md](templates/plan-template.md) · `plan.md` · Solo modo full, tras aprobar la spec (cómo) | [plan-template.md](templates/plan-template.md) · `plan.md` · Full mode only, after the spec is approved (how) |
| sdd-templates:17 | [tasks-template.md](templates/tasks-template.md) · `tasks.md` · Solo si el plan tiene >1 task (registro vivo) | [tasks-template.md](templates/tasks-template.md) · `tasks.md` · Only if the plan has >1 task (live record) |
| sdd-templates:18 | [walkthrough-template.md](templates/walkthrough-template.md) · `walkthrough.md` · Cierre de toda feature | [walkthrough-template.md](templates/walkthrough-template.md) · `walkthrough.md` · Closing of every feature |
| sdd-templates:19 | [patch-template.md](templates/patch-template.md) · `patch.md` · Carril patch (único artefacto) | [patch-template.md](templates/patch-template.md) · `patch.md` · Patch lane (only artifact) |
| sdd-templates:20 | [proposal-template.md](templates/proposal-template.md) · `proposal.md` · Carril `proposal`: la escribe `sdd-roadmap` para algo grande o una reunión con el cliente; histórica, con enmiendas fechadas | [proposal-template.md](templates/proposal-template.md) · `proposal.md` · `proposal` lane: `sdd-roadmap` writes it for something big or a client meeting; historical, with dated amendments |
| sdd-templates:21 | [launch-prompt-template.md](templates/launch-prompt-template.md) · prompt de arranque, en el chat · Lo dan `sdd-roadmap` y `sdd-explore`: arranca el cambio en otro worktree con su carril y sus decisiones | [launch-prompt-template.md](templates/launch-prompt-template.md) · launch prompt, in the chat · Given by `sdd-roadmap` and `sdd-explore`: starts the change in another worktree with its lane and its decisions |
| sdd-templates:22 | [validation-template.md](templates/validation-template.md) · mensaje de validación, en el chat · Lo presenta `sdd-archive` | [validation-template.md](templates/validation-template.md) · validation message, in the chat · Presented by `sdd-archive` |
| sdd-templates:23 | [data-model-template.md](templates/data-model-template.md) · `data-model.md` · Opcional: cambios de datos que no caben en el plan | [data-model-template.md](templates/data-model-template.md) · `data-model.md` · Optional: data changes that don't fit in the plan |
| sdd-templates:24 | [research-template.md](templates/research-template.md) · `research.md` · Opcional: investigación previa con timebox | [research-template.md](templates/research-template.md) · `research.md` · Optional: prior research with a timebox |
| sdd-templates:25 | [feedback-template.md](templates/feedback-template.md) · `feedback.md` · Cierre de release: acta única (inventario + triage + retro) | [feedback-template.md](templates/feedback-template.md) · `feedback.md` · Release closing: single record (inventory + triage + retro) |
| sdd-templates:26 | [release-notes-template.md](templates/release-notes-template.md) · `release-notes.md` · Cierre de release: notas de cliente destiladas del changelog | [release-notes-template.md](templates/release-notes-template.md) · `release-notes.md` · Release closing: client notes distilled from the changelog |
| sdd-templates:27 | [capability-template.md](templates/capability-template.md) · `capabilities/<capability>.md` · Verdad viva del comportamiento: la crea la spec que declara la capacidad, la fusiona `sdd-archive` | [capability-template.md](templates/capability-template.md) · `capabilities/<capability>.md` · Living truth of behavior: created by the spec that declares the capability, merged by `sdd-archive` |
| sdd-templates:28 | [kit-feedback-template.md](templates/kit-feedback-template.md) · ticket en `.docs/sdd/kit-feedback/` · Al cerrar una feature o un patch, vía `sdd-feedback` | [kit-feedback-template.md](templates/kit-feedback-template.md) · ticket in `.docs/sdd/kit-feedback/` · When closing a feature or a patch, via `sdd-feedback` |
| sdd-templates:29 | [PRODUCT-template.md](templates/PRODUCT-template.md) · `PRODUCT.md` en la raíz · Para quién y para qué es el producto, y su glosario (`## Terminology`). Encabezados de impeccable, que lee el mismo fichero | [PRODUCT-template.md](templates/PRODUCT-template.md) · `PRODUCT.md` at the root · Who the product is for and what for, and its glossary (`## Terminology`). Impeccable's headings, since it reads the same file |
| sdd-templates:30 | [constitution-template.md](templates/constitution-template.md) · `.docs/sdd/steering/constitution.md` (2.x: `.docs/sdd/constitution.md`) · Documento de anclaje: lo calca el init, con las cinco «Reglas de producto» por nombre | [constitution-template.md](templates/constitution-template.md) · `.docs/sdd/steering/constitution.md` (2.x: `.docs/sdd/constitution.md`) · Anchor document: traced by the init, with the five «Reglas de producto» by name |
| sdd-templates:31 | [operations-template.md](templates/operations-template.md) · `.docs/sdd/steering/operations.md` · Cómo se ejecuta y se verifica: comandos, testing, frontend y entornos; sin versiones | [operations-template.md](templates/operations-template.md) · `.docs/sdd/steering/operations.md` · How it runs and is verified: commands, testing, frontend and environments; no versions |
| sdd-templates:32 | [architecture-template.md](templates/architecture-template.md) · `.docs/sdd/steering/architecture.md` (2.x: `.docs/sdd/architecture.md`) · Documento de anclaje: lo calca el init, o quien lo necesite si se pospuso (una feature, `sdd-archive` con un aprendizaje estructural, `sdd-explore`) | [architecture-template.md](templates/architecture-template.md) · `.docs/sdd/steering/architecture.md` (2.x: `.docs/sdd/architecture.md`) · Anchor document: traced by the init, or by whoever needs it if it was postponed (a feature, `sdd-archive` with a structural learning, `sdd-explore`) |
| sdd-templates:33 | [now-next-later-template.md](templates/now-next-later-template.md) · `ROADMAP.md` en la raíz · Documento de anclaje: lo calca el init; Now, Next y Later con la cabecera de tabla literal, porque las leen otras skills y `sdd roadmap check` | [now-next-later-template.md](templates/now-next-later-template.md) · `ROADMAP.md` at the root · Anchor document: traced by the init; Now, Next and Later with the literal table header, because other skills and `sdd roadmap check` read them |
| sdd-templates:34 | [debt-template.md](templates/debt-template.md) · `.docs/sdd/steering/debt.md` · Documento de estado de la deuda técnica: Por triar, En espera, Lista y Descartadas; lo escribe `sdd-roadmap` al triar | [debt-template.md](templates/debt-template.md) · `.docs/sdd/steering/debt.md` · State document of the technical debt: Por triar, En espera, Lista and Descartadas; `sdd-roadmap` writes it when triaging |
| sdd-templates:35 | [roadmap-template.md](templates/roadmap-template.md) · `.docs/sdd/roadmap.md` · **2.x, deprecada: la leen `migrations/v2.3.0.md` y los proyectos sin migrar; se borra en la 4.0.0.** Documento de anclaje 2.x: secciones y cabeceras de tabla literales, porque las leen otras skills | [roadmap-template.md](templates/roadmap-template.md) · `.docs/sdd/roadmap.md` · **2.x, deprecated: read by `migrations/v2.3.0.md` and unmigrated projects; deleted in 4.0.0.** 2.x anchor document: literal sections and table headers, because other skills read them |
| sdd-templates:36 | [estimation-template.md](templates/estimation-template.md) · `.docs/sdd/steering/estimation.md` (2.x: `.docs/sdd/estimation.md`) · Opt-in del proyecto: activa el módulo de estimación; calibración vacía al nacer | [estimation-template.md](templates/estimation-template.md) · `.docs/sdd/steering/estimation.md` (2.x: `.docs/sdd/estimation.md`) · Project opt-in: activates the estimation module; empty calibration at birth |
| sdd-templates:37 | [changelog-template.md](templates/changelog-template.md) · `CHANGELOG.md` en la raíz (2.x: `.docs/sdd/changelog.md`) · Opt-in del proyecto (entrevista de init): activa `add-to-changelog`; nace con `## [Unreleased]` y sin entradas | [changelog-template.md](templates/changelog-template.md) · `CHANGELOG.md` at the root (2.x: `.docs/sdd/changelog.md`) · Project opt-in (init interview): activates `add-to-changelog`; born with `## [Unreleased]` and no entries |
| sdd-templates:38 | [adr-template.md](templates/adr-template.md) · `.docs/sdd/decisions/NNNN-<slug>.md` · El porqué de una decisión difícil de deshacer; inmutable, se sustituye con otra | [adr-template.md](templates/adr-template.md) · `.docs/sdd/decisions/NNNN-<slug>.md` · The why of a decision that is hard to undo; immutable, replaced by another |
| sdd-templates:42 | El código ejecutable del kit es una CLI en Node, `cli/bin/sdd.js`, que viaja con el plugin; no se copia al proyecto. Se invoca `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo> <opciones>`; `--help` lista los verbos. Abajo van sin la ruta. | The kit's executable code is a Node CLI, `cli/bin/sdd.js`, that travels with the plugin; it isn't copied to the project. Invoke `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verb> <options>`; `--help` lists the verbs. Below they go without the path. |
| sdd-templates:44 | Verbo · Uso | Verb · Use |
| sdd-templates:46 | `sdd estimation log` · Regenera `estimation-log.md` desde los walkthroughs y patches (`walkthrough.md` §2, `patch.md` §5, `hotfix.md` legacy): `estimation log --root "<raíz del proyecto>"`. Una copia local en el proyecto es deriva. | `sdd estimation log` · Regenerates `estimation-log.md` from the walkthroughs and patches (`walkthrough.md` §2, `patch.md` §5, legacy `hotfix.md`): `estimation log --root "<project root>"`. A local copy in the project is drift. |
| sdd-templates:47 | `sdd id next` · Reserva el siguiente id (`0001`–`9999`) en modo `ids.mode: sequence`: `id next --project-root "<raíz>" --reserve [--count N]`. Cerrojo en el directorio común de git y contador compartido entre worktrees: un id reservado no vuelve a salir. Sin `--reserve` solo propone y no escribe (lo usa `sdd-explore`). En modo `tracker` sale con error. | `sdd id next` · Reserves the next id (`0001`–`9999`) in `ids.mode: sequence`: `id next --project-root "<root>" --reserve [--count N]`. Lock in git's common directory and a counter shared across worktrees: a reserved id doesn't come out again. Without `--reserve` it only proposes and doesn't write (`sdd-explore` uses it). In `tracker` mode it exits with an error. |
| sdd-templates:48 | `sdd merge` · Merge del cierre según la política `merge` de `sdd-kit.json`, con cerrojo por repo, en un worktree temporal `merge-<id>`; regenera `estimation-log.md` si choca y ejecuta `--verify` antes, en el worktree del cambio y sin el cerrojo. Con `--push` empuja la rama destino. Si falla, la deja como estaba. Receta: [merge-recipe](../sdd-archive/references/merge-recipe.md): `merge --project-root "<worktree>" [--push] [--verify "<suite>"]`. | `sdd merge` · The closing merge per the `merge` policy of `sdd-kit.json`, with a per-repo lock, in a temporary worktree `merge-<id>`; regenerates `estimation-log.md` if it clashes and runs `--verify` first, in the change's worktree and without the lock. With `--push` it pushes the target branch. If it fails, it leaves it as it was. Recipe: [merge-recipe](../sdd-archive/references/merge-recipe.md): `merge --project-root "<worktree>" [--push] [--verify "<suite>"]`. |
| sdd-templates:49 | `sdd capability check` · Valida `capabilities/` (título, secciones, propósito ≤ 300 caracteres, GIVEN/WHEN/THEN, sin marcas de delta, reglas con sus cinco entradas). Con `--artifact`, tras fusionar, comprueba que el bloque «Capacidades» de la spec o del `patch.md` nombra las capacidades de su delta y que cada `ADDED` o `MODIFIED` está en su capacidad: `capability check --path "<raíz>/.docs/sdd" [--artifact "<spec.md o patch.md>"]`. | `sdd capability check` · Validates `capabilities/` (title, sections, purpose ≤ 300 characters, GIVEN/WHEN/THEN, no delta marks, rules with their five entries). With `--artifact`, after merging, it checks that the «Capacidades» block of the spec or `patch.md` names the capabilities of its delta and that each `ADDED` or `MODIFIED` is in its capability: `capability check --path "<root>/.docs/sdd" [--artifact "<spec.md or patch.md>"]`. |
| sdd-templates:50 | `sdd capability merge` · Fusiona el delta de una spec o `patch.md` en `capabilities/` (`ADDED` añade, `MODIFIED` sustituye, `REMOVED` quita, las reglas por nombre; solo pasan los escenarios). Todo o nada: con un fallo no escribe y sale con 1: `capability merge --path "<raíz>/.docs/sdd" --artifact "<spec.md o patch.md>"`. | `sdd capability merge` · Merges the delta of a spec or `patch.md` into `capabilities/` (`ADDED` adds, `MODIFIED` replaces, `REMOVED` removes, rules by name; only the scenarios pass). All or nothing: on a failure it doesn't write and exits with 1: `capability merge --path "<root>/.docs/sdd" --artifact "<spec.md or patch.md>"`. |
| sdd-templates:51 | `sdd capability index` · El índice de `capabilities/`, al vuelo: una línea `` - `<nombre>` — <propósito> `` por capacidad, o `(sin propósito)`. Lo usan `sdd-propose`, `sdd-roadmap` y `sdd-explore` antes de elegir qué leer. Sale siempre con 0: `capability index --path "<raíz>/.docs/sdd"`. | `sdd capability index` · The index of `capabilities/`, on the fly: one line `` - `<name>` — <purpose> `` per capability, or `(sin propósito)`. Used by `sdd-propose`, `sdd-roadmap` and `sdd-explore` before choosing what to read. Always exits with 0: `capability index --path "<root>/.docs/sdd"`. |
| sdd-templates:52 | `sdd decision check` · Valida las ADR de `decisions/` (nombre, `status`, `date`, `rutas`, secciones en orden, números sin repetir); una línea por fallo y sale con 1: `decision check --path "<raíz>/.docs/sdd"`. | `sdd decision check` · Validates the ADRs of `decisions/` (name, `status`, `date`, `rutas`, sections in order, unrepeated numbers); one line per failure and exits with 1: `decision check --path "<root>/.docs/sdd"`. |
| sdd-templates:53 | `sdd decision index` · Lista las ADR; con `--files`, solo las `accepted` y `proposed` cuyas `rutas` casan con esos ficheros. Sale siempre con 0: `decision index --path "<raíz>/.docs/sdd" [--files <fichero>]…`. | `sdd decision index` · Lists the ADRs; with `--files`, only the `accepted` and `proposed` ones whose `rutas` match those files. Always exits with 0: `decision index --path "<root>/.docs/sdd" [--files <file>]…`. |
| sdd-templates:54 | `sdd roadmap check` · Valida `ROADMAP.md` (forma de `now-next-later-template.md`) o `.docs/sdd/roadmap.md` (forma de `roadmap-template.md`), y `steering/debt.md` si existe (secciones, orden, tablas, cabeceras y estados, nada saldado tras la última release cerrada). Una línea por fallo y sale con 1; sin fallos, `Roadmap válido`. Bloquea el corte de `sdd-end-release`; en los demás cierres avisa de lo heredado: `roadmap check --path "<raíz>/.docs/sdd"`. | `sdd roadmap check` · Validates `ROADMAP.md` (shape of `now-next-later-template.md`) or `.docs/sdd/roadmap.md` (shape of `roadmap-template.md`), and `steering/debt.md` if it exists (sections, order, tables, headers and states, nothing settled after the last closed release). One line per failure and exits with 1; with no failures, `Roadmap válido`. Blocks the cut of `sdd-end-release`; in other closings it warns about what was inherited: `roadmap check --path "<root>/.docs/sdd"`. |
| sdd-templates:55 | `sdd id claim` · Al arrancar, publica el id en la integración del remoto: `id claim --project-root "<raíz>"`. Si otro clon ya lo tiene, renumera y renombra la rama. | `sdd id claim` · At start, publishes the id on the remote's integration branch: `id claim --project-root "<root>"`. If another clone already has it, it renumbers and renames the branch. |
| sdd-templates:56 | `sdd roadmap publish` · Commitea en la rama de integración los ficheros de `.docs/sdd/` que se le pasan, con el cerrojo de `sdd merge`: `roadmap publish --project-root "<raíz>" --message "<mensaje>" [--into <rama>] <ficheros>`. Lo usa `sdd-roadmap`. | `sdd roadmap publish` · Commits on the integration branch the `.docs/sdd/` files passed to it, with the lock of `sdd merge`: `roadmap publish --project-root "<root>" --message "<message>" [--into <branch>] <files>`. Used by `sdd-roadmap`. |
| sdd-templates:57 | `sdd session tokens` · Mide los tokens y el coste de las sesiones de Claude Code de un worktree: `session tokens --path <worktree> --branch <rama>`. Lo usa `sdd-archive`. | `sdd session tokens` · Measures the tokens and cost of a worktree's Claude Code sessions: `session tokens --path <worktree> --branch <branch>`. Used by `sdd-archive`. |
| sdd-templates:58 | `sdd watch subagent` · Vigila el transcript de un subagente y termina cuando se cuelga o acaba: `watch subagent --description "<description del despacho>"`. | `sdd watch subagent` · Watches a subagent's transcript and ends when it hangs or finishes: `watch subagent --description "<dispatch description>"`. |
| sdd-templates:59 | `sdd watch command` · Lanza un comando en segundo plano, guarda su salida y termina con él (`TERMINADO: <comando> salió con <rc>`) o si se queda en silencio: `watch command -- <comando…>`. Para un comando que ya corre, `watch command --path <fichero de salida>`. | `sdd watch command` · Runs a command in the background, saves its output and ends with it (`TERMINADO: <comando> salió con <rc>`) or if it goes silent: `watch command -- <command…>`. For a command already running, `watch command --path <output file>`. |
| sdd-templates:60 | `sdd workspace` · Resuelve y crea el workspace de SDD de un plan: `workspace <plan>`. | `sdd workspace` · Resolves and creates the SDD workspace of a plan: `workspace <plan>`. |
| sdd-templates:61 | `sdd task start` · Abre una task Native y registra el commit base: `task start <plan> <n>`. | `sdd task start` · Opens a Native task and records the base commit: `task start <plan> <n>`. |
| sdd-templates:62 | `sdd task done` · Ejecuta la «Verificación» de una task y, si pasa, la anota en el ledger: `task done <plan> <n> <base> -- <comando…>`. | `sdd task done` · Runs a task's «Verificación» and, if it passes, notes it in the ledger: `task done <plan> <n> <base> -- <command…>`. |
| sdd-templates:63 | `sdd task brief` · Extrae el texto de una task del plan a un fichero: `task brief <plan> <n> <out>`. | `sdd task brief` · Extracts a task's text from the plan to a file: `task brief <plan> <n> <out>`. |
| sdd-templates:64 | `sdd review package` · Genera el paquete de revisión de un rango de commits: `review package <plan> <base> <head> <out>`. | `sdd review package` · Generates the review package of a commit range: `review package <plan> <base> <head> <out>`. |
| sdd-templates:65 | `sdd ledger rulings` · Lista los rulings y los minor diferidos del ledger de un plan: `ledger rulings <plan>`. Lo usan `sdd-implement` y `sdd-archive`. | `sdd ledger rulings` · Lists the rulings and deferred minors of a plan's ledger: `ledger rulings <plan>`. Used by `sdd-implement` and `sdd-archive`. |
| sdd-templates:66 | `sdd hook session-start` · Escribe el contexto de arranque de sesión; lo ejecuta `hooks/hooks.json`, no las skills. | `sdd hook session-start` · Writes the session-start context; run by `hooks/hooks.json`, not by the skills. |
| sdd-templates:68 | Reglas al usarlas: | Rules when using them: |
| sdd-templates:70 | - **Calcar la estructura** (mismas secciones, mismo orden); los bloques de ayuda en citas (`>`) se borran al redactar. | - **Trace the structure** (same sections, same order); the help blocks in quotes (`>`) are deleted when drafting. |
| sdd-templates:71 | - **Estructura 3.0.0**: `PRODUCT.md`, `ROADMAP.md` y `CHANGELOG.md` en la raíz del proyecto; en `.docs/sdd/`, `steering/` (constitution, operations, architecture, estimation), `decisions/`, `capabilities/`, `changes/` y `releases/vX.Y.Z/`. Los artefactos de feature, patch y propuesta, en `changes/<yyyyMMdd-HHmmss>-(feature\|patch\|proposal)-<id>-<slug>/`. Las carpetas de `specs/` anteriores a la 3.0.0 se leen y no se mueven (y las `-task-` anteriores a la 2.0.0 no se renombran); un proyecto aún en la 2.x sigue con sus documentos en `.docs/sdd/` y sus artefactos en `specs/`. | - **3.0.0 structure**: `PRODUCT.md`, `ROADMAP.md` and `CHANGELOG.md` at the project root; in `.docs/sdd/`, `steering/` (constitution, operations, architecture, estimation), `decisions/`, `capabilities/`, `changes/` and `releases/vX.Y.Z/`. The artifacts of a feature, patch and proposal, in `changes/<yyyyMMdd-HHmmss>-(feature\|patch\|proposal)-<id>-<slug>/`. The `specs/` folders from before 3.0.0 are read and not moved (and the `-task-` ones from before 2.0.0 aren't renamed); a project still on 2.x keeps its documents in `.docs/sdd/` and its artifacts in `specs/`. |
| sdd-templates:72 | - Las secciones marcadas *(si el módulo está activo)* se rigen por los predicados del proyecto (`estimation.md`, `changelog.md` presentes o no). | - Sections marked *(si el módulo está activo)* are governed by the project's predicates (`estimation.md`, `changelog.md` present or not). |
| sdd-templates:73 | - **Modo lite**: la spec se calca de la MISMA plantilla ligera (decisiones · Intent/Scope/Approach · delta · aprobaciones) y añade el bloque «Estimación y esfuerzo», que en modo full vive en `plan.md`. No existe ni se crea un `spec-lite-template.md`: una segunda plantilla es deriva instantánea (Art. VIII). | - **Lite mode**: the spec is traced from the SAME light template (decisions · Intent/Scope/Approach · delta · approvals) and adds the «Estimación y esfuerzo» block, which in full mode lives in `plan.md`. No `spec-lite-template.md` exists or is created: a second template is instant drift (Art. VIII). |
| sdd-templates:74 | - Al redactar el artefacto, sustituir los huecos `<proyecto>` (stack, comandos de build, artículos de constitution) por los valores reales del proyecto (`tech-stack.md`, `constitution.md`). | - When drafting the artifact, replace the `<proyecto>` gaps (stack, build commands, constitution articles) with the project's real values (`tech-stack.md`, `constitution.md`). |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo»: «si») |
