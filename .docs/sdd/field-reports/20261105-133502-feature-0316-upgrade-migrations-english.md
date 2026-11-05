---
kit_version: 2.3.4
lane: feature
id: 20261105-133502-feature-0316-upgrade-migrations-english
task: 0316
mode: full
date: 2026-11-05
---

# Ticket para el kit — feature 0316: traducir las 13 migraciones de sdd-upgrade al inglés

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, Native
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-grilling`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del propio kit (plugin de Claude Code, CLI en Node, una persona)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: revisor de la spec Opus; eje Spec Opus, eje Código Sonnet; re-revisión Opus; sujetos del humo Sonnet
- Coste en reloj: 0,88 h de esfuerzo real frente a 2,5 h estimadas de implementación
- Coste en tokens: 45.132.759 del hilo y 5.990.353 de subagentes; 19,94 $ de sesión y 1,39 $ de sujetos

Fuente del contexto: `.docs/sdd/sdd-kit.json` → `"version": "2.3.4"`, `ids.mode: sequence`; `sdd session tokens --path <worktree> --branch feature/0316-upgrade-migrations-english --artifact <carpeta>` → las cifras de reloj, tokens y coste; la salida de `battery.mjs run` → `green: 3 sujetos · 1.39 $`.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La rúbrica de review de spec da «ninguna» a una traducción con lectores literales, y el revisor que pidió el dev-lead encontró 3 Important

- **Qué pasó**: la rúbrica contó 2 señales (contrato público y `MODIFIED`), y propuse spec sin review. El dev-lead preguntó «¿has hecho revisión?» y pidió un revisor de siete puntos en Opus. Ese revisor encontró 3 Important que la pasada de coherencia no vio:
  - un título de paso de una migración que citan literal otras dos skills y una capacidad;
  - nombres de columnas del proyecto sin citar, que la traducción habría dejado en inglés en los documentos del proyecto;
  - una quinta línea de `sdd-upgrade/SKILL.md` que nombra «Verificación».
- **Fuente**: `spec.md` de la 0316, «✋ Decisiones», bloque de review y «Hallazgos de la review» (9 aceptados); `sdd session tokens` → «Revisión adversarial spec 0316 claude-opus-5-5 2.436.158 / 4 min».
- **Dónde en el kit**: `skills/sdd-propose/references/review-spec.md`, §1 y §2 (señales y nivel por defecto «ninguna» con 0-3 señales).
- **Por qué el kit no lo evitó**: ninguna señal recoge «el cambio reescribe texto que otros ficheros citan literal o que el proyecto recibe tal cual». El tamaño (~560 líneas) tampoco sube el nivel, solo lo baja. Es el segundo caso del remedio que la spec de la 0304 dejó como deuda («despachar ese revisor a mano antes del gate»).
- **Coste**: una parada del dev-lead y 2.436.158 tokens de Opus, ~4 min; respaldo: `spec.md`, «Decisiones tomadas con el dev-lead» («2», a la pregunta del nivel).
- **Propuesta**: una señal «texto citado o literal» en la tabla de §1: el Scope reescribe texto (una skill, una referencia, una plantilla) que otros ficheros citan literal, o que se escribe tal cual en el proyecto. Con ella y `MODIFIED`, el nivel sube a un revisor.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una spec que traduce `references/` con un `MODIFIED` y un Scope de ~500 líneas WHEN el sujeto aplica la rúbrica THEN propone un revisor, no «ninguna».

### 2. El plan fijó los literales de la traducción y la sesión Native no los aplicó en todos los ficheros

- **Qué pasó**: las Restricciones de código del plan fijaban «el paso se salta y lo dice» → «skip the step and say so». La v2.0.0 y la v2.3.0 lo usan, pero la v3.0.0 salió con «the step is skipped and says so» en seis frases. Además, «Tipo» y «Restricciones globales» de la v1.0.0 salieron sin citar. Los encontró el eje Spec de la revisión final, y entraron en la pasada de fix con 4 hallazgos más.
- **Fuente**: informe del eje Spec, «Important» 1 a 3; el commit de cierre de la 0316, «pasada de fix de la revisión final juntada».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Native loop», paso 3 (completion contract): la Verificación de la task es la del plan, y el plan no tenía un comando que buscara los literales fijos.
- **Por qué el kit no lo evitó**: la regla existía, en el plan, y no la apliqué en la v3.0.0, que traduje la última y entera de una pasada. La Verificación de la task solo pedía `cli:test` y `kit:own`, y ninguno de los dos mira esos literales.
- **Coste**: 7 hallazgos en la pasada de fix y una re-revisión de Opus de 246.969 tokens; respaldo: `tasks.md` de la 0316, «Pasada de fix» y «Re-revisión».
- **Propuesta**: en `plan-writing.md` de `sdd-propose`, cuando las Restricciones de código fijan literales de una traducción o un renombrado, la «Verificación» de cada task lleva un `grep` del literal viejo que debe salir vacío.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuyas Restricciones fijan «A» → «B» en varios ficheros WHEN el sujeto escribe la «Verificación» de cada task THEN incluye un `grep` de «A» con salida vacía como esperado.

### 3. La comprobación «absoluta con excepción» de `kit:own` choca con la traducción literal de «solo … salvo …»

- **Qué pasó**: la verificación de la v1.0.0 decía «→ solo `legacy.md` (salvo capacidades creadas después por tasks)». Su traducción literal dio el rojo `absoluta con excepción en la misma frase («only» … «except»)`. La reescribí con un ruling y perdí el «solo». El eje Código lo marcó Important, porque contradecía la ADR 0022, regla 1. La forma que vale, «no file other than X and Y», salió en la pasada de fix. Pasó lo mismo con «salvo que el dev-lead lo diga» en una celda que ya llevaba «only».
- **Fuente**: `moon run kit:own` en PowerShell → `dist/skills/sdd-upgrade/references/migrations/v1.0.0.md:19: absoluta con excepción en la misma frase («only» … «except»)`; informe del eje Código, «Important» 1.
- **Dónde en el kit**: la comprobación de `kit:own` (`tests/own/`) frente a `.docs/sdd/decisions/0022-three-rules-for-kit-text.md`, regla 1. La forma correcta ya está en `tech-stack.md`, «Traducir una skill con `kit:own` delante».
- **Por qué el kit no lo evitó**: ninguna guía de traducción decía cómo verter una restricción con salvedad sin la pareja que `kit:own` prohíbe. Las 0305, 0306, 0296 y 0307 traducen más `references/` con la misma presión.
- **Coste**: dos rulings, un Important en la revisión final y su fix; respaldo: `walkthrough.md` de la 0316, «Decisiones tomadas sin el dev-lead».
- **Propuesta**: llevar la línea de `tech-stack.md` al prompt de lanzamiento de las features de traducción (0305, 0306, 0296 y 0307), o al texto de rojo de `kit:own`: «si traduces, escribe "no X other than Y"».
- **Verificada**: sí — contrastado con `kit:own` en la rama: con «no file other than `legacy.md` and …», `moon run kit:own` → 0 líneas en `migrations/`
- **Criterio de aceptación**: GIVEN una referencia en castellano con «solo X, salvo Y» WHEN un sujeto la traduce con `kit:own` en la Verificación THEN escribe una frase exclusiva sin «only» y «except» juntos, y la revisión no la marca por perder el «solo».

### 4. `kit:own` da castellano dentro de código con doble comilla invertida

- **Qué pasó**: la tabla del paso 6 de la v3.0.0 lleva el texto que se escribe en el proyecto dentro de ` `` … `` ` (código con comillas invertidas dentro). `kit:own` marcó las dos filas como prosa en castellano. Pasé las dos parejas a cuatro bloques `text`, un cambio de forma que la revisión tuvo que juzgar.
- **Fuente**: `moon run kit:own` en PowerShell → `dist/skills/sdd-upgrade/references/migrations/v3.0.0.md:140: prosa en castellano; las skills van en inglés: «| `` - El `walkthrough.md` registra el tiempo real. Si la desviación…»`; el eje Código lo deduce de `spanish.ts:24-27`, que solo quita «…», comillas invertidas simples, comillas dobles y destinos de enlace.
- **Dónde en el kit**: la heurística de castellano de `kit:own` (`tests/own/`, el fichero que quita el código en línea).
- **Por qué el kit no lo evitó**: la heurística solo quita el código en línea de una comilla invertida, y la spec dejaba la heurística fuera de alcance.
- **Coste**: un ruling, una vuelta de build y prueba, y un Minor del eje Código; respaldo: `walkthrough.md` de la 0316, «Decisiones tomadas sin el dev-lead».
- **Propuesta**: que la heurística quite los spans de N comillas invertidas (CommonMark: abre y cierra con la misma longitud).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una celda `` | `` - El `x` registra el tiempo real. `` | `` en un `.md` de `skills/` WHEN corre `moon run kit:own` THEN no da prosa en castellano en esa línea.

### 5. El humo corrió con la n de la batería y no con la de la spec

- **Qué pasó**: la previsión de la spec decía `m1` y `v1` con n = 1 (2 sujetos, 1,1 $). `SCENARIOS="m1 v1"` corrió `v1` con su n de `battery.md` (2): 3 sujetos, 1,39 $.
- **Fuente**: salida de `battery.mjs run` → `green: 3 sujetos · 1.39 $`, `v1 · 2/2`; `tests/batteries/sdd-upgrade/battery.md`, fila `v1`, n = 2.
- **Dónde en el kit**: `tests/headless/battery.mjs`, cabecera («Cada escenario se lanza n veces con su modelo»), y la «Previsión de coste» de `spec-template.md`.
- **Por qué el kit no lo evitó**: el lanzador no admite otra n, y la plantilla de previsión no recuerda que la n sale de `battery.md`. Escribí n = 1 sin mirarla.
- **Coste**: 0,55 $ por encima de la fila GREEN, dentro del tope de 2,2 $; respaldo: `walkthrough.md` de la 0316, §2 y «Decisiones tomadas sin el dev-lead».
- **Propuesta**: un `N=<n>` opcional en `battery.mjs run` que solo aprieta, o que la ayuda de «Previsión de coste» diga «n de cada escenario, la de `battery.md`».
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `BATTERY=sdd-upgrade SCENARIOS="v1" N=1` WHEN corre `battery.mjs run` THEN lanza un sujeto y el veredicto usa el umbral escalado o lo dice.

## Lo que hice por iniciativa propia

- En la pasada de fix de Native, reproduje los Important de frases de skill con un `grep` antes y después en vez de un test, por la ADR 0019, y lo dejé en el ledger y en `tasks.md`. La re-revisión lo aceptó. Es candidato a regla: hoy «Closing the review» de `sdd-verify` pide un test que falle primero, y solo exime los Minor.

## Funcionó, no tocar

- `sdd capability merge` sobre una copia de `.docs/sdd` en la pasada de coherencia: el delta pasó igual al cierre.
- La regla 7 del `CLAUDE.md` y «CI de la base»: el rojo de `develop` era una descarga caída (`net::download_failed`), `gh run rerun --failed` lo dejó en `success` y el merge siguió sin parar.
- La re-revisión única, sobre el tramo de la pasada de fix y en su propio worktree: 7/7 resueltos con 3 llamadas.

## Menores

- `battery.mjs run` rechaza un `RUNS_DIR` de más de 100 caracteres, y el scratchpad de la sesión pasa de 140; el primer lanzamiento no corrió ningún sujeto y relancé en `.temp/<corto>` — `tests/headless/campaign.mjs` (`MAX_RUNS_DIR`).
- La rúbrica M1 de `tests/batteries/sdd-upgrade/battery.md` cuenta con `v2.3.4.md` como mayor migración, y con la v3.0.0 en el kit `m1` aplica las dos; lo puntué con la decisión 7 de la spec — `tests/batteries/sdd-upgrade/battery.md`.
