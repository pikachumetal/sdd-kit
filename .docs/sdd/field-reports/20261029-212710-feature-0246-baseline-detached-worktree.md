---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261029-190601-feature-0246-baseline-detached-worktree
task: 0246
mode: full
date: 2026-10-29
---

# Ticket para el kit — feature 0246: la línea base en un worktree desanclado y el Important que mete la pasada de fix

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo, Native
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-debugging`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código y 19 sujetos de campaña)
- Coste en reloj: 1,86 h frente a 3 h estimadas
- Coste en tokens: 91.266.220 del hilo y 5.442.242 de subagentes; 30,14 $ de sesión más 8,30 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El gate de cierre salió rojo por un puerto que Windows tiene reservado, y el test esconde el error

- **Qué pasó**: el gate de cierre dio `kit:test-headless` 246/247. El test rojo era `test/kit/headless/molds.test.ts` > «sdd-archive construye en seco el molde reservas-e2e-stale (e1)», con `AssertionError: [e1-1] no arrancó el servidor ajeno`. El mismo test pasó en la línea base, horas antes, y también falló en el commit de apertura. La causa solo apareció al lanzar a mano el `server.mjs` del molde montado (`DRY_RUN=1 KEEP_MOLD=1`): `Error: listen EACCES: permission denied 0.0.0.0:4456`. `netsh interface ipv4 show excludedportrange protocol=tcp` daba como reservados los puertos 3998-4597, y el molde elige `E2E_PORT` al azar entre 4300 y 4899. Solo, el test dio 1 rojo y 2 verdes en la rama, y 2 rojos y 1 verde en `develop`.
- **Fuente**: walkthrough de la 0246 §4.1; fila «Intermitente: el molde `reservas-e2e-stale` elige un puerto que Windows tiene reservado» de `roadmap.md` (Deuda técnica); `tests/batteries/sdd-archive/subject.mjs:82` (`E2E_PORT`) y `:103` (`spawnSync(... env-up.mjs ..., { stdio: 'ignore' })`).
- **Dónde en el kit**: `tests/batteries/sdd-archive/subject.mjs`, `staleServer()` y la elección de `E2E_PORT`.
- **Por qué el kit no lo evitó**: el puerto se elige al azar en un rango fijo, sin comprobar que se pueda abrir, y `stdio: 'ignore'` tira el `EACCES` que dice la causa.
- **Coste**: ~20 min de depuración y tres contrastes (rama, commit de apertura, `develop`), según el walkthrough §4.1; una fila de deuda nueva.
- **Propuesta**: que el molde pida el puerto al sistema (`listen(0)` y leer el que asigna) o salte los rangos reservados, y que `staleServer()` deje en el `s.die` la salida de `env-up.mjs` en vez de ignorarla.
- **Verificada**: sí — reproducido con `node server.mjs` en el `stale-env` del molde montado, en Git Bash → `Error: listen EACCES: permission denied 0.0.0.0:4456`.
- **Criterio de aceptación**: GIVEN una máquina con los puertos 3998-4597 reservados WHEN `molds.test.ts` monta `reservas-e2e-stale` diez veces seguidas THEN las diez pasan; y si `env-up.mjs` falla, el mensaje del test incluye su error.

### 2. Califiqué la misma fila de la rúbrica distinto en el RED y en el GREEN

- **Qué pasó**: en `c8`, el segundo Important del molde (`canceladas` vacío) solo se arregla añadiendo un texto visible, y eso ya es un desvío. En el RED, un sujeto paró como desvío y lo puntué como fallo de `C8`. En el GREEN, otro sujeto hizo lo mismo con la línea escrita como `Final: Ruling:` y lo puntué como pase. El eje Spec de la revisión final lo cazó como Important («el 2/2 es 1/2 en sustancia»). La pasada de fix relajó la rúbrica, y esa relajación metió a su vez un Important nuevo (N1) que vio la re-revisión: un arreglo silencioso ya no fallaba. Ese arreglo llegó al merge `sin revisar`.
- **Fuente**: `tasks.md` de la 0246 (líneas `Pasada de fix:`, `Re-revisión:` y `Arreglo de la re-revisión:`); `tests/fix-pass-effect-red.md` (`C8` recalificado a 1/2); walkthrough §3.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md:107` («Cada sujeto se califica con la rúbrica escrita, literal, y fila por fila»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Además, el molde daba al sujeto dos salidas válidas (adjudicar o parar como desvío), y la rúbrica nombraba solo una.
- **Coste**: un Important del eje Spec, un Important de la re-revisión, un commit `sin revisar` en el merge y 0,61 $ de control (walkthrough §2 y §3).
- **Propuesta**: en `tech-stack.md`, «Baterías por skill», sustituir la regla literal por una más corta y en el paso donde se decide. Antes de lanzar el RED, una fila cuyo hallazgo admite más de una salida correcta (adjudicar o parar como desvío) las nombra todas, y se califica con la misma fila en RED y GREEN.
- **Verificada**: sí — contrastado con `tests/batteries/sdd-verify/battery.md`, fila `C8` en `40c72058` frente a la del merge.
- **Criterio de aceptación**: GIVEN un molde cuyo segundo hallazgo solo se arregla con un THEN nuevo WHEN se escribe su fila antes del RED THEN la fila nombra las dos salidas válidas, y un sujeto que arregla en silencio falla tanto en el RED como en el GREEN.

### 3. Dos reglas pedidas por el campo salieron limpias en el RED, que la spec había dejado para después

- **Qué pasó**: la spec dejó sin medir con sujetos, antes de presentarse, dos frentes de conducta: el test de la pasada afirma el efecto (dos casos de campo) y el valor del arreglo sale de la spec (tres casos de campo). Era una desviación explícita de `tech-stack.md`, apuntada en su decisión 8. Las dos salieron limpias en la Task 2: `c7` 1/1 válido, `t6` 1/1 y `c9` 2/2. Hizo falta una parada del dev-lead y un segundo RED de `c7` sobre un molde endurecido, que salió 2/2 limpio. La spec acabó con dos enmiendas que quitaban dos de sus cuatro requisitos.
- **Fuente**: spec de la 0246, decisión 8 y «Enmiendas»; `tests/fix-pass-effect-red.md`; walkthrough §2 (RED de `c7`, `c8`, `c9` y `t6`, 3,79 $; RED de `c7` endurecido, 0,58 $).
- **Dónde en el kit**: `.docs/sdd/tech-stack.md:81` («cada frente se reproduce antes de presentar la spec»), y `skills/sdd-propose/SKILL.md` paso 4, que no lo nombra.
- **Por qué el kit no lo evitó**: la regla existía, pero vive en `tech-stack.md`, lejos del paso donde se escribe la spec. La salté por coste y lo dije en ✋, y el dev-lead lo aprobó.
- **Coste**: una parada del dev-lead, dos enmiendas de la spec y ~1,6 $ de sujetos en la parte del RED que tiró las dos reglas (`c7`, `c9`, `t6` y `c7` endurecido), según el walkthrough §2.
- **Propuesta**: que la regla viva en el paso 4 de `sdd-propose`, el que escribe la spec, y que salga de `tech-stack.md`, para no alargar ninguna skill. Su texto: en una feature del kit que trae frentes de conducta de campo, un sujeto por frente antes de la spec. Alternativa: aceptar que estos frentes se miden en su task, y que el triaje del roadmap pida un RED antes de convertir dos o tres casos de campo en fila.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una fila del roadmap que trae una regla de conducta con dos casos de campo WHEN `sdd-propose` escribe la spec THEN el ✋ trae el veredicto de un sujeto RED por frente, o la spec no incluye la regla.

### 4. Con un rojo, la línea base repite en la rama de integración sin preparar ese worktree

- **Qué pasó**: la re-revisión señaló (N6) que el reintento de la línea base en un worktree desanclado de la rama de integración no corre el paso 2 (dependencias, `env:setup`). En `w3`, el sujeto no ejecutó `env:setup` en `../baseline-dev`. En un proyecto con dependencias, el reintento sale rojo por `Cannot find module` y da en falso el veredicto «no es de esta rama». El hueco es anterior a la feature, y lo adjudiqué con ruling por falta de saldo de palabras.
- **Fuente**: `tasks.md` de la 0246, `## Rulings` (N6); `skills/sdd-worktrees/SKILL.md:134`; walkthrough §3.
- **Dónde en el kit**: `skills/sdd-worktrees/SKILL.md` paso 3, «If tests fail».
- **Por qué el kit no lo evitó**: el paso dice «run it again in a worktree detached at the integration branch, removed likewise» sin nombrar el paso 2.
- **Coste**: ninguno observado; un ruling.
- **Propuesta**: «… detached at the integration branch, Step 2 there, removed likewise», pagado con otra frase del paso.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `w3` sobre un molde con una dependencia de `package.json` WHEN la línea base sale roja en la rama THEN el reintento en la integración instala las dependencias antes del gate y sale verde.

## Lo que hice por iniciativa propia

- Corrí la línea base de esta misma feature en un worktree desanclado en el commit de apertura antes de que la regla existiera (`kit:test-headless` 247/247, `cli:test` 1664/1676). Funcionó: la sesión escribía moldes a la vez sin tocarla.
- Extraje el RED de cada campaña con `git archive` del commit de apertura a una carpeta fija, y el GREEN con `git stash create` + `git archive`. Así los dos brazos se miden con un kit congelado mientras el árbol sigue cambiando. Funcionó.
- Generé en `subject.mjs` los ficheros del molde que el repo no admite (scripts de bash, un test truncado) en vez de dejarlos en `fixtures/`, porque `no-shell-scripts.test.ts` los habría rechazado.

## Funcionó, no tocar

- La revisión final en ejes con su pasada de fix y una sola re-revisión: el eje Spec cazó la calificación desigual y la re-revisión cazó el Important que metió la propia pasada. La regla nueva de la feature («an Important the fix pass brought in … is never adjudicated») se aplicó a sí misma en el cierre.
- El contraste del rojo en la base (paso 6 de `sdd-archive`): separó en minutos un rojo de la máquina de uno de la rama.

## Menores

- `SUBJECT_CAP` cuenta toda la campaña, RED incluido: el primer GREEN se cortó con «techo de 3 sujetos alcanzado» y solo corrió `w1` — `tests/headless/campaign.mjs:145`.
- El primer RED salió con 0 sujetos porque `KIT_DIR` apuntaba al worktree («la copia del kit lleva .docs/ o tests/»): el mensaje ya dice `git archive`, pero `tech-stack.md` no lo nombra junto a `KIT_DIR` — no localizado en la guía.
- Un `` `t `` dentro de una cadena con comillas dobles de PowerShell metió un tabulador en la spec, y lo cazó el eje Spec. `tech-stack.md:44` ya dice que el texto con escapes se escribe con las herramientas de edición — la regla existía y no la apliqué.
- El paso `closing` de la batería de `sdd-verify` agrupa `c1`-`c5`: no se puede lanzar `c5` solo como control, y quedó sin correr (ruling) — `tests/batteries/sdd-verify/battery.md`.
