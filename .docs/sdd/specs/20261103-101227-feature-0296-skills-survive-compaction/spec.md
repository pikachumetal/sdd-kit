---
id: 20261103-101227-feature-0296-skills-survive-compaction
feature: 0296
proposal: 0301
title: sdd-implement partida en una puerta propia y dos copias de superpowers
mode: full
status: approved
created: 2026-11-05
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-05
---

# Spec — sdd-implement partida en una puerta propia y dos copias de superpowers

🦆 Hoy, cuando una sesión larga se compacta en mitad de la implementación, Claude Code vuelve a adjuntar `sdd-implement` cortada a 20.000 caracteres de sus 61.636, y lo que había detrás —el bucle de arreglos, los frenos, el cierre— se pierde el resto de la sesión: en cinco sesiones reales pasó así. Con esta feature, la implementación pasa a tres skills que caben enteras: la puerta, con lo que solo hace el kit (los frenos y los desvíos, los tests de la spec antes de cada task, los borradores del cierre), y dos copias casi literales de superpowers v7.0.2, una por método. Lo que el agente hace no cambia salvo en una cosa: la parada sobre un fichero copiado abre con el commit del kit que lo cambió y su asunto. Un freno que fija la propia spec ya paraba con la puerta nueva, así que su frase no se escribe.

Validación: en campo (`validation.mode: field` en `sdd-kit.json`) — el cierre registra como «Validación en campo» la verificación del agente (las cuatro comprobaciones de «Hecho cuando», `cli:test` y los sujetos), y el uso real en los proyectos la hace con los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `feature-flow` — `sdd-implement` invoca la copia del método del plan, que crea y anuncia el workspace; las copias son skills de flujo; tras compactar, las skills de la implementación vuelven enteras.
- Modificadas: `control-profiles` — la parada sobre una copia abre con el commit del kit que la cambió; tras compactar en Native, el cambio a SDD invoca `sdd-implement-subagent`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos, Opus — señales: MODIFIED (dos requisitos, uno de feature-flow y otro de control-profiles), área no explorada (las tripas de tests/copies/ y de tests/own/, que solo he leído por su capacidad) · tamaño: ~2.500 líneas movidas en 18 ficheros, casi todas sin cambiar de texto
- Dominio: que la tabla del anexo dé destino a cada una de las 139 unidades y que ninguna regla del kit quede en dos skills ni en ninguna; que el freno nuevo no choque con los cuatro de control-profiles.md (señal: MODIFIED)
- Técnica: que kit:copies, kit:own y kit:upstream acepten la forma que dice el Approach (copias con la ruta de la fuente, Finish en las dos copias, la puerta como own sin líneas literales de superpowers) (señal: área no explorada)
- Mínimo razonable: ninguna, como dice la rúbrica con 2 señales — deja sin mirar la tabla del anexo, que es donde una regla se pierde sin que ningún test lo vea
```

La rúbrica da «ninguna» con 2 señales; lo despacho igual, un solo revisor y por eso sin paralelo, porque es el remedio de la fila de deuda «La rúbrica de review de spec da «ninguna» con hasta 3 señales», con seis casos donde la revisión que se saltó encontró Críticos.

`sdd capability merge` sobre una copia de `capabilities/` en el scratchpad, sin rechazos: `feature-flow.md` sustituye «La implementación la lleva `sdd-implement`», «El workspace del plan se anuncia», «Ninguna skill intermedia entre propose e implement» y «El worktree de la implementación lo prepara `sdd-worktrees`», y añade «Tras compactar, las skills de la implementación vuelven enteras»; `control-profiles.md` sustituye «Tras una compactación, lo que queda de un plan Native va con SDD» y la regla «Avisos», y añade «La parada sobre una copia abre con el commit del kit que la cambió».

### Hallazgos de la review

Un revisor, `opus` + `sdd-kit:effort-medium`, 10 hallazgos; los 10 aceptados tras comprobarlos en los ficheros.

1. **Aceptado** (Crítico) — «Ninguna skill intermedia entre propose e implement» (`feature-flow.md:729`) dice que las únicas skills de flujo son `sdd-implement`, `sdd-verify` y `sdd-archive` → MODIFIED en el delta, con las dos copias.
2. **Aceptado** (Crítico) — `control-profiles.md` §Frenos de alcance es una lista cerrada («Cuatro situaciones»), y §Desvío no cubre un freno de ✋: la puerta diría una quinta clase que la referencia contradice → su frase de apertura entra en el Scope (decisión 10), con el ADDED reescrito como freno de alcance.
3. **Aceptado** (Crítico) — tras compactar cuenta también el tope de 25.000 tokens de todas las skills, de la más reciente a la más antigua, y la puerta es la más antigua de las que implementan → el ADDED de tamaño añade la suma de la puerta, la copia y lo que la copia invoca (decisión 17).
4. **Aceptado** — la lista cerrada de paradas de las copias no nombraba la parada de `pair` tras cada task → decisión 7.
5. **Aceptado** — el escenario de la parada sobre una copia era un freno, y la frase sustituida era la del desvío; y no decía qué texto busca `git log -S` → decisión 11 y el ADDED: la frase va donde paran los dos, y el texto es la S de la marca.
6. **Aceptado** — el anuncio del workspace no puede ir en la puerta antes de que la copia lo cree → pasa al Setup de las copias (anexo, unidad 3) con MODIFIED de «El workspace del plan se anuncia».
7. **Aceptado** — los títulos de `commit-milestones.md` se citan en prosa fuera de `cli/` y `tests/` (`control-profiles.md:80`, `tests/batteries/sdd-propose/battery.md:161`, «El hash en los artefactos») → decisión 12 y «Lo que se retira o cambia de forma».
8. **Aceptado** — la excepción de la re-revisión final no se copia, y eso no estaba en ✋ → decisión 18.
9. **Aceptado** — un bloque del kit de una copia que repite 10 palabras de la puerta da rojo en `kit:own` → decisión 6: el Finish y la revisión final viven solo en las copias, y la puerta no los repite.
10. **Aceptado** — los dos ADDED que dependen del RED no lo decían, y el Intent callaba lo que trae v7.0.2 → los dos ADDED llevan su condición y su salida, y la decisión 8 dice por qué ningún cambio de v7.0.2 toca un requisito.

Segunda ronda, a petición del dev-lead («dos revisores en paralelo, dominio en Opus y técnica en Sonnet»): dominio `opus` y técnica `sonnet`, los dos con `sdd-kit:effort-medium`, 20 hallazgos; 17 aceptados, 2 en parte y 1 rechazado, comprobados en los ficheros.

Dominio:

1. **Rechazado** (Crítico) — «a cap you would have asked to exceed» queda literal en `-native` → no está en `executing-plans` v7.0.2 (`git show v7.0.2:skills/executing-plans/SKILL.md`: 0 apariciones); solo la tiene `subagent-driven-development`. La decisión 7 dice ahora que es la única fuente que la tiene.
2. **Aceptado en parte** — «Reproduce before fixing» y la prohibición de `fable`/`opus xhigh` se perderían en Native → en Native no hay rondas por task, y la pasada de fix de la revisión final ya reproduce cada hallazgo en `sdd-verify:298`; el único despacho de Native son los ejes, con modelos fijos en `sdd-verify`. Se quedan en `-subagent`, y la decisión 21 lo dice.
3. **Aceptado en parte** — «El worktree de la implementación lo prepara `sdd-worktrees`» nombra a `sdd-implement` → MODIFIED con la copia del método. «Una task Native se registra en el ledger de `sdd-implement`» y la línea de `feature-flow.md:608` siguen ciertas: nombran el ledger y la ejecución de la implementación, que sigue empezando por `sdd-implement`, y su título es la clave de fusión.
4. **Aceptado** — la suma de la decisión 17 redefinía en `feature-flow` un límite de `kit-distribution` y prometía una salida que `kit:skill-size` no da → sale del delta y queda como medida del walkthrough.
5. **Aceptado** — reescribir solo el principio de `control-profiles.md:85` dejaba la frase y la fila de `:54` contradiciéndose, y en `unattended` lo conservador ante «paro» es aparcar → decisión 10 con la frase entera y la fila, y el ADDED aparca en `unattended`.
6. **Aceptado** — los literales nuevos y el conflicto entre un tope de la spec y uno del plan no estaban en «Reglas de la capacidad» → «Avisos» y «Regla ante conflicto» de `control-profiles`, con su valor entero.
7. **Aceptado** — la salida de la decisión 5 llevaba el Finish a la puerta, contra la decisión 6 → a `-subagent/SKILL.md` como bloque `de:`.
8. **Aceptado** — la fila 18 del anexo decía «fuente» para el pre-flight de Native, que es del kit → fila 18.
9. **Aceptado** — el Intent prometía `kit:copies-update` sin comprobación, y el Scope no listaba los escenarios nuevos de la batería → Intent y un `Entra:`.
10. **Aceptado** — el ejemplo del ADDED usaba un fichero y un commit reales que otra fila puede cambiar → `skills/sdd-x/references/foo-prompt.md` y `a1b2c3d` (feature 0042).

Técnica:

1. **Aceptado** — «ningún fichero de `skills/` invoca `superpowers:…`» no se cumple con las citas de las marcas → acotado al texto sin marcas, y «Dónde se prueba» nombra `skills.test.ts`.
2. **Aceptado** — los MODIFIED del workspace y de la compactación no tenían prueba → `h1` y `h2` para el anuncio; la compactación, por lectura, porque la batería no la simula.
3. **Aceptado** — las fases de las copias podían dar `FALLA` y solo se exigía la de la puerta → «Dónde se prueba» y el ADDED piden las tres (previsto ~60.000, ~80.000 y ~69.000).
4. **Aceptado** — los bloques del kit de «fuente con lo del kit» caen en párrafos con absolutas → decisión 6: todo bloque no `sustituye` en su propio párrafo, o sustituye la absoluta.
5. **Aceptado** — Native leía el decálogo de otra skill sin decir cómo → decisión 3: enlace relativo, como los de `sdd-propose`, que `skills.test.ts` comprueba.
6. **Aceptado** — los tres prompts podían no llegar al 50 % → medidos: 83 %, 86 % y 81 % (decisión 3).
7. **Aceptado** — `git log -S` sobre la cita da el commit que escribió la marca, que en las copias nuevas sería la 0296 → decisión 11: las marcas llevan el commit de origen de `provenance.md`, y `git log -S` queda para una marca con tarea.
8. **Aceptado** — la frase de `plan-template.md:30` no estaba en ✋ → decisión 19.
9. **Aceptado** — faltaba buscar lectores no markdown de las rutas y títulos que se mueven → `git grep` de `implementer-prompt`, `task-reviewer-prompt`, `re-review-prompt`, `Quality decalogue`, `Native loop` y `SDD loop` en `cli/src`, `hooks`, `agents`, `.claude`, `build` y `tests/{copies,own,skill-size}`: ninguno.
10. **Aceptado** — el `NOTICE` de la puerta fallaría al pasar a propia → decisión 20 y una fila en «Lo que se retira».

1. **Carpeta**: la spec va en la carpeta de la 0296 que ya existe (`20261103-101227-feature-0296-skills-survive-compaction/`), con la medida, la auditoría y la procedencia, y no en una nueva — un id, una carpeta; la rama nueva se llama distinto (`implement-gate-and-copies`), y ninguna herramienta busca la carpeta por el slug de la rama.
2. **Forma de las copias**: cada fichero copiado conserva la ruta que tiene en su fuente dentro de la skill: `sdd-implement-subagent/implementer-prompt.md`, `task-reviewer-prompt.md` y `re-review-prompt.md` en la raíz de la skill y los siete `references/*.md` en `references/` — así los enlaces del original («[implementer-prompt.md](implementer-prompt.md)», «references/fix-loop.md») siguen valiendo sin marca, y `kit:copies-update` fusiona fichero contra fichero.
3. **Los tres prompts salen de `sdd-implement/references/`** y pasan a `sdd-implement-subagent/`, como copias anotadas de los de v7.0.2: el texto del kit que llevan hoy, en bloques marcados. Medido con `scripts/kept.mjs` sobre los de hoy, conservan el 83 % (`implementer-prompt.md`), el 86 % (`task-reviewer-prompt.md`) y el 81 % (`re-review-prompt.md`) de su original v7.0.2, por encima del 50 % de `kit:copies`. Native lee el `## Quality decalogue` con un enlace relativo de `-native` a `../sdd-implement-subagent/implementer-prompt.md`: el kit ya enlaza entre skills así (`sdd-propose` → `../sdd-implement/references/`), y `skills.test.ts` comprueba que el enlace resuelve en `dist/`. `-native` depende así de `-subagent`, que viaja siempre con ella en el plugin.
4. **Los `scripts/` de las dos fuentes** (`task-start`, `task-done`, `review-package`, `sdd-repo`, `sdd-workspace`, `task-brief`) van en `notCopied`: los porta la CLI `sdd`, y su actualización a v7.0.2 es de la 0313.
5. **`references/final-review.md` se copia**: su «Finish» es texto de la fuente que el kit conserva, y lo de la revisión que contradice al kit (despachar `code-reviewer.md` en el modelo más capaz) se sustituye por la invocación de `sdd-verify`. Si `kit:copies` dice que conserva menos del 50 %, pasa a `notCopied` y su «Finish» va a `-subagent/SKILL.md` como bloque `de: superpowers skills/subagent-driven-development/references/final-review.md`, nunca a la puerta: lo decide la task con esa salida, como ruling.
6. **Dónde vive cada regla compartida por los dos métodos**: donde la fuente la tiene en las dos (el «Finish», el ledger, «Rulings, not stalls», «Four things stop you»), en las dos copias, con el mismo bloque del kit si el kit la cambia — `kit:own` no da rojo por un bloque repetido entre dos copias; donde solo es del kit (base, tests RED del hilo, frenos, desvíos, recuperación, vigía, borradores del cierre, red flags), una vez, en la puerta. La revisión final (`sdd-verify`) y el Finish viven solo en las copias, y la puerta no los repite: `kit:own` da rojo si un bloque de una copia repite 10 palabras seguidas de la puerta. Las copias remiten a la puerta en el paso donde aplica, nombrando la sección («`sdd-implement`, Before each task»). Todo bloque del kit de una copia que no es `sustituye` va en su propio párrafo; si el párrafo del original donde iría lleva una absoluta («only», «never», «always», «must», «every»), el bloque sustituye la frase absoluta en vez de ir al lado. `kit:copies` corre al cerrar cada task que toca una copia.
7. **La frase de las paradas en las copias**: el párrafo «Four things stop you, and only these: … For those, stop and ask.» se sustituye en las dos por uno que nombra, como una sola lista cerrada, las cuatro de la fuente y las del kit en la puerta: un desvío y un freno de alcance («Deviations and rulings») y, en `pair`, la parada tras cada task («After each task»); en la copia de SDD, la única fuente que la tiene, «a cap you would have asked to exceed» se sustituye por «a cap the plan sets», porque un tope que fija la spec no lo decide un ruling: es un desvío si se salta (enmienda del 2026-11-05: la frase del freno de la spec no se escribe). Esto arregla los hallazgos 1 y 3 de `fork-audit.md` (la contradicción de `SKILL.md:18` y el texto quitado sin motivo de `:303`) sin frase al lado.
8. **Lo que trae superpowers de 7.0.0 a 7.0.2 entra tal cual** donde el kit tenía el texto de 7.0.0 sin cambiarlo, y ninguno de esos cambios toca un requisito de `capabilities/`: la parte del SDD movida a `references/` (mismas reglas, otro fichero), «by its absolute path, from the working tree you're executing in» (va en los scripts, que el kit sustituye por la CLI), la espera en tramos acotados (la sustituye el vigía del kit, que es lo que dice hoy la skill) y la salida de los ejemplos de flujo. Donde el kit ya se apartaba de la fuente, sigue igual, en un bloque marcado: el pre-flight de Native con una fila por task, que hoy viene del de SDD y no del de `executing-plans`. Los dos «Example workflows» de hoy salen porque los quitó la fuente en 7.0.1 (unidades 136-139 de `provenance.md`), no por recorte.
9. **Las descripciones de las dos copias**: `sdd-implement-native` — «Use when sdd-implement runs a plan in Native: this session implements every task itself, with the ledger and one final review. Invoked from there; not the entry of a change (that is sdd-propose) nor of resuming paused work (that is sdd-implement).»; `sdd-implement-subagent` — «Use when sdd-implement runs a plan with SDD: a fresh implementer subagent and a task review per task. Invoked from there; not the entry of a change (that is sdd-propose) nor of resuming paused work (that is sdd-implement).» El `name` y la `description` enrutan (architecture.md): un sujeto de control comprueba que «retoma la feature» sigue entrando por `sdd-implement`.
10. **El freno de la spec**: se sustituyen dos frases, sin añadir otra: en la puerta, la viñeta «Scope brakes» de «Deviations and rulings» abre con «a brake the spec fixes («si pasa de 300 candidatos, paro»)» delante de los tres de hoy; en `skills/sdd-propose/references/control-profiles.md:85`, la frase de apertura de «Frenos de alcance» pasa de «Cuatro situaciones que no cambian la letra de la spec y aun así se tratan como un desvío: en `pair` y `delegate` su fila de la tabla para como la de «Desvío»; en `unattended` sigue con la opción conservadora y no aparca, porque ninguno de los cuatro bloquea la feature.» a «Un freno que fija la spec («si pasa de 300 candidatos, paro») y cuatro situaciones que no cambian su letra se tratan como un desvío: en `pair` y `delegate` su fila de la tabla para como la de «Desvío»; en `unattended`, el freno de la spec aparca la feature (`⏸️ aparcada: freno de la spec — <cifra>`), porque la spec dice parar, y los otros cuatro siguen con la opción conservadora y no aparcan, porque no la bloquean.»; y la fila de la tabla de `:54`, «Freno de alcance (3.er fix, salida observable, fila de la feature o líneas de la task cambiadas en la base)», abre con «un freno que fija la spec» y su columna de `unattended` dice «opción conservadora, enmienda sin aprobar; el de la spec, aparca». La 0306 traduce después esas frases como las demás. Va «si el RED lo exhibe»: el baseline es la puerta y `control-profiles.md` sin el cambio, con el caso de la 0299; con RED limpio 3 de 3, sale con un `Ruling:` y el ADDED no se fusiona.
11. **La parada sobre una copia**: la frase vive en la viñeta «How you stop» de «Deviations and rulings», que «Scope brakes» y «Deviation» nombran: la primera línea del ✋ es `Copia:` y la salida literal de `git log -1 --format='%h %s' <sha7>`. El `<sha7>` es el id de la marca del bloque (`<!-- kit: <id> · … -->`): las marcas de las dos copias nuevas llevan el commit que introdujo el texto, la columna «Origen del kit» de `provenance.md`, como hizo la 0312 con las suyas (`d59bf7b5` en `sdd-worktrees`), y no `0296`. Si la marca lleva una tarea y no un commit, la línea es la primera de `git log -S '<S>' --reverse --format='%h %s' -- <fichero>`, con `S` la cita de su `sustituye` o `quita` (en un bloque sin cita, su primera línea), y `Copia: no encuentro el commit del kit que lo cambió` si no sale. También «si el RED lo exhibe», con el caso de la 0312; con RED limpio 3 de 3, sale igual que la 10.
12. **Traducción de `frontend-verification.md` y `commit-milestones.md`**: al inglés, con «no X other than Y» para cada «solo X, salvo Y» (`tech-stack.md`, «Traducir una skill con `kit:own` delante»). Antes de cambiar un título, se busca en `cli/`, `tests/`, `skills/` y `.docs/`: un título que lea un literal del CLI o de un test se queda; uno citado en prosa se traduce y su cita cambia con él (`control-profiles.md:80` y `tests/batteries/sdd-propose/battery.md:161` citan «El hash en los artefactos»).
13. **`sdd-verify:163`** («the task review of `sdd-implement`») pasa a nombrar `sdd-implement-subagent`, y los enlaces de `encargo-revision.md:3,80` y de `tests/batteries/sdd-implement/compose.mjs:22` van a la ruta nueva de los prompts: es solo la ruta, no reescribe esas skills (0297 y 0307).
14. **Topes de palabras** de las dos skills nuevas y de `sdd-implement`: los de la tabla «Topes de palabras» son máximos; el tope que queda en `word-budget.test.ts` es lo medido al cerrar la última task más un 2 % (mínimo 20), sin pasar de esa cifra.
15. **Sujetos**: los de la batería `sdd-implement` (`h1`, `h2`, `g1`, `d1`) más dos escenarios nuevos que nacen en ella, `fr1` (freno de la spec) y `cp1` (parada sobre una copia), y un control de enrutado de «retoma la feature». Sonnet, como la batería.
16. **README, `CLAUDE.md`, `architecture.md` y `greenfield.md`**: el catálogo y el árbol nombran las dos skills nuevas; «las 22 skills» de `CLAUDE.md` pasa a 24; las filas de `sdd-tdd`, `sdd-debugging` y `sdd-worktrees` del README dicen qué copia las carga.
17. **La puerta vuelve tras compactar**: Claude Code adjunta las skills de la más reciente a la más antigua hasta 25.000 tokens (~100.000 caracteres), y la puerta es la más antigua de las que implementan. Por eso la puerta, la copia más grande y lo que las copias invocan mientras implementan y cierran la revisión (`sdd-worktrees`, `sdd-tdd`, `sdd-debugging`, `sdd-verify` y `sdd-rubber-duck`, cada una contada como mín(caracteres, 20.000)) suman 100.000 o menos. Hoy dan ~94.600 con la puerta y la copia a 20.000. Es una medida, no un requisito: la suma va al walkthrough con sus cifras de `kit:skill-size`, y no se escribe otro test (decisión del dev-lead); el límite de fase de `kit-distribution` sigue siendo el de hoy, por invocaciones directas.
18. **La excepción de la re-revisión final** («—except the single re-review of the final review, which `sdd-verify` sends with `sdd-kit:effort-high` + `opus`», `SKILL.md:200`) no se copia a `-subagent`: ya la dice `sdd-verify`, en el paso donde se despacha («The single re-review is the closing's only fresh eyes on the fix pass: `sdd-kit:effort-high` + `opus`», `skills/sdd-verify/SKILL.md:308`). No se quita una regla: sale el segundo sitio, el hallazgo 2 de `fork-audit.md`.
19. **La frase de la plantilla del plan** que lee la sesión tras compactar (`plan-template.md:30`) nombra `sdd-implement-subagent`: sin ese nombre, la sesión que retoma no sabe qué skill invocar para seguir con SDD.
20. **El `NOTICE` de la puerta se borra**: `sdd-implement` pasa a propia, `kit:notices` no genera `NOTICE` para una skill sin copias, y la puerta no dice «see `NOTICE`»; los de `-native` y `-subagent` salen de `upstream.json`.
21. **«Reproduce before fixing»** va a `-subagent/references/fix-loop.md`, donde están las rondas de fix de SDD; en Native no hay rondas por task, y la pasada de fix de la revisión final ya reproduce cada hallazgo en `sdd-verify` («A Critical… Fix it yourself: the test that reproduces it fails first», `skills/sdd-verify/SKILL.md:298`). La prohibición de `fable` y `opus xhigh` va a «Model Selection» de `-subagent`: en Native el único despacho es el de los ejes, con sus modelos fijos en `sdd-verify`.

- Política de modelos: revisores de la spec, uno `opus` y, en la segunda ronda, dominio `opus` y técnica `sonnet`, todos con `sdd-kit:effort-medium` · ejes de la revisión final: Spec `opus` + high, Código `sonnet` + high, Arquitectura no (ningún contrato entre módulos cambia) · sujetos `sonnet`, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden las instrucciones del dev-lead; lo que no nombra se confirma aparte.

### Decisiones tomadas con el dev-lead

- Estructura: `sdd-implement` propia y de puerta, más `sdd-implement-native` (de `executing-plans`) y `sdd-implement-subagent` (de `subagent-driven-development`); `parallel` no — «1a y 2a» (`estado.md`, 2026-11-03).
- Las marcas van en la fuente de `skills/` y el build las quita de `dist/`; lo de «nada de marcas» y de un `KIT-CHANGES.md` por copia de `estado.md` quedó sustituido por la 0300 y la 0302 (prompt de arranque, 2026-11-05).
- Las copias parten del último tag de superpowers al arrancar, hoy v7.0.2 — «ok a las cinco, adelante» (enmienda de la propuesta 0301, 2026-11-04).
- La medida del recorte ya está hecha y el test de tamaño ya existe (`kit:skill-size`): no se mide ni se escribe otro (prompt de arranque, 2026-11-05).
- Se mueve texto, no se quita, y la frase que falla se sustituye sin añadir otra (ADR 0022; prompt de arranque, 2026-11-05).
- `frontend-verification.md` y `commit-milestones.md` se traducen en la 0296 — «sí, adelante así y avisa a develop» (enmienda de la propuesta 0301, 2026-11-04).
- Las frases que `kit:own` da repetidas con una skill de otra fila son de la 0311 — «si» (enmienda de la propuesta 0301, 2026-11-05).
- Si al arrancarla pasa de 5 tasks, se parte con `sdd-propose` (fila 0296).

## Intent

`sdd-implement` ocupa 61.636 bytes, y Claude Code, tras compactar, la vuelve a adjuntar cortada a 20.000 caracteres: en 5 sesiones reales (0209, 0215, 0216, 0228, 0288) se perdió lo que había detrás, y el agente releyó la skill 1 vez de 26 ([compaction-measure.md](compaction-measure.md)). Además, la skill mezcla en las mismas frases texto de superpowers y del kit, con una contradicción y un texto quitado sin motivo ([fork-audit.md](fork-audit.md), hallazgos 1 y 3), y no se puede actualizar desde su fuente. Las copias parten de v7.0.2, no de la 7.0.0 que copió el kit: lo que cambió la fuente entre medias no toca ningún requisito (decisión 8). El éxito: las tres skills caben enteras tras compactar, las copias salen de su fuente con `kit:copies` en verde, fichero a fichero en `upstream.json`, como las que actualiza `kit:copies-update` (0302), y ninguna regla del kit se pierde ni queda escrita dos veces. Fracasa, aunque los tamaños pasen, si una regla del kit se queda sin sitio o si una copia vuelve a decir algo que el kit contradice.

## Scope

- Entra: `skills/sdd-implement/` como puerta propia (`own` en `upstream.json`), con lo del kit que el anexo le da; `references/patch-flow.md` sin cambios; `references/frontend-verification.md` y `references/commit-milestones.md` traducidas al inglés.
- Entra: `skills/sdd-implement-native/SKILL.md`, copia anotada de `skills/executing-plans/SKILL.md` de superpowers v7.0.2.
- Entra: `skills/sdd-implement-subagent/`, copia anotada de `skills/subagent-driven-development/` de superpowers v7.0.2: `SKILL.md`, los tres prompts y los siete `references/*.md`; los `scripts/` de las dos fuentes en `notCopied`.
- Entra: `upstream.json` — la entrada `pending: "0296"` sale y entran las entradas `copy` fichero a fichero de las dos copias, sus `notCopied` y los ficheros de la puerta bajo `own`; `NOTICE` y `THIRD_PARTY_NOTICES.md` regenerados con `moon run kit:notices`, y `skills/sdd-implement/NOTICE` borrado (decisión 20).
- Entra: los enlaces a los ficheros que se mueven (`sdd-verify/SKILL.md:163`, `sdd-verify/references/encargo-revision.md:3,80`, `tests/batteries/sdd-implement/compose.mjs:22`) y las filas de «Procedencia de las reglas» de `tests/batteries/sdd-implement/battery.md` cuya regla cambia de skill.
- Entra: en la línea `Ejecución` de `skills/sdd-templates/templates/plan-template.md:30`, «despacha las que quedan con el método SDD de sdd-implement» pasa a «invoca `sdd-implement-subagent` y despacha con él las que quedan»: es la frase que lee la sesión tras compactar (MODIFIED de `control-profiles`), y no reescribe la plantilla (0309).
- Entra: `cli/test/kit/word-budget.test.ts` con los topes de las tres skills; README (catálogo y filas de `sdd-tdd`, `sdd-debugging` y `sdd-worktrees`), `CLAUDE.md` («las 22 skills»), `architecture.md` (árbol) y `.docs/workflow/greenfield.md` (lista de skills).
- Entra: las citas en prosa de los títulos de `commit-milestones.md` y `frontend-verification.md` que la traducción cambia (`skills/sdd-propose/references/control-profiles.md:80`, `tests/batteries/sdd-propose/battery.md:161` y las que salgan del grep de la decisión 12).
- Entra: los escenarios nuevos de `tests/batteries/sdd-implement/battery.md` (`fr1`, `cp1`) y el control de enrutado de «retoma la feature», con su molde y su fila de «Procedencia de las reglas».
- Entra, si el RED lo exhibe: la parada sobre una copia abre con el commit del kit que la cambió (decisión 11).
- No entra: bajar de 20.000 `sdd-archive`, `sdd-propose`, `sdd-verify` y `sdd-roadmap` (0305, 0306, 0307 y 0308).
- No entra: las frases que `kit:own` da repetidas entre `skills/sdd-implement*/` y una skill de otra fila (0311).
- No entra: `sdd-verify/references/` más allá de las dos rutas, y el `REMOVED` del eje Spec (0297).
- No entra: el resto de `skills/sdd-propose/references/control-profiles.md` (0306): solo cambian la frase de apertura de «Frenos de alcance» y la fila de frenos de la tabla (decisión 10) y la cita de `commit-milestones.md` de su línea 80 (decisión 12).
- No entra: actualizar `cli/src/tasks` a los scripts de v7.0.2 (0313).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `skills/sdd-implement/references/implementer-prompt.md` → `skills/sdd-implement-subagent/implementer-prompt.md` | `skills/sdd-implement/SKILL.md:43,216,258,259`; `skills/sdd-verify/references/encargo-revision.md:80`; `tests/batteries/sdd-implement/compose.mjs:22` | Scope (enlaces) · decisiones 2, 3 y 13 |
| `references/task-reviewer-prompt.md` y `references/re-review-prompt.md` de `sdd-implement` → raíz de `sdd-implement-subagent/` | `skills/sdd-implement/SKILL.md:242,261`; `skills/sdd-verify/references/encargo-revision.md:3` | Scope (enlaces) · decisiones 2 y 13 |
| Secciones «Native loop» y «SDD loop» de `sdd-implement` → las dos copias | `skills/sdd-verify/SKILL.md:163` («the task review of `sdd-implement`») | Scope · decisión 13 |
| «Example workflows» de `sdd-implement` | solo `skills/sdd-implement/SKILL.md:346-475` | sale · decisión 8 |
| Viñeta «Scope brakes», apertura de «Frenos de alcance» y fila de frenos de la tabla (listas cerradas) | `skills/sdd-implement/SKILL.md:303-304`; `skills/sdd-propose/references/control-profiles.md:54,85`; `tests/batteries/sdd-implement/battery.md:175` | delta `control-profiles`, ADDED · decisión 10 |
| Títulos de `commit-milestones.md` y `frontend-verification.md`, en castellano | `skills/sdd-propose/references/control-profiles.md:80`; `tests/batteries/sdd-propose/battery.md:161` («El hash en los artefactos») | Scope · decisión 12 |
| Anuncio `Workspace del plan` en el primer mensaje tras cargar `sdd-implement` | `skills/sdd-implement/SKILL.md:14,40`; `capabilities/feature-flow.md:528-533` | Setup de las dos copias · delta `feature-flow`, MODIFIED |
| «las únicas skills de flujo que invoca son `sdd-implement`, `sdd-verify` y `sdd-archive`» | `capabilities/feature-flow.md:729-734` | delta `feature-flow`, MODIFIED |
| Párrafo «Four things stop you, and only these» + «The kit's own stops are a fifth class» | `skills/sdd-implement/SKILL.md:18`; `:121` («Only the stops of the Overview stop you») | las dos copias, sustituido · decisión 7 |
| Entrada `pending: "0296"` de `upstream.json` | `upstream.json:330-340` | Scope · entradas fichero a fichero |
| «La implementación la lleva `sdd-implement`» | `capabilities/feature-flow.md:506-512` | delta `feature-flow`, MODIFIED |
| «Tras una compactación, lo que queda de un plan Native va con SDD» | `capabilities/control-profiles.md:284-289`; la frase de la línea `Ejecución` de `skills/sdd-templates/templates/plan-template.md:30` | delta `control-profiles`, MODIFIED · Scope |
| `skills/sdd-implement/NOTICE` | solo la puerta («see `NOTICE`», `SKILL.md:10`) | se borra · decisión 20 | `cli/test/kit/word-budget.test.ts:29` | Scope · «Topes de palabras» |
| «las 22 skills»; catálogo; árbol; lista de skills | `CLAUDE.md`; `README.md:98-102`; `.docs/sdd/architecture.md:20`; `.docs/workflow/greenfield.md:55` | Scope · decisión 16 |

- Filas que implementa: 0296 → `roadmap.md:141` (la fila), `:714` («Un freno que fija la spec se esquiva con un ruling») y `:721` (la parte de la 0296 del 🦆); los cierres las marcan. En `capabilities/` y `skills/`, `0296` solo aparece como id de ejemplo en las marcas de `kit-distribution.md:82` y de `cli/test/` (fixtures de `kit:copies`): se quedan — comprobado con `git grep -n 0296 -- skills cli .docs/sdd/capabilities upstream.json`.

## Approach

**Las tres skills.** La puerta, `sdd-implement`, es lo que invoca `sdd-propose` y por donde entra «retoma la feature»: lleva el Overview del kit (el aviso `Ahora/Queda`), el patch, el método —lee la línea `Ejecución` y invoca `sdd-implement-native` o `sdd-implement-subagent` con `Skill`; en lite, `execution` o Native con `auto`; sin herramienta de subagentes, Native; tras compactar en Native con dos o más tasks pendientes, invoca `sdd-implement-subagent`—, el Setup del kit (sin spec aprobada a `sdd-propose`, retomar sin ledger, el effort), «Before each task», «After each task», «Deviations and rulings», «Recovery», «After the last task» (vigía y borradores del cierre) y los red flags. Cada copia es su original de v7.0.2 más bloques del kit marcados (`<!-- kit: 0296 · sustituye: «…» -->`), con sustituciones solo donde la fuente contradice al kit: nombres de skills (`superpowers:*` → `sdd-*`), los scripts → `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" <verbo>` (en `references/`, solo el verbo), la revisión final → `sdd-verify`, el cierre → `sdd-archive`, las paradas (decisión 7) y los pasos donde el kit trabaja distinto. A qué sitio va cada una de las 139 unidades de hoy lo dice el anexo, que parte de `provenance.md`.

**Tamaño.** Las tres `SKILL.md` de `dist/` quedan por debajo de 20.000 bytes. Si la puerta o una copia no cabe, baja texto a un `references/` de su skill que se lee en el paso que lo usa (`architecture.md`, «Ficheros auxiliares»), dejando en el paso las condiciones que deciden: «Visual check» y sus red flags a `frontend-verification.md`, o la verificación lenta de SDD a la puerta. Nada se quita para caber.

**Las dos frases que fallan.** Decisiones 10 y 11: cada una sustituye una frase de «Deviations and rulings» de la puerta, sin frase al lado, y solo se escribe si su RED, con `fr1` y `cp1` y n = 3, la exhibe.

**Comprobaciones.** `kit:copies`, `kit:own` y `kit:upstream` corren al cerrar cada task que toca una copia o la puerta; `kit:skill-size`, al final. Ninguna entra en el pre-commit (0311).

## Dónde se prueba

- Tamaño de las tres skills y de sus fases: `moon run kit:skill-size`, sin `FALLA` de tamaño ni de fase en `sdd-implement`, `sdd-implement-native` ni `sdd-implement-subagent` (hoy se prevén ~60.000 en la puerta, ~80.000 en `-native` y ~69.000 en `-subagent`); la suma de la decisión 17, con sus cifras, en el walkthrough, como medida.
- Copias fieles a su fuente: `moon run kit:copies`, sin ninguna línea `→ 0296` ni un rojo en `skills/sdd-implement-native/` o `skills/sdd-implement-subagent/`.
- Reglas del kit en un solo sitio, sin excepciones pegadas ni castellano: `moon run kit:own`, sin líneas en `skills/sdd-implement*/` salvo las repetidas con una skill de otra fila.
- La puerta sin líneas literales de superpowers: `moon run kit:upstream`, sin rojo en `skills/sdd-implement/`.
- Clasificación, `NOTICE`, enlaces, topes y `dist/`: `cli:test` (`skills.test.ts`, `word-budget.test.ts`, la comparación de `dist/`).
- El freno de la spec: escenario `fr1` de la batería `sdd-implement`, solo RED, que salió limpio 3 de 3: no hay GREEN porque la frase no se escribe.
- La parada sobre una copia: escenario `cp1`, RED y GREEN igual.
- Que nada se pierde al partir: humos `h1` (Native) y `h2` (SDD) y los controles `g1` y `d1` (paradas y desvío), con la puerta y las copias; y un control de enrutado de «retoma la feature».

## Términos y ADR

- Términos resueltos: puerta — la skill propia que elige el método e invoca su copia (`sdd-implement`); copia — la skill que es su original de superpowers más bloques del kit marcados.
- ADR candidatas: ninguna — la estructura sale de la propuesta 0301 y de la ADR 0022.

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — La implementación la lleva `sdd-implement`

- GIVEN la feature 0042 en modo full, con la spec aprobada y el plan con `Ejecución: native, porque 2 tasks encadenadas por la interfaz de Ledger, …`
- WHEN `sdd-propose` entrega la feature
- THEN invoca `sdd-implement`, que invoca `sdd-implement-native` con `Skill`; esta ejecuta las dos tasks en Native y, con la revisión final de vuelta y su pasada de fix hecha, invoca `sdd-archive`, que abre con la validación
- AND con `Ejecución: subagent`, `sdd-implement` invoca `sdd-implement-subagent`
- AND ningún texto que carga el agente (`skills/` sin las marcas `<!-- kit: … -->`) invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`
- AND en modo lite, sin plan, el método es el de `execution` si está fijado y Native con `auto`, con `spec.md` en el lugar del plan

#### MODIFIED — El workspace del plan se anuncia

- GIVEN un plan sin workspace en `.temp/sdd/`
- WHEN `sdd-implement-native` o `sdd-implement-subagent` lo crea
- THEN dice al dev-lead `Workspace del plan: .temp/sdd/plan/ — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`
- AND con un ledger del mismo plan con `Task 1: complete …`, la línea acaba en `· retomo en la Task 2`

#### MODIFIED — Ninguna skill intermedia entre propose e implement

- GIVEN la feature 0010 con la spec aprobada y el plan escrito
- WHEN el hilo pasa de `sdd-propose` a implementar y, al acabar, a cerrar
- THEN las únicas skills de flujo que invoca son `sdd-implement`, la copia de su método (`sdd-implement-native` o `sdd-implement-subagent`), `sdd-verify` y `sdd-archive`
- AND mientras trabaja el revisor final, `sdd-implement` escribe sin commitear el borrador de `walkthrough.md` y el delta fusionado, sin adelantar el roadmap, y `sdd-archive` los completa

#### MODIFIED — El worktree de la implementación lo prepara `sdd-worktrees`

- GIVEN la 0010 con la spec y el plan aprobados, abierta en un worktree que creó Orca en la rama `feature/0010-cancel`, y un proyecto con `.docs/sdd/environments.md` y `.docs/sdd/operations.md` §Testing `Gate de cierre: node --test`
- WHEN la copia del método (`sdd-implement-native` o `sdd-implement-subagent`) hace su preparación
- THEN invoca `sdd-worktrees`, que detecta que ya está en un worktree enlazado, lo dice con su rama, y no crea otro
- AND ejecuta `env:setup` después de instalar las dependencias, y los encargos de implementador dicen dónde está `.sdd-env.json`
- AND la baseline ejecuta `node --test`, el gate de cierre del proyecto; sin gate declarado en `operations.md`, `tech-stack.md` ni la constitution, lo dice y pregunta qué ejecutar
- AND con un gate filtrado (`moon run app:test api:test --affected --base develop`), la baseline corre sin el filtro solo las tareas cuyos inputs incluyen ficheros del Scope de la spec (`moon run api:test` si el Scope solo toca `src/api/`), y su informe es la línea `Gate:` con `app:test: saltada (fuera del Scope de la spec)`; nunca da la baseline por buena con un filtro que no corrió ninguna tarea; si ninguna tarea lee ficheros del Scope (un cambio solo en `.docs/`), las nombra todas saltadas fuera del Scope, lo dice y da la baseline por lista
- AND si la baseline falla, corre el mismo comando en un worktree temporal desanclado de la rama de integración; si también falla allí, busca las primeras líneas de error en la deuda del proyecto y cita la fila o abre una en «Por triar»; después informa de los fallos con ese veredicto y pregunta si sigue o investiga
- AND ningún fichero de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`

#### ADDED — Tras compactar, las skills de la implementación vuelven enteras

- GIVEN el kit construido en `dist/`
- WHEN corre `moon run kit:skill-size`
- THEN `dist/skills/sdd-implement/SKILL.md`, `dist/skills/sdd-implement-native/SKILL.md` y `dist/skills/sdd-implement-subagent/SKILL.md` ocupan menos de 20.000 bytes cada una, por debajo del corte con que Claude Code vuelve a adjuntar cada skill tras compactar
- AND la fase de ninguna de las tres pasa de 100.000 caracteres

### Capacidad: `control-profiles`

#### MODIFIED — Tras una compactación, lo que queda de un plan Native va con SDD

- GIVEN un plan con `Ejecución: native` (recomendado por el handoff o fijado en `sdd-kit.json`), una sesión retomada tras una compactación y dos o más tasks sin su línea `complete` en el ledger
- WHEN el hilo retoma la ejecución
- THEN invoca `sdd-implement-subagent` con `Skill` y sigue con SDD sobre el mismo ledger, y lo registra como `Task <N>: Ruling: compactación — sigo con SDD — quedan <k> tasks`, sin parar en `delegate` ni en `unattended`
- AND con una sola task pendiente sigue en Native y lo registra como `Task <N>: Ruling: compactación — sigo con Native — queda 1 task`; sin compactación, sigue en Native sin línea

#### ADDED — La parada sobre una copia abre con el commit del kit que la cambió

> Condicionado: entra solo si el RED de `cp1` lo exhibe (decisión 11). Con RED limpio 3 de 3, sale con un `Ruling:` y este requisito no se fusiona.

- GIVEN un freno de alcance en `delegate` sobre un bloque de `skills/sdd-x/references/foo-prompt.md`, que `upstream.json` clasifica como copia, con la marca `<!-- kit: a1b2c3d · sustituye: «S» -->`, y `a1b2c3d` el commit `feat(skills): el encargo sale del recuadro sangrado del original (feature 0042)`
- WHEN el agente para
- THEN el ✋ de la parada abre con la línea `Copia: a1b2c3d feat(skills): el encargo sale del recuadro sangrado del original (feature 0042)`: `Copia:` y la salida literal de `git log -1 --format='%h %s' a1b2c3d`
- AND con un desvío sobre una copia, igual
- AND con la marca `<!-- kit: 0042 · sustituye: «S» -->`, que lleva la tarea y no el commit, la línea es `Copia:` y la salida de `git log -S 'S' --reverse --format='%h %s' -- skills/sdd-x/references/foo-prompt.md`, su primera línea; si no da ninguna, `Copia: no encuentro el commit del kit que lo cambió`
#### Reglas de la capacidad — control-profiles

- **Avisos**: la línea de terminado, última del mensaje final de cada cierre (rama, destino, hash, estado del push y ruta del worktree que se puede borrar, o «No terminado» y qué falta); el bloque de un push fallido (comando literal y error); el aviso de cada clave de `sdd-kit.local.json` que el agente ignora, en el anuncio o en la pregunta del carril de `sdd-propose`; y, en la parada sobre una copia, la primera línea de su ✋: `Copia: <sha7> <asunto del commit>` (la salida de `git log -1 --format='%h %s'`) o `Copia: no encuentro el commit del kit que lo cambió`.

## Topes de palabras

Medido el 2026-11-05 con el conteo de `word-budget.test.ts` sobre `dist/`; previsto, por las unidades del anexo y las palabras de v7.0.2. Los topes de las dos copias parten del texto de su fuente (ADR 0022, regla 1).

| Fichero | Medido / tope | Margen | Tope propuesto (máximo, decisión 14) |
| --- | --- | --- | --- |
| `sdd-implement` · `SKILL.md` | 9.685 / 9.483 | −202 | 3.100 |
| `sdd-implement` · total | 17.455 / 17.740 | 285 | 7.300 |
| `sdd-implement-native` · `SKILL.md` = total | — (fuente: 2.985) | — | 3.200 |
| `sdd-implement-subagent` · `SKILL.md` | — (fuente: 2.895) | — | 3.300 |
| `sdd-implement-subagent` · total | — (fuente: 7.687) | — | 9.000 |
| Kit entero | 102.630 / 89.328 | −13.302 (cabe con el margen del 25 %, 111.660) | sin cambio: lo previsto suma ~+1.000 y sigue dentro |

## Previsión de coste

Batería `sdd-implement`, Sonnet; 0,3–2,5 $ por sujeto (`tech-stack.md`, «Sujetos headless»), ~1 $ en los de un plan corto.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `fr1` ×3 y `cp1` ×3, con la puerta sin las dos frases | 6 |
| GREEN | `fr1` ×2 y `cp1` ×2 | 4 |
| Una tanda de REFACTOR | `fr1` ×1 y `cp1` ×1 | 2 |
| Controles | `h1`, `h2`, `g1`, `d1` ×1 y el enrutado de «retoma la feature» ×1 (~0,5 $) | 4,5 |
| Medición tras la revisión final | `h1` ×1, si la pasada de fix toca una copia o la puerta | 1 |
| Suma | 18 sujetos | 17,5 |

## Enmiendas

- 2026-11-05 — El ADDED «Un freno que fija la spec es un freno de alcance» sale del delta: su RED (`fr1`) salió limpio 3 de 3 y la decisión 10 dice que entonces no se fusiona (`tests/sdd-implement-0296-red.md`); la fila de deuda del freno queda abierta — Task 4 — aplica literal la decisión 10
- 2026-11-05 — El ADDED de la parada sobre una copia pasa a «La parada sobre una copia abre con el commit del kit que la cambió», con un contrato de salida: el ✋ abre con `Copia:` y la salida literal de `git log -1 --format='%h %s'` del commit de la marca (o de `git log -S` con una marca de tarea); la regla «Avisos» y el hueco de la skill pasan a esa forma — en dos tandas de REFACTOR, el «qué cambió» libre no salió: en REFACTOR 1 el sujeto copió la cita de la marca y en REFACTOR 2 leyó `git show --stat` y no lo transcribió (1 de 2 abren con la línea, n = 1 por texto); el asunto del commit ya dice qué cambió y no hay que interpretarlo. Lo que el asunto no cuente (el commit real de la 0148, `baad233e feat(sdd-verify): los encargos de los tres ejes`, no dice que quitó la sangría) queda en el «queda» de la fila de deuda de la 0317 — Task 4, con una tanda de `cp1` n = 2; si no pasan los dos, el ✋ abre solo con `Copia: <sha7>` y el «qué cambió» pasa entero a la deuda — aprobada: «1» (dev-lead, 2026-11-05, a la opción «Contrato de salida»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-05 | aprobada (opción «Apruebo») |

## Anexo — Regla de `sdd-implement` → dónde vive ahora

Una fila por paso, red flag y racionalización (Art. I), por las unidades de [provenance.md](provenance.md). «Fuente» es texto de superpowers que la copia conserva; «kit» es un bloque marcado.

| Unidades | Qué (hoy, `SKILL.md`) | Dónde vive ahora | Por qué |
| --- | --- | --- | --- |
| 1 | Overview: ejecutar el plan, idioma del usuario, nota de fork | puerta, Overview; la nota de fork, en los `NOTICE` de las copias | es del kit |
| 2 | Core principle | `-native`, fuente | texto de `executing-plans` |
| 3 | Primer mensaje con `Workspace del plan` | las dos copias, Setup, kit, junto al paso que crea el workspace | es del kit; la ruta no existe antes de ese paso |
| 4 | Narration y aviso `Ahora/Queda` | «Narration»: las dos copias, fuente; el aviso: puerta, Overview | la frase es de las dos fuentes; el aviso, del kit |
| 5 | Continuous execution y las paradas | las dos copias, fuente; «Four things…» sustituido (decisión 7) | fuente; la sustitución arregla el hallazgo 1 |
| 6 | Patch | puerta, Patch | es del kit |
| 7 | Method: la línea `Ejecución`, lite, sin subagentes | puerta, Method | elegir el método es del kit |
| 8-10 | Native, SDD, SDD frente a Native | `-native` («Why inline», «When to Use») y `-subagent` («Why subagents», «vs. Executing Plans»), fuente | texto de las fuentes |
| 11 | Mismo ledger y cambio de método tras compactar | puerta, Method | es del kit |
| 12 | Sin spec aprobada → `sdd-propose`; retomar sin ledger | puerta, Setup | es del kit |
| 13 | Worktree con `sdd-worktrees` | las dos copias, Setup; kit sustituye `superpowers:using-git-worktrees` | nombre de la skill del kit |
| 14 | Workspace con `sdd workspace` y su anuncio | las dos copias, Setup; kit sustituye el script y añade el anuncio (unidad 3) | la CLI porta el script |
| 15 | Ledger | las dos copias (`-subagent`, también `references/resuming.md`), fuente; «`tasks.md` doesn't replace the ledger», kit en `-native` | fuente; la frase de `tasks.md` es de Native |
| 16 | Leer plan y spec | las dos copias, fuente | fuente |
| 17 | Cargar `sdd-tdd` y leer el decálogo | `-native`, Setup; kit sustituye el nombre y añade el decálogo | Native es quien escribe el código |
| 18 | Pre-flight scan | `-native`, Setup, kit sustituye el pre-flight de `executing-plans` por el de una fila por task; `-subagent/references/preflight.md`, fuente v7.0.2 | en Native es del kit; en SDD, fuente (decisión 8) |
| 19 | Effort antes del primer despacho | puerta, Setup | es del kit, y vale para los dos métodos |
| 20-21 | Antes de cada task: comprobar la base | puerta, Before each task | es del kit |
| 22 | Spike con «Evidencia»; tests RED del hilo | puerta, Before each task | es del kit |
| 23 | Grafo Native | `-native`, «The Process», fuente; kit en los nodos de base, RED, `sdd-debugging`, `sdd-verify` y `sdd-archive` | fuente |
| 24 | Lo que imprimes queda en el contexto | `-native`, «The Task Loop», fuente | fuente |
| 25 | Take the task: `tasks.md` antes de la primera, `sdd task start` | `-native`, paso 1; kit en `tasks.md` y el verbo | fuente con lo del kit |
| 26-27 | Work the steps; Matches | `-native`, paso 2, fuente | fuente |
| 28 | The code is wrong → `sdd-debugging`, y la regla de forma en un humo de guía | `-native`, paso 2; kit en el nombre y la frase del humo | fuente con lo del kit |
| 29 | The plan is wrong | `-native`, paso 2, fuente | fuente |
| 30-35 | Contrato de cierre y `sdd-verify` | `-native`, paso 3, fuente; kit sustituye `verification-before-completion` | fuente |
| 36 | Cerrar: copia RED, commit, comprobar el commit, `sdd task done` | `-native`, paso 4; kit en la copia RED, la comprobación y el código de salida | fuente con lo del kit |
| 37-48 | 12 racionalizaciones del bucle Native | `-native`, «Common Rationalizations», fuente; kit en 41, 42 y 48 | fuente; los tres bloques, del kit |
| 49 | Grafo SDD | `-subagent`, «The Process», fuente; kit en los nodos de base, RED y `sdd-verify` | fuente |
| 50-55 | Modelos: declarar modelo y effort, señales, revisores, rondas 4-5, `fable` y `opus xhigh` | `-subagent`, «Model Selection», fuente; kit en el effort y la prohibición; la excepción de la re-revisión final («—except the single re-review…») no se copia: ya la dice `sdd-verify` («This re-review is small», `SKILL.md:308`) | fuente con lo del kit; quitar la excepción pegada es el hallazgo 2 de `fork-audit.md` |
| 56 | Batch small same-shape work | `-subagent/references/batching.md`, fuente | fuente |
| 57 | Hand artifacts over as files | `-subagent`, «The Task Loop», fuente | fuente |
| 58 | Waiting on dispatched subagents | `-subagent`, «The Task Loop», fuente; kit sustituye la espera en tramos por el vigía de la puerta | el vigía es del kit |
| 59 | Nunca implementadores en paralelo | `-subagent`, paso 1, fuente | fuente |
| 60-65 | Despachar: BASE, `sdd task brief`, el encargo, sin historia, sin subagentes, identidad | `-subagent`, paso 1, fuente; kit en `tasks.md`, el verbo y las secciones del encargo | fuente con lo del kit |
| 66 | Verificación lenta | `-subagent`, paso 1, kit (o la puerta, si no cabe) | es del kit |
| 67-73 | Los cuatro estados del informe y las preguntas | `-subagent`, paso 2, y `references/handling-reports.md`, fuente | fuente |
| 74 | Comparar la copia RED al volver | `-subagent`, paso 2, kit | es del kit |
| 75-80 | Revisar la task: paquete, encargo, sin directivas abiertas ni prejuicios | `-subagent`, paso 3, fuente; kit en el verbo y el bloque «De código» | fuente con lo del kit |
| 81 | ⚠️ Cannot verify from diff | `-subagent/references/cannot-verify.md`, fuente | fuente |
| 82-90 | Bucle de fix: disparador, menores, plan-mandated, rondas 1-5, re-revisión, ledger | `-subagent/references/fix-loop.md`, fuente; kit en el encargo de las rondas y el verbo | fuente con lo del kit |
| 91 | Reproducir antes de arreglar | `-subagent/references/fix-loop.md`, kit; en Native, la pasada de fix de `sdd-verify` | es del kit (decisión 21) |
| 92-97 | Sin fixes en el controlador; el breaker; adjudicar solo en el tope | `-subagent/references/fix-loop.md`, fuente | fuente |
| 98 | Completar la task y juntar sus commits | `-subagent`, paso 5, fuente; kit en el squash y `commit-milestones.md` | fuente con lo del kit |
| 99-107 | 9 racionalizaciones del bucle SDD | `-subagent`, «Common Rationalizations», fuente | fuente |
| 108 | Verificación visual | puerta, After each task (o `frontend-verification.md`, si no cabe) | es del kit |
| 109 | Procesos que arrancas | puerta, After each task | es del kit |
| 110 | Parada de `pair` tras cada task | puerta, After each task | es del kit |
| 111 | El gate de cierre no corre dentro de una task | puerta, After each task | es del kit |
| 112 | Rulings, not stalls | las dos copias, fuente; «a cap you would have asked to exceed» sustituido en `-subagent`; lo del kit (salir del plan sin tocar la spec es un ruling), puerta | fuente; arregla el hallazgo 3 |
| 113 | Scope brakes | puerta, Deviations and rulings, sustituida (decisión 10) | es del kit |
| 114 | Deviation | puerta, Deviations and rulings, sustituida (decisión 11) | es del kit |
| 115 | Todo commit tuyo entra en revisión | puerta, Deviations and rulings | es del kit |
| 116 | Recovery | puerta, Recovery | es del kit |
| 117 | `sdd-verify` lleva la revisión final | las dos copias: kit sustituye «Final Review» (`-native`) y la revisión de `references/final-review.md` (`-subagent`) | la revisión del kit es `sdd-verify` |
| 118 | Vigía de silencio de cada despacho | puerta, After the last task | es del kit |
| 119 | Borradores del cierre | puerta, After the last task | es del kit |
| 120-121 | Finish: rulings a `tasks.md`, borrar el workspace, `sdd-archive` | `-native`, «Finish», y `-subagent/references/final-review.md`, «Finish», fuente; kit en `sdd ledger rulings`, los menores diferidos y `sdd-archive` | fuente con lo del kit (decisión 6) |
| 122-129 | 8 red flags | puerta, Red flags | son del kit |
| 130-135 | 6 racionalizaciones de los red flags | puerta, Red flags | son del kit |
| 136-139 | Example workflows | salen | los quitó la fuente en 7.0.1 (decisión 8) |
