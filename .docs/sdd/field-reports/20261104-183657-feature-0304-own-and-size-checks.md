---
kit_version: 2.3.4
lane: feature
id: 20261104-183657-feature-0304-own-and-size-checks
task: 0304
mode: full
date: 2026-11-04
---

# Ticket para el kit — feature 0304: las comprobaciones de las skills propias y del tamaño, en rojo

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code, CLI en Node con Vitest, moon), una persona
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: revisores de spec opus y sonnet (effort medium); ejes de la revisión final Spec opus+high y Código sonnet+high; re-revisión opus+high
- Coste en reloj: 0,98 h de esfuerzo frente a 3 h estimadas; reloj de la sesión 1,69 h, con 42 min de espera al dev-lead en 6 esperas
- Coste en tokens: hilo 64.849.165; subagentes 7.737.436 en 5 despachos; 27,13 $ de sesión

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La rúbrica de review de spec dio «ninguna» con 3 señales, y los dos revisores encontraron 5 Críticos (cuarto caso)

- **Qué pasó**: la spec tenía 3 señales: contrato público (la marca `incluye` y la salida de `kit:own`), un `MODIFIED` y un área no explorada. La rúbrica dice «ninguna». Propuse dos revisores por el remedio de la fila de deuda de la rúbrica, y el dev-lead los aprobó. Dieron 20 hallazgos, se aceptaron 17, y 5 eran Críticos. Dos rehicieron decisiones centrales:
  - dos copias con la misma sustitución daban un rojo sin remedio, porque una copia no puede incluir; la 0296 no habría llegado nunca a verde;
  - «manda invocar» solo con «with `Skill`» no veía `sdd-verify` en la fase de `sdd-implement` (60.203 → 80.203).
- **Fuente**: `spec.md` de la 0304, «Hallazgos de la review»; `walkthrough.md`, §2 («Review de spec: 2 revisores · hallazgos 20, aceptados 17»).
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md`, §2 («**Por defecto, ninguna.** 0–3 señales no proponen review.»). Es la fila 0306 del roadmap.
- **Por qué el kit no lo evitó**: la rúbrica cuenta señales, y una spec de herramientas con pocas señales fija igual contratos que leen siete filas.
- **Coste**: ~0,5 $ de revisores (`sdd session tokens`: 296.737 opus y 191.031 sonnet) y una reescritura de la spec. Sin la review, los dos Críticos de diseño habrían salido en la 0296 o la 0305.
- **Propuesta**: lo de la fila 0306 (dos revisores por defecto en full).
- **Verificada**: sí — contrastado con `skills/sdd-propose/references/review-spec.md:20`.
- **Criterio de aceptación**: el de la fila 0306.

### 2. `sdd merge --sync` se para por un `dist/` que solo cambia de finales de línea

- **Qué pasó**: en este clon, `core.autocrlf=true`. `dist/**` lleva `eol=lf`, pero `cli/src/` no tiene regla de EOL, así que su working copy está en CRLF, y el build lo copia tal cual a `dist/`. Resultado: 129 ficheros de `dist/` salen «M» en `git status`, sin diff de contenido (`git diff -- dist` vacío), desde antes de la sesión. El paso 0 de `sdd-archive` («si algo sale, para y pregunta») no distingue ese ruido. `sdd merge --sync` se paró con `base: 'feature/0304-own-and-size-checks' tiene cambios sin commitear; commitéalos antes de integrar la base`. Lo salvé con `git add -- dist`, que refresca el índice sin dejar nada staged.
- **Fuente**: `git ls-files --eol dist/LICENSE` → `i/lf w/crlf attr/text eol=lf`; `git config core.autocrlf` → `true`; la salida literal de `sdd merge --sync` en Git Bash.
- **Dónde en el kit**: `build/dist.ts` (`buildDist` copia los bytes del working copy), `.gitattributes` (sin `cli/** text eol=lf`), `skills/sdd-archive/SKILL.md` paso 0.1 y `cli/src/merge/sync.ts`.
- **Por qué el kit no lo evitó**: ninguna regla de EOL cubre `cli/`, y ni el paso 0 ni `--sync` distinguen un cambio de solo EOL.
- **Coste**: ~10 min entre diagnóstico y arreglo; la decisión de seguir con el árbol «sucio» en el paso 0 la tomé yo (ruling de la Task 1).
- **Propuesta**: `cli/** text eol=lf` (o `* text=auto eol=lf`) en `.gitattributes`, para que el build copie LF; o que `--sync` y el paso 0 usen `git diff --quiet` y no `git status --porcelain`.
- **Verificada**: sí — reproducido en Git Bash: `git status --porcelain | grep -c " dist/"` → 129 con `git diff --quiet -- dist` en verde; tras `git add -- dist`, 0 y nada staged.
- **Criterio de aceptación**: GIVEN un clon con `core.autocrlf=true` WHEN se ejecuta `moon run kit:build` THEN `git status --porcelain -- dist` sale vacío, y `sdd merge --sync` integra la base.

### 3. Un CI rojo que no se repite choca entre la regla 7 de `CLAUDE.md` y el paso 6 de `sdd-archive`

- **Qué pasó**: el CI de la rama, sobre la base integrada (`811a1935`), dio rojo en `cli/test/merge/lock-and-base.slow.test.ts` («el segundo proceso espera, dice quién tiene el cerrojo…»). Aislado pasa 10/10 en la rama y en `origin/develop`, y la rama no toca `cli/src/merge`. El paso 6 de `sdd-archive` dice «No se repite: open a debt row … and go on with the close». La regla 7 de `CLAUDE.md` dice «con `failure` no fusiones; el rojo se arregla en la rama, salvo un run caído antes de correr la suite». Abrí la fila de deuda en un commit de docs, y su push lanzó un CI nuevo, verde (run 41888248643). Fusioné sobre ese.
- **Fuente**: `gh run view 41887118031 --log-failed` → `AssertionError: expected 'Fusionado feature/0002 en develop: b4…' to match /Esperando el cerrojo de merge: lo…/0001`; `gh run view 41888248643` → `success 701ea759…`.
- **Dónde en el kit**: `CLAUDE.md` del repo, regla 7; `skills/sdd-archive/SKILL.md` paso 6 (el contraste a mano y «No se repite»).
- **Por qué el kit no lo evitó**: la regla 7 no nombra el caso del rojo inestable ya contrastado, y el paso 6 no nombra el CI de la rama.
- **Coste**: un ciclo de CI (~8 min) y un commit de docs para lanzarlo.
- **Propuesta**: que la regla 7 sustituya «el rojo se arregla en la rama» por «el rojo se arregla en la rama, salvo uno que el contraste del paso 6 de `sdd-archive` da como "No se repite", que lleva su fila y se relanza con `gh run rerun <id> --failed`».
- **Verificada**: sí — contrastado con `CLAUDE.md` regla 7 y `skills/sdd-archive/SKILL.md` paso 6.
- **Criterio de aceptación**: GIVEN un CI de rama en rojo en un test que aislado pasa en la rama y en la base WHEN el agente cierra THEN abre la fila, relanza el run y fusiona con el verde, sin un commit solo para lanzar el CI.

### 4. `skills.test.ts` lee `skills/`, así que el texto de una inclusión no se validará

- **Qué pasó**: el eje Código avisó de que `cli/test/kit/skills.test.ts` comprueba enlaces, `@` y `references/` huérfanos sobre `skills/`, no sobre `dist/`. Cuando la 0305-0310 escriban la primera inclusión real, su texto vivirá en `includes/<nombre>.md` y ese test no lo verá. Es el mismo patrón que el ticket de la 0312 §2 y §9: un test de `skills/` que no sabe de lo que el build cambia.
- **Fuente**: informe del eje Código de la revisión final de la 0304; `walkthrough.md`, §4.3.
- **Dónde en el kit**: `cli/test/kit/skills.test.ts`; `build/dist.ts` (`renderLines`, la inclusión).
- **Por qué el kit no lo evitó**: la spec de la 0304 añadió la inclusión al build sin buscar los tests que leen `skills/` (coherence pass, tercer caso del ticket de la 0312 §9).
- **Coste**: ninguno todavía; el riesgo es que un enlace roto en una inclusión pase `cli:test`.
- **Propuesta**: que `skills.test.ts` lea `dist/skills/`, como ya hace `worktrees-setup.slow.test.ts` desde la 0312.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `includes/x.md` con un enlace a `references/no-existe.md`, incluido en una skill propia, WHEN corre `cli:test` THEN `skills.test.ts` da rojo con el enlace.

### 5. El diseño por secciones en `delegate` sumó seis paradas antes de la spec

- **Qué pasó**: con 4 o más tasks, `spec-writing.md` pide presentar el diseño por secciones, «también en `pair` y en `delegate`». Fueron 2 preguntas de decisión y 3 secciones, más la pregunta de la review: 6 paradas antes de la spec. El dev-lead las respondió con «1», «1», «ok», «ok», «ok» y «1, y te pre apruebo la spec». Las 6 esperas suman 42 min, una de 27.
- **Fuente**: `sdd session tokens` → `Esperas y huecos: 16:44Z 27 min; 17:11Z 8 min; 17:20Z 2 min; 17:22Z 3 min; 17:26Z 1 min; 17:32Z 1 min`.
- **Dónde en el kit**: `skills/sdd-propose/references/spec-writing.md`, «Design by sections»; regla 3 de `CLAUDE.md` del repo («Paras solo en tres casos…»).
- **Por qué el kit no lo evitó**: las secciones cuentan como turnos de entrevista, no como paradas del perfil, y en `delegate` la regla 3 solo prevé la parada de la spec.
- **Coste**: 42 min de espera; que las secciones los causaran va «sin respaldo»: el dev-lead pudo estar fuera.
- **Propuesta**: en `delegate`, las secciones van juntas en un solo mensaje, con una sola pregunta («¿va bien el diseño?»), y las decisiones reales siguen siendo de una en una.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una feature full en `delegate` con 4 tasks previstas WHEN se presenta el diseño THEN es un solo mensaje con sus secciones y una pregunta.

## Lo que hice por iniciativa propia

- El smoke de la validación en campo, en un worktree desechable con entradas que fallan (`smoke.mjs` en el scratchpad): inclusión que no existe, inclusión en un bloque de código o con marcas, inclusión en una copia, y una fase de más de 100.000 con tres invocaciones añadidas. Así 6 de 8 THEN salieron con ejecución real y no solo por suite. Funcionó.
- El inventario de castellano de la sesión `develop` se versionó como contrato de mínimo del RED (`red/spanish-inventory.md`), con un script que compara los rojos de `kit:own` con él. Encontró un fichero de más, real, y 6 falsos positivos («todo»). Funcionó.
- Pedí y anoté el inventario exacto a `develop` por `SendMessage` antes de fijar la heurística. Funcionó.

## Funcionó, no tocar

- Reutilizar el `Reader` de `kit:copies` (`kitBlockLines`) y la clasificación de `upstream.json` (`kindOf`) para saber qué es texto del kit: `kit:own` no tiene un segundo lector de marcas.
- `sdd capability merge` sobre una copia de `.docs/sdd` antes del gate de la spec: cazó una regla («Regla ante conflicto: no aplica») que habría borrado la vigente.
- La re-revisión única encontró un Important que metió la propia pasada de fix: un comentario que repetía el código.

## Menores

- Un `sed` sobre `Tamaño M | ⏳ |` para marcar la fila 0304 cambió 8 filas del roadmap; lo vi en `git diff --stat` y lo deshice fila a fila. Un verbo `sdd roadmap mark <id> ✅` lo evitaría — `skills/sdd-archive/references/records.md`
- `sdd review package` imprime `wrote <ruta>: …` y no la ruta sola, y capturado en una variable rompió el brief de la re-revisión — `cli/src/tasks/package.ts`
