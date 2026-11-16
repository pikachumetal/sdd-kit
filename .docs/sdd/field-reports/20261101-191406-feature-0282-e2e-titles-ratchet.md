---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261101-191406-feature-0282-e2e-titles-ratchet
task: 0282
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0282: el test de títulos E2E con ratchet

## Contexto

- Carril y modo: feature, full, perfil `delegate`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit, con sujetos sobre copias de dos suites reales
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: ejes Spec y re-revisión en Opus; eje Código y sujetos en Sonnet
- Coste en reloj: 1,53 h frente a 1,5 h
- Coste en tokens: 12,53 $ de sesión a la hora del walkthrough, 6,66 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Dije en la evidencia lo que el sujeto contó, sin comprobarlo, y la regla no se cumplía

- **Qué pasó**: escribí «las 2 configs» en la evidencia de `a1-2`. El test del sujeto listaba solo la config por defecto y dejaba fuera 15 títulos; el de `m1-1`, igual. Las sondas de entonces no tocaban la segunda config, así que salían bien. Lo destapó el eje Spec por un recuento que no cuadraba (70 frente a 89). Costó la pasada de fix y 3 sujetos más.
- **Fuente**: `tests/e2e-titles-ratchet-green.md`; salida de los ejes en la sesión; `.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/walkthrough.md`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, §Testing (ya apunta el aprendizaje); `skills/sdd-verify/SKILL.md`, «Agent delegation».
- **Por qué el kit no lo evitó**: la tabla «Agent reports success → verify» habla de subagentes, no de lo que hizo un sujeto en su molde.
- **Coste**: ~1,5 $ de sujetos y una re-revisión con hallazgos; sin medir aparte.
- **Propuesta**: ninguna regla nueva: el aprendizaje ya está en `tech-stack.md`. Si hay segundo caso, una sonda por cada cláusula del THEN antes de escribir la evidencia.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un sujeto que dice haber cubierto N configs WHEN se escribe su fila de evidencia THEN una sonda sobre la config N sale en rojo y lo demuestra.

### 2. El plan marcó ✓ tres coberturas sin una sonda que existiera

- **Qué pasó**: §4 del plan marcaba ✓ «título en la lista, verde», «la task no añade su línea» y `projects`. `probes.mjs` no tenía esas sondas y el lanzador pedía «sin título nuevo». Lo cazó el eje Spec.
- **Fuente**: `.docs/sdd/specs/20261101-171153-feature-0282-e2e-titles-ratchet/plan.md` §4; informe del eje Spec.
- **Dónde en el kit**: `skills/sdd-propose/references/plan-writing.md`, «Self-review», punto 1.
- **Por qué el kit no lo evitó**: el punto pide señalar a qué task y test va cada cláusula, pero una sonda o un escenario que aún no existe pasa igual.
- **Coste**: un sujeto (`a3`) y una vuelta de sondas.
- **Propuesta**: nada mientras sea un caso.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un ✓ de §4 que nombra una sonda WHEN acaba la task THEN esa sonda existe en el lanzador con ese nombre.

### 3. Una campaña que no lanza ningún sujeto sale con código 0

- **Qué pasó**: sin `SUPERPOWERS_DIR`, `run.mjs` imprimió `el kit declara dependencies: define SUPERPOWERS_DIR` por cada sujeto, `sujetos de la campaña: 0`, y salió con 0. Me di cuenta al no encontrar sus salidas. Es el segundo caso del hallazgo 2 del ticket de la 0278: una campaña sin sujetos válidos da verde.
- **Fuente**: salida de `node tests/headless/run.mjs` en Git Bash; `tests/headless/lib.mjs`, `checkInputs`.
- **Dónde en el kit**: `tests/headless/campaign.mjs`; no es de una skill.
- **Por qué el kit no lo evitó**: la cabecera de `run.mjs` no nombra esa variable entre las necesarias, y `REQUIRED` de `campaign.mjs` tampoco.
- **Coste**: una espera, 0 $.
- **Propuesta**: que `readConfig` compruebe esa variable, y que salga con un código distinto de 0 sin ningún sujeto lanzado.
- **Verificada**: sí — reproducido con `node tests/headless/run.mjs` en Git Bash.
- **Criterio de aceptación**: GIVEN un kit con `dependencies` y sin `SUPERPOWERS_DIR` WHEN corre `run.mjs` THEN sale con un código distinto de 0 antes de lanzar.

### 4. Tras la única re-revisión, un Important obliga a arreglar sin ojos nuevos

- **Qué pasó**: la re-revisión dejó dos Important que trajo la pasada de fix. Los arreglé en la guía y quedaron como `sin revisar`, como dice la regla. Justo el texto final de la regla 1 no lo ha visto ningún revisor; solo lo respalda un sujeto.
- **Fuente**: `skills/sdd-verify/SKILL.md`, «What it leaves open»; `walkthrough.md` §4.2.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Por qué el kit no lo evitó**: la regla existe y es deliberada; la anoto como coste, no como fallo.
- **Coste**: ninguno observado aún.
- **Propuesta**: nada; mirar en campo si esa regla 1 falla.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN el primer proyecto que adopte el test WHEN declare un flujo core THEN el test sale en verde sin tocarlo.

## Lo que hice por iniciativa propia

- Sondas a mano sobre el test de cada sujeto, en vez de leer su informe: fueron las que separaron el texto bueno del malo. Es candidato a patrón de `tests/headless`.
- Salidas de los sujetos fuera del repo, por llevar títulos de producto de clientes.

## Funcionó, no tocar

- La revisión en dos ejes: el Spec cazó lo que el Código no podía ver, y ninguno repitió al otro.
- `sdd merge --sync` más el gate tarea a tarea: en verde a la primera, sin los timeouts de la pasada en paralelo.

## Menores

- `git clone` en el scratchpad falla con `Filename too long` sin `core.longpaths`; `RUNS_DIR` ya tiene su tope, los clones de molde no — `tests/headless/campaign.mjs`
- Dos sujetos inválidos por una sustitución de mi script que no comprobó que hubiera cambiado algo — no localizado
- Mis sondas fallaron tres veces por la config mínima de Vitest (`cwd`, `globals`) antes de medir nada — no localizado
- `gh`, heredocs y comillas: un bloque de Bash con varios heredocs falló por comillas y no ejecutó nada — no localizado
