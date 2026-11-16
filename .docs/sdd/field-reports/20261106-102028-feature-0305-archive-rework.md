---
kit_version: 2.3.4
lane: feature
id: 20261106-102028-feature-0305-archive-rework
task: 0305
mode: full
date: 2026-11-06
---

# Ticket para el kit — feature 0305: `sdd-archive` rehecha, por debajo de 20.000 bytes y propia

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose` (con `sdd-grilling` y dos revisores de spec), `sdd-implement` (Native), `sdd-worktrees`, `sdd-tdd`, `sdd-verify` (ejes Spec y Código, pasada de fix y re-revisión), `sdd-parallel-agents`, `sdd-archive` (leída de `dist/` por la regla 1 de `CLAUDE.md`), `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code: skills en Markdown, CLI en TypeScript, baterías de sujetos headless)
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: Opus 5.5 (revisor de dominio, eje Spec, re-revisión), Sonnet 5.5 (revisor técnico, eje Código); sujetos de la batería en Sonnet
- Coste en reloj: 3,09 h de esfuerzo frente a 6 h estimadas (las tandas corrieron en segundo plano)
- Coste en tokens: hilo 148.916.657, subagentes 9.181.883 en 5 despachos; sesión 55,77 $; sujetos 61,82 $ en 104

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La previsión de la campaña no contó el REFACTOR de las reglas movidas a `references/`, y el dev-lead tuvo que subir el umbral cuatro veces

- **Qué pasó**: la previsión de la spec daba 91 sujetos y 42,90 $, con 0,45 $ por sujeto (lo medido en la 0236) y «una tanda de REFACTOR, ~6 sujetos». El GREEN dejó 10 sujetos en rojo por frases perdidas al mover texto a `references/`; hicieron falta dos tandas de REFACTOR y una medición tras la revisión final. Coste medido: 0,69 $ por sujeto. El umbral pasó de 45 $ a 48 $, 53 $, 58 $ y 62 $, cada vez con una parada de dinero del dev-lead.
- **Fuente**: «Previsión de coste» y «Enmiendas» de `specs/20261105-161703-feature-0305-archive-rework/spec.md`; §2 del walkthrough («Coste de sujetos: 61,82 $ en 104 sujetos sonnet»); `skills/sdd-agent-writing/SKILL.md:24` («one REFACTOR round, n = 2 per new rule that fixes a literal or goes to `references/`»); `.docs/sdd/tech-stack.md` («Un sujeto de `sdd-archive` cuesta ~0,70 $»).
- **Dónde en el kit**: `skills/sdd-agent-writing/SKILL.md`, «A forecast of a test campaign»
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Esta feature movía a `references/` decenas de reglas, y la previsión puso 6 sujetos de REFACTOR en total. Además elegí el precio de otra feature (0,45 $) frente al de `tech-stack.md` (~0,70 $) sin decir por qué.
- **Coste**: 4 paradas del dev-lead por dinero; 61,82 $ frente a 42,90 $ previstos (walkthrough §2; enmiendas de la spec).
- **Propuesta**: que la línea de REFACTOR de la previsión se calcule contando las reglas que el Approach mueve a `references/` (n = 2 por regla), y que el precio por sujeto sea el de `tech-stack.md` salvo que la spec diga de dónde sale otro.
- **Verificada**: sí — contrastado con `skills/sdd-agent-writing/SKILL.md:24` y con la tabla de Previsión de coste de la spec
- **Criterio de aceptación**: GIVEN una spec cuyo Approach mueve 12 reglas de un `SKILL.md` a `references/` WHEN el agente escribe la Previsión de coste THEN la línea de REFACTOR lleva al menos 24 sujetos y el precio por sujeto cita `tech-stack.md`.

### 2. Al mover texto a `references/`, se perdieron frases que la procedencia de la batería había medido en el paso

- **Qué pasó**: 10 sujetos del GREEN fallaron por texto que pasó a `references/` o que se resumió al moverlo. Tres ejemplos: la fila «No se repite» con el error entero, sin «…» (`a3f`); el gate sin filtro cuando la base trae un fichero de «Sin filtro» (`g8`, 3 de 3); y la condición de la suite en la validación en campo (`g5`: 0/3 con la rama, 1/1 con el kit de `develop`). La procedencia de `battery.md` ya decía, para la primera, «GREEN con la regla solo en la receta, 0/1 (no la abrió); en el paso 6 del `SKILL.md`, 2/2».
- **Fuente**: filas de procedencia de `tests/batteries/sdd-archive/battery.md` (a3f, g5, g8); fases `green`, `refactor`, `refactor2`, `final` y `control-final` de la carpeta de la spec; §4.3 del walkthrough.
- **Dónde en el kit**: `skills/sdd-agent-writing/references/skill-mechanics.md` (dónde va el texto de un paso) y el Approach de la spec, que eligió qué se movía
- **Por qué el kit no lo evitó**: ninguna regla pide cruzar lo que se mueve con la procedencia de la batería, que dice dónde se midió cada frase.
- **Coste**: unos 17 $ de sujetos en tres tandas para devolver frases (`refactor` 6,19 $, `refactor2` 4,45 $, `final` y `control-final` 4,04 $: §2 del walkthrough), y `g5` cerrado en rojo.
- **Propuesta**: antes de mover una frase de un `SKILL.md` a `references/`, buscarla en la procedencia de su batería; si una fila dice que se midió en el paso, la frase se queda en el paso.
- **Verificada**: sí — contrastado con la fila de procedencia de `a3f` de `tests/batteries/sdd-archive/battery.md`
- **Criterio de aceptación**: GIVEN una frase con una fila de procedencia «en el paso 6 del `SKILL.md`, 2/2» WHEN el plan de una feature la mueve a `references/` THEN el repaso de coherencia la marca y el plan la deja en el paso.

### 3. Un `git push origin HEAD:develop` a mano corrió sin que nada lo parara

- **Qué pasó**: en la Task 3 falló un `cd`, y una orden pensada para otro directorio corrió en el worktree de la rama: `git push origin HEAD:develop` (Git Bash). El remoto la rechazó solo porque `develop` iba por delante (non-fast-forward). Comprobé después que `develop` seguía igual, en local y en el remoto.
- **Fuente**: ledger de la Task 3; fila de deuda «Un `git push <remoto> HEAD:<integración>` a mano no lo para ningún hook» en `.docs/sdd/roadmap.md`; §5 del walkthrough (retro).
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 7 («never `git merge`, `git pull`, `git push` or `HEAD:<destino>` by hand») y los hooks del repo (`.claude/hooks/`)
- **Por qué el kit no lo evitó**: la prohibición solo está en el texto, y un `cd` fallido no la lee.
- **Coste**: ninguno medido; el riesgo era publicar la rama en la integración sin `sdd merge` ni su verificación.
- **Propuesta**: un hook `PreToolUse` que deniegue `git push` hacia `merge.into` o con un refspec `HEAD:<rama de integración>`, y que nombre `sdd merge`. Para las órdenes de prueba, `set -e` y rutas absolutas.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una sesión en el worktree de una feature WHEN corre `git push origin HEAD:develop` THEN el hook lo deniega y nombra `sdd merge --push`.

### 4. Los moldes de la batería medían otra cosa: el borrador de validación usaba un dato inválido, y el remoto de `pk1` era una carpeta local

- **Qué pasó**: hubo dos fallos de molde.
  - `validated0010` validaba con `--motivo sala-ocupada`, que la app del molde rechaza, desde `f561e64e`. Los sujetos de `g5` y `g8` lo vieron, descartaron esa validación y ya no tenían una suite que cruzar.
  - En el primer GREEN, el remoto de `pk1` era una carpeta local. Un sujeto lo vio con `git remote -v` y no relanzó por HTTPS. El molde pasó a `git@github.com:fake/reservas.git`, con un ssh falso y un `insteadOf` identidad.
- **Fuente**: `tests/batteries/sdd-archive/subject.mjs` (`validated0010`, `publickeyRemote`); procedencia de `g8` y de `pk1` en `battery.md`; enmiendas de la spec del 2026-11-05.
- **Dónde en el kit**: `tests/batteries/sdd-archive/subject.mjs`; el ensayo en seco de `tests/headless/battery.mjs run` (`DRY_RUN=1`)
- **Por qué el kit no lo evitó**: el ensayo en seco construye el molde, pero no ejecuta lo que el molde dice que pasó, como el smoke del borrador o el `git remote -v`.
- **Coste**: unos 3,5 $ en 5 sujetos que midieron otra conducta (`g5` y `g8` del GREEN y del `refactor`), más 2 sujetos de `green2` para `pk1`.
- **Propuesta**: que un molde pueda declarar comprobaciones de ensayo en seco (el comando del borrador sale con 0, el remoto se ve como el del escenario) y que `DRY_RUN` las corra.
- **Verificada**: sí — ensayo en seco con `KEEP_MOLD=1`: el molde nuevo de `pk1` da `git@github.com:fake/reservas.git` en `git remote -v`, el push normal falla con publickey y el relanzado llega al bare
- **Criterio de aceptación**: GIVEN un molde cuyo borrador valida con un comando que sale con error WHEN corre `battery.mjs run` con `DRY_RUN=1` THEN el ensayo falla y nombra el comando.

### 5. El cierre para a preguntar tras una re-revisión del 0.6 que trae hallazgos

- **Qué pasó**: 6 de unos 63 sujetos (`m1-1`, `m3-2`, `m4-2` y `g3-2` del GREEN, `e1-1` del `refactor` y `a3f-1` del `refactor2`) paran a preguntar al dev-lead tras la re-revisión del tramo posterior a la revisión final. La re-revisión encuentra el ruling del molde que describe un gate que no existe. En vez de cerrar la pasada, el sujeto ofrece opciones. No tengo control con `develop`: el de `m1` no cupo en el tope.
- **Fuente**: `texts.txt` de esos sujetos en las fases de la carpeta de la spec; fila de deuda «El cierre para a preguntar tras una re-revisión del 0.6 con hallazgos» en `.docs/sdd/roadmap.md`.
- **Dónde en el kit**: `skills/sdd-archive/references/final-review-check.md` («write nothing until it's back and closed») y «Closing the review» de `skills/sdd-verify/SKILL.md`
- **Por qué el kit no lo evitó**: «closed» no dice que en `delegate` los hallazgos de método se adjudican sin preguntar.
- **Coste**: escenarios que no llegan a lo que miden; en campo, una parada del dev-lead por cierre con re-revisión.
- **Propuesta**: primero el control con el kit de `develop` (`m1`, n = 2). Si también para, el 0.6 remite a «Closing the review» por su forma, sin pedir decisión en `delegate`.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `delegate`, un commit tras la revisión final y una re-revisión con un Important de registro WHEN el cierre la recibe THEN la arregla o la adjudica con un ruling y sigue, sin preguntar.

### 6. La «Verificación» de la task GREEN, `battery.mjs verdict` por fase, no puede salir con 0

- **Qué pasó**: el plan pedía `node tests/headless/battery.mjs verdict <battery.md> <salida>` con cada escenario en verde. Cada fase guarda solo parte de los escenarios, y la batería lleva escenarios de otras skills (`w1`, `w2`, `rc1`), así que el veredicto de cualquier fase sale con 1 o con 3. `sdd task done` registró la task con `battery.mjs plan`, y el veredicto se leyó por fase y a mano.
- **Fuente**: salida de `battery.mjs verdict` sobre `green/out`, `green2/out`, `refactor/out` y `refactor2/out` («rc=1», «rc=3»); `## Rulings` de `tasks.md`.
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md` (la «Verificación» de una task de batería) y `tests/headless/battery.mjs verdict`
- **Por qué el kit no lo evitó**: el plan no nombra un comando de veredicto que una varias fases o filtre por los escenarios lanzados.
- **Coste**: un ruling y una «Verificación» registrada con otra orden; sin respaldo en minutos.
- **Propuesta**: `verdict` con `SCENARIOS` y varias carpetas de salida, que tome el último sujeto de cada escenario.
- **Verificada**: sí — reproducido con `node tests/headless/battery.mjs verdict tests/batteries/sdd-archive/battery.md <fase>/out` en Git Bash
- **Criterio de aceptación**: GIVEN las fases `green` y `refactor` de una campaña WHEN corre el veredicto con las dos carpetas y los escenarios lanzados THEN sale con 0 si el último sujeto de cada escenario pasa.

## Lo que hice por iniciativa propia

- Control con el kit de `develop` del escenario que seguía en rojo (`g5`) para separar la regresión de lo que ya fallaba: dio 1/1 con `develop` y 0/1 con la rama, y llevó a la frase que faltaba. Funcionó.
- Para volver a los objetivos de bytes y palabras tras el REFACTOR, recorté solo lo que repetían otros sitios de la misma skill (filas de excusas que repetían banderas rojas, punteros dobles). Pasaron los topes; sin medir con sujetos.
- Escenario nuevo `tk1w`, con la rama en un worktree enlazado, cuando la revisión final vio que `tk1` no probaba «puedes borrar el worktree». Pasó 1/1.

## Funcionó, no tocar

- El tope de la campaña en `battery.mjs run`: paró en el umbral cada vez, sin pasarse, y nombró lo que quedaba por correr.
- La revisión final en ejes, con la pasada única de fix y la re-revisión única: el eje Spec encontró la protección de `discard` movida y la mitad de `tk1` sin probar, y el de Código, una remisión colgante.
- `sdd merge --sync` y `sdd merge --push`: integraron la base sin conflictos y publicaron a la primera.

## Menores

- `RUNS_DIR` largo dio «Filename too long»; con `.temp/<corto>` fue bien — `tech-stack.md` ya lo dice, no lo apliqué de primeras.
- Una `|` sin escapar en el regex de una fila de rúbrica da «comprobación mal escrita»; ahora en `tech-stack.md` — `tests/headless/battery.mjs`.
- Un `rm -rf` de una carpeta de `.temp/` lo denegó el harness porque el cwd de la shell se había quedado dentro de ella — no localizado.
- No anoté la línea `Ruling: compactación` del ledger tras compactar en la Task 3 — `skills/sdd-implement/SKILL.md`, «Method».
- `kit:own` da 5 frases repetidas más en `sdd-archive` con otras skills; van a la 0311 — `tests/` de `kit:own`.
- En 7 de 45 sujetos la línea «Terminado» no queda la última, casi siempre por la oferta del ticket detrás; sin control con `develop` — `skills/sdd-archive/SKILL.md` paso 9.7.
- `g3d-1` no ofrece el panel de `sdd validation serve` con `dev-validation.md` leído; es la fila de deuda abierta «El plan B se ofrece en 3 de 4 sujetos…» — `skills/sdd-archive/references/dev-validation.md` §6.
- `a1-2` (A3) y `ci1-2` (K2) en rojo, un caso cada uno — la batería de `sdd-archive`.
