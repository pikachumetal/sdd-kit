---
kit_version: 3.0.1
lane: feature
id: 20261118-175613-feature-0349-critical-path-rule
task: 0349
mode: full
date: 2026-11-18
---

# Ticket para el kit — feature 0349: la regla del camino crítico en plantillas, `sdd-tdd`, `sdd-verify` y `sdd-archive`

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-grilling` (no hubo preguntas), `sdd-parallel-agents`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown, CLI en Node, baterías de sujetos headless)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (dominio de la spec, eje Spec, re-revisión) y Sonnet (técnica de la spec, segunda ronda, eje Código, sujetos)
- Coste en reloj: ~3 h frente a 6 h estimadas, aproximado con los commits (sin medir: hallazgo 4)
- Coste en tokens: no medido (hallazgo 4); sujetos ~10,3 $ en 31

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Saltarse por ruling la «Verificación» del plan abrió la pasada de fix más cara

- **Qué pasó**: en la Task 5 dejé por ruling tres mediciones que el plan pedía: el segundo turno tras la pregunta de la fila (el borrado completo) y los controles `e1` y `g5`. La revisión final las devolvió como Important (eje Spec 2, 4 y 8) y la pasada de fix tuvo que lanzarlas.
- **Fuente**: `plan.md` de la 0349, Task 5, «Verificación» (`SCENARIOS="cp4 cp5 e1 g5"`); ledger, líneas «Task 5: Ruling: el borrado tras la respuesta… no se mide» y «sin controles e1 y g5»; walkthrough §3.
- **Dónde en el kit**: `skills/sdd-implement-native/SKILL.md`, «The completion contract» y «Rulings, not stalls».
- **Por qué el kit no lo evitó**: el contrato pide comparar cada `Expected:` y correr la «Verificación», pero «Rulings, not stalls» deja decidir sin parar, y un ruling que recorta la «Verificación» no se distingue de uno que resuelve un conflicto del plan.
- **Coste**: una tanda más de sujetos (~1,6 $) y una ronda de revisión con 9 Important del eje Spec; causa en el walkthrough §3 y en el commit de cierre `70bef5e86`.
- **Propuesta**: en «The completion contract», una línea: un comando de la «Verificación» del plan no se sustituye por un ruling; si no se puede correr, es un desvío y para.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una task cuya «Verificación» nombra cuatro escenarios, uno de ellos caro, WHEN el hilo la cierra en Native, THEN corre los cuatro o para como desvío, y no escribe `Ruling:` que los quite.

### 2. Los topes de palabras salieron al commitear, no en la spec

- **Qué pasó**: el pre-commit rechazó tres veces por topes que «Topes de palabras» de la spec no listaba o subestimaba: `PRODUCT.md` (1.869 / 1.799) y `architecture.md` (4.933 / 4.877) en la Task 1, y `sdd-archive` (9.992 / 9.904) en la Task 5 y otra vez en la pasada de fix. Cada recorte posterior a la medición pidió un sujeto de control.
- **Fuente**: salida de `pnpm exec vitest run test/kit/word-budget.test.ts` («mide 1869 y el tope es 1799», «mide 9992 y el tope es 9904»); ledger, rulings de Task 1 y Task 5.
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Topes de palabras», y `skills/sdd-propose/references/coherence-pass.md`.
- **Por qué el kit no lo evitó**: la regla existía («una fila por fichero con tope que la spec edita») y no la apliqué a `PRODUCT.md` ni a `architecture.md`; en `sdd-archive` previ ~200 palabras y escribí ~320. Nada mide lo previsto contra el tope antes del gate.
- **Coste**: ~25 min de recortes y un sujeto de control (~0,5 $); respaldo en el ledger.
- **Propuesta**: que el repaso de coherencia corra `word-budget.test.ts` sobre el árbol y liste los ficheros de su tabla con tope que el Scope nombra.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuyo Scope edita `PRODUCT.md`, con tope, WHEN pasa el repaso de coherencia, THEN «Topes de palabras» lleva su fila con lo medido y lo previsto.

### 3. Un molde de cierre incoherente obligó a repetir el RED

- **Qué pasó**: el primer RED de `cpt4` y `cpt5` puso los tests de feature en un commit posterior a la revisión final, y la 0010 del molde renombraba el E2E de la lista; los sujetos los trataron como ajenos. Hubo que rehacer el molde y repetir el RED.
- **Fuente**: ledger, «Task 5: RED cpt4/cpt5… molde incoherente» (3,46 $); `red-molde1/` de la carpeta de la 0349.
- **Dónde en el kit**: `.docs/sdd/steering/operations.md`, «Baterías por skill», «El texto que planta un molde tiene que ser cierto en el molde».
- **Por qué el kit no lo evitó**: la regla existía (feature 0236) y no la apliqué: no se lee al montar un molde nuevo.
- **Coste**: 3,46 $ y ~12 min; respaldo en el ledger.
- **Propuesta**: que `battery.mjs run` avise, antes del primer sujeto, si el molde deja commits posteriores a la línea `Revisión final:` de `tasks.md`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un molde de `sdd-archive` con un commit posterior al de `tasks.md` con la revisión final, WHEN se lanza su escenario, THEN `battery.mjs` avisa antes del primer sujeto.

### 4. `sdd session tokens` no mide una sesión que trabaja en otro worktree

- **Qué pasó**: la sesión corrió desde el checkout de `develop` y trabajó en el worktree de la feature. `sdd session tokens --path <worktree>` dio «no medido (sin transcripts…)», y con `--path` del checkout mezcló 9 sesiones de otras features (157,70 h).
- **Fuente**: salida de `node dist/cli/bin/sdd.js session tokens --path . --branch feature/0349-critical-path-rule --artifact <carpeta>` y de la misma con `--path D:/code/git/sdd-kit --branch develop`.
- **Dónde en el kit**: `cli/src` de `sdd session tokens`; `skills/sdd-archive/SKILL.md` paso 2, «Real time».
- **Por qué el kit no lo evitó**: la CLI busca los transcripts por la ruta del worktree, no por la carpeta del artefacto que la sesión tocó.
- **Coste**: el walkthrough sin tiempo ni tokens medidos.
- **Propuesta**: que `session tokens` busque también los transcripts que citan la ruta del artefacto, sea cual sea el directorio de la sesión.
- **Verificada**: sí — reproducido con los dos comandos de «Fuente» en Git Bash.
- **Criterio de aceptación**: GIVEN una sesión arrancada en el checkout principal que commitea en un worktree enlazado, WHEN se corre `sdd session tokens --path <worktree> --artifact <carpeta>`, THEN da el reloj y los tokens de esa sesión y no de otras.

## Lo que hice por iniciativa propia

- Componer los encargos de los ejes de la revisión final y de la re-revisión con un script (`.temp/sdd/plan/compose-briefs.mjs`), que calca el bloque `prompt: |` de cada plantilla y rellena sus huecos: candidato a un `sdd review brief <eje>` en la CLI.

## Menores

- Dos veces se perdieron las barras invertidas al escribir filas de rúbrica con `node -e` desde Bash; `operations.md` ya pide las herramientas de edición para texto con escapes.
