---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261027-160700-feature-0227-behavior-tests-to-vitest
task: 0227
mode: full
date: 2026-10-27
---

# Ticket para el kit — feature 0227: los Pester de conducta pasan a Vitest

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit (plugin de Claude Code, CLI en TypeScript con Vitest y moon), con cuatro ramas cerrando el mismo día en worktrees
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: eje Spec opus+high, eje Código sonnet+high y re-revisión opus+high
- Coste en reloj: 4,66 h frente a 4,5 h estimadas (medido antes del último gate; el cierre siguió ~2 h más, casi todas en la cola del cerrojo)
- Coste en tokens: 97.206.016 del hilo + 9.668.548 de subagentes, 42,20 $ (medido antes del último gate)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La cola del cerrojo de suites convierte cada gate en media hora o más, y se repite

- **Qué pasó**: con la 0221, la 0222, la 0226 y la 0227 cerrando a la vez, cada tarea lenta del gate esperó a la que tenía `sdd-tests.lock`. Las cifras de reloj frente a las de tests:
  - `kit:test`: 29 min 19 s para 31 s de tests;
  - `kit:test-headless`: 52 min 22 s para 739,5 s, y 30 min 26 s en el gate final;
  - `cli:test-min`: 20 min 19 s.

  El gate se corrió cuatro veces: la línea base, el cierre, tras `sdd merge --sync` y tras el merge con la 0226, que entró mientras tanto. No hubo interbloqueo, pero el dev-lead vio dos sesiones «esperando» y pensó que se esperaban la una a la otra. La 0221 cedió el turno a mano por `SendMessage`.
- **Fuente**: la fila de deuda «El cerrojo de suites hace cola entre ramas que cierran a la vez…» de `.docs/sdd/roadmap.md` (commit `f684d6c9`), con las cifras de los logs de la sesión; `walkthrough.md` §4.1 de la feature.
- **Dónde en el kit**: `cli/src/lock/` (`sdd lock run`, patch 0218), `moon.yml` y `cli/moon.yml` (cada tarea lenta pide el cerrojo por separado), y `skills/sdd-archive/SKILL.md`, paso 6 (repetir la suite tras integrar la base).
- **Por qué el kit no lo evitó**: el cerrojo ordena, pero no da turno por rama ni muestra la cola. El paso 6 repite la suite entera cada vez que la base trae código, aunque lo traído ya pasó su propio gate.
- **Coste**: ~2 h de reloj de cierre esperando (sin respaldo exacto: es la suma de los «running for» de los logs); dev-lead: «eso es crítico».
- **Propuesta**: un turno por rama para el gate entero, no por tarea. `sdd lock run` debe imprimir la posición en la cola y quién va delante. Con otra rama a punto de fusionar, la segunda no corre su gate hasta que la primera fusione: es la ya prevista en la 0221 («integrar la base antes de la primera suite»).
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN dos ramas que lanzan `moon run kit:test kit:test-headless cli:typecheck cli:test-min` a la vez WHEN la primera termina una tarea THEN la segunda no le quita el cerrojo hasta que la primera acaba su gate entero, y cada espera imprime su posición.

### 2. Los tests del lanzador en Vitest caen por tiempo con la máquina cargada

- **Qué pasó**: en los tres gates con suites de otras ramas corriendo, `kit:test-headless` dio 78/81, 80/81 y 78/81. Fallaron dos tests de `battery`:
  - con el tope de 120 s de Vitest (`Error: Test timed out in 120000ms.`);
  - con `pwd: write error: Bad file descriptor` en `lib.sh:27`, el mismo error de MSYS que la 0223 vio en el Pester.

  También fallaron `SUBJECT_TIMEOUT` (`expected 80.226 to be less than 40`) y uno de `ports`. Repetidos solos, 20/20 y 10/10. Antes, con tubería en vez de fichero, se perdían a ratos las últimas líneas de `run.sh` (2 de 3 pasadas).
- **Fuente**: las dos filas «Por triar» del roadmap de la 0227 («Tres tests del lanzador en Vitest…» y «`merge/cleanup.slow.test.ts` falla a ratos…») y el ruling de `runBash` en `tasks.md`.
- **Dónde en el kit**: `cli/test/kit/headless/*.slow.test.ts` y `tests/headless/lib.sh` (los `$(pwd)` bajo carga).
- **Por qué el kit no lo evitó**: Pester no tenía tope por test, y Vitest sí. Los umbrales de tiempo del Pester (40 s) no cuentan con la carga de las suites ajenas.
- **Coste**: dos gates repetidos y dos contrastes, ~1 h (sin respaldo exacto).
- **Propuesta**: tope por test propio, más alto, para los tests del lanzador que lanzan muchos sujetos (`using-sdd`: 16). `lib.sh` reintenta o evita `$(pwd)` en las rutas calientes. Esto se resuelve junto con el hallazgo 1: sin suites ajenas a la vez, la carga baja.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN otra suite lenta corriendo WHEN corre `kit:test-headless` THEN 81/81.

### 3. Un conflicto de base que la spec aprobada ya resolvía obligó a parar

- **Qué pasó**: la decisión 13 de la spec decía «el cierre que llegue segundo junta las dos listas» de `testInputs`, pero `merge-recipe.md` manda que un `base: conflicto en` lo resuelva una persona. Paré y pregunté, y el dev-lead respondió «Resuélvelo tú».
- **Fuente**: `skills/sdd-archive/references/merge-recipe.md:10` y `:45`; `spec.md`, decisión 13.
- **Dónde en el kit**: `skills/sdd-archive/references/merge-recipe.md`, «`base: conflicto en`».
- **Por qué el kit no lo evitó**: la receta no tiene salida para un conflicto que la spec aprobada ya decidió.
- **Coste**: una parada del dev-lead en medio de una espera larga, ~5 min.
- **Propuesta**: si la spec aprobada nombra el fichero en conflicto y cómo se junta, el agente lo resuelve, lo registra en el commit del merge y lo lleva a ✋ como «sin revisar».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec cuya decisión dice cómo juntar `cli/moon.yml` con otra rama WHEN `sdd merge --sync` da `base: conflicto en cli/moon.yml` THEN el agente lo resuelve sin preguntar y el walkthrough lo dice.

### 4. Un volcado de depuración copió un token del entorno al scratchpad y al transcript

- **Qué pasó**: para depurar un control del pre-commit volqué todas las variables cuyo nombre empieza por `GIT`. Entre ellas venía un token personal de GitHub (`GITHUB_PERSONAL_ACCESS_TOKEN`), que quedó en un fichero del scratchpad y en la salida de la herramienta. Borré el fichero y avisé al dev-lead para que lo rote. No llegó a ningún commit.
- **Fuente**: la sesión; el aviso está en el mensaje al dev-lead de la Task 3.
- **Dónde en el kit**: `skills/sdd-debugging/SKILL.md` (no localizado: no tiene regla sobre volcar el entorno).
- **Por qué el kit no lo evitó**: ninguna regla dice que un volcado de variables se filtra por nombre exacto.
- **Coste**: un secreto en el transcript; rotarlo es del dev-lead.
- **Propuesta**: en `sdd-debugging`, «para ver variables de entorno, nombra las que necesitas (`GIT_DIR`, `GIT_INDEX_FILE`…); nunca vuelques un prefijo ni el entorno entero».
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un sujeto que depura un hook de git WHEN necesita ver su entorno THEN imprime solo las variables que nombra.

### 5. Escribir texto con barras invertidas desde un script de Node corrompió el roadmap

- **Qué pasó**: una fila con rutas de Windows, escrita desde un `node -e`/heredoc, perdió las barras: `\f` de `\feature` acabó como salto de página. Además, el diff mostró el fichero entero cambiado. Lo rehíce desde la versión de HEAD, con el texto en un fichero escrito por la herramienta de escritura. Pasó dos veces más con `old_string` escapados en scripts de reemplazo.
- **Fuente**: la sesión; `tech-stack.md`, «Un script de Python en un heredoc de Git Bash que escribe código con escapes los rompe» (feature 0144).
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Cómo se testean las skills»: la regla existe solo para Python y para código.
- **Por qué el kit no lo evitó**: la regla nombra Python y código; la apliqué como si no valiera para Node ni para texto de documentos.
- **Coste**: ~15 min y un roadmap roto, recuperado antes de commitear.
- **Propuesta**: generalizar la regla: «texto con escapes (código, rutas de Windows) se escribe con la herramienta de edición, nunca dentro de un script en un heredoc, sea del lenguaje que sea».
- **Verificada**: sí: reproducido en la sesión (`grep -o "git push -q.\{0,60\}"` mostró `D:code.worktreessdd-kiteature-…`).
- **Criterio de aceptación**: GIVEN una fila con `D:\code\.worktrees\…` que añadir al roadmap WHEN el agente la escribe THEN `grep -F` encuentra la ruta literal.

## Lo que hice por iniciativa propia

- Cotejo de nombres `It` → `it` con un script desechable contra `develop`, en vez de una tabla de 170 filas en el plan. Funcionó: el eje Spec lo repitió por su cuenta y salió igual.
- RED real del control del commit: commit con una fuga staged, deshecho después. Destapó dos fallos que la revisión no habría visto: el control fallaba en abierto si git fallaba, y moon lo saltaba por la caché.
- Coordinarme con la otra rama por `SendMessage` para ceder o tomar el cerrojo.

## Funcionó, no tocar

- La línea «Política de modelos» de la spec como confirmación de los despachos en paralelo: los ejes salieron sin volver a preguntar.
- `validation.mode: field`: el cierre no paró a pedir validación.
- La re-revisión única, acotada a los hallazgos y al diff del fix.

## Menores

- `sdd task done` registró la Task 4 con el rango hasta el commit de la Task 5, porque su verificación esperaba el cerrojo — `skills/sdd-implement/SKILL.md`, Native loop, paso 4.
- Tras el cuelgue del PC, el gate en segundo plano no dejó rastro y hubo que relanzarlo; «Recovery» de `sdd-implement` no cubre el cierre — `skills/sdd-implement/SKILL.md`, «Recovery».
- Tras reanudar, la sesión cargó las skills de la caché (avisó el hook) y seguí las de la rama con `Read` — `CLAUDE.md` del repo, regla 1.
