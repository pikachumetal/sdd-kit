---
kit_version: 3.0.4
lane: feature
id: 20261125-141331-feature-0365-hotfix-spike-validate
task: 0365
mode: full
date: 2026-11-25
---

# Ticket para el kit — feature 0365: el hotfix y el spike validan en `sdd-validate`

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-spec-writing`, `sdd-grilling`, `sdd-spec-approval`, `sdd-spec-review`, `sdd-parallel-agents`, `sdd-plan-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-validate`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en Node, baterías de sujetos headless)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (revisor de dominio, eje Spec, re-revisión), Sonnet 5.5 (revisor técnico, eje Código, revisión del diff de la vuelta, sujetos)
- Coste en reloj: 1,62 h frente a 1 h estimada (+62 %)
- Coste en tokens: hilo 43.434.229; subagentes 7.569.307 en 6 despachos; sesión 19,51 $ y sujetos 14,41 $ en 16

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un molde de spike que el sujeto puede releer hace fallar la regla por el molde

- **Qué pasó**: el molde `reservas-spike` de `vf9` se rehízo tres veces. Primero, su `medir-libres.mjs` era un esqueleto que solo imprimía una línea, y los sujetos del RED lo releyeron y reabrieron O1. Después estaba en `.docs/sdd/specs/` mientras la regla nueva dice «outside its `changes/` folder», y el eje Spec lo marcó Important. Por último, su spec decía `Validación: agente` con un objetivo que pide una persona, y el script medía un modelo de `freeRooms` y no la función: tras la pasada de fix, `vf9` dio 1/2, hubo parada con el dev-lead y una Task 4.
- **Fuente**: `tests/sdd-validate-0365-red.md` («Primera tanda descartada»); `tests/sdd-validate-0365-green.md` («Tras la pasada de fix» y «Task 4»); `ROADMAP.md`, fila 0365; walkthrough de la feature, §2 y §3.
- **Dónde en el kit**: `.docs/sdd/steering/operations.md`, «Baterías por skill»: no hay regla sobre lo verosímil que tiene que ser un molde que el sujeto relee (scripts, specs, rutas).
- **Por qué el kit no lo evitó**: la sección cubre la forma de las filas de rúbrica y los techos de coste, no la coherencia interna del molde con la regla que mide.
- **Coste**: ~1,5 $ de sujetos descartados, la Task 4 (1,70 $) y una parada con el dev-lead; la desviación de +62 % del reloj la explica el walkthrough §2.
- **Propuesta**: una línea en «Baterías por skill»: antes del RED, el molde se lee como lo leerá el sujeto, y cada script que el molde deja se ejecuta y mide lo que su spec dice; la ruta del molde es la que nombra la regla medida.
- **Verificada**: sí — contrastado con `tests/sdd-validate-0365-green.md`: con el molde arreglado, `vf9` pasó de 1/2 a 2/2.
- **Criterio de aceptación**: GIVEN un molde nuevo con un script de medida · WHEN se escribe antes del RED · THEN el script corre en la construcción del molde y su salida es la evidencia que cita `research.md`, y ningún sujeto del RED reabre una fila por el molde.

### 2. El pre-commit del repo mira el árbol de trabajo: un `dist/` reconstruido y sin stagear pasa

- **Qué pasó**: las tres tasks se commitearon stageando `skills/` por ruta, sin `dist/`. El pre-commit (`moon run cli:typecheck cli:test kit:roadmap kit:own kit:skill-size`) salió verde porque `dist/` estaba reconstruido en el árbol de trabajo. Los dos ejes de la revisión final lo marcaron (Important en Spec, Minor en Código).
- **Fuente**: `.githooks/pre-commit` (`const checks = ['run', 'cli:typecheck', 'cli:test', …]`); `git status --porcelain` tras la Task 3 → ` M dist/skills/sdd-validate/SKILL.md` y cuatro más.
- **Dónde en el kit**: `.githooks/pre-commit`; `skills/sdd-implement-native/SKILL.md`, «Complete the task» («staging by path»), que no recuerda que en este repo `dist/` viaja con `skills/`.
- **Por qué el kit no lo evitó**: el test que compara `dist/` con el build corre sobre los ficheros del disco, no sobre el índice.
- **Coste**: ~10 min (un Important de la revisión final, entró en la pasada de fix); sin el eje Spec, la CI de la rama habría dado rojo.
- **Propuesta**: que el pre-commit falle si el índice toca `skills/` y no `dist/` con el build al día (`git diff --cached --name-only` cruzado con `moon run kit:build` y `git diff --quiet -- dist`).
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `skills/sdd-validate/SKILL.md` editado y `dist/` reconstruido sin stagear · WHEN `git commit -- skills/sdd-validate/SKILL.md` · THEN el pre-commit para con «`dist/` no viaja con `skills/`».

### 3. Los sujetos de `sdd-validate` preguntan antes de volver a `sdd-implement` y no invocan `sdd-archive` tras registrar

- **Qué pasó**: en las cuatro tandas de `vf9` (8 sujetos) ninguno invocó `sdd-archive` tras registrar la validación en campo: lo dejaron «a la orden del dev-lead». En la Task 4, `vf9-2` paró con «¿Arranco la Task 3 ahora con `sdd-implement`?» antes de volver.
- **Fuente**: `tests/sdd-validate-0365-green.md`, sección «Task 4»; `skills/sdd-validate/SKILL.md`, «A failure goes back to `sdd-implement`» («without asking») y «Order» paso 5.
- **Dónde en el kit**: `skills/sdd-validate/SKILL.md`, «Order» paso 5 y «A failure goes back to `sdd-implement`».
- **Por qué el kit no lo evitó**: la regla existe; en `validation.mode: field` y `delegate` el sujeto la lee como una parada del merge, porque `sdd-archive` fusiona.
- **Coste**: la cláusula «solo entonces invoca `sdd-archive`» del spike quedó sin observar (walkthrough §4.2, «no probado»).
- **Propuesta**: un escenario de `sdd-validate` en `field` + `delegate` cuya fila falle si el sujeto no invoca `sdd-archive` tras registrar; si da rojo, decir en el paso 5 que con el registro escrito el paso a `sdd-archive` no se pregunta.
- **Verificada**: sí — observado en 8 de 8 sujetos (`*.tools.txt` sin `>>> Skill: sdd-kit:sdd-archive`).
- **Criterio de aceptación**: GIVEN `vf9` con la validación en campo registrada · WHEN el sujeto acaba el paso 5 · THEN `tools.txt` lleva `>>> Skill: sdd-kit:sdd-archive` sin una pregunta antes.

## Lo que hice por iniciativa propia

- El molde corre su propio script de medida al construirse y escribe su salida como evidencia, en vez de pegar cifras: así la evidencia es reproducible y el sujeto que vuelve a correr el script obtiene lo mismo. Funcionó (`vf9` 2/2 en la Task 4).

## Funcionó, no tocar

- La re-revisión de Opus cazó que el criterio de éxito de la spec («`vf9` 2/2») no se cumplía tras la pasada de fix y lo llevó a parada en vez de a ruling.
- `kit:own` rechazó la forma «only … instead of» de las dos frases nuevas antes de commitear.

## Menores

- La spec aprobada fijó un literal de skill que `kit:own` rechaza; la revisión de coherencia de la spec no corre `kit:own` sobre los literales — `skills/sdd-spec-approval/SKILL.md`, paso 1
- `sdd task done` con `battery.mjs verdict` sin la carpeta de salidas sale con el uso y no registra; el plan no daba el comando completo — `skills/sdd-templates/templates/plan-template.md`, «Verificación»
- `vf8` salió limpio en el RED: la excepción del hotfix en el paso 7 de `patch-flow.md` no la seguía ningún sujeto, porque el paso nombra primero `sdd-validate` — `tests/batteries/sdd-validate/battery.md`, `vf8`
