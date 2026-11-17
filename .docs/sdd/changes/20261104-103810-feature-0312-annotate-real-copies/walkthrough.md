---
id: 20261104-103810-feature-0312-annotate-real-copies
feature: 0312
title: Walkthrough — Las copias del kit, anotadas contra su fuente y subidas a su último tag
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-04
---

# Walkthrough — Las copias del kit, anotadas contra su fuente y subidas a su último tag

## 1. Cambios realizados

- **Task 1** (`32255562`): las fuentes de `sdd-tdd`, `sdd-debugging`, `sdd-worktrees` y `sdd-parallel-agents` (nueve ficheros) pasan a ser su original de superpowers con los bloques del kit marcados, tarea `0312`. La versión de la fuente sale del texto en los trece sitios que la escribían. `versionsInText` (`build/notices.ts`) lo vigila en `cli/test/kit/notices.test.ts`. La cabecera de `sdd-worktrees` pasa a su propio párrafo. El borrador de anotación de la 0302, arreglado, queda en `real-copies/annotate.mjs`, y la comparación de `dist/`, en `compare-dist.mjs`.
- **Task 2** (`57be1a76`): `sdd-verify/SKILL.md` anotada contra `verification-before-completion`, con los bloques de `requesting-code-review` en su `de:`. Los tres encargos de eje vuelven a la forma de `code-reviewer.md`, con la enmienda del 2026-11-04: la cabecera `Subagent (<tipo>, model: <modelo>):` / `description:` / `prompt: |` y las instrucciones sangradas debajo. Las tablas de Wondel llevan su `de:`. `compose-axis.mjs` lee esa forma y salta las marcas; el encargo de cada eje sale igual byte a byte.
- **Task 3** (`269a0957`): `kit:copies-update` sigue un original que la fuente renombra. `renamedPath`, en `tests/copies/update.ts`, lee `git diff --name-status -M --diff-filter=R`. La salida dice `<kit>: su original <ruta> pasa a <ruta nueva> en <tag>` y el registro guarda la ruta nueva. Los tres ficheros de `sdd-agent-writing` quedan anotados en su versión de entonces.
- **Task 4** (`ab30d921`): subida a superpowers v7.0.2 y mattpocock/skills v1.3.2. `sdd-agent-writing` sigue el reparto de `writing-skills` de la 7.0.2, fichero a fichero:
  - `skill-mechanics.md` es la copia de `SKILL.md`, con las secciones de prueba en su sitio;
  - cuatro copias nuevas: `discovery.md`, `flowcharts.md`, `bulletproofing.md` y `persuasion-principles.md`;
  - `skill-testing.md` es la copia de `testing-skills-with-subagents.md`.

  También: `notCopied` en v7.0.2, `code-review` y `teach`/`wait-what` en v1.3.2, la procedencia de la batería de `sdd-agent-writing` y el humo p1 y b1.
- **Pasada de fix**, juntada en el cierre: los hallazgos de la revisión final (§4.3) y el Important que abrió la re-revisión.

Salida de `moon run kit:copies-update -- superpowers v7.0.2` (Task 4):

```
skills/sdd-tdd/SKILL.md, references/writing-good-tests.md, sdd-debugging (4 ficheros y el .ts), sdd-worktrees, sdd-parallel-agents, sdd-verify (4 ficheros): v7.0.0 → v7.0.2, 0 conflictos
skills/sdd-agent-writing/references/skill-mechanics.md: v7.0.0 → v7.0.2, 3 conflictos
skills/sdd-agent-writing/references/skill-testing.md: su original skills/writing-skills/testing-skills-with-subagents.md pasa a skills/writing-skills/references/testing-skills-with-subagents.md en v7.0.2
skills/sdd-agent-writing/references/skill-testing.md: v7.0.0 → v7.0.2, 2 conflictos
```

`moon run kit:copies-update -- mattpocock/skills v1.3.2`: `skills/sdd-agent-writing/SKILL.md: v1.3.1 → v1.3.2, 0 conflictos`.

Lo que cambia en `writing-skills/SKILL.md` de la 7.0.2, aparte de lo que se mueve (decisión 12), y lo que hace el kit con cada cosa:
- «## Writing SKILL.md», «## Flowcharts» y «## Bulletproofing Against Rationalization» entran como punteros a `discovery.md`, `flowcharts.md` y `bulletproofing.md`. En el de `flowcharts.md` hay un `sustituye` que quita «the graphviz conventions, and how to render one».
- La fila «Skips/violates…» de «Match the Form to the Failure» entra con «(see bulletproofing.md)».
- «**Testing methodology:**» entra con su lista y el enlace a `skill-testing.md`.
- «**Official guidance:** … references/anthropic-best-practices.md» sigue sustituida por la frase del kit, «Official authoring guidance: Anthropic's skill authoring best practices.».

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 1,59 h — reloj de la sesión 5,32 h desde 2026-11-04T10:29Z, sin 224 min de espera al dev-lead (8 esperas)
- Desviación: −2,41 h (−60 %)
- Causa de la desviación: Esperas y huecos: 10:42Z 2 min; 10:52Z 29 min; 11:42Z 60 min; 12:42Z 1 min; 12:44Z 2 min; 12:46Z 2 min; 12:48Z 8 min; 12:57Z 119 min. La espera de 119 min incluye la parada del freno de alcance de la Task 2 y su explicación; sin ella, la ejecución de las cuatro tasks fue mecánica con el borrador.
- Compactación: sí, en la Task 2 → Native desde la Task 2 (sin la línea «Ruling: compactación» en el ledger; con tres tasks por hacer, la regla de sdd-implement pedía seguir en SDD)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 131.503.500 — claude-opus-5-5 131.503.500
- Tokens de subagentes: 15.842.039 en 5 despachos — Revisor dominio spec 0312 claude-opus-5-5 139.565 / 1 min; Re-review final fix 0312 claude-opus-5-5 2.374.886 / 4 min; Revisor técnico spec 0312 claude-sonnet-5-5 603.897 / 1 min; Final review — Code axis claude-sonnet-5-5 3.300.746 / 3 min; Final review — Spec axis claude-opus-5-5 9.422.945 / 8 min
- Coste de la sesión: 48,90 $ (hilo 41,25 $ + subagentes 7,65 $)
- Coste de sujetos: 0,47 $ en 2 sujetos sonnet — humo GREEN p1 y b1 0,47 $
- Review de spec: 2 revisores · hallazgos 19, aceptados 19

## 3. Desviaciones del plan

- **Los tres encargos de eje cambian de forma** (enmienda del 2026-11-04 en `spec.md`). El plan esperaba que `dist/` solo cambiara la palabra de la versión, pero anotar las líneas exactas de `code-reviewer.md` volvía a sangrar entre 72 y 79 líneas. El dev-lead eligió la forma del original. Los encargos de spec y de arquitectura iban a pasar a propios, pero el de arquitectura copia literal la tabla de Clean Architecture de Wondel, y un `own` no genera `NOTICE`. Por eso los tres siguen como copias, con la misma forma.
- **El reparto de la Task 4 no resuelve los conflictos en el fichero fusionado.** Rehace los seis ficheros: lo que tiene hoy el kit, más lo nuevo de la 7.0.2 por `git merge-file` sección a sección (`real-copies/build-split.mjs` y `fix-split.mjs`), anotados contra su original v7.0.2. El resultado es el de la regla de la decisión 12.
- **Dos tests existentes de `copies.slow.test.ts` cambian de dato**, y uno de nombre. Simulaban el movimiento de un original con un fichero idéntico en otra ruta, y eso es ahora un renombrado que se sigue. Pasan a un original que desaparece.
- **`skills.test.ts` cuenta como enlazada una reference alcanzable desde `SKILL.md`**, también por su nombre desde otra reference. Es como la fuente apunta a `persuasion-principles.md` («See persuasion-principles.md in this directory»).
- El humo corrió con n = 1, como dice la decisión 11, sobre una copia temporal de la batería, porque la tabla lleva n = 2.

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: el patrón de versionsInText lleva también una comilla invertida opcional delante — el trozo que cita el aviso es «`wondelai/skills` 1.8.0», como el literal de la spec; el patrón de la spec solo nombraba la de detrás — si es incorrecto: el aviso cita un carácter de más
- Task 1: Ruling: cli/test/kit/skills.test.ts («skills de superpowers citadas») contaba las citas «superpowers:<skill>» de las marcas sustituye como skills que el kit invoca; ahora salta las líneas de marca, porque la marca no viaja — la tabla «Lo que se retira» de la spec no lo nombraba (tercer caso de los tickets 0300 §1 y 0302 §2) — si es incorrecto: el README tendría que listar skills que ningún agente lee
- Task 1: Ruling: el borrador de la 0302 juntaba el contenido de cada bloque en una línea y partía mal las vallas; annotate.mjs conserva los separadores del kit, pega un añadido al párrafo anterior cuando el kit lo pega, y parte en un bloque por párrafo porque kit:copies cierra un bloque en la primera línea en blanco aunque lleve fin (decisión 2 de la 0302 decía que un bloque de varios párrafos se cierra con fin) — si es incorrecto: más marcas de las necesarias en un bloque de varios párrafos
- Task 2: Ruling: la base (develop 6b109691) cambia una fila de deuda del roadmap que menciona la 0312, no la fila de la 0312 ni ningún fichero de la task — sigo sin freno — si es incorrecto: una fila de deuda reescrita que esta feature no lee
- Task 2: Ruling: dev-lead (2026-11-04, «sí, adelante así») — el encargo de código vuelve a la forma de code-reviewer.md (Subagent/description/prompt: | con sangría); los de spec y arquitectura iban a propios, pero el de arquitectura copia literal la tabla de clean-architecture de Wondel y un propio no genera NOTICE: llevan la misma forma y siguen como copias (62 % y 57 %, sin rojos), Scope de 16 copias intacto; enmienda en spec.md
- Task 2: Ruling: el Expected de compare-dist («solo la palabra de la versión») no vale para los tres encargos: cambian la frase de despacho y la cabecera del recuadro; compose-axis.mjs compone cada eje igual byte a byte que en 32255562 (spec f3, code f4, architecture f4)
- Task 2: Ruling: annotate.mjs no cerraba con fin un bloque dentro de un recuadro, donde la línea en blanco no cierra, y el bloque se comía las líneas del original siguientes sin que kit:copies lo viera; arreglado (fin, y la línea en blanco del original queda como texto) y corregido el caso de la Task 1 en skills/sdd-worktrees/SKILL.md:121 — hallazgo para el ticket: kit:copies no detecta líneas del original dentro de un bloque añadido
- Task 2: Ruling: compose-axis.mjs leía skills/ con las marcas dentro del recuadro y con la forma text de antes: ahora salta las marcas y lee prompt: | con dedent 4, como legacyBrief
- Task 3: Ruling: el RED «treats a rewrite below git's rename threshold as missing» pasa antes del cambio (hoy toda ruta que falta da «no existe»): queda como guarda de regresión del umbral; el RED del renombrado falló como se esperaba
- Task 3: Ruling: los RED no cambian; cambian dos tests existentes («skips a copy whose original moved» y «leaves the from of a skipped copy»), que simulaban el movimiento con un fichero idéntico en otra ruta, y eso ahora es un renombrado que se sigue (decisión 7): su fichero nuevo pasa a UNRELATED y el primero se llama «skips a copy whose original is gone»
- Task 3: Ruling: annotate.mjs — tres arreglos sin cambiar la salida de las Tasks 1 y 2: la línea en blanco tras el frontmatter cuando el kit abre con un bloque; inFence contaba mal un recuadro dentro de un párrafo de bloque (fin huérfano y bloque que se come líneas en skill-testing.md); lo quitado entre dos líneas en blanco deja una sola, y al final, ninguna
- Task 3: Ruling: skill-mechanics.md:86 quita una de las dos líneas en blanco que el original tiene bajo «## Directory Structure», para que dist/ salga igual byte a byte; dist/ de los tres ficheros de sdd-agent-writing, igual byte a byte que en 57be1a76, y solo cambian su NOTICE y THIRD_PARTY_NOTICES (persuasion-principles.md en el from)
- Task 3: Ruling: develop (c69f5e6d y mensajes del 2026-11-04) — los fallos del Reader de kit:copies (fin tras línea en blanco; líneas del original dentro de un bloque en un recuadro) y el NOTICE de un own con texto literal no se tocan en esta rama: fila propuesta tras la 0312
- Task 4: Ruling: la base (origin/develop) cambia filas 0296, 0306, 0307 y una de deuda del roadmap, y la propuesta 0301 (enmienda de las references en castellano); ni la fila de la 0312 ni ningún fichero de la task — sigo sin freno
- Task 4: Ruling: kit:copies-update superpowers v7.0.2 — 13 copias con 0 conflictos y sin cambio de texto; skill-testing.md sigue el renombrado («pasa a skills/writing-skills/references/testing-skills-with-subagents.md en v7.0.2»); skill-mechanics.md 3 conflictos y skill-testing.md 2. mattpocock/skills v1.3.2: SKILL.md 0 conflictos, sin cambio de texto
- Task 4: Ruling: los conflictos de skill-mechanics.md y skill-testing.md no se resuelven en el fusionado: el reparto de la decisión 8 rehace los seis ficheros desde el kit de 269a0957, con lo nuevo de la 7.0.2 por git merge-file sección a sección (base 7.0.0) y anotados contra su original de v7.0.2 (build-split.mjs y fix-split.mjs del scratchpad); el resultado es el mismo que resolver cada conflicto con la decisión 12 y deja el reparto en un paso
- Task 4: Ruling: conflictos por la decisión 12 — flowcharts: el kit (siguen quitados graphviz-conventions.dot, los comandos y la línea nueva de render-graphs.js); bulletproofing «Psychology note» y skill-testing «Why this works»: la 7.0.2 (su puntero a persuasion-principles.md vale); skill-testing «REQUIRED BACKGROUND … superpowers:test-driven-development» y «Complete worked example»: el kit, que hoy los quita; «Part of superpowers:writing-skills» → «Part of sdd-agent-writing», la sustitución de siempre
- Task 4: Ruling: los títulos que el kit bajó un nivel al meter testing-skills-with-subagents.md y persuasion-principles.md en secciones de skill-testing.md vuelven al nivel de la fuente, con su título original; las dos frases del Overview que el kit juntaba en un párrafo vuelven a su párrafo
- Task 4: Ruling: conserva — skill-mechanics 90 %, discovery 98 %, flowcharts 67 %, bulletproofing 96 %, persuasion-principles 100 %, skill-testing 96 %; ningún párrafo del kit de hoy se pierde salvo los que la spec cambia (punteros a «Persuasion principles» y «Testing with subagents», el «in skill-mechanics.md» de la lista y el título de skill-testing.md)
- Task 4: Ruling: cli/test/kit/skills.test.ts «enlaza todos sus references/ desde SKILL.md» daba rojo con las cuatro copias nuevas, a las que se llega por los punteros de skill-mechanics.md como en la fuente: el test cuenta ahora las references alcanzables desde SKILL.md, por enlace o por nombre («See persuasion-principles.md in this directory»); un fichero que nada nombra sigue en rojo. Se descarta alargar SKILL.md con cuatro enlaces
- Task 4: Ruling: el humo corre con n = 1 de la decisión 11 sobre una copia de la batería (.temp/b0312, n y umbral 1/1 en p1 y b1), porque la tabla lleva n = 2; KIT_DIR es una copia de dist/ en .temp/k0312, como manda tech-stack.md para un GREEN sin commitear
- Task 4: Ruling: humo GREEN p1 1/1 (R1: deja escrito scenario.md y no da la skill por hecha; R2: description solo de cuándo usarla) y b1 1/1 (R6: tanda de REFACTOR y partida de controles y pasada de fix), puerta verde, 2 sujetos, 0,47 $; las escrituras de p1 en .claude/skills/ las denegó el permiso del harness y el sujeto lo dijo — hallazgo para el ticket; la copia temporal tests/batteries/aw0312 se borró
- Final: Ruling: el paquete de la receta excluye además dist/** — es la salida generada de kit:build y kit:notices, que el pre-commit compara con skills/; con dist/ el paquete dobla su tamaño sin texto nuevo que revisar — si es incorrecto: un fallo del build que solo se vería en dist/, cubierto por el pre-commit
- Final: Ruling: Spec Important 1 (humo p1 sin evidencia de R2) — la description sí está en el transcript del sujeto: green/out/p1-1.writes.md la saca del input de cada Write («Use when a SQL migration in db/migrations/ is created or changed, or when one is about to be applied, merged or reported as done.»), solo condiciones de disparo, R2 pasa; que el sujeto no abriera discovery.md es lo que diseña la 7.0.2: la regla corta de la description vive en «## Writing SKILL.md» de skill-mechanics.md y el detalle tras el puntero — sin relanzar p1 — si es incorrecto: un R2 que solo se ve abriendo discovery.md, que mediría el humo de la 0306 o el corte
- Final: Ruling: Spec Minor 4 (dos tests que la tabla «Lo que se retira» daba por iguales cambian) — Ruling de la Task 3: un fichero idéntico en otra ruta es ahora un renombrado que se sigue; los tests siguen probando «no existe… mapéalo» con un original que desaparece, con la misma aserción — al walkthrough — si es incorrecto: ninguno, la conducta probada es la misma
- Final: Ruling: Spec Minor 5 y Código Minor 5 (la regla «enlaza todos sus references/» se relaja: vale el nombre suelto en otra reference) — es el único modo de la fuente («See persuasion-principles.md in this directory»), el nombre tiene que ser un fichero que existe en references/, y uno que nada nombra sigue en rojo — al walkthrough — si es incorrecto: un huérfano con el mismo nombre que un ejemplo citado, que nadie usa hoy
- Final: Ruling: Código Minor 3 (renamedPath exportada sin uso fuera) — es la interfaz que «Produce» el plan de la Task 3; los tests la cubren por la CLI — si es incorrecto: un export de más
- Final: Ruling: Código Minor 6 (el filtro de NOTICE de versionsInText sin llamador que lo pase; una versión por línea) — la regla de la spec excluye NOTICE y el test lo prueba con migrations/; una línea con dos versiones da un aviso, y la segunda sale al quitar la primera — si es incorrecto: una pasada más
- Final: Ruling: Código Minor 9 (los dos avisos de sdd-tdd) — llevan arregla 0307, como dice la decisión 5
- Final: Re-revisión ab30d921..la pasada de fix (sdd-kit:effort-high + opus): los 10 hallazgos ADDRESSED; 1 Important nuevo de la pasada (comentarios de real-copies/ que citaban la spec y la 0302) — arreglado en el hilo en el commit de cierre, solo comentarios, 6 líneas
- Final: Ruling: re-revisión Minor (build-split.mjs: una expresión de ~300 caracteres con tres replace) — guion de un solo uso, evidencia congelada con la spec — si es incorrecto: cuesta leerlo al repetir el reparto
- Final: Ruling: re-revisión fuera de alcance (plan.md:149 con el patrón sin la comilla de delante) — el plan es registro de lo planeado; la Ruling de la Task 1 y la spec corregida llevan el patrón real — si es incorrecto: ninguno, el código y la capacidad mandan

## 4. Verificación

### 4.1 Builds

- `moon run kit:copies` (tras la pasada de fix):
  ```
  skills/sdd-tdd/SKILL.md:122: añadido del kit sin sustituye en un párrafo con una absoluta del original («never») → 0307
  skills/sdd-tdd/SKILL.md:319: añadido del kit sin sustituye en un párrafo con una absoluta del original («every») → 0307
  skills/sdd-implement/: sin anotar → 0296
  skills/sdd-archive/: sin anotar → 0305
  skills/sdd-propose/references/spec-writing.md, skills/sdd-propose/references/plan-writing.md: sin anotar → 0306
  skills/sdd-verify/references/: sin anotar → 0297
  ```
- `moon run kit:upstream` (Task 4) solo da rojo en las entradas de 0296 (`sdd-implement/`), 0306 (`spec-writing.md`, `plan-writing.md`), 0314 (`sdd-grilling`, superpowers y mattpocock), 0313 (`cli/src/tasks/`) y 0297 (OpenSpec v1.14.1 → v1.16.0).
- `pnpm exec vitest run test/kit/copies.slow.test.ts --test-timeout 120000` → 19 passed (19), sobre la pasada de fix, juntada en el cierre.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 399/399 · cli:typecheck: corrió · cli:test: corrió 2158/2158 (12 skipped) · ~2 min · configuración: la del gate · sobre ab30d921; tras la pasada de fix, `moon run cli:typecheck cli:test` → 2158 passed sobre la pasada de fix, juntada en el cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-04 · `kit:copies` solo con rojos de fila; `kit:upstream` solo con 0296, 0297, 0306, 0313 y 0314; suite 2158/2158 y `kit:test-headless` 399/399; humo GREEN p1 1/1 y b1 1/1 (Sonnet, 0,47 $); revisión final Spec y Código sobre `ab30d921`, pasada de fix juntada en el cierre, re-revisión opus+high: los 10 hallazgos resueltos y 1 Important nuevo (comentarios que citaban la spec), arreglado en el hilo en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| ADDED: `skills/sdd-tdd/SKILL.md:10` con «… of superpowers 7.0.0» → `cli:test` falla con `…: la versión de una fuente vive en upstream.json, no en el texto: «superpowers 7.0.0»` | suite (`every skill text is free of source versions`, caso `skills/a`) | pasa |
| ADDED AND: «`wondelai/skills` 1.8.0» falla igual | suite (caso `skills/b`) | pasa |
| ADDED AND: `migrations/`, `NOTICE` y marcas no cuentan | suite (casos `skills/c` y `migrations/v2.0.0.md`) | pasa |
| MODIFIED THEN y sus AND (fusión, conflictos B4/B5, conflicto sin resolver, `merge-file` que falla, `pending`) | suite (tests de la 0302 en `copies.test.ts` y `copies.slow.test.ts`, en verde) | pasa |
| MODIFIED AND: el original renombrado se sigue, con «pasa a …» | suite (`follows an original that the source renames`) y ejecución real (`kit:copies-update -- superpowers v7.0.2`: «skill-testing.md: su original … pasa a skills/writing-skills/references/testing-skills-with-subagents.md en v7.0.2») | pasa |
| MODIFIED AND: sin renombrar, «no existe… mapéalo» y `version` igual | suite (`treats a rewrite below git's rename threshold as missing`, `skips a copy whose original is gone`) | pasa |
| Intent: `kit:copies` sobre las seis copias, cada rojo con su fila | ejecución real (§4.1) | pasa |
| Intent: `upstream.json` en v7.0.2 para las copias de superpowers | ejecución real (`kit:copies-update` y `upstream.json`) | pasa |
| Intent: `kit:upstream` solo rojo en 0296, 0297, 0305, 0306, 0313, 0314 | ejecución real (§4.1) | pasa |
| Lo que lee el agente en `sdd-agent-writing` | humo p1 y b1, n = 1, Sonnet: R1, R2 (con `green/out/p1-1.writes.md`) y R6 | pasa |

### 4.3 Residuales / deuda generada

- Hallazgos de la revisión final adjudicados, en «Decisiones tomadas sin el dev-lead».
- **Revisión final**: Spec opus+high y Código sonnet+high, con arreglos, sobre `ab30d921`: 1 Important y 6 Minor del eje Spec, 9 Minor del de Código. Entraron 10 en la pasada de fix (`review.minors: fix`); los demás llevan su ruling.
- Develop tría aparte, sin tocarlos en esta rama (mensajes del 2026-11-04, fila propuesta tras la 0312):
  - el Reader de `kit:copies` cierra un bloque en la primera línea en blanco aunque lleve `fin`;
  - dentro de un recuadro, un bloque añadido se come líneas del original sin que nadie avise;
  - un `own` no genera `NOTICE` aunque lleve texto literal de terceros.
- **sin revisar**: el commit posterior al cierre que hace que `cli/test/kit/worktrees-setup.slow.test.ts` lea el bloque bash de `dist/skills/sdd-worktrees/SKILL.md`, que es lo que carga el agente. Leyendo `skills/` se llevaba también las marcas de la fuente anotada, y bash daba «syntax error near unexpected token newline» en el CI de la rama (`cli:test-min`, run 41861969567). En local, `moon run cli:test-min` → 2665 passed (2677), 129/129 ficheros.
- Las references que siguen en castellano van a la fila que reescribe su skill (develop, `c69f5e6d`).

## 5. Aprendizajes

- Anotar una copia con las líneas exactas del original saca a la luz los cambios de forma que el kit hizo sin registrar. Aquí fueron la cabecera y la sangría de `code-reviewer.md`, y en `sdd-tdd`, frases juntadas en un párrafo. Antes de dar por buena una anotación, se comparan `dist/` byte a byte y la sangría, no solo párrafo a párrafo. Va a las features que anotan las copias que quedan (0296, 0297, 0305, 0306): `real-copies/` de esta spec trae el borrador y las comparaciones, y el ticket lo nombra.

Retro: error que cazaría un chequeo → ticket del kit: `kit:copies` (0302) no ve las líneas del original que se come un bloque añadido dentro de un recuadro, y su Reader cierra en la línea en blanco aunque el bloque lleve `fin` (decisión 2 de la 0302); develop propone una fila tras la 0312
Retro: error que cazaría un chequeo → ticket del kit: `compare-dist.mjs` y la comparación de la 0302 normalizan espacios, y no vieron ni los bloques juntados en una línea ni la sangría de los encargos de eje; aquí lo cazó una comparación byte a byte hecha a mano
Retro: corrección repetida → ticket del kit: la rúbrica de `review-spec.md` dio «ninguna» y el dev-lead tuvo que pedir la revisión adversarial; segundo caso, fila 0306
Retro: documento o skill desmentido → ticket del kit: `sdd-implement` pide pasar a SDD tras una compactación con dos o más tasks por hacer, y dejar la línea «Ruling: compactación»; la sesión siguió en Native y sin la línea
Retro: documento o skill desmentido → ticket del kit: el lanzador de baterías no admite una batería copiada fuera de `tests/batteries/` (subject.mjs importa por ruta relativa), no lee `SUBJECT_CAP` de la Previsión de esta spec, y el harness niega a los sujetos escribir en `.claude/skills/`, cuyo `tools.txt` no guarda el contenido de cada `Write`

## 6. Adendas
