---
kit_version: 2.3.4
lane: feature
id: 20261108-180924-feature-0310-init-explore-release-feedback-rework
task: 0310
mode: full
date: 2026-11-08
---

# Ticket para el kit — feature 0310: quitar una regla repetida dejó sin disparador un paso relativo, y la campaña pasó el techo de coste

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native con 3 tasks, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-agent-writing`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del kit (skills en Markdown, CLI en TypeScript, baterías de sujetos headless)
- Modelo del hilo: Opus 5.5 (effort no registrado); compactó tras la pasada de fix de la revisión final
- Modelos de los subagentes: revisor de la spec sonnet; ejes Spec opus+high y Código sonnet+high; re-revisión opus+high; 8 sujetos sonnet
- Coste en reloj: 0,77 h frente a 1 h de implementación estimada (walkthrough §2, de `sdd session tokens`)
- Coste en tokens: 37.363.853 del hilo y 5.912.262 de subagentes; 19,12 $ de sesión y 1,65 $ de sujetos (walkthrough §2)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Quitar una regla repetida dejó sin disparador un paso que la nombraba por su orden

- **Qué pasó**: la decisión 4 quitó la regla «**Privacy**: never client…» de `sdd-feedback/SKILL.md`, porque la misma regla está en el bloque de privacidad de `kit-feedback-template.md`. El paso 5 decía «before saving, reread the whole ticket…», pero va después del paso 4, que guarda. En la tanda de REFACTOR, `fb1-2` guardó el ticket y no hizo el repaso: el nombre del fichero, el id y el título llevaban el dominio del molde. El control con el kit de `develop` salió limpio en el mismo escenario. Hasta entonces, la regla general de la skill tapaba el orden imposible del paso 5. Arreglo: sustituir la frase del paso 5 por «reread the saved ticket, file name and title included, against the template's privacy block, and replace each proper name or datum of the project's domain.». Tras el arreglo, `fb1` pasa 2 de 2.
- **Fuente**: `.docs/sdd/specs/20261108-144153-feature-0310-init-explore-release-feedback-rework/refactor/out/fb1-2/ticket.md` (id y título con el dominio) y `refactor/out/fb1-2.tools.txt` (el `Write` del ticket es la última llamada); `control/out/fb1-1/ticket.md` (limpio); `fix/out/fb1-1.tools.txt` y `fix/out/fb1-2.tools.txt` (repaso tras guardar); `green/lectura.md` de la misma carpeta.
- **Dónde en el kit**: `skills/sdd-feedback/SKILL.md` paso 5, ya sustituido en esta feature. La causa de fondo está en `skills/sdd-agent-writing/SKILL.md`, «Pruning» («single source of truth»): no dice que, antes de quitar la copia de una regla, hay que releer los pasos que la aplican por su posición.
- **Por qué el kit no lo evitó**: la ADR 0022 y `sdd-agent-writing` piden dejar la regla en un solo sitio, pero no piden comprobar que el paso que la aplica sigue llegando a ella en un orden posible. El revisor de la spec y los dos ejes no lo vieron antes del sujeto.
- **Coste**: un rojo nuevo en REFACTOR; un sujeto de control (0,20 $); la pasada de fix; dos sujetos tras el arreglo (0,46 $); y una parada del dev-lead para subir la previsión (enmienda de la spec). Respaldo: walkthrough §1 y §3 y la enmienda de `spec.md`.
- **Propuesta**: en «Pruning» de `sdd-agent-writing`, sustituir la frase de la fuente única por una que pida, al quitar una copia, releer cada paso que nombra esa regla y comprobar que su orden lo deja aplicarla («before X» en un paso posterior a X es un paso muerto).
- **Verificada**: sí — RED `refactor/out/fb1-2` (1 de 2) frente a `control/out/fb1-1` (1 de 1); GREEN `fix/out` (2 de 2) con la sustitución.
- **Criterio de aceptación**: GIVEN una skill con una regla repetida en su plantilla y un paso posterior al guardado que dice «before saving, reread…» WHEN un agente con `sdd-agent-writing` quita la copia de la skill THEN su propuesta reescribe también ese paso, o dice que su orden ya llega a la regla.

### 2. `battery.mjs run` pasa el techo de coste de la previsión enmendada

- **Qué pasó**: la previsión se enmendó a 8 sujetos y la tanda se lanzó con `COST_CAP=1.58` (1,38 $ gastados más 0,20 $ del sujeto anterior). El último sujeto costó 0,28 $, y la campaña cerró en 1,65 $. El lanzador estima el coste del siguiente sujeto como `COST_CAP` dividido entre el techo de sujetos, y no vuelve a comprobarlo con el coste real.
- **Fuente**: salida de `node tests/headless/battery.mjs run --resume` (PowerShell) → `fix: 2 sujetos · 0.46 $` y `sujetos de la campaña: 8 · coste acumulado: 1.65 $`; `tests/headless/run.mjs:12-13` (cabecera: «(en curso + 1) × SUBJECT_COST (COST_CAP / techo de sujetos)»).
- **Dónde en el kit**: `tests/headless/run.mjs`, cabecera y comprobación previa al lanzamiento.
- **Por qué el kit no lo evitó**: el techo de coste se comprueba con una media antes de lanzar. Cuando la previsión deja poco margen, la media se queda corta frente al sujeto real.
- **Coste**: 0,07 $ por encima de lo aprobado por el dev-lead (walkthrough §2 y §3).
- **Propuesta**: estimar el siguiente sujeto con el coste medio que ya tiene `plan` para el escenario, y no con `COST_CAP` entre el techo. O avisar en el resumen final de la tanda cuando lo gastado pasa de `COST_CAP`.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una campaña con 1,38 $ gastados, `COST_CAP=1.58` y un escenario cuyo `plan` da 0,28 $ por sujeto WHEN corre `battery.mjs run` THEN no lanza el sujeto, o el resumen dice que lo gastado pasa del techo.

### 3. La pasada de fix arregló un Minor cambiando un literal que fija la spec

- **Qué pasó**: con `review.minors: fix`, la pasada de fix arregló el Minor Código 2 («The number of the line» sin referente). Lo hizo cambiando `release-notes.md:11` a «The `<N>` of the `smoke:` line…». Pero la decisión 3 de la spec fija el literal «The number of the line is never made up. The line reads…». La re-revisión lo dio como Important (un literal de la spec cambiado sin enmienda), y el cierre volvió al literal aprobado.
- **Fuente**: walkthrough §3 de la feature; `spec.md` decisión 3; `plan.md`, «De código» («Las sustituciones son literales, las de las decisiones 2 a 5»).
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md`, re-graduación y entrada de los Minors en la pasada. La batería de `sdd-verify` ya tiene `c10` y `c10e` (feature 0291: un Minor cuyo arreglo cambia una decisión aprobada).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: un Minor cuyo arreglo cambia un literal de una decisión aprobada es un desvío, no un arreglo. Es una regla que no se sostuvo con `review.minors: fix` en Native.
- **Coste**: un commit de vuelta y un Important en la re-revisión, que ya era la única: el arreglo quedó `sin revisar` (walkthrough §3).
- **Propuesta**: medir `c10` con `review.minors: fix` y Native, el hilo como implementador de la pasada. Si sale rojo, poner la comprobación «¿el arreglo toca un literal de una decisión de la spec?» en la frase que manda los Minors a la pasada, sustituyéndola.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `review.minors: fix`, Native, y un Minor cuyo arreglo natural cambia un literal de «Decisiones» de la spec WHEN el hilo hace la pasada de fix THEN no lo cambia: lo adjudica con un ruling o para como desvío.

### 4. `battery.mjs verdict` filtra por paso y no por `SCENARIOS`, y cuenta el n de la batería

- **Qué pasó**: el paso `release` de la batería de `sdd-retro` incluye `r6`, que no se lanzó. `verdict` lo daba como falta, y la verificación de `sdd task done` de la Task 2 tuvo que envolverse en un `node -e` que comprueba solo la línea de `r4`. Sobre `fix/out`, con dos sujetos de `fb1` (`N=2`), `verdict` da `fb1 · 1/1`, porque la batería declara n = 1.
- **Fuente**: `node tests/headless/battery.mjs verdict tests/batteries/sdd-feedback/battery.md <carpeta>/fix/out source` (PowerShell) → `fb1 · 1/1 · umbral 1/1 · puerta verde`; ruling de la Task 2 en `tasks.md` de la feature.
- **Dónde en el kit**: `tests/headless/battery.mjs`, subcomando `verdict`.
- **Por qué el kit no lo evitó**: `verdict` admite `[paso]` pero no lee `SCENARIOS` ni `N`, que `run` sí lee (feature 0320).
- **Coste**: unos minutos y un comando de verificación ilegible en la línea `complete` del ledger; sin respaldo en minutos.
- **Propuesta**: que `verdict` lea `SCENARIOS` y `N` como `run`.
- **Verificada**: sí — reproducido con el comando de arriba en PowerShell.
- **Criterio de aceptación**: GIVEN `SCENARIOS=r4` y una salida con solo `r4-1` WHEN corre `battery.mjs verdict <batería de sdd-retro> <salida> release` THEN da solo la línea de `r4`; AND GIVEN `N=2` y dos sujetos de `fb1` THEN da `fb1 · 2/2`.

### 5. El molde de los sujetos pone en `sdd-kit.json` una versión distinta de la del plugin cargado

- **Qué pasó**: los sujetos de `fb1` leen 3.0.0 en `.docs/sdd/sdd-kit.json` del molde y 2.3.4 en el `plugin.json` cargado. `fix/fb1-2` añadió por eso un hallazgo de «versiones que no cuadran», que enturbia la fila F1, la de la fuente de cada versión. La re-revisión lo vio también en el control con `develop`, así que es anterior a esta rama.
- **Fuente**: `fix/out/fb1-2/ticket.md` de la feature (hallazgo 3: `"version": "3.0.0"` frente a `"version": "2.3.4"`); re-revisión, fuera de alcance: `tests/headless/lib.mjs:300` (`kitVersion()`); `.claude-plugin/plugin.json:4` → `"version": "2.3.4"`.
- **Dónde en el kit**: `tests/headless/lib.mjs`, `kitVersion()`, y el molde `sesion` de `tests/batteries/sdd-feedback/`.
- **Por qué el kit no lo evitó**: no localizado de dónde sale el 3.0.0 de `kitVersion()` frente al 2.3.4 de `plugin.json`.
- **Coste**: no medido; ruido en la lectura a mano de F1.
- **Propuesta**: que el molde escriba en `sdd-kit.json` la versión del `plugin.json` del `KIT_DIR` con el que corre el sujeto.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `KIT_DIR` con `plugin.json` en 2.3.4 WHEN se monta el molde `sesion` THEN su `sdd-kit.json` dice 2.3.4, y `fb1` no da un hallazgo de versiones.

## Lo que hice por iniciativa propia

- Dejé escrito en la decisión 6 de la spec y en este ticket por qué P9 no se toca. La lista de `sdd-init/SKILL.md:31` pregunta si hay código; la de `sdd-verify` («Running a gate», punto 2) pregunta si la rama toca el build. Comparten diez nombres de manifiesto, y unificarlas haría que la init cuente un `tsconfig.json` como código o que el gate deje de ver un lockfile. Una auditoría futura con kit:own o con la tabla de la 0299 no debería reabrirlo. Funcionó: el revisor de la spec y los dos ejes lo aceptaron.
- En la decisión 4, añadí a la rúbrica de `sdd-feedback` una fila P (privacidad) antes de quitar la regla. Sin ella, la batería no habría visto el rojo de REFACTOR.

## Funcionó, no tocar

- El control con el kit de `develop` (spec, decisión 9) separó un rojo nuevo de uno de siempre con un solo sujeto.
- La parada por el techo de sujetos de `battery.mjs` («decide el dev-lead; subirlo exige enmendar la spec») llevó el dinero al dev-lead en el momento justo.
- La re-revisión única cazó el literal cambiado de la decisión 3 antes del merge.

## Menores

- Tras compactar, el comando de la tanda de fix (con sus variables de entorno) no estaba en el ledger y salió de buscar en el transcript — `skills/sdd-implement-native/SKILL.md`, «Setup» (ledger).
- El harness sirvió el texto viejo de `sdd-feedback` y `add-to-changelog`, editadas en esta misma sesión. Ya lo cubre la regla 1 de `CLAUDE.md`, y seguí `dist/` — no localizado en el kit.
- `r4` imprime «fatal: a branch named 'develop' already exists», del molde, no de la rama — `tests/batteries/sdd-retro/subject.mjs:107`.
