---
kit_version: 2.3.4
lane: feature
id: 20261104-162918-feature-0312-annotate-real-copies
task: 0312
mode: full
date: 2026-11-04
---

# Ticket para el kit — feature 0312: las copias del kit, anotadas contra su fuente y subidas a superpowers v7.0.2

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-rubber-duck`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code, CLI en Node con Vitest, moon), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisores de spec opus y sonnet (effort medium); ejes de la revisión final Spec opus+high y Código sonnet+high; re-revisión opus+high; sujetos del humo sonnet
- Coste en reloj: 1,59 h de esfuerzo frente a 4 h estimadas; reloj de la sesión 5,32 h, con 224 min de espera al dev-lead
- Coste en tokens: hilo 131.503.500; subagentes 15.842.039 en 5 despachos; 48,90 $ de sesión más 0,47 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El freno de alcance de la Task 2 se explicó mal, y el dev-lead tuvo que preguntar tres veces

- **Qué pasó**: al anotar los tres `*-reviewer-prompt.md` contra `code-reviewer.md` de superpowers, las líneas exactas del original volvían a sangrar entre 72 y 79 líneas. El freno llegó al dev-lead con dos fallos:
  - el 🦆 decía que el revisor leería el texto como un bloque de código. Era falso: en los dos lados las instrucciones ya estaban dentro de un recuadro;
  - no explicaba por qué el fork se apartaba de la fuente. La 0148 sacó el despacho de la ficha `Subagent… prompt: |` y quitó la sangría, sin registrarlo.

  El dev-lead respondió «no entiendo nada…», preguntó por qué la sangría era distinta y acabó dudando del fork entero («O NOS ALINEAMOS O TIRAMOS EL FORK»). Con la forma del original, que es lo que quería su modelo de fork, el encargo que compone cada eje sale igual byte a byte.
- **Fuente**: `walkthrough.md` de la 0312, §2 (espera de 119 min a las 12:57Z, de `sdd session tokens`) y §3; `spec.md`, «Enmiendas» del 2026-11-04; commit `57be1a76`.
- **Dónde en el kit**: `skills/sdd-rubber-duck/SKILL.md`, «Short mode»; `skills/sdd-implement/SKILL.md`, «Deviations and rulings» (la parada del freno de alcance).
- **Por qué el kit no lo evitó**: el modo corto de `sdd-rubber-duck` pide el efecto con un ejemplo, pero no que el efecto esté medido. Afirmé el efecto en Markdown sin abrir los dos ficheros. Tampoco hay paso que pida decir, en una parada sobre una copia, qué hizo antes el kit con la fuente y por qué.
- **Coste**: 119 min de espera del dev-lead y tres rondas de explicación, más una fuerte pérdida de confianza en el fork (`walkthrough.md`, §2).
- **Propuesta**: en el modo corto, «el efecto que nombras lo comprobaste en el fichero: si no, no lo nombres». Y en el freno de una copia, una línea con lo que el kit cambió de la fuente y cuándo («la 0148 sacó X del recuadro»), sacada de `git log -S`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una copia cuyo original lleva el texto sangrado dentro de un recuadro y el kit sin sangrar WHEN el agente para por el freno THEN su 🦆 no atribuye a la sangría un efecto de render que no ha comprobado, y nombra el commit del kit que cambió la forma.

### 2. Un test lento ejecutaba texto de `skills/`, y con las marcas el CI de la rama dio rojo tras el cierre

- **Qué pasó**: `cli/test/kit/worktrees-setup.slow.test.ts` ejecuta el bloque bash del Step 2 de `skills/sdd-worktrees/SKILL.md`. Con la fuente anotada, ese bloque lleva líneas `<!-- kit: … -->`, y bash daba `syntax error near unexpected token 'newline'` en los cuatro casos. El gate de cierre (`kit:test-headless cli:typecheck cli:test --affected --base develop`) no corre los `*.slow.test.ts`. Lo cazó el CI de la rama (`cli:test-min`), después del commit de cierre. El arreglo fue que el test lea `dist/`, que es lo que carga el agente, y quedó «sin revisar».
- **Fuente**: `gh run view 41861969567 --log-failed` → `AssertionError: expected 'bash: -c: line 4: syntax error near u…' to be 'pnpm install --frozen-lockfile'`; commit `35e08439`; `moon run cli:test-min` en Git Bash → `Tests 2665 passed | 12 skipped (2677)`.
- **Dónde en el kit**: el plan de la 0312 (gate de cierre copiado de `tech-stack.md` §Testing); `skills/sdd-propose/references/plan-writing.md` (cómo se fija el gate); la regla «La fuente de una copia…» de `capabilities/kit-distribution.md`.
- **Por qué el kit no lo evitó**: ninguna regla dice que un test que lee el texto de una skill para ejecutarlo o compararlo lea `dist/`. El coherence pass busca los literales retirados, no los lectores de `skills/` a los que una marca cambia la entrada.
- **Coste**: un ciclo de CI (~10 min) y un commit sin revisar tras el cierre (`walkthrough.md`, §4.3).
- **Propuesta**: un test en `cli/test/kit/` que dé rojo si un test de `cli/test/` hace `readText('skills/…')` y ejecuta o compara un bloque de código. O, más barato, que la feature que anota una copia corra `cli:test-min` antes del cierre.
- **Verificada**: sí — reproducido en el CI (run 41861969567) y verde tras el cambio (run 41867065250).
- **Criterio de aceptación**: GIVEN una skill anotada con una marca dentro de un recuadro bash WHEN corre el gate de cierre de una feature que anota copias THEN el test que ejecuta ese bloque falla antes del push, o lee `dist/` y pasa.

### 3. `kit:copies` da por buenas líneas del original metidas en un bloque del kit dentro de un recuadro, y cierra en la línea en blanco aunque el bloque lleve `fin`

- **Qué pasó**: dentro de un recuadro, una línea en blanco no cierra un bloque. Un bloque añadido sin `fin` llega hasta la siguiente marca y se come las líneas del original que hay entre medias, sin ningún rojo. Le pasó a `skills/sdd-worktrees/SKILL.md:115-121`, el bloque de Node.js, en la Task 1, y se arregló en la Task 2. Al revés, fuera de los recuadros, un bloque con `fin` cierra en la primera línea en blanco, contra la decisión 2 de la 0302. Por eso hubo que poner un bloque por párrafo.
- **Fuente**: `tests/copies/annotated.ts`, `Reader.take` (`else if (inText && line.trim() === '') this.close(index)`); commit `57be1a76` (el `fin` añadido en `sdd-worktrees`); mensaje de develop del 2026-11-04 (fila propuesta tras la 0312).
- **Dónde en el kit**: `tests/copies/annotated.ts`, `Reader`, de la 0302.
- **Por qué el kit no lo evitó**: el contenido de un bloque `add` vuelve al texto en la comparación de palabras, y los «sitios» no ven que esas palabras son del original.
- **Coste**: un caso real sin rojo; ~30 min de diagnóstico y del arreglo del borrador (ruling de la Task 2).
- **Propuesta**: lo que develop ya propone. Cerrar en `fin` si lo hay antes de la siguiente marca, y dar rojo cuando el contenido de un bloque `add` contenga una racha de líneas iguales a las del original en su sitio.
- **Verificada**: sí — `node fenced-marks.mjs` (scratchpad) sobre las fuentes de la Task 1 encontró el caso, y `kit:copies` no daba rojo.
- **Criterio de aceptación**: GIVEN un recuadro con `<!-- kit: x -->`, una línea del kit, una línea en blanco y dos líneas del original WHEN corre `kit:copies` THEN da rojo en la marca, o exige `fin` antes de la línea en blanco.

### 4. La comparación de `dist/` normaliza los espacios y no vio tres cambios de forma

- **Qué pasó**: `real-copies/compare-dist.mjs` compara párrafo a párrafo, con los espacios normalizados, como hacía la 0302. No vio tres cosas:
  - el borrador de la 0302 juntaba en una línea el contenido de cada bloque, y eso rompía listas y tablas;
  - las 72-79 líneas sangradas de los encargos de eje, que se midieron con otro script;
  - las líneas en blanco dobles que dejaban las `quita` entre dos blancos en `skill-mechanics.md`. Las cazó `git diff --stat` de `dist/`.
- **Fuente**: rulings de las tasks 1 a 3 en `tasks.md` de la 0312; `real-copies/compare-dist.mjs:1`.
- **Dónde en el kit**: `.docs/sdd/specs/…-feature-0302-…/real-copies/` (el borrador y su comparación).
- **Por qué el kit no lo evitó**: la comparación de la 0302 normalizaba los espacios para tolerar los saltos de línea del original. Con eso también tolera la sangría y las líneas juntadas.
- **Coste**: ~45 min entre detectar y rehacer, en las tasks 1 a 3 (rulings de `tasks.md`).
- **Propuesta**: para cada copia, dos comparaciones: por párrafos, que tolera los saltos de línea del original, y byte a byte de la sangría y de las líneas en blanco. O que `kit:build` compare con el `dist/` anterior, salvo las líneas que cambian por saltos dentro de un párrafo.
- **Verificada**: sí — `indent.ts` (scratchpad) dio 72/74/79 líneas con otra sangría donde `compare-dist.mjs` daba «igual».
- **Criterio de aceptación**: GIVEN un fichero anotado cuya salida cambia la sangría de una línea WHEN corre la comparación de `dist/` THEN la nombra.

### 5. Tras la compactación se siguió en Native con tres tasks por hacer, sin el ruling

- **Qué pasó**: la sesión se compactó en la Task 2. Quedaban tres tasks sin `complete`. `sdd-implement` dice que con dos o más se sigue en SDD y que se deja `Ruling: compactación`. Seguí en Native y no lo registré. El walkthrough lo dice así.
- **Fuente**: `walkthrough.md`, §2 «Compactación»; `.temp/sdd/plan/progress.md` sin línea `Ruling: compactación`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Method» (tras una compactación).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. El resumen de la compactación decía que siguiera «sin preguntar», y no la retomé.
- **Coste**: sin respaldo. Las tasks 3 y 4 salieron sin rojos, y el humo y la revisión final no encontraron nada atribuible al método.
- **Propuesta**: que `sdd task start` avise si el ledger no tiene `Ruling: compactación` y la sesión trae un resumen de compactación. O que el primer `task start` tras una compactación imprima la regla.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un ledger con 1 task `complete` de 4 y una sesión compactada WHEN el hilo corre `sdd task start` de la siguiente THEN ve la regla de SDD y el ruling que falta.

### 6. La rúbrica de review de spec dio «ninguna» y el dev-lead tuvo que pedir la revisión adversarial (segundo caso)

- **Qué pasó**: la rúbrica de `review-spec.md` dio «ninguna» y presenté la spec sin revisión. El dev-lead preguntó «has revisado adversialmente la spec? con ops dom y tecnmica». Los dos revisores dieron 19 hallazgos, y se aceptaron los 19. Entre ellos, que el reparto de `sdd-agent-writing` se anotara contra la v7.0.0 o la v7.0.2, los 13 sitios de la versión y el patrón sin definir.
- **Fuente**: `walkthrough.md`, §2 «Review de spec: 2 revisores · hallazgos 19, aceptados 19»; `spec.md`, «Hallazgos de la review».
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md` (la rúbrica). Es la fila 0306 del roadmap.
- **Por qué el kit no lo evitó**: la rúbrica cuenta señales que esta spec no tenía (pocas tasks, sin código de producto), y aun así la revisión encontró 19 cosas.
- **Coste**: una parada del dev-lead y ~1 $ de dos revisores (`sdd session tokens`: 139.565 y 603.897 tokens).
- **Propuesta**: lo de la fila 0306.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: el de la fila 0306.

### 7. El lanzador de baterías no sirvió como esperaba en un humo con n = 1

- **Qué pasó**: lanzar p1 y b1 con n = 1, como fija la decisión 11 de la spec, costó tres intentos:
  - la tabla lleva n = 2, y no hay forma de bajar n sin copiar la batería;
  - una copia en `.temp/` rompe el `import` relativo de `subject.mjs` (`ERR_MODULE_NOT_FOUND …\headless\battery.mjs`);
  - `SUBJECT_CAP` no se leyó de la Previsión de la spec («sin previsión legible … escribe el total en la fila Suma, columna de sujetos»), aunque la fila Suma decía «2 a 4».

  Además, el harness negó al sujeto p1 escribir en `.claude/skills/`, y `tools.txt` no guarda el contenido de cada `Write`. La evidencia de R2 hubo que sacarla del transcript (`green/out/p1-1.writes.md`). Fue el Important del eje Spec.
- **Fuente**: `.temp/claude/…/scratchpad/t4-smoke.log` (los tres intentos); `green/out/p1-1.tools.txt` («Claude requested permissions to write to …\.claude\skills\migraciones\SKILL.md, but you haven't granted it yet»); revisión final, eje Spec, Important 1.
- **Dónde en el kit**: `tests/headless/battery.mjs` (`batteryPlan`, n de la tabla); `tests/headless/run.mjs` (la lectura de la Previsión); `tests/batteries/<skill>/subject.mjs` (el import relativo).
- **Por qué el kit no lo evitó**: n solo sale de la tabla; la Previsión espera una cifra, no un rango; y el `tools.txt` registra la ruta del `Write`, no su contenido.
- **Coste**: ~10 min y dos lanzamientos a 0 $; un Important de la revisión final y su adjudicación.
- **Propuesta**:
  - un `N=` que sobreescriba el n de la tabla, con su umbral proporcional;
  - leer «2 a 4» como techo 4;
  - guardar en `tools.txt` el contenido de cada `Write`, también el denegado;
  - en los moldes de `sdd-agent-writing`, permitir escribir en `.claude/skills/`.
- **Verificada**: sí — reproducido en Git Bash con `BATTERY_DIR=<copia en .temp> … node tests/headless/battery.mjs run`.
- **Criterio de aceptación**: GIVEN `N=1 SCENARIOS="p1" … battery.mjs run` WHEN el sujeto escribe una skill THEN corre un sujeto con umbral 1/1, y `p1-1.tools.txt` lleva la `description` escrita.

### 8. Un fichero `own` no genera `NOTICE` aunque lleve texto literal de terceros

- **Qué pasó**: para resolver el freno de la Task 2, pasar los encargos de spec y de arquitectura a propios parecía lo mejor. El de arquitectura copia literal la tabla de Clean Architecture de Wondel. Un `own` no entra en `renderNotice`, así que esa tabla se habría quedado sin aviso de licencia. Se resolvió dejándolos como copias. Un barrido de los 22 `own` contra el HEAD de los 7 clones no encontró ninguna línea literal de 70 caracteres o más.
- **Fuente**: `build/notices.ts`, `renderNotice` (solo `entry.kind === 'copy'`); `own-literal.mjs` (scratchpad) → sin salida; mensaje a develop del 2026-11-04.
- **Dónde en el kit**: `build/sources.ts` y `build/notices.ts`, de la 0302.
- **Por qué el kit no lo evitó**: el registro no tiene sitio para un fragmento literal en un fichero propio.
- **Coste**: ~15 min de análisis; ningún aviso perdido.
- **Propuesta**: lo que develop ya propone. Un test de `kit:upstream`: «un `own` con una línea literal de una fuente da rojo».
- **Verificada**: sí — `renderNotice` solo filtra `kind === 'copy'`.
- **Criterio de aceptación**: GIVEN un `own` con una línea de 80 caracteres literal de un clon WHEN corre `kit:upstream` THEN da rojo nombrando la línea y la fuente.

### 9. El coherence pass no busca en los tests (tercer caso)

- **Qué pasó**: tres tests leían `skills/` y no sabían de las marcas ni del reparto:
  - `skills.test.ts`, «skills de superpowers citadas», contaba las citas `superpowers:` de las marcas;
  - `skills.test.ts`, «enlaza todos sus references/ desde SKILL.md», no admitía references alcanzadas desde otra;
  - `worktrees-setup.slow.test.ts` ejecutaba las marcas (hallazgo 2).

  Ninguno estaba en el Scope de la spec.
- **Fuente**: rulings de las tasks 1 y 4 en `tasks.md` de la 0312; commit `35e08439`.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass».
- **Por qué el kit no lo evitó**: el pass busca los `MODIFIED` y lo que se retira en `capabilities/`, los documentos y `skills/`, no en `cli/test/`. Es el tercer caso (tickets de la 0300 §1 y la 0302 §2).
- **Coste**: tres rulings y un ciclo de CI.
- **Propuesta**: que el coherence pass busque también en `cli/test/` y `tests/` los ficheros que la spec cambia de forma, con `grep -rn "<ruta>" cli/test tests`.
- **Verificada**: sí — `grep -rn "skills/sdd-worktrees/SKILL.md" cli/test` habría encontrado `worktrees-setup.slow.test.ts:9`.
- **Criterio de aceptación**: GIVEN una spec que cambia la forma de `skills/<x>/SKILL.md` WHEN corre el coherence pass THEN su Scope o «Lo que se retira» nombra cada test que lee ese fichero.

## Lo que hice por iniciativa propia

- Monté el reparto de `sdd-agent-writing` con `git merge-file` sección a sección: base v7.0.0, el kit y el fichero nuevo de la v7.0.2. Después anoté cada fichero contra su original de la 7.0.2 (`real-copies/build-split.mjs` y `fix-split.mjs`). Salieron 5 conflictos pequeños en lugar de los 5 grandes del fusionado, y los seis ficheros quedaron sin rojos, conservando entre el 67 % y el 100 % de su original. Funcionó.
- Comparé byte a byte, con `compose-axis.mjs`, el encargo que recibe cada eje antes y después de cambiarle la forma. Fue la prueba de que los revisores leen lo mismo. Funcionó.
- Saqué del transcript del sujeto el contenido de sus `Write` denegados para juzgar R2, en lugar de relanzar el humo. Funcionó: la re-revisión lo aceptó.
- Barrí los `own` buscando texto literal de terceros, para responder si el hallazgo 8 bloquea el corte. Funcionó.

## Funcionó, no tocar

- `kit:copies-update` con `renamedPath` siguió en real el renombrado de `testing-skills-with-subagents.md` (`R097`), y las 13 copias de superpowers subieron a v7.0.2 con 0 conflictos.
- La regla 7 del `CLAUDE.md` del repo (primer push y CI antes del `sdd merge`) cazó el hallazgo 2 antes del merge.
- La re-revisión única (opus+high) encontró un Important que había metido la propia pasada de fix: comentarios que citaban la spec.
- El aviso a develop por `SendMessage` a mitad de feature: develop trió las references en castellano y los fallos de la 0302 sin parar la rama.

## Menores

- SSH vuelve a fallar a ratos con `Permission denied (publickey)`. Se salva con HTTPS y `gh auth git-credential` en el entorno del comando — no localizado.
- El `dist/skills/sdd-verify/SKILL.md` ya pesaba más de 20.000 bytes antes de esta rama (lo nota el eje Código; lo mide `kit:skill-size`) — `skills/sdd-verify/SKILL.md`.
- Las references que siguen en castellano van a la fila que reescribe su skill (develop, `c69f5e6d`) — `skills/sdd-propose/references/`, `skills/sdd-implement/references/`, `skills/sdd-verify/references/encargo-revision.md`.
