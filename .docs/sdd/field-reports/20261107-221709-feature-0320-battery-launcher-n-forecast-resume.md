---
kit_version: 2.3.4
lane: feature
id: 20261107-221709-feature-0320-battery-launcher-n-forecast-resume
task: 0320
mode: full
date: 2026-11-07
---

# Ticket para el kit — feature 0320: el lanzador de baterías baja n, lee un rango, prevé el coste, reanuda y lee el slash

## Contexto

- Carril y modo: feature full, perfil delegate, `validation.mode: field`, ejecución Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio repo del kit; herramienta de pruebas en Node (`tests/headless/`) con Vitest
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisores de spec, eje Código), Opus 5.5 (eje Spec, re-revisión); un sujeto Sonnet para el humo
- Coste en reloj: 0,67 h de esfuerzo real (reloj de sesión 1,05 h sin 23 min de espera) frente a 2 h estimadas de implementación
- Coste en tokens: hilo 41.890.218; subagentes 2.645.400 en 5 despachos; sesión 17,16 $; sujetos 0,71 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La línea `Pasada de fix:` cuenta «hallazgos RED→GREEN» aunque los Minor se arreglen sin test (segundo caso)

- **Qué pasó**: con `review.minors: fix`, la pasada arregló 6 Minor de cobertura, comentario, `export` y lectura de un argumento, ninguno reproducible con un test que fallara antes. La forma fija de `tasks.md` obliga a escribir `Pasada de fix: <sha>, <n> hallazgos RED→GREEN`; quedó «0 hallazgos RED→GREEN (6 Minor arreglados sin test…)», que se lee como una pasada vacía. El ticket de la feature 0307 lo dejó como menor; este es el segundo caso.
- **Fuente**: `skills/sdd-verify/references/closing-the-review.md:31` (la forma de `Pasada de fix:`) frente a `:9` (Native admite «without a test … `Final: fixed <finding> — suite <N>/<N>`»); `tasks.md` de la 0320; `.docs/sdd/field-reports/20261105-172242-feature-0307-verify-and-tdd.md`, «Menores».
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md`, «`tasks.md`».
- **Por qué el kit no lo evitó**: la línea de `tasks.md` solo prevé arreglos con test, y el párrafo de Native permite arreglos sin test.
- **Coste**: ~3 min de redactar una línea que no encaja; el riesgo es que un lector de `tasks.md` crea que la pasada no arregló nada (sin respaldo).
- **Propuesta**: `Pasada de fix: <sha corto>, <n> RED→GREEN · <m> sin test`, sustituyendo la forma actual.
- **Verificada**: sí — contrastado con `closing-the-review.md:9` y `:31`.
- **Criterio de aceptación**: GIVEN una pasada de Native con 2 hallazgos con test y 3 Minor sin test WHEN se escribe `tasks.md` THEN la línea es `Pasada de fix: <sha>, 2 RED→GREEN · 3 sin test`.

### 2. Un humo con sujetos de pago en la «Verificación» de una task no tiene sitio: cerré la task antes de que acabara

- **Qué pasó**: la Task 1 llevaba en su «Verificación» un sujeto real (~5 min, 0,71 $). No pasaba de 10 min, así que no iba a «Verificación lenta», pero bloqueaba el cierre de la task. Lo lancé en segundo plano, cerré la task con su Vitest y anoté el humo como ruling para no parar la Task 2; su salida entró más tarde en otro commit.
- **Fuente**: `plan.md` de la 0320, Task 1, «Verificación»; ruling `Task 1` del ledger, copiado en `tasks.md`, «Rulings»; salida del humo `smoke-n1: 1 sujetos · 0.71 $`.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, «Verificación lenta», y `skills/sdd-implement-native/SKILL.md`, «The completion contract».
- **Por qué el kit no lo evitó**: «Verificación lenta» se decide solo por duración (> 10 min), no por que el comando lance sujetos de pago; y el contrato de cierre de Native pide que la verificación de la task haya corrido.
- **Coste**: un ruling y un commit de evidencia aparte (juntado en el cierre); ningún dinero de más.
- **Propuesta**: «Verificación lenta» cubre también un comando que lanza sujetos, sustituyendo el criterio de «más de 10 min» por «más de 10 min o con sujetos de pago».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un plan cuya task verifica con un sujeto real de 5 min WHEN se escribe el plan THEN ese comando va a «Verificación lenta», y el hilo lo lanza en segundo plano sin ruling.

### 3. La interfaz que fijó el plan no podía dar el valor que pedía la spec

- **Qué pasó**: el plan fijó `forecastCost(rows, specsRoot, fs)` con las filas ya filtradas por `SCENARIOS`; la decisión 1 de la spec pide que un escenario sin medir tome la media de toda la batería. Con esa firma, el respaldo salía de los filtrados. Lo vi al implementar y lo partí en `scenarioPrices` + `forecastCost`, con un ruling.
- **Fuente**: `plan.md` de la 0320, Task 3, «Interfaces»; `spec.md`, decisión 1; ruling `Task 3` en `tasks.md`.
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md`, «Self-review», punto 3 («Type consistency»).
- **Por qué el kit no lo evitó**: el repaso de tipos compara las firmas entre tasks, no si los argumentos de una firma bastan para el valor que fija la spec.
- **Coste**: ~3 min y un ruling; la revisión final lo dio por mejora justificada.
- **Propuesta**: en «Type consistency», «y que cada firma recibe lo que necesita para el valor de la spec que produce», sustituyendo la frase actual.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuyo valor depende de la tabla entera y un plan cuya firma recibe solo las filas filtradas WHEN el repaso de tipos del plan THEN lo señala antes de ejecutar.

## Lo que hice por iniciativa propia

- Medí la previsión contra el control de la 0306 sin sus propias campañas (backtest ocultando las carpetas de spec desde la 0306): con ellas daba −2,0 %, que se cumple por construcción; sin ellas, −16,1 %. Los dos revisores de la spec lo pidieron después. Candidato a regla de batería: «una previsión que se mide contra una campaña guardada la excluye del precio».

## Funcionó, no tocar

- Los dos revisores de la spec en Sonnet: 20 hallazgos, 18 aceptados, y la spec ganó casos de borde que luego fueron tests.
- La re-revisión única en Opus sobre la pasada de fix: corta y con veredicto por hallazgo.
- `sdd merge --sync` y `--push` con la CI de la rama leída antes: sin fricción.

## Menores

- `sdd-implement-native` enlaza `implementer-prompt.md#quality-decalogue`, pero el encabezado está sangrado dentro de un bloque de código y no hay ancla; un `awk` por el encabezado no lo encontró — `skills/sdd-implement-native/SKILL.md:144`.
- La desviación de tiempo compara la estimación de implementación (2 h) con el esfuerzo de toda la sesión (0,67 h, spec y plan incluidos): −66 % no dice nada — `skills/sdd-templates/templates/walkthrough-template.md`, «Tiempo y coste».
