---
kit_version: 2.3.4
lane: feature
id: 20261105-172242-feature-0307-verify-and-tdd
task: 0307
mode: full
date: 2026-11-05
---

# Ticket para el kit — feature 0307: sdd-verify y sdd-tdd con las tres reglas

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-parallel-agents`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el repo del propio kit (skills en Markdown y CLI en TypeScript)
- Modelo del hilo: Opus 5.5, effort no registrado
- Modelos de los subagentes: Opus 5.5 (revisor de dominio de la spec y de la enmienda, eje Spec, re-revisión), Sonnet 5.5 (revisor técnico de la spec y de la enmienda, eje Código, 4 sujetos de humo)
- Coste en reloj: 0,87 h frente a 1,5 h estimadas de implementación
- Coste en tokens: hilo 58.642.517, subagentes 7.101.410 en 7 despachos; sesión 23,12 $, sujetos 2,04 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec fijó un recuento exacto de `kit:own` sin medir el efecto de mover texto de una copia a un fichero propio

- **Qué pasó**: «Dónde se prueba» decía que `kit:own`, filtrado por `sdd-verify|sdd-tdd`, dejaría «exactamente una línea». Al pasar el cierre de la revisión de `skills/sdd-verify/SKILL.md` (copia) a `references/closing-the-review.md` (propio) salieron dos líneas más: frases que ya repetían `sdd-archive/SKILL.md:24` y `sdd-implement/references/re-review-prompt.md:3`, invisibles mientras las dos partes eran copias. Era un desvío de «Dónde se prueba»: parada, el dev-lead pidió dos revisores de la enmienda y uno de ellos cazó que la causa que yo había escrito («`kit:own` no lee las copias») era falsa.
- **Fuente**: `tests/own/repeated.ts:34` → `return (kit(a) || kit(b)) && !(a[0].line.copy && b[0].line.copy);`; spec de la 0307, «Enmiendas» y «Hallazgos de la review»; `node tests/own/check.ts` tras la Task 2.
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 4 (pasada de coherencia) y `.docs/sdd/tech-stack.md`, «Traducir una skill con `kit:own` delante», que no avisaba de esto.
- **Por qué el kit no lo evitó**: la pasada de coherencia comprueba literales contra decisiones, no la salida de una comprobación sobre el texto movido; y el criterio de hecho de la petición («salvo las repetidas con la skill de otra fila») ya era el bueno: lo cambié por un número que inventé.
- **Coste**: una parada del dev-lead y dos revisores (1.458.694 tokens: «Revisor del desvío: dominio» 407.125 y «técnica» 1.051.569, de `sdd session tokens`).
- **Propuesta**: la regla ya va en `tech-stack.md` (aprendizaje de esta feature). En la pasada de coherencia, un criterio de «Dónde se prueba» que da el recuento de una comprobación se escribe con el criterio de la petición o se mide antes sobre un borrador del cambio.
- **Verificada**: sí — contrastado con `tests/own/repeated.ts:34` y con la salida de `node tests/own/check.ts` antes y después de la Task 2.
- **Criterio de aceptación**: GIVEN una spec que mueve texto del kit de una copia a un fichero propio WHEN la pasada de coherencia llega a «Dónde se prueba» THEN el criterio de `kit:own` no fija un número sin medirlo, o nombra las parejas que saldrán.

### 2. K31 se «arregló» con una frase nueva detrás de la absoluta, que el eje Spec dio como Important

- **Qué pasó**: la decisión 4 sustituyó «…not verified, except a Minor no test reproduces» por una frase aparte, sin «except», justo detrás de «Each fix is verified by TDD: write the test…». La absoluta seguía en la frase anterior y la nueva le hacía de excepción, contra la Confirmación de la ADR 0022; además repetía la línea del ledger. `kit:own` no lo ve porque mira la absoluta y la excepción en la misma frase. Lo arregló la pasada de fix reescribiendo la frase de TDD.
- **Fuente**: informe del eje Spec de la revisión final (Important 1) y del eje Código (Minor 1); `.docs/sdd/decisions/0022-three-rules-for-kit-text.md`, regla 3 y «Confirmación»; `.docs/sdd/capabilities/kit-distribution.md`, «Una absoluta con su excepción en la misma frase da rojo».
- **Dónde en el kit**: `tests/own/` (la comprobación de absoluta con excepción) y `skills/sdd-propose/references/spec-writing.md` (cómo se decide una sustitución en ✋).
- **Por qué el kit no lo evitó**: la regla 3 existía y no la apliqué bien: reescribí la frase que llevaba la excepción, no la que llevaba la absoluta. El límite de la comprobación (solo misma frase) lo nombra la propia capacidad.
- **Coste**: un Important, la pasada de fix y una enmienda de la spec sin aprobar (decisión 4).
- **Propuesta**: que la decisión de ✋ que sustituye una excepción pegada cite, antes y después, la frase de la absoluta, no solo la de la excepción; y evaluar si `kit:own` puede avisar de una absoluta seguida, en la frase siguiente del mismo párrafo, de una frase que nombra un caso de su mismo sujeto («a Minor…»).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN «A fix without a test that failed first is not verified. A Minor no test reproduces is verified by the suite.» en un fichero propio WHEN corre `kit:own` THEN avisa de la absoluta con su caso en la frase siguiente (hoy no da nada).

### 3. Un humo con n = 1 sobre una batería de n = 2 exige copiar `tests/batteries/` con junctions

- **Qué pasó**: la spec preveía n = 1 y la tabla de la batería lleva n = 2. `battery.mjs run` no admite cambiar n; la 0312 lo resolvió con una copia de la batería, que solo nombraba en un ruling. Los `subject.mjs` importan `../../headless/` y leen moldes de otras baterías, así que hizo falta copiar `tests/batteries/` entero a `.temp/t7/` y crear junctions a `tests/headless` y `build`; al borrarla, las junctions hay que quitarlas antes una a una para no vaciar sus destinos.
- **Fuente**: `tests/headless/battery.mjs` (variables leídas: `BATTERY`, `BATTERY_DIR`, `SCENARIOS`, `STEPS`, `SUBJECT_CAP`…, ninguna de n); `tests/batteries/sdd-verify/subject.mjs:7-12`; `tasks.md` de la 0312, ruling de la Task 4.
- **Dónde en el kit**: `tests/headless/battery.mjs`, `run`.
- **Por qué el kit no lo evitó**: no hay forma de bajar n por escenario sin copiar la batería.
- **Coste**: ~10 min de búsquedas y montaje, y el riesgo de borrar `tests/headless` por la junction (evitado).
- **Propuesta**: una variable `N=<n>` en `battery.mjs run` que sustituya n y umbral (`<n>/<n>`) de los escenarios filtrados. Mientras tanto, la receta queda en `tech-stack.md`, «Baterías por skill».
- **Verificada**: sí — reproducido en esta sesión con PowerShell 7: sin copia, la tabla lanza 2 sujetos por escenario.
- **Criterio de aceptación**: GIVEN la batería de `sdd-verify` con `c1` a n = 2 WHEN `N=1 SCENARIOS=c1 node tests/headless/battery.mjs run` THEN lanza un sujeto y el veredicto es `c1 · 1/1 · umbral 1/1`.

### 4. Lo que la feature deja para la 0311

- **Qué pasó**: tras la 0307, `kit:own` da tres frases nuevas de `sdd-verify` repetidas con la skill de otra fila: «if the line says juntada en el cierre the closing» (`sdd-archive/SKILL.md:24`, 0305), «the what to check of the axes that went out» (`sdd-implement/references/re-review-prompt.md:3`, 0296) y «out in the background as soon as the last task's» (`sdd-implement/SKILL.md:314`, 0296). Y el bloque literal del encargo que recibe cada revisor (`## Restricciones de código`, `## Cómo revisar`) sigue en castellano en seis encargos de `sdd-implement` y `sdd-verify`, en choque con «Idioma de los nombres» de `verification` («los encargos de los ejes en inglés»): traducirlo solo en `sdd-verify` habría dejado cabeceras distintas, y la 0296 estaba partiendo `sdd-implement`.
- **Fuente**: `node tests/own/check.ts` sobre `f751bb4a`; spec de la 0307, decisión 8; `.docs/sdd/capabilities/verification.md:227`.
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md`, `encargo-revision.md` y los `*-reviewer-prompt.md`; `skills/sdd-implement/references/*-prompt.md`.
- **Por qué el kit no lo evitó**: es deuda prevista: las frases repetidas entre filas van a la 0311 (revisión del roadmap, 2026-11-05).
- **Coste**: ninguno en esta sesión.
- **Propuesta**: que la 0311 cuente estas tres frases (de 8 a 11) y traduzca el bloque del encargo en los seis encargos a la vez, con sus citas en `sdd-implement/SKILL.md` y en `verification`.
- **Verificada**: sí — `node tests/own/check.ts` sobre `f751bb4a`.
- **Criterio de aceptación**: GIVEN la 0311 cerrada WHEN corre `kit:own` THEN no da esas tres frases, y `grep -rn "Restricciones de código" skills/` no devuelve nada.

## Lo que hice por iniciativa propia

- Rebatí al arrancar el alcance literal «traducir `encargo-revision.md`» para no tocar el bloque compartido con `sdd-implement` (hallazgo 4); el dev-lead lo aprobó con la spec.
- Compuse los encargos de los ejes y de la re-revisión con un script en el scratchpad que extrae el bloque `prompt: |` del `*-reviewer-prompt.md` de `dist/` y rellena sus huecos, y comprueba que no quedan sin rellenar. Funcionó; el kit no trae un `compose` para el hilo (los de las baterías son para sujetos).

## Funcionó, no tocar

- El aviso de `kit:copies` «la marca sustituye «S», y el bloque quita «…»» da la S exacta: tres de las cuatro marcas de `sdd-tdd` salieron a la primera, y la cuarta con el texto del aviso.
- Los sujetos `c1` y `c1f` abrieron `references/closing-the-review.md` nada más cargar `sdd-verify`: el puntero como primera frase del paso basta.
- Los dos revisores de la spec y los dos de la enmienda cazaron fallos reales; el técnico de la enmienda comprobó la causa en el código y la desmintió.

## Menores

- `sdd task done … -- node tests/copies/check.ts` no sirve como verificación de una task: sale con 1 por los `sin anotar` de otras filas; usé los Vitest de la task — `tests/copies/check.ts`.
- La fila «Suma» de «Previsión de coste» con «4 a 8» no la lee el lanzador («sin previsión legible… escribe el total en la fila Suma»); hizo falta `SUBJECT_CAP` — `skills/sdd-templates/templates/spec-template.md`, «Previsión de coste».
- `closing-the-review.md:37` cuenta «<n> hallazgos RED→GREEN» en `Pasada de fix:`, aunque «Native» admite Minors arreglados sin test (Minor diferido de la re-revisión) — `skills/sdd-verify/references/closing-the-review.md`.
- `tests/batteries/sdd-verify/compose-axis.mjs:24` y `tests/batteries/sdd-implement/compose.mjs:24` leen `encargo-revision.md` por la ruta de un kit 2.x (`skills/sdd-start-feature/`), una rama muerta para el kit actual (eje Código) — esos dos ficheros.
